const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
    logoUrl: {
        type: String,
        // required: true,
    },
    bannerImages: [
        {
            imageUrl: {
                type: String,
            },
        },
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
