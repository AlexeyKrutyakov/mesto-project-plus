import mongoose from 'mongoose';
import { User } from './user.type';

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: [true, 'Поле обязательно для заполнения'],
      // unique: true // todo is need check for duplicate user ?
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    about: {
      type: String,
      required: [true, 'Поле обязательно для заполнения'],
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [200, 'Максимальная длина 200 символов'],
    },
    avatar: {
      type: String,
      required: [true, 'Поле обязательно для заполнения'],
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

export default mongoose.model('user', userSchema);
