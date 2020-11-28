import { GraphQLServer } from 'graphql-yoga';

//Demo user data
const users = [{
  id: '1',
  name: 'Nick',
  email: 'test@teting.com',
  age: '37'
},{
  id: '2',
  name: 'Sara',
  email: 'test1@teting.com',
  age: '43'
}]

//Demo post data
const posts = [{
  id: '1',
  title: 'Looking for Love',
  body: 'Writing some words here as a post.',
  published: true
},{
  id: '2',
  title: 'Trying to Learn GraphQL',
  body: 'Learning some cool stuff and I like it. Adding the word here for testing',
  published: false
}]

// Type Definitions aka application schema
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    posts(query: String): [Post!]!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }


`

// Resolvers (set of functions)
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      } else {
        return users.filter((user) => {
          return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
      }
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      } else {
        return posts.filter((post) => {
          const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
          const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
          return isTitleMatch || isBodyMatch
        })
      }
    },
    me() {
      return {
        id: '123908',
        name: 'Nick',
        email: 'test@test.com',
        age: 37
      }
    },
    post() {
      return {
        id: '123456',
        title: 'What is Love?',
        body: 'lipsum',
        published: true
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('Server is running')
})