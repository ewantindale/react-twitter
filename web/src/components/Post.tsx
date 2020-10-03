import { Box, Flex, Text } from "@chakra-ui/core";
import axios from "axios";
import { Image as CloudinaryImage, Transformation } from "cloudinary-react";
import { format } from "date-fns";
import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { mutate } from "swr";
import { Post as PostType } from "../types";
import { useCurrentUser } from "../utils/useCurrentUser";

interface Props {
  post: PostType;
  pageIndex: number;
}

export const Post = ({ post, pageIndex }: Props) => {
  const { user } = useCurrentUser();

  const deletePost = async () => {
    await axios({
      url: `${process.env.REACT_APP_API_URL}/api/posts/${post.id}/`,
      method: "delete",
      withCredentials: true,
    });

    await mutate(
      `${process.env.REACT_APP_API_URL}/api/posts/page=${pageIndex}`
    );
  };

  const likePost = async () => {
    if (!user) return;
    await mutate(
      `${process.env.REACT_APP_API_URL}/api/posts/page=${pageIndex}`,
      async (data: [PostType]) =>
        data.map((p: PostType) =>
          p.id === post.id
            ? {
                ...post,
                likes: post.likeStatus
                  ? post.likes.filter(
                      (l: { userId: number; postId: number }) =>
                        l.userId !== user.id
                    )
                  : [...post.likes, { postId: post.id, userId: user.id }],
                likeStatus: !post.likeStatus,
              }
            : { ...p }
        ),
      false
    );

    await axios({
      url: `${process.env.REACT_APP_API_URL}/api/likes/${post.id}`,
      method: post.likeStatus ? "delete" : "post",
      withCredentials: true,
    });

    await mutate(
      `${process.env.REACT_APP_API_URL}/api/posts/page=${pageIndex}`
    );
  };

  return (
    <Flex key={post.id} borderBottom="1px solid lightgrey" p={2}>
      <Box mr={4}>
        <CloudinaryImage
          cloudName="dgnjcfkk9"
          publicId={post.author.pictureId}
          width="75"
          crop="scale"
        >
          <Transformation
            width="500"
            height="500"
            gravity="face"
            radius="max"
            crop="crop"
          />
        </CloudinaryImage>
      </Box>
      <Flex display="column" w="100%" h="100%">
        <Flex justify="space-between">
          <Text fontWeight="bold">{post.author.username}</Text>
          <Text color="grey">
            {format(new Date(post.createdAt), "h:ma MM/dd/yyyy")}
          </Text>
        </Flex>
        <Box>
          <Text>{post.body}</Text>
        </Box>
        <Flex align="center" justify="space-between" mt={2} color="grey">
          <Flex fontSize={20} align="center">
            {post.likeStatus ? (
              <Box as={AiFillHeart} onClick={likePost} color="#dd0000" />
            ) : (
              <Box as={AiOutlineHeart} onClick={likePost} />
            )}
            <Text
              ml={1}
              color={post.likeStatus ? "#dd0000" : "grey"}
              fontSize={15}
            >
              {post.likes.length}
            </Text>
          </Flex>

          {user && post.author.id === user.id ? (
            <Box as={FaTrash} fontSize={15} onClick={deletePost} />
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  );
};
