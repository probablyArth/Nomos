/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TransactionCategory } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        monthId: z.string(),
        amount: z.number(),
        date: z.number(),
        category: z.enum([
          TransactionCategory.commute,
          TransactionCategory.food,
          TransactionCategory.school,
        ]),
        title: z.string(),
      })
    )
    .mutation(
      async ({ ctx, input: { amount, monthId, date, category, title } }) => {
        await ctx.prisma.transaction.create({
          data: {
            amount,
            monthId,
            userId: ctx.session.user.id,
            date,
            category,
            title,
          },
        });
        return { message: "success" };
      }
    ),
  get: protectedProcedure
    .input(
      z.object({
        monthId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const transactions = await ctx.prisma.transaction.findMany({
        where: { monthId: input.monthId, userId: ctx.session.user.id },
        orderBy: {
          date: "asc",
        },
      });
      return { transactions };
    }),
  delete: protectedProcedure
    .input(z.object({ transactionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.transaction.delete({
        where: {
          id: input.transactionId,
        },
      });
    }),
});
