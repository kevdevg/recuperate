var express = require('express');
var router = express.Router();
var allies_controller = require('../controllers/alliesController');

/* GET users listing. */
router.get('/', allies_controller.ally_connect);

module.exports = router;
