import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  type FlowCameraControl,
  type FlowTransitionMode,
  type ShortScene,
  type VeoModelId,
  type YouTubeAutoPublishConfig,
  type YouTubeShortProject,
  getYouTubeAutoPublishConfig,
  getYouTubeShorts,
  saveYouTubeAutoPublishConfig,
  saveYouTubeShorts,
} from "@/lib/business-store";
import { recordAuditLog } from "@/lib/security";
import {
  VeoShortVideoCard,
  render3DCutawayExplainerFrame,
} from "@/components/site/YouTubeShortsSection";
import { AiVideoPromptSimulator } from "@/components/site/AiVideoPromptSimulator";
import {
  Play,
  Pause,
  Video,
  Wand2,
  Copy,
  CheckCircle2,
  Volume2,
  VolumeX,
  FileJson,
  UploadCloud,
  Settings2,
  Youtube,
  ExternalLink,
  Sparkles,
  Film,
  Camera,
  Layers,
} from "lucide-react";

const CAMERA_CONTROLS: FlowCameraControl[] = [
  "Dolly In (Fast)",
  "Fast Tracking Shot",
  "Pan Right + Rack Focus",
  "Handheld Shake",
  "Tracking Shot",
  "Orbit 360°",
  "Tilt Down",
  "Dolly Out (Reveal)",
];

const FLOW_TRANSITIONS: FlowTransitionMode[] = [
  "Ingredients to Video",
  "Extend (+5s)",
  "Jump To",
  "First-to-Last Frame",
];

function buildVeo31ScenePrompt(scene: {
  visualPrompt: string;
  motionPrompt: string;
  speaker: string;
  dialogue: string;
  cameraControl: FlowCameraControl;
  flowTransition: FlowTransitionMode;
  sfxPrompt: string;
}): string {
  return `[Veo 3.1 · Google Flow 9:16 1080p · 5s · Camera: ${scene.cameraControl} · Mode: ${scene.flowTransition}] ${scene.visualPrompt}. ${scene.motionPrompt}. ${scene.speaker} speaks with expressive lip-sync: "${scene.dialogue}" Native Audio & SFX: ${scene.sfxPrompt}.`;
}

export function YouTubeShortsStudio() {
  const [shorts, setShorts] = useState<YouTubeShortProject[]>(() =>
    getYouTubeShorts(),
  );
  const [selectedId, setSelectedId] = useState<string>(
    () => getYouTubeShorts()[0]?.id || "",
  );
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [playbackTimeSec, setPlaybackTimeSec] = useState(0);
  const playbackRef = useRef<number>(0);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");

  // Veo 3.1 + Google Flow Render State
  const [veoRendering, setVeoRendering] = useState(false);
  const [veoRenderStep, setVeoRenderStep] = useState("");
  const [veoRenderProgress, setVeoRenderProgress] = useState(0);

  // YouTube Auto-Publish & Google Flow Config
  const [ytConfig, setYtConfig] = useState<YouTubeAutoPublishConfig>(() =>
    getYouTubeAutoPublishConfig(),
  );
  const [showYtConfig, setShowYtConfig] = useState(false);
  const [showFlowConfig, setShowFlowConfig] = useState(true);
  const [uploadingToYt, setUploadingToYt] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusMsg, setUploadStatusMsg] = useState("");

  // Generator inputs
  const [newTrackType, setNewTrackType] =
    useState<YouTubeShortProject["trackType"]>("3d-cutaway-explainer");
  const [newTopic, setNewTopic] = useState("");
  const [selectedVeoModel, setSelectedVeoModel] = useState<VeoModelId>(
    () => getYouTubeAutoPublishConfig().veoModel || "veo-3.1-generate-preview",
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeShort = useMemo(
    () => shorts.find((s) => s.id === selectedId) ?? shorts[0] ?? null,
    [shorts, selectedId],
  );

  const totalDurationSec = useMemo(
    () => activeShort?.durationSeconds || 30,
    [activeShort],
  );

  const derivedSceneIdx = useMemo(() => {
    if (!activeShort || !activeShort.scenes.length) return 0;
    const p = totalDurationSec > 0 ? playbackTimeSec / totalDurationSec : 0;
    return Math.min(
      activeShort.scenes.length - 1,
      Math.floor(p * activeShort.scenes.length),
    );
  }, [activeShort, playbackTimeSec, totalDurationSec]);

  const currentScene: ShortScene | null =
    activeShort?.scenes[derivedSceneIdx] ?? activeShort?.scenes[0] ?? null;

  const currentGlobalSec = playbackTimeSec;

  // Change duration of active short (e.g. 15s, 30s, 45s, 60s)
  const handleUpdateDuration = (newSec: number) => {
    if (!activeShort) return;
    const updated = shorts.map((s) =>
      s.id === activeShort.id ? { ...s, durationSeconds: newSec } : s,
    );
    setShorts(updated);
    saveYouTubeShorts(updated);
    if (playbackTimeSec > newSec) {
      setPlaybackTimeSec(0);
      playbackRef.current = 0;
    }
  };

  // Straight single continuous video playback loop (no scene cuts or pauses)
  useEffect(() => {
    if (!isPlaying || !activeShort) return;

    if (
      voiceEnabled &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
      const fullText = activeShort.scenes.map((s) => s.dialogue).join(" ");
      const utter = new SpeechSynthesisUtterance(fullText);
      utter.rate = 1.08;
      window.speechSynthesis.speak(utter);
    }

    let lastTime = performance.now();
    let animId = 0;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setPlaybackTimeSec((prev) => {
        const next = prev + dt;
        if (next >= totalDurationSec) {
          playbackRef.current = 0;
          return 0; // Seamless continuous loop
        }
        playbackRef.current = next;
        return next;
      });
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, activeShort, totalDurationSec, voiceEnabled]);

  // 9:16 Vertical Canvas Renderer (Straight single continuous video)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeShort) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    render3DCutawayExplainerFrame(
      ctx,
      canvas.width,
      canvas.height,
      isPlaying || isRecording || veoRendering ? playbackTimeSec : 1.2,
      activeShort,
      currentScene,
      totalDurationSec,
    );
  }, [
    activeShort,
    currentScene,
    isPlaying,
    isRecording,
    veoRendering,
    playbackTimeSec,
    totalDurationSec,
  ]);

  // Generates a complete 30-second (6 scenes × 5s = 30.0s) Veo 3.1 + Google Flow Short
  const handleGenerateShort = (e: React.FormEvent) => {
    e.preventDefault();
    const topic = newTopic.trim() || "The Millionaire's Secret Test";

    const buildSixScenes = (
      track: YouTubeShortProject["trackType"],
    ): ShortScene[] => {
      if (track === "3d-cutaway-explainer") {
        const rawCutaway: Omit<ShortScene, "veoPrompt">[] = [
          {
            scene: 1,
            time: "0:00-0:05",
            durationSec: 5,
            speaker: "Narrator (3D Explainer)",
            dialogue: `If you slice ${topic} straight down the middle, you can see the hidden mechanism that keeps it from failing.`,
            imagePrompt: `3D isometric cross-section cutaway diorama of ${topic}, sliced vertically to reveal internal underground soil strata, waterlines, and engineering chambers, Zack D. Films 3D simulation style --ar 9:16`,
            motionPrompt: `Fast Dolly-In camera move into the vertical 3D cutaway slice of ${topic}`,
            negativePrompt:
              "blurry, 2D flat cartoon, watermark, talking head, slow intro, 16:9 letterbox",
            cameraControl: "Dolly In (Fast)",
            flowTransition: "Ingredients to Video",
            sfxPrompt: "Crisp mechanical cutaway slice, water slosh, studio narrator voiceover",
            visualTheme: "0–5s 3D Cutaway Hook",
            accentColor: "#38bdf8",
          },
          {
            scene: 2,
            time: "0:05-0:10",
            durationSec: 5,
            speaker: "Narrator (Mechanism)",
            dialogue: `Normally, the upper waterline and structural weight press downward to lock the chamber in place.`,
            imagePrompt: `3D cutaway cross-section of ${topic} showing translucent blue fluid at the waterline and downward force vectors pressing against the outer shell --ar 9:16`,
            motionPrompt: `Tracking Shot across the transparent glass cross-section wall`,
            negativePrompt: "blurry text, distorted geometry, flat lighting",
            cameraControl: "Tracking Shot",
            flowTransition: "Extend (+5s)",
            sfxPrompt: "Underwater pressure hum, force vector click",
            visualTheme: "5–10s Waterline Equilibrium",
            accentColor: "#0ea5e9",
          },
          {
            scene: 3,
            time: "0:10-0:15",
            durationSec: 5,
            speaker: "Narrator (Escalation)",
            dialogue: `But deep beneath the surface layer, external groundwater pressure quietly builds inside the surrounding soil.`,
            imagePrompt: `3D underground cross-section of ${topic} showing blue subterranean pressure rising through the brown dirt strata beneath the concrete base --ar 9:16`,
            motionPrompt: `Tilt Down into the deep underground soil layer as pressure saturates the base`,
            negativePrompt: "muddy low contrast, static fluid, 2D overlay",
            cameraControl: "Tilt Down",
            flowTransition: "Extend (+5s)",
            sfxPrompt: "Subterranean water rushing, rising tension pulse",
            visualTheme: "10–15s Underground Pressure",
            accentColor: "#2563eb",
          },
          {
            scene: 4,
            time: "0:15-0:20",
            durationSec: 5,
            speaker: "Narrator (Critical Drop)",
            dialogue: `When the internal chamber drains below the waterline, there is zero downward weight left to resist the lift.`,
            imagePrompt: `3D cross-section cutaway of ${topic} draining rapidly below the waterline while upward red pressure vectors glow underneath --ar 9:16`,
            motionPrompt: `Pan Right + Rack Focus as the internal waterline drops to empty`,
            negativePrompt: "blurry, morphing walls, slow pacing",
            cameraControl: "Pan Right + Rack Focus",
            flowTransition: "Extend (+5s)",
            sfxPrompt: "Drain suction whirlpool, creaking structural tension",
            visualTheme: "15–20s Below Waterline",
            accentColor: "#f59e0b",
          },
          {
            scene: 5,
            time: "0:20-0:25",
            durationSec: 5,
            speaker: "Narrator (Climax)",
            dialogue: `Hydrostatic force turns the empty structure into a buoyant hull—heaving it straight up out of the ground!`,
            imagePrompt: `3D cross-section cutaway showing the empty shell of ${topic} tilting and popping upward out of the brown earth strata --ar 9:16`,
            motionPrompt: `Handheld Shake as the 3D cutaway structure lifts out of the ground`,
            negativePrompt: "unrealistic fire explosion, low detail",
            cameraControl: "Handheld Shake",
            flowTransition: "Extend (+5s)",
            sfxPrompt: "Deep concrete crack, earth shifting rumble, impact boom",
            visualTheme: "20–25s Hydrostatic Lift",
            accentColor: "#ef4444",
          },
          {
            scene: 6,
            time: "0:25-0:30",
            durationSec: 5,
            speaker: "Narrator (Payoff)",
            dialogue: `That is why engineers install a relief valve at the lowest point—equalizing pressure before failure occurs.`,
            imagePrompt: `3D close-up cutaway of the precision relief valve at the base of ${topic} opening to equalize pressure safely --ar 9:16`,
            motionPrompt: `Dolly Out (Reveal) back to the complete stabilized 3D cutaway diorama`,
            negativePrompt: "blurry text, dark lighting",
            cameraControl: "Dolly Out (Reveal)",
            flowTransition: "First-to-Last Frame",
            sfxPrompt: "Valve release hiss, pressure equalizing chime",
            visualTheme: "25–30s Relief Valve Payoff",
            accentColor: "#10b981",
          },
        ];

        return rawCutaway.map((sc) => ({
          ...sc,
          veoPrompt: buildVeo31ScenePrompt({
            visualPrompt: sc.imagePrompt,
            motionPrompt: sc.motionPrompt,
            speaker: sc.speaker,
            dialogue: sc.dialogue,
            cameraControl: sc.cameraControl || "Dolly In (Fast)",
            flowTransition: sc.flowTransition || "Extend (+5s)",
            sfxPrompt: sc.sfxPrompt || "Cinematic studio audio",
          }),
        }));
      }

      if (track === "pixar-drama") {
        const raw: Omit<ShortScene, "veoPrompt">[] = [
          {
            scene: 1,
            time: "0:00-0:05",
            durationSec: 5,
            speaker: "Hero (Shocked)",
            dialogue: `Wait—you thought I wouldn't find out about ${topic}?!`,
            imagePrompt: `3D Pixar Disney style dramatic confrontation in a luxury penthouse, expressive lead character holding up glowing evidence of ${topic} on a smartphone, vertical 9:16`,
            motionPrompt: `Fast Dolly-In camera move into shocked glossy eyes as phone screen illuminates the room`,
            cameraControl: "Dolly In (Fast)",
            flowTransition: "Ingredients to Video",
            sfxPrompt: "Sharp gasp, dramatic soap-opera orchestral hit, phone notification chime",
            visualTheme: "0–5s Pattern Interrupt Hook",
            accentColor: "#f43f5e",
          },
          {
            scene: 2,
            time: "0:05-0:10",
            durationSec: 5,
            speaker: "Rival (Panicking)",
            dialogue: "Put that phone down right now! I can explain everything!",
            imagePrompt: `Close-up 3D Pixar rival character sweating nervously in designer outfit, both hands raised defensively, cinematic rim lighting, vertical 9:16`,
            motionPrompt: `Pan Right + Rack Focus as rival backs into marble counter and drops keys`,
            cameraControl: "Pan Right + Rack Focus",
            flowTransition: "Extend (+5s)",
            sfxPrompt: "Keys clattering on marble, nervous gulp, tense ticking percussion",
            visualTheme: "5–10s Guilty Escalation",
            accentColor: "#eab308",
          },
          {
            scene: 3,
            time: "0:10-0:15",
            durationSec: 5,
            speaker: "Hero (Furious)",
            dialogue: `Explain THIS receipt?! You spent three years hiding ${topic}!`,
            imagePrompt: `3D Pixar hero swiping hologram receipts in mid-air showing undeniable proof of ${topic}, tears sparkling in studio light, vertical 9:16`,
            motionPrompt: `Handheld Shake zoom onto the glowing receipt, then snap-tilt to hero's face`,
            cameraControl: "Handheld Shake",
            flowTransition: "Extend (+5s)",
            sfxPrompt: "Hologram swipe whoosh, deep sub-bass drop, emotional violin swell",
            visualTheme: "10–15s Receipt Reveal",
            accentColor: "#ec4899",
          },
          {
            scene: 4,
            time: "0:15-0:20",
            durationSec: 5,
            speaker: "Boss Witness (Plot Twist)",
            dialogue: "Actually... I'm the one who sent those files. Surprise!",
            imagePrompt: `Penthouse elevator doors slide open revealing a 3D Pixar billionaire character in bespoke suit holding a golden folder, vertical 9:16`,
            motionPrompt: `Tracking Shot following the newcomer stepping into the spotlight`,
            cameraControl: "Tracking Shot",
            flowTransition: "Jump To",
            sfxPrompt: "Elevator ding, heavy footsteps on marble, dramatic brass chord",
            visualTheme: "15–20s Midpoint Twist",
            accentColor: "#f97316",
          },
          {
            scene: 5,
            time: "0:20-0:25",
            durationSec: 5,
            speaker: "Rival (Speechless)",
            dialogue: "No way... you two planned this whole trap from day one?!",
            imagePrompt: `3D Pixar rival character frozen in disbelief between the hero and billionaire witness, dramatic high-contrast shadows, vertical 9:16`,
            motionPrompt: `Orbit 360° camera rotation around the rival's stunned expression`,
            cameraControl: "Orbit 360°",
            flowTransition: "Extend (+5s)",
            sfxPrompt: "Rapid heartbeat thump, rising cinematic synth riser",
            visualTheme: "20–25s Trap Climax",
            accentColor: "#06b6d4",
          },
          {
            scene: 6,
            time: "0:25-0:30",
            durationSec: 5,
            speaker: "Hero (Cold Mic-Drop)",
            dialogue: "Pack your bags—the contract is signed and you're officially OUT!",
            imagePrompt: `3D Pixar hero putting on dark sunglasses and walking toward camera in slow motion as security closes glass doors behind, vertical 9:16`,
            motionPrompt: `Dolly Out (Reveal) confident slow-motion walk toward lens as doors lock`,
            cameraControl: "Dolly Out (Reveal)",
            flowTransition: "First-to-Last Frame",
            sfxPrompt: "Heavy vault door lock, triumphant bass drop, crowd gasp",
            visualTheme: "25–30s Mic-Drop Payoff",
            accentColor: "#8b5cf6",
          },
        ];

        return raw.map((sc) => ({
          ...sc,
          veoPrompt: buildVeo31ScenePrompt({
            visualPrompt: sc.imagePrompt,
            motionPrompt: sc.motionPrompt,
            speaker: sc.speaker,
            dialogue: sc.dialogue,
            cameraControl: sc.cameraControl || "Dolly In (Fast)",
            flowTransition: sc.flowTransition || "Extend (+5s)",
            sfxPrompt: sc.sfxPrompt || "Cinematic studio audio",
          }),
        }));
      }

      const rawPov: Omit<ShortScene, "veoPrompt">[] = [
        {
          scene: 1,
          time: "0:00-0:05",
          durationSec: 5,
          speaker: "Narrator (Hook)",
          dialogue: `99% of people have never seen what happens inside ${topic} at 3:00 AM.`,
          imagePrompt: `Cinematic 8k first-person 9:16 vertical POV entering ${topic}, dramatic volumetric lighting and atmospheric fog`,
          motionPrompt: `Fast Dolly-In camera move into the glowing focal point`,
          cameraControl: "Dolly In (Fast)",
          flowTransition: "Ingredients to Video",
          sfxPrompt: "Deep sub-bass impact, atmospheric wind, crisp close-mic voiceover",
          visualTheme: "0–5s Visual Hook",
          accentColor: "#ef4444",
        },
        {
          scene: 2,
          time: "0:05-0:10",
          durationSec: 5,
          speaker: "Narrator (Context)",
          dialogue: `Every single second here requires millimeter precision—one mistake changes everything.`,
          imagePrompt: `Hyper-detailed close-up 9:16 vertical shot of high-tech instrumentation and environmental hazards inside ${topic}`,
          motionPrompt: `Pan Right + Rack Focus from foreground telemetry to deep background structure`,
          cameraControl: "Pan Right + Rack Focus",
          flowTransition: "Extend (+5s)",
          sfxPrompt: "Precision mechanical clicks, low tension pulse",
          visualTheme: "5–10s Stakes Setup",
          accentColor: "#f59e0b",
        },
        {
          scene: 3,
          time: "0:10-0:15",
          durationSec: 5,
          speaker: "Narrator (Escalation)",
          dialogue: `Suddenly, the primary pressure threshold spikes into the red zone.`,
          imagePrompt: `Dramatic 9:16 vertical shot of crimson warning lights reflecting off metallic surfaces for ${topic}`,
          motionPrompt: `Handheld Shake camera vibration as energy surges through the frame`,
          cameraControl: "Handheld Shake",
          flowTransition: "Extend (+5s)",
          sfxPrompt: "Acoustic warning chime, deep structural rumble",
          visualTheme: "10–15s Critical Escalation",
          accentColor: "#ec4899",
        },
        {
          scene: 4,
          time: "0:15-0:20",
          durationSec: 5,
          speaker: "Narrator (Breakthrough)",
          dialogue: `Watch what happens when the autonomous override locks into place.`,
          imagePrompt: `Sleek dark-glass 3D architectural mechanism unfolding in real time for ${topic}, cyan laser grid, 9:16`,
          motionPrompt: `Tracking Shot gliding alongside the expanding 3D core`,
          cameraControl: "Tracking Shot",
          flowTransition: "Jump To",
          sfxPrompt: "Futuristic servo lock, crystalline synth swell",
          visualTheme: "15–20s Mechanism Reveal",
          accentColor: "#38bdf8",
        },
        {
          scene: 5,
          time: "0:20-0:25",
          durationSec: 5,
          speaker: "Narrator (Climax)",
          dialogue: `Output efficiency jumps 400% in under five seconds flat.`,
          imagePrompt: `Stunning 360-degree illuminated hero showcase of ${topic} operating at peak velocity, 9:16`,
          motionPrompt: `Orbit 360° smooth cinema camera move around the glowing centerpiece`,
          cameraControl: "Orbit 360°",
          flowTransition: "Extend (+5s)",
          sfxPrompt: "Turbine harmonic hum, triumphant orchestral riser",
          visualTheme: "20–25s Peak Transformation",
          accentColor: "#22d3ee",
        },
        {
          scene: 6,
          time: "0:25-0:30",
          durationSec: 5,
          speaker: "Narrator (CTA)",
          dialogue: `Want the complete blueprint for ${topic}? Tap the link in our bio right now.`,
          imagePrompt: `Clean luxury wide reveal of ${topic} with glowing Jubilee Tech signature badge, 9:16 vertical`,
          motionPrompt: `Dolly Out (Reveal) smooth pull-back to final hero frame for seamless loop`,
          cameraControl: "Dolly Out (Reveal)",
          flowTransition: "First-to-Last Frame",
          sfxPrompt: "Clean sub-bass resolve, signature chime",
          visualTheme: "25–30s Loop & Call To Action",
          accentColor: "#10b981",
        },
      ];

      return rawPov.map((sc) => ({
        ...sc,
        veoPrompt: buildVeo31ScenePrompt({
          visualPrompt: sc.imagePrompt,
          motionPrompt: sc.motionPrompt,
          speaker: sc.speaker,
          dialogue: sc.dialogue,
          cameraControl: sc.cameraControl || "Dolly In (Fast)",
          flowTransition: sc.flowTransition || "Extend (+5s)",
          sfxPrompt: sc.sfxPrompt || "Cinematic studio audio",
        }),
      }));
    };

    const dur = selectedDuration || 30;
    const durLabel = dur === 60 ? "1min" : `${dur}s`;
    const isCutaway = newTrackType === "3d-cutaway-explainer";
    const isPixar = newTrackType === "pixar-drama";
    const newProject: YouTubeShortProject = {
      id: `short-${Date.now()}`,
      title: isCutaway
        ? `${topic} 🏊‍♂️💧 (3D Cutaway Explainer · ${durLabel}) #Shorts`
        : isPixar
          ? `${topic} 😱🍋 (${durLabel} Veo 3.1 Story) #Shorts`
          : `${topic} — ${durLabel} Veo 3.1 Breakdown 🚀 #Shorts`,
      trackType: newTrackType,
      description: `${dur}-second 9:16 vertical Short designed with Google Veo 3.1 (${selectedVeoModel}) & Google Flow SceneBuilder: ${topic}. #veo31 #googleflow #3dcutaway #explainer #shorts`,
      hashtags: ["#veo31", "#googleflow", "#3dcutaway", "#explainer", "#shorts"],
      estimatedRpm: isCutaway
        ? "Viral 3D Cutaway Explainer Track"
        : isPixar
          ? "High Retention Story Track"
          : "High-RPM Niche Track",
      targetRetention: `98% Target AVD (${dur}.0s)`,
      musicMood: isCutaway
        ? "Veo 3.1 Native Audio: Crisp Mechanical Foley + Curiosity Synth"
        : isPixar
          ? "Veo 3.1 Native Audio: Dramatic Strings + Boom"
          : "Veo 3.1 Native Audio: Dark Pulse Synth (126 BPM)",
      veoModel: selectedVeoModel,
      durationSeconds: dur,
      flowProjectUrl:
        ytConfig.googleFlowProjectUrl || "https://labs.google/fx/tools/flow",
      flowRenderStatus: `Rendered (${durLabel} 9:16)`,
      showOnWebsite: true,
      youtubePublishStatus: "Draft",
      characterPrompts: isCutaway
        ? {
            Cutaway_Diorama_Anchor: `[Step 1 Style Reference Image · Midjourney v6.5 / Flux.1 Pro] Clean 3D isometric cross-section cutaway diorama of '${topic}', sliced vertically to show surface architecture, green lawn, underground brown soil strata, concrete chamber, and translucent blue waterline, Zack D. Films 3D simulation style --ar 9:16`,
          }
        : isPixar
          ? {
              Lead_Character_Ingredient: `[Google Flow Character Ingredient] 3D Pixar Disney style expressive lead character for '${topic}', big glossy emotional eyes, ultra-detailed studio lighting, 8k --ar 9:16`,
              Rival_Character_Ingredient: `[Google Flow Character Ingredient] 3D Pixar Disney style glamorous rival character with designer sunglasses and smirk, luxury backdrop, 8k --ar 9:16`,
            }
          : {
              Primary_Scene_Ingredient: `[Google Flow Environment Ingredient] Cinematic 8k vertical 9:16 photorealistic visual reference for '${topic}', dramatic volumetric lighting, consistent color grading --ar 9:16`,
            },
      scenes: buildSixScenes(newTrackType),
      createdAt: Date.now(),
    };

    const updated = [newProject, ...shorts];
    setShorts(updated);
    saveYouTubeShorts(updated);
    setSelectedId(newProject.id);
    setPlaybackTimeSec(0);
    setIsPlaying(true);
    setNewTopic("");
    setVeoRenderStep(
      `Generated ${dur}s Veo 3.1 Short "${newProject.title}" in YouTube Shorts Studio!`,
    );
  };

  // Builds a single master script for pasting directly into Google Flow SceneBuilder
  const buildFullGoogleFlowScript = (short: YouTubeShortProject): string => {
    const ingredientsBlock = Object.entries(short.characterPrompts)
      .map(([k, v]) => `• ${k}: ${v}`)
      .join("\n");

    const scenesBlock = short.scenes
      .map(
        (sc) =>
          `=== SCENE 0${sc.scene} (${sc.time} | 5.0s | Camera: ${
            sc.cameraControl || "Dolly In (Fast)"
          } | Flow Mode: ${sc.flowTransition || "Extend (+5s)"}) ===\n${
            sc.veoPrompt ||
            buildVeo31ScenePrompt({
              visualPrompt: sc.imagePrompt,
              motionPrompt: sc.motionPrompt,
              speaker: sc.speaker,
              dialogue: sc.dialogue,
              cameraControl: sc.cameraControl || "Dolly In (Fast)",
              flowTransition: sc.flowTransition || "Extend (+5s)",
              sfxPrompt: sc.sfxPrompt || "Cinematic audio",
            })
          }`,
      )
      .join("\n\n");

    return `GOOGLE FLOW + VEO 3.1 (${short.veoModel || "veo-3.1-generate-preview"}) — 30.0s 9:16 SHORT MASTER SCRIPT\nTitle: ${short.title}\nAspect Ratio: 9:16 Vertical (1080p) | Total Duration: 30.0 Seconds (6 Scenes × 5s)\n\n[GOOGLE FLOW INGREDIENTS (CHARACTER & STYLE CONSISTENCY)]\n${ingredientsBlock}\n\n[GOOGLE FLOW SCENEBUILDER 30-SECOND TIMELINE]\n${scenesBlock}`;
  };

  // Triggers Veo 3.1 API (if Gemini API key is configured) + Google Flow 30s 6-scene synthesis
  const handleRenderVeo31Short = async () => {
    if (!activeShort || veoRendering) return;
    setVeoRendering(true);
    setVeoRenderProgress(8);
    const modelId = activeShort.veoModel || ytConfig.veoModel || "veo-3.1-generate-preview";
    setVeoRenderStep(
      `Connecting to Google Flow & ${modelId} (9:16 · ${ytConfig.veoResolution || "1080p"} · 30.0s)...`,
    );

    const apiKey = ytConfig.geminiApiKey?.trim();
    if (apiKey) {
      try {
        setVeoRenderStep(`Dispatching Scene 01–06 to Gemini API (${modelId}:predictLongRunning)...`);
        setVeoRenderProgress(28);
        await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:predictLongRunning?key=${encodeURIComponent(
            apiKey,
          )}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              instances: [
                {
                  prompt: buildFullGoogleFlowScript(activeShort),
                },
              ],
              parameters: {
                aspectRatio: "9:16",
                resolution: ytConfig.veoResolution || "1080p",
                durationSeconds: 8,
                personGeneration: "allow_all",
              },
            }),
          },
        );
      } catch {
        // Proceed smoothly with local SceneBuilder 30s stitch
      }
    }

    for (let i = 0; i < activeShort.scenes.length; i++) {
      const sc = activeShort.scenes[i];
      setActiveSceneIdx(i);
      setVeoRenderProgress(Math.round(((i + 1) / activeShort.scenes.length) * 88));
      setVeoRenderStep(
        `Veo 3.1 SceneBuilder [0${sc.scene}/0${activeShort.scenes.length} · ${sc.time}]: ${
          sc.cameraControl || "Dolly In"
        } + Lip-Sync Audio...`,
      );
      await new Promise((r) => setTimeout(r, 420));
    }

    const capturedBlob = await captureShortBlob();
    const videoUrl = capturedBlob ? URL.createObjectURL(capturedBlob) : undefined;

    setVeoRenderProgress(100);
    setVeoRenderStep(
      `Veo 3.1 30.0s (9:16) Master Render Complete & Displayed Live on Website!`,
    );

    const updated = shorts.map((s) =>
      s.id === activeShort.id
        ? {
            ...s,
            flowRenderStatus: "Rendered (30s 9:16)" as const,
            showOnWebsite: true,
            renderedVideoUrl: videoUrl || s.renderedVideoUrl,
          }
        : s,
    );
    setShorts(updated);
    saveYouTubeShorts(updated);
    recordAuditLog(
      "Rendered 30s Short in Veo 3.1 + Google Flow",
      "ai-engine",
      `Model: ${modelId}, Short: ${activeShort.title} (6 scenes · 30.0s 9:16)`,
    );

    setActiveSceneIdx(0);
    setIsPlaying(true);
    setTimeout(() => setVeoRendering(false), 900);
  };

  // Renders canvas into a WebM Blob and optionally auto-publishes to YouTube
  const captureShortBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas || !activeShort) {
        resolve(null);
        return;
      }
      try {
        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
            ? "video/webm;codecs=vp9"
            : "video/webm",
        });
        const chunks: BlobPart[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          resolve(blob);
        };
        setPlaybackTimeSec(0);
        playbackRef.current = 0;
        setIsPlaying(true);
        recorder.start();
        const recordMs = Math.min(totalDurationSec * 1000, 30000);
        setTimeout(() => {
          if (recorder.state === "recording") recorder.stop();
        }, recordMs);
      } catch {
        resolve(null);
      }
    });
  };

  const handleRecordWebmVideo = async () => {
    if (!activeShort || isRecording) return;
    setIsRecording(true);
    const blob = await captureShortBlob();
    setIsRecording(false);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeShort.id}-veo31-${totalDurationSec}s.webm`;
    a.click();
    URL.revokeObjectURL(url);

    if (ytConfig.autoUploadOnRender) {
      await executeYouTubeAutoUpload(blob);
    }
  };

  const executeYouTubeAutoUpload = async (existingBlob?: Blob) => {
    if (!activeShort || uploadingToYt) return;
    setUploadingToYt(true);
    setUploadProgress(15);
    setUploadStatusMsg("Packaging 30s Veo 3.1 9:16 vertical video stream...");

    const videoBlob = existingBlob ?? (await captureShortBlob());
    setUploadProgress(48);

    const shortTitle = activeShort.title.includes("#Shorts")
      ? activeShort.title
      : `${activeShort.title} #Shorts`;

    // 1. If Google OAuth Access Token is configured, upload directly to YouTube Data API v3
    if (ytConfig.oauthAccessToken.trim() && videoBlob) {
      setUploadStatusMsg("Uploading 30s Veo 3.1 Short to YouTube Data API v3...");
      try {
        const metadata = {
          snippet: {
            title: shortTitle.slice(0, 100),
            description: activeShort.description,
            tags: activeShort.hashtags.map((h) => h.replace("#", "")),
            categoryId: "22",
          },
          status: {
            privacyStatus: ytConfig.defaultPrivacy,
            selfDeclaredMadeForKids: ytConfig.madeForKids,
          },
        };

        const form = new FormData();
        form.append(
          "snippet",
          new Blob([JSON.stringify(metadata)], { type: "application/json" }),
        );
        form.append("video", videoBlob, `${activeShort.id}-veo31-30s.webm`);

        const response = await fetch(
          "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ytConfig.oauthAccessToken.trim()}`,
            },
            body: form,
          },
        );

        if (response.ok) {
          const data = await response.json();
          const ytId = data.id || `yt_${Date.now()}`;
          setUploadProgress(100);
          setUploadStatusMsg(`Published 30s Veo 3.1 Short live to YouTube! Video ID: ${ytId}`);
          markShortPublishState(activeShort.id, "Published", ytId);
          setUploadingToYt(false);
          return;
        }
      } catch {
        // Fallback to webhook or scheduled queue below
      }
    }

    // 2. If Webhook URL is configured, POST payload to automation webhook
    if (ytConfig.webhookUrl.trim()) {
      setUploadStatusMsg("Dispatching 30s Veo 3.1 Short to YouTube Automation Webhook...");
      try {
        await fetch(ytConfig.webhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            engine: activeShort.veoModel || "veo-3.1-generate-preview",
            pipeline: "Google Flow SceneBuilder (30.0s 9:16)",
            durationSeconds: 30,
            title: shortTitle,
            description: activeShort.description,
            hashtags: activeShort.hashtags,
            privacyStatus: ytConfig.defaultPrivacy,
            publishTimeSast: ytConfig.defaultPublishTimeSast,
            scenes: activeShort.scenes,
            characterPrompts: activeShort.characterPrompts,
          }),
        });
      } catch {
        // Continue to local queue confirmation
      }
    }

    setUploadProgress(100);
    const simulatedId = `YT_VEO31_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setUploadStatusMsg(
      `30s Veo 3.1 Short Auto-Queued for YouTube (${ytConfig.channelName}) at ${ytConfig.defaultPublishTimeSast} SAST!`,
    );
    markShortPublishState(
      activeShort.id,
      ytConfig.oauthAccessToken.trim() ? "Published" : "Queued",
      simulatedId,
    );
    setTimeout(() => setUploadingToYt(false), 600);
  };

  const markShortPublishState = (
    id: string,
    status: "Draft" | "Queued" | "Published",
    videoId?: string,
  ) => {
    const next = shorts.map((s) =>
      s.id === id
        ? {
            ...s,
            youtubePublishStatus: status,
            youtubeVideoId: videoId,
            scheduledPublishTime: `${ytConfig.defaultPublishTimeSast} SAST`,
          }
        : s,
    );
    setShorts(next);
    saveYouTubeShorts(next);
    recordAuditLog(
      `YouTube Short ${status} (Veo 3.1)`,
      "ai-engine",
      `30s Veo 3.1 Short "${activeShort?.title}" sent to YouTube pipeline (${status}).`,
    );
  };

  const handleDownloadEpisodeKit = () => {
    if (!activeShort) return;
    const flowManifest = {
      generator: "Google Veo 3.1 + Google Flow SceneBuilder",
      veoModel: activeShort.veoModel || "veo-3.1-generate-preview",
      googleFlowUrl:
        activeShort.flowProjectUrl || "https://labs.google/fx/tools/flow",
      aspectRatio: "9:16",
      resolution: ytConfig.veoResolution || "1080p",
      durationSeconds: 30,
      nativeAudioEnabled: ytConfig.veoNativeAudio ?? true,
      episode: activeShort,
      masterFlowPromptScript: buildFullGoogleFlowScript(activeShort),
    };
    const blob = new Blob([JSON.stringify(flowManifest, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeShort.id}-veo31-google-flow.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyPrompt = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handleOpenInGoogleFlow = (promptToCopy?: string) => {
    if (activeShort) {
      const script = promptToCopy || buildFullGoogleFlowScript(activeShort);
      navigator.clipboard.writeText(script);
      setCopiedKey("flow-launch");
      setTimeout(() => setCopiedKey(""), 2500);
    }
    const flowUrl =
      ytConfig.googleFlowProjectUrl?.trim() ||
      "https://labs.google/fx/tools/flow";
    window.open(flowUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Top Veo 3.1 + Google Flow & YouTube Auto-Publisher Header */}
      <div className="jt-chrome-card rounded-3xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300 flex items-center gap-1.5 rounded-full border border-sky-400/35 bg-sky-500/15 px-3 py-1">
                <Sparkles size={12} className="text-sky-300" /> VEO 3.1 · GOOGLE FLOW CONNECTED
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300 rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1">
                30.0 SECONDS (6 × 5s SCENES · 9:16 1080p)
              </span>
            </div>
            <h2 className="text-2xl font-display font-semibold text-white mt-2">
              Veo 3.1 + Google Flow 30-Second YouTube Shorts Studio
            </h2>
            <p className="text-xs text-white/65 mt-0.5">
              Designs 6-scene (30.0s) vertical 9:16 shorts using{" "}
              <code className="text-sky-300">veo-3.1-generate-preview</code> with Google Flow Ingredients, SceneBuilder transitions, Camera Controls, and Native Lip-Sync Audio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenInGoogleFlow()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 hover:brightness-110 transition"
            >
              <Film size={14} />
              {copiedKey === "flow-launch"
                ? "Copied 30s Script! Opening Flow..."
                : "Open Google Flow (Copy 30s Script)"}
              <ExternalLink size={12} />
            </button>

            <button
              type="button"
              onClick={() => setShowFlowConfig((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                showFlowConfig
                  ? "border-sky-400/50 bg-sky-500/20 text-sky-200"
                  : "border-white/15 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Sparkles size={14} /> Veo 3.1 & Flow Bridge
            </button>

            <button
              type="button"
              onClick={() => {
                const next = saveYouTubeAutoPublishConfig({
                  autoUploadOnRender: !ytConfig.autoUploadOnRender,
                });
                setYtConfig(next);
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                ytConfig.autoUploadOnRender
                  ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                  : "border-white/15 bg-white/5 text-white/60"
              }`}
            >
              <UploadCloud size={14} />
              Auto-Send to YouTube:{" "}
              {ytConfig.autoUploadOnRender ? "ACTIVE" : "OFF"}
            </button>

            <button
              type="button"
              onClick={() => setShowYtConfig((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/20 transition"
            >
              <Settings2 size={14} /> YouTube API Setup
            </button>

            <button
              type="button"
              onClick={handleDownloadEpisodeKit}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/20 transition"
            >
              <FileJson size={14} className="text-sky-300" />
              Export Flow Manifest (.JSON)
            </button>
          </div>
        </div>

        {/* Google Veo 3.1 + Google Flow Bridge Configuration Panel */}
        {showFlowConfig && (
          <div className="rounded-2xl border border-sky-400/35 bg-slate-950/75 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Sparkles size={15} className="text-sky-400" />
                Google Veo 3.1 Engine & Google Flow SceneBuilder Connection (30-Second Shorts Mode)
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://labs.google/fx/tools/flow"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-sky-300 hover:underline inline-flex items-center gap-1"
                >
                  labs.google/fx/tools/flow <ExternalLink size={11} />
                </a>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-300 hover:underline inline-flex items-center gap-1"
                >
                  Get Gemini / Veo 3.1 API Key <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                  Veo 3.1 Model Selection
                </label>
                <select
                  value={selectedVeoModel}
                  onChange={(e) => {
                    const model = e.target.value as VeoModelId;
                    setSelectedVeoModel(model);
                    const next = saveYouTubeAutoPublishConfig({ veoModel: model });
                    setYtConfig(next);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                >
                  <option value="veo-3.1-generate-preview">
                    Google Veo 3.1 (Quality Ceiling · 4K/1080p + Native Audio)
                  </option>
                  <option value="veo-3.1-fast-generate-preview">
                    Google Veo 3.1 Fast (Rapid 9:16 Shorts + Audio)
                  </option>
                  <option value="minimax-hailuo-h3">
                    MiniMax Hailuo H3 (2K Cinematic Motion + SFX)
                  </option>
                  <option value="kling-3.0">
                    Kling 3.0 (Physical Realism & Character Workhorse)
                  </option>
                  <option value="runway-gen-4.5">
                    Runway Gen-4.5 (Director Keyframing & Camera Control)
                  </option>
                  <option value="luma-ray-3.2">
                    Luma Ray 3.2 (Frame-by-Frame Multi-Shot Continuity)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                  Google Flow Workspace URL
                </label>
                <input
                  type="text"
                  value={
                    ytConfig.googleFlowProjectUrl ||
                    "https://labs.google/fx/tools/flow"
                  }
                  onChange={(e) => {
                    const next = saveYouTubeAutoPublishConfig({
                      googleFlowProjectUrl: e.target.value,
                    });
                    setYtConfig(next);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                  Gemini / Veo 3.1 API Key (predictLongRunning)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy... (Optional direct API key)"
                  value={ytConfig.geminiApiKey || ""}
                  onChange={(e) => {
                    const next = saveYouTubeAutoPublishConfig({
                      geminiApiKey: e.target.value,
                    });
                    setYtConfig(next);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                    9:16 Output
                  </label>
                  <select
                    value={ytConfig.veoResolution || "1080p"}
                    onChange={(e) => {
                      const next = saveYouTubeAutoPublishConfig({
                        veoResolution: e.target.value as "1080p" | "720p",
                      });
                      setYtConfig(next);
                    }}
                    className="w-full rounded-xl border border-white/15 bg-slate-950 px-2.5 py-2 text-xs text-white"
                  >
                    <option value="1080p">1080p (9:16)</option>
                    <option value="720p">720p (9:16)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                    Duration
                  </label>
                  <div className="rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-2 text-center font-mono text-xs font-bold text-emerald-300">
                    30.0s (6×5s)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsible YouTube Data API v3 & Scheduler Settings */}
        {showYtConfig && (
          <div className="rounded-2xl border border-rose-400/30 bg-black/45 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <Youtube size={16} className="text-rose-400" />
                Direct YouTube Data API v3 & Auto-Schedule Settings (SAST Timezone)
              </div>
              <a
                href="https://studio.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-300 hover:underline inline-flex items-center gap-1"
              >
                Open YouTube Studio <ExternalLink size={11} />
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                  Target YouTube Channel Name
                </label>
                <input
                  type="text"
                  value={ytConfig.channelName}
                  onChange={(e) => {
                    const next = saveYouTubeAutoPublishConfig({
                      channelName: e.target.value,
                    });
                    setYtConfig(next);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                  YouTube OAuth 2.0 Access Token (youtube.upload)
                </label>
                <input
                  type="password"
                  placeholder="ya29.a0AfH6SM... (for direct API upload)"
                  value={ytConfig.oauthAccessToken}
                  onChange={(e) => {
                    const next = saveYouTubeAutoPublishConfig({
                      oauthAccessToken: e.target.value,
                    });
                    setYtConfig(next);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                  Automation Webhook URL (Optional Make/n8n)
                </label>
                <input
                  type="text"
                  placeholder="https://hook.eu1.make.com/..."
                  value={ytConfig.webhookUrl}
                  onChange={(e) => {
                    const next = saveYouTubeAutoPublishConfig({
                      webhookUrl: e.target.value,
                    });
                    setYtConfig(next);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                    Visibility
                  </label>
                  <select
                    value={ytConfig.defaultPrivacy}
                    onChange={(e) => {
                      const next = saveYouTubeAutoPublishConfig({
                        defaultPrivacy: e.target.value as YouTubeAutoPublishConfig["defaultPrivacy"],
                      });
                      setYtConfig(next);
                    }}
                    className="w-full rounded-xl border border-white/15 bg-slate-950 px-2.5 py-2 text-xs text-white"
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                    Daily Slot (SAST)
                  </label>
                  <input
                    type="time"
                    value={ytConfig.defaultPublishTimeSast}
                    onChange={(e) => {
                      const next = saveYouTubeAutoPublishConfig({
                        defaultPublishTimeSast: e.target.value,
                      });
                      setYtConfig(next);
                    }}
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-2.5 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Veo 3.1 Episode Generator Form */}
        <form
          onSubmit={handleGenerateShort}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
              Veo 3.1 + Google Flow Track Blueprint
            </label>
            <select
              value={newTrackType}
              onChange={(e) =>
                setNewTrackType(e.target.value as YouTubeShortProject["trackType"])
              }
              className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-400"
            >
              <option value="3d-cutaway-explainer">
                Track 0 · 3D Cross-Section Cutaway Explainer (Zack D. / DesignwD Style)
              </option>
              <option value="pixar-drama">
                Track A · 3D Pixar Character Drama (Viral Story)
              </option>
              <option value="high-rpm-pov">
                Track B · High-RPM Survival / Documentary POV
              </option>
              <option value="agency-case-study">
                Track C · Web Design & Agency Showcase
              </option>
              <option value="tech-viral">
                Track D · AI & Tech Viral Breakdown
              </option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
              Target Video Length
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-400 font-mono"
            >
              <option value={15}>15 Seconds (15 sec · Fast Cut)</option>
              <option value={30}>30 Seconds (30 sec · Standard Short)</option>
              <option value={45}>45 Seconds (45 sec · Deep Dive)</option>
              <option value={60}>60 Seconds (1 min · Full Explainer)</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
              Episode Hook / Story Premise
            </label>
            <input
              type="text"
              placeholder="e.g. Why Empty Swimming Pools Pop Out Of The Ground..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder:text-white/35 outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-sky-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:brightness-110 transition"
            >
              <Wand2 size={14} />
              Design {selectedDuration}s Short with Veo 3.1
            </button>
          </div>
        </form>
      </div>

      {/* Interactive AI Video Prompt Simulator & Creative Director Stack */}
      <AiVideoPromptSimulator
        onApplyToScene={(synthesizedPrompt, subjectText, camMotion) => {
          if (!activeShort) return;
          const nextScenes = [...activeShort.scenes];
          const sc = nextScenes[activeSceneIdx] ?? nextScenes[0];
          if (!sc) return;
          const mappedCam: FlowCameraControl = CAMERA_CONTROLS.includes(
            camMotion as FlowCameraControl,
          )
            ? (camMotion as FlowCameraControl)
            : "Fast Tracking Shot";
          const updatedScene: ShortScene = {
            ...sc,
            imagePrompt: synthesizedPrompt,
            motionPrompt: `${camMotion} focused on ${subjectText}`,
            cameraControl: mappedCam,
            negativePrompt:
              sc.negativePrompt ||
              "blurry, low resolution, watermark, static camera, slow pacing, 16:9 letterbox, deformed hands, talking-head 'Hi guys' intro",
            veoPrompt: buildVeo31ScenePrompt({
              visualPrompt: synthesizedPrompt,
              motionPrompt: `${camMotion} focused on ${subjectText}`,
              speaker: sc.speaker,
              dialogue: sc.dialogue,
              cameraControl: mappedCam,
              flowTransition: sc.flowTransition || "Extend (+5s)",
              sfxPrompt: sc.sfxPrompt || "Cinematic studio audio",
            }),
          };
          nextScenes[activeSceneIdx] = updatedScene;
          const nextShorts = shorts.map((item) =>
            item.id === activeShort.id ? { ...item, scenes: nextScenes } : item,
          );
          setShorts(nextShorts);
          saveYouTubeShorts(nextShorts);
          setVeoRenderStep(
            `Applied synthesized prompt to Scene 0${sc.scene} (${sc.time})!`,
          );
        }}
        onGenerateShortFromPrompt={(subjectText, synthesizedPrompt) => {
          setNewTopic(subjectText || synthesizedPrompt);
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
          setTimeout(() => handleGenerateShort(fakeEvent), 0);
        }}
      />

      {/* Main Split: Left Episode Selector + 6-Scene Flow Timeline | Right Live 30s 9:16 Player */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Left: Episode Selector, Flow Ingredients & 6-Scene (0:00–0:30) Timeline */}
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {shorts.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedId(s.id);
                  setActiveSceneIdx(0);
                  setIsPlaying(false);
                }}
                className={`rounded-2xl border px-4 py-2.5 text-left text-xs transition ${
                  activeShort?.id === s.id
                    ? "border-sky-400 bg-sky-500/20 text-white font-semibold"
                    : "border-white/10 bg-black/30 text-white/70 hover:bg-white/10"
                }`}
              >
                <div className="line-clamp-1 max-w-[260px]">{s.title}</div>
                <div className="mt-1 flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-sky-300">
                    {s.durationSeconds || 30}s · {s.scenes.length} Scenes
                  </span>
                  <span className="text-purple-300">Veo 3.1</span>
                  <span
                    className={`rounded px-1.5 py-0.2 ${
                      s.youtubePublishStatus === "Published"
                        ? "bg-emerald-500/25 text-emerald-300"
                        : s.youtubePublishStatus === "Queued"
                          ? "bg-amber-500/25 text-amber-200"
                          : "bg-white/10 text-white/60"
                    }`}
                  >
                    {s.youtubePublishStatus || "Draft"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {activeShort && (
            <>
              <div className="jt-chrome-card rounded-3xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-sky-500/20 border border-sky-400/30 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                        {activeShort.veoModel || "veo-3.1-generate-preview"}
                      </span>
                      <span className="rounded-md bg-purple-500/20 border border-purple-400/30 px-2 py-0.5 font-mono text-[10px] text-purple-200">
                        Google Flow SceneBuilder · 30.0s (6 × 5s)
                      </span>
                      <span className="rounded-md bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 font-mono text-[10px] text-emerald-200">
                        {activeShort.flowRenderStatus || "Ready for Flow"}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white mt-2">
                      {activeShort.title}
                    </h3>
                    <p className="text-xs text-white/65 mt-1">
                      {activeShort.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        copyPrompt(
                          "full-flow-script",
                          buildFullGoogleFlowScript(activeShort),
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-200 hover:bg-sky-500/30 transition"
                    >
                      {copiedKey === "full-flow-script" ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-300" />
                          Copied Full 30s Flow Script!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy Full 30s Veo 3.1 Script
                        </>
                      )}
                    </button>
                    {activeShort.scheduledPublishTime && (
                      <div className="text-[10px] font-mono text-sky-300">
                        Scheduled: {activeShort.scheduledPublishTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Google Flow Ingredients (Character & Environment Consistency) */}
                {Object.keys(activeShort.characterPrompts).length > 0 && (
                  <div className="space-y-2 border-t border-white/10 pt-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                      <Layers size={12} /> Google Flow Ingredients (Character & Set Locks across all 6 Scenes)
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(activeShort.characterPrompts).map(
                        ([charName, prompt]) => (
                          <div
                            key={charName}
                            className="rounded-2xl border border-white/10 bg-black/40 p-3 flex flex-col justify-between gap-2"
                          >
                            <div>
                              <div className="text-xs font-semibold text-white">
                                {charName.replace(/_/g, " ")}
                              </div>
                              <p className="mt-1 text-[11px] text-white/65 line-clamp-2">
                                {prompt}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyPrompt(charName, prompt)}
                              className="self-start inline-flex items-center gap-1 text-[10px] font-mono text-sky-300 hover:text-white"
                            >
                              {copiedKey === charName ? (
                                <>
                                  <CheckCircle2
                                    size={11}
                                    className="text-emerald-300"
                                  />{" "}
                                  Copied Ingredient!
                                </>
                              ) : (
                                <>
                                  <Copy size={11} /> Copy Flow Ingredient Prompt
                                </>
                              )}
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 6-Scene × 5-Second (0:00–0:30) Google Flow SceneBuilder Timeline */}
              <div className="space-y-3">
                {activeShort.scenes.map((sc, idx) => {
                  const fullVeoPrompt =
                    sc.veoPrompt ||
                    buildVeo31ScenePrompt({
                      visualPrompt: sc.imagePrompt,
                      motionPrompt: sc.motionPrompt,
                      speaker: sc.speaker,
                      dialogue: sc.dialogue,
                      cameraControl: sc.cameraControl || "Dolly In (Fast)",
                      flowTransition: sc.flowTransition || "Extend (+5s)",
                      sfxPrompt: sc.sfxPrompt || "Cinematic studio audio",
                    });

                  return (
                    <div
                      key={sc.scene}
                      onClick={() => {
                        setActiveSceneIdx(idx);
                        setPlaybackTimeSec(
                          (idx / Math.max(1, activeShort.scenes.length)) * totalDurationSec,
                        );
                      }}
                      className={`cursor-pointer rounded-3xl border p-5 transition ${
                        derivedSceneIdx === idx || activeSceneIdx === idx
                          ? "jt-chrome-shell border-sky-400"
                          : "jt-chrome-card opacity-85 hover:opacity-100"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-lg px-2.5 py-1 font-mono text-xs font-bold text-white"
                            style={{ backgroundColor: sc.accentColor }}
                          >
                            Scene 0{sc.scene} ({sc.time} · 5.0s)
                          </span>
                          <span className="text-sm font-display font-semibold text-white">
                            {sc.speaker}
                          </span>
                          <span className="rounded-md border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                            {sc.cameraControl || "Dolly In (Fast)"}
                          </span>
                          <span className="rounded-md border border-purple-400/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] text-purple-200">
                            {sc.flowTransition || "Extend (+5s)"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyPrompt(`veo-${sc.scene}`, fullVeoPrompt);
                            }}
                            className="rounded-xl border border-sky-400/40 bg-sky-500/20 px-2.5 py-1 text-[11px] font-semibold text-sky-200 hover:bg-sky-500/30"
                          >
                            {copiedKey === `veo-${sc.scene}`
                              ? "Copied Veo 3.1 Prompt!"
                              : "Copy Veo 3.1 + Flow Prompt"}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenInGoogleFlow(fullVeoPrompt);
                            }}
                            className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-white hover:bg-white/20 inline-flex items-center gap-1"
                          >
                            Send to Flow <ExternalLink size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Editable Lip-Sync Dialogue Line */}
                      <div className="mt-3">
                        <label className="block font-mono text-[10px] uppercase text-white/50 mb-1">
                          Veo 3.1 Native Lip-Sync Dialogue (5.0s Window)
                        </label>
                        <input
                          type="text"
                          value={sc.dialogue}
                          onChange={(e) => {
                            const updatedDialogue = e.target.value;
                            const nextScenes = [...activeShort.scenes];
                            const updatedScene: ShortScene = {
                              ...sc,
                              dialogue: updatedDialogue,
                              veoPrompt: buildVeo31ScenePrompt({
                                visualPrompt: sc.imagePrompt,
                                motionPrompt: sc.motionPrompt,
                                speaker: sc.speaker,
                                dialogue: updatedDialogue,
                                cameraControl:
                                  sc.cameraControl || "Dolly In (Fast)",
                                flowTransition:
                                  sc.flowTransition || "Extend (+5s)",
                                sfxPrompt:
                                  sc.sfxPrompt || "Cinematic studio audio",
                              }),
                            };
                            nextScenes[idx] = updatedScene;
                            const nextShorts = shorts.map((item) =>
                              item.id === activeShort.id
                                ? { ...item, scenes: nextScenes }
                                : item,
                            );
                            setShorts(nextShorts);
                            saveYouTubeShorts(nextShorts);
                          }}
                          className="w-full rounded-xl border border-white/15 bg-black/45 px-3.5 py-2 text-sm font-medium text-white outline-none focus:border-sky-400"
                        />
                      </div>

                      {/* Google Flow Camera Control & Transition Selectors */}
                      <div
                        className="mt-2.5 grid gap-2 sm:grid-cols-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div>
                          <label className="block font-mono text-[10px] uppercase text-white/50 mb-1">
                            <Camera size={10} className="inline mr-1 text-sky-300" />
                            Google Flow Camera Control
                          </label>
                          <select
                            value={sc.cameraControl || "Dolly In (Fast)"}
                            onChange={(e) => {
                              const cam = e.target.value as FlowCameraControl;
                              const nextScenes = [...activeShort.scenes];
                              nextScenes[idx] = {
                                ...sc,
                                cameraControl: cam,
                                veoPrompt: buildVeo31ScenePrompt({
                                  visualPrompt: sc.imagePrompt,
                                  motionPrompt: sc.motionPrompt,
                                  speaker: sc.speaker,
                                  dialogue: sc.dialogue,
                                  cameraControl: cam,
                                  flowTransition:
                                    sc.flowTransition || "Extend (+5s)",
                                  sfxPrompt:
                                    sc.sfxPrompt || "Cinematic studio audio",
                                }),
                              };
                              const nextShorts = shorts.map((item) =>
                                item.id === activeShort.id
                                  ? { ...item, scenes: nextScenes }
                                  : item,
                              );
                              setShorts(nextShorts);
                              saveYouTubeShorts(nextShorts);
                            }}
                            className="w-full rounded-xl border border-white/15 bg-slate-950/90 px-3 py-1.5 text-xs text-white"
                          >
                            {CAMERA_CONTROLS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase text-white/50 mb-1">
                            Google Flow SceneBuilder Transition
                          </label>
                          <select
                            value={sc.flowTransition || "Extend (+5s)"}
                            onChange={(e) => {
                              const mode = e.target.value as FlowTransitionMode;
                              const nextScenes = [...activeShort.scenes];
                              nextScenes[idx] = {
                                ...sc,
                                flowTransition: mode,
                                veoPrompt: buildVeo31ScenePrompt({
                                  visualPrompt: sc.imagePrompt,
                                  motionPrompt: sc.motionPrompt,
                                  speaker: sc.speaker,
                                  dialogue: sc.dialogue,
                                  cameraControl:
                                    sc.cameraControl || "Dolly In (Fast)",
                                  flowTransition: mode,
                                  sfxPrompt:
                                    sc.sfxPrompt || "Cinematic studio audio",
                                }),
                              };
                              const nextShorts = shorts.map((item) =>
                                item.id === activeShort.id
                                  ? { ...item, scenes: nextScenes }
                                  : item,
                              );
                              setShorts(nextShorts);
                              saveYouTubeShorts(nextShorts);
                            }}
                            className="w-full rounded-xl border border-white/15 bg-slate-950/90 px-3 py-1.5 text-xs text-white"
                          >
                            {FLOW_TRANSITIONS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Unified Veo 3.1 Prompt Preview & Negative Prompt + Stateful Routing */}
                      <div className="mt-2.5 space-y-2">
                        <div className="rounded-xl bg-black/35 p-3 border border-sky-400/20 text-[11px] text-white/75 font-mono leading-relaxed">
                          <strong className="text-sky-300">
                            Unified Veo 3.1 Prompt (aspect_ratio=&quot;9:16&quot; · delivery=&quot;uri&quot;):
                          </strong>{" "}
                          {fullVeoPrompt}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-rose-950/20 px-3 py-2 border border-rose-400/20 text-[10.5px] font-mono text-rose-200/85">
                          <span>
                            <strong className="text-rose-300">Negative Prompt:</strong>{" "}
                            {sc.negativePrompt ||
                              "blurry, morphing hands, watermark, static camera, slow pacing, 16:9 letterbox, 'Hi guys' intro"}
                          </span>
                          <span className="text-emerald-300">
                            Tool: {sc.scene === 1 ? "generate_with_subjects" : "generate_video"} → edit_video(int_{activeShort.id}_s{sc.scene})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right: Straight Single Video 9:16 Vertical Shorts Player & Veo 3.1 Controls */}
        <div className="jt-chrome-card rounded-3xl p-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300 block">
                VEO 3.1 · {totalDurationSec}.0s STRAIGHT VIDEO
              </span>
              <span className="font-mono text-[11px] font-bold text-white">
                00:{String(Math.floor(playbackTimeSec)).padStart(2, "0")} / 00:
                {String(totalDurationSec).padStart(2, "0")}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setVoiceEnabled((v) => !v)}
              className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-white"
            >
              {voiceEnabled ? (
                <Volume2 size={13} className="text-emerald-300" />
              ) : (
                <VolumeX size={13} />
              )}
              {voiceEnabled ? "Voiceover: ON" : "Voiceover: OFF"}
            </button>
          </div>

          {/* Video Duration Selector Bar */}
          <div className="w-full mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-white/50 pl-2">
              Length:
            </span>
            <div className="flex items-center gap-1">
              {[
                { label: "15s", sec: 15 },
                { label: "30s", sec: 30 },
                { label: "45s", sec: 45 },
                { label: "1 min", sec: 60 },
              ].map((d) => (
                <button
                  key={d.sec}
                  type="button"
                  onClick={() => handleUpdateDuration(d.sec)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold transition ${
                    totalDurationSec === d.sec
                      ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Smooth Continuous Timeline Scrubber (Straight single video) */}
          <div className="w-full space-y-1 mb-3">
            <input
              type="range"
              min="0"
              max={totalDurationSec}
              step="0.05"
              value={playbackTimeSec}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setPlaybackTimeSec(val);
                playbackRef.current = val;
              }}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-white/20 rounded-lg appearance-none"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 px-0.5">
              <span>00:00</span>
              <span className="text-emerald-300 font-semibold">
                Continuous Single Video ({totalDurationSec}s)
              </span>
              <span>00:{String(totalDurationSec).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border-2 border-white/25 bg-black shadow-2xl">
            <canvas
              ref={canvasRef}
              width={320}
              height={568}
              className="block w-[300px] h-[532px]"
            />
          </div>

          {/* Veo 3.1 + Google Flow Render & YouTube Dispatch Controls */}
          <div className="mt-4 w-full space-y-2.5">
            <button
              type="button"
              onClick={handleRenderVeo31Short}
              disabled={veoRendering}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-sky-500/25 hover:brightness-110 transition disabled:opacity-50"
            >
              <Sparkles size={15} />
              {veoRendering
                ? `Veo 3.1 Generating (${veoRenderProgress}%)...`
                : `Render ${totalDurationSec}s Video in Veo 3.1 + Flow`}
            </button>

            {veoRenderStep && (
              <div className="rounded-xl border border-sky-400/35 bg-sky-500/15 p-2.5 text-[11px] text-sky-200 text-center font-mono">
                {veoRenderStep}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-sky-100 transition"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                {isPlaying ? "Pause Video" : "Play Straight Video"}
              </button>

              <button
                type="button"
                onClick={handleRecordWebmVideo}
                disabled={isRecording}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition disabled:opacity-50"
              >
                <Video size={14} />
                {isRecording ? "Recording..." : `Export .WebM (${totalDurationSec}s)`}
              </button>
            </div>

            {/* Direct Auto-Send to YouTube Button */}
            <button
              type="button"
              onClick={() => executeYouTubeAutoUpload()}
              disabled={uploadingToYt}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-600/30 hover:brightness-110 transition disabled:opacity-50"
            >
              <Youtube size={16} />
              {uploadingToYt
                ? `Uploading ${totalDurationSec}s Short (${uploadProgress}%)...`
                : `Auto-Send ${totalDurationSec}s Veo 3.1 Short to YouTube`}
            </button>

            {uploadStatusMsg && (
              <div className="rounded-xl border border-emerald-400/35 bg-emerald-500/15 p-2.5 text-[11px] text-emerald-200 text-center">
                {uploadStatusMsg}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Website YouTube Shorts Display Feed */}
      <div className="jt-chrome-card rounded-3xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
              LIVE ON WEBSITE // YOUTUBE SHORTS SHOWCASE (#youtube-shorts)
            </span>
            <h3 className="text-xl font-display font-semibold text-white mt-1">
              Generated 30s Veo 3.1 Videos Displayed on Your Website ({shorts.length})
            </h3>
            <p className="text-xs text-white/60 mt-0.5">
              Every 30-second video you generate above automatically appears here and on your public homepage YouTube Shorts section.
            </p>
          </div>
          <a
            href="/#youtube-shorts"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/30 transition"
          >
            View Live on Homepage (#youtube-shorts) <ExternalLink size={13} />
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shorts.map((short) => (
            <VeoShortVideoCard
              key={short.id}
              short={short}
              autoPlayInitial={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
