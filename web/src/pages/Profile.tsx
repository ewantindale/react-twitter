import React from "react";
import Wrapper from "../components/Wrapper";
import {
  Box,
  Button,
  Input,
  Text,
  Image,
  Alert,
  AlertIcon,
} from "@chakra-ui/core";
import { useIsAuthenticated } from "../utils/useIsAuthenticated";
import { useState } from "react";
import axios from "axios";

export default function Profile() {
  useIsAuthenticated();
  const [previewSource, setPreviewSource] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.size > 100000) {
        setError("This file is too large");
        return;
      }
      if (file.type !== "image/jpeg") {
        setError("Invalid file format");
        return;
      }
      setError("");
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
    setLoading(true);
    try {
      await axios(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: "post",
        data: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <Box>
        <Text fontSize={25} fontWeight="bold" mb={4}>
          Upload a profile picture
        </Text>
        <Text>Profile pictures must be a JPEG under 10MB in size.</Text>
        <form onSubmit={handleSubmitFile}>
          <Input
            type="file"
            name="image"
            size="lg"
            my={4}
            variant="unstyled"
            onChange={handleFileInputChange}
          />
          {previewSource && (
            <>
              <Text mt={2}>Preview:</Text>
              <Image src={previewSource} maxH="300px" mt={4} />
            </>
          )}
          {error ? (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          ) : null}
          <Button
            type="submit"
            variantColor="blue"
            isDisabled={!previewSource}
            isLoading={loading}
            mt={4}
          >
            Upload
          </Button>
          {success && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              Profile picture successfully updated.
            </Alert>
          )}
        </form>
      </Box>
    </Wrapper>
  );
}
