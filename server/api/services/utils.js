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

export const extractJsonObject = (text) => {
  try {
    // First try to parse the entire text as JSON
    try {
      return JSON.parse(text);
    } catch {
      // If not valid JSON, try to extract and fix it

      // Find content between first { and count braces
      const start = text?.indexOf("{");
      if (start === -1) {
        console.error("No opening brace found");
        return null;
      }

      // Count opening and closing braces to ensure proper nesting
      let braceCount = 0;
      let squareBraceCount = 0;
      let end = start;

      for (let i = start; i < text.length; i++) {
        if (text[i] === "{") braceCount++;
        if (text[i] === "}") braceCount--;
        if (text[i] === "[") squareBraceCount++;
        if (text[i] === "]") squareBraceCount--;
        end = i;

        // If we've found a complete JSON structure, break
        if (braceCount === 0 && squareBraceCount === 0) break;
      }

      // Add missing closing braces/brackets
      let jsonStr = text.slice(start, end + 1);
      while (braceCount > 0) {
        jsonStr += "}";
        braceCount--;
      }
      while (squareBraceCount > 0) {
        jsonStr += "]";
        squareBraceCount--;
      }

      // Clean and fix the JSON string
      let cleanJson = jsonStr
        .replace(/,\s*[}\]](?=[}\]])/g, "$1") // Remove trailing commas before } or ]
        .replace(/'/g, '"') // Standardize quotes
        .replace(/:\s*"([^"]*?)(?=[,}\]](?!"))/g, ':"$1"') // Add missing closing quotes only if not already present
        .replace(/\n/g, "\\n") // Escape newlines
        .replace(/([^"\\])"/g, '$1\\"') // Escape unescaped quotes within strings
        .replace(/:\s*([^",\s{}[\]][^,}\]]*?)(?=[,}\]])/g, ':"$1"'); // Add quotes to unquoted string values

      // Add quotes to keys
      cleanJson = cleanJson.replace(/{|\b(\w+)(?=:)/g, (match) => (match === "{" ? "{" : `"${match}"`));

      // Add quotes to string values
      cleanJson = cleanJson.replace(/:\s*([^",\s{}[\]][^,}\]]*?)(?=[,}\]])/g, (match, value) => {
        // Don't quote numbers, booleans, or null
        if (/^-?\d+\.?\d*$/.test(value)) return match;
        if (/^(true|false|null)$/.test(value)) return match;
        return `: "${value.trim()}"`;
      });

      return JSON.parse(cleanJson);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
};
