import { Card, Button, TaskTable, Text } from "@/components/index";
import type { detailCard } from "@/models/task";

type TaskWaitingPageProps = {
  task: detailCard;
  onStartTask: (task: detailCard) => void;
  onOpenUpdateTask: (task: detailCard) => void;
  onToggleTask: (taskIndex: number) => void;
};

export default function TaskWaitingPage({
  task,
  onStartTask,
  onOpenUpdateTask,
  onToggleTask,
}: TaskWaitingPageProps) {

  console.log("Rendering TaskWaitingPage with task:", task);
  return (
    <Card
      eyebrow={<Text as="h4">{task.eyebrow}</Text>}
      icon={task.icon}
      title={<Text as="h2" fullWidth>{task.title}</Text>}
      description={<Text as="p">{task.description}</Text>}
      actions={(
        <>
          <Button variant="filled" onClick={() => onStartTask(task)}>
            Let's do this! 🚀
          </Button>
          <Button variant="ghost" onClick={() => onOpenUpdateTask(task)}>
            Hmmmm... let's rework this plot
          </Button>
          <br/>
        </>
      )}
    >
      {task.checklist && task.checklist?.length > 0 && (
        <>
          <br/>
          <Text as="h3" fullWidth>Guides: make it memorable</Text>
          <TaskTable
            tasks={task.checklist}
            taskHeader="Task"
            onToggleTask={(taskIndex) => onToggleTask(taskIndex)}
          />
          <br/>
        </>
      )}
    </Card>
  );
}
