import { Flex, Spinner, Text } from "@chakra-ui/core";
import React from "react";
import useSWR from "swr";
import { fetcher } from "../utils/fetcher";
import { Post } from "./Post";
import { Post as PostType } from "../types";

export const Page = ({ index = 0 }: { index?: number }) => {
  const { data, error } = useSWR(
    `${process.env.REACT_APP_API_URL}/api/posts/page=${index}`,
    fetcher
  );

  if (!data && !error)
    return (
      <Flex>
        <Spinner mx="auto" />
      </Flex>
    );

  if (error) return <Text color="red">Error loading posts: {error}</Text>;

  return data.map((post: PostType) => (
    <Post key={post.id} post={post} pageIndex={index} />
  ));
};
