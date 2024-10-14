const express = require('express')
const router = express.Router();
const { getAllUsers, createUser, getUser, updateUser, deleteUser, updatePassword, requestDeleteUser } = require('../controllers/userController')
const verifyUser = require('../middleware/verifyJWT')

router.route('/')
    .get(getAllUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

router.route('/change-password/:id')
    .patch(verifyUser, updatePassword)

router.route('/request-deletion/:id')
    .post(verifyUser, requestDeleteUser)

module.exports=router;
