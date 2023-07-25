// index.js
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { connectDB, getDB } = require("./db");

const app = express();
const PORT = 4002; // Choose any available port for the server

// Connect to MongoDB
connectDB();

// Your GraphQL schema
const schema = buildSchema(`
  type Student {
    id: ID!
    loginId: String!
    name: String!
    email: String!
    phone: String!
    grade: String!
  }

  type Teacher {
    id: ID!
    loginId: String!
    name: String!
    email: String!
    phone: String!
    subject: String!
  }

  type Parent {
    id: ID!
    loginId: String!
    name: String!
    email: String!
    phone: String!
    children: [Student!]!
  }

  type Query {
    getStudent(loginId: String!): Student
    getTeacher(loginId: String!): Teacher
    getParent(loginId: String!): Parent
  }

  type Mutation {
    createStudent(loginId: String!, name: String!, email: String!, phone: String!, grade: String!): Student
    createTeacher(loginId: String!, name: String!, email: String!, phone: String!, subject: String!): Teacher
    createParent(loginId: String!, name: String!, email: String!, phone: String!, children: [String!]!): Parent
  }
`);

// Define your query and mutation resolvers here
const root = {
  getStudent: async ({ loginId }) => {
    const db = getDB();
    const student = await db.collection("students").findOne({ loginId });
    return student;
  },

  getTeacher: async ({ loginId }) => {
    const db = getDB();
    const teacher = await db.collection("teachers").findOne({ loginId });
    return teacher;
  },

  getParent: async ({ loginId }) => {
    const db = getDB();
    const parent = await db.collection("parents").findOne({ loginId });
    return parent;
  },

  createStudent: async ({ loginId, name, email, phone, grade }) => {
    const db = getDB();
    const result = await db
      .collection("students")
      .insertOne({ loginId, name, email, phone, grade });
    return { id: result.insertedId, loginId, name, email, phone, grade };
  },

  createTeacher: async ({ loginId, name, email, phone, subject }) => {
    const db = getDB();
    const result = await db
      .collection("teachers")
      .insertOne({ loginId, name, email, phone, subject });
    return { id: result.insertedId, loginId, name, email, phone, subject };
  },

  createParent: async ({ loginId, name, email, phone, children }) => {
    const db = getDB();
    const result = await db
      .collection("parents")
      .insertOne({ loginId, name, email, phone, children });
    return { id: result.insertedId, loginId, name, email, phone, children };
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
    `Profile microservice GraphQL server is running at http://localhost:${PORT}/graphql`
  );
});
