import { instance } from '../axiosInstance';

export const addComment = async (userId: string, postId: string, content: string) => {
  console.log('content in api call', content)
  try {
    const response = await instance.post(`/posts/comment/${postId}`, {
      userId,
      content
    });
    console.log('comment: ', JSON.stringify(response));
    return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}