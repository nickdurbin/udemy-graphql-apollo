import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

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
  age: '43',
}]

//Demo post data
const posts = [{
  id: '1',
  title: 'Looking for Love',
  body: 'Writing some words here as a post.',
  published: true,
  author: '2'
},{
  id: '2',
  title: 'Trying to Learn GraphQL',
  body: 'Learning some cool stuff and I like it. Adding the word here for testing',
  published: false,
  author: '1'
}]

// Demo data for Comments
const comments = [{
  id: '1',
  text: 'Wow, this is a fantastic post.',
  author: '2',
  post: '1'
},{
  id: '2',
  text: 'What did you mean by that comment?',
  author: '1',
  post: '2'
}, {
  id: '3',
  text: 'What are your plans for a new course?',
  author: '1',
  post: '2'
}, {
  id: '4',
  text: 'This is a great course.',
  author: '2',
  post: '1'
}]

// Type Definitions aka application schema
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    },
    comments() {
      return comments
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => {
        return user.email === args.email
      })
      if (emailTaken) {
        throw new Error('Email is taken.')
      }

      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age
      }

      users.push(user)

      return user
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, cts, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) =>{
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post
      })
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