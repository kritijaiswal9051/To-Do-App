import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingTodoId, setMarkingTodoId] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/fetch-from-airtable`);
      const airtableTodos = response.data.map((todo) => ({
        id: todo.id,
        name: todo.name,
        state: "new",
      }));
      setTodos(airtableTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsDone = async (id, name) => {
    setMarkingTodoId(id);
    try {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, state: "saving" } : todo
        )
      );

      await axios.post(`${API_URL}/mark-as-done`, {
        todo_id: id,
        todo_name: name,
      });

      setTimeout(() => {
        setTodos((currentTodos) =>
          currentTodos.map((todo) =>
            todo.id === id ? { ...todo, state: "done" } : todo
          )
        );
        setMarkingTodoId(null);
      }, 1000);
    } catch (error) {
      console.error("Error marking as done:", error);
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, state: "new" } : todo
        )
      );
      setMarkingTodoId(null);
    }
  };

  const moveToDatabase = async (id) => {
    try {
      await axios.post(`${API_URL}/move-to-db`, { todo_id: id });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, state: "moved" } : todo
        )
      );
    } catch (error) {
      console.error("Error moving to database:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My To-Do List</h1>
        <button onClick={fetchTodos} disabled={loading}>
          {loading ? "Loading..." : "Fetch Todos"}
        </button>
      </header>
      <main>
        <div className="todo-list">
          {todos.length === 0 && !loading && (
            <div className="empty-state-message">
              Click the button to load data....
            </div>
          )}
          {todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.state}`}>
              <span className="todo-name">{todo.name}</span>
              <div className="todo-actions">
                {todo.state === "new" && (
                  <button
                    onClick={() => markAsDone(todo.id, todo.name)}
                    disabled={markingTodoId !== null}
                  >
                    {markingTodoId === todo.id ? (
                      <div className="loader" />
                    ) : (
                      "✔️ Mark Done"
                    )}
                  </button>
                )}
                {todo.state === "saving" && (
                  <span className="badge-redis-saving">Saving to Redis...</span>
                )}
                {todo.state === "done" && (
                  <>
                    <span className="badge-redis">In Redis</span>
                    <button onClick={() => moveToDatabase(todo.id)}>
                      📤 Move to Database
                    </button>
                  </>
                )}
                {todo.state === "moved" && (
                  <>
                    <span className="badge-mongo">In MongoDB</span>
                    <button disabled className="completed-btn">
                      Completed
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
