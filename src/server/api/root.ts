import { monthRouter } from "~/server/api/routers/monthRouter";
import { createTRPCRouter } from "~/server/api/trpc";
import { transactionRouter } from "./routers/transactionRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  month: monthRouter,
  transactions: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
