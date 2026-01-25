// add types pertaining to authentication here
import { IUser } from "../user/types";

export interface IAuthData {
  token: string;
  expires: number;
  user: IUser;
}

export interface IGetSession {
  isAuthenticated: boolean;
  session: IAuthData;
  logout: () => void;
  setSession: (session: IAuthData) => Promise<void>;
}

export interface ILoginResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
}
export interface ISignupResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
}
export interface IForgotPasswordResponse {
  message: string;
  // data : {user?: IUser};
}
export interface IResetPasswordResponse {
  message: string;
  // data : {user?: IUser};
}
export interface IVerifyUserResponse {
  message: string;
  // data : {user?: IUser};
}
