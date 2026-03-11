const API_URL = "http://localhost:3000";

// -------------------- INTERFACES --------------------
interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
}

interface BlogComment {
  id: number;
  postId: number;
  date: string;
  content: string;
}

// -------------------- INDEX.HTML --------------------
function loadPosts() {
  const container = document.getElementById("postsContainer");
  if (!container) return;

  fetch(`${API_URL}/posts`)
    .then(res => res.json())
    .then((posts: Post[]) => {
      if (!posts.length) return; // mantener tarjetas de ejemplo si no hay posts

      container.innerHTML = ""; // limpiar tarjetas de ejemplo
      posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "col-12 col-lg-4";
        card.innerHTML = `
          <article class="card h-100">
            <img src="img/post${post.id}.jpg" class="card-img-top" alt="${post.title}">
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.content.substring(0, 100)}...</p>
            </div>
            <div class="card-footer bg-white border-0">
              <a href="post.html?id=${post.id}" class="btn btn-outline-primary w-100">
                Lire l’article
              </a>
            </div>
          </article>
        `;
        container.appendChild(card);
      });
    })
    .catch(() => {
      console.warn("No se pudo cargar posts dinámicamente. Se mantienen las tarjetas de ejemplo.");
    });
}

// -------------------- POST.HTML --------------------
function loadPost() {
  const postContainer = document.getElementById("postBody");
  const commentsContainer = document.getElementById("commentsContainer");
  const titleEl = document.querySelector("h1.post-title");
  if (!postContainer || !commentsContainer || !titleEl) return;

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  if (!postId) return;

  // Cargar publicación
  fetch(`${API_URL}/posts/${postId}`)
    .then(res => res.json())
    .then((post: Post) => {
      titleEl.textContent = post.title;
      postContainer.innerHTML = `<p>${post.content}</p>`;
    })
    .catch(() => console.warn("No se pudo cargar la publicación."));

  // Cargar comentarios
  fetch(`${API_URL}/comments?postId=${postId}`)
    .then(res => res.json())
    .then((comments: BlogComment[]) => {
      commentsContainer.innerHTML = ""; // limpiar
      comments.forEach(comment => {
        const div = document.createElement("div");
        div.className = "comment mb-3 p-2 border rounded";
        div.innerHTML = `<p class="mb-0">${comment.content}</p>`;
        commentsContainer.appendChild(div);
      });
    })
    .catch(() => console.warn("No se pudieron cargar comentarios."));

  // Agregar comentario
  const sendBtn = document.getElementById("sendComment");
  const textarea = document.getElementById("commentInput") as HTMLTextAreaElement;

  if (sendBtn && textarea) {
    sendBtn.addEventListener("click", () => {
      const content = textarea.value.trim();
      if (!content) return;

      const newComment: BlogComment = {
        id: Date.now(),
        postId: Number(postId),
        date: new Date().toISOString(),
        content
      };

      // Mostrar en el DOM inmediatamente (para Cypress)
      const div = document.createElement("div");
      div.className = "comment mb-3 p-2 border rounded";
      div.innerHTML = `<p class="mb-0">${newComment.content}</p>`;
      commentsContainer.appendChild(div);

      // Limpiar textarea
      textarea.value = "";

      // Enviar a API
      fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
      }).catch(err => console.error("Error al agregar comentario:", err));
    });
  }
}

// -------------------- INICIALIZAR --------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("postsContainer")) loadPosts();
  if (document.getElementById("postBody")) loadPost();
});