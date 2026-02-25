import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secret = process.env.AES_SECRET;
if (!secret) {
  throw new Error("AES_SECRET is not defined in environment variables");
}
const key = Buffer.from(secret, "utf-8");
if (key.length !== 32) {
  throw new Error("AES_SECRET must be 32 bytes long for aes-256-cbc");
}
const iv = Buffer.alloc(16, 0);

export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decrypt = (encrypted) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};