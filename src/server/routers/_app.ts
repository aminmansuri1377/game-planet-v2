import { router } from "../trpc";
import { gameRouter } from "./gameRouter";

// Combine your individual routers into the main application router
export const appRouter = router({
  main: gameRouter,
});

export type AppRouter = typeof appRouter;
