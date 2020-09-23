export type Post = {
  id: number;
  body: string;
  author: {
    id: number;
    email: string;
    username: string;
    pictureId?: string;
  };
  likes: [
    {
      postId: number;
      userId: number;
    }
  ];
  createdAt: Date;
  likeStatus: boolean;
};
