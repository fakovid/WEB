var express = require('express');
var router = express.Router();
const getKeywords = require("../scrapper")

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(await getKeywords()));
});

module.exports = router;
