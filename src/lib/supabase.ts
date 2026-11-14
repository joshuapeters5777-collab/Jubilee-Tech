// ============================================================================
// JUBILEE TECH — UNIFIED SUPABASE POSTGRES 17 & VERCEL CLOUD CLIENT
// Project ID: sclhhyutcbwajzuilahg (eu-west-1)
// ============================================================================

export const SUPABASE_PROJECT_ID = "sclhhyutcbwajzuilahg";
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://sclhhyutcbwajzuilahg.supabase.co";
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjbGhoeXV0Y2J3YWp6dWlsYWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxMzUyMTAsImV4cCI6MjEwOTcxMTIxMH0.P2SiwxxF1aZqyuOJTgjTVyNw8qgjYOCAeVxxb2HA5Go";

function supabaseHeaders(prefer = "return=representation"): HeadersInit {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

export async function supabaseSelect<T = any>(
  table: string,
  query = "select=*&order=created_at.desc",
): Promise<T[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      method: "GET",
      headers: supabaseHeaders(),
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

export async function supabaseUpsert<T = any>(
  table: string,
  payload: Record<string, any> | Record<string, any>[],
): Promise<T[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: supabaseHeaders("resolution=merge-duplicates,return=representation"),
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

export async function supabaseDelete(
  table: string,
  idColumn: string,
  idValue: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?${idColumn}=eq.${encodeURIComponent(idValue)}`,
      {
        method: "DELETE",
        headers: supabaseHeaders("return=minimal"),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

// Direct Vercel REST API v13 Deployment Helper for Generated Client Sites & Portfolio Apps
export interface VercelDeploymentFile {
  file: string;
  data: string;
}

export async function deployFilesToVercel(params: {
  projectName: string;
  files: VercelDeploymentFile[];
  vercelToken: string;
}): Promise<{ ok: boolean; url?: string; error?: string }> {
  const cleanName = params.projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "jubilee-client-site";

  try {
    const res = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.vercelToken.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cleanName,
        files: params.files,
        projectSettings: {
          framework: null,
        },
        target: "production",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        ok: false,
        error: data?.error?.message || `Vercel API returned HTTP ${res.status}`,
      };
    }

    const deployedUrl = data?.url ? `https://${data.url}` : undefined;
    return {
      ok: true,
      url: deployedUrl,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Network error contacting Vercel API",
    };
  }
}
