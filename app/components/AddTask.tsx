/* "use client";
import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { FormEventHandler, useState } from "react";
import { addTodo } from "../lists/[listId]/page"; // Adjust this path as needed
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const AddTask = () => {
  const router = useRouter();
  const { listId } = useParams(); // Get the listId from the URL parameters
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newTaskValue, setNewTaskValue] = useState<string>("");

  const handleSubmitNewTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (typeof listId === "string") {
      // Ensure listId is a string
      await addTodo({
        params: {
          title: newTaskValue,
          listId: listId,
        },
      });
      setNewTaskValue("");
      setModalOpen(false);
      router.refresh();
    } else {
      console.error("listId is not a valid string");
    }
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="btn btn-primary w-full"
      >
        ADD NEW TASK
        <AiOutlinePlus className="ml-2" size={18} />
      </button>
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmitNewTodo}>
          <h3 className="font-bold text-lg">Add new task</h3>
          <div className="modal-action">
            <input
              value={newTaskValue}
              onChange={(e) => setNewTaskValue(e.target.value)}
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
    </div>
  );
};

export default AddTask;
 */
