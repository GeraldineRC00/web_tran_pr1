Modifications et corrections

  J'ai corrigé le fichier de configuration de la pratique précédente pour que Cypress puisse exécuter les tests correctement.
  J'ai également résolu le problème des cartes sur la page principale qui ne s'affichaient pas correctement.

Fonctionnalités complétées

  L'API avec JSON Server fonctionne et les publications sont chargées dynamiquement sur la page principale.
  Le formulaire d'ajout de publication envoie les données à l'API et demande une confirmation avant l'envoi.
  Les publications s'affichent dynamiquement sur la page de consultation.
  Les commentaires existants sont chargés dynamiquement sur la page de consultation.
  Les nouveaux commentaires peuvent être ajoutés via le formulaire et apparaissent dans le DOM.

Fonctionnalités non complètement fonctionnelles

  Les tests Cypress pour vérifier les commentaires ajoutés échouent parfois à cause du timing, mais manuellement tout fonctionne.

Instructions pour tester

  Installer JSON Server si nécessaire : npm install -g json-server
  Lancer le serveur : json-server --watch db.json --port 3000
  Ouvrir le projet sur un serveur local (ex: http://localhost/web_tran/web_tran_pr1/index.html)
  Cypress peut être ouvert avec : npx cypress open
