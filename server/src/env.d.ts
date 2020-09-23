declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    COOKIE_NAME: string;
    CLOUDINARY_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    REDIS_URL: string;
    CORS_ORIGIN: string;
    SESSION_SECRET: string;
    PORT: string;
  }
}
