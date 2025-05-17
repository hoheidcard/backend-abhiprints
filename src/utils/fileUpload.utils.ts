import { NotAcceptableException } from '@nestjs/common';
import axios from 'axios';

export const csvFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(csv)$/i)) {
    return callback(
      new NotAcceptableException('Only csv files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/i)) {
    return callback(
      new NotAcceptableException('Only Jpg, jpeg, png, mp4 files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const FileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|pdf)$/i)) {
    return callback(
      new NotAcceptableException('Only Jpg, jpeg, png, mp4 files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const audioFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(mp3|mp4)$/i)) {
    return callback(
      new NotAcceptableException('Only mp3 files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export async function uploadFileHandler(name: string, buffer: Buffer) {
  try {
    const newBuffer = Buffer.from(buffer.toString('binary'), 'binary');
    const payload = await axios.put(
      process.env.HOC_CDN_STORAGE + name,
      newBuffer,
      { headers: { AccessKey: process.env.HOC_CDN_ACCESS } }
    );
    return payload.data;
  } catch (error: any) {
    return error?.response?.data ?? { HttpCode: 405 };
  }
}

export async function deleteFileHandler(name: string) {
  try {
    const payload = await axios.delete(process.env.HOC_CDN_STORAGE + name, {
      headers: { AccessKey: process.env.HOC_CDN_ACCESS },
    });
    return payload.data;
  } catch (error: any) {
    return error?.response?.data ?? { HttpCode: 405 };
  }
}
