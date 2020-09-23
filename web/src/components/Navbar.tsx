import axios from "axios";
import React from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "../utils/fetcher";
import { Link, useHistory } from "react-router-dom";
import { Box, Button, Flex, Text } from "@chakra-ui/core";

export default function Navbar() {
  const history = useHistory();
  const { data } = useSWR(`/api/users/info`, fetcher);

  const logout = async () => {
    await axios({
      url: `/api/users/logout`,
      method: "post",
    });
    mutate(`/api/users/info`);
  };

  const handleLoginClicked = () => {
    history.push("/login");
  };

  const handleRegisterClicked = () => {
    history.push("/register");
  };

  return (
    <Box bg="#0053a6">
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

        {data && data.username ? (
          <Flex align="center">
            <Text color="white">
              you are logged in as <Link to="/profile">{data.username}</Link>
            </Text>
            <Button onClick={logout} ml={2}>
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
