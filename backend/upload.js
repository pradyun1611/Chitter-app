// one-time upload.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.uploader.upload('./public/pfp/pfp.png', {
  folder: 'pfp',
  public_id: 'default_pfp'
})
.then(result => {
  console.log('Default PFP uploaded:', result.secure_url);
})
.catch(err => console.error(err));
