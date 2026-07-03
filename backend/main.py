from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS para permitir que Angular (Frontend) se conecte con Python (Backend)
# El puerto por defecto de Angular es el 4200
origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mensaje": "¡Bienvenido a la API de VendeFácil con IA!"}

@app.post("/api/ia/procesar")
def procesar_datos_ia(datos: dict):
    # Aquí es donde integrarás la lógica de tu IA (Gemini, OpenAI, etc) más adelante
    # Por ahora, solo devolveremos lo que recibimos para probar la conexión
    texto_recibido = datos.get("texto", "")
    
    return {
        "respuesta_ia": f"🤖 IA Simbólica: He recibido tu texto -> '{texto_recibido}'. ¡Pronto usaré IA real aquí!"
    }
