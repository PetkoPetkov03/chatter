// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { authRouter } from "./authorization";
import { socialRouter } from "./social";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("social.", socialRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
