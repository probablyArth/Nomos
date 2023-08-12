import { Button, Modal, NumberInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";

const MonthForm = () => {
  const router = useRouter();
  const setMonthMutation = api.month.setMonthData.useMutation({
    onSuccess: () => {
      notifications.show({
        message: "Success",
        color: "green",
      });
      router.reload();
    },
    onError: () => {
      notifications.show({
        message: "An error occurred.",
        color: "red",
      });
    },
  });

  const form = useForm({
    initialValues: {
      budget: 0.0,
    },
    validate: {
      budget: (value) =>
        value < 100.0
          ? "Kam se kam 100 ka to budget hona chahiye na yaar"
          : null,
    },
  });

  return (
    <Modal
      opened
      onClose={() => {
        return;
      }}
    >
      <div className="flex flex-col justify-center gap-8">
        <Title order={3}>
          {"Let's"} start with setting goals for this month
        </Title>
        <form
          onSubmit={form.onSubmit(({ budget }) => {
            setMonthMutation.mutate({
              budget: budget,
              year: new Date().getFullYear(),
              month: new Date().getMonth(),
            });
          })}
          className="flex flex-col gap-8"
        >
          <NumberInput
            label="Budget"
            placeholder="100.0"
            required
            {...form.getInputProps("budget")}
            min={100}
          />
          <Button type="submit">nice</Button>
        </form>
      </div>
    </Modal>
  );
};

export default MonthForm;
