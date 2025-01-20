import { instance } from '../axiosInstance';

export const sendOtpApi = async (
  id: string | string[], 
  email: string | string[]
) => {
  try {
    const response = await instance.post('/auth/send-otp', {
      id,
      email
    });
    return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}