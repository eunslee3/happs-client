import { instance } from '../axiosInstance';

interface UserInfoProps {
  id: string | string[];
  username: string;
  firstName: string;
  lastName: string;
}

export const updateUserInfoApi = async (userInfo: UserInfoProps) => {
  try {
    const response = await instance.patch('/users/update-user-info', {
      ...userInfo
    });
    return response;
  } catch (err: any) {
    return err;
  }
}