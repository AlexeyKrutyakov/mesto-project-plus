import mongoose from 'mongoose';
import validator from 'validator';
import { Card } from './card.type';
import RESPONSE_MESSAGE from '../constants/responseMessages';

const cardSchema = new mongoose.Schema<Card>(
  {
    name: {
      type: String,
      required: [true, 'Поле обязательно для заполнения'],
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Поле обязательно для заполнения'],
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: RESPONSE_MESSAGE.notValidLinkUrl,
      },
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Поле обязательно для заполнения'],
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model('card', cardSchema);
