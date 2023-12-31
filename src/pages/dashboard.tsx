/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { useState, useEffect } from "react";
// menus
import Overview from "~/menus/Overview";
import TransactionHistory from "~/menus/TransactionHistory";
import Settings from "~/menus/Settings";

import { api } from "~/utils/api";

import MonthForm from "~/components/MonthForm";
import AddTransactionModal from "~/components/AddTransactionModal";
import Sidebar from "~/components/SideBar";

import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, ScrollArea, Skeleton } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import { type Month } from "@prisma/client";

export type menu = 0 | 1 | 2;
const Dashboard = () => {
  const [currMenu, setCurrMenu] = useState<menu>(
    typeof window !== "undefined"
      ? (Number(localStorage.getItem("currMenu")) as menu) || 0
      : 0
  );
  useEffect(() => {
    localStorage.setItem("currMenu", currMenu.toString());
  }, [currMenu]);
  const { status } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const { data, isLoading } = api.month.getMonthData.useQuery(
    {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
    { enabled: status === "authenticated" }
  );
  // useEffect(() => {
  //   console.log({ data });
  // }, [data]);
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
  if (data?.month === null) return <MonthForm />;
  const currComp = [
    <Overview month={data?.month as Month} key={0} />,
    <TransactionHistory month={data?.month as Month} key={1} />,
    <Settings month={data?.month as Month} key={2} />,
  ];
  return (
    <div className="flex h-screen w-full items-center">
      <Sidebar currMenu={currMenu} setCurrMenu={setCurrMenu} openModal={open} />
      <Modal opened={opened} onClose={close}>
        <AddTransactionModal
          closeModal={close}
          monthId={data?.month.id as string}
        />
      </Modal>
      <ScrollArea className="flex h-full w-full">
        <div className="flex h-full w-full flex-col items-center gap-4 p-4">
          {currComp[currMenu]}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Dashboard;
