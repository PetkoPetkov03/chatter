// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { authRouter } from "./authorization";
import { socialRouter } from "./social";
import { adminActions } from "./admin";
import { fetch } from "./fetch";
import { uploadRouter } from "./upload";
import { chatRouter } from "./chat";
import { posts } from "./posts";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("social.", socialRouter)
  .merge("admin.", adminActions)
  .merge("fetch.", fetch)
  .merge("upload.", uploadRouter)
  .merge("chat.", chatRouter)
  .merge("posts.", posts);

// export type definition of API
export type AppRouter = typeof appRouter;
