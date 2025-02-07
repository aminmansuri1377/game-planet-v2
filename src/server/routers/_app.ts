import { router } from "../trpc";
import { gameRouter } from "./gameRouter";

// Combine your individual routers into the main application router
export const appRouter = router({
  main: gameRouter,
  // Add other routers here as your app grows
});

export type AppRouter = typeof appRouter;
