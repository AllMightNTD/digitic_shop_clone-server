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
} = require('../controller/userCtrl');
const authMiddelware = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all-users', getAllUsers);
router.get('/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, getaUser);
router.delete('/delete/:id', deleteaUser);
router.put('/update', authMiddelware.authMiddleware, updateaUser);
router.put('/block-user/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddelware.authMiddleware, authMiddelware.isAdmin, unblockUser);
module.exports = router;
