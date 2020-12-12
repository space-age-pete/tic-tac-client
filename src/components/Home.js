import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  ADD_PLAYER_MUTATION,
  NEW_GAME_MUTATION,
  // GAME_SUBSCRIPTION,
  // CLEAR_PLAYERS_MUTATION,
  // MAKE_MOVE_MUTATION,
} from "../utils/graphql";
import jwtDecode from "jwt-decode";
import { Button, Divider, Form, Grid, Segment } from "semantic-ui-react";

function Home({ join }) {
  const [joinName, setJoinName] = useState("");
  const [newName, setNewName] = useState("");
  const [code, setCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [newError, setNewError] = useState("");

  useEffect(() => {
    console.log("this ran");
    if (joinError) setTimeout(() => setJoinError(""), 1000);
    if (newError) setTimeout(() => setNewError(""), 1000);
  }, [joinError, newError]);

  const [joinGame] = useMutation(ADD_PLAYER_MUTATION, {
    onCompleted({ joinGame: token }) {
      // nameRef.current.value = "";
      //setName("");
      console.log(token);
      localStorage.setItem("jwtToken", token);
      const decodedToken = jwtDecode(token);

      join({ name: joinName, token, gameId: decodedToken.id });
    },
    onError: (err) => {
      setJoinError(err.graphQLErrors?.[0]?.message);
    },
    variables: { name: joinName, code },
  });

  const [newGame] = useMutation(NEW_GAME_MUTATION, {
    onCompleted({ newGame: token }) {
      // nameRef.current.value = "";
      //setName("");
      console.log(token);
      console.log(jwtDecode(token));
      const decodedToken = jwtDecode(token);
      localStorage.setItem("jwtToken", token);

      //should be recieving this info from backend as an object tbh
      //also need to subscribe to proper room
      join({ name: newName, token, gameId: decodedToken.id });
    },
    onError: (err) => {
      setNewError(err.graphQLErrors?.[0]?.message);
    },
    variables: { name: newName },
  });

  const codeInputHandler = ({ target: { value } }) => {
    if (value.length < 5) setCode(value.toUpperCase());
  };

  return (
    <div>
      <h1>TIC-TAC-TOE</h1>
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            <h3>Join a Game</h3>
            <Form>
              <Form.Input
                icon="user"
                iconPosition="left"
                label="Name"
                placeholder="Name"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
              />
              <Form.Input
                icon="hashtag"
                iconPosition="left"
                label="4-Digit Room Code"
                placeholder="Room Code"
                value={code}
                onChange={codeInputHandler}
              />

              <Button content="Login" primary onClick={joinGame} />
            </Form>
          </Grid.Column>

          <Grid.Column
          //  verticalAlign="middle"
          >
            <h3>Start a New Game</h3>
            <Form>
              <Form.Input
                icon="user"
                iconPosition="left"
                label="Name"
                placeholder="Name"
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
              />

              <Button content="Create Game" primary onClick={newGame} />
            </Form>
          </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
      </Segment>
    </div>
  );
}

export default Home;
