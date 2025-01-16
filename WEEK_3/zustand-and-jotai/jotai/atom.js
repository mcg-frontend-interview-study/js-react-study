import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const todosAtom = atomWithStorage("jotai-todo-storage", []);
export const filterAtom = atomWithStorage("filter", "all"); // "all" | "completed" | "incomplete"

export const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);

  if (filter === "completed") return todos.filter((todo) => todo.completed);
  if (filter === "incomplete") return todos.filter((todo) => !todo.completed);
  return todos;
});

export const completedCountAtom = atom(
  (get) => get(todosAtom).filter((todo) => todo.completed).length
);

export const incompleteCountAtom = atom(
  (get) => get(todosAtom).filter((todo) => !todo.completed).length
);
