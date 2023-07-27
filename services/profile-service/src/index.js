// index.js
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { connectDB, getDB } = require("./db");

const app = express();
const PORT = 4002;

// Connect to MongoDB
connectDB();

// GraphQL schema
const schema = buildSchema(`
  type Student {
    id: ID!
    username: String!
    name: String!
    email: String!
    phone: String!
    grade: String!
  }

  type Teacher {
    id: ID!
    username: String!
    name: String!
    email: String!
    phone: String!
    subject: String!
  }

  type Parent {
    id: ID!
    username: String!
    name: String!
    email: String!
    phone: String!
    children: [Student!]!
  }

  type Query {
    getStudent(username: String!): Student
    getTeacher(username: String!): Teacher
    getParent(username: String!): Parent
  }

  type Mutation {
    createStudent(username: String!, name: String!, email: String!, phone: String!, grade: String!): Student
    createTeacher(username: String!, name: String!, email: String!, phone: String!, subject: String!): Teacher
    createParent(username: String!, name: String!, email: String!, phone: String!, children: [String!]!): Parent
  }
`);

// query and mutation resolvers here
const root = {
  getStudent: async ({ username }) => {
    const db = getDB();
    const student = await db.collection("students").findOne({ username });
    return student;
  },

  getTeacher: async ({ username }) => {
    const db = getDB();
    const teacher = await db.collection("teachers").findOne({ username });
    return teacher;
  },

  getParent: async ({ username }) => {
    const db = getDB();
    const parent = await db.collection("parents").findOne({ username });
    return parent;
  },

  createStudent: async ({ username, name, email, phone, grade }) => {
    const db = getDB();
    const result = await db
      .collection("students")
      .insertOne({ username, name, email, phone, grade });
    return { id: result.insertedId, username, name, email, phone, grade };
  },

  createTeacher: async ({ username, name, email, phone, subject }) => {
    const db = getDB();
    const result = await db
      .collection("teachers")
      .insertOne({ username, name, email, phone, subject });
    return { id: result.insertedId, username, name, email, phone, subject };
  },

  createParent: async ({ username, name, email, phone, children }) => {
    const db = getDB();
    const result = await db
      .collection("parents")
      .insertOne({ username, name, email, phone, children });
    return { id: result.insertedId, username, name, email, phone, children };
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
    `Profile microservice GraphQL server is running at http://localhost:${PORT}/graphql`
  );
});
