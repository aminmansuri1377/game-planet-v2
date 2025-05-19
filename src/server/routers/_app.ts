import { router } from "../trpc";
import { CategoryRouter } from "./category.router";
import { commentsRouter } from "./comments.router";
import { gameRouter } from "./gameRouter";
import { guarantyRouter } from "./guaranty.router";
import { locationsRouter } from "./locations.router";
import { ordersRouter } from "./orders.router";
import { ProductsRouter } from "./products.router";
import { registrationRouter } from "./registration.router";
import { supportRouter } from "./support.router";

// Combine your individual routers into the main application router
export const appRouter = router({
  main: gameRouter,
  category: CategoryRouter,
  comments: commentsRouter,
  guaranty: guarantyRouter,
  locations: locationsRouter,
  orders: ordersRouter,
  products: ProductsRouter,
  registration: registrationRouter,
  support: supportRouter,
});

export type AppRouter = typeof appRouter;
