// js/main.ts
var API_URL = "http://localhost:3000";
// -------------------- INDEX.HTML --------------------
function loadPosts() {
    var container = document.getElementById("postsContainer");
    if (!container)
        return;
    fetch("".concat(API_URL, "/posts"))
        .then(function (res) { return res.json(); })
        .then(function (posts) {
        posts.forEach(function (post) {
            var card = document.createElement("div");
            card.className = "col-12 col-lg-4";
            card.innerHTML = "\n          <article class=\"card h-100\">\n            <div class=\"card-body\">\n              <h5 class=\"card-title\">".concat(post.title, "</h5>\n              <p class=\"card-text\">").concat(post.content.substring(0, 100), "...</p>\n            </div>\n            <div class=\"card-footer bg-white border-0\">\n              <a href=\"post.html?id=").concat(post.id, "\" class=\"btn btn-outline-primary w-100\">\n                Lire l\u2019article\n              </a>\n            </div>\n          </article>\n        ");
            container.appendChild(card);
        });
    })
        .catch(function (err) { return console.error("Error cargando posts:", err); });
}
// -------------------- POST.HTML --------------------
function loadPost() {
    var postContainer = document.querySelector(".post-content");
    var commentsContainer = document.querySelector(".comments");
    if (!postContainer || !commentsContainer)
        return;
    var urlParams = new URLSearchParams(window.location.search);
    var postId = urlParams.get("id");
    if (!postId)
        return;
    // Cargar publicación
    fetch("".concat(API_URL, "/posts/").concat(postId))
        .then(function (res) { return res.json(); })
        .then(function (post) {
        var titleEl = document.querySelector("h1.post-title");
        if (titleEl)
            titleEl.textContent = post.title;
        var p = document.createElement("p");
        p.textContent = post.content;
        postContainer.appendChild(p);
    });
    // Cargar comentarios
    fetch("".concat(API_URL, "/comments?postId=").concat(postId))
        .then(function (res) { return res.json(); })
        .then(function (comments) {
        comments.forEach(function (comment) {
            var div = document.createElement("div");
            div.className = "comment";
            div.innerHTML = "<p>".concat(comment.content, "</p>");
            commentsContainer.appendChild(div);
        });
    });
    // Agregar comentario
    var sendBtn = document.getElementById("sendComment");
    var textarea = document.getElementById("commentInput");
    if (sendBtn && textarea) {
        sendBtn.addEventListener("click", function () {
            if (!textarea.value)
                return;
            var newComment = {
                id: Date.now(),
                postId: Number(postId),
                date: new Date().toISOString(),
                content: textarea.value
            };
            fetch("".concat(API_URL, "/comments"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment)
            })
                .then(function () {
                var div = document.createElement("div");
                div.className = "comment";
                div.innerHTML = "<p>".concat(newComment.content, "</p>");
                commentsContainer.appendChild(div);
                textarea.value = "";
            })
                .catch(function (err) { return console.error("Error enviando comentario:", err); });
        });
    }
}
// -------------------- ADD.HTML --------------------
function addPost() {
    var submitBtn = document.getElementById("submitPost");
    if (!submitBtn)
        return;
    submitBtn.addEventListener("click", function () {
        var titleInput = document.getElementById("title");
        var authorInput = document.getElementById("author");
        var contentInput = document.getElementById("content");
        if (!titleInput || !authorInput || !contentInput)
            return;
        var newPost = {
            id: Date.now(),
            title: titleInput.value,
            author: authorInput.value,
            content: contentInput.value,
            date: new Date().toISOString()
        };
        if (!newPost.title || !newPost.author || !newPost.content) {
            alert("Veuillez remplir tous les champs !");
            return;
        }
        // Confirmación
        if (confirm("Confirmer l'envoi de la publication ?")) {
            fetch("".concat(API_URL, "/posts"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost)
            })
                .then(function () {
                window.location.href = "index.html";
            })
                .catch(function (err) { return console.error("Error agregando post:", err); });
        }
    });
}
// -------------------- INICIALIZAR --------------------
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("postsContainer"))
        loadPosts();
    if (document.querySelector(".post-content"))
        loadPost();
    if (document.getElementById("submitPost"))
        addPost();
});
