describe("Blog CEPI - Tests Complets", () => {

  const baseUrl = "http://localhost/web_tran/web_tran_pr1";

  it("Chargement des publications", () => {
    cy.visit(`${baseUrl}/index.html`);
    cy.get(".row .card", { timeout: 10000 })
      .should("have.length.at.least", 1);
  });
  //INDEX.HTML
  it("Consultation d’un article", () => {
    cy.visit(`${baseUrl}/index.html`);
    cy.get(".row .card a").first().click();
    cy.url().should("include", "post.html");
    cy.get("h1.post-title").should("exist");
  });

  // POST.HTML 
  it("Devrait afficher les commentaires existants", () => {
    cy.visit(`${baseUrl}/post.html?id=1`);
    cy.get("#commentsContainer").contains("Premier commentaire").should("exist");
    cy.get("#commentsContainer").contains("Deuxième commentaire").should("exist");
  });

  it("Devrait ajouter un commentaire", () => {
    cy.visit(`${baseUrl}/post.html?id=1`);

    cy.intercept("POST", "**/comments").as("addComment");
    cy.get("#commentInput").type("Test commentaire Cypress");
    cy.get("#sendComment").click();
    cy.wait("@addComment");

    // Verificar que el comentario se agregó al DOM
    cy.get("#commentsContainer", { timeout: 5000 })
      .contains("Test commentaire Cypress")
      .should("exist");

    // Verificar que textarea se vació
    cy.get("#commentInput").should("have.value", "");
  });

  // ADD.HTML
  it("Devrait ajouter un nouveau post", () => {
    cy.visit(`${baseUrl}/add.html`);

    // Simular confirm
    cy.on('window:confirm', () => true);

    cy.get("#title").type("Post Cypress Test");
    cy.get("#author").type("Auteur Test");
    cy.get("#content").type("Contenu du post pour Cypress");

    cy.intercept("POST", "**/posts").as("addPost");
    cy.get("#submitPost").click();
    cy.wait("@addPost");

    // Verificar que redirige a index.html
    cy.url().should("include", "index.html");

    // Verificar que aparece el nuevo post
    cy.get(".row .card h5.card-title").contains("Post Cypress Test").should("exist");
  });

  // INDEX.HTML - vérification des titres
  it("Vérification des titres de posts", () => {
    cy.visit(`${baseUrl}/index.html`);
    cy.get(".row .card h5.card-title").each(($el) => {
      cy.wrap($el).should("not.be.empty");
    });
  });

  // Navigation entre articles 
  it("Navigation entre articles", () => {
    cy.visit(`${baseUrl}/index.html`);
    cy.get(".row .card a").eq(1).click();
    cy.url().should("include", "post.html");
    cy.get("h1.post-title").should("exist");

    cy.go('back');
    cy.url().should("include", "index.html");
  });

});