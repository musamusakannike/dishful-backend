# Express API Starter

How to use this template:

```sh
npx create-express-api --directory my-api-name
```

Includes API Server utilities:

* [morgan](https://www.npmjs.com/package/morgan)
  * HTTP request logger middleware for node.js
* [helmet](https://www.npmjs.com/package/helmet)
  * Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
* [dotenv](https://www.npmjs.com/package/dotenv)
  * Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`
* [cors](https://www.npmjs.com/package/cors)
  * CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

Development utilities:

* [nodemon](https://www.npmjs.com/package/nodemon)
  * nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
* [eslint](https://www.npmjs.com/package/eslint)
  * ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
* [jest](https://www.npmjs.com/package/jest)
  * Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
* [supertest](https://www.npmjs.com/package/supertest)
  * HTTP assertions made easy via superagent.

## Setup

```
npm install
```

## Lint

```
npm run lint
```

## Test

```
npm test
```

## Development

```
npm run dev
```
### **API Documentation for Frontend Developers**

This documentation outlines the API endpoints and necessary details for integrating the backend functionality into your frontend application. The backend is built using JWT authentication and Cloudinary for image uploads, with endpoints for user authentication, recipe management, and logging out.

---

### **Base URL**
For local development:
```
http://localhost:4000/api
```

---

## **Authentication Endpoints**

### **1. Register User**
**URL**: `/auth/register`  
**Method**: `POST`  
**Description**: Registers a new user.

**Request Body**:
```json
{
  "username": "newuser",
  "password": "newpassword"
}
```

**Response** (Success - Status: 201):
```json
{
  "status": "SUCCESS",
  "message": "User created"
}
```

---

### **2. Login User**
**URL**: `/auth/login`  
**Method**: `POST`  
**Description**: Logs in an existing user and sets the JWT token as a cookie.

**Request Body**:
```json
{
  "username": "newuser",
  "password": "newpassword"
}
```

**Response** (Success - Status: 200):
```json
{
  "status": "SUCCESS",
  "message": "Login successful"
}
```

**Important**: The JWT token will be stored in a cookie named `token`.

---

### **3. Logout User**
**URL**: `/auth/logout`  
**Method**: `POST`  
**Description**: Logs out the current user by clearing the authentication cookie.

**Request Body**: None

**Response** (Success - Status: 200):
```json
{
  "message": "Logout successful"
}
```

---

## **Recipe Endpoints**

### **4. Create Recipe (with Image Upload)**
**URL**: `/recipe`  
**Method**: `POST`  
**Description**: Allows an authenticated user to post a new recipe, including uploading an image to Cloudinary.

**Request Body (Form Data)**:
- **title**: Text (e.g., "Spaghetti Carbonara")
- **ingredients**: Array of strings (e.g., `["Spaghetti", "Eggs", "Pancetta"]`)
- **instructions**: Text (e.g., "Boil pasta...")
- **tags**: Array of strings (e.g., `["Italian", "Dinner"]`)
- **image**: Image file (e.g., `image/jpeg`, `image/png`)

Example Form Data in **Postman**:
- `title`: Spaghetti Carbonara
- `ingredients[]`: Spaghetti, Eggs, Pancetta
- `instructions`: Cook the spaghetti...
- `tags[]`: Italian, Dinner
- `image`: (choose an image file)

**Response** (Success - Status: 201):
```json
{
  "status": "SUCCESS",
  "message": "New Recipe Posted"
}
```

**Note**: Ensure you're passing the JWT token in cookies when making this request.

---

### **5. Get All Recipes**
**URL**: `/recipe`  
**Method**: `GET`  
**Description**: Fetches all recipes for authenticated users.

**Response** (Success - Status: 200):
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "title": "Spaghetti Carbonara",
      "ingredients": ["Spaghetti", "Eggs", "Pancetta"],
      "instructions": "Boil pasta...",
      "tags": ["Italian", "Dinner"],
      "image": "https://res.cloudinary.com/your-cloudinary-id/image/upload/...",
      "postedBy": "user_id"
    },
    ...
  ]
}
```

---

### **6. Get Single Recipe**
**URL**: `/recipe/:id`  
**Method**: `GET`  
**Description**: Fetches a single recipe by its ID.

**Response** (Success - Status: 200):
```json
{
  "status": "SUCCESS",
  "data": {
    "title": "Spaghetti Carbonara",
    "ingredients": ["Spaghetti", "Eggs", "Pancetta"],
    "instructions": "Boil pasta...",
    "tags": ["Italian", "Dinner"],
    "image": "https://res.cloudinary.com/your-cloudinary-id/image/upload/...",
    "postedBy": "user_id"
  }
}
```

---

### **7. Update Recipe**
**URL**: `/recipe/:id`  
**Method**: `PUT`  
**Description**: Updates an existing recipe. Only the user who created the recipe can update it.

**Request Body** (Form Data):
- **title**: Text (e.g., "Updated Title")
- **ingredients**: Array of strings (e.g., `["Updated Ingredient"]`)
- **instructions**: Text (e.g., "Updated instructions")
- **tags**: Array of strings (e.g., `["Updated Tag"]`)
- **image**: Image file (optional, for updating)

**Response** (Success - Status: 200):
```json
{
  "status": "SUCCESS",
  "message": "Recipe updated"
}
```

---

### **8. Delete Recipe**
**URL**: `/recipe/:id`  
**Method**: `DELETE`  
**Description**: Deletes a recipe by its ID. Only the user who created the recipe can delete it.

**Response** (Success - Status: 200):
```json
{
  "status": "SUCCESS",
  "message": "Recipe deleted"
}
```

---

## **Error Handling**
If an error occurs, you will receive a response in this format:
```json
{
  "status": "ERROR",
  "message": "Error message",
  "data": null
}
```

---

## **Authentication Middleware**
You need to ensure that each request to protected routes (like creating, updating, or deleting recipes) includes the `token` cookie, which will be automatically sent if the user is authenticated.

For requests that involve sensitive operations (like updating or deleting), ensure that the user making the request is the owner of the recipe.

---

### **CORS & Security**
Make sure your frontend app is correctly configured to handle **CORS**. For example:
- Set `withCredentials: true` in Axios requests to ensure cookies are sent for requests made from the frontend.
- Ensure that the cookie is handled securely in a production environment.

---

### **Logout Process**
To log out a user from your frontend, simply make a `POST` request to the `/auth/logout` route and ensure that the user’s cookie is cleared from the client side as well.

```javascript
await fetch("http://localhost:4000/api/auth/logout", {
  method: "POST",
  credentials: "include"  // Send cookies with request
});
```

---

### **Using Cloudinary for Image Upload**
- Ensure you use `FormData` to upload images along with other data.
- In **Postman**, you can upload images by switching the request body type to **form-data** and selecting a file for the `image` field.

---

Let me know if you need further assistance or have specific frontend integration issues!