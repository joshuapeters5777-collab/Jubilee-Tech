import React, { useState } from "react";
import {
  Copy,
  CheckCircle2,
  Sparkles,
  Wand2,
  Sliders,
  Layers,
  Terminal,
} from "lucide-react";

export const CAMERA_ANGLES = [
  "Medium Shot",
  "Extreme Close-Up",
  "Low Angle Hero Shot",
  "First-Person POV",
  "Wide Establishing Shot",
  "Over-the-Shoulder",
  "Bird's-Eye Overhead",
] as const;

export const SIMULATOR_CAMERA_MOTIONS = [
  "Fast Tracking Shot",
  "Dolly In (Fast)",
  "Whip Pan",
  "Orbit 360°",
  "Slow Push-In",
  "Handheld Shake",
  "Dolly Out (Reveal)",
] as const;

export const LIGHTING_STYLES = [
  "Golden Hour",
  "Studio 8K Softbox",
  "Volumetric Neon Rim",
  "High-Contrast Chiaroscuro",
  "Bioluminescent Midnight",
  "Dramatic Spotlight",
] as const;

export const AESTHETIC_STYLES = [
  "Cinematic documentary",
  "3D Pixar Disney style",
  "Photorealistic IMAX 70mm",
  "Editorial luxury commercial",
  "Unreal Engine 5 hyper-real",
  "Anamorphic film grain",
] as const;

export const VIDEO_MODEL_STACK = [
  {
    id: "veo-3.1-generate-preview",
    name: "Google Veo 3.1",
    bestFor: "The Quality Ceiling",
    advantage:
      "Generates 4K/1080p video with native audio & strictest prompt adherence. Best for high-impact hook scenes.",
    badge: "PRIMARY · GOOGLE FLOW",
  },
  {
    id: "minimax-hailuo-h3",
    name: "MiniMax Hailuo (H3)",
    bestFor: "High-Res Cinematic Motion",
    advantage:
      "Outputs clean 2K video. Unbeatable for complex actions, realistic human motion, and built-in sound effects.",
    badge: "2K MOTION + SFX",
  },
  {
    id: "kling-3.0",
    name: "Kling 3.0",
    bestFor: "Value & Physical Realism",
    advantage:
      "The daily workhorse. Incredible physical physics and character motion at a fraction of the cost per API call.",
    badge: "PHYSICS WORKHORSE",
  },
  {
    id: "runway-gen-4.5",
    name: "Runway Gen-4.5",
    bestFor: "Precise Camera Control",
    advantage:
      "The industry standard for director-level keyframing. Essential for specific pans, dolly pushes, or tracking shots.",
    badge: "DIRECTOR KEYFRAMES",
  },
  {
    id: "luma-ray-3.2",
    name: "Luma Ray 3.2",
    bestFor: "Frame-by-Frame Continuity",
    advantage:
      "Perfect for multi-shot narrative Shorts. Maintains character and environmental consistency across cuts.",
    badge: "MULTI-SHOT LOCK",
  },
] as const;

export const IMAGE_ANCHOR_MODELS = [
  {
    id: "flux-1-pro",
    name: "Flux.1 (Pro/Dev)",
    role: "Legible Text & UI Style Anchor",
    desc: "Best at rendering legible text (signs, labels, screen UI) and strictly following complex, multi-subject prompts.",
  },
  {
    id: "midjourney-v6.5",
    name: "Midjourney v6.5",
    role: "Cinematic Aesthetic Style Anchor",
    desc: "Undisputed king of aesthetics. Establishes stylized, cinematic, or 3D reference frames before passing to Veo 3.1 or Runway.",
  },
] as const;

export const CREATIVE_DIRECTOR_MASTER_PROMPT = `Act as an expert Creative Director for viral social media explainer videos (YouTube Shorts, TikTok, Reels). Whenever I give you a topic, automatically construct a complete, high-retention video plan and execute it. Follow this strict framework:

1. VIRAL CONSTRAINTS:
- Format: Always set \`aspect_ratio="9:16"\` (portrait).
- Pacing: Fast cuts. Evolve the visual scene every 2 to 5 seconds.
- The Hook: The first 3 seconds must feature a visually striking action or extreme close-up and a curiosity-inducing voiceover (never start with "Hi guys").
- Payoff: Deliver a clear, satisfying conclusion before the end of the Short.

2. SCENE-BY-SCENE PLAN:
Break the video into 5 to 6 distinct scenes (Hook, Reveal, Quick Tutorial, Escalation, Climax, Payoff). For each scene, generate:
- Narration: 1-2 punchy sentences for voiceover.
- Visual Prompt: A cinematic prompt specifying scene layout, subject action, camera motion (e.g., tracking shot, fast pan, slow zoom), lighting, and style. Be highly specific.
- Negative Prompt: What the video model must avoid in this scene.

3. EXECUTION WORKFLOW:
- Step 1: Generate one overarching Style Reference Image first (via Flux.1 Pro or Midjourney v6.5) to maintain visual consistency across all clips.
- Step 2: Use \`generate_video\` (or \`generate_with_subjects\` if referencing specific assets) for each scene, chaining the visual style.
- Step 3: If an edit is needed, use \`edit_video\` with the previous interaction ID, keeping edit prompts incremental (describe only the change, not the whole scene).
- Step 4: Always save and output with \`delivery="uri"\` for long or high-motion renders.`;

export function AiVideoPromptSimulator({
  onApplyToScene,
  onGenerateShortFromPrompt,
}: {
  onApplyToScene?: (prompt: string, subject: string, cameraMotion: string) => void;
  onGenerateShortFromPrompt?: (subject: string, synthesizedPrompt: string) => void;
}) {
  const [subject, setSubject] = useState("A red fox running through fresh snow");
  const [cameraAngle, setCameraAngle] = useState<string>("Medium Shot");
  const [cameraMotion, setCameraMotion] = useState<string>("Fast Tracking Shot");
  const [lighting, setLighting] = useState<string>("Golden Hour");
  const [aestheticStyle, setAestheticStyle] = useState<string>(
    "Cinematic documentary",
  );
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [showDirectorBlueprint, setShowDirectorBlueprint] = useState(false);

  const finalVisualPrompt = `${cameraAngle} ${cameraMotion} of ${
    subject.trim() || "A red fox running through fresh snow"
  }, ${lighting}, ${aestheticStyle} --ar 9:16`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(finalVisualPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyMasterPrompt = () => {
    navigator.clipboard.writeText(CREATIVE_DIRECTOR_MASTER_PROMPT);
    setCopiedMaster(true);
    setTimeout(() => setCopiedMaster(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Main AI Video Prompt Simulator Card (Matches Reference Design) */}
      <div className="rounded-3xl border border-white/15 bg-[#0f1015] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-[28px] font-display font-semibold text-white tracking-tight">
              AI Video Prompt Simulator
            </h3>
            <p className="mt-1.5 text-sm text-white/60">
              Adjust camera and aesthetic parameters to synthesize visual generation prompts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDirectorBlueprint((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/35 bg-sky-500/15 px-3.5 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/25 transition"
          >
            <Terminal size={13} />
            {showDirectorBlueprint
              ? "Hide Creative Director Master Prompt & Stack"
              : "Creative Director Prompt & Model Stack"}
          </button>
        </div>

        {/* Subject Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-white/90 mb-2">
            Subject Description
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="A red fox running through fresh snow"
            className="w-full rounded-xl border border-white/15 bg-[#17181f] px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-sky-400 transition"
          />
        </div>

        {/* 2x2 Parameter Grid: Camera Angle, Camera Motion, Lighting, Aesthetic Style */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Camera Angle
            </label>
            <select
              value={cameraAngle}
              onChange={(e) => setCameraAngle(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#17181f] px-4 py-3 text-sm text-white outline-none focus:border-sky-400 transition"
            >
              {CAMERA_ANGLES.map((angle) => (
                <option key={angle} value={angle}>
                  {angle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Camera Motion
            </label>
            <select
              value={cameraMotion}
              onChange={(e) => setCameraMotion(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#17181f] px-4 py-3 text-sm text-white outline-none focus:border-sky-400 transition"
            >
              {SIMULATOR_CAMERA_MOTIONS.map((motion) => (
                <option key={motion} value={motion}>
                  {motion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Lighting
            </label>
            <select
              value={lighting}
              onChange={(e) => setLighting(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#17181f] px-4 py-3 text-sm text-white outline-none focus:border-sky-400 transition"
            >
              {LIGHTING_STYLES.map((light) => (
                <option key={light} value={light}>
                  {light}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Aesthetic Style
            </label>
            <select
              value={aestheticStyle}
              onChange={(e) => setAestheticStyle(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#17181f] px-4 py-3 text-sm text-white outline-none focus:border-sky-400 transition"
            >
              {AESTHETIC_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Final Visual Prompt Output Box */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#15161c] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              FINAL VISUAL PROMPT
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {onApplyToScene && (
                <button
                  type="button"
                  onClick={() =>
                    onApplyToScene(finalVisualPrompt, subject, cameraMotion)
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/35 bg-sky-500/15 px-3.5 py-1.5 text-xs font-semibold text-sky-200 hover:bg-sky-500/25 transition"
                >
                  <Sliders size={12} /> Apply to Current Scene
                </button>
              )}

              {onGenerateShortFromPrompt && (
                <button
                  type="button"
                  onClick={() =>
                    onGenerateShortFromPrompt(subject, finalVisualPrompt)
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-sky-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110 transition"
                >
                  <Wand2 size={12} /> Generate 30s Short from Prompt
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#1d1f27] px-4 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition"
              >
                {copiedPrompt ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-300" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    Copy Prompt
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-[#0b0c10] px-4 py-4 font-mono text-sm text-white/95 leading-relaxed border border-white/5">
            {finalVisualPrompt}
          </div>
        </div>
      </div>

      {/* Expandable Creative Director Master Prompt & n8n / Multi-Model Stack */}
      {showDirectorBlueprint && (
        <div className="rounded-3xl border border-sky-400/30 bg-slate-950/90 p-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Creative Director Master Prompt */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                  <Sparkles size={13} /> Creative Director Master System Prompt
                </div>
                <button
                  type="button"
                  onClick={handleCopyMasterPrompt}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white hover:bg-white/20"
                >
                  {copiedMaster ? (
                    <>
                      <CheckCircle2 size={12} className="text-emerald-300" />
                      Copied Master Prompt!
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy Master Prompt
                    </>
                  )}
                </button>
              </div>
              <pre className="max-h-[340px] overflow-y-auto rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-white/80 whitespace-pre-wrap leading-relaxed">
                {CREATIVE_DIRECTOR_MASTER_PROMPT}
              </pre>
            </div>

            {/* Right: Top Video & Style Anchor Model Stack */}
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Layers size={13} /> Optimal Automation Model Stack (n8n / Stateful APIs)
              </div>

              <div className="space-y-2">
                {VIDEO_MODEL_STACK.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-white/10 bg-black/45 p-3 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {m.name}{" "}
                        <span className="text-sky-300 font-normal">
                          — {m.bestFor}
                        </span>
                      </span>
                      <span className="rounded-md bg-sky-500/20 border border-sky-400/30 px-2 py-0.5 font-mono text-[9px] text-sky-300">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/65">{m.advantage}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 mb-2">
                  Step 1 Style Reference Image Anchors (Visual Consistency)
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {IMAGE_ANCHOR_MODELS.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-2.5"
                    >
                      <div className="text-xs font-semibold text-white">
                        {img.name}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-300">
                        {img.role}
                      </div>
                      <p className="mt-1 text-[10.5px] text-white/65">
                        {img.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
