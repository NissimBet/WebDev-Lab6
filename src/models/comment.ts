import mongoose, { Schema } from 'mongoose';
import uuid from 'uuid';

mongoose.Promise = global.Promise;

const CommentSchema = new Schema({
  id: { type: String, default: () => uuid.v4() },
  titulo: String,
  contenido: String,
  autor: String,
  fecha: Date,
});

const Comment = mongoose.model('comment', CommentSchema);

export const CommentCollection = {
  getAll: async () => {
    try {
      const allComments = await Comment.find();
      return allComments;
    } catch (error) {
      throw Error(error);
    }
  },
  getByAuthor: async (name: string) => {
    try {
      const comments = await Comment.find({ autor: name });
      return comments;
    } catch (error) {
      throw Error(error);
    }
  },
  createComment: async ({
    titulo,
    contenido,
    autor,
  }: {
    titulo: String;
    contenido: String;
    autor: String;
  }) => {
    try {
      const today = Date.now();
      const newComment = await Comment.create({
        titulo: titulo,
        contenido: contenido,
        autor: autor,
        fecha: today,
      });
      return newComment;
    } catch (error) {
      throw Error(error);
    }
  },
  deleteComment: async (id: String) => {
    try {
      const deleted = await Comment.deleteOne({ id: id });
      return deleted;
    } catch (error) {
      throw Error(error);
    }
  },
  getById: async (id: String) => {
    try {
      const found = await Comment.find({ id: id });
      return found;
    } catch (error) {
      throw Error(error);
    }
  },
  updateComment: async (
    id: String,
    data: { titulo?: String; contenido?: String; autor?: String }
  ) => {
    try {
      const updated = await Comment.update({ id: id }, data);
      return updated;
    } catch (error) {
      throw Error(error);
    }
  },
};
