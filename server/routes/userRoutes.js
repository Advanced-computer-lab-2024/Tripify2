const express = require('express')
const router = express.Router();
const { resetPassword, sendPasswordResetOTP, getAllDeleteRequests, getAllUsers, createUser, getUser, updateUser, deleteUser, updatePassword, requestDeleteUser } = require('../controllers/userController')
const verifyUser = require('../middleware/verifyJWT')
const verifyAdmin = require('../middleware/verifyAdminOnly')

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

router.route('/get-all/delete-requests')
    .get(verifyAdmin, getAllDeleteRequests)

router.post('/forgot-password', sendPasswordResetOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
