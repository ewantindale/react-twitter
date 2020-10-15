import axios from "axios";
import React from "react";
import { mutate } from "swr";
import { Link, useHistory } from "react-router-dom";
import { Box, Button, Flex, Text } from "@chakra-ui/core";
import { useCurrentUser } from "../utils/useCurrentUser";

export default function Navbar() {
  const history = useHistory();
  const { user } = useCurrentUser();

  const handleLogoutClicked = async () => {
    await axios({
      url: `${process.env.REACT_APP_API_URL}/api/users/logout`,
      method: "post",
      withCredentials: true,
    });
    mutate(`${process.env.REACT_APP_API_URL}/api/users/info`, null);
  };

  const handleLoginClicked = () => {
    history.push("/login");
  };

  const handleRegisterClicked = () => {
    history.push("/register");
  };

  const handleProfileClicked = () => {
    history.push("/profile");
  };

  return (
    <Box bg="#0053a6" position="fixed" top={0} width="100%" zIndex={1}>
      <Flex
        maxW="1200px"
        mx="auto"
        height="70px"
        justify="space-between"
        align="center"
        px={4}
      >
        <Link to="/">
          <Text fontSize={20} color="white" fontWeight="bold">
            React Twitter
          </Text>
        </Link>

        {user ? (
          <Flex align="center">
            <Button onClick={handleProfileClicked}>Profile</Button>
            <Button onClick={handleLogoutClicked} ml={2}>
              Log Out
            </Button>
          </Flex>
        ) : (
          <Flex>
            <Button onClick={handleLoginClicked}>Log In</Button>
            <Button onClick={handleRegisterClicked} ml={2}>
              Register
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
