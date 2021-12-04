const router = require('express').Router();

router.get('/', (req, res) => {                  
  res.render('demo.ejs');      
})

module.exports = router;