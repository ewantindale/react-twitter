import React, { useReducer } from "react";
import axios from "axios";
import { mutate } from "swr";
import { useHistory } from "react-router";
import { Button, Input, Box, Text } from "@chakra-ui/core";

const initialState = {
  username: "",
  email: "",
  password: "",
  error: "",
  isLoading: false,
};

const registerReducer = (state: any, action: any) => {
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
    case "submit":
      return {
        ...state,
        isLoading: true,
      };
  }
  return state;
};

export const Register = () => {
  const history = useHistory();
  const [
    { username, email, password, error, isLoading },
    dispatch,
  ] = useReducer(registerReducer, initialState);

  const register = async (e: React.FormEvent) => {
    dispatch({ type: "submit" });
    e.preventDefault();

    try {
      await axios({
        url: `${process.env.REACT_APP_API_URL}/api/users/register`,
        method: "post",
        data: {
          username,
          email,
          password,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      mutate(`${process.env.REACT_APP_API_URL}/api/users/info`);
      history.push("/");
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
        Create an account
      </Text>
      <form onSubmit={register}>
        <Input
          placeholder="username"
          name="username"
          value={username}
          onChange={handleFieldChanged}
          mt={4}
        />
        <Input
          placeholder="email"
          name="email"
          type="email"
          value={email}
          onChange={handleFieldChanged}
          mt={4}
        />
        <Input
          placeholder="password"
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
          Register
        </Button>
        <Text>{error}</Text>
      </form>
    </Box>
  );
};
