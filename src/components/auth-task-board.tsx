"use client";

import Image from "next/image";
import styles from "@/app/page.module.css";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { TaskDemo } from "@/components/task-demo";
import GmailIcon from "@/app/Gmail_icon.png";

export function AuthTaskBoard() {
  const auth = useFirebaseAuth();

  if (auth.isBootstrapping) {
    return (
      <section className={styles.authBoard}>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>Cargando</p>
          <h1 className={styles.title}>Un momento...</h1>
          <p className={styles.description}>
            Estamos preparando tu acceso, espera un momento por favor.
          </p>
        </div>
      </section>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <section className={styles.authBoard}>
        <div className={styles.panel}>
          <div className={styles.authPanelHeader}>
            <p className={styles.eyebrow}>Acceso seguro</p>
            <h1 className={styles.title}>{auth.title}</h1>
            <p className={styles.description}>
              Ingresa con correo y contraseña o inicia sesión directamente con Gmail.
            </p>
          </div>

          <form className={styles.form} onSubmit={auth.onSubmit}>
            <label className={styles.label} htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={auth.email}
              onChange={auth.onEmailChange}
              placeholder="correo@ejemplo.com"
            />

            <label className={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              value={auth.password}
              onChange={auth.onPasswordChange}
              placeholder="Mínimo 6 caracteres"
            />

            {auth.errorMessage ? (
              <p className={styles.errorMessage}>{auth.errorMessage}</p>
            ) : null}

            <div className={styles.authActions}>
              <button
                className={styles.primaryButton}
                type="submit"
                disabled={auth.isSubmitting}
              >
                {auth.isSubmitting ? "Procesando..." : auth.submitLabel}
              </button>

              <button
                type="button"
                className={styles.googleButton}
                onClick={auth.signInWithGoogle}
                disabled={auth.isSubmitting}
                title="Inicia sesion con Gmail"
              >
                <Image
                  src={GmailIcon}
                  alt="Gmail icon"
                  width={20}
                  height={20}
                />
                Gmail
              </button>
            </div>

            <button
              type="button"
              className={styles.ghostButton}
              onClick={
                auth.mode === "login"
                  ? auth.setRegisterMode
                  : auth.setLoginMode
              }
            >
              {auth.toggleLabel}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.authenticatedLayout}>
      <div className={styles.panel}>
        <div className={styles.authHeader}>
          <div>
            <p className={styles.eyebrow}>Bienvenido</p>
            <h1 className={styles.title}>Hola, {auth.currentUser?.email}</h1>
            <p className={styles.description}>
              Administra tus tareas aquí. Marca completadas o borra las que ya no necesites.
            </p>
          </div>

          <button
            type="button"
            className={styles.ghostButton}
            onClick={auth.onLogout}
            disabled={auth.isSubmitting}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {auth.currentUser?.uid ? (
        <TaskDemo userId={auth.currentUser.uid} />
      ) : null}
    </section>
  );
}
