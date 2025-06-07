# My Blogging Web
<p align="center"><img  src="https://e7.pngegg.com/pngimages/598/629/png-clipart-vegeta-goku-dragon-ball-saiyan-super-saiya-lucky-draw-vertebrate-computer-wallpaper.png" alt="its" height=200px width=300px/></p>
AI Blog Hub is a full-stack web application designed for creating, managing, and publishing blog posts with the assistance of AI-powered content generation. It features a user-friendly single-page interface for interacting with the backend API, built with Node.js, Express, and MongoDB.

## Features

*   **Blog Post Management**: Create, read, and delete blog posts.
*   **AI Content Assistance**: Leverage Google Gemini to generate suggestions for blog post titles, subtitles, and content.
*   **Commenting System**: Allow users to comment on blog posts.
*   **Newsletter Subscription**: Enable users to subscribe to a newsletter.
*   **Admin Dashboard**:
    *   View and manage all blog posts.
    *   View and manage newsletter subscribers.
    *   Moderate (delete) comments.
    *   View site statistics (total posts, comments, subscribers).
*   **Single Page Application (SPA)**: A dynamic frontend experience within a single HTML file.

## Tech Stack

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB with Mongoose ODM
*   **AI Integration**: Google Generative AI (Gemini API)
*   **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
*   **Dependencies**:
    *   `@google/generative-ai`: For interacting with the Gemini API.
    *   `cors`: For enabling Cross-Origin Resource Sharing.
    *   `dotenv`: For managing environment variables.
    *   `express`: Web application framework.
    *   `mongoose`: MongoDB object modeling.
    *   `multer`: Middleware for handling `multipart/form-data` (listed in `package.json`, specific usage for file uploads not detailed in provided core routes).

## Project Structure

```
hyper-27-blogging-web/
├── models/               # Mongoose schemas (BlogPost.js, Subscriber.js)
├── public/               # Static frontend files (index.html)
├── routes/               # API route definitions (blogRoutes.js)
├── package.json          # Project metadata and dependencies
├── server.js             # Main Express server setup and entry point
└── .env                  # (To be created by user) Environment variables
```

## Setup and Installation

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)
*   MongoDB instance (local or cloud-hosted, e.g., MongoDB Atlas)
*   Google Gemini API Key

### Steps

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/hyper-27/blogging-web.git
    cd blogging-web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory of the project. Add the following configuration, replacing the placeholder values with your actual credentials and settings:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_google_gemini_api_key
    ```
    *   `PORT`: The port on which the server will run (default is 5000).
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `GEMINI_API_KEY`: Your API key for Google Gemini.

4.  **Run the application**:
    ```bash
    npm start
    ```
    The server will start, typically on `http://localhost:5000` (or the port specified in your `.env` file). You can access the AI Blog Hub application by navigating to this address in your web browser.

## API Endpoints

All API routes are prefixed with `/api`.

### Blog Posts
*   `GET /posts`: Retrieve all blog posts.
*   `POST /posts`: Create a new blog post.
    *   Body: `{ title, subtitle, content, category, author, email }`
*   `DELETE /posts/:id`: Delete a specific blog post by its ID.

### Comments
*   `POST /posts/:postId/comments`: Add a comment to a specific blog post.
    *   Body: `{ author, content }`
*   `DELETE /posts/:postId/comments/:commentId`: Delete a specific comment from a blog post.

### Subscribers
*   `GET /subscribers`: Retrieve all newsletter subscribers (admin).
*   `POST /subscribe`: Subscribe an email address to the newsletter.
    *   Body: `{ email }`
*   `DELETE /subscribers/:id`: Unsubscribe an email address by its ID (admin).

### AI Generation
*   `POST /ai-generate`: Generate content suggestions using Google Gemini.
    *   Body: `{ prompt }`
    *   Returns: `{ titles: [], subtitles: [], descriptions: [] }`

## Frontend

The frontend is a Single Page Application (SPA) served from `public/index.html`. It directly interacts with the backend API to provide a dynamic user experience for creating posts, viewing content, managing subscriptions, and accessing admin functionalities.
