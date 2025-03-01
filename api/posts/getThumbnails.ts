import { instance } from '../axiosInstance';

export const getThumbnails = async (fileKey: string) => {
  try {
    const response = await instance.get('/s3/video-thumbnail', {
      params: {
        videoKey: fileKey
      }
    });
    console.log('response for thumbnail: ' + response)
    return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}