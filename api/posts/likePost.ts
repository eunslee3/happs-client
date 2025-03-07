import { instance } from '../axiosInstance';

export const likePost = async (userId: string, postId: string) => {
  try {
    const response = await instance.post(`/posts/like/${postId}`, {
      userId
    });

    return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}