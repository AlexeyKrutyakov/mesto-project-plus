import mongoose from 'mongoose';

export type Card = {
  name: string;
  link: string;
  owner: mongoose.ObjectId;
  likes: mongoose.ObjectId[];
  createdAt: Date;
};
