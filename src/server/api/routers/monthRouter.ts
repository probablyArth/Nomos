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
          userId: ctx.session.user.id,
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
          userId: ctx.session.user.id,
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
  getCummulativeTransactions: protectedProcedure
    .input(z.object({ monthId: z.string() }))
    .query(async ({ ctx, input: { monthId } }) => {
      const data = await ctx.prisma.month.findFirst({
        where: {
          id: monthId,
          userId: ctx.session.user.id,
        },
        select: {
          transactions: true,
        },
      });
      data?.transactions.sort((a, b) => {
        return a.date - b.date;
      });
      const cummObj = new Map<number, number>();
      let amount = 0;
      data?.transactions.forEach((transaction) => {
        amount += transaction.amount;
        if (cummObj.has(transaction.date)) {
          cummObj.set(transaction.date, amount);
        } else {
          cummObj.set(transaction.date, amount);
        }
      });
      return { cummObj };
    }),
});
