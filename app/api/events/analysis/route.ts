import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface AnalysisRequest {
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: string;
  venue?: string;
  startTime: string;
  statistics?: Array<{ type: string; home: string | number | null; away: string | number | null }>;
  h2hMatches?: Array<{
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number | null;
    awayScore: number | null;
    league: string;
  }>;
  lineups?: Array<{
    team: string;
    formation: string | null;
    startXI: Array<{ name: string; number: number; pos: string }>;
  }>;
}

function buildPrompt(data: AnalysisRequest): string {
  const parts: string[] = [];

  parts.push(`DEPORTE: ${data.sport}`);
  parts.push(`LIGA: ${data.league}`);
  parts.push(`PARTIDO: ${data.homeTeam} vs ${data.awayTeam}`);
  parts.push(`ESTADO: ${data.status}`);
  parts.push(`FECHA: ${data.startTime}`);
  if (data.venue) parts.push(`SEDE: ${data.venue}`);
  if (data.homeScore !== undefined && data.awayScore !== undefined) {
    parts.push(`MARCADOR: ${data.homeTeam} ${data.homeScore} - ${data.awayScore} ${data.awayTeam}`);
  }

  if (data.statistics && data.statistics.length > 0) {
    parts.push('\n--- ESTADISTICAS DEL PARTIDO ---');
    for (const stat of data.statistics) {
      parts.push(`${stat.type}: ${data.homeTeam} ${stat.home ?? '-'} | ${data.awayTeam} ${stat.away ?? '-'}`);
    }
  }

  if (data.h2hMatches && data.h2hMatches.length > 0) {
    parts.push('\n--- HISTORIAL ENFRENTAMIENTOS (H2H) ---');
    for (const match of data.h2hMatches) {
      const d = new Date(match.date).toLocaleDateString('es-ES');
      parts.push(`${d}: ${match.homeTeam} ${match.homeScore ?? '-'} - ${match.awayScore ?? '-'} ${match.awayTeam} (${match.league})`);
    }
  }

  if (data.lineups && data.lineups.length > 0) {
    parts.push('\n--- ALINEACIONES ---');
    for (const lineup of data.lineups) {
      parts.push(`\n${lineup.team}${lineup.formation ? ` (${lineup.formation})` : ''}:`);
      for (const p of lineup.startXI) {
        parts.push(`  #${p.number} ${p.name} - ${p.pos}`);
      }
    }
  }

  return parts.join('\n');
}

const SYSTEM_PROMPT = `Eres un analista deportivo experto que trabaja para VYSCOR, una plataforma de seguimiento de eventos deportivos y esports. Tu trabajo es analizar partidos de forma objetiva y profesional.

Responde SIEMPRE en español y en formato JSON con esta estructura exacta:
{
  "resumen": "Resumen objetivo del partido en 2-3 frases, describiendo el contexto y lo más relevante.",
  "prediccion": {
    "favorito": "Nombre del equipo favorito",
    "confianza": "alta | media | baja",
    "razon": "Explicación breve de por qué este equipo tiene ventaja (basada en datos, no opinión)."
  },
  "metricas_clave": [
    {
      "titulo": "Nombre de la métrica",
      "valor": "Dato concreto",
      "interpretacion": "Qué significa este dato en contexto."
    }
  ],
  "analisis_global": "Análisis detallado de 3-5 frases cubriendo fortalezas, debilidades, patrones del H2H, y factores que podrían influir en el resultado."
}

Reglas:
- Sé objetivo, basa todo en los datos proporcionados.
- Si no hay suficientes datos para una predicción sólida, indica confianza "baja".
- Si el partido ya terminó (FINISHED), analiza lo que ocurrió en vez de predecir.
- Si el partido está en vivo (LIVE), comenta el desarrollo actual.
- Incluye entre 3 y 5 métricas clave relevantes para el deporte.
- NO inventes datos que no estén en la información proporcionada.
- Responde SOLO con el JSON, sin texto adicional ni bloques de código.`;

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'API key de IA no configurada' },
      { status: 503 }
    );
  }

  try {
    const body: AnalysisRequest = await request.json();

    if (!body.homeTeam || !body.awayTeam || !body.sport) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    }

    const matchData = buildPrompt(body);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(
      `Analiza este partido con los datos disponibles:\n\n${matchData}`
    );

    const text = result.response.text();
    if (!text) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Clean potential markdown code blocks from response
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const analysis = JSON.parse(cleaned);

    return NextResponse.json({ available: true, analysis });
  } catch (err) {
    console.error('AI analysis error:', err);
    return NextResponse.json(
      { available: false, error: 'Error generando análisis' },
      { status: 500 }
    );
  }
}
