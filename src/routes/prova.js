const router = require('express').Router();

router.get('/', (req, res) => {                  
    res.render('prova.ejs');      
})

module.exports = router;