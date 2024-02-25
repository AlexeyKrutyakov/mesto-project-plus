import mongoose from 'mongoose';
import { Card } from './card.type';

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
