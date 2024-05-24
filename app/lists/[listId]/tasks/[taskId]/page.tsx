const TaskId = ({ params }: { params: { listId: string; taskId: string } }) => {
  return (
    <div>
      Hello list {params.listId} and Task {params.taskId}
    </div>
  );
};

export default TaskId;
