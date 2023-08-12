import { Button, Modal, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

const MonthForm = () => {
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
          onSubmit={form.onSubmit((values) => {
            console.log(values);
          })}
          className="flex flex-col gap-8"
        >
          <TextInput
            label="Budget"
            placeholder="100.0"
            required
            {...form.getInputProps("budget")}
          />
          <Button type="submit">nice</Button>
        </form>
      </div>
    </Modal>
  );
};

export default MonthForm;
