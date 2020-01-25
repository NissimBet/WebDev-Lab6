const allCommentsContainer = document.getElementsByClassName('all-comments')[0];

const comentarios = [];

function init() {
  getAllComentarios();
  newCommentFormInit();
  updateCommentFormInit();
}

const Comentario = ({ titulo, autor, contenido, fecha, id }) => `
  <li>${autor} - ${titulo} - ${contenido} - ${fecha}</li>
`;

async function getAllComentarios() {
  const data = await fetch('/blog-api/comentarios');
  const dataJson = await data.json();
  allCommentsContainer.innerHTML = '';
  for (let comment of dataJson) {
    allCommentsContainer.innerHTML += Comentario({ ...comment });
    comentarios.push(comment);
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

    const newData = await fetch('/blog-api/nuevo-comentario', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const newDataJSON = await newData.json();
    allCommentsContainer.innerHTML += Comentario({ ...newDataJSON });
    comentarios.push(newDataJSON);
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

    console.log(data);

    const newData = await fetch('/blog-api/actualizar-comentario/' + data['id'], {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const newDataJSON = await newData.json();

    const index = comentarios.find(val => val.id === data['id']);
    comentarios[index] = newDataJSON;
    allCommentsContainer.innerHTML = '';
    for (let elem of comentarios) {
      allCommentsContainer.innerHTML += Comentario({ ...elem });
    }
  });
}

init();
