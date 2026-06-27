import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type Filter = "all" | "pending" | "completed";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type TasksState = {
  items: Task[];
  filter: Filter;
};

const initialState: TasksState = {
  items: [
    {
      id: nanoid(),
      text: "Estudiar el flujo de una action en Redux Toolkit",
      completed: true,
    },
    {
      id: nanoid(),
      text: "Agregar una nueva tarea desde el formulario",
      completed: false,
    },
    {
      id: nanoid(),
      text: "Filtrar las tareas completadas",
      completed: false,
    },
  ],
  filter: "all",
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: {
      reducer: (state, action: PayloadAction<Task>) => {
        state.items.unshift(action.payload);
      },
      prepare: (text: string) => ({
        payload: {
          id: nanoid(),
          text: text.trim(),
          completed: false,
        },
      }),
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.items.find((item) => item.id === action.payload);

      if (task) {
        task.completed = !task.completed;
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCompleted: (state) => {
      state.items = state.items.filter((item) => !item.completed);
    },
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  addTask,
  toggleTask,
  removeTask,
  clearCompleted,
  setFilter,
  setTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
