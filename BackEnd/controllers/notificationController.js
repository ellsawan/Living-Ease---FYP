const User = require("../models/User");
const Tenant= require("../models/Tenant")
const Landlord= require("../models/Landlord")
const Notification= require("../models/Notification")
// Get notifications for a tenant
exports.getNotificationsByUser = async (req, res) => {
    try {
      const notifications = await Notification.find({ userId: req.params.userId }).sort({ timestamp: -1 });
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Failed to fetch notifications', error });
    }
  };
  