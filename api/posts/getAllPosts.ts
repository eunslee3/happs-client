import { instance } from '../axiosInstance';

export const getAllPosts = async () => {
  try {
    const response = await instance.get('/posts');
    // console.log('got posts: ', response)
    return response.data;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}