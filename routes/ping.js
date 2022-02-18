var express = require("express");
var router = express.Router();


router.get('/', async (req,res,next) => {
  try {
    res.status(200).json({
      success: true
    })
  } catch(error) {
    next(error)
  }
})

module.exports = router
