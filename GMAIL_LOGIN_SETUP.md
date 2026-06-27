# Configuración de Login con Gmail - Guía Completa

## ✅ Cambios Realizados

He agregado la funcionalidad de **login con Gmail** al proyecto. Los cambios incluyen:

### 1. **Hook de Autenticación** (`src/hooks/use-firebase-auth.ts`)
- ✅ Importé `GoogleAuthProvider` y `signInWithPopup` de Firebase
- ✅ Agregué la función `signInWithGoogle()` que maneja el popup de autenticación de Google
- ✅ Exporté la función en el retorno del hook

### 2. **Componente de Auth** (`src/components/auth-task-board.tsx`)
- ✅ Agregué un nuevo botón "Gmail" con logo oficial de Google
- ✅ El botón está posicionado entre el botón primario y el de toggle
- ✅ Incluye SVG inline con el logo de Gmail
- ✅ Integrado completamente con el hook

### 3. **Estilos CSS** (`src/app/page.module.css`)
- ✅ Agregué estilos para `.googleButton` con colores corporativos de Google
- ✅ Incluye hover effect y estado disabled
- ✅ Mantiene coherencia visual con el diseño existente

---

## 🔧 Configuración Necesaria

Para que el login con Gmail funcione, debes configurar Firebase:

### Paso 1: Habilitar Google Sign-In en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Sign-in method**
4. Habilita **Google** como proveedor
5. Configura tu email y nombre de soporte de OAuth consent screen

### Paso 2: Configurar las Variables de Entorno
1. Copia `.env.example` a `.env.local`
2. Llena los valores con tus credenciales de Firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### Paso 3: Configurar URLs Autorizadas (Importante!)
En Firebase Console:
1. Ve a **Project Settings** → **Authorization domains**
2. Agrega `localhost:3000` (para desarrollo)
3. Agrega tu dominio de producción cuando deployes

---

## 🚀 Cómo Funciona

### Login con Gmail:
1. El usuario hace clic en el botón "Gmail"
2. Se abre un popup de autenticación de Google
3. El usuario inicia sesión con su cuenta de Google
4. Firebase autentica y crea la sesión automáticamente
5. La app redirige a la página autenticada

### Características Incluidas:
- ✅ Popup de autenticación estándar de Google
- ✅ Manejo de errores integrado
- ✅ Estado de carga ("Procesando...")
- ✅ Compatible con el sistema existente de Firebase Auth
- ✅ Sin necesidad de contraseña

---

## 📱 Cómo Probar

1. **En Desarrollo:**
   ```bash
   pnpm dev
   # Abre http://localhost:3000
   # Haz clic en el botón "Gmail"
   ```

2. **Espera un popup de Google** (puede bloquearse por popup blocker)
3. **Inicia sesión** con tu cuenta de Google
4. **Serás redirigido** a la página autenticada

---

## ⚠️ Posibles Problemas

### "No se puede conectar a Google"
- Verifica que las variables de entorno estén correctas
- Asegúrate de haber habilitado Google Sign-In en Firebase Console
- Revisa la consola del navegador para errores específicos

### "Popup bloqueado"
- Desactiva temporalmente el bloqueador de popups
- El navegador puede bloquear popups si no es una acción directa del usuario

### "Dominio no autorizado"
- Agrega `localhost:3000` a las Authorization domains en Firebase
- Si estás en producción, agrega tu dominio

---

## 📚 Archivos Modificados

- [src/hooks/use-firebase-auth.ts](src/hooks/use-firebase-auth.ts)
- [src/components/auth-task-board.tsx](src/components/auth-task-board.tsx)
- [src/app/page.module.css](src/app/page.module.css)

---

## ✨ Próximas Mejoras (Opcionales)

Si quieres mejorar más el proyecto:
- [ ] Agregar login con GitHub/Facebook
- [ ] Guardar preferencias de usuario en Firebase Firestore
- [ ] Agregar foto de perfil de Google
- [ ] Sync de tareas con base de datos
- [ ] Persistencia de sesión mejorada

---

**¡Tu app está lista para usar login con Gmail!** 🎉
