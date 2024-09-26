"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Flag, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'backlog' | 'high' | 'medium' | 'low';
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string, priority: string, index: number) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDragStart, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
    if (editedText.trim() !== task.text) {
      onEdit(task.id, editedText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedText(task.text);
    }
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => !isEditing && onDragStart(e, task.id, task.priority, index)} // Pass index here
      className={`flex items-center mb-2 p-2 bg-gray-100 rounded cursor-move group transition-all duration-300 ${
        task.completed ? 'opacity-50' : ''
      }`}
    >
      <div className="mr-2 cursor-move">
        <GripVertical size={16} />
      </div>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="mr-2"
      />
      {!isEditing ? (
        <span
          className={`flex-grow ${task.completed ? "line-through" : ""}`}
          onClick={() => setIsEditing(true)}
        >
          {task.text}
        </span>
      ) : (
        <Input
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={handleKeyPress}
          className="mr-2 flex-grow"
          autoFocus
        />
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface TaskContainerProps {
  title: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string, priority: string, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetPriority: string) => void;
  maxTasks?: number;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({
  title,
  tasks,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop,
  maxTasks,
  onEdit,
  onDelete,
}) => {
  const [isOver, setIsOver] = useState(false);
  const isBacklog = title.toLowerCase() === 'backlog';
  const allTasksCompleted = !isBacklog && tasks.length > 0 && tasks.every(task => task.completed);

  const remainingSlots = maxTasks ? Math.max(0, maxTasks - tasks.length) : 0;

  const placeholders = Array(remainingSlots)
    .fill(null)
    .map((_, index) => (
      <div
        key={`placeholder-${index}`}
        className="h-12 mb-2 p-2 bg-gray-50 rounded border border-dashed border-gray-300"
      />
    ));

  return (
    <Card
      className={`mb-4 ${isOver ? "border-2 border-blue-500" : ""} ${
        allTasksCompleted ? "bg-green-100 opacity-75" : ""
      } transition-all duration-300`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
        onDragOver(e);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        setIsOver(false);
        onDrop(e, title.toLowerCase());
      }}
    >
      <CardHeader>
        <h3 className={`text-lg font-semibold ${allTasksCompleted ? "text-green-700" : ""}`}>
          {title} ({tasks.length}/{maxTasks || "∞"})
          {allTasksCompleted && " - All Complete!"}
        </h3>
      </CardHeader>
      <CardContent className="min-h-[100px]">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDragStart={(e, id) =>
              onDragStart(e, id, title.toLowerCase(), index)
            }
            onEdit={onEdit}
            onDelete={onDelete}
            className="mb-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
          />
        ))}
        {placeholders}
      </CardContent>
    </Card>
  );
};

const PrioritizedTodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    backlog: [],
    high: [],
    medium: [],
    low: [],
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });
  
    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      const groupedTasks = {
        backlog: [],
        high: [],
        medium: [],
        low: [],
      };
      data.forEach((task) => {
        groupedTasks[task.priority].push(task);
      });
      setTasks(groupedTasks);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
    }
  };
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("backlog");
  const [draggedTask, setDraggedTask] = useState({
    id: null,
    priority: null,
    index: null,
  });
  const { toast } = useToast()

  const addTask = async () => {
    if (newTask.trim() !== "") {
      const maxTasks = getMaxTasks(newTaskPriority);
      if (tasks[newTaskPriority].length >= maxTasks) {
        const errorMsg = `Cannot add task. ${newTaskPriority} priority is at maximum capacity.`;
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert({ text: newTask, priority: newTaskPriority })
        .select();

      if (error) {
        console.error("Error adding task:", error);
        toast({
          title: "Error",
          description: "Failed to add task. Please try again.",
          variant: "destructive",
        });
      } else {
        fetchTasks(); // Refresh the task list
        setNewTask("");
      }
    }
  };

  const toggleTask = async (id: string) => {
    // Find the priority of the task
    let taskPriority;
    for (const [priority, taskList] of Object.entries(tasks)) {
      if (taskList.some((task) => task.id === id)) {
        taskPriority = priority;
        break;
      }
    }

    if (!taskPriority) {
      console.error("Task not found");
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({
        completed: !tasks[taskPriority]?.find((t) => t.id === id)?.completed ?? false,
      })
      .eq("id", id);

    if (error) {
      console.error("Error toggling task:", error);
    } else {
      fetchTasks(); // Refresh the task list
      if (!tasks[taskPriority].find((t) => t.id === id).completed) {
        toast({
          title: "Task Completed!",
          description: "Great job on finishing your task!",
          variant: "success",
        });
      }
    }
  };

  const editTask = async (id: string, newText: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ text: newText })
      .eq("id", id);

    if (error) {
      console.error("Error editing task:", error);
    } else {
      fetchTasks(); // Refresh the task list
    }
  };

  const deleteTask = async (id: string) => {
    const { data, error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      fetchTasks(); // Refresh the task list
    }
  };

  const onDragStart = (e: React.DragEvent, taskId: string, priority: string, index: number) => {
    setDraggedTask({ id: taskId, priority, index });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent, targetPriority: string) => {
    e.preventDefault();
    if (!draggedTask.id) return;

    const sourcePriority = draggedTask.priority;
    const sourceIndex = draggedTask.index;
    const targetIndex = tasks[targetPriority].length;

    // Check if the target priority group has reached its maximum capacity
    const maxTasks = getMaxTasks(targetPriority);
    if (tasks[targetPriority].length >= maxTasks && sourcePriority !== targetPriority) {
      const errorMsg = `Cannot move task. ${targetPriority} priority is at maximum capacity.`;
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    const updatedTasks = JSON.parse(JSON.stringify(tasks));

    if (sourcePriority === targetPriority) {
      // Reorder within the same priority
      const [movedTask] = updatedTasks[targetPriority].splice(sourceIndex, 1);
      updatedTasks[targetPriority].splice(targetIndex, 0, movedTask);
    } else {
      // Move to a different priority
      const [movedTask] = updatedTasks[sourcePriority].splice(sourceIndex, 1);
      movedTask.priority = targetPriority;
      updatedTasks[targetPriority].push(movedTask);
    }

    setTasks(updatedTasks);

    // Update the database
    const updates = Object.entries(updatedTasks)
      .flatMap(([priority, taskList]) => 
        taskList.map((task, index) => ({
          id: task.id,
          text: task.text,
          completed: task.completed,
          priority: priority,
          order: index,
        }))
      );

    const { data, error } = await supabase
      .from("tasks")
      .upsert(updates, { onConflict: ["id"] });

    if (error) {
      console.error("Error updating tasks:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }

    setDraggedTask({ id: null, priority: null, index: null });
  };

  const getMaxTasks = (priority: string): number => {
    switch (priority) {
      case "high":
        return 1;
      case "medium":
        return 3;
      case "low":
        return 5;
      default:
        return Infinity;
    }
  };

  const isPriorityFull = (priority: string): boolean => {
    return tasks[priority].length >= getMaxTasks(priority);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg shadow-lg">
      <Card className="mb-4 transition-shadow duration-300 hover:shadow-md">
        <CardHeader>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a new task"
              className="flex-grow mr-2"
            />
            <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
              <SelectTrigger className="w-[180px] mr-2">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="high" disabled={isPriorityFull("high")}>
                  <div className="flex items-center">
                    <Flag className="w-4 h-4 mr-2 text-red-500" />
                    High {isPriorityFull("high") ? "(Full)" : ""}
                  </div>
                </SelectItem>
                <SelectItem value="medium" disabled={isPriorityFull("medium")}>
                  Medium {isPriorityFull("medium") ? "(Full)" : ""}
                </SelectItem>
                <SelectItem value="low" disabled={isPriorityFull("low")}>
                  Low {isPriorityFull("low") ? "(Full)" : ""}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTask} disabled={isPriorityFull(newTaskPriority)}>Add Task</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <TaskContainer
            title="Backlog"
            tasks={tasks.backlog}
            onToggle={toggleTask}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        </div>
        <div>
          <TaskContainer
            title="High"
            tasks={tasks.high}
            onToggle={toggleTask}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdit={editTask}
            onDelete={deleteTask}
            maxTasks={1}
          />
          <TaskContainer
            title="Medium"
            tasks={tasks.medium}
            onToggle={toggleTask}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdit={editTask}
            onDelete={deleteTask}
            maxTasks={3}
          />
          <TaskContainer
            title="Low"
            tasks={tasks.low}
            onToggle={toggleTask}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onEdit={editTask}
            onDelete={deleteTask}
            maxTasks={5}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default PrioritizedTodoApp;
