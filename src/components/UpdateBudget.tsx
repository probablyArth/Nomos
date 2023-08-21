import { Button, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { type Month } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { api } from "~/utils/api";

const UpdateBudget: FC<{ month: Month }> = ({ month }) => {
  const form = useForm({
    initialValues: {
      budget: month.budget,
    },
  });
  const queryClient = useQueryClient();
  const queryKey = [
    ["month", "getMonthData"],
    {
      input: {
        month: month.month,
        year: month.year,
      },
      type: "query",
    },
  ];
  const updateMonthMutation = api.month.updateMonthBudget.useMutation({
    onSuccess: ({ newBudget }) => {
      const data = queryClient.getQueryData<{ month: Month }>(queryKey) as {
        month: Month;
      };
      queryClient.setQueryData(queryKey, {
        month: { ...data.month, budget: newBudget },
      });
    },
  });
  const submit = (newBudget: number) => {
    if (newBudget != month.budget) {
      updateMonthMutation.mutate({ monthId: month.id, newBudget });
    }
  };

  return (
    <form
      className="flex w-full justify-between rounded-md p-4 shadow-sm"
      style={{ border: "1px solid black" }}
      onSubmit={form.onSubmit(({ budget }) => {
        submit(budget);
      })}
    >
      <NumberInput {...form.getInputProps("budget")} />
      <Button type="submit">Update Budget</Button>
    </form>
  );
};

export default UpdateBudget;
