import { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoItem from './components/TodoItem';
import Scene from './components/Scene';

export default function App() {
  const [todos, setTodos] = useState([]);

  // Day2 functions
  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, done: false };
    setTodos([...todos, newTodo]);
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  // Toggle between ToDo List and 3D Scene
  const showScene = true;

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {showScene ? (
        <Scene />
      ) : (
        <div style={{ padding: '2rem' }}>
          <h1>My To-Do List</h1>
          <TodoInput onAdd={addTodo} />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onRemove={removeTodo}
                onToggle={toggleTodo}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
