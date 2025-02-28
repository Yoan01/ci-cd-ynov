# **Formulaire d'inscription avec validation et gestion des erreurs**

Ce projet est une application réalisée avec Nextjs (React avec TypeScript) permettant à un utilisateur de s’enregistrer à travers un formulaire avec des règles de validation strictes et une gestion d’erreurs détaillée. Il est testé, documenté et déployé.

---

## **Fonctionnalités principales**

1. **Formulaire d'inscription utilisateur / liste d'utilisateurs / login / delete :**

   - Champs requis :
     - **Nom** : Validation pour interdire les caractères spéciaux et les chiffres (accents, trémas, et tirets acceptés).
     - **Prénom** : Validation identique à celle du nom.
     - **Email** : Validation de format (doit respecter les normes RFC 5322).
     - **Date de naissance** : L'utilisateur doit avoir au moins **18 ans**.
     - **Ville** : Champ texte classique.
     - **Code postal** : Doit respecter le format français (5 chiffres).
     - **Password** : Champ texte classique (8 caractères minimum).
   - Le bouton **"Sauvegarder"** est désactivé tant que tous les champs ne sont pas remplis correctement, on peut cliquer dessus pour voir l'erreur des inputs.


2. **Validation des données :**

   - Les champs sont validés dynamiquement.
   - Affichage des messages d'erreur sous chaque champ non valide, en rouge.


3. **Sauvegarde des données :**
   - Si les champs sont valides :
     - Les données sont sauvegardées dans le **local storage**.
     - Un **toaster de succès** s’affiche.
     - Les champs du formulaire sont vidés.
   - Si les champs ne sont pas valides :
     - Un **toaster d’erreur** s’affiche.
     - Les champs en erreur sont mis en évidence.

---

## **Règles de validation**

1. **Nom et prénom :**

   - Doivent contenir uniquement des lettres, des accents, des trémas et des tirets.
   - Aucun chiffre ni caractère spécial autorisé.

2. **Email :**

   - Doit être conforme aux standards internationaux de validation.

3. **Date de naissance :**

   - L'utilisateur doit être âgé d'au moins **18 ans**.

4. **Code postal :**
   - Doit comporter **exactement 5 chiffres** pour respecter le format français.

5. **Password :**
   - Doit contenir **au moins 8 caractères**.
---

## **Tests et couverture**

### **Tests unitaires (UT)**

Tous les composants et fonctions critiques sont testés. Les tests couvrent les cas suivants :

- **Calcul de l’âge** à partir de la date de naissance.
- Vérification que l'âge est supérieur ou égal à **18 ans**.
- Validation des formats :
  - Nom et prénom (avec cas particuliers comme accents, tirets, trémas).
  - Email valide et non valide.
  - Code postal en format français.
- Désactivation du bouton lorsque les champs sont incomplets.
- Fonction de sauvegarde dans le local storage.
- Apparition des toasters (succès ou erreur) et des messages d’erreur.

### **Tests d'intégration (IT)**

- Vérification de bout en bout :
  - Remplissage correct du formulaire.
  - Sauvegarde réussie dans le local storage avec affichage du toaster de succès.
  - Gestion des erreurs et affichage des messages rouges.
  - Vidage des champs après soumission réussie.

### **Couverture attendue**

- Couverture totale à **100 %** pour tous les fichiers critiques (hors `index.tsx` et `reportWebVitals.ts`).

---

## **Pipeline CI/CD**

1. **CI** :

   - **prebuild** : Les tests doivent réussir avant tout déploiement.

2. **CD:**
   - **build** : Si les tests fonctionnent correctement, le projet est build.

---

## **Lancer le projet en local**

1. **Cloner le projet :**

   ```bash
   git clone https://github.com/Yoan01/CI-CD-ynov-backend.git
    ```
2. **Installer les dépendances :**

    ```bash
    npm install
    ```
   
3. **Ajouter un fichier `.env` à la racine du projet :**'

    ```bash
    NEXT_PUBLIC_API_URL=https://ci-cd-ynov-backend.vercel.app/api
    NEXT_PUBLIC_APP_URL=http://localhost:3000/
    NEXT_PUBLIC_APP_NAME=CICD
    NEXT_PUBLIC_ENV=dev
    ```
    L'url de l'API est celle du backend déployé sur Vercel. Vous pouvez aussi lancer le backend en local et changer l'url de l'API.


4. **Lancer le projet :**

    ```bash
    npm run dev
    ```

---