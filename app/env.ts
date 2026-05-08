import { z } from "zod";

const envSchema = z.object({
  AUTH_LOGIN_URL: z.string().url(),
  AUTH_REFRESH_URL: z.string().url(),
  AUTH_REQUEST_PASSWORD_CHANGE_URL: z.string().url(),
  AUTH_CHANGE_PASSWORD_URL: z.string().url(),
  USERS_ME_URL: z.string().url(),
  BACKEND_BASE_URL: z.string().url(),
  API_BASIC_AUTH_USER: z.string(),
  API_BASIC_AUTH_PASSWORD: z.string(),
});

export const Env = envSchema.parse(process.env);
