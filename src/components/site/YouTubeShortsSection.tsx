import React, { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  type ShortScene,
  type YouTubeShortProject,
  getYouTubeShorts,
} from "@/lib/business-store";
import { SectionHeader } from "@/components/site/PageShell";
import { AiVideoPromptSimulator } from "@/components/site/AiVideoPromptSimulator";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Film,
  ArrowUpRight,
  Download,
  Youtube,
} from "lucide-react";

/**
 * Renders the Zack D. Films / DesignwD (w0lHdfFZM5M) 3D Cross-Section Cutaway Explainer frame:
 * - Top: Daylight sky, two-story suburban house with terracotta roof & blue shutters, green lawn
 * - Middle/Bottom: 3D isometric cutaway of brown underground soil strata + sliced concrete pool/chamber
 *   with translucent blue water, dynamic waterline, hydrostatic pressure arrows & tilting shell
 * - Center: Bold white black-outlined viral explainer subtitle ("waterline", etc.)
 */
export function render3DCutawayExplainerFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  short: YouTubeShortProject,
  currentScene?: ShortScene | null,
  sceneIdxOrDuration?: number,
  totalDurationOverride?: number,
) {
  const isCutaway =
    short.trackType === "3d-cutaway-explainer" ||
    short.id.includes("cutaway") ||
    short.title.toLowerCase().includes("cutaway") ||
    short.title.toLowerCase().includes("pool");

  const scenes = short.scenes && short.scenes.length > 0 ? short.scenes : [];
  const totalDuration =
    totalDurationOverride ||
    (typeof sceneIdxOrDuration === "number" && sceneIdxOrDuration > 6
      ? sceneIdxOrDuration
      : short.durationSeconds || 30);

  const clampedTime = Math.max(0, Math.min(totalDuration, t));
  const progress = totalDuration > 0 ? clampedTime / totalDuration : 0;

  const derivedSceneIdx =
    typeof sceneIdxOrDuration === "number" && sceneIdxOrDuration < scenes.length && sceneIdxOrDuration >= 0
      ? sceneIdxOrDuration
      : Math.min(Math.max(0, scenes.length - 1), Math.floor(progress * Math.max(1, scenes.length)));

  const activeScene =
    currentScene ??
    scenes[derivedSceneIdx] ??
    scenes[0] ?? {
      scene: 1,
      time: "0:00",
      speaker: "Narrator",
      dialogue: short.title,
      imagePrompt: short.description,
      motionPrompt: "Fast camera motion",
      cameraControl: "Dolly In (Fast)",
      visualTheme: "3D Explainer",
      accentColor: "#38bdf8",
    };

  const cam = activeScene.cameraControl || "Dolly In (Fast)";
  let zoom = 1 + progress * 0.12;
  let ox = 0;
  let oy = 0;
  if (cam === "Dolly In (Fast)") zoom = 1 + progress * 0.24;
  else if (cam === "Dolly Out (Reveal)") zoom = 1.18 - progress * 0.16;
  else if (cam === "Handheld Shake") {
    ox = Math.sin(clampedTime * 20) * 2.8;
    oy = Math.cos(clampedTime * 17) * 2.8;
  } else if (cam === "Pan Right + Rack Focus" || cam === "Fast Tracking Shot") {
    ox = Math.sin(clampedTime * 1.6) * 7;
  }

  ctx.save();
  ctx.clearRect(0, 0, w, h);

  if (isCutaway) {
    const horizonY = Math.round(h * 0.34);
    const lawnBottomY = Math.round(h * 0.44);

    // 1. Daylight Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, "#6899d3");
    skyGrad.addColorStop(1, "#b4d2f0");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY);

    // 2. Two-Story House with Terracotta Roof & Blue Shutters (Matches w0lHdfFZM5M)
    ctx.save();
    ctx.translate(w / 2 + ox * 0.4, 0);
    const houseW = w * 0.68;
    const houseX = -houseW / 2;
    const roofTopY = 24;
    const eaveY = 64;
    const groundY = horizonY - 4;

    // Terracotta hip roof
    const roofGrad = ctx.createLinearGradient(0, roofTopY, 0, eaveY);
    roofGrad.addColorStop(0, "#c85a32");
    roofGrad.addColorStop(1, "#9e3f1f");
    ctx.fillStyle = roofGrad;
    ctx.beginPath();
    ctx.moveTo(houseX + 26, roofTopY);
    ctx.lineTo(houseX + houseW - 26, roofTopY);
    ctx.lineTo(houseX + houseW + 8, eaveY);
    ctx.lineTo(houseX - 8, eaveY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Warm taupe-grey facade wall
    ctx.fillStyle = "#8d8478";
    ctx.fillRect(houseX, eaveY, houseW, groundY - eaveY);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(houseX, eaveY, houseW, groundY - eaveY);

    // Upper floor 5 windows with blue shutters
    const winCount = 5;
    const winSpacing = houseW / (winCount + 0.6);
    for (let i = 0; i < winCount; i++) {
      const wx = houseX + 16 + i * winSpacing;
      const wy = eaveY + 12;
      // Blue shutters
      ctx.fillStyle = "#1d70b8";
      ctx.fillRect(wx - 4, wy, 4, 22);
      ctx.fillRect(wx + 16, wy, 4, 22);
      // Window pane
      ctx.fillStyle = "#475569";
      ctx.fillRect(wx, wy, 16, 22);
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 1;
      ctx.strokeRect(wx, wy, 16, 22);
    }

    // Lower floor windows & center glass sliding door
    ctx.fillStyle = "#334155";
    ctx.fillRect(-22, eaveY + 46, 44, groundY - (eaveY + 46));
    ctx.strokeStyle = "#e2e8f0";
    ctx.strokeRect(-22, eaveY + 46, 44, groundY - (eaveY + 46));

    // Left & right lower windows with blue shutters
    [-houseW * 0.34, houseW * 0.22].forEach((lx) => {
      ctx.fillStyle = "#1d70b8";
      ctx.fillRect(lx - 5, eaveY + 48, 5, 24);
      ctx.fillRect(lx + 22, eaveY + 48, 5, 24);
      ctx.fillStyle = "#475569";
      ctx.fillRect(lx, eaveY + 48, 22, 24);
      ctx.strokeStyle = "#f8fafc";
      ctx.strokeRect(lx, eaveY + 48, 22, 24);
    });
    ctx.restore();

    // 3. Green Backyard Lawn Surface
    const lawnGrad = ctx.createLinearGradient(0, horizonY - 4, 0, lawnBottomY);
    lawnGrad.addColorStop(0, "#4d9c3a");
    lawnGrad.addColorStop(1, "#65b741");
    ctx.fillStyle = lawnGrad;
    ctx.fillRect(0, horizonY - 4, w, lawnBottomY - horizonY + 4);

    // 4. Deep Brown Underground Soil Cross-Section Strata
    const soilGrad = ctx.createLinearGradient(0, lawnBottomY, 0, h);
    soilGrad.addColorStop(0, "#7c4722");
    soilGrad.addColorStop(0.45, "#633515");
    soilGrad.addColorStop(1, "#3f200b");
    ctx.fillStyle = soilGrad;
    ctx.fillRect(0, lawnBottomY, w, h - lawnBottomY);

    // Soil clods / realistic earth texture chunks
    for (let s = 0; s < 42; s++) {
      const sx = ((s * 67) % (w - 20)) + 10;
      const sy = lawnBottomY + 18 + ((s * 43) % (h - lawnBottomY - 28));
      const sr = 6 + (s % 4) * 4;
      ctx.fillStyle = s % 2 === 0 ? "rgba(42, 20, 6, 0.42)" : "rgba(146, 84, 39, 0.32)";
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rising underground water table in soil across continuous video
    if (progress >= 0.35) {
      const gwProgress = Math.min(1, (progress - 0.35) / 0.35);
      const gwHeight = (h - lawnBottomY) * (0.32 + gwProgress * 0.35);
      const gwGrad = ctx.createLinearGradient(0, h - gwHeight, 0, h);
      gwGrad.addColorStop(0, "rgba(14, 165, 233, 0.22)");
      gwGrad.addColorStop(1, "rgba(2, 132, 199, 0.52)");
      ctx.fillStyle = gwGrad;
      ctx.fillRect(0, h - gwHeight, w, gwHeight);
    }

    // 5. 3D Isometric Cutaway Concrete Swimming Pool Shell
    ctx.save();
    const poolCenterX = w / 2 + ox * 0.6;
    const poolTopY = lawnBottomY - 12 + oy * 0.5;

    // Smooth lift & tilt when empty (progress between 0.72 and 0.92)
    let popLiftY = 0;
    let popTiltRad = 0.02;
    if (progress >= 0.72 && progress < 0.92) {
      const liftP = Math.min(1, (progress - 0.72) / 0.1);
      popLiftY = -24 * liftP - Math.sin(clampedTime * 14) * 4;
      popTiltRad = -0.12 * liftP - Math.sin(clampedTime * 11) * 0.02;
    } else if (progress >= 0.92) {
      popLiftY = -14;
      popTiltRad = -0.04;
    }

    ctx.translate(poolCenterX, poolTopY + 55 + popLiftY);
    ctx.scale(zoom, zoom);
    ctx.rotate(popTiltRad);

    const pw = w * 0.62;
    const ph = 112;
    const px = -pw / 2;
    const py = -55;

    // Outer concrete shell 3D perspective box
    ctx.fillStyle = "#b89f82";
    ctx.beginPath();
    ctx.moveTo(px - 10, py);
    ctx.lineTo(px + pw + 10, py);
    ctx.lineTo(px + pw, py + ph + 12);
    ctx.lineTo(px, py + ph + 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#785f47";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner pool chamber (white/blue mosaic interior)
    ctx.fillStyle = "#cbe5f6";
    ctx.fillRect(px + 8, py + 6, pw - 16, ph - 6);

    // Blue mosaic tile waterline strip along top inner wall
    ctx.fillStyle = "#1d70b8";
    ctx.fillRect(px + 8, py + 6, pw - 16, 10);

    // Dynamic water fill ratio across straight timeline:
    let waterFillRatio = 0.78;
    if (progress >= 0.48 && progress < 0.72) {
      const drainP = (progress - 0.48) / 0.24;
      waterFillRatio = Math.max(0.04, 0.78 - drainP * 0.74);
    } else if (progress >= 0.72 && progress < 0.92) {
      waterFillRatio = 0.04;
    } else if (progress >= 0.92) {
      waterFillRatio = 0.35;
    }

    const waterH = (ph - 14) * waterFillRatio;
    const waterTopY = py + ph - waterH;

    // Translucent 3D Cutaway Water Volume
    const waterGrad = ctx.createLinearGradient(0, waterTopY, 0, py + ph);
    waterGrad.addColorStop(0, "rgba(125, 211, 252, 0.86)");
    waterGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.78)");
    waterGrad.addColorStop(1, "rgba(2, 132, 199, 0.88)");
    ctx.fillStyle = waterGrad;
    ctx.fillRect(px + 8, waterTopY, pw - 16, waterH);

    // Shimmering top waterline wave
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + 8, waterTopY);
    ctx.lineTo(px + pw - 8, waterTopY);
    ctx.stroke();

    // Hydrostatic Force Arrows
    if (progress < 0.35) {
      // Downward weight
      [-45, 0, 45].forEach((ax) => {
        drawForceArrow(ctx, ax, py + 32, ax, py + 78, "#0284c7");
      });
    } else if (progress >= 0.35 && progress < 0.92) {
      // Upward subterranean pressure
      [-50, 0, 50].forEach((ax) => {
        drawForceArrow(ctx, ax, py + ph + 44, ax, py + ph + 14, "#ef4444");
      });
    } else {
      // Hydrostatic relief valve open at bottom center
      ctx.fillStyle = "#10b981";
      ctx.fillRect(-8, py + ph - 4, 16, 16);
      drawForceArrow(ctx, 0, py + ph + 28, 0, py + ph - 18, "#10b981");
    }

    ctx.restore();

    // 6. Signature Bold White Black-Stroked Center Subtitle (Like "waterline" in w0lHdfFZM5M)
    const words = activeScene.dialogue.split(" ");
    const chunkSize = 2;
    const totalChunks = Math.max(1, Math.ceil(words.length / chunkSize));
    const activeChunkIdx = Math.floor((clampedTime * 2.2) % totalChunks);
    const activePhrase = words
      .slice(activeChunkIdx * chunkSize, activeChunkIdx * chunkSize + chunkSize)
      .join(" ")
      .replace(/[.,!?;—]/g, "")
      .toLowerCase();

    ctx.save();
    ctx.font = "900 26px 'Space Grotesk', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;

    const captionY = lawnBottomY - 6;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 6.5;
    ctx.strokeText(activePhrase || "waterline", w / 2, captionY);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(activePhrase || "waterline", w / 2, captionY);
    ctx.restore();

    // Top HUD pill with single video timecode
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.beginPath();
    ctx.roundRect(12, 10, w - 24, 24, 8);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 9px monospace";
    const curM = Math.floor(clampedTime / 60);
    const curS = Math.floor(clampedTime % 60);
    const totM = Math.floor(totalDuration / 60);
    const totS = Math.floor(totalDuration % 60);
    const timeStr = `${String(curM).padStart(2, "0")}:${String(curS).padStart(2, "0")} / ${String(totM).padStart(2, "0")}:${String(totS).padStart(2, "0")}`;
    ctx.fillText(`3D CUTAWAY · VEO 3.1 · ${timeStr} (${totalDuration}s SINGLE VIDEO)`, 20, 25);

    // Bottom full sentence subtitle strip
    ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
    ctx.beginPath();
    ctx.roundRect(12, h - 78, w - 24, 52, 12);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 11px sans-serif";
    wrapShortText(ctx, activeScene.dialogue, 20, h - 59, w - 40, 15, 3);

    // Smooth continuous single-video progress bar
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(16, h - 18, w - 32, 4);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(16, h - 18, (w - 32) * progress, 4);

    ctx.restore();
    return;
  }

  // Fallback Cinematic 3D Pixar / POV Renderer for non-cutaway tracks
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#040611");
  grad.addColorStop(0.45, activeScene.accentColor + "55");
  grad.addColorStop(1, "#070913");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2 + ox, h * 0.37 + oy);
  ctx.scale(zoom, zoom);

  const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 145);
  glow.addColorStop(0, activeScene.accentColor + "aa");
  glow.addColorStop(0.6, activeScene.accentColor + "33");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 145, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(15, 23, 42, 0.84)";
  ctx.beginPath();
  ctx.roundRect(-118, -82, 236, 168, 18);
  ctx.fill();
  ctx.strokeStyle = activeScene.accentColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 10px monospace";
  ctx.fillText(`🎬 ${activeScene.visualTheme.toUpperCase()}`, -104, -58);

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "10.5px sans-serif";
  wrapShortText(ctx, activeScene.imagePrompt, -104, -38, 208, 14, 5);
  ctx.restore();

  ctx.fillStyle = "rgba(0, 0, 0, 0.84)";
  ctx.beginPath();
  ctx.roundRect(16, 342, w - 32, 118, 16);
  ctx.fill();

  const words = activeScene.dialogue.split(" ");
  const activeWord = Math.floor((clampedTime * 3.2) % Math.max(1, words.length));
  ctx.font = "bold 15px sans-serif";
  drawShortWords(
    ctx,
    words,
    activeWord,
    28,
    370,
    w - 56,
    22,
    activeScene.accentColor,
  );

  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(20, h - 22, w - 40, 4);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(20, h - 22, (w - 40) * progress, 4);
  ctx.restore();
}

function drawForceArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 8 * Math.cos(angle - Math.PI / 6), y2 - 8 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - 8 * Math.cos(angle + Math.PI / 6), y2 - 8 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function VeoShortVideoCard({
  short,
  autoPlayInitial = false,
}: {
  short: YouTubeShortProject;
  autoPlayInitial?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(autoPlayInitial);
  const [voiceOn, setVoiceOn] = useState(false);
  const [showYtEmbed, setShowYtEmbed] = useState(false);
  const [globalSec, setGlobalSec] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalSec = short.durationSeconds || 30;

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !short.renderedVideoUrl) return;
    if (isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isPlaying, short.renderedVideoUrl]);

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    let animId = 0;

    if (voiceOn && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const fullText = short.scenes.map((s) => s.dialogue).join(" ");
      const utter = new SpeechSynthesisUtterance(fullText);
      utter.rate = 1.08;
      window.speechSynthesis.speak(utter);
    }

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setGlobalSec((prev) => {
        const next = prev + dt;
        return next >= totalSec ? 0 : next;
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
  }, [isPlaying, totalSec, voiceOn, short.scenes]);

  // Zero-lag Canvas: renders 1 static frame when paused, continuous 60fps single-video when isPlaying!
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!isPlaying) {
      render3DCutawayExplainerFrame(
        ctx,
        canvas.width,
        canvas.height,
        1.2,
        short,
        null,
        totalSec,
      );
      return;
    }

    render3DCutawayExplainerFrame(
      ctx,
      canvas.width,
      canvas.height,
      globalSec,
      short,
      null,
      totalSec,
    );
  }, [isPlaying, globalSec, short, totalSec]);

  return (
    <div className="jt-chrome-card rounded-3xl p-4 flex flex-col justify-between border border-white/15 hover:border-sky-400/50 transition">
      <div>
        <div className="relative mx-auto aspect-[9/16] w-full max-w-[285px] overflow-hidden rounded-[24px] border-2 border-white/20 bg-black shadow-2xl">
          {showYtEmbed && short.youtubeVideoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${short.youtubeVideoId}?autoplay=1&loop=1&playlist=${short.youtubeVideoId}`}
              title={short.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : short.renderedVideoUrl ? (
            <video
              ref={videoRef}
              src={short.renderedVideoUrl}
              loop
              playsInline
              muted={!voiceOn}
              className="h-full w-full object-cover"
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={285}
              height={506}
              className="h-full w-full block"
            />
          )}

          {!showYtEmbed && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-bold text-slate-950 shadow-lg hover:bg-sky-100 transition"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isPlaying ? "Pause" : "Play 30s Short"}
              </button>

              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-black/75 border border-white/20 px-2.5 py-1 font-mono text-[10px] text-sky-300">
                  00:{String(Math.floor(globalSec)).padStart(2, "0")}/00:30
                </span>
                <button
                  type="button"
                  onClick={() => setVoiceOn((v) => !v)}
                  className="rounded-full bg-black/75 border border-white/20 p-1.5 text-white hover:bg-white/20"
                  title="Toggle Voiceover Audio"
                >
                  {voiceOn ? (
                    <Volume2 size={13} className="text-emerald-300" />
                  ) : (
                    <VolumeX size={13} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Continuous Timeline Beat Indicators */}
        <div className="mt-3 grid grid-cols-6 gap-1 px-2">
          {short.scenes.map((sc, idx) => {
            const currentSceneIdx = Math.min(
              short.scenes.length - 1,
              Math.floor((totalSec > 0 ? globalSec / totalSec : 0) * short.scenes.length),
            );
            return (
              <button
                key={sc.scene}
                type="button"
                onClick={() => {
                  setShowYtEmbed(false);
                  setGlobalSec(idx * (totalSec / Math.max(1, short.scenes.length)));
                }}
                className={`h-1.5 rounded-full transition ${
                  idx === currentSceneIdx
                    ? "bg-sky-400"
                    : idx < currentSceneIdx
                      ? "bg-emerald-400/60"
                      : "bg-white/15 hover:bg-white/30"
                }`}
                title={`Scene 0${sc.scene} (${sc.time})`}
              />
            );
          })}
        </div>

        {/* Metadata */}
        <div className="mt-3 px-1">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-sky-500/20 border border-sky-400/35 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                {short.veoModel || "veo-3.1-generate-preview"}
              </span>
              <span className="rounded-md bg-purple-500/20 border border-purple-400/35 px-2 py-0.5 font-mono text-[10px] text-purple-200">
                3D Cutaway · 30s
              </span>
            </div>

            {short.youtubeVideoId && (
              <button
                type="button"
                onClick={() => setShowYtEmbed((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md bg-rose-500/20 border border-rose-400/35 px-2 py-0.5 font-mono text-[10px] text-rose-200 hover:bg-rose-500/30"
              >
                <Youtube size={11} />
                {showYtEmbed ? "3D Engine" : "Ref YT Short"}
              </button>
            )}
          </div>

          <h3 className="mt-2 text-sm font-display font-semibold text-white line-clamp-2">
            {short.title}
          </h3>
          <p className="mt-1 text-xs text-white/60 line-clamp-2">
            {short.description}
          </p>
        </div>
      </div>

      {short.renderedVideoUrl && (
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between px-1">
          <span className="font-mono text-[10px] text-emerald-300">
            ✓ Rendered Video File Ready
          </span>
          <a
            href={short.renderedVideoUrl}
            download={`${short.id}-veo31-30s.webm`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:text-white"
          >
            <Download size={12} /> Download .WebM
          </a>
        </div>
      )}
    </div>
  );
}

export function YouTubeShortsWebsiteSection() {
  const [shorts, setShorts] = useState<YouTubeShortProject[]>(() =>
    getYouTubeShorts(),
  );

  useEffect(() => {
    const refresh = () => setShorts(getYouTubeShorts());
    window.addEventListener("jt-store-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("jt-store-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <section
      id="youtube-shorts"
      className="relative mx-auto max-w-7xl px-6 py-24 border-t border-white/10"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          eyebrow="02 // 3D CUTAWAY EXPLAINER SHORTS · VEO 3.1 + GOOGLE FLOW"
          title="30-Second 3D Cross-Section Explainer Shorts."
          description="Engineered in our Admin Studio using Google Veo 3.1 (veo-3.1-generate-preview) & Google Flow SceneBuilder—featuring 3D cross-section cutaway simulations, kinetic waterline captions, and native audio."
          align="left"
        />

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://labs.google/fx/tools/flow"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500/15 px-4 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/25 transition"
          >
            <Film size={14} /> Powered by Veo 3.1 & Google Flow{" "}
            <ArrowUpRight size={13} />
          </a>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:brightness-110 transition"
          >
            <Sparkles size={14} /> Generate New 3D Cutaway Short
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AiVideoPromptSimulator />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shorts.map((short) => (
          <VeoShortVideoCard
            key={short.id}
            short={short}
            autoPlayInitial={false}
          />
        ))}
      </div>
    </section>
  );
}

function wrapShortText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(" ");
  let line = "";
  let linesDrawn = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line, x, y + linesDrawn * lineHeight);
      line = words[n] + " ";
      linesDrawn++;
      if (linesDrawn >= maxLines) return;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y + linesDrawn * lineHeight);
}

function drawShortWords(
  ctx: CanvasRenderingContext2D,
  words: string[],
  activeIdx: number,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  highlightColor: string,
) {
  let cx = x;
  let cy = y;
  words.forEach((word, idx) => {
    const w = ctx.measureText(word + " ").width;
    if (cx + w > x + maxWidth) {
      cx = x;
      cy += lineHeight;
    }
    ctx.fillStyle = idx === activeIdx ? highlightColor : "#ffffff";
    ctx.fillText(word, cx, cy);
    cx += w;
  });
}
