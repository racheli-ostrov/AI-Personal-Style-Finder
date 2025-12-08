/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_WEATHER_API_KEY: string;
    REACT_APP_GOOGLE_CLIENT_ID: string;
  }
}
