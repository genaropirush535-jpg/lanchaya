# 🚤 LanchaYa Iquitos

Aplicación web donde las empresas fluviales registran sus salidas (lanchas, rápidos y deslizadores) y los pasajeros las consultan y filtran por destino, fecha y tipo de embarcación.

## Integrantes
- Genaro Pirush

## Tecnologías
- **Backend:** Node.js + Express 4, persistencia en archivo JSON
- **Frontend:** React 19 + Vite, Axios

## Requisitos
- Node.js 20 o superior

## Instalación y ejecución

### 1. Backend (puerto 3000)
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (puerto 5173)
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
Abre http://localhost:5173 en el navegador. El backend debe estar encendido.

## API REST

| Método | Ruta | Descripción | Respuesta |
|--------|------|-------------|-----------|
| GET | /api/salidas | Lista salidas (`?destino=`, `?fecha=`, `?tipo=`) | 200 |
| GET | /api/salidas/:id | Detalle de una salida | 200 / 404 |
| POST | /api/salidas | Registra una salida | 201 / 400 |
| PUT | /api/salidas/:id | Actualiza una salida | 200 / 400 / 404 |
| DELETE | /api/salidas/:id | Elimina una salida | 204 / 404 |
| GET | /api/destinos | Destinos sin repetir | 200 |

## Validaciones
- `empresa`, `destino`, `puerto` y `fechaHora` son obligatorios.
- `precio` debe ser un número mayor que 0.
- `tipo` solo acepta `lancha`, `rapido` o `deslizador`.
- `fechaHora` no puede estar en el pasado al registrar.

## Funcionalidades
- Listado en tarjetas ordenado por fecha más próxima
- Filtros por destino, fecha y tipo, con botón para limpiar
- Registrar y editar salidas con validación antes de enviar
- Eliminar con confirmación
- Estados de carga, lista vacía y error de conexión
- Diseño responsive para celular
