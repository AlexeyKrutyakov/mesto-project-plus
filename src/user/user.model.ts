import mongoose from 'mongoose';
import validator from 'validator';
import { TUser } from './user.type';
import DEFAULT_USER from '../constants/defaultUser';
import RESPONSE_MESSAGE from '../constants/responseMessages';

const userSchema = new mongoose.Schema<TUser>(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
      default: DEFAULT_USER.name,
    },
    email: {
      type: String,
      required: [true, 'Поле обязательно для заполнения'],
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: RESPONSE_MESSAGE.notValidEmail,
      },
    },
    password: {
      type: String,
      required: [true, 'Поле обязательно для заполнения'],
      select: false,
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [200, 'Максимальная длина 200 символов'],
      default: DEFAULT_USER.about,
    },
    avatar: {
      type: String,
      default: DEFAULT_USER.avatar,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: RESPONSE_MESSAGE.notValidAvatar,
      },
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

export default mongoose.model('user', userSchema);
