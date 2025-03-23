export interface UserProfile {
  _id: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  email?: string;
  password?: string;
  role?: string;
}
