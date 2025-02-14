import { instance } from '../axiosInstance';

interface CreatePost {
  submittedForm: any,
  cleanUrls: string[];
}

export const createPost = async (
  submittedForm: any, 
  cleanUrls: string[], 
  fileKeys: string[]
) => {
  try {
    const response = await instance.post('/posts', {
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