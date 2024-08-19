const User = require('../models/User');

// Controller to get user name
exports.getName = async (req, res) => {
  try {
    // User is already attached to req.user by the middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ firstName: user.firstName, lastName:user.lastName });
  } catch (error) {
    console.error('Error fetching user name: ', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.updateUserProfile = async (req, res) => {
  const { firstName, lastName, email, contactNumber } = req.body;
  const userId = req.user._id; // Assuming user ID is set in req.user by auth middleware
  let profilePicture;

  if (req.file) {
    const file = req.file;
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'users',
      use_filename: true,
    });
    profilePicture = {
      publicId: result.public_id,
      url: result.secure_url,
    };
  }

  try {
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, contactNumber, profilePicture },
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNumber: user.contactNumber,
      profileImage: user.profileImage,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
