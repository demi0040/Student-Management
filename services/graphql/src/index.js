const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const http = require("http");
const { RESTDataSource } = require("apollo-datasource-rest");

class LoginAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:4001/graphql";
  }

  // Implement methods to interact with the Login microservice

  async getUser(username) {
    const response = await this.post("", {
      query: `query { getUser(username: "${username}") { id username password userType } }`,
    });
    return response.data.getUser;
  }

  async addUser(username, password, userType) {
    const response = await this.post("", {
      query: `
      mutation AddUser($username: String!, $password: String!, $userType: String!) { 
        addUser(username: $username, password: $password, userType: $userType) {
          id 
          username 
          password 
          userType 
        } 
      }
    `,
      variables: { username, password, userType },
    });

    return response.data.addUser;
  }
}

class ProfileAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:4002/graphql";
  }

  // Implement methods to interact with the Profile microservice

  async getProfile(userType, username) {
    const response = await this.post("", {
      query: `query { get${userType}(username: "${username}") { id username name email phone ${
        userType === "Parent"
          ? "children"
          : userType === "Teacher"
          ? "subject"
          : "grade"
      } } }`,
    });
    return response.data[`get${userType}`];
  }

  async addProfile(userType, username, name, email, phone, additionalField) {
    const additionalFieldName =
      userType === "Parent"
        ? "children"
        : userType === "Teacher"
        ? "subject"
        : "grade";
    const response = await this.post("", {
      query: `mutation { create${userType}(username: "${username}", name: "${name}", email: "${email}", phone: "${phone}", ${additionalFieldName}: "${additionalField}") { id username name email phone ${additionalFieldName} } }`,
    });
    return response.data[`create${userType}`];
  }
}

// Define the schema
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    userType: String!
  }

  union Profile = Student | Teacher | Parent

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
    children: [String!]!
  }

  type Query {
    getUser(username: String!): User
    getProfile(userType: String!, username: String!): Profile
  }

  type Mutation {
    addUser(username: String!, password: String!, userType: String!): User
    addProfile(
      userType: String!
      username: String!
      name: String!
      email: String!
      phone: String!
      additionalField: String!
    ): Profile
  }
`;

// Define resolvers for the schema
const resolvers = {
  Query: {
    getUser: async (_, { username }, { dataSources }) => {
      return dataSources.loginAPI.getUser(username);
    },
    getProfile: async (_, { userType, username }, { dataSources }) => {
      return dataSources.profileAPI.getProfile(userType, username);
    },
  },
  Mutation: {
    addUser: async (_, { username, password, userType }, { dataSources }) => {
      return dataSources.loginAPI.addUser(username, password, userType);
    },
    addProfile: async (
      _,
      { userType, username, name, email, phone, additionalField },
      { dataSources }
    ) => {
      return dataSources.profileAPI.addProfile(
        userType,
        username,
        name,
        email,
        phone,
        additionalField
      );
    },
  },
  Profile: {
    __resolveType(profile, context, info) {
      if (profile.grade) {
        return "Student";
      }
      if (profile.subject) {
        return "Teacher";
      }
      if (profile.children) {
        return "Parent";
      }
      return null;
    },
  },
};

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      loginAPI: new LoginAPI(),
      profileAPI: new ProfileAPI(),
    }),
  });

  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  httpServer.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer(typeDefs, resolvers);
