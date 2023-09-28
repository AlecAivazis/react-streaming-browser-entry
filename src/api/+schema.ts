import { createSchema } from "graphql-yoga";

import { connectionFromArray } from "./util";
import { shows, genres } from "./data";

// load the graphql schema from disk
const typeDefs = `scalar Cursor

type Query {
  shows(
    first: Int
    after: Cursor
    last: Int
    before: Cursor
    delay: Int
  ): ShowConnection!
  viewer: User

  show(id: ID!): Show

  genres(
    first: Int
    after: Cursor
    last: Int
    before: Cursor
    delay: Int
  ): GenreConnection!

  suggestion(delay: Int): Show!
}

type User {
  id: ID!
  profile: Image
  favoriteShows: ShowConnection!
}

type Show {
  id: ID!
  name: String!
  poster: Image!
  billboard: Image!
  description: String!
  seasons: SeasonConnection!
  genres: [Genre!]!
}

type Season {
  id: ID!
  name: String
  episodes: EpisodeConnection!
}

type Genre {
  id: ID!
  name: String!
  shows: ShowConnection!
}

type Episode {
  id: ID!
  director: [Person!]!
  number: Int!
  name: String!
  cast: PersonConnection!
}

type Person {
  id: ID!
  name: String!
  photo: Image!
}

type Image {
  source: String!
}

type PersonConnection {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [PersonEdge!]!
}

type PersonEdge {
  cursor: Cursor
  node: Person!
}

type EpisodeConnection {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [EpisodeEdge!]!
}

type EpisodeEdge {
  cursor: Cursor
  node: Episode!
}

type SeasonConnection {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [SeasonEdge!]!
}

type SeasonEdge {
  cursor: Cursor
  node: Season!
}

type ShowConnection {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [ShowEdge!]!
}

type ShowEdge {
  cursor: Cursor
  node: Show!
}

type GenreConnection {
  totalCount: Int!
  pageInfo: PageInfo!
  edges: [GenreEdge!]!
}

type GenreEdge {
  cursor: Cursor
  node: Genre!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: Cursor
  endCursor: Cursor
}`;

// define the executable schema
export default createSchema({
  typeDefs,
  resolvers: {
    Show: {
      id: (show) => Buffer.from(`Show:${show.id}`).toString("base64"),
    },
    Query: {
      show(_, { id }) {
        return shows[
          parseInt(Buffer.from(id, "base64").toString().split(":")[1])
        ];
      },
      async shows(_, args) {
        if (args.delay) {
          await sleep(args.delay);
        }

        return connectionFromArray(Object.values(shows), args);
      },
      suggestion: async (_, args) => {
        if (args.delay) {
          await sleep(args.delay);
        }

        // pick a random number between 0 and the length of the shows
        const keys: string[] = Object.keys(shows);
        return shows[parseInt(keys[Math.floor(Math.random() * keys.length)])];
      },
      viewer: () => ({
        id: "1",
        profile: {
          source: "https://avatars.githubusercontent.com/u/916317?v=4",
        },
        favoriteShows: connectionFromArray(
          [shows["1"], shows["2"], shows["3"], shows["4"]],
          {}
        ),
      }),
      async genres(_, args) {
        if (args.delay) {
          await sleep(args.delay);
        }

        const list = Object.values(genres);

        return connectionFromArray(list, args);
      },
    },
    Genre: {
      shows: (self, args) => {
        // find the shows with the genre
        const with_genre = Object.values(shows).filter((show) =>
          show.genres.some((genre) => genre.id === self.id)
        );

        return connectionFromArray(with_genre, args);
      },
    },
  },
});

const sleep = (amount: number) =>
  new Promise((resolve) => setTimeout(resolve, amount));
