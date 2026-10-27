const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

/**
 * Check if the username is valid for registration (i.e., not already registered).
 * @param {string} username
 * @returns {boolean}
 */
const isValid = (username) => {
  if (!username || typeof username !== 'string') return false;
  const matching = users.filter((user) => user.username.trim() === username.trim());
  return matching.length === 0;
};

/**
 * Check if username and password match any registered user.
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
const authenticatedUser = (username, password) => {
  if (!username || !password) return false;
  const matching = users.filter((user) => user.username === username && user.password === password);
  return matching.length > 0;
};

// Task 7: Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials. Check username and password" });
  }

  // Generate JWT token
  const accessToken = jwt.sign(
    { username: username },
    'access',
    { expiresIn: 60 * 60 }
  );

  // Save session authorization
  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({
    message: "User successfully logged in",
    token: accessToken
  });
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session?.authorization?.username || req.user?.username;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required in query parameter 'review'" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for ISBN " + isbn });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // If the same user reviews the same ISBN again, update their existing review.
  // If a different user reviews the same ISBN, retain both users' reviews.
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `Review for ISBN ${isbn} by user '${username}' added/updated successfully`,
    reviews: books[isbn].reviews
  });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session?.authorization?.username || req.user?.username;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found for ISBN " + isbn });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: `No review found for user '${username}' on ISBN ${isbn}` });
  }

  // Delete only the current user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for ISBN ${isbn} posted by ${username} deleted.`,
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
