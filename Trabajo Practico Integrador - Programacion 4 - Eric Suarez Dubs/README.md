# Food Store — Trabajo Práctico Integrador

Aplicación web de pedidos de comida. Backend FastAPI + SQLModel y frontend React + TypeScript.

## Requisitos
- Python 3.11–3.13
- PostgreSQL 15+ (opcional para desarrollo: SQLite)
- Node.js 20.19+
- pnpm 9+

## Estructura
- `backend/`: API REST, autenticación JWT en cookie HttpOnly, SQLModel, Unit of Work.
- `frontend/`: React, Vite, Tailwind, TanStack Query/Form/Table y Zustand.

## 1. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
cp .env.example .env
pip install -r requirements.txt
python -m app.db.seed
uvicorn app.main:app --reload
```
API: http://localhost:8000/api/v1  
Swagger: http://localhost:8000/docs  
ReDoc: http://localhost:8000/redoc

El `.env.example` usa SQLite para que la primera ejecución sea sencilla. Para PostgreSQL, reemplazar `DATABASE_URL`, por ejemplo:
`postgresql+psycopg://postgres:postgres@localhost:5432/foodstore`

### Administrador del seed
- Usuario: `admin`
- Contraseña: `Admin1234!`
- Rol: `admin`

Cambiar la contraseña después de la primera ejecución en un entorno real.

## 2. Frontend
En otra terminal:
```bash
cd frontend
cp .env.example .env
pnpm install
pnpm build
pnpm dev
```
Frontend: http://localhost:5173

## Variables de entorno
Backend (`backend/.env`):
- `DATABASE_URL`: conexión SQLModel.
- `SECRET_KEY`: clave de firma JWT de al menos 32 caracteres.
- `ALGORITHM`: algoritmo JWT (HS256).
- `ACCESS_TOKEN_EXPIRE_MINUTES`: duración de sesión (30).
- `FRONTEND_ORIGIN`: origen permitido por CORS.

Frontend (`frontend/.env`):
- `VITE_API_URL`: URL base de la API, incluyendo `/api/v1`.

## Flujo de prueba sugerido
1. Iniciar backend y frontend.
2. Iniciar sesión como `admin` / `Admin1234!`.
3. Revisar categorías, productos, pedidos, usuarios y resumen.
4. Registrar un usuario desde `/register`.
5. Iniciar sesión como cliente, agregar productos, finalizar checkout y consultar `/mis-pedidos`.
6. Volver a admin y avanzar/cancelar pedidos. Al cancelar, verificar restitución de stock.

## Entrega
- Completar en este README la URL pública del repositorio GitHub.
- Completar el enlace público del video de demostración (10–15 minutos).
- Generar ZIP sin `.env`, `.venv`, `node_modules`, `dist` ni archivos de base local.

Repositorio: `PENDIENTE: agregar URL pública de GitHub`  
Video: `PENDIENTE: agregar enlace público del video`

## Nota de desarrollo
El proyecto implementa las reglas funcionales del enunciado. Antes de entregar, ejecutar los comandos de verificación de ambas partes y realizar una prueba integral con PostgreSQL, además de revisar los detalles de la rúbrica y completar los enlaces de entrega.
