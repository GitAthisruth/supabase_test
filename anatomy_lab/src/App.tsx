import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabase-client";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

function App() {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newDescription, setNewDescription] = useState<string>("");

  const fetchTasks = async () => {
    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching tasks", error.message);
      return;
    }
    setTasks(data || []);
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error.message);
      alert("Error deleting task");
    } else {
      alert("Task deleted successfully");
      fetchTasks(); // ✅ refresh
    }
  };

  const updateTask = async (id: number) => {
    if (!newDescription.trim()) {
      alert("Description cannot be empty");
      return;
    }

    const { error } = await supabase
      .from("tasks")
      .update({ description: newDescription })
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error.message);
      alert("Error updating task");
    } else {
      alert("Task updated successfully");
      setNewDescription(""); // ✅ reset correctly
      fetchTasks(); // ✅ refresh
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      alert("Title is required");
      return;
    }

    const { error } = await supabase.from("tasks").insert(newTask);

    if (error) {
      console.error("Error adding task:", error.message);
      alert("Error adding task");
    } else {
      alert("Task added successfully");
      setNewTask({ title: "", description: "" });
      fetchTasks(); // ✅ refresh
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Task Manager CRUD</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />

        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />

        <button type="submit">Add Task</button>
      </form>

      <ul style={{ listStyleType: "none", padding: "0" }}>
        {tasks.map((task) => (
          <li
            key={task.id} // ✅ fixed
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Updated description..."
            />

            <div>
              <button onClick={() => updateTask(task.id)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;