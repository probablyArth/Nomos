import { type FC } from "react";
import { type Month } from "@prisma/client";
import { Title } from "@mantine/core";
import UpdateBudget from "~/components/UpdateBudget";
import { useQueryClient } from "@tanstack/react-query";

const Settings: FC<{ month: Month }> = ({ month }) => {
  const date = new Date();
  date.setMonth(month.month);

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
  const data = queryClient.getQueryState<{ month: Month }>(queryKey);
  console.log({ data });
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Title>Settings</Title>
      <div
        className="flex w-full justify-between rounded-md  bg-yellow-300 p-4 shadow-sm"
        style={{ border: "1px solid black" }}
      >
        <div>
          <span className="font-bold">Current month:</span>{" "}
          {date.toLocaleString([], { month: "long" })}{" "}
          {date.toLocaleString([], { year: "numeric" })}
        </div>
        <div>
          <span className="font-bold">budget:</span> {data?.data?.month.budget}
        </div>
      </div>
      <UpdateBudget month={month} />
    </div>
  );
};

export default Settings;
