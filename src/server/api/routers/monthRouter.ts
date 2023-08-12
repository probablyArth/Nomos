/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const monthInput = z.object({ month: z.number(), year: z.number() });

export const monthRouter = createTRPCRouter({
  getMonthData: protectedProcedure
    .input(monthInput)
    .query(async ({ ctx, input }) => {
      const month = await ctx.prisma.month.findFirst({
        where: {
          year: input.year,
          month: input.month,
        },
      });
      return { month };
    }),
  setMonthData: protectedProcedure
    .input(monthInput.extend({ budget: z.number() }))
    .mutation(async ({ ctx, input: { budget, month, year } }) => {
      const foundMonth = await ctx.prisma.month.findFirst({
        where: {
          year,
          month,
        },
      });
      if (foundMonth !== null) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Data for the month already exists",
        });
      }
      await ctx.prisma.month.create({
        data: {
          userId: ctx.session.user.id,
          budget,
          month,
          year,
        },
      });
      return { message: "Succesfully created budget for the month" };
    }),
});
