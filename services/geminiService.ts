import { GoogleGenAI } from "@google/genai";
import { Appointment, User, Service } from "../types";

// Inicializar cliente solo si existe la key (seguridad)
const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateDailySummary = async (
  appointments: Appointment[],
  specialists: User[],
  services: Service[]
): Promise<string> => {
  if (!ai) return "API Key no configurada. No se puede generar el resumen con IA.";

  // Preparamos el contexto para el modelo
  const dataContext = JSON.stringify({
    totalAppointments: appointments.length,
    appointments: appointments.map(app => ({
      date: app.dateStart,
      status: app.status,
      service: services.find(s => s.id === app.serviceId)?.name,
      specialist: specialists.find(s => s.id === app.specialistId)?.lastName
    }))
  });

  const prompt = `
    Actúa como un asistente administrativo inteligente para la "Clínica Equilibrar".
    Analiza los siguientes datos de citas del día/semana en formato JSON:
    ${dataContext}

    Genera un resumen ejecutivo breve (máximo 1 párrafo) y 3 puntos clave de acción o alerta para la administración.
    El tono debe ser profesional y enfocado en la eficiencia operativa.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No se pudo generar el resumen.";
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return "Error al conectar con el servicio de IA.";
  }
};
