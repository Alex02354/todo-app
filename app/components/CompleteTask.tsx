import React from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  listId: number;
  description: string;
  deadlineDate: Date | number;
}

interface CompleteTaskProps {
  task: Task;
  listId: string;
  onCompleteTask: (task: Task) => void;
}

export const completeTodo = async ({
  params,
}: {
  params: {
    listId: string;
    id: number;
    completed: boolean;
  };
}) => {
  const res = await fetch(
    `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks/${params.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: params.completed }),
    }
  );
  const updatedTodo = await res.json();
  return updatedTodo;
};

const CompleteTask: React.FC<CompleteTaskProps> = ({
  task,
  listId,
  onCompleteTask,
}) => {
  const handleToggleComplete = async () => {
    const updatedTask = await completeTodo({
      params: {
        listId: listId,
        id: task.id,
        completed: !task.completed,
      },
    });

    onCompleteTask({ ...task, completed: updatedTask.completed });
  };

  return (
    <input
      type="checkbox"
      className="toggle bg-secondary toggle-sm toggle-accent"
      checked={task.completed}
      onChange={handleToggleComplete}
    />
  );
};

export default CompleteTask;
