import { instance } from '../axiosInstance';

export const initiateMultipartUpload = async (
  bucket: string,
  key: string
) => {
  try {
    console.log({
      name: 'multipartUpload',
      bucket,
      key
    })
    // const response = await instance.get('/posts');
    // // console.log('got posts: ', response)
    // return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}