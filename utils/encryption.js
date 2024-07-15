const crypto = require("crypto");

const ALOGORITHM = process.env.ALOGORITHM;
const SECRET_KEY = process.env.SECRET_KEY;

module.exports.encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALOGORITHM, SECRET_KEY, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

module.exports.decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    ALOGORITHM,
    SECRET_KEY,
    Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
