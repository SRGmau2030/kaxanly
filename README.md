# Find My Home Device Tracker

## Descripción General

Este proyecto es una aplicación basada en React, construida con Vite y TypeScript, diseñada para ayudar a los usuarios a rastrear la ubicación y el estado de sus dispositivos domésticos. Utiliza prácticas modernas de desarrollo web y tiene como objetivo proporcionar una interfaz fácil de usar para administrar y monitorear los dispositivos dentro de una red doméstica.

## Tecnologías Utilizadas

-   **React:** Una biblioteca de JavaScript para construir interfaces de usuario.
-   **Vite:** Una herramienta de construcción que proporciona una experiencia de desarrollo rápida y eficiente.
-   **TypeScript:** Un superconjunto de JavaScript que añade tipado estático.
-   **Tailwind CSS:** Un framework CSS de utilidad-primera para estilizar rápidamente la aplicación.
-   **Lucide React:** Una biblioteca de iconos hermosos y consistentes.
-   **Date-fns:** Una biblioteca moderna de utilidades de fecha para JavaScript.

## Estructura del Proyecto

El proyecto está estructurado de la siguiente manera:

```
find-my-home-device-tracker/
├── src/
│   ├── components/          # Componentes reutilizables de la interfaz de usuario
│   │   ├── layout/          # Componentes de diseño general (Header, Sidebar)
│   │   ├── map/             # Componentes relacionados con el mapa (HomeMap, DeviceMarker)
│   │   ├── devices/         # Componentes para la gestión de dispositivos (DeviceDetail, DeviceForm)
│   ├── context/             # Contexto de React para la gestión del estado global (DeviceContext)
│   ├── features/            # Funcionalidades específicas de la aplicación
│   │   ├── home/            # Funcionalidades relacionadas con la vista principal del hogar
│   │   │   ├── components/  # Componentes específicos de la vista principal del hogar (HouseScanner)
│   ├── types/               # Definiciones de tipos de TypeScript
│   ├── data/                # Datos estáticos o de prueba (mockData)
│   ├── App.tsx              # Componente principal de la aplicación
│   ├── main.tsx             # Punto de entrada principal de la aplicación
│   ├── index.css            # Estilos globales
├── public/              # Archivos estáticos (imágenes, etc.)
├── vite.config.ts       # Configuración de Vite
├── tsconfig.json        # Configuración de TypeScript
├── tailwind.config.js   # Configuración de Tailwind CSS
├── postcss.config.js    # Configuración de PostCSS
├── package.json         # Metadatos del proyecto y dependencias
├── README.md            # Este archivo
```

### Descripción de Carpetas y Componentes Clave

-   **`src/components/`**: Contiene componentes de interfaz de usuario reutilizables.
    -   **`layout/`**: Componentes para la estructura general de la página, como la cabecera (`Header`), la barra lateral (`Sidebar`) y la lista de dispositivos (`DeviceList`).
    -   **`map/`**: Componentes para la visualización del mapa, incluyendo el mapa del hogar (`HomeMap`) y los marcadores de dispositivos (`DeviceMarker`).
    -   **`devices/`**: Componentes para mostrar detalles de dispositivos (`DeviceDetail`) y para la creación/edición de dispositivos (`DeviceForm`).
-   **`src/context/`**: Define el contexto de React (`DeviceContext`) para gestionar el estado global de la aplicación, como la lista de dispositivos, el dispositivo seleccionado, etc.
-   **`src/features/home/components/`**: Contiene componentes específicos para la funcionalidad de la vista principal del hogar, como el escáner de la casa (`HouseScanner`).
-   **`src/types/`**: Define los tipos de datos utilizados en la aplicación, como `Device` y `Room`.
-   **`src/data/`**: Contiene datos estáticos o de prueba, como `mockData` para el diseño del hogar y los tipos de dispositivos.
-   **`App.tsx`**: Es el componente raíz de la aplicación, que renderiza la estructura principal y gestiona el estado general.

## Configuración

El proyecto está configurado utilizando `vite.config.ts` para las opciones de Vite y `tsconfig.json` para las opciones de TypeScript. Tailwind CSS se configura a través de `tailwind.config.js` y `postcss.config.js`.

## Empezando

### Prerrequisitos

-   Node.js (versión 18 o superior)
-   npm o yarn como gestor de paquetes

### Instalación

1.  Clona el repositorio:

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd find-my-home-device-tracker
    ```

2.  Instala las dependencias:

    ```bash
    npm install
    ```

    o

    ```bash
    yarn install
    ```

### Ejecutando la Aplicación

1.  Inicia el servidor de desarrollo:

    ```bash
    npm run dev
    ```

    o

    ```bash
    yarn dev
    ```

2.  Abre tu navegador y navega a la dirección proporcionada por Vite (normalmente `http://localhost:5173`).

### Construyendo para Producción

1.  Construye la aplicación:

    ```bash
    npm run build
    ```

    o

    ```bash
    yarn build
    ```

2.  La salida de la construcción estará en el directorio `dist`.

### Linting

Para asegurar la calidad del código, el proyecto incluye ESLint para el linting.

1.  Ejecuta el linter:

    ```bash
    npm run lint
    ```

    o

    ```bash
    yarn lint
    ```

## Contribución

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1.  Haz un fork del repositorio.
2.  Crea una nueva rama para tu característica o corrección de errores.
3.  Realiza tus cambios y commitea con mensajes descriptivos.
4.  Envía un pull request.

## Licencia

[Especifica la licencia bajo la cual se publica el proyecto]
