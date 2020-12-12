import { gql } from "@apollo/client";

//MUTATIONS:

export const ADD_PLAYER_MUTATION = gql`
  mutation addPlayer($name: String!, $code: String!) {
    joinGame(name: $name, code: $code)
  }
`;

export const NEW_GAME_MUTATION = gql`
  mutation newGame($name: String!) {
    newGame(name: $name)
  }
`;

export const CLEAR_PLAYERS_MUTATION = gql`
  mutation {
    clearPlayers
  }
`;

export const REMATCH_MUTATION = gql`
  mutation {
    rematch
  }
`;

export const MAKE_MOVE_MUTATION = gql`
  mutation makeMove($name: String!, $x: Int!, $y: Int!) {
    makeMove(name: $name, x: $x, y: $y)
  }
`;

//SUBSCRIPTIONS:

export const GAME_SUBSCRIPTION = gql`
  subscription followGame($id: ID!) {
    renameGame(id: $id) {
      id
      player1 {
        name
      }
      player2 {
        name
      }
      turn
      board
      winner
      code
    }
  }
`;
