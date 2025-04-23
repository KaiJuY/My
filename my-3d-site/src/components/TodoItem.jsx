export default function TodoItem({ todo, onRemove, onToggle }) {
    return (
      <li style={{ marginBottom: '0.5rem' }}>
        <span
          onClick={() => onToggle(todo.id)}
          style={{
            textDecoration: todo.done ? 'line-through' : 'none',
            cursor: 'pointer',
            marginRight: '1rem',
          }}
        >
          {todo.text}
        </span>
        <button onClick={() => onRemove(todo.id)}>Delete</button>
      </li>
    );
  }
  