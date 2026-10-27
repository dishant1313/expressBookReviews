const http = require('http');
const url = require('url');
const books = require('./booksdb.js');

const DATA_SERVICE_PORT = process.env.DATA_SERVICE_PORT || 5001;
const DATA_SERVICE_URL = `http://localhost:${DATA_SERVICE_PORT}`;

let serverInstance = null;

/**
 * Starts a minimal local HTTP data service serving the books dataset.
 * This allows Axios to perform genuine, non-recursive asynchronous HTTP requests
 * without fabricating external APIs or calling the main Express app recursively.
 */
function startDataService(port = DATA_SERVICE_PORT) {
  if (serverInstance) {
    return Promise.resolve(serverInstance);
  }

  return new Promise((resolve) => {
    serverInstance = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;

      res.setHeader('Content-Type', 'application/json');

      // GET /books or GET /
      if (pathname === '/books' || pathname === '/') {
        res.writeHead(200);
        return res.end(JSON.stringify(books));
      }

      // GET /books/isbn/:isbn
      if (pathname.startsWith('/books/isbn/')) {
        const isbn = pathname.replace('/books/isbn/', '').trim();
        if (books[isbn]) {
          res.writeHead(200);
          return res.end(JSON.stringify(books[isbn]));
        } else {
          res.writeHead(404);
          return res.end(JSON.stringify({ message: "Book not found" }));
        }
      }

      // GET /books/author/:author
      if (pathname.startsWith('/books/author/')) {
        const rawAuthor = pathname.replace('/books/author/', '');
        const author = decodeURIComponent(rawAuthor).trim().toLowerCase();
        const results = Object.keys(books)
          .filter(key => books[key].author.toLowerCase() === author)
          .map(key => books[key]);

        if (results.length > 0) {
          res.writeHead(200);
          return res.end(JSON.stringify(results));
        } else {
          res.writeHead(404);
          return res.end(JSON.stringify({ message: "No books found for author" }));
        }
      }

      // GET /books/title/:title
      if (pathname.startsWith('/books/title/')) {
        const rawTitle = pathname.replace('/books/title/', '');
        const title = decodeURIComponent(rawTitle).trim().toLowerCase();
        const results = Object.keys(books)
          .filter(key => books[key].title.toLowerCase() === title)
          .map(key => books[key]);

        if (results.length > 0) {
          res.writeHead(200);
          return res.end(JSON.stringify(results));
        } else {
          res.writeHead(404);
          return res.end(JSON.stringify({ message: "No books found with title" }));
        }
      }

      res.writeHead(404);
      return res.end(JSON.stringify({ message: "Endpoint not found in data service" }));
    });

    serverInstance.listen(port, () => {
      // Unref so server doesn't hold open test scripts
      if (serverInstance.unref) {
        serverInstance.unref();
      }
      resolve(serverInstance);
    });

    serverInstance.on('error', (err) => {
      // In case port is already in use by another worker, continue gracefully
      resolve(serverInstance);
    });
  });
}

function stopDataService() {
  if (serverInstance) {
    return new Promise((resolve) => {
      serverInstance.close(() => {
        serverInstance = null;
        resolve();
      });
    });
  }
  return Promise.resolve();
}

module.exports = {
  startDataService,
  stopDataService,
  DATA_SERVICE_PORT,
  DATA_SERVICE_URL
};
