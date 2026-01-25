// User types for ConnectPay
export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  imageUrl?: string | null; // For backward compatibility with existing code
  created_at?: string;
}

export interface Domain {
  id: string;
  title: string;
}

export interface IGetUsersResponse {
  success: boolean;
  data: IUser[];
  message?: string;
  status?: number;
}