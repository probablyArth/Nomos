import { Button, Modal, Skeleton } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import MonthForm from "~/components/monthForm";

const Dashboard = () => {
  const { status } = useSession();
  const { data, isLoading } = api.month.getMonthData.useQuery(
    {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
    { enabled: status === "authenticated" }
  );
  console.log({ data, isLoading, status });

  if (status == "loading" || isLoading)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 p-4">
        <Skeleton height={35} radius="sm" />
        <Skeleton height={35} radius="sm" />
        <Skeleton height={35} radius="sm" />
        <Skeleton height={35} radius="sm" />
        <Skeleton height={35} radius="sm" />
      </div>
    );
  if (status == "unauthenticated") {
    return (
      <Modal
        opened
        onClose={() => {
          return;
        }}
      >
        <div className="flex flex-col justify-center gap-8">
          Gotta sign in first to access your stuff.. eh?
          <Button onClick={() => void signIn()}>{"Let's go"}</Button>
        </div>
      </Modal>
    );
  }
  if (data?.month === null) return <MonthForm />;
};

export default Dashboard;
