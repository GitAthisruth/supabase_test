import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import TaskManager from "./components/task-manager";
import { supabase } from "./supabase-client";

function App() {
  const [session, setSession] = useState<any>(null);
  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    setSession(currentSession.data.session);
  };


  useEffect(() => {
    fetchSession();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();

  };

  return (
    <>
      {session ? (
        <>

          <button onClick={logout}>Logout</button>
          <TaskManager session={session} />
        </>
      ) : (
        <Auth />
      )}
    </>
  );
}

export default App;