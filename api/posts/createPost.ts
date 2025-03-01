import { instance } from '../axiosInstance';

interface FormattedUrls {
  type: string,
  url: string,
  thumbNail?: string
}

export const createPost = async (
  userId: string,
  submittedForm: any, 
  formattedUrls: FormattedUrls[], 
  fileKeys: string[]
) => {
  try {
    console.log('submitted form title: ', submittedForm.title)
    const response = await instance.post('/posts/create', {
      userId,
      title: submittedForm.title,
      description: submittedForm.description,
      location: submittedForm.location,
      allowComments: submittedForm.allowComments,
      participateInLeaderboard: submittedForm.participateInLeaderboard,
      mediaUrls: formattedUrls,
      fileKeys: fileKeys
    });
    // console.log('got posts: ', response)
    return response;
  } catch (err: any) {
    console.log(err.message);
    return err;
  }
}