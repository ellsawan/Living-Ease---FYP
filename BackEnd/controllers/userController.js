const cloudinaryConfig = require("../config/cloudinary");
const cloudinary = cloudinaryConfig;
const { uploader } = cloudinary;
const User = require("../models/User");
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });

exports.uploadProfileImage = upload.single("image");

exports.uploadImageController = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Upload the image to Cloudinary
    const result = await uploader.upload(req.file.path, {
      resource_type: "image",
    });

    // Update the user profile image
    const user = await User.findById(req.user.id);
    user.profileImage = {
      publicId: result.public_id,
      url: result.secure_url,
    };
    await user.save();

    return res.status(201).json({
      message: "Profile image uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error in uploadProfileImage:", error);
    return res.status(500).json({ error: "Error uploading image" });
  }
};
// Controller to get user name
exports.getName = async (req, res) => {
  try {
    // User is already attached to req.user by the middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    console.error("Error fetching user name: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to get user profile image
exports.getUserProfileImage = async (req, res) => {
  try {
    // Fetch user from database using user ID from request
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        profileImageUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      });
    }

    // Check if the user has a profile image
    if (!user.profileImage || !user.profileImage.url) {
      return res.status(200).json({
        profileImageUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      });
    }

    // Send the profile image URL in the response
    res.status(200).json({
      profileImageUrl: user.profileImage.url,
    });
  } catch (error) {
    console.error("Error fetching user profile image:", error.message);
    res.status(500).json({
      profileImageUrl:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    });
  }
};
// Controller to get data for the currently authenticated user
exports.getUserData = async (req, res) => {
  try {
    // User is already attached to req.user by the middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Default placeholder for contact number
    const placeholderContactNumber = "";

    // Send user data in the response
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      contactNumber: user.contactNumber || placeholderContactNumber,
      profileImage: user.profileImage
        ? user.profileImage.url
        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateUserProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Find user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data
    const { firstName, lastName, contactNumber, email, password } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (contactNumber) user.contactNumber = contactNumber;
    if (email) {
      // Check if email is already used by another user
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }
    if (password) user.password = password; // Handle password hashing separately

    // Handle profile image update if uploaded
    if (req.file) {
      // Upload image to Cloudinary
      const result = await uploader.upload(req.file.path, {
        resource_type: "image",
      });
      user.profileImage = {
        publicId: result.public_id,
        url: result.secure_url,
      };
    }

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        profileImage: user.profileImage
          ? user.profileImage.url
          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res
        .status(400)
        .json({ message: "Duplicate key error", error: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};
