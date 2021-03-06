import React, { useReducer } from "react";
import axios from "axios";
import { mutate } from "swr";
import { useHistory } from "react-router";
import {
  Box,
  Text,
  Input,
  Button,
  AlertIcon,
  Alert,
  Flex,
} from "@chakra-ui/core";

const initialState = {
  username: "",
  password: "",
  error: "",
  isLoading: false,
};

const loginReducer = (state: any, action: any) => {
  switch (action.type) {
    case "field_changed":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "error":
      return {
        ...state,
        error: action.message,
        isLoading: false,
      };
    case "login":
      return {
        ...state,
        isLoading: true,
      };
  }
  return state;
};

export const Login = () => {
  const history = useHistory();
  const [{ username, password, error, isLoading }, dispatch] = useReducer(
    loginReducer,
    initialState
  );

  const login = async (e: React.FormEvent) => {
    dispatch({ type: "login" });
    e.preventDefault();

    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/users/login`,
        method: "post",
        data: {
          username,
          password,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      await mutate(`${process.env.REACT_APP_API_URL}/api/users/info`);
      history.replace("/");
    } catch (err) {
      dispatch({ type: "error", message: err.response.data.error });
    }
  };

  const handleFieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "field_changed",
      field: e.target.name,
      value: e.target.value,
    });
  };

  return (
    <Flex
      bg="#0053a6"
      height="100vh"
      direction="column"
      align="center"
      justify="center"
    >
      <Box width="100%" maxWidth="500px" p={4} borderRadius={4}>
        <Text color="white" fontSize={25}>
          Log in
        </Text>
        <form onSubmit={login}>
          <Input
            placeholder="username"
            margin="normal"
            name="username"
            autoFocus
            value={username}
            onChange={handleFieldChanged}
            mt={4}
          />
          <Input
            placeholder="password"
            margin="normal"
            name="password"
            type="password"
            value={password}
            onChange={handleFieldChanged}
            mt={4}
          />
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            mt={4}
            w="100%"
          >
            Log In
          </Button>
          {error ? (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          ) : null}
        </form>
      </Box>
    </Flex>
  );
};
