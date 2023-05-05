import dotenv from "dotenv";

dotenv.config();

import z from "zod";
import { fromZodError } from "zod-validation-error";

const envSchema = z.object({
  SECRET: z.string(),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  CLIENT_URL: z.string().url(),
  // Providers
  AUTH_GOOGLE_CLIENT_ID: z.string().optional(),
  AUTH_GOOGLE_CLIENT_SECRET: z.string().optional(),
  AUTH_GITHUB_CLIENT_ID: z.string().optional(),
  AUTH_GITHUB_CLIENT_SECRET: z.string().optional(),
  AUTH_TWITTER_CLIENT_ID: z.string().optional(),
  AUTH_TWITTER_CLIENT_SECRET: z.string().optional(),
  AUTH_FACEBOOK_CLIENT_ID: z.string().optional(),
  AUTH_FACEBOOK_CLIENT_SECRET: z.string().optional(),
  AUTH_MICROSOFT_ISSUER_URL: z.string().optional(),
  AUTH_MICROSOFT_CLIENT_ID: z.string().optional(),
  AUTH_MICROSOFT_CLIENT_SECRET: z.string().optional(),
  AUTH_DISCORD_CLIENT_ID: z.string().optional(),
  AUTH_DISCORD_CLIENT_SECRET: z.string().optional(),
  AUTH_TWITCH_CLIENT_ID: z.string().optional(),
  AUTH_TWITCH_CLIENT_SECRET: z.string().optional(),
  AUTH_LINKEDIN_CLIENT_ID: z.string().optional(),
  AUTH_LINKEDIN_CLIENT_SECRET: z.string().optional(),
  AUTH_APPLE_CLIENT_ID: z.string().optional(),
  AUTH_APPLE_CLIENT_SECRET: z.string().optional(),
  AUTH_SPOTIFY_CLIENT_ID: z.string().optional(),
  AUTH_SPOTIFY_CLIENT_SECRET: z.string().optional(),
  AUTH_NOTION_CLIENT_ID: z.string().optional(),
  AUTH_NOTION_CLIENT_SECRET: z.string().optional(),
  AUTH_SLACK_CLIENT_ID: z.string().optional(),
  AUTH_SLACK_CLIENT_SECRET: z.string().optional(),
  AUTH_ZOOM_CLIENT_ID: z.string().optional(),
  AUTH_ZOOM_CLIENT_SECRET: z.string().optional(),
});

function getEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      throw fromZodError(e, {
        maxIssuesInMessage: 1,
        prefix: "Environment variable validation failed:",
      }).message;
    }
    throw e;
  }
}

export const env = getEnv();
