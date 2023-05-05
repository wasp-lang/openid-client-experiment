import z from "zod";
import { fromZodError } from "zod-validation-error";

const envSchema = z.object({
  VITE_SERVER_URL: z.string().url(),
});

function getEnv() {
  const envVariables = {
    VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
  };

  try {
    return envSchema.parse(envVariables);
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
