const express = require('express');
const { updateProfileImage,getProfile, updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.put('/image', authenticateToken, upload.single('profile_image'), updateProfileImage);
router.get('/profile', authenticateToken, getProfile);
router.put('/update', authenticateToken, updateProfile);

module.exports = router;