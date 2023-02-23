const express = require('express');
const {
    createUser,
    loginUser,
    getAllUsers,
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefeshToken,
    logoutUser,
    forgotPass,
    resetPass,
} = require('../controller/userCtrl');
const authMiddelware = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/forgotpass', forgotPass);
router.post('/resetpass', resetPass);
router.get('/all-users', authMiddelware.authMiddleware, authMiddelware.isAdmin, getAllUsers);
router.get('/refesh', handleRefeshToken);
router.get('/logout', logoutUser);
router.get('/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, getaUser);
router.delete('/delete/:id', deleteaUser);
router.put('/update', authMiddelware.authMiddleware, updateaUser);
router.put('/block-user/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, unblockUser);

module.exports = router;
