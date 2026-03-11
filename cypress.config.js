const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // server local
    baseUrl: "http://localhost/web_tran/web_tran_pr1", 

    // Ecran
    viewportWidth: 1280,
    viewportHeight: 720,

    specPattern: "cypress/e2e/**/*.cy.js",

    setupNodeEvents(on, config) {
      // Listeners
    },
  },
});