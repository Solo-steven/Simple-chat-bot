
const wellcomeMessage = 
{
    "type": "flex",
    "altText": "this is a flex message",
    "contents":{
        "type": "bubble",
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
            {
                "type": "text",
                "text": "Hello, Welcome to using this App.",
                "flex": 2,
                "align": "center"
            },
            {
                "type": "button",
                "action": {
                    "type": "message",
                    "text": "Add To do",
                    "label": "Add To do"
                },
                "margin": "12px"
            },
            {
                "type": "button",
                "action": {
                    "type": "message",
                    "label": "Read To do List",
                    "text": "Read To do List"
                }
            },
            {
                "type": "button",
                "action": {
                    "type": "message",
                    "label": "Change Content",
                    "text": "Change Content"
                }
            },
            {
                "type": "button",
                "action": {
                    "type": "message",
                    "label": "Delete To do",
                    "text": "Delete To do"
                }
            }
            ]
        }
    }
}

const generateReadMessgae = function (array) {
    return {
        "type": "flex",
        "altText": "this is a flex message",
        "contents":  {
            "type": "bubble",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": array.length == 0 ? { "type": "text", "text": "nothing in todo list" } 
                            : array.map((value,index) => ({
                                "type": "text",
                                "text": `${index}. ${value}`
                            }))
            }
        }
    }
}

module.exports =  {
    wellcomeMessage,
    generateReadMessgae
}