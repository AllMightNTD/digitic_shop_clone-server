const express = require('express');
const { createUser , loginUser , getAllUsers ,getaUser , deleteaUser , updateaUser} = require('../controller/userCtrl');
const authMiddelware = require('../middlewares/authMiddleware')
const router = express.Router()
router.post("/register" , createUser);
router.post("/login" , loginUser);
router.get("/all-users"  , getAllUsers )
router.get('/:id'  ,authMiddelware.authMiddleware  , getaUser)
router.delete('/delete/:id' , deleteaUser)
router.put('/update', authMiddelware.authMiddleware , updateaUser )
module.exports = router