import React, { useState } from "react";
import Modal from "@/app/components/Modal";
import { AiOutlinePlus } from "react-icons/ai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

interface AddTaskProps {
  listId: string;
  onSubmitSuccess: () => void;
}

export const addTodo = async ({
  params,
}: {
  params: {
    listId: string;
    title: string;
    completed: boolean;
    description: string;
    deadlineDate: Date;
  };
}) => {
  const res = await fetch(
    `https://66502dadec9b4a4a603102b5.mockapi.io/lists/${params.listId}/tasks`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: params.title,
        completed: params.completed,
        description: params.description,
        deadlineDate: params.deadlineDate.getTime() / 1000, // Convert to Unix timestamp
      }),
    }
  );
  const newTodo = await res.json();
  return newTodo;
};

const AddTask: React.FC<AddTaskProps> = ({ listId, onSubmitSuccess }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const schema = z.object({
    title: z.string().min(1, "Title is required"),
    completed: z.boolean(),
    description: z.string().min(1, "Description is required"),
    deadlineDate: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date({ invalid_type_error: "Invalid date" })),
  });

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await addTodo({
        params: {
          listId: listId,
          title: data.title,
          completed: data.completed,
          description: data.description,
          deadlineDate: data.deadlineDate,
        },
      });
      setModalOpen(false);
      onSubmitSuccess();
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Failed to add task",
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="btn btn-primary w-full"
      >
        ADD NEW TASK
        <AiOutlinePlus className="ml-2" size={18} />
      </button>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form
          className="flex flex-col gap-4 p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-xl font-bold mb-4">Add New Task</h3>
          <div className="flex flex-col gap-2">
            <label className="label">Title</label>
            <input
              {...register("title")}
              type="text"
              placeholder="Title"
              className="input input-bordered w-full"
            />
            {errors.title && (
              <div className="text-red-500">{errors.title.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="label">Description</label>
            <input
              {...register("description")}
              type="text"
              placeholder="Description"
              className="input input-bordered w-full"
            />
            {errors.description && (
              <div className="text-red-500">{errors.description.message}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="label">Deadline Date</label>
            <input
              {...register("deadlineDate")}
              type="date"
              placeholder="Deadline Date"
              className="input input-bordered w-full"
            />
            {errors.deadlineDate && (
              <div className="text-red-500">{errors.deadlineDate.message}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="label">Completed</label>
            <input
              {...register("completed")}
              type="checkbox"
              className="checkbox"
            />
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-primary mt-4"
          >
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
          {errors.root && (
            <div className="text-red-500 mt-2">{errors.root.message}</div>
          )}
        </form>
      </Modal>
    </>
  );
};

export default AddTask;
