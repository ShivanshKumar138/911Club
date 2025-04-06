const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    if (!file || !file.buffer) {
        throw new Error('No file buffer found');
    }

    const options = {
        folder,
        resource_type: 'auto',
        fetch_format: 'auto',
        quality: 'auto:good',
        flags: 'lossy',
    };

    if (height) {
        options.height = height;
        options.crop = 'scale';
    }

    if (quality) {
        options.quality = quality;
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });

            uploadStream.end(file.buffer);
        });

        return result;
    } catch (error) {
        throw new Error(`Cloudinary upload error: ${error.message}`);
    }
};