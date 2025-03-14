const axios = require("axios");
require("dotenv").config();

const B2_APPLICATION_KEY_ID = process.env.B2_APPLICATION_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY;
const B2_BUCKET_ID = process.env.B2_BUCKET_ID;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;
const B2_ENDPOINT = `https://f005.backblazeb2.com/file/${B2_BUCKET_NAME}/`;

// Function to upload image to BlackBlaze B2
async function uploadImageToB2(imageBuffer, fileName) {
  try {
    // 1. Get Auth Token
    const authResponse = await axios.post(
      "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
      {},
      {
        auth: { username: B2_APPLICATION_KEY_ID, password: B2_APPLICATION_KEY },
      }
    );

    const authToken = authResponse.data.authorizationToken;
    const uploadUrlResponse = await axios.post(
      `${authResponse.data.apiUrl}/b2api/v2/b2_get_upload_url`,
      { bucketId: B2_BUCKET_ID },
      { headers: { Authorization: authToken } }
    );

    // 2. Upload Image
    const uploadAuthToken = uploadUrlResponse.data.authorizationToken;
    const uploadUrl = uploadUrlResponse.data.uploadUrl;

    const response = await axios.post(uploadUrl, imageBuffer, {
      headers: {
        Authorization: uploadAuthToken,
        "X-Bz-File-Name": fileName,
        "Content-Type": "image/jpeg",
        "X-Bz-Content-Sha1": "do_not_verify",
      },
    });

    // 3. Return Public URL
    return `${B2_ENDPOINT}${fileName}`;
  } catch (error) {
    console.error(
      "Error uploading image to B2:",
      error.response?.data || error.message
    );
    throw new Error("Image upload failed");
  }
}

// Function to retrieve image URL
function getImageUrl(fileName) {
  return `${B2_ENDPOINT}${fileName}`;
}

module.exports = { uploadImageToB2, getImageUrl };
