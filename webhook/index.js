const router = require('express').Router();

router.post('/', async function(req, res){
    res.status(200).json();
});

module.exports = router;
