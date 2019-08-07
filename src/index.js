const Koa = require('koa')
const { ApolloServer, gql } = require('apollo-server-koa')
const { random, name } = require('faker/locale/fr')

const typeDefs = gql`
  type Person {
    lastname: String,
    firstname: String,
  }

  type Query {
    persons: [Person]
  }
`

const resolvers = {
  Query: {
    persons: () => { throw Error("Not yet implemented") },
  },
}

const randomArray = (min, max, callback) => {
  const size = random.number(({ min, max }))
  return Array.from({ length: size }, callback)
}

const mockResolvers = {
  Query: () => ({
    persons: () => randomArray(2, 6, () => ({
      firstname: name.firstName(),
      lastname: name.lastName(),
    })),
  })
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: process.env.NODE_ENV === 'mock' ? mockResolvers : false,
})

const app = new Koa()
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
)
