import { ApolloClient } from "apollo-client";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Login from "./pages/login";
import injectStyles from "./styles";
import React from "react";
import ReactDOM from "react-dom";
import Pages from "./pages";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { resolvers, typeDefs } from "./resolvers";

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "http://localhost:4000/"
});

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    headers: {
      authorization: localStorage.getItem("token")
    }
  }),
  typeDefs,
  resolvers
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    cartItems: []
  }
});

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>,
  document.getElementById("root")
);
