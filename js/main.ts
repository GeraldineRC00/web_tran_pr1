// js/main.ts

const API_URL = "http://localhost:3000";

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
      const p = document.createElement("p");
      p.textContent = post.content;
      postContainer.appendChild(p);
    })
    .catch(err => console.error("Erreur chargement post:", err));

  // Cargar comentarios
  fetch(`${API_URL}/comments?postId=${postId}`)
    .then(res => res.json())
    .then((comments: BlogComment[]) => {
      commentsContainer.innerHTML = ""; // limpiar antes
      comments.forEach(comment => {
        const div = document.createElement("div");
        div.className = "comment mb-3 p-2 border rounded";
        div.innerHTML = `<p class="mb-0">${comment.content}</p>`;
        commentsContainer.appendChild(div);
      });
    })
    .catch(err => console.error("Erreur chargement commentaires:", err));

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

      const div = document.createElement("div");
      div.className = "comment mb-3 p-2 border rounded";
      div.innerHTML = `<p class="mb-0">${newComment.content}</p>`;
      commentsContainer.appendChild(div);

      // Limpiar textarea
      textarea.value = "";

      // Guardar en la API
      fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment)
      }).catch(err => console.error("Erreur ajout commentaire:", err));
    });
  }
}

// -------------------- INICIALIZAR --------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("postBody")) loadPost();
});