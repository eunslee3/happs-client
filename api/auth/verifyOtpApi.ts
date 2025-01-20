import { instance } from '../axiosInstance';

export const verifyOtpApi = async (id: string | string[], value: string) => {
  try {
    console.log(`verifying otp`);
    const response = await instance.post('/auth/verify-otp', {
      id,
      tokenInput: value
    });
    console.log('OTP verified')
    return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}