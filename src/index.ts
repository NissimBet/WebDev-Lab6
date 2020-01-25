import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { MONGODB_URI } from './utils/secrets';
import { CommentsControllers } from './controllers';

const app = express();

const mongoURI = MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.set('port', process.env.PORT);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    res.send(204);
  }
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('/blog-api/comentarios', CommentsControllers.GetAllComments);
app.get('/blog-api/comentarios-por-autor', CommentsControllers.GetCommentsForAuthor);
app.post('/blog-api/nuevo-comentario', CommentsControllers.CreateComment);
app.delete('/blog-api/remover/comentario/:id', CommentsControllers.DeleteComment);
app.put('/blog-api/actualizar-comentaio/:id', CommentsControllers.UpdateComment);

export { app };
