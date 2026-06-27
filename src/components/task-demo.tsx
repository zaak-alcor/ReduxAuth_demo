'use client'

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import styles from "@/app/page.module.css";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addTask,
  clearCompleted,
  setFilter,
  toggleTask,
  removeTask,
  setTasks,
  type Filter,
} from "@/lib/features/tasks/tasksSlice";
import { getFirebaseClientFirestore } from "@/lib/firebase/client";
import { serverTimestamp } from "firebase/firestore";

const filters: Array<{ label: string; value: Filter }> = [
  { label: "Todas", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Completadas", value: "completed" },
];

type TaskDemoProps = {
  userId: string;
};

export function TaskDemo({ userId }: TaskDemoProps) {
  const dispatch = useAppDispatch();
  const { items, filter } = useAppSelector((state) => state.tasks);
  const [draft, setDraft] = useState("");

  const filteredTasks = useMemo(() => {
    if (filter === "pending") {
      return items.filter((task) => !task.completed);
    }

    if (filter === "completed") {
      return items.filter((task) => task.completed);
    }

    return items;
  }, [filter, items]);

  const completedCount = items.filter((task) => task.completed).length;
  const pendingCount = items.length - completedCount;

  useEffect(() => {
    if (!userId) {
      return;
    }

    const db = getFirebaseClientFirestore();
    if (!db) {
      return;
    }

    const tasksRef = collection(db, "users", userId, "tasks");
    const tasksQuery = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text as string,
        completed: doc.data().completed as boolean,
      }));

      dispatch(setTasks(tasks));
    });

    return () => unsubscribe();
  }, [dispatch, userId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedDraft = draft.trim();

    if (!normalizedDraft) {
      return;
    }

    const db = getFirebaseClientFirestore();
    if (!db) {
      return;
    }

    const tasksRef = collection(db, "users", userId, "tasks");
    await addDoc(tasksRef, {
      text: normalizedDraft,
      completed: false,
      createdAt: serverTimestamp(),
    });

    setDraft("");
  };

  return (
    <section className={styles.board}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Tus tareas</p>
        <h1 className={styles.title}>Organiza tu día</h1>
        <p className={styles.description}>
          Agrega tareas, márcalas como completadas y borra las que ya finalizaste.
        </p>

        <div className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <span>Total</span>
            <strong>{items.length}</strong>
          </article>
          <article className={styles.summaryCard}>
            <span>Pendientes</span>
            <strong>{pendingCount}</strong>
          </article>
          <article className={styles.summaryCard}>
            <span>Completadas</span>
            <strong>{completedCount}</strong>
          </article>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="task">
            Nueva tarea
          </label>
          <div className={styles.formRow}>
            <input
              id="task"
              className={styles.input}
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ej. Preparar la clase de Redux"
            />
            <button className={styles.primaryButton} type="submit">
              Agregar
            </button>
          </div>
        </form>

        <div className={styles.toolbar}>
          <div className={styles.filterGroup}>
            {filters.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  option.value === filter
                    ? styles.filterButtonActive
                    : styles.filterButton
                }
                onClick={() => dispatch(setFilter(option.value))}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.ghostButton}
            onClick={async () => {
              const db = getFirebaseClientFirestore();
              if (!db) {
                return;
              }

              const tasksRef = collection(db, "users", userId, "tasks");
              const completedQuery = query(
                tasksRef,
                where("completed", "==", true),
              );

              const snapshot = await getDocs(completedQuery);
              const batchDeletes = snapshot.docs.map((docItem) =>
                deleteDoc(doc(db, "users", userId, "tasks", docItem.id)),
              );

              await Promise.all(batchDeletes);
            }}
          >
            Limpiar completadas
          </button>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.listHeader}>
          <h2>Tareas visibles</h2>
          <span>{filteredTasks.length} elementos</span>
        </div>

        <ul className={styles.taskList}>
          {filteredTasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <button
                type="button"
                className={task.completed ? styles.checkDone : styles.check}
                onClick={async () => {
                  const db = getFirebaseClientFirestore();
                  if (!db) {
                    return;
                  }

                  const taskDoc = doc(db, "users", userId, "tasks", task.id);
                  await updateDoc(taskDoc, {
                    completed: !task.completed,
                  });
                }}
                aria-label={`Cambiar estado de ${task.text}`}
              >
                {task.completed ? "✓" : ""}
              </button>

              <div className={styles.taskBody}>
                <p
                  className={
                    task.completed ? styles.taskTextDone : styles.taskText
                  }
                >
                  {task.text}
                </p>
                <span className={styles.taskMeta}>
                  {task.completed ? "Completada" : "Pendiente"}
                </span>
              </div>

              <button
                type="button"
                className={styles.deleteButton}
                onClick={async () => {
                  const db = getFirebaseClientFirestore();
                  if (!db) {
                    return;
                  }

                  const taskDoc = doc(db, "users", userId, "tasks", task.id);
                  await deleteDoc(taskDoc);
                }}
              >
                Eliminar
              </button>
            </li>
          ))}

          {filteredTasks.length === 0 ? (
            <li className={styles.emptyState}>
              No hay tareas para este filtro.
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
