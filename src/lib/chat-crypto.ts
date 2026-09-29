import crypto from "crypto";

// کلید رمزنگاری — از متغیر محیطی یا یک مقدار پیش‌فرض ثابت استفاده می‌شود.
// در محیط تولید حتماً باید CHAT_ENCRYPTION_KEY تنظیم شود (۳۲ بایت به‌صورت hex = ۶۴ کاراکتر).
const RAW_KEY =
  process.env.CHAT_ENCRYPTION_KEY ||
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

// مشتق‌سازی کلید ۳۲ بایتی برای AES-256-GCM
const KEY = crypto.createHash("sha256").update(RAW_KEY).digest();

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // 96 بیت برای GCM

/**
 * رمزنگاری متن با AES-256-GCM.
 * خروجی: base64 از ترکیب iv + authTag + ciphertext.
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, authTag, enc]);
  return combined.toString("base64");
}

/**
 * رمزگشایی base64 از خروجی تابع encrypt.
 * در صورت ناموفق بودن، رشتهٔ خام ورودی را برمی‌گرداند (تا اپ کرش نکند).
 */
export function decrypt(encrypted: string): string {
  try {
    const data = Buffer.from(encrypted, "base64");
    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
    const enc = data.subarray(IV_LENGTH + 16);
    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
    decipher.setAuthTag(authTag);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return dec.toString("utf8");
  } catch {
    return encrypted;
  }
}

const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * ساخت شناسه یکتای چت با فرمت qd-xxxxxx (۶ کاراکتر تصادفی).
 */
export function generateChatId(): string {
  const bytes = crypto.randomBytes(6);
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  }
  return `qd-${out}`;
}

// الگوی شناسایی لینک — شامل http://، https://، www. و دامنه‌های رایج
const URL_REGEX =
  /(https?:\/\/|www\.|[a-z0-9-]+\.(com|ir|org|net|info|edu|gov|biz|io|co|me|tv|cc|pk|uk|us|ca|au|de|fr|it|es|nl|ru|br|in|jp|cn)\b)/i;

/**
 * بررسی اینکه آیا متن حاوی لینک/URL است.
 * کاربرد: جلوگیری از ارسال لینک در پیامرسان.
 */
export function containsUrl(text: string): boolean {
  if (!text) return false;
  return URL_REGEX.test(text);
}
