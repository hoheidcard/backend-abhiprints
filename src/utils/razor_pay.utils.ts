//import * as Razorpay from 'razorpay';
import Razorpay from 'razorpay';

export function instance() {

  const RazorpayConfig = {
    key_id: process.env.STN_APP_ID,
    key_secret: process.env.STN_APP_CERTIFICATE,
  };

  return new Razorpay(RazorpayConfig);
}
