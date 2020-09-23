import { Button } from "@chakra-ui/core";
import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface Props {
  likeStatus: boolean;
  likePost: any;
}

export const LikeButton = ({ likeStatus, likePost }: Props) => {
  if (likeStatus) {
    return (
      <Button>
        <AiFillHeart onClick={likePost} />
      </Button>
    );
  } else {
    return (
      <Button>
        <AiOutlineHeart onClick={likePost} />
      </Button>
    );
  }
};
