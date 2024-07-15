const multer = require("fastify-multer");
const fs = require("fs");
const path = require("path");

const sharp = require("sharp");

// Multer configuration
const createStorage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, path.join(__dirname, "..", `public/temp/`));
  },
  filename: async (request, file, cb) => {
    const randomString = Math.random().toString(36).substring(2, 15);

    try {
      cb(null, `${randomString}.webp`);
    } catch (error) {
      cb(error, file);
    }
  },
});

// Multer middleware
module.exports.uploadMedia = multer({
  storage: createStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
    files: 2,
  },
}).any();

module.exports.processMedia = async (dir, oldPath, file, placeholder) => {
  try {
    const tempPath = path.join(__dirname, "..", `public/temp/${file.filename}`);
    const newPath = path.join(
      __dirname,
      "..",
      `public/assets/${dir}/${file.filename}`
    );
    await sharp(file.path).webp().toFile(newPath);
    fs.unlinkSync(tempPath);

    if (!placeholder) {
      fs.unlinkSync(oldPath);
    }

    return `public/assets/${dir}/${file.filename}`;
  } catch (error) {
    console.log(error);
    return false;
  }
};
