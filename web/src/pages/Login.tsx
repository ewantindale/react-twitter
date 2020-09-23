import React, { useReducer } from "react";
import axios from "axios";
import { mutate } from "swr";
import { useHistory } from "react-router";
import { Box, Text, Input, Button, AlertIcon, Alert } from "@chakra-ui/core";

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
        url: `/api/users/login`,
        method: "post",
        data: {
          username,
          password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      mutate(`/api/users/info`);
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
    <Box maxW="500px" mx="auto" mt={4} bg="#0053a6" p={4} borderRadius={4}>
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
  );
};
