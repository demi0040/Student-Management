const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 4001;

// Connect to SQLite database
const db = new sqlite3.Database("data/login.db");

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
    getUser(username: String!): User
  }

  type Mutation {
    addUser(username: String!, password: String!, userType: String!): User  # Include userType in the mutation
  }
`);

// query and mutation resolvers
const root = {
  getUser: ({ username }) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE username = ?", username, (err, row) => {
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

// GraphQL endpoint
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
