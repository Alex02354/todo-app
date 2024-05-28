import React from "react";

interface TaskFilterProps {
  filter: "all" | "in-progress" | "completed";
  setFilter: React.Dispatch<
    React.SetStateAction<"all" | "in-progress" | "completed">
  >;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ filter, setFilter }) => {
  return (
    <div className="flex justify-between gap-8">
      <button
        className={`btn btn-outline btn-primary ${
          filter === "all" ? "btn-active" : ""
        }`}
        onClick={() => setFilter("all")}
      >
        ALL
      </button>
      <button
        className={`btn btn-outline btn-secondary ${
          filter === "in-progress" ? "btn-active" : ""
        }`}
        onClick={() => setFilter("in-progress")}
      >
        IN PROGRESS
      </button>
      <button
        className={`btn btn-outline btn-accent ${
          filter === "completed" ? "btn-active" : ""
        }`}
        onClick={() => setFilter("completed")}
      >
        COMPLETED
      </button>
    </div>
  );
};

export default TaskFilter;
