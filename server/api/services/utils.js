import crypto from "crypto";

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const secretKeyForUrl = process.env.URL_SECRET_KEY;
const iv = crypto.randomBytes(16);

export const encrypt = (text) => {
  const keyBuffer = Buffer.from(secretKeyForUrl, "hex");
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const keyBuffer = Buffer.from(secretKeyForUrl, "hex");

  if (keyBuffer.length !== 32) {
    throw new Error("Invalid key length. Key must be 32 bytes.");
  }

  // eslint-disable-next-line no-shadow
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

export function capitalizeEachWord(string) {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const shuffleArray = (array) => {
  // eslint-disable-next-line no-plusplus
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
