import * as crypto from 'crypto';

export async function encrypt(text: string, manager: string): Promise<string> {
  const iv: Buffer = crypto.randomBytes(16);
  const key: Buffer = crypto.pbkdf2Sync(
    manager,
    iv,
    65536,
    +process.env.ENCRYPTION_AGE,
    process.env.ENCRYPTION_TYPE,
  );
  const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGO, key, iv);
  let encryptedText = cipher.update(text, 'utf8', 'base64');
  encryptedText += cipher.final('base64');
  const combined = Buffer.concat([iv, Buffer.from(encryptedText, 'base64')]);
  return combined.toString('base64');
}

export async function decrypt(text: string, manager: string): Promise<string> {
  const combined: Buffer = Buffer.from(text, 'base64');
  const iv: Buffer = combined.slice(0, +process.env.ENCRYPTION_BYTE);
  const encryptedText: Buffer = combined.slice(+process.env.ENCRYPTION_BYTE);
  const key: Buffer = crypto.pbkdf2Sync(
    manager,
    iv,
    65536,
    +process.env.ENCRYPTION_AGE,
    process.env.ENCRYPTION_TYPE,
  );
  const decipher = crypto.createDecipheriv(
    process.env.ENCRYPTION_ALGO,
    key,
    iv,
  );
  let decryptedText = decipher.update(
    encryptedText.toString('base64'),
    'base64',
    'utf8',
  );
  decryptedText += decipher.final('utf8');
  return decryptedText;
}
