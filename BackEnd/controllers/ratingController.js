const Rating = require('../models/Rating'); // Import the Rating model
const User = require('../models/User'); // Import the User model if needed

// Controller to create a new rating
exports.createRating = async (req, res) => {
  const { rating, review, ratedEntityId, role } = req.body;
  const reviewerId = req.user._id; // Assuming the user is authenticated and user ID is in req.user

  try {
    // Validate inputs
    if (!rating || !review || !ratedEntityId || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new rating
    const newRating = new Rating({
      rating,
      review,
      reviewerId,
      ratedEntityId,
      role,
    });

    await newRating.save();
    return res.status(201).json({ message: "Rating submitted successfully.", newRating });
  } catch (error) {
    console.error("Error creating rating:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Controller to get ratings for a specific user
exports.getUserRatings = async (req, res) => {
  const userId = req.params.id; // User ID from the URL parameters

  try {
    const ratings = await Rating.find({
      $or: [
        { ratedEntityId: userId },
        { reviewerId: userId },
      ],
    })
      .populate('reviewerId', 'firstName lastName') // Populate reviewer details
      .populate('ratedEntityId', 'firstName lastName') // Populate rated entity details
      .exec();

    return res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Controller to get the average rating of a user
exports.getAverageRating = async (req, res) => {
    const userId = req.params.id; // User ID from the URL parameters
  
    try {
      // Retrieve all ratings for the user
      const ratings = await Rating.find({ ratedEntityId: userId });
  
      // Calculate average rating
      if (ratings.length === 0) {
        return res.status(200).json({ averageRating: 0, message: "No ratings found." });
      }
  
      const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const averageRating = totalRating / ratings.length;
  
      return res.status(200).json({
        averageRating: parseFloat(averageRating.toFixed(2)), // Return average rounded to two decimal places
        totalRatings: ratings.length,
      });
    } catch (error) {
      console.error("Error fetching average rating:", error);
      return res.status(500).json({ message: "Server error." });
    }
  };
  