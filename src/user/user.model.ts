import mongoose from 'mongoose';
import { User } from './user.type';

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    email: {
      type: String,
      required: [true, 'Поле обязательно для заполнения'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Поле обязательно для заполнения'],
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [200, 'Максимальная длина 200 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

export default mongoose.model('user', userSchema);
