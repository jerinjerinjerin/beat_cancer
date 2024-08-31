import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import ColumnContainer from "./ColumnContainer";
import { IconPlus } from "@tabler/icons-react";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard({ state }) {
  const defaultCols =
    state?.state?.columns?.map((col) => ({
      id: col?.id,
      title: col?.title,
    })) || [];

  const defaultTasks =
    state?.state?.tasks?.map((task) => ({
      id: task?.id,
      title: task?.content,
      columnId: task?.columnId ?? "", // Ensure columnId is always a string
    })) || [];

  const [columns, setColumns] = useState(defaultCols);
  const [tasks, setTasks] = useState(defaultTasks);

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
  );

  return (
    <div className="mt-5 min-h-screen w-72 text-white">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnIds}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor p-4 ring-green-500 hover:ring-2"
          >
            <IconPlus />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id,
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      title: `Task ${tasks.length + 1}`,
      columnId,
    };

    setTasks([...tasks, newTask]);
  }

  function createNewColumn() {
    const newColumn = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  }

  function deleteColumn(id) {
    setColumns(columns.filter((col) => col.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  }

  function updateColumn(id, title) {
    setColumns(columns.map((col) => (col.id === id ? { ...col, title } : col)));
  }

  function updateTask(id, content) {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, title: content } : task,
    );
    setTasks(newTasks);
  }
  function updateTask(id, content) {
    setTasks((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, content } : task)),
    );
  }

  function deleteTask(id) {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  }

  function onDragStart(event) {
    const { active } = event;
    const { type, column, task } = active.data.current || {};

    if (type === "Column") {
      setActiveColumn(column);
    } else if (type === "Task") {
      setActiveTask(task);
    }
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeTask = tasks.find((t) => t.id === active.id);
        const overTask = tasks.find((t) => t.id === over.id);

        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          activeTask.columnId = overTask.columnId;
          return arrayMove(
            tasks,
            tasks.indexOf(activeTask),
            tasks.indexOf(overTask) - 1,
          );
        }
        return arrayMove(
          tasks,
          tasks.indexOf(activeTask),
          tasks.indexOf(overTask),
        );
      });
    } else if (isActiveATask) {
      const activeTask = tasks.find((t) => t.id === active.id);
      if (activeTask && over?.id) {
        setTasks((tasks) => {
          activeTask.columnId = over.id;
          return [...tasks];
        });
      }
    }
  }

  function onDragEnd(event) {
    const { active, over } = event;
    if (!over) {
      setActiveColumn(null);
      setActiveTask(null);
      return;
    }

    if (active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) => col.id === active.id);
        const overIndex = columns.findIndex((col) => col.id === over.id);
        return arrayMove(columns, activeIndex, overIndex);
      });
    } else {
      const isActiveATask = active.data.current?.type === "Task";
      const isOverATask = over.data.current?.type === "Task";

      if (isActiveATask && isOverATask) {
        setTasks((tasks) => {
          const activeTask = tasks.find((t) => t.id === active.id);
          const overTask = tasks.find((t) => t.id === over.id);
          if (
            activeTask &&
            overTask &&
            activeTask.columnId !== overTask.columnId
          ) {
            activeTask.columnId = overTask.columnId;
            return arrayMove(
              tasks,
              tasks.indexOf(activeTask),
              tasks.indexOf(overTask) - 1,
            );
          }
          return arrayMove(
            tasks,
            tasks.indexOf(activeTask),
            tasks.indexOf(overTask),
          );
        });
      } else if (isActiveATask) {
        const activeTask = tasks.find((t) => t.id === active.id);
        if (activeTask && over?.id) {
          setTasks((tasks) => {
            activeTask.columnId = over.id;
            return [...tasks];
          });
        }
      }
    }

    setActiveColumn(null);
    setActiveTask(null);
  }
}

export default KanbanBoard;
