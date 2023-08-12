/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const monthRouter = createTRPCRouter({
  getMonthData: protectedProcedure
    .input(z.object({ month: z.number(), year: z.number() }))
    .query(async ({ ctx, input }) => {
      const month = await ctx.prisma.month.findFirst({
        where: {
          year: input.year,
          month: input.month,
        },
      });
      return { month };
    }),
});
