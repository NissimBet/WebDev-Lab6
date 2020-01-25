function init() {
  getAllComentarios();
  newCommentFormInit();
}

const Comentario = ({ titulo, autor, contenido, fecha, id }) => `
  <li>${autor} - ${titulo} - ${contenido} - ${fecha}</li>
`;

async function getAllComentarios() {
  const allCommentsContainer = document.getElementsByClassName('all-comments')[0];
  const data = await fetch('/blog-api/comentarios');
  const dataJson = await data.json();
  allCommentsContainer.innerHTML = '';
  for (let comment of dataJson) {
    allCommentsContainer.innerHTML += Comentario({ ...comment });
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

    await fetch('/blog-api/nuevo-comentario', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
  });
}

init();
