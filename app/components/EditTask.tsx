import React, { useState, useEffect, FormEventHandler } from "react";
import Modal from "@/app/components/Modal";

interface Task {
  id: number;
  title: string;
}

interface EditTaskProps {
  openModal: boolean;
  onCloseModal: () => void;
  onSubmitEdit: (title: string) => void;
  taskToEdit: Task | null;
  listId: string;
}

export const editTodo = async ({
  params,
}: {
  params: {
    listId: string;
    title: string;
    id: number;
  };
}) => {
  const res = await fetch(
    `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks/${params.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: params.title }),
    }
  );
  const updatedTodo = await res.json();
  return updatedTodo;
};

const EditTask: React.FC<EditTaskProps> = ({
  openModal,
  onCloseModal,
  onSubmitEdit,
  taskToEdit,
  listId,
}) => {
  const [editedTitle, setEditedTitle] = useState<string>("");

  useEffect(() => {
    // Set initial value of editedTitle when taskToEdit changes
    if (taskToEdit) {
      setEditedTitle(taskToEdit.title);
    }
  }, [taskToEdit]);

  const handleSubmitEdit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (editedTitle.trim() && taskToEdit) {
      await editTodo({
        params: {
          title: editedTitle,
          listId: listId,
          id: taskToEdit.id,
        },
      });
      onSubmitEdit(editedTitle);
      onCloseModal();
    }
  };

  return (
    <Modal modalOpen={openModal} setModalOpen={onCloseModal}>
      <form onSubmit={handleSubmitEdit}>
        <h3 className="font-bold text-lg">Edit Task</h3>
        <div className="modal-action">
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn">
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTask;
