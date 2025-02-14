import { instance } from '../axiosInstance';

export const getPresignedUrlApi = async (
  fileName: string,
  fileType: string
) => {
  try {
    console.log({
      name: 'PRESIGNED_URL',
      fileName,
      fileType
    })
    const response = await instance.post('/s3/get-presigned-url', {
      fileName,
      fileType,
    });
    return {
      presignedUrl: response.data.presignedUrl,
      fileKey: response.data.fileKey
    }
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}