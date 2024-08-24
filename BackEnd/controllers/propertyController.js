const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');
const uploader = cloudinary.uploader;
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

exports.addProperty = upload.array('images', 20); // allow up to 10 images

exports.addPropertyController = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Upload images to Cloudinary
    const images = await Promise.all(req.files.map((file) => {
      return uploader.upload(file.path, {
        resource_type: 'image',
      });
    }));

    // Create a new property
    const property = new Property({
      propertyCategory: req.body.propertyCategory,
      city: req.body.city,
      location: req.body.location,
      area: req.body.area,
      rentPrice: req.body.rentPrice,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      amenities: req.body.amenities,
      propertyTitle: req.body.propertyTitle,
      propertyDescription: req.body.propertyDescription,
      images: images.map((image) => image.secure_url),
      owner: req.user.id,
    });

    // Save the property
    await property.save();

    return res.status(201).json({
      message: 'Property added successfully',
      property,
    });
  } catch (error) {
    console.error('Error adding property:', error);
    return res.status(500).json({ error: 'Error adding property' });
  }
};