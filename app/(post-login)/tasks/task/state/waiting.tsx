import { Card, Button, TaskTable, Text } from "@/components/index";
import type { detailCard } from "@/models/task";

type TaskWaitingPageProps = {
  task: detailCard;
  onUpdateTask: (task: any) => void;
  onOpenUpdateTask: (task: detailCard) => void;
  onToggleTask: (taskIndex: number) => void;
};

export default function TaskWaitingPage({
  task,
  onUpdateTask,
  onOpenUpdateTask,
  onToggleTask,
}: TaskWaitingPageProps) {
  return (
    <Card
      eyebrow={<Text as="h4">{task.eyebrow}</Text>}
      icon={task.icon}
      title={<Text as="h2" fullWidth>{task.title}</Text>}
      description={<Text as="p">{task.description}</Text>}
      actions={(
        <>
          <Button variant="filled" onClick={() => onUpdateTask(task)}>
            Let's do this! 🚀
          </Button>
          <Button variant="ghost" onClick={() => onOpenUpdateTask(task)}>
            Hmmmm... let's rework this plot
          </Button>
          <br/>
        </>
      )}
    >
      {task.tasks.length > 0 && (
        <>
          <br/>
          <Text as="h3" fullWidth>Guides: make it memorable</Text>
          <TaskTable
            tasks={task.tasks}
            taskHeader="Task"
            onToggleTask={(taskIndex) => onToggleTask(taskIndex)}
          />
          <br/>
        </>
      )}
    </Card>
  );
}
