import { Button, NumberInput, Select, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type Transaction } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { api } from "~/utils/api";

const AddTransactionModal: FC<{ monthId: string; closeModal: () => void }> = ({
  monthId,
  closeModal,
}) => {
  const form = useForm<{
    amount: number;
    category: "food" | "commute" | "school";
    title: string;
  }>({
    initialValues: {
      amount: 0,
      category: "food",
      title: "",
    },
  });

  const queryClient = useQueryClient();
  const addTransactionMutation = api.transactions.create.useMutation({
    onSuccess: ({ data }) => {
      notifications.show({
        message: "Succesfully added the transaction",
        color: "green",
      });
      const queryKey = [
        ["transactions", "get"],
        { input: { monthId: monthId }, type: "query" },
      ];
      const queryData = queryClient.getQueryData<{
        transactions: Transaction[];
      }>(queryKey);
      queryData?.transactions.push(data);
      queryClient.setQueryData(queryKey, queryData);
      closeModal();
    },
    onError: () => {
      notifications.show({
        message: "An error occurred",
        color: "red",
      });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Title order={3}>Add a transaction</Title>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.onSubmit(({ amount, category, title }) => {
          addTransactionMutation.mutate({
            amount,
            category,
            title,
            date: new Date().getDate(),
            monthId,
          });
        })}
      >
        <TextInput
          placeholder="macd"
          {...form.getInputProps("title")}
          required
          label="Title"
        />
        <Select
          data={["food", "commute", "school"]}
          {...form.getInputProps("category")}
          label="Category"
          required
        />
        <NumberInput
          placeholder="40.8"
          required
          label="Amount"
          {...form.getInputProps("amount")}
          min={1}
        />
        <Button type="submit" disabled={addTransactionMutation.isLoading}>
          Add
        </Button>
      </form>
    </div>
  );
};

export default AddTransactionModal;
