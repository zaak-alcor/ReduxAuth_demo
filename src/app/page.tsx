import { AuthTaskBoard } from "@/components/auth-task-board";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <AuthTaskBoard />
    </main>
  );
}
