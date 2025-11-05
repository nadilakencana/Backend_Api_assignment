const User = require('../models/User');
const { profileUpdateSchema, profileImageUpdateSchema } = require('../utils/validation');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { error } = profileUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter tidak sesuai format',
        data: null
      });
    }

    const { first_name, last_name } = req.body;
    const updatedUser = await User.updateProfile(req.user.userId, { first_name, last_name });

    res.status(200).json({
      status: 0,
      message: 'Update Pofile berhasil',
      data: {
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        profile_image: updatedUser.profile_image
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null
    });
  }
};
const updateProfileImage = async (req, res) => {
    try {
        console.log('Request file:', req.file);
        console.log('Request body:', req.body);
        
        if (!req.file) {
            return res.status(400).json({
                status: 102,
                message: 'Format Image tidak sesuai',
                data: null
            });
        }

        const userId = req.user.userId;
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        // Update profile image di database
        await User.updateProfileImage(userId, imageUrl);
        
        
        const updatedUser = await User.findById(userId);
        
        res.json({
            status: 0,
            message: 'Update Profile Image berhasil',
            data: {
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                profile_image: updatedUser.profile_image
            }
        });
        
    } catch (error) {
        console.error('Update profile image error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            data: null
        });
    }
};

module.exports = { getProfile,updateProfile,updateProfileImage };