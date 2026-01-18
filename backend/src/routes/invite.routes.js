const express = require("express");
const router = express.Router();

const {acceptInvite} = require('../controllers/invite.controller')
const {authMiddleware} = require('../middlewares/auth.middleware')

router.get('/:token', acceptInvite)

module.exports = router;