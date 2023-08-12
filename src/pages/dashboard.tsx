import { Button, Modal, Skeleton } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";
import React from "react";

const Dashboard = () => {
  const { status } = useSession();
  if (status == "loading")
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
  return <div>Dashboard</div>;
};

export default Dashboard;
