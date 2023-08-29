export const typeDefs = `#graphql

type Query {
  games: [Game]
  game(title: String!): Game
}

type Game {
  id: ID!
  title: String
  yearpublished: String
  thumbnail: String
  publisher: String
  description: String
}
`;
