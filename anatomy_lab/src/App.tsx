import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import TaskManager from "./components/task-manager";
import { supabase } from "./supabase-client";

function App() {
  const [session, setSession] = useState<any>(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log(currentSession);
    setSession(currentSession.data);
  };

  useEffect(() => {
    fetchSession();
  });

  return (
    <>
      <TaskManager />
      <Auth />
    </>
  );
}

export default App;