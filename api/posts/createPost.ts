import { instance } from '../axiosInstance';

export const createPost = async (
  userId: string,
  submittedForm: any, 
  cleanUrls: string[], 
  fileKeys: string[]
) => {
  try {
    const response = await instance.post('/posts/create', {
      userId,
      title: submittedForm.title,
      description: submittedForm.description,
      location: submittedForm.location,
      allowComments: submittedForm.allowComments,
      participateInLeaderboard: submittedForm.participateInLeaderboard,
      mediaUrls: cleanUrls,
      fileKeys: fileKeys
    });
    // console.log('got posts: ', response)
    return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}