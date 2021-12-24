const router = require('express').Router();
const client = require('./bot');
const User  = require('../model/user');
const states = require('./state');

const messages = require('./messages');

router.post('/', async function(req, res){
    for(const event of req.body.events) {
        // step 01: check message format 
        //      -> only react to message event
        //      -> only reply to text message event
        if(event.type !== "message") continue;
        if(event.message.type !== "text") {
            client.replyMessage(event.replyToken, {
                type: "text",
                text: "Please Only Input Text"
            })
                .catch(error => console.log(error));
            continue;
        }
        // step 02: Create session using mongo-db
        const userId = event.source.userId;
        const data = await User.find({id: userId});
        let user = null;
        if(data.length === 0) {
            user = new User({
                id: userId,
                todoList: [],
                state: states.toDoInit
            });
            user.save();
        }else {
            user = data[0];
        }
        // step 03: trainsition function(userData, event) -> reply message and change state.
        //  every state have a trainsition function to handle arrow out events.
        switch(user.state) {
            case states.toDoInit: 
                handleStateTodoInit(user, event);
                break;
            case states.toDoInsert: 
                handleStateTodoInsert(user, event);
                break;
            case states.toDoDelete:
                handleStateTodoDelete(user, event);
            case states.toDoUpdateRequest: 
                handleStateTodoUpdateRequest(user, event);
                break;
            case states.toDoUpdateReply:
                handleStateTodoUpdateReply(user, event);
                break;
        }
    }
    res.status(200).json();
});

/**
 *  Transition Functions 
 */

// state 1: four arrow out
async function handleStateTodoInit(user, event) {
    switch(event.message.text) {
        case "Add To do":
            client.replyMessage(event.replyToken, {
                type: "text",
                text: "What is new To do Title ?"
            });
            user.state = states.toDoInsert;
            user.save();
            break;
        case "Read To do List":
            if(user.todoList.length === 0)  {
                await client.replyMessage(event.replyToken, {
                    type: "text",
                    text: "To Do List is empty !!"
                })
                return;
            }
            await client.pushMessage(user.id, messages.generateReadMessgae(user.todoList))
            await client.pushMessage(user.id, messages.wellcomeMessage);
            break;
        case "Change Content":
            if(user.todoList.length === 0) {
                await client.replyMessage(event.replyToken, {
                    type: "text",
                    text: "To Do List is empty !!"
                })
                break;
            }
            await client.replyMessage(event.replyToken, {
                type: "text",text: "Which one to Update?"
            })
            await client.pushMessage(user.id, messages.generateReadMessgae(user.todoList))          
            user.state = states.toDoUpdateRequest;
            user.save();
            break;
        case "Delete To do":
            await client.replyMessage(event.replyToken, {
                type: "text",
                text: "Which one to Delete?"
            })
            await client.replyMessage(event.replyToken, {
                type: "text",text: "Which one to Delete?"
            })
            await client.pushMessage(user.id, messages.generateReadMessgae(user.todoList))
            user.state = states.toDoDelete;
            user.save();
            break;
        default:
            client.pushMessage(user.id, messages.wellcomeMessage);
            break;
    }
}
// state 2: one arrow out
async function handleStateTodoInsert(user, event) {
    const newTodoItem = event.message.text;
    user.todoList.push(newTodoItem);
    user.state = states.toDoInit;
    user.save();
    await client.replyMessage(event.replyToken, {
        type: "text", text: "Success add new to do item "
    });
    await client.pushMessage(user.id, messages.wellcomeMessage);
}
// state 3: two arrow out
async function handleStateTodoDelete(user, event) {
    const index = Number(event.message.text); 
    if(isNaN(index)) {
        await client.replyMessage(event.replyToken, {
            type: "text", text: "Please Input Correct Index."
        });
        return;
    }
    if(index >= user.todoList.length) {
        await client.replyMessage(event.replyToken, {
            type: "text", text: "Index too big. Please Input Correct Index."
        });
        return;     
    }
    user.todoList = [
        ...user.todoList.slice(0,index), 
        ...user.todoList.slice(index + 1, user.todoList.length)
    ];
    user.state = states.toDoInit;
    user.save();
    await client.replyMessage(event.replyToken, {
        type: "text", text: "Success delete to do item "
    });
    await client.pushMessage(user.id, messages.wellcomeMessage);
    return;
}

//state 4 : two arrow out
async function handleStateTodoUpdateRequest(user, event) {
    const index = Number(event.message.text); 
    if(isNaN(index)) {
        await client.replyMessage(event.replyToken, {
            type: "text", text: "Please Input Correct Index."
        });
        return;
    }
    if(index >= user.todoList.length) {
        await client.replyMessage(event.replyToken, {
            type: "text", text: "Index too big. Please Input Correct Index."
        });
        return;     
    }
    user.updateIndex = index ; 
    user.state = states.toDoUpdateReply;
    user.save();
    await client.replyMessage(event.replyToken, {
        type: "text", text: "What is new content "
    });
}

async function handleStateTodoUpdateReply(user, event) {
    const newTodoItem = event.message.text;
    user.todoList[user.updateIndex] = newTodoItem;
    user.state = states.toDoInit;
    user.save();
    await client.replyMessage(event.replyToken, {
        type: "text", text: "Success change to do item "
    });
    await client.pushMessage(user.id, messages.wellcomeMessage);
}

module.exports = router;
