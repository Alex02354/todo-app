import React from "react";
import Modal from "@/app/components/Modal";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  listId: number;
  description: string;
  deadlineDate: Date | number;
}

interface DeleteTaskProps {
  openModal: boolean;
  onCloseModal: () => void;
  onDeleteTask: () => void;
  taskToDelete: Task | null;
  listId: string;
}

export const deleteTodo = async ({
  params,
}: {
  params: { listId: string; id: number };
}) => {
  await fetch(
    `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks/${params.id}`,
    {
      method: "DELETE",
    }
  );
};

const DeleteTask: React.FC<DeleteTaskProps> = ({
  openModal,
  onCloseModal,
  onDeleteTask,
  taskToDelete,
  listId,
}) => {
  const handleDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTodo({
        params: { listId: listId, id: taskToDelete.id },
      });
      onDeleteTask();
    }
    onCloseModal();
  };

  return (
    <Modal modalOpen={openModal} setModalOpen={onCloseModal}>
      <h3 className="text-lg">Are you sure you want to delete this task?</h3>
      <div className="modal-action">
        <button onClick={handleDeleteTask} className="btn">
          Yes
        </button>
      </div>
    </Modal>
  );
};

export default DeleteTask;
