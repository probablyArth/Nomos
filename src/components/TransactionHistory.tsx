import { Button, Table, ThemeIcon, Title } from "@mantine/core";
import { type Month, Transaction } from "@prisma/client";
import { type FC, useState, type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import { AiFillDelete } from "react-icons/ai";
import { notifications } from "@mantine/notifications";

const Transaction: FC<{ transaction: Transaction }> = ({ transaction }) => {
  const deleteTransactionMutation = api.transactions.delete.useMutation({
    onSuccess: () => {
      notifications.show({
        message: "Succesfully deleted the transaction",
        color: "green",
      });
    },
  });

  return (
    <tr className="rounded-sm p-4 shadow-sm" key={transaction.id}>
      <td>{transaction.date}</td>
      <td>{transaction.title}</td>
      <td
        className={`rounded-lg font-semibold  ${
          transaction.category === "food" && "bg-yellow-300"
        } ${transaction.category === "commute" && "bg-red-300"} ${
          transaction.category === "school" && "bg-blue-300"
        }`}
      >
        {transaction.category}
      </td>
      <td>{transaction.amount}</td>
      <td>
        <ThemeIcon
          className="cursor-pointer"
          onClick={() => {
            deleteTransactionMutation.mutate({ transactionId: transaction.id });
          }}
        >
          <AiFillDelete />
        </ThemeIcon>
      </td>
    </tr>
  );
};

const filterToColor = {
  food: "yellow",
  commute: "red",
  school: "blue",
};
type filters = "food" | "commute" | "school";
const FilterButton: FC<{
  setFilter: Dispatch<SetStateAction<filters | undefined>>;
  category: filters;
}> = ({ setFilter, category }) => {
  return (
    <Button
      color={filterToColor[category]}
      onClick={() => {
        setFilter(category);
      }}
    >
      {category}
    </Button>
  );
};

const TransactionHistory: FC<{ month: Month }> = ({ month }) => {
  const [filter, setFilter] = useState<filters | undefined>(undefined);

  const transactionsQuery = api.transactions.get.useQuery({
    monthId: month.id,
  });

  if (!transactionsQuery.data) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center gap-5">
      <Title>Transaction History</Title>
      <div className="flex gap-4">
        <FilterButton category="food" setFilter={setFilter} />
        <FilterButton category="commute" setFilter={setFilter} />
        <FilterButton category="school" setFilter={setFilter} />
        <Button
          variant="outline"
          onClick={() => {
            setFilter(undefined);
          }}
        >
          Remove filters
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactionsQuery.data.transactions.map((transaction, key) => {
            if (filter) {
              if (transaction.category === filter) {
                return <Transaction transaction={transaction} key={key} />;
              } else {
                return <></>;
              }
            }
            return <Transaction transaction={transaction} key={key} />;
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default TransactionHistory;
