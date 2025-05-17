import { NotAcceptableException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { createHash } from 'crypto';

export async function generateUrl(
  userId: string,
  transactionId: string,
  amount: number,
  mobileNumber: string,
  callbackUrl: string,
) {
  try {
    const data = JSON.stringify({
      merchantId: process.env.ZK_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount,
      redirectMode: process.env.ZK_REDIRECT_MODE,
      mobileNumber,
      redirectUrl: callbackUrl,
      callbackUrl: callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    });

    const newBuffer = Buffer.from(data).toString('base64');
    const sha256Hash = createHash('sha256')
      .update(newBuffer + '/pg/v1/pay' + process.env.ZK_SALT_KEY)
      .digest('hex');

    const payload = await axios.post(
      process.env.ZK_GATEWAY_URL + 'pay',
      { request: newBuffer },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': sha256Hash + '###' + process.env.ZK_SALT_INDEX,
        },
      },
    );

    if (payload.data.success === true) {
      return payload.data.data.instrumentResponse.redirectInfo;
    } else {
      throw new NotAcceptableException(
        'Payment not initiated. Please contact to admin!',
      );
    }
  } catch (error) {
    // Optional: log the error for debugging
    // console.error(error);

    throw new NotAcceptableException(
      'Payment not initiated. Please contact to admin!',
    );
  }
}

export async function refund(
  userId: string,
  transactionId: string,
  amount: number,
  originalTransactionId: string,
) {
  try {
    const data = JSON.stringify({
      originalTransactionId,
      merchantId: process.env.ZK_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount,
      callbackUrl: process.env.ZK_CALLBACK_URL,
    });

    const newBuffer = Buffer.from(data).toString('base64');
    const sha256Hash = createHash('sha256')
      .update(newBuffer + '/pg/v1/pay' + process.env.ZK_SALT_KEY)
      .digest('hex');

    const payload = await axios.post(
      process.env.ZK_GATEWAY_URL + 'refund',
      { request: newBuffer },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': sha256Hash + '###' + process.env.ZK_SALT_INDEX,
        },
      },
    );

    return payload.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw new NotAcceptableException('Refund failed. Please contact admin.');
  }
}

export async function checkPaymentStatus(transactionId: string) {
  try {
    const string =
      `/pg/v1/status/${process.env.ZK_MERCHANT_ID}/${transactionId}` +
      process.env.ZK_SALT_KEY;
    const sha256Hash = createHash('sha256').update(string).digest('hex');

    const payload = await axios.get(
      `${process.env.ZK_GATEWAY_URL}status/${process.env.ZK_MERCHANT_ID}/${transactionId}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': sha256Hash + '###' + process.env.ZK_SALT_INDEX,
          'X-MERCHANT-ID': `${process.env.ZK_MERCHANT_ID}`,
        },
      },
    );

    return payload.data;
  } catch (error) {
    throw new NotAcceptableException(
      'Payment status check failed. Please contact to admin!',
    );
  }
}
