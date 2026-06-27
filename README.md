# ReduxAuth

Demo de autenticación con Firebase y tablero de tareas persistente.

El proyecto incluye:

- Login con correo y contraseña.
- Login con Google.
- Guardado de tareas en Firestore por usuario.
- Marcar tareas como completadas y eliminarlas.
- Interfaz responsive y limpia.

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

> Si usas npm, `npm install` y `npm run dev` también funcionan.

## Configuración de Firebase

Copia el archivo `.env.example` a `.env.local` y completa tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

No subas `.env.local` a GitHub. El repo ya está configurado para ignorar archivos `.env*`.

## Reglas de Firestore

Coloca estas reglas en la consola de Firebase en `Firestore Database > Rules`:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

También hay un archivo `firestore.rules` en el repo para usar con Firebase CLI.

## Estructura relevante

- `src/app/page.tsx` - punto de entrada de la app.
- `src/components/auth-task-board.tsx` - formulario de login y layout principal.
- `src/components/task-demo.tsx` - lista de tareas y operaciones en Firestore.
- `src/lib/firebase/client.ts` - inicialización de Firebase.
- `.env.example` - variables de entorno de ejemplo.

## Buenas prácticas antes de subir al repo

- Elimina o no incluyas `.env.local` en Git.
- No dejes reglas abiertas en Firestore en producción.
- Si quieres, usa Firebase Emulator Suite para pruebas locales.
