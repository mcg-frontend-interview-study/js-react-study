import { useAtom, useSetAtom } from "jotai";
import {
  todosAtom,
  filterAtom,
  filteredTodosAtom,
  completedCountAtom,
  incompleteCountAtom,
} from "./atom";

const JTodo = () => {
  const setTodos = useSetAtom(todosAtom);
  const setFilter = useSetAtom(filterAtom);
  const [filteredTodos] = useAtom(filteredTodosAtom);
  const [completedCount] = useAtom(completedCountAtom);
  const [incompleteCount] = useAtom(incompleteCountAtom);

  const addTodo = (text) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Todo List (Jotai)</h1>

      <section style={{ ...sectionStyle, border: "none" }}>
        <h2>할 일 추가하기</h2>
        <input
          type="text"
          placeholder="Add a todo"
          style={inputStyle}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value) {
              addTodo(e.target.value);
              e.target.value = "";
            }
          }}
        />
      </section>
      <section style={sectionStyle}>
        <h2>목록 필터링</h2>
        <div style={{ textAlign: "center" }}>
          <button style={buttonStyle} onClick={() => setFilter("all")}>
            전체
          </button>
          <button style={buttonStyle} onClick={() => setFilter("completed")}>
            완료한 일
          </button>
          <button style={buttonStyle} onClick={() => setFilter("incomplete")}>
            미완료한 일
          </button>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2>할 일 목록</h2>
        <ul style={listStyle}>
          {filteredTodos.map((todo) => (
            <li key={todo.id} style={listItemStyle}>
              <span
                style={todoTextStyle(todo.completed)}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.text}
              </span>
              <button
                style={deleteButtonStyle}
                onClick={() => deleteTodo(todo.id)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <p>
          <strong>완료한 일의 개수:</strong> {completedCount}
        </p>
        <p>
          <strong>미완료한 일의 개수: </strong> {incompleteCount}
        </p>
      </section>
    </div>
  );
};

export default JTodo;

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "20px",
};

const sectionStyle = {
  marginBottom: "20px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const listStyle = {
  listStyleType: "disc",
  minHeight: "150px",
};

const listItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
};

const todoTextStyle = (completed) => ({
  flexGrow: 1,
  marginRight: "20px",
  textDecoration: completed ? "line-through" : "none",
  cursor: "pointer",
});

const deleteButtonStyle = {
  backgroundColor: "gray",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "5px 10px",
  cursor: "pointer",
};

const buttonStyle = {
  backgroundColor: "#616974",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  padding: "10px 15px",
  margin: "5px",
  cursor: "pointer",
};
