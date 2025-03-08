import { instance } from '../axiosInstance';

export const addComment = async (userId: string, postId: string, content: string) => {
  try {
    const response = await instance.post(`/posts/comment/${postId}`, {
      userId,
      content
    });

    return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}