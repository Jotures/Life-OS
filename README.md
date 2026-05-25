# 🛡️ LifeOS — Tu Sistema de Gestión Personal Gamificado

**LifeOS** es una aplicación web interactiva y de alta fidelidad visual diseñada para gamificar tu productividad, hábitos y metas diarias. Utiliza mecánicas inspiradas en los juegos de rol (RPG) clásicos para convertir tu desarrollo personal en una aventura interactiva, donde ganas experiencia (XP), subes de nivel, gestionas misiones (quests) y gastas tus recompensas en una tienda de botín (loot) personalizada.

El sistema cuenta con un diseño de interfaz premium oscuro (*dark mode*) con efectos de desenfoque de cristal (*glassmorphic*), micro-animaciones dinámicas y visualizaciones de datos detalladas.

---

## 🌟 Características Principales

### 1. 🎯 Panel del Jugador y Hábitos ("Mi Día")
* **Hábitos a Construir (+10 XP):** Registra tus rutinas diarias y márcalas para ganar experiencia. Cuenta con un sistema inteligente de fechas para evitar desfases horarios y mantener vivas tus rachas de disciplina.
* **Vicios a Dejar (XP Pasivo):** Define malos hábitos de los que quieres alejarte. Ganas +10 XP pasivos de manera automática por cada día limpio.
* **Castigo Hardcore (Multa de XP):** Si tienes una recaída en un vicio, puedes presionar "Recaí". Esto reiniciará tu racha a cero y te aplicará una penalización progresiva de **-50 XP multiplicado por tu nivel actual**. ¡A mayor nivel, más dura es la caída!

### 2. 🏁 Gestión de Metas e Hitos ("Metas")
* **Metas Vitales:** Vincula tus hábitos a categorías de metas de largo plazo (Salud, Mente, Carrera, etc.) para visualizar tu equilibrio vital en tiempo real.
* **Misiones (Quests):** Misiones específicas con valores objetivo (`target_value`) y progreso actual. Al completarlas, se activa una celebración visual de confeti y recibes grandes recompensas de XP (ej. +500 XP).

### ⏱️ 3. Focus Studio (Pomodoro)
* Un completo panel de concentración con presets clásicos de estudio:
  * 🍅 **Clásico (25/5):** 25 min de enfoque, 5 min de descanso.
  * 🧠 **Profundo (50/10):** 50 min de enfoque, 10 min de descanso.
  * ⚡ **Sprint (15/3):** 15 min de enfoque, 3 min de descanso.
* Admite configuraciones de tiempos personalizadas, alarmas sonoras y un campo interactivo para definir tu misión de enfoque actual.

### 📊 4. Panel de Analíticas ("Progreso")
* **Actividad de Hábitos:** Gráfico interactivo que muestra los hábitos completados en los últimos 14 días.
* **Equilibrio de Metas:** Gráfico de radar (*spider chart*) que mapea la fuerza de tus hábitos en relación a tus metas vitales.
* **Análisis de Vicios / Días de Peligro:** Identifica patrones de recaída analizando qué días de la semana sufres más tropiezos y muestra la evolución e incremento de tus rachas de disciplina.

### 💰 5. Tienda de Loot (Recompensas)
* Puedes agregar recompensas de la vida real con iconos emoji y costes de XP personalizados.
* Gasta la experiencia ganada con esfuerzo para "comprar" estas recompensas, fomentando un sistema psicológico de incentivo real.

### 💀 6. Memento Mori
* Panel visual que calcula tus semanas de vida basándose en una expectativa promedio de 70 años.
* Muestra de forma gráfica las semanas vividas y las restantes, actuando como un poderoso recordatorio diario para aprovechar cada día al máximo.

---

## 🛠️ Stack Tecnológico

La aplicación está construida con tecnologías modernas y eficientes para garantizar un rendimiento óptimo en el lado del cliente:

* **Core:** [React 18](https://react.dev/) + [Vite](https://vite.dev/) (para un arranque y empaquetado ultra rápido en ESM).
* **Estilizado (CSS):** [Tailwind CSS v3](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) para iconos vectoriales limpios y modernos.
* **Base de Datos & Backend:** [Supabase](https://supabase.com/) (PostgreSQL en la nube en tiempo real).
* **Gráficos:** [Recharts](https://recharts.org/) (gráficos de radar, líneas y barras responsivos).
* **Efectos:** [Canvas Confetti](https://github.com/catdad/canvas-confetti) para animaciones de celebración.

---

## 💾 Estructura de la Base de Datos

La aplicación utiliza Supabase con Row Level Security (RLS) habilitado. Las tablas principales del esquema PostgreSQL son:

1. `perfil_jugador`: Almacena el ID del jugador, su XP y su nivel.
2. `habitos`: Registra hábitos de tipo `construir` y `dejar`, vinculados a rachas y metas.
3. `metas`: Almacena las metas vitales y las quests (misiones activas).
4. `historial_habitos`: Guarda registros diarios de compleción de hábitos para alimentar las analíticas de actividad.
5. `historial_recaidas`: Almacena las recaídas para identificar "días de peligro" e históricos de disciplina.
6. `recompensas`: Lista de objetos e incentivos de la tienda de botín.

Las migraciones de la base de datos se encuentran organizadas en la carpeta [`migrations/`](file:///c:/dev/LifeOS/migrations) para su fácil importación en el SQL Editor de Supabase.

---

## 🚀 Instalación y Desarrollo Local

Sigue estos pasos para ejecutar la aplicación en tu entorno local:

### Prerrequisitos
* tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### Paso 1: Clonar el Repositorio e Instalar Dependencias
```bash
# Instalar las dependencias
npm install
```

### Paso 2: Configurar las Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto (toma como referencia el archivo `.env` existente) e introduce tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

### Paso 3: Inicializar el Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:5173](http://localhost:5173) para ver LifeOS en acción.

---

## 📦 Compilación y Despliegue

### Compilar para Producción
Para compilar la aplicación optimizada para producción:
```bash
npm run build
```
Esto generará los archivos estáticos listos para producción dentro del directorio `dist/`.

### Despliegue Automatizado (GitHub Pages)
El proyecto incluye un flujo de trabajo de integración continua mediante GitHub Actions ([`.github/workflows/deploy.yml`](file:///c:/dev/LifeOS/.github/workflows/deploy.yml)).
Cada vez que realices un `push` a la rama `main`, la aplicación se compilará y desplegará automáticamente en GitHub Pages usando las siguientes variables de secretos en tu repositorio de GitHub:
* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`

---

## 🤖 Habilidades de IA Optimizadas (Skills)
El repositorio cuenta con una suite de habilidades de IA optimizada dentro de la carpeta [`skills/`](file:///c:/dev/LifeOS/skills). Estas habilidades están pre-filtradas y optimizadas para que cualquier asistente de IA (como Antigravity) tenga un entendimiento inmediato y estructurado de:
* Patrones de diseño modernos de React y Tailwind CSS.
* Buenas prácticas en arquitectura de PostgreSQL y Supabase.
* Flujos seguros de planificación de cambios y mitigación de riesgos.
* Guías de depuración y pruebas sistemáticas.
