import { buildSchema } from 'graphql';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

const users = [
  { id: 1, name: 'Astha Singh', cfhandle: 'nobita1729' },
  { id: 2, name: 'nhp', cfhandle: 'sadchamp' },
  { id: 3, name: 'give up', cfhandle: 'pepeKMS' },
];

const schema = buildSchema(`
    input UserInput {
        cfhandle: String!
        name: String!
    }

    type User {
        id: Int!
        name: String!
        cfhandle: String!
    }

    type Mutation {
        createUser(input: UserInput): User
        updateUser(id: Int!, input: UserInput): User
    }

    type Query {
        getUser(id: String): User
        getUsers: [User]
    }
`);

type User = {
  id: number;
  name: string;
  cfhandle: string;
};

type UserInput = Pick<User, 'cfhandle' | 'name'>;

const getUser = (args: { id: number }): User | undefined =>
  users.find((u) => u.id === args.id);

const getUsers = (): User[] => users;

const createUser = (args: { user: UserInput }): User => {
  const user = {
    id: users.length + 1,
    ...args.user,
  };
  users.push(user);

  return user;
};

const updateUser = (args: { user: User }): User => {
  const index = users.findIndex((u) => u.id === args.user.id);
  const targetUser = users[index];

  if (targetUser) users[index] = args.user;

  return targetUser;
};

const root = {
  getUser,
  getUsers,
  createUser,
  updateUser,
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 8000;

app.listen(PORT);

console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
