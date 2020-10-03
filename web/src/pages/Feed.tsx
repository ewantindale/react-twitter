import { Box, Button, Flex, Input, Text } from "@chakra-ui/core";
import axios from "axios";
import React, { useState } from "react";
import { mutate } from "swr";
import { Page } from "../components/Page";
import Wrapper from "../components/Wrapper";
import { useCurrentUser } from "../utils/useCurrentUser";
import { useIsAuthenticated } from "../utils/useIsAuthenticated";

export const Feed = () => {
  // useIsAuthenticated(); // user is redirected if they are not logged in
  const { user } = useCurrentUser();
  const [count, setCount] = useState(1);

  const pages = [];
  for (let i = 0; i < count; i++) {
    pages.push(<Page index={i} key={i} />);
  }

  const [postBody, setPostBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    setPostBody("");

    await axios({
      url: `${process.env.REACT_APP_API_URL}/api/posts`,
      method: "post",
      data: {
        body: postBody,
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    setIsLoading(false);

    mutate(`${process.env.REACT_APP_API_URL}/api/posts/page=0`);
  };

  const handlePostBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostBody(e.target.value);
  };

  return (
    <Wrapper>
      <form onSubmit={createPost}>
        <Flex maxW="500px" mx="auto">
          <Input
            type="text"
            placeholder="What's on your mind?"
            onChange={handlePostBodyChange}
            value={postBody}
            isDisabled={!user}
          />
          <Button
            type="submit"
            variantColor="blue"
            ml={2}
            isLoading={isLoading}
            isDisabled={!user}
          >
            Post
          </Button>
        </Flex>
      </form>
      {!user && (
        <Text textAlign="center" fontSize="0.8rem" color="grey" mt={4}>
          You must be logged in to create or like posts.
        </Text>
      )}

      <Text fontSize={25} fontWeight="bold" mt={4} ml={2}>
        Tweets
      </Text>
      <Box borderTop="1px solid lightgrey">{pages}</Box>
      <Flex>
        <Button
          onClick={() => setCount((count) => count + 1)}
          variantColor="blue"
          mt={4}
          mx="auto"
        >
          Load More
        </Button>
      </Flex>
    </Wrapper>
  );
};
