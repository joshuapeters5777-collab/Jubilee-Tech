import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Interactive3DCanvas } from "@/components/site/Interactive3DCanvas";
import {
  type Geometry3DType,
  type Material3DStyle,
  type Scene3DConfig,
  DEFAULT_SCENE_3D,
  getScene3DConfig,
  saveScene3DConfig,
} from "@/lib/business-store";
import {
  Box,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function Admin3DStudioTab() {
  const [scene, setScene] = useState<Scene3DConfig>(() => getScene3DConfig());
  const [savedNotice, setSavedNotice] = useState(false);

  const handlePublish = () => {
    saveScene3DConfig(scene);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleReset = () => {
    setScene(DEFAULT_SCENE_3D);
    saveScene3DConfig(DEFAULT_SCENE_3D);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="jt-chrome-card rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
            ADMIN 3D ANIMATION & SHADER STUDIO
          </span>
          <h2 className="text-2xl font-display font-semibold text-white mt-1">
            Edit Live Website 3D Animations & Keyframe States
          </h2>
          <p className="text-xs text-white/65 mt-1">
            Every change published here immediately updates the Homepage 3D Hero and the
            public{" "}
            <Link to="/3d-studio" className="text-sky-300 underline">
              /3d-studio
            </Link>{" "}
            page.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-medium text-white hover:bg-white/20 transition"
          >
            <RotateCcw size={14} /> Reset Default
          </button>
          <Link
            to="/3d-studio"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-medium text-white hover:bg-white/20 transition"
          >
            Open /3d-studio <ExternalLink size={13} />
          </Link>
          <button
            type="button"
            onClick={handlePublish}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg hover:bg-sky-300 transition"
          >
            <Save size={14} />
            {savedNotice ? "Published Live!" : "Publish to Website"}
          </button>
        </div>
      </div>

      {/* Main Split: 3D Viewport + Full Parameter Controls */}
      <div className="grid gap-6 xl:grid-cols-[1fr_410px]">
        <div className="space-y-4">
          <Interactive3DCanvas
            config={scene}
            heightClass="h-[540px]"
            interactiveControls={true}
          />

          {/* Keyframe State Editor Row */}
          <div className="jt-chrome-card rounded-3xl p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-sky-300 mb-3">
              Interactive Keyframe States (Displayed on Public 3D Viewport)
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {scene.keyframes.map((kf, idx) => (
                <div
                  key={kf.id}
                  className="rounded-2xl border border-white/15 bg-black/40 p-3 space-y-2"
                >
                  <input
                    type="text"
                    value={kf.label}
                    onChange={(e) => {
                      const nextKfs = [...scene.keyframes];
                      nextKfs[idx] = { ...kf, label: e.target.value };
                      setScene((prev) => ({ ...prev, keyframes: nextKfs }));
                    }}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white outline-none focus:border-sky-400"
                  />
                  <select
                    value={kf.geometry}
                    onChange={(e) => {
                      const nextKfs = [...scene.keyframes];
                      nextKfs[idx] = {
                        ...kf,
                        geometry: e.target.value as Geometry3DType,
                      };
                      setScene((prev) => ({ ...prev, keyframes: nextKfs }));
                    }}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-[11px] text-white/80"
                  >
                    <option value="torus-knot">Torus Knot</option>
                    <option value="gyro-rings">Gyro Rings</option>
                    <option value="dna-helix">DNA Helix</option>
                    <option value="crystal-cluster">Crystal Cluster</option>
                    <option value="icosahedron-core">Icosahedron Core</option>
                    <option value="wave-sphere">Wave Sphere</option>
                    <option value="hypercube">4D Hypercube</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={kf.primaryColor}
                      onChange={(e) => {
                        const nextKfs = [...scene.keyframes];
                        nextKfs[idx] = { ...kf, primaryColor: e.target.value };
                        setScene((prev) => ({ ...prev, keyframes: nextKfs }));
                      }}
                      className="h-6 w-full cursor-pointer rounded border-0 bg-transparent"
                    />
                    <input
                      type="color"
                      value={kf.secondaryColor}
                      onChange={(e) => {
                        const nextKfs = [...scene.keyframes];
                        nextKfs[idx] = { ...kf, secondaryColor: e.target.value };
                        setScene((prev) => ({ ...prev, keyframes: nextKfs }));
                      }}
                      className="h-6 w-full cursor-pointer rounded border-0 bg-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Inspector Controls */}
        <div className="jt-chrome-card rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-display font-semibold text-white border-b border-white/15 pb-3">
            Master 3D Scene Parameters
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                Active Geometry
              </label>
              <select
                value={scene.geometry}
                onChange={(e) =>
                  setScene((prev) => ({
                    ...prev,
                    geometry: e.target.value as Geometry3DType,
                  }))
                }
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="torus-knot">Torus Knot</option>
                <option value="gyro-rings">Orbital Gyroscope</option>
                <option value="dna-helix">Quantum DNA Helix</option>
                <option value="crystal-cluster">Obsidian Crystal</option>
                <option value="icosahedron-core">Geodesic Core</option>
                <option value="wave-sphere">Harmonic Sphere</option>
                <option value="hypercube">4D Tesseract</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                Surface Shader
              </label>
              <select
                value={scene.material}
                onChange={(e) =>
                  setScene((prev) => ({
                    ...prev,
                    material: e.target.value as Material3DStyle,
                  }))
                }
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2 text-xs text-white"
              >
                <option value="iridescent-chrome">Iridescent Chrome</option>
                <option value="frosted-glass">Frosted Obsidian Glass</option>
                <option value="liquid-gold">24K Liquid Gold</option>
                <option value="hologram-matrix">Hologram Matrix</option>
                <option value="neon-wireframe">Architectural Wireframe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                Key Light Color
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-2.5 py-1.5">
                <input
                  type="color"
                  value={scene.primaryColor}
                  onChange={(e) =>
                    setScene((prev) => ({ ...prev, primaryColor: e.target.value }))
                  }
                  className="h-6 w-8 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-white">{scene.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                Rim / Secondary Color
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-2.5 py-1.5">
                <input
                  type="color"
                  value={scene.secondaryColor}
                  onChange={(e) =>
                    setScene((prev) => ({
                      ...prev,
                      secondaryColor: e.target.value,
                    }))
                  }
                  className="h-6 w-8 cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-white">
                  {scene.secondaryColor}
                </span>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-1">
            {[
              {
                label: "Rotation Speed X",
                val: scene.rotationSpeedX,
                min: 0,
                max: 2.5,
                step: 0.05,
                onChange: (v: number) =>
                  setScene((p) => ({ ...p, rotationSpeedX: v })),
              },
              {
                label: "Rotation Speed Y",
                val: scene.rotationSpeedY,
                min: 0,
                max: 2.5,
                step: 0.05,
                onChange: (v: number) =>
                  setScene((p) => ({ ...p, rotationSpeedY: v })),
              },
              {
                label: "Vertex Explode / Morph",
                val: scene.explodeFactor,
                min: 0,
                max: 0.65,
                step: 0.01,
                onChange: (v: number) =>
                  setScene((p) => ({ ...p, explodeFactor: v })),
              },
              {
                label: "Camera Zoom / Scale",
                val: scene.scale,
                min: 0.6,
                max: 1.6,
                step: 0.05,
                onChange: (v: number) => setScene((p) => ({ ...p, scale: v })),
              },
              {
                label: "Bloom Glow Intensity",
                val: scene.bloomIntensity,
                min: 0.1,
                max: 1.5,
                step: 0.05,
                onChange: (v: number) =>
                  setScene((p) => ({ ...p, bloomIntensity: v })),
              },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs text-white/75 mb-1">
                  <span>{s.label}</span>
                  <span className="font-mono text-sky-300">{s.val.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={s.val}
                  onChange={(e) => s.onChange(parseFloat(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                3D Page Headline
              </label>
              <input
                type="text"
                value={scene.headline}
                onChange={(e) =>
                  setScene((prev) => ({ ...prev, headline: e.target.value }))
                }
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                HUD Telemetry Badge Text
              </label>
              <input
                type="text"
                value={scene.badgeText}
                onChange={(e) =>
                  setScene((prev) => ({ ...prev, badgeText: e.target.value }))
                }
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white font-mono outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {savedNotice && (
            <div className="rounded-2xl border border-emerald-400/35 bg-emerald-500/15 p-3 text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 size={15} /> Published! Your live 3D scene is now updated across the website.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
