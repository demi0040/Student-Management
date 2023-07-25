const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 4001; // You can choose any available port for the server

// Connect to SQLite database
const db = new sqlite3.Database("data/login.db"); // Using in-memory database for simplicity
// Replace ':memory:' with an actual file path for persistent database storage if needed

// Create a table for users (login information)
// Create a table for users (login information)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      userType TEXT NOT NULL
    )
  `);
});

// Your GraphQL schema
const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
    password: String!
    userType: String!  # New field for user role (student, teacher, parent)
  }

  type Query {
    getUser(id: ID!): User
  }

  type Mutation {
    addUser(username: String!, password: String!, userType: String!): User  # Include userType in the mutation
  }
`);

// Define your query and mutation resolvers here
const root = {
  getUser: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", id, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  addUser: ({ username, password, userType }) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO users (username, password, userType) VALUES (?, ?, ?)",
        username,
        password,
        userType,
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username, password, userType }); // Return userType in the response
          }
        }
      );
    });
  },
};

// Create a GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL GUI for testing
  })
);

// Start the server
app.listen(PORT, () => {
  console.log(
    `Login microservice GraphQL server is running at http://localhost:${PORT}/graphql`
  );
});
