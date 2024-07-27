export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_PORT: string;
      API_HOST: string;
      DB_PORT: string;
      DB_HOST: string;
      DB_TYPE: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
    }
  }
}
