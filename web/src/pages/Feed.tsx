import { Box, Button, Flex, Input, Spinner, Text } from "@chakra-ui/core";
import axios from "axios";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import Wrapper from "../components/Wrapper";
import { fetcher } from "../utils/fetcher";
import { useIsAuthenticated } from "../utils/useIsAuthenticated";
import { Post } from "../components/Post";
import { Post as PostType } from "../types";

export const Feed = () => {
  useIsAuthenticated(); // user is redirected if they are not logged in
  const { data, error } = useSWR(
    `${process.env.REACT_APP_API_URL}/api/posts`,
    fetcher
  );

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

    mutate(`${process.env.REACT_APP_API_URL}/api/posts`);
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
          />
          <Button
            type="submit"
            variantColor="blue"
            ml={2}
            isLoading={isLoading}
          >
            Post
          </Button>
        </Flex>
      </form>

      <Text fontSize={25} fontWeight="bold" mt={4}>
        Tweets
      </Text>
      <Box borderTop="1px solid lightgrey">
        {data ? (
          data.map((post: PostType) => <Post key={post.id} post={post} />)
        ) : error ? (
          <Text color="red">Error loading posts</Text>
        ) : (
          <Spinner />
        )}
      </Box>
    </Wrapper>
  );
};
