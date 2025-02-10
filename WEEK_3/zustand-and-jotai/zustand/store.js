import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [],
      filter: "all", // all | completed | incomplete
      filteredTodos: [],

      addTodo: (text) =>
        set((state) => {
          const newTodos = [
            ...state.todos,
            { id: Date.now(), text, completed: false },
          ];

          return {
            todos: newTodos,
            filteredTodos: get().applyFilter(newTodos, state.filter),
          };
        }),
      toggleTodo: (id) =>
        set((state) => {
          const updatedTodos = state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          );
          return {
            todos: updatedTodos,
            filteredTodos: get().applyFilter(updatedTodos, state.filter),
          };
        }),
      deleteTodo: (id) =>
        set((state) => {
          const updatedTodos = state.todos.filter((todo) => todo.id !== id);
          return {
            todos: updatedTodos,
            filteredTodos: get().applyFilter(updatedTodos, state.filter),
          };
        }),

      setFilter: (filter) =>
        set((state) => ({
          filter,
          filteredTodos: get().applyFilter(state.todos, filter),
        })),

      applyFilter: (todos, filter) => {
        if (filter === "completed") {
          return todos.filter((todo) => todo.completed);
        }
        if (filter === "incomplete") {
          return todos.filter((todo) => !todo.completed);
        }
        return todos;
      },

      getCompletedCount: () =>
        get().todos.filter((todo) => todo.completed).length,

      getIncompleteCount: () =>
        get().todos.filter((todo) => !todo.completed).length,
    }),
    { name: "zustand-todo-storage" }
  )
);
