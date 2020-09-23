import React from "react";
import Wrapper from "../components/Wrapper";
import { Box, Button, Input, Text, Image } from "@chakra-ui/core";
import { useIsAuthenticated } from "../utils/useIsAuthenticated";
import { useState } from "react";
import axios from "axios";

export default function Profile() {
  useIsAuthenticated();

  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      previewFile(file);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result as string);
    };
  };

  const handleSubmitFile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  };

  const uploadImage = async (base64EncodedImage: string) => {
    console.log(base64EncodedImage);
    try {
      await axios(`/api/upload`, {
        method: "post",
        data: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <Box>
        <Text fontSize={25} fontWeight="bold">
          Your Profile
        </Text>
        <Text>Upload a profile picture</Text>
        <form onSubmit={handleSubmitFile}>
          <Input
            type="file"
            name="image"
            size="lg"
            my={4}
            variant="unstyled"
            onChange={handleFileInputChange}
            value={fileInputState}
          />
          <Button type="submit" variantColor="blue">
            Upload
          </Button>
        </form>
        {previewSource && <Image src={previewSource} maxH="300px" mt={4} />}
      </Box>
    </Wrapper>
  );
}
