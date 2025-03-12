import { initTRPC } from "@trpc/server";

// Avoid exporting the entire t-object

// since it's not very descriptive.

// For instance, the use of a t variable

// is common in i18n libraries.

const t = initTRPC.create();

// Base router and procedure helpers

export const router = t.router;

export const procedure = t.procedure;

// import { initTRPC, TRPCError } from "@trpc/server";
// import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
// import { getServerSession } from "next-auth";

// // Create context type
// type CreateContextOptions = Record<string, never>;

// const createInnerTRPCContext = (_opts: CreateContextOptions) => {
//   return {
//     session: null,
//   };
// };

// export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
//   const session = await getServerSession(_opts.req, _opts.res);
//   const innerContext = createInnerTRPCContext({});

//   return {
//     ...innerContext,
//     session,
//   };
// };
// const t = initTRPC.create();

// // Base router and procedure helpers

// export const router = t.router;

// export const procedure = t.procedure;
// const t = initTRPC.context<typeof createTRPCContext>().create();

// // Base router and procedure helpers
// export const createTRPCRouter = t.router;
// export const publicProcedure = t.procedure;

// // Protected procedure
// export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
//   if (!ctx.session) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return next({
//     ctx: {
//       ...ctx,
//       session: ctx.session,
//     },
//   });
// });

/////////////////
