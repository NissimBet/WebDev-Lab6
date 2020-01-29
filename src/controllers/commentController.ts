import { CommentCollection } from '../models';
import { RequestHandler } from 'express';

export const GetAllComments: RequestHandler = async (_, res) => {
  try {
    const data = await CommentCollection.getAll();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const GetCommentsForAuthor: RequestHandler = async (req, res) => {
  try {
    const { autor } = req.query;
    if (!autor) {
      res.statusMessage = 'No se proporcionó el nombre del autor';
      return res.status(406).send();
    }

    const messages = await CommentCollection.getByAuthor(autor);
    if (messages && messages.length > 0) {
      res.statusMessage = 'Mensajes de autor encontrados';
      return res.status(200).json(messages);
    }

    res.statusMessage = 'Autor no tiene mensajes';
    return res.status(404).send();
  } catch (error) {
    console.log(error);
  }
};

export const CreateComment: RequestHandler = async (req, res) => {
  try {
    const { titulo, contenido, autor } = req.body;

    if (titulo && contenido && autor) {
      const message = await CommentCollection.createComment({
        titulo: titulo,
        contenido: contenido,
        autor: autor,
      });

      res.statusMessage = 'Comentario creado';
      res.status(201).json(message);
    } else {
      res.statusMessage =
        'Faltan Parametros: ' +
        (!titulo ? 'Titulo, ' : '') +
        (!contenido ? 'Contenido, ' : '') +
        (!autor ? 'Autor, ' : '');

      return res.status(406).send();
    }
  } catch (error) {
    console.log(error);
  }
};

export const DeleteComment: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const existsComment = await CommentCollection.getById(id);
    if (existsComment) {
      await CommentCollection.deleteComment(id);
      res.statusMessage = 'Comentario eliminado';
      res.status(200).send();
    } else {
      res.statusMessage = 'No se encontró el elemento';
      res.status(404).send();
    }
  } catch (error) {
    console.log(error);
  }
};

export const UpdateComment: RequestHandler = async (req, res) => {
  try {
    const { id: paramId } = req.params;
    const { id: bodyId, autor, contenido, titulo } = req.body;

    if (bodyId && (autor || contenido || titulo)) {
      if (paramId == bodyId) {
        const data: { autor?: String; contenido?: String; titulo?: String } = {};

        autor ? (data.autor = autor) : '';
        contenido ? (data.contenido = contenido) : '';
        titulo ? (data.titulo = titulo) : '';

        await CommentCollection.updateComment(bodyId, { ...data });
        const oldData = await CommentCollection.getById(bodyId);
        res.statusMessage = 'Comentario modificado';
        res.status(202).json(oldData);
      } else {
        res.statusMessage = 'Identificadores no son iguales';
        res.status(409).send();
      }
    } else {
      res.statusMessage =
        'Parámetros faltantes: ' +
        (!bodyId ? 'Identificador' : '') +
        (!(titulo || contenido || autor) ? 'Titulo, Contenido o Autor' : '');

      res.status(406).send();
    }
  } catch (error) {
    console.log(error);
  }
};
