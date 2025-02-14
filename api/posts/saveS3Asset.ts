import { instance } from '../axiosInstance';

export const saveS3Asset = async (
  form: any,
  s3CleanUrl: string
) => {
  try {
    console.log({
      name: 'saveS3Asset',
      form,
      s3CleanUrl
    })
    // const response = await instance.get('/posts');
    // // console.log('got posts: ', response)
    // return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}