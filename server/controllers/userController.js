const User = require('../models/User');

// @desc    Upgrade user to Premium tier
// @route   POST /api/users/upgrade
// @access  Private
exports.upgradeTier = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already premium
        if (user.subscriptionTier === 'premium') {
            return res.status(400).json({ message: 'User is already on the Premium tier' });
        }

        // Update tier and reset limits (optional, but good practice)
        user.subscriptionTier = 'premium';
        user.dailyMessageCount = 0;
        // user.lastMessageResetDate = new Date(); // Optionally reset immediately

        const updatedUser = await user.save();

        // Return the updated user data (excluding password)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            subscriptionTier: updatedUser.subscriptionTier,
        });

    } catch (error) {
        console.error('Error upgrading user tier:', error);
        res.status(500).json({ message: 'Server error upgrading tier' });
    }
}; 