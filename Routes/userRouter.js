const express = require('express');

const userController = require('./../Controllers/userController');
const authController = require('./../Controllers/authController');

const router = express.Router();

router.route('/getAllUsers').get( userController.getAllUsers);
router.route('/update-password').patch(authController.protect, userController.updatePassword);
router.route('/update-me').patch(authController.protect, userController.updateMe);
router.route('/delete-me').delete(authController.protect, userController.deleteMe);



module.exports = router;
