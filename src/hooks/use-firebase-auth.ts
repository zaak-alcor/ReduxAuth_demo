"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import {
  ChangeEvent,
  FormEvent,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  firebaseConfigError,
  getFirebaseClientAuth,
} from "@/lib/firebase/client";

type AuthMode = "login" | "register";

type FormState = {
  email: string;
  password: string;
};

const initialFormState: FormState = {
  email: "",
  password: "",
};

function getFirebaseErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Ese correo ya esta registrado.";
      case "auth/invalid-email":
        return "El correo no tiene un formato valido.";
      case "auth/user-not-found":
      case "auth/invalid-credential":
        return "Credenciales invalidas.";
      case "auth/weak-password":
        return "La contrasena debe tener al menos 6 caracteres.";
      case "auth/too-many-requests":
        return "Demasiados intentos. Espera un momento e intentalo otra vez.";
      default:
        return "No se pudo completar la autenticacion.";
    }
  }

  return "Ocurrio un error inesperado durante la autenticacion.";
}

export function useFirebaseAuth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<FormState>(initialFormState);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(
    firebaseConfigError === null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    firebaseConfigError,
  );

  useEffect(() => {
    const auth = getFirebaseClientAuth();

    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      startTransition(() => {
        setCurrentUser(user);
        setIsBootstrapping(false);
      });
    });

    return unsubscribe;
  }, []);

  const isAuthenticated = currentUser !== null;

  const view = useMemo(
    () => ({
      title:
        mode === "login" ? "Ingresa a tu espacio" : "Crea tu cuenta",
      submitLabel: mode === "login" ? "Iniciar sesion" : "Crear cuenta",
      helperText:
        mode === "login"
          ? "Usa tu correo y contrasena para entrar."
          : "Registrate con correo y contrasena para empezar.",
      toggleLabel:
        mode === "login"
          ? "No tienes cuenta? Crear una"
          : "Ya tienes cuenta? Inicia sesion",
    }),
    [mode],
  );

  const handleFieldChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const resetForm = () => {
    setForm(initialFormState);
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage(firebaseConfigError);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const auth = getFirebaseClientAuth();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!auth) {
      setErrorMessage(firebaseConfigError ?? "Firebase no esta configurado.");
      return;
    }

    if (!email || !password) {
      setErrorMessage("Completa correo y contrasena.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      resetForm();
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    const auth = getFirebaseClientAuth();

    if (!auth) {
      setErrorMessage(firebaseConfigError ?? "Firebase no esta configurado.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signOut(auth);
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const signInWithGoogle = async () => {
    const auth = getFirebaseClientAuth();

    if (!auth) {
      setErrorMessage(firebaseConfigError ?? "Firebase no esta configurado.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      resetForm();
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentUser,
    email: form.email,
    errorMessage,
    helperText: view.helperText,
    isAuthenticated,
    isBootstrapping,
    isSubmitting,
    mode,
    password: form.password,
    submitLabel: view.submitLabel,
    title: view.title,
    toggleLabel: view.toggleLabel,
    onEmailChange: handleFieldChange("email"),
    onPasswordChange: handleFieldChange("password"),
    onSubmit: submit,
    onLogout: logout,
    signInWithGoogle,
    setLoginMode: () => switchMode("login"),
    setRegisterMode: () => switchMode("register"),
  };
}
