import { instance } from '../axiosInstance';

export const getUserPosts = async (userId: string) => {
  try {
    const response = await instance.get(`/posts/${userId}`);
    return response.data;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}