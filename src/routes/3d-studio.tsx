import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Interactive3DCanvas } from "@/components/site/Interactive3DCanvas";
import {
  type Geometry3DType,
  type Material3DStyle,
  type Scene3DConfig,
  getScene3DConfig,
  saveScene3DConfig,
  DEFAULT_SCENE_3D,
} from "@/lib/business-store";
import { getLocalAdminSession } from "@/lib/security";
import {
  Box,
  Sliders,
  Sparkles,
  RotateCcw,
  Save,
  Layers,
  Eye,
  Cpu,
  ArrowRight,
  Lock,
  CheckCircle2,
  Wand2,
} from "lucide-react";

export const Route = createFileRoute("/3d-studio" as any)({
  component: Studio3DPage,
  head: () => ({
    meta: [
      { title: "3D Spatial Lab & Interactive Animations — Jubilee Tech" },
      {
        name: "description",
        content:
          "Interactive 3D web animations, procedural geometry, and spatial product showcases engineered by Jubilee Tech.",
      },
    ],
  }),
});

const GEOMETRY_OPTIONS: { id: Geometry3DType; label: string; desc: string }[] = [
  { id: "torus-knot", label: "Torus Knot", desc: "Continuous sculptural ribbon" },
  { id: "gyro-rings", label: "Orbital Gyroscope", desc: "Multi-axis precision rings" },
  { id: "dna-helix", label: "Quantum Double Helix", desc: "Biotech & algorithmic spiral" },
  { id: "crystal-cluster", label: "Obsidian Crystal", desc: "Faceted luxury prism cluster" },
  { id: "icosahedron-core", label: "Geodesic Core", desc: "Dual-shell faceted polyhedron" },
  { id: "wave-sphere", label: "Harmonic Sphere", desc: "Frequency-modulated surface" },
  { id: "hypercube", label: "4D Tesseract", desc: "Nested dimensional projection" },
];

const MATERIAL_OPTIONS: { id: Material3DStyle; label: string }[] = [
  { id: "iridescent-chrome", label: "Iridescent Chrome" },
  { id: "frosted-glass", label: "Frosted Obsidian Glass" },
  { id: "liquid-gold", label: "24K Liquid Gold" },
  { id: "hologram-matrix", label: "Hologram Matrix" },
  { id: "neon-wireframe", label: "Architectural Wireframe" },
];

export default function Studio3DPage() {
  const [scene, setScene] = useState<Scene3DConfig>(() => getScene3DConfig());
  const [isAdmin, setIsAdmin] = useState(false);
  const [editorOpen, setEditorOpen] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    const session = getLocalAdminSession();
    setIsAdmin(Boolean(session));
  }, []);

  const handleSaveToSite = () => {
    saveScene3DConfig(scene);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleReset = () => {
    setScene(DEFAULT_SCENE_3D);
    saveScene3DConfig(DEFAULT_SCENE_3D);
  };

  return (
    <PageShell>
      <section className="relative isolate overflow-hidden pt-16 pb-24">
        <div className="jt-aurora opacity-40" />

        <div className="relative mx-auto max-w-7xl px-6">
          {/* Editorial Top Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-sky-300">
                <Cpu size={13} /> Spatial Web Engineering // 60FPS Real-Time
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-display font-semibold tracking-tight text-white">
                {scene.headline}
              </h1>
              <p className="mt-3 max-w-2xl text-base md:text-lg text-white/65 leading-relaxed">
                {scene.subheadline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setEditorOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition"
              >
                <Sliders size={14} className="text-sky-300" />
                {editorOpen ? "Hide Live 3D Editor" : "Open Live 3D Editor"}
              </button>

              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 hover:bg-sky-400 transition"
              >
                <Wand2 size={14} />
                Full Admin 3D Studio
              </Link>
            </div>
          </div>

          {/* Main Interactive 3D Workspace */}
          <div
            className={`mt-8 grid gap-6 ${
              editorOpen ? " lg:grid-cols-[1fr_390px]" : "grid-cols-1"
            }`}
          >
            {/* Left: 3D Viewport + Keyframe Bar */}
            <div className="space-y-4">
              <Interactive3DCanvas
                config={scene}
                heightClass="h-[540px] md:h-[640px]"
                interactiveControls={true}
              />

              {/* Client Industry 3D Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    title: "Luxury Parfumerie",
                    sub: "Gold Crystal Flacon",
                    patch: {
                      presetName: "Luxury Parfumerie",
                      geometry: "crystal-cluster" as Geometry3DType,
                      material: "liquid-gold" as Material3DStyle,
                      primaryColor: "#f59e0b",
                      secondaryColor: "#78350f",
                      explodeFactor: 0.14,
                    },
                  },
                  {
                    title: "AI / Fintech Core",
                    sub: "Iridescent Torus",
                    patch: {
                      presetName: "AI Fintech Core",
                      geometry: "torus-knot" as Geometry3DType,
                      material: "iridescent-chrome" as Material3DStyle,
                      primaryColor: "#38bdf8",
                      secondaryColor: "#a855f7",
                      explodeFactor: 0.06,
                    },
                  },
                  {
                    title: "Biotech & MedSpa",
                    sub: "Holographic Helix",
                    patch: {
                      presetName: "Biotech Helix",
                      geometry: "dna-helix" as Geometry3DType,
                      material: "hologram-matrix" as Material3DStyle,
                      primaryColor: "#2dd4bf",
                      secondaryColor: "#3b82f6",
                      explodeFactor: 0.1,
                    },
                  },
                  {
                    title: "Architectural CAD",
                    sub: "4D Hyper-Structure",
                    patch: {
                      presetName: "Architectural CAD",
                      geometry: "hypercube" as Geometry3DType,
                      material: "neon-wireframe" as Material3DStyle,
                      primaryColor: "#e2e8f0",
                      secondaryColor: "#38bdf8",
                      explodeFactor: 0.08,
                    },
                  },
                ].map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => setScene((prev) => ({ ...prev, ...preset.patch }))}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-sky-400/40 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">
                        Preset
                      </span>
                      <Box
                        size={14}
                        className="text-white/40 group-hover:text-sky-300 transition"
                      />
                    </div>
                    <div className="mt-2 font-display text-sm font-semibold text-white">
                      {preset.title}
                    </div>
                    <div className="text-xs text-white/50">{preset.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Live 3D Scene Inspector & Customizer */}
            {editorOpen && (
              <aside className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">
                        Live Scene Inspector
                      </span>
                      <h2 className="text-lg font-display font-semibold text-white">
                        3D Animation Controls
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      title="Reset to default"
                      className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                    >
                      <RotateCcw size={15} />
                    </button>
                  </div>

                  {/* Geometry Selector */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                      1. 3D Mesh Geometry
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {GEOMETRY_OPTIONS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setScene((prev) => ({ ...prev, geometry: g.id }))}
                          className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                            scene.geometry === g.id
                              ? "border-sky-400 bg-sky-500/20 text-white font-semibold"
                              : "border-white/10 bg-black/30 text-white/70 hover:bg-white/5"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Surface Shader / Material */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                      2. Surface Material & Shader
                    </label>
                    <select
                      value={scene.material}
                      onChange={(e) =>
                        setScene((prev) => ({
                          ...prev,
                          material: e.target.value as Material3DStyle,
                        }))
                      }
                      className="w-full rounded-xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-400"
                    >
                      {MATERIAL_OPTIONS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Lighting Pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1.5">
                        Key Light Color
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-2.5 py-1.5">
                        <input
                          type="color"
                          value={scene.primaryColor}
                          onChange={(e) =>
                            setScene((prev) => ({ ...prev, primaryColor: e.target.value }))
                          }
                          className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent"
                        />
                        <span className="font-mono text-xs text-white/80">
                          {scene.primaryColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1.5">
                        Rim / Iridescence
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-2.5 py-1.5">
                        <input
                          type="color"
                          value={scene.secondaryColor}
                          onChange={(e) =>
                            setScene((prev) => ({ ...prev, secondaryColor: e.target.value }))
                          }
                          className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent"
                        />
                        <span className="font-mono text-xs text-white/80">
                          {scene.secondaryColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Parametric Sliders */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex justify-between text-xs text-white/75 mb-1">
                        <span>Rotation Velocity (Y-Axis)</span>
                        <span className="font-mono text-sky-300">
                          {scene.rotationSpeedY.toFixed(2)} rad/s
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2.5"
                        step="0.05"
                        value={scene.rotationSpeedY}
                        onChange={(e) =>
                          setScene((prev) => ({
                            ...prev,
                            rotationSpeedY: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-sky-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-white/75 mb-1">
                        <span>Vertex Explode / Morph Factor</span>
                        <span className="font-mono text-sky-300">
                          {Math.round(scene.explodeFactor * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.65"
                        step="0.01"
                        value={scene.explodeFactor}
                        onChange={(e) =>
                          setScene((prev) => ({
                            ...prev,
                            explodeFactor: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-sky-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-white/75 mb-1">
                        <span>Model Scale & Zoom</span>
                        <span className="font-mono text-sky-300">
                          {scene.scale.toFixed(2)}×
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.6"
                        max="1.6"
                        step="0.05"
                        value={scene.scale}
                        onChange={(e) =>
                          setScene((prev) => ({
                            ...prev,
                            scale: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-sky-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-white/75 mb-1">
                        <span>Spatial Particle Density</span>
                        <span className="font-mono text-sky-300">{scene.particleCount} pts</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="220"
                        step="10"
                        value={scene.particleCount}
                        onChange={(e) =>
                          setScene((prev) => ({
                            ...prev,
                            particleCount: parseInt(e.target.value, 10),
                          }))
                        }
                        className="w-full accent-sky-400"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setScene((prev) => ({
                          ...prev,
                          wireframeOverlay: !prev.wireframeOverlay,
                        }))
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        scene.wireframeOverlay
                          ? "border-sky-400/50 bg-sky-500/15 text-sky-200"
                          : "border-white/10 bg-black/30 text-white/50"
                      }`}
                    >
                      Wireframe: {scene.wireframeOverlay ? "ON" : "OFF"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setScene((prev) => ({
                          ...prev,
                          showGridFloor: !prev.showGridFloor,
                        }))
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        scene.showGridFloor
                          ? "border-sky-400/50 bg-sky-500/15 text-sky-200"
                          : "border-white/10 bg-black/30 text-white/50"
                      }`}
                    >
                      Spatial Grid: {scene.showGridFloor ? "ON" : "OFF"}
                    </button>
                  </div>

                  {/* Editable Scene Headline */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
                      Scene Headline Copy
                    </label>
                    <input
                      type="text"
                      value={scene.headline}
                      onChange={(e) =>
                        setScene((prev) => ({ ...prev, headline: e.target.value }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                {/* Publish / Save Button */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleSaveToSite}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-500/25 hover:brightness-110 transition"
                  >
                    <Save size={15} />
                    Publish 3D State to Live Website
                  </button>

                  {savedToast && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-medium">
                      <CheckCircle2 size={14} /> Saved! Live across Homepage & 3D Studio.
                    </div>
                  )}

                  {!isAdmin && (
                    <p className="text-[11px] text-center text-white/45 flex items-center justify-center gap-1">
                      <Lock size={11} /> Sign in at{" "}
                      <Link to="/admin" className="text-sky-300 underline">
                        /admin
                      </Link>{" "}
                      for keyframe timeline & cloud sync.
                    </p>
                  )}
                </div>
              </aside>
            )}
          </div>

          {/* Why Spatial 3D Converts Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-5">
            {[
              {
                tag: "01 // RETENTION",
                title: "+64% Time-On-Site Lift",
                body: "Interactive 3D product & brand centerpieces stop the scroll immediately and separate your brand from cookie-cutter AI templates.",
              },
              {
                tag: "02 // PERFORMANCE",
                title: "Zero-Bloat 60FPS Engine",
                body: "Hardware-accelerated procedural geometry that loads in under 40ms without 50MB video files slowing down mobile visitors.",
              },
              {
                tag: "03 // ADMIN CONTROL",
                title: "Live Editable From Admin",
                body: "Change shaders, colors, rotation physics, and 3D geometry anytime from the Jubilee Tech Admin Control Center.",
              },
            ].map((card) => (
              <div
                key={card.tag}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sky-300">
                  {card.tag}
                </span>
                <h3 className="mt-3 text-xl font-display font-semibold text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-white/65 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
