import React, { useEffect, useRef, useState } from "react";
import {
  type Geometry3DType,
  type Scene3DConfig,
  getScene3DConfig,
} from "@/lib/business-store";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Face3D {
  indices: number[];
  normal?: Vec3;
  ringGroup?: number;
}

interface MeshData {
  vertices: Vec3[];
  edges: [number, number][];
  faces: Face3D[];
}

function generateMesh(type: Geometry3DType): MeshData {
  const vertices: Vec3[] = [];
  const edges: [number, number][] = [];
  const faces: Face3D[] = [];

  if (type === "torus-knot") {
    const p = 2;
    const q = 3;
    const tubularSegments = 48;
    const radialSegments = 8;
    const radius = 115;
    const tube = 32;

    const centerPoints: Vec3[] = [];
    for (let i = 0; i < tubularSegments; i++) {
      const u = (i / tubularSegments) * Math.PI * 2 * p;
      const cu = Math.cos(u);
      const su = Math.sin(u);
      const quOverP = (q / p) * u;
      const cs = Math.cos(quOverP);
      const r = radius * (2 + cs) * 0.42;
      centerPoints.push({
        x: r * cu,
        y: r * su,
        z: radius * Math.sin(quOverP) * 0.48,
      });
    }

    for (let i = 0; i < tubularSegments; i++) {
      const curr = centerPoints[i];
      const next = centerPoints[(i + 1) % tubularSegments];
      const tang = normalize({
        x: next.x - curr.x,
        y: next.y - curr.y,
        z: next.z - curr.z,
      });
      const up = { x: 0, y: 0, z: 1 };
      let norm = cross(tang, up);
      if (lengthVec(norm) < 0.01) norm = { x: 1, y: 0, z: 0 };
      norm = normalize(norm);
      const binorm = normalize(cross(tang, norm));

      for (let j = 0; j < radialSegments; j++) {
        const v = (j / radialSegments) * Math.PI * 2;
        const cx = -tube * Math.cos(v);
        const cy = tube * Math.sin(v);
        vertices.push({
          x: curr.x + cx * norm.x + cy * binorm.x,
          y: curr.y + cx * norm.y + cy * binorm.y,
          z: curr.z + cx * norm.z + cy * binorm.z,
        });
      }
    }

    for (let i = 0; i < tubularSegments; i++) {
      const nextI = (i + 1) % tubularSegments;
      for (let j = 0; j < radialSegments; j++) {
        const nextJ = (j + 1) % radialSegments;
        const a = i * radialSegments + j;
        const b = nextI * radialSegments + j;
        const c = nextI * radialSegments + nextJ;
        const d = i * radialSegments + nextJ;
        edges.push([a, b], [a, d]);
        faces.push({ indices: [a, b, c, d], ringGroup: i % 3 });
      }
    }
    return { vertices, edges, faces };
  }

  if (type === "icosahedron-core") {
    const t = (1 + Math.sqrt(5)) / 2;
    const s = 92;
    const rawVerts = [
      [-1, t, 0],
      [1, t, 0],
      [-1, -t, 0],
      [1, -t, 0],
      [0, -1, t],
      [0, 1, t],
      [0, -1, -t],
      [0, 1, -t],
      [t, 0, -1],
      [t, 0, 1],
      [-t, 0, -1],
      [-t, 0, 1],
    ];
    rawVerts.forEach(([x, y, z]) => {
      vertices.push({ x: x * s, y: y * s, z: z * s });
    });
    // Add inner core vertices
    rawVerts.forEach(([x, y, z]) => {
      vertices.push({ x: x * s * 0.52, y: y * s * 0.52, z: z * s * 0.52 });
    });

    const icoFaces = [
      [0, 11, 5],
      [0, 5, 1],
      [0, 1, 7],
      [0, 7, 10],
      [0, 10, 11],
      [1, 5, 9],
      [5, 11, 4],
      [11, 10, 2],
      [10, 7, 6],
      [7, 1, 8],
      [3, 9, 4],
      [3, 4, 2],
      [3, 2, 6],
      [3, 6, 8],
      [3, 8, 9],
      [4, 9, 5],
      [2, 4, 11],
      [6, 2, 10],
      [8, 6, 7],
      [9, 8, 1],
    ];

    icoFaces.forEach((f, idx) => {
      faces.push({ indices: f, ringGroup: idx % 2 });
      edges.push([f[0], f[1]], [f[1], f[2]], [f[2], f[0]]);
    });
    for (let i = 0; i < 12; i++) {
      edges.push([i, i + 12]);
    }
    return { vertices, edges, faces };
  }

  if (type === "dna-helix") {
    const rungs = 28;
    const radius = 105;
    const height = 310;
    for (let i = 0; i < rungs; i++) {
      const t = i / (rungs - 1);
      const angle = t * Math.PI * 4.5;
      const y = (t - 0.5) * height;
      const idxA = vertices.length;
      vertices.push({
        x: Math.cos(angle) * radius,
        y,
        z: Math.sin(angle) * radius,
      });
      const idxB = vertices.length;
      vertices.push({
        x: Math.cos(angle + Math.PI) * radius,
        y,
        z: Math.sin(angle + Math.PI) * radius,
      });
      // Midpoint node on rung
      const idxMid = vertices.length;
      vertices.push({ x: 0, y, z: 0 });
      edges.push([idxA, idxMid], [idxMid, idxB]);
      if (i > 0) {
        edges.push([idxA - 3, idxA], [idxB - 3, idxB]);
        faces.push({
          indices: [idxA - 3, idxA, idxMid, idxMid - 3],
          ringGroup: 0,
        });
        faces.push({
          indices: [idxMid - 3, idxMid, idxB, idxB - 3],
          ringGroup: 1,
        });
      }
    }
    return { vertices, edges, faces };
  }

  if (type === "gyro-rings") {
    const rings = [
      { r: 165, tube: 12, tiltX: 0.2, tiltZ: 0.1, group: 0 },
      { r: 125, tube: 11, tiltX: 1.1, tiltZ: 0.6, group: 1 },
      { r: 86, tube: 10, tiltX: -0.8, tiltZ: 1.2, group: 2 },
    ];
    const segU = 32;
    const segV = 6;
    rings.forEach((ring) => {
      const baseOffset = vertices.length;
      for (let i = 0; i < segU; i++) {
        const u = (i / segU) * Math.PI * 2;
        for (let j = 0; j < segV; j++) {
          const v = (j / segV) * Math.PI * 2;
          const x0 = (ring.r + ring.tube * Math.cos(v)) * Math.cos(u);
          const y0 = ring.tube * Math.sin(v);
          const z0 = (ring.r + ring.tube * Math.cos(v)) * Math.sin(u);
          const p = rotatePoint({ x: x0, y: y0, z: z0 }, ring.tiltX, 0, ring.tiltZ);
          vertices.push(p);
        }
      }
      for (let i = 0; i < segU; i++) {
        const ni = (i + 1) % segU;
        for (let j = 0; j < segV; j++) {
          const nj = (j + 1) % segV;
          const a = baseOffset + i * segV + j;
          const b = baseOffset + ni * segV + j;
          const c = baseOffset + ni * segV + nj;
          const d = baseOffset + i * segV + nj;
          edges.push([a, b], [a, d]);
          faces.push({ indices: [a, b, c, d], ringGroup: ring.group });
        }
      }
    });
    return { vertices, edges, faces };
  }

  if (type === "crystal-cluster") {
    const crystals = [
      { h: 185, r: 58, tx: 0, ty: 0, tz: 0, rx: 0.1, rz: 0.05, group: 0 },
      { h: 130, r: 38, tx: 65, ty: 20, tz: 30, rx: 0.3, rz: -0.45, group: 1 },
      { h: 120, r: 36, tx: -60, ty: 25, tz: -25, rx: -0.25, rz: 0.5, group: 2 },
      { h: 95, r: 28, tx: 20, ty: 35, tz: -65, rx: 0.45, rz: 0.2, group: 1 },
    ];
    const sides = 6;
    crystals.forEach((cr) => {
      const base = vertices.length;
      const topTip = rotatePoint({ x: 0, y: -cr.h, z: 0 }, cr.rx, 0, cr.rz);
      const botTip = rotatePoint({ x: 0, y: cr.h * 0.7, z: 0 }, cr.rx, 0, cr.rz);
      vertices.push({ x: topTip.x + cr.tx, y: topTip.y + cr.ty, z: topTip.z + cr.tz });
      vertices.push({ x: botTip.x + cr.tx, y: botTip.y + cr.ty, z: botTip.z + cr.tz });

      for (let i = 0; i < sides; i++) {
        const a = (i / sides) * Math.PI * 2;
        const ringPt = rotatePoint(
          { x: Math.cos(a) * cr.r, y: -cr.h * 0.15, z: Math.sin(a) * cr.r },
          cr.rx,
          0,
          cr.rz,
        );
        vertices.push({
          x: ringPt.x + cr.tx,
          y: ringPt.y + cr.ty,
          z: ringPt.z + cr.tz,
        });
      }

      for (let i = 0; i < sides; i++) {
        const curr = base + 2 + i;
        const next = base + 2 + ((i + 1) % sides);
        edges.push([base, curr], [base + 1, curr], [curr, next]);
        faces.push({ indices: [base, curr, next], ringGroup: cr.group });
        faces.push({ indices: [base + 1, next, curr], ringGroup: cr.group });
      }
    });
    return { vertices, edges, faces };
  }

  if (type === "hypercube") {
    const sOuter = 125;
    const sInner = 64;
    const cubeCoords = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];
    cubeCoords.forEach(([x, y, z]) =>
      vertices.push({ x: x * sOuter, y: y * sOuter, z: z * sOuter }),
    );
    cubeCoords.forEach(([x, y, z]) =>
      vertices.push({ x: x * sInner, y: y * sInner, z: z * sInner }),
    );
    const cubeEdges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];
    cubeEdges.forEach(([a, b]) => {
      edges.push([a, b], [a + 8, b + 8]);
      faces.push({ indices: [a, b, b + 8, a + 8], ringGroup: 1 });
    });
    for (let i = 0; i < 8; i++) {
      edges.push([i, i + 8]);
    }
    return { vertices, edges, faces };
  }

  // Default: wave-sphere
  const latBands = 14;
  const lonBands = 24;
  const radius = 145;
  for (let lat = 0; lat <= latBands; lat++) {
    const theta = (lat * Math.PI) / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    for (let lon = 0; lon < lonBands; lon++) {
      const phi = (lon * 2 * Math.PI) / lonBands;
      const rMod = radius + Math.sin(theta * 4 + phi * 3) * 14;
      vertices.push({
        x: rMod * Math.cos(phi) * sinTheta,
        y: rMod * cosTheta,
        z: rMod * Math.sin(phi) * sinTheta,
      });
    }
  }
  for (let lat = 0; lat < latBands; lat++) {
    for (let lon = 0; lon < lonBands; lon++) {
      const nextLon = (lon + 1) % lonBands;
      const first = lat * lonBands + lon;
      const second = (lat + 1) * lonBands + lon;
      const third = (lat + 1) * lonBands + nextLon;
      const fourth = lat * lonBands + nextLon;
      edges.push([first, second], [first, fourth]);
      faces.push({ indices: [first, second, third, fourth], ringGroup: lat % 2 });
    }
  }
  return { vertices, edges, faces };
}

function lengthVec(v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function normalize(v: Vec3): Vec3 {
  const len = lengthVec(v) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function rotatePoint(p: Vec3, rx: number, ry: number, rz: number): Vec3 {
  // Rotate X
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = p.y * cosX - p.z * sinX;
  const z1 = p.y * sinX + p.z * cosX;

  // Rotate Y
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = p.x * cosY + z1 * sinY;
  const z2 = -p.x * sinY + z1 * cosY;

  // Rotate Z
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.replace(/(.)/g, "$1$1") : clean, 16) || 0x38bdf8;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

interface Interactive3DCanvasProps {
  config?: Scene3DConfig;
  heightClass?: string;
  interactiveControls?: boolean;
  compactHud?: boolean;
  onSelectKeyframe?: (kf: Scene3DConfig["keyframes"][number]) => void;
}

export function Interactive3DCanvas({
  config: externalConfig,
  heightClass = "h-[520px]",
  interactiveControls = true,
  compactHud = false,
  onSelectKeyframe,
}: Interactive3DCanvasProps) {
  const [liveConfig, setLiveConfig] = useState<Scene3DConfig>(() =>
    externalConfig ?? getScene3DConfig(),
  );
  const [activeKeyframeId, setActiveKeyframeId] = useState<string>("kf-1");
  const [fps, setFps] = useState(60);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    rotX: 0.35,
    rotY: 0.65,
    rotZ: 0.1,
    mouseX: 0,
    mouseY: 0,
    zoom: 1,
  });

  useEffect(() => {
    if (externalConfig) {
      setLiveConfig(externalConfig);
    }
  }, [externalConfig]);

  useEffect(() => {
    if (externalConfig) return;
    const handleStorageUpdate = () => {
      setLiveConfig(getScene3DConfig());
    };
    window.addEventListener("jt-store-updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("jt-store-updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [externalConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mesh = generateMesh(liveConfig.geometry);

    // Generate 3D ambient particle cloud
    const particles = Array.from({ length: Math.min(260, liveConfig.particleCount) }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(1, liveConfig.particleCount));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const rad = 210 + (i % 7) * 32;
      return {
        x: rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.cos(phi),
        z: rad * Math.sin(phi) * Math.sin(theta),
        size: 1 + (i % 3) * 0.85,
        phase: i * 0.37,
      };
    });

    let animId = 0;
    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsTimer = performance.now();
    let isVisible = true;
    let cachedWidth = canvas.clientWidth || 520;
    let cachedHeight = canvas.clientHeight || 460;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const syncCanvasSize = () => {
      cachedWidth = canvas.clientWidth || 520;
      cachedHeight = canvas.clientHeight || 460;
      canvas.width = Math.floor(cachedWidth * dpr);
      canvas.height = Math.floor(cachedHeight * dpr);
    };
    syncCanvasSize();

    const resizeObs =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => syncCanvasSize())
        : null;
    resizeObs?.observe(canvas);

    const intersectObs =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              if (entries[0]) isVisible = entries[0].isIntersecting;
            },
            { threshold: 0.05 },
          )
        : null;
    intersectObs?.observe(canvas);

    const render = (now: number) => {
      if (!isVisible) {
        lastTime = now;
        animId = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      frameCounter++;
      if (now - fpsTimer >= 600) {
        setFps(Math.min(60, Math.round((frameCounter * 1000) / (now - fpsTimer))));
        frameCounter = 0;
        fpsTimer = now;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const w = cachedWidth;
      const h = cachedHeight;
      const cx = w / 2;
      const cy = h / 2;

      // Clear & draw spatial backdrop
      ctx.clearRect(0, 0, w, h);

      const primaryRgb = hexToRgb(liveConfig.primaryColor);
      const secondaryRgb = hexToRgb(liveConfig.secondaryColor);

      // Ambient radial glow
      const glowRadius = Math.min(w, h) * (0.48 + liveConfig.bloomIntensity * 0.18);
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, glowRadius);
      bgGrad.addColorStop(
        0,
        `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${0.22 * liveConfig.bloomIntensity})`,
      );
      bgGrad.addColorStop(
        0.55,
        `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${0.1 * liveConfig.bloomIntensity})`,
      );
      bgGrad.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Perspective floor grid if enabled
      if (liveConfig.showGridFloor) {
        ctx.save();
        ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.09)`;
        ctx.lineWidth = 1;
        const horizonY = cy + 140;
        for (let gx = -8; gx <= 8; gx++) {
          ctx.beginPath();
          ctx.moveTo(cx + gx * 28, horizonY);
          ctx.lineTo(cx + gx * 125, h + 20);
          ctx.stroke();
        }
        for (let gz = 0; gz < 6; gz++) {
          const yPos = horizonY + Math.pow(gz / 5, 1.5) * (h - horizonY);
          ctx.beginPath();
          ctx.moveTo(cx - 500, yPos);
          ctx.lineTo(cx + 500, yPos);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Advance rotation
      if (!dragRef.current.isDragging) {
        dragRef.current.rotX += dt * liveConfig.rotationSpeedX * 0.7;
        dragRef.current.rotY += dt * liveConfig.rotationSpeedY * 0.9;
        dragRef.current.rotZ += dt * liveConfig.rotationSpeedZ * 0.5;
      }

      const rx =
        dragRef.current.rotX + dragRef.current.mouseY * 0.35 * liveConfig.mouseSensitivity;
      const ry =
        dragRef.current.rotY + dragRef.current.mouseX * 0.45 * liveConfig.mouseSensitivity;
      const rz = dragRef.current.rotZ;

      const floatOffsetY = liveConfig.autoFloat ? Math.sin(now * 0.0022) * 11 : 0;
      const totalScale = liveConfig.scale * dragRef.current.zoom * Math.min(w, h) * 0.0021;
      const fov = 560;

      // Render 3D Starfield / Particles
      particles.forEach((pt) => {
        const pRot = rotatePoint(
          pt,
          rx * 0.45 * liveConfig.particleSpeed,
          ry * 0.55 * liveConfig.particleSpeed,
          rz * 0.25,
        );
        const zDepth = fov + pRot.z * totalScale;
        if (zDepth <= 40) return;
        const proj = fov / zDepth;
        const sx = cx + pRot.x * totalScale * proj;
        const sy = cy + (pRot.y * totalScale + floatOffsetY * 0.4) * proj;
        const alpha = Math.max(0.08, Math.min(0.85, (pRot.z + 260) / 520));
        ctx.fillStyle =
          pt.phase % 2 > 1
            ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${alpha})`
            : `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, pt.size * proj * 1.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Transform vertices
      const pulseWave = Math.sin(now * 0.003) * 0.04;
      const explodeAmt = liveConfig.explodeFactor + pulseWave;

      const transformedVerts = mesh.vertices.map((v) => {
        const dir = normalize(v);
        const displaced = {
          x: v.x + dir.x * explodeAmt * 85,
          y: v.y + dir.y * explodeAmt * 85,
          z: v.z + dir.z * explodeAmt * 85,
        };
        const r = rotatePoint(displaced, rx, ry, rz);
        const zCam = fov + r.z * totalScale;
        const proj = fov / Math.max(60, zCam);
        return {
          world: r,
          sx: cx + r.x * totalScale * proj,
          sy: cy + (r.y * totalScale + floatOffsetY) * proj,
          zCam,
          proj,
        };
      });

      // Directional light vector
      const lightDir = normalize({ x: 0.55, y: -0.68, z: -0.48 });
      const rimLightDir = normalize({ x: -0.7, y: 0.5, z: 0.4 });

      // Sort and draw faces (Painter's algorithm)
      if (liveConfig.material !== "neon-wireframe" && mesh.faces.length > 0) {
        const sortedFaces = mesh.faces
          .map((face) => {
            const pts = face.indices.map((idx) => transformedVerts[idx]);
            const avgZ = pts.reduce((acc, p) => acc + p.world.z, 0) / pts.length;
            const v0 = pts[0].world;
            const v1 = pts[1].world;
            const v2 = pts[2].world;
            const edge1 = { x: v1.x - v0.x, y: v1.y - v0.y, z: v1.z - v0.z };
            const edge2 = { x: v2.x - v0.x, y: v2.y - v0.y, z: v2.z - v0.z };
            const norm = normalize(cross(edge1, edge2));
            return { face, pts, avgZ, norm };
          })
          .sort((a, b) => b.avgZ - a.avgZ);

        sortedFaces.forEach(({ face, pts, norm }) => {
          const diffuse = Math.max(0.12, Math.abs(dot(norm, lightDir)));
          const rim = Math.pow(Math.max(0, 1 - Math.abs(norm.z)), 2.2);
          const spec = Math.pow(Math.max(0, dot(norm, rimLightDir)), 8);

          let fillStyle = "";
          if (liveConfig.material === "iridescent-chrome") {
            const r = Math.min(255, Math.round(primaryRgb.r * diffuse + secondaryRgb.r * rim + spec * 190));
            const g = Math.min(255, Math.round(primaryRgb.g * diffuse + secondaryRgb.g * rim + spec * 200));
            const b = Math.min(255, Math.round(primaryRgb.b * diffuse + secondaryRgb.b * rim + spec * 235));
            fillStyle = `rgba(${r}, ${g}, ${b}, 0.76)`;
          } else if (liveConfig.material === "liquid-gold") {
            const r = Math.min(255, Math.round(235 * diffuse + spec * 120));
            const g = Math.min(255, Math.round(175 * diffuse + spec * 95));
            const b = Math.min(255, Math.round(45 * diffuse + spec * 60));
            fillStyle = `rgba(${r}, ${g}, ${b}, 0.82)`;
          } else if (liveConfig.material === "frosted-glass") {
            const mix = face.ringGroup === 1 ? secondaryRgb : primaryRgb;
            fillStyle = `rgba(${mix.r}, ${mix.g}, ${mix.b}, ${0.18 + spec * 0.35})`;
          } else {
            // hologram-matrix
            fillStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${0.14 + rim * 0.35})`;
          }

          ctx.beginPath();
          ctx.moveTo(pts[0].sx, pts[0].sy);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].sx, pts[i].sy);
          }
          ctx.closePath();
          ctx.fillStyle = fillStyle;
          ctx.fill();

          if (liveConfig.wireframeOverlay) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.14 + spec * 0.35})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        });
      }

      // Draw wireframe edges when in neon-wireframe or hologram-matrix mode
      if (
        liveConfig.material === "neon-wireframe" ||
        liveConfig.material === "hologram-matrix" ||
        (liveConfig.wireframeOverlay && mesh.faces.length === 0)
      ) {
        ctx.lineWidth = liveConfig.material === "neon-wireframe" ? 1.35 : 0.75;
        mesh.edges.forEach(([iA, iB], idx) => {
          const pA = transformedVerts[iA];
          const pB = transformedVerts[iB];
          if (!pA || !pB) return;
          const depthAlpha = Math.max(0.15, Math.min(0.9, 1 - (pA.world.z + 180) / 420));
          const col = idx % 2 === 0 ? primaryRgb : secondaryRgb;
          ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${depthAlpha})`;
          ctx.beginPath();
          ctx.moveTo(pA.sx, pA.sy);
          ctx.lineTo(pB.sx, pB.sy);
          ctx.stroke();
        });
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      resizeObs?.disconnect();
      intersectObs?.disconnect();
    };
  }, [liveConfig]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current.isDragging = true;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current.mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    dragRef.current.mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.rotY += dx * 0.0085;
    dragRef.current.rotX += dy * 0.0085;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  const triggerKeyframe = (kf: Scene3DConfig["keyframes"][number]) => {
    setActiveKeyframeId(kf.id);
    setLiveConfig((prev) => ({
      ...prev,
      geometry: kf.geometry,
      explodeFactor: kf.explodeFactor,
      scale: kf.scale,
      primaryColor: kf.primaryColor,
      secondaryColor: kf.secondaryColor,
    }));
    onSelectKeyframe?.(kf);
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-white/15 bg-[#040611] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] select-none ${heightClass}`}
    >
      {/* Brushed specular top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="h-full w-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Top HUD Telemetry Bar */}
      {liveConfig.showHudTelemetry && (
        <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3.5 py-1.5 backdrop-blur-md">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: liveConfig.primaryColor }}
            />
            <span className="font-mono text-[11px] tracking-widest uppercase text-white/85">
              {liveConfig.badgeText}
            </span>
          </div>

          {!compactHud && (
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase text-white/60">
              <span className="rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-md">
                GEO: <strong className="text-white">{liveConfig.geometry}</strong>
              </span>
              <span className="rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-md">
                MAT: <strong className="text-white">{liveConfig.material}</strong>
              </span>
              <span className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-emerald-300 backdrop-blur-md">
                {fps} FPS
              </span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Keyframe Switcher & Interactive Controls */}
      {interactiveControls && (
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/15 bg-black/65 p-1.5 backdrop-blur-xl">
            {(liveConfig.keyframes || []).map((kf) => (
              <button
                key={kf.id}
                type="button"
                onClick={() => triggerKeyframe(kf)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  activeKeyframeId === kf.id
                    ? "bg-white text-slate-950 shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {kf.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/65 px-3 py-1.5 text-[11px] text-white/70 backdrop-blur-xl">
            <span>Drag to Orbit 360°</span>
            <span className="text-white/25">|</span>
            <button
              type="button"
              onClick={() =>
                setLiveConfig((prev) => ({
                  ...prev,
                  explodeFactor: prev.explodeFactor > 0.2 ? 0.05 : 0.42,
                }))
              }
              className="font-semibold text-sky-300 hover:text-sky-200 transition"
            >
              {liveConfig.explodeFactor > 0.2 ? "Implode Mesh" : "Explode Mesh"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
