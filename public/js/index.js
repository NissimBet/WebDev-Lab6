const allCommentsContainer = document.getElementsByClassName('all-comments')[0];
const error = document.getElementsByClassName('error')[0];

let comentarios = [];

function init() {
  getAllComentarios();
  newCommentFormInit();
  updateCommentFormInit();
  RemoveCommentFormInit();
  SearchByAuthorFormInit();
}

function displayError(message) {
  error.style.display = 'inline-block';
  error.innerHTML = message;
}

function hideError() {
  error.style.display = 'none';
  error.innerHTML = '';
}

const Comentario = ({ titulo, autor, contenido, fecha, id }) => `
  <li>${autor} - ${titulo} - ${contenido} - ${fecha} - ${id}</li>
`;

async function getAllComentarios() {
  const data = await fetch('/blog-api/comentarios');
  const dataJson = await data.json();
  allCommentsContainer.innerHTML = '';
  comentarios = [...dataJson];
  for (let comment of dataJson) {
    allCommentsContainer.innerHTML += Comentario({ ...comment });
    //comentarios.push(comment);
  }
  if (dataJson.length == 0) {
    allCommentsContainer.innerHTML = 'No se encontraronn comentarios';
  }
}

function newCommentFormInit() {
  const form = document.getElementById('new-comment');

  const inputs = document.getElementsByClassName('new-comment-inputs');

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const data = {};
    for (let elem of inputs) {
      data[elem.name] = elem.value;
    }
    if (!(data.contenido && data.autor && data.titulo)) {
      displayError(
        'Faltan parametros para crear comentario, favor de ingresar todos los parametros'
      );
      return;
    } else {
      hideError();
      const newData = await fetch('/blog-api/nuevo-comentario', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const newDataJSON = await newData.json();

      comentarios.push(newDataJSON);
      await getAllComentarios();
    }
  });
}

function updateCommentFormInit() {
  const form = document.getElementById('update-comment');

  const inputs = document.getElementsByClassName('update-comment-inputs');

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const data = {};
    for (let elem of inputs) {
      data[elem.name] = elem.value;
    }

    if (!(data.autor || data.titulo || data.contenido)) {
      displayError('No se ingresaron parametros, favor de ingresar al menos 1');
      return;
    }

    if (!data.id) {
      displayError('No se ingreso el id del comentario a cambiar');
      return;
    }
    hideError();
    const newData = await fetch('/blog-api/actualizar-comentario/' + data['id'], {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const newDataJSON = await newData.json();

    if (newDataJSON) {
      getAllComentarios();
    } else {
      displayError(`Comentario con id ${data.id} no encontrado`);
    }
  });
}

function RemoveCommentFormInit() {
  const form = document.getElementById('remove-comment');

  const inputs = document.getElementsByClassName('remove-comment-inputs');

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const data = {};
    for (let elem of inputs) {
      data[elem.name] = elem.value;
    }

    if (!data.id) {
      displayError('Favor de proveer el id del comentario a eliminar');
      return;
    }

    const deleted = await fetch('/blog-api/remover-comentario/' + data['id'], {
      method: 'DELETE',
    });
    if (deleted.status === 404) {
      displayError('No se encontro un comentario con el id proveido');
      return;
    }
    hideError();
    getAllComentarios();
  });
}

function SearchByAuthorFormInit() {
  const form = document.getElementById('search-comment');

  const container = document.getElementsByClassName('search-author')[0];
  const inputs = document.getElementsByClassName('search-comment-inputs');

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const data = {};
    for (let elem of inputs) {
      data[elem.name] = elem.value;
    }

    if (!data.name) {
      displayError('Favor de proveer el nombre del autor');
      return;
    }

    const newData = await fetch('/blog-api/comentarios-por-autor?autor=' + data['autor']);
    container.innerHTML = '';
    if (newData.status === 404) {
      return;
    }
    const dataJSON = await newData.json();
    if (dataJSON.length > 0) {
      for (let elem of dataJSON) {
        container.innerHTML += Comentario({ ...elem });
      }
    }
  });
}

init();
