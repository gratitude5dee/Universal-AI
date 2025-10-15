import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

type OutlineSection = {
  title: string;
  description?: string;
  talkingPoints?: string[];
};

type PodcastSegment = {
  title: string;
  summary: string;
  script: string;
};

type PodcastRequest = {
  title: string;
  description?: string;
  script: string;
  voiceId: string;
  style?: "conversational" | "news" | "storytelling" | "educational";
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const cerebrasApiKey = Deno.env.get("CEREBRAS_API_KEY");
const elevenlabsApiKey = Deno.env.get("ELEVENLABS_API_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are not configured");
}

if (!cerebrasApiKey || !elevenlabsApiKey) {
  throw new Error("Required AI provider keys are not configured");
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

const MIN_DURATION_SECONDS = 60;
const WORDS_PER_MINUTE = 155;

const normalizeJson = (input: string): unknown => {
  const cleaned = input
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const maybeJson = cleaned.slice(start, end + 1);
      return JSON.parse(maybeJson);
    }
    throw new Error("Unable to parse JSON response from model");
  }
};

let jobId: string | null = null;

const estimateDurationSeconds = (script: string): number => {
  const words = script.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.round((words / WORDS_PER_MINUTE) * 60);
  return Math.max(MIN_DURATION_SECONDS, seconds);
};

const callCerebras = async (messages: unknown): Promise<string> => {
  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cerebrasApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.1-70b",
      temperature: 0.6,
      max_tokens: 2000,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cerebras request failed: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Cerebras response did not include content");
  }
  return content;
};

const generateOutline = async (request: PodcastRequest): Promise<OutlineSection[]> => {
  const outlineContent = await callCerebras([
    {
      role: "system",
      content:
        "You are an expert podcast producer. Create structured outlines with 3-5 concise sections. Respond in JSON with {\"sections\":[{\"title\":string,\"description\":string,\"talkingPoints\":[string]}]}.",
    },
    {
      role: "user",
      content: JSON.stringify({
        title: request.title,
        description: request.description ?? "",
        style: request.style ?? "conversational",
        starterScript: request.script,
      }),
    },
  ]);

  const parsed = normalizeJson(outlineContent) as { sections?: OutlineSection[] };
  if (!parsed?.sections?.length) {
    throw new Error("Cerebras did not return an outline");
  }

  return parsed.sections;
};

const generateSegments = async (
  request: PodcastRequest,
  outline: OutlineSection[],
): Promise<PodcastSegment[]> => {
  const segmentContent = await callCerebras([
    {
      role: "system",
      content:
        "You are a senior podcast scriptwriter. Given an outline, craft engaging segments. Respond in JSON with {\"segments\":[{\"title\":string,\"summary\":string,\"script\":string}]}.",
    },
    {
      role: "user",
      content: JSON.stringify({
        title: request.title,
        description: request.description ?? "",
        style: request.style ?? "conversational",
        outline,
        starterScript: request.script,
      }),
    },
  ]);

  const parsed = normalizeJson(segmentContent) as { segments?: PodcastSegment[] };
  if (!parsed?.segments?.length) {
    throw new Error("Cerebras did not return any segments");
  }

  return parsed.segments.map((segment) => ({
    title: segment.title?.trim() || "Segment",
    summary: segment.summary?.trim() || "",
    script: segment.script?.trim() || "",
  }));
};

const generateShowNotes = async (
  request: PodcastRequest,
  segments: PodcastSegment[],
): Promise<string> => {
  const notesContent = await callCerebras([
    {
      role: "system",
      content:
        "You are a podcast marketing expert. Produce compelling show notes summarizing the episode. Respond with rich markdown (no JSON).",
    },
    {
      role: "user",
      content: JSON.stringify({
        title: request.title,
        description: request.description ?? "",
        style: request.style ?? "conversational",
        segments,
      }),
    },
  ]);

  return notesContent.trim();
};

const synthesizeAudio = async (voiceId: string, script: string): Promise<Uint8Array> => {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": elevenlabsApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.7,
        style: 0.55,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Audio generation failed: ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    jobId = null;
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await adminClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error("Invalid or missing user session");
    }

    const request = (await req.json()) as PodcastRequest;
    if (!request?.title || !request?.script || !request?.voiceId) {
      throw new Error("Title, script, and voiceId are required");
    }

    const { data: jobRecord, error: jobError } = await adminClient
      .from("podcast_generation_jobs")
      .insert({
        user_id: user.id,
        status: "processing",
        request,
      })
      .select()
      .single();

    if (jobError || !jobRecord) {
      throw new Error("Unable to create podcast generation job");
    }

    jobId = jobRecord.id;

    const outline = await generateOutline(request);
    const segments = await generateSegments(request, outline);
    const finalScript = segments.map((segment) => segment.script).join("\n\n");
    const showNotes = await generateShowNotes(request, segments);

    const audioBytes = await synthesizeAudio(request.voiceId, finalScript);
    const audioFormat = "audio/mpeg";
    const durationSeconds = estimateDurationSeconds(finalScript);
    const filePath = `${user.id}/${crypto.randomUUID()}.mp3`;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { error: uploadError } = await supabase.storage
      .from("podcast-audio")
      .upload(filePath, audioBytes, {
        contentType: audioFormat,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload audio: ${uploadError.message}`);
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("podcast-audio")
      .createSignedUrl(filePath, 60 * 60 * 24);

    if (signedUrlError) {
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }

    const { data: insertedPodcast, error: insertError } = await supabase
      .from("podcasts")
      .insert({
        user_id: user.id,
        title: request.title,
        description: request.description ?? null,
        audio_url: filePath,
        voice_id: request.voiceId,
        style: request.style ?? "conversational",
        duration: durationSeconds,
        duration_seconds: durationSeconds,
        script: finalScript,
        outline,
        segments,
        show_notes: showNotes,
        audio_format: audioFormat,
        file_size: audioBytes.byteLength,
        audio_signed_url: signedUrlData?.signedUrl ?? null,
      })
      .select()
      .single();

    if (insertError || !insertedPodcast) {
      await adminClient
        .from("podcast_generation_jobs")
        .update({ status: "failed", error_message: insertError?.message ?? "insert failed" })
        .eq("id", jobRecord.id);
      jobId = null;
      throw new Error(`Failed to save podcast metadata: ${insertError?.message}`);
    }

    await adminClient
      .from("podcast_generation_jobs")
      .update({
        status: "succeeded",
        result: {
          podcast_id: insertedPodcast.id,
          audio_url: insertedPodcast.audio_url,
        },
      })
      .eq("id", jobRecord.id);

    jobId = null;

    return new Response(
      JSON.stringify({
        jobId: jobRecord.id,
        status: "succeeded",
        podcast: insertedPodcast,
        audioBase64: null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in podcast-generator function:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    if (jobId) {
      await adminClient
        .from("podcast_generation_jobs")
        .update({ status: "failed", error_message: message })
        .eq("id", jobId);
    }

    jobId = null;

    return new Response(
      JSON.stringify({
        status: "failed",
        error: message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
