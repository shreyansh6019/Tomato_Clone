export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  image: string;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}