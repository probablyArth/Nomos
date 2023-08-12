/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { type Month } from "@prisma/client";
import { useState, type FC, useEffect } from "react";
import { api } from "~/utils/api";
import {
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Title } from "@mantine/core";

const MonthStats: FC<{ month: Month }> = ({ month }) => {
  const [data, setData] = useState<{ name: string; amount: number }[]>([]);
  const [strokeColor, setStrokeColor] = useState("green");
  const cummQuery = api.month.getCummulativeTransactions.useQuery({
    monthId: month.id,
  });
  console.log({ data });
  useEffect(() => {
    if (!cummQuery.isLoading && cummQuery.data) {
      console.log(cummQuery.data.cummObj);
      const arr: { name: string; amount: number }[] = [];
      cummQuery.data.cummObj.forEach((v, k) => {
        arr.push({ name: String(k), amount: v });
      });
      setData(arr);

      if ((arr[arr.length - 1]?.amount as number) >= month.budget) {
        setStrokeColor("red");
      }
    }
  }, [cummQuery.isLoading, cummQuery.data]);
  return (
    <div className="flex h-screen w-full flex-col items-center gap-8">
      <Title>Month History</Title>
      {month.month}/{month.year}
      <LineChart width={700} height={500} data={data}>
        <Line type={"monotone"} dataKey={"amount"} stroke={strokeColor} />
        <CartesianGrid stroke={strokeColor} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default MonthStats;
