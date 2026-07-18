const app = document.querySelector("#app");
const worldIndex = document.querySelector("#worldIndex");
const worldName = document.querySelector("#worldName");
const worldCN = document.querySelector("#worldCN");
const worldTitle = document.querySelector("#worldTitle");
const worldDescription = document.querySelector("#worldDescription");
const butterfly = document.querySelector("#butterfly");
const petals = document.querySelector("#petals");
const dust = document.querySelector("#dust");
const transition = document.querySelector("#dreamTransition");
const transitionParticles = document.querySelector("#transitionParticles");
const subpage = document.querySelector("#subpage");
const subpageWorld = document.querySelector("#subpageWorld");
const subpageTitle = document.querySelector("#subpageTitle");
const subpageBody = document.querySelector("#subpageBody");
const returnButterfly = document.querySelector("#returnButterfly");
const randomHome = document.querySelector("#randomHome");
const soundToggle = document.querySelector("#soundToggle");

// 修改点：更新资产后缀名为统一的 .jpg 格式
const worlds = [
  {
    key: "liminal",
    name: "BUFFER",
    cn: "边界之外",
    asset: "./assets/liminal.png",
    rgb: "179, 91, 255",
    hue: "288deg",
    description: "有些世界并不等待被理解。<br>它们只在你经过时，短暂地呼吸。",
    sub: "AI 影像、互动诗歌与声音碎片。这里的作品从模糊的感知开始，停留在语言尚未抵达的边缘。"
  },
  {
    key: "buffer",
    name: "ARTIFACT",
    cn: "缓冲地带",
    asset: "./assets/buffer.png",
    rgb: "255, 205, 147",
    hue: "24deg",
    description: "水面、建筑与风中的窗帘。<br>在混沌与秩序之间，等待形状出现。",
    sub: "品牌识别、视觉系统、包装与空间化表达。关于从无到有，以及让结构变得可以被感知。"
  },
  {
    key: "residue",
    name: "RESONANCE",
    cn: "声音通道",
    asset: "./assets/residue.png",
    rgb: "255, 159, 182",
    hue: "347deg",
    description: "声音还没有抵达，但通道已经被留出。<br>等待旋律、噪音与呼吸在这里发生。",
    sub: "一个留给音乐、声音作品与聆听笔记的独立通道。现在保持空白，之后再让它慢慢长出内容。"
  },
  {
    key: "afterlight",
    name: "AFTERIMAGE",
    cn: "余晖之后",
    asset: "./assets/afterlight.png",
    rgb: "205, 255, 194",
    hue: "98deg",
    description: "草地被风推成一层又一层的浪。<br>白色山丘之后，仍有光在缓慢移动。",
    sub: "创意编程、Shader、AI 实验与研究笔记。不是答案本身，而是靠近答案的途中留下的田野记录。"
  }
];

const timelineStories = {
  liminal: [
    {
      date: "2025.02",
      index: "01 / 03",
      title: "The Orphic Passage",
      type: "FILM / MOVING IMAGE",
      description: "A passage through memory, ritual and the unstable boundary between image and consciousness.",
      target: "./the-orphic-passage.html?rev=20260718-03",
      image: "./assets/liminal.png",
      coverClass: "timeline-item__image--vimeo"
    },
    {
      date: "2024.09",
      index: "02 / 03",
      title: "Liquid Noise",
      type: "AUDIO REACTIVE / WEBGL",
      description: "A fluid field that changes density through gesture, sound and bass frequency.",
      embed: "./liquid-noise-audio-reactive.html",
      target: "./liquid-noise-audio-reactive.html?rev=20260718-03",
      coverClass: "timeline-item__image--liquid"
    },
    {
      date: "2025.06",
      index: "03 / 03",
      title: "Call Me by Your Name",
      type: "INTERACTIVE POETRY / PARTICLE FIELD",
      description: "A concrete poem made from letters: held, pulled into orbit, and returned to language.",
      target: "./concrete-poem.html?rev=20260718-03",
      poem: true,
      coverClass: "timeline-item__image--poem"
    }
  ],
  buffer: [
    {
      date: "2024",
      index: "01 / 03",
      title: "PATHOS / 情绪维他命",
      type: "BRAND / PACKAGING / EMOTION",
      description: "把情绪想象成可以补充的维他命：从品牌语气、标志实验到一整套色彩鲜明的包装系统。",
      image: "./assets/portfolio/pathos-23.jpg",
      target: "./project-pathos.html?rev=20260718-04"
    },
    {
      date: "2025",
      index: "02 / 03",
      title: "DUDU4X11",
      type: "IP DESIGN / CHARACTER SYSTEM",
      description: "为 X11 建立的蓝色角色系统：从造型比例、表情语言到包装和线下物料的延展。",
      image: "./assets/portfolio/x11-04.jpg",
      target: "./project-x11.html?rev=20260718-03"
    },
    {
      date: "NEXT",
      index: "03 / 03",
      title: "Untitled / 留白",
      type: "PERSONAL PROJECT / IN DEVELOPMENT",
      description: "第三个位置暂时不需要被商业项目填满。等一个真正喜欢、愿意长期保留的作品出现。",
      placeholder: true,
      coverClass: "timeline-item__image--placeholder"
    }
  ],
  residue: [
    {
      date: "—",
      index: "01 / 03",
      title: "Listening Room",
      type: "MUSIC / OPEN CHANNEL",
      description: "为未来的音乐作品、声音片段或歌单留下的第一间空房。",
      placeholder: true
    },
    {
      date: "—",
      index: "02 / 03",
      title: "Field Recording",
      type: "SOUND / FUTURE ARCHIVE",
      description: "环境录音、微小噪声与还没有名字的声音实验。",
      placeholder: true
    },
    {
      date: "—",
      index: "03 / 03",
      title: "Unwritten Score",
      type: "MUSIC / TO BE CONTINUED",
      description: "现在保持安静。内容可以在你开始创作音乐之后再被放进来。",
      placeholder: true
    }
  ],
  afterlight: [
    {
      date: "2025.05",
      index: "01 / 03",
      title: "Float in the Flow",
      type: "VIBE CODING / INTERACTIVE TOOLS",
      description: "一个专门收藏生成器、浏览器实验与小型互动工具的入口。先从磨砂玻璃图像生成器开始。",
      image: "./assets/afterlight.png",
      target: "./vibe-lab.html?rev=20260718-06"
    },
    {
      date: "2024.07",
      index: "02 / 03",
      title: "Sound Drawing Machine",
      type: "PHYSICAL COMPUTING",
      description: "声音被翻译成轨迹，再被一支笔缓慢写到纸上。它像一段不愿被忘记的呼吸。",
      image: "./assets/buffer.png"
    },
    {
      date: "2023.10",
      index: "03 / 03",
      title: "Field of Small Things",
      type: "ARCHIVE / RESEARCH",
      description: "收集那些不足以成为事件的时刻：一片草、一阵风、一次没有结论的停留。",
      image: "./assets/liminal.png"
    }
  ]
};

let timelineState = {
  x: 0,
  targetX: 0,
  maxX: 0,
  dragging: false,
  startPointerX: 0,
  startTimelineX: 0
};

const timelineRail = document.querySelector("#timelineRail");
const timelineViewport = document.querySelector("#timelineViewport");
const timelineCounter = document.querySelector("#timelineCounter");
const timelineProgress = document.querySelector("#timelineProgress");

function buildTimeline(worldKey) {
  const stories = timelineStories[worldKey] || timelineStories.liminal;

  timelineRail.innerHTML = stories.map((story, index) => {
    const interactive = Boolean(story.target);
    const media = story.poem
        ? `<div class="timeline-item__poem-cover"><span>FLOAT</span><span>IN THE FLOW</span><i></i><b></b></div>`
      : story.placeholder
        ? `<div class="timeline-item__placeholder"><span>IN<br>FORMATION</span><i></i></div>`
        : story.embed
        ? `<iframe src="${story.embed}" title="${story.title}" loading="lazy" tabindex="-1" aria-hidden="true"></iframe>`
        : `<img src="${story.image}" alt="${story.title}">`;

    return `
      <article class="timeline-item ${interactive ? "timeline-item--link" : "timeline-item--pending"}" data-story-index="${index}" ${interactive ? `data-target="${story.target}" tabindex="0" role="link" aria-label="Open ${story.title}"` : ""}>
        ${interactive ? `<a class="timeline-item__project-link" href="${story.target}" aria-label="Open ${story.title}"></a>` : ""}
        <span class="timeline-item__marker"></span>
        <div class="timeline-item__meta">
          <span class="timeline-item__date">${story.date}</span>
          <span class="timeline-item__index">${story.index}</span>
          <h3 class="timeline-item__title">${story.title}</h3>
        </div>
        <div class="timeline-item__image ${story.coverClass || ""}">
          ${media}
          ${interactive ? `<a class="timeline-item__hit" href="${story.target}" aria-label="Open ${story.title}"></a><span class="timeline-item__enter">ENTER <b>↗</b></span>` : ""}
        </div>
        <div class="timeline-item__copy">
          <span class="timeline-item__type">${story.type}</span>
          <p class="timeline-item__description">${story.description}</p>
        </div>
      </article>
    `;
  }).join("");

  timelineState.x = 0;
  timelineState.targetX = 0;

  requestAnimationFrame(() => {
    timelineState.maxX = Math.max(0, timelineRail.scrollWidth - timelineViewport.clientWidth + window.innerWidth * 0.08);
    updateTimeline(true);
  });
}

function updateTimeline(immediate = false) {
  timelineState.targetX = Math.max(-timelineState.maxX, Math.min(0, timelineState.targetX));

  if (immediate) {
    timelineState.x = timelineState.targetX;
  } else {
    timelineState.x += (timelineState.targetX - timelineState.x) * 0.11;
  }

  timelineRail.style.transform = `translate3d(${timelineState.x}px, 0, 0)`;

  const items = [...timelineRail.querySelectorAll(".timeline-item")];
  const center = window.innerWidth * 0.56;
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.left + rect.width * 0.5;
    const distance = Math.abs(itemCenter - center);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }

    item.classList.toggle("is-active", distance < Math.min(window.innerWidth * 0.34, 420));
  });

  if (items.length) {
    timelineCounter.textContent = `${String(nearestIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
  }

  const progress = timelineState.maxX === 0 ? 0 : Math.abs(timelineState.x) / timelineState.maxX;
  timelineProgress.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
}

function timelineAnimationLoop() {
  if (subpage.classList.contains("is-open")) {
    updateTimeline();
  }
  requestAnimationFrame(timelineAnimationLoop);
}

function resetTimeline() {
  timelineState.x = 0;
  timelineState.targetX = 0;
  timelineRail.style.transform = "translate3d(0,0,0)";
}

timelineViewport.addEventListener("pointerdown", (event) => {
  if (!subpage.classList.contains("is-open")) return;
  // Project cards use a native link overlay. Do not capture their pointer,
  // otherwise the horizontal timeline steals the click before navigation.
  if (event.target.closest(".timeline-item__project-link")) return;
  timelineState.dragging = true;
  timelineState.startPointerX = event.clientX;
  timelineState.startTimelineX = timelineState.targetX;
  timelineViewport.setPointerCapture(event.pointerId);
});

timelineViewport.addEventListener("pointermove", (event) => {
  if (!timelineState.dragging) return;
  const delta = event.clientX - timelineState.startPointerX;
  timelineState.targetX = timelineState.startTimelineX + delta * 1.12;
});

timelineViewport.addEventListener("pointerup", () => {
  timelineState.dragging = false;
});

timelineViewport.addEventListener("pointercancel", () => {
  timelineState.dragging = false;
});

window.addEventListener("resize", () => {
  if (!subpage.classList.contains("is-open")) return;
  requestAnimationFrame(() => {
    timelineState.maxX = Math.max(0, timelineRail.scrollWidth - timelineViewport.clientWidth + window.innerWidth * 0.08);
    updateTimeline(true);
  });
});

timelineAnimationLoop();


let current = Math.floor(Math.random() * worlds.length);
let wheelLocked = false;
let entering = false;
let pointerNormalized = { x: 0, y: 0 };

/* ============================================================
   WEBGL SHADER ENGINE — 水波涟漪与翕动渲染核心
   ============================================================ */

const VERTEX_SHADER_SOURCE = `
  attribute vec2 position;
  varying vec2 v_uv;
  void main() {
    v_uv = position * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y; // 翻转 WebGL 坐标系 Y 轴
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_texture;
  uniform float u_time;
  uniform vec2 u_res;
  uniform vec2 u_tex_res;
  uniform vec2 u_parallax;

  // 涟漪缓冲区追踪
  uniform vec2 u_ripple_pos[6];
  uniform float u_ripple_progress[6];
  uniform float u_ripple_force[6];

  void main() {
    // 基础的 background-size: cover 纵横比计算逻辑
    // True background-size: cover mapping.
    // It samples a centered crop of the image instead of clamping stretched UVs.
    // This is especially important for portrait phones using landscape dream images.
    float screen_ratio = u_res.x / u_res.y;
    float texture_ratio = u_tex_res.x / u_tex_res.y;

    vec2 cover_scale = vec2(1.0);

    if (screen_ratio > texture_ratio) {
      // Screen is wider: crop the top and bottom of the image.
      cover_scale.y = texture_ratio / screen_ratio;
    } else {
      // Screen is taller/narrower: crop the left and right sides of the image.
      cover_scale.x = screen_ratio / texture_ratio;
    }

    vec2 base_uv = (v_uv - 0.5) * cover_scale + 0.5;
    
    // 平滑注入视差偏移
    base_uv += u_parallax * 0.012;

    // 1. 背景随机微微翕动 (Breathing Organic Wave)
    float breathe_x = sin(base_uv.y * 4.0 + u_time * 1.2) * 0.006 + cos(base_uv.x * 2.0 + u_time * 0.8) * 0.004;
    float breathe_y = cos(base_uv.x * 3.5 + u_time * 1.0) * 0.006 + sin(base_uv.y * 3.0 + u_time * 1.4) * 0.004;
    vec2 distorted_uv = base_uv + vec2(breathe_x, breathe_y);

    // 2. 鼠标动态水波涟漪 (Dynamic Fluid Ripple Propagation)
    vec2 ripple_offset = vec2(0.0);
    for (int i = 0; i < 6; i++) {
      float p = u_ripple_progress[i];
      if (p > 0.0 && p < 1.0) {
        vec2 to_click = distorted_uv - u_ripple_pos[i];
        // 修正长宽比避免圆形水波变成椭圆
        to_click.x *= (u_res.x / u_res.y);
        float d = length(to_click);
        
        float current_radius = p * 0.38; 
        float wave_width = 0.07;

        if (d < current_radius && d > current_radius - wave_width) {
          float fade = (1.0 - p) * u_ripple_force[i] * 0.65;
          float sine_wave = sin((d - current_radius) * 65.0);
          ripple_offset += normalize(distorted_uv - u_ripple_pos[i]) * sine_wave * 0.012 * fade;
        }
      }
    }
    
    distorted_uv += ripple_offset;
    distorted_uv = clamp(distorted_uv, 0.0005, 0.9995);

    gl_FragColor = texture2D(u_texture, distorted_uv);
  }
`;

class FluidRippleRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext("webgl");
    if (!this.gl) return;

    this.program = null;
    this.texture = null;
    this.imgWidth = 1920;
    this.imgHeight = 1080;
    this.time = 0;
    
    // 环形缓冲队列追踪鼠标涟漪位置
    this.ripples = Array.from({ length: 6 }, () => ({ x: 0, y: 0, progress: -1, force: 0 }));
    this.rippleIdx = 0;
    this.lastEmit = 0;

    this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.initWebGL();
    this.setupListeners();
  }

  initWebGL() {
    const gl = this.gl;
    const vs = gl.createShader(gl.VERTEX_SHADER_MODEL || gl.VERTEX_SHADER);
    gl.shaderSource(vs, VERTEX_SHADER_SOURCE);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, FRAGMENT_SHADER_SOURCE);
    gl.compileShader(fs);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  loadTexture(src) {
    const gl = this.gl;
    if (!gl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      this.imgWidth = img.width;
      this.imgHeight = img.height;
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
  }

  emitRipple(x, y, force = 1.0) {
    const now = performance.now();
    if (now - this.lastEmit < 40) return; // 节流防暴击
    this.lastEmit = now;

    const r = this.ripples[this.rippleIdx];
    r.x = x;
    r.y = y;
    r.progress = 0.0;
    r.force = force;

    this.rippleIdx = (this.rippleIdx + 1) % 6;
  }

  setupListeners() {
    window.addEventListener("resize", () => this.resize());
    this.resize();

    window.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // 当鼠标悬停在当前画布所在的可见上下文中时发出涟漪
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        const speed = Math.min(Math.hypot(e.movementX, e.movementY) * 0.08, 2.0);
        if (speed > 0.15) {
          this.emitRipple(x, y, speed);
        }
      }
    });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    const gl = this.gl;
    if (!gl) return;

    this.time += 0.016;

    // 平滑缓动视差
    this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.08;
    this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.08;

    gl.useProgram(this.program);

    // 传递基础全局 Uniforms
    gl.uniform1f(gl.getUniformLocation(this.program, "u_time"), this.time);
    gl.uniform2f(gl.getUniformLocation(this.program, "u_res"), this.canvas.width, this.canvas.height);
    gl.uniform2f(gl.getUniformLocation(this.program, "u_tex_res"), this.imgWidth, this.imgHeight);
    gl.uniform2f(gl.getUniformLocation(this.program, "u_parallax"), this.parallax.x, this.parallax.y);

    // 更新和传递追踪队列里的所有涟漪数据
    const posArr = [];
    const progArr = [];
    const forceArr = [];

    for (let i = 0; i < 6; i++) {
      const r = this.ripples[i];
      if (r.progress >= 0.0) {
        r.progress += 0.012; // 涟漪扩散速度
        if (r.progress > 1.0) r.progress = -1.0;
      }
      posArr.push(r.x, r.y);
      progArr.push(r.progress);
      forceArr.push(r.force);
    }

    gl.uniform2fv(gl.getUniformLocation(this.program, "u_ripple_pos"), new Float32Array(posArr));
    gl.uniform1fv(gl.getUniformLocation(this.program, "u_ripple_progress"), new Float32Array(progArr));
    gl.uniform1fv(gl.getUniformLocation(this.program, "u_ripple_force"), new Float32Array(forceArr));

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

// 实例化主页与子页面的 WebGL 画布效果
const homeCanvasRenderer = new FluidRippleRenderer("worldCanvas");
const subpageCanvasRenderer = new FluidRippleRenderer("subpageCanvas");

function updateRenderersParallax(mx, my) {
  homeCanvasRenderer.parallax.targetX = mx;
  homeCanvasRenderer.parallax.targetY = my;
  subpageCanvasRenderer.parallax.targetX = mx;
  subpageCanvasRenderer.parallax.targetY = my;
}

function tickWebGL() {
  homeCanvasRenderer.render();
  subpageCanvasRenderer.render();
  requestAnimationFrame(tickWebGL);
}
requestAnimationFrame(tickWebGL);


/* ============================================================
   AMBIENT & LOGIC — 原有环境逻辑与转场集成
   ============================================================ */

function createAmbient() {
  petals.innerHTML = "";
  dust.innerHTML = "";

  const petalCount = current === 0 ? 32 : current === 2 ? 23 : 15;
  const dustCount = 54;

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("i");
    const layer = i % 9 === 0 ? "front" : i % 3 === 0 ? "mid" : "far";
    petal.className = `petal petal--${layer}`;

    const isFront = layer === "front";
    const isMid = layer === "mid";
    const size = isFront ? Math.random() * 10 + 10 : isMid ? Math.random() * 7 + 6 : Math.random() * 4 + 2.5;
    const duration = isFront ? Math.random() * 6 + 7 : isMid ? Math.random() * 7 + 10 : Math.random() * 11 + 14;
    const drift = isFront ? Math.random() * 340 - 170 : Math.random() * 240 - 120;

    petal.style.left = `${Math.random() * 112 - 6}%`;
    petal.style.setProperty("--s", `${size.toFixed(1)}px`);
    petal.style.setProperty("--o", `${(isFront ? .9 : isMid ? .72 : .36).toFixed(2)}`);
    petal.style.setProperty("--d", `${duration.toFixed(1)}s`);
    petal.style.setProperty("--delay", `${(-Math.random() * duration).toFixed(1)}s`);
    petal.style.setProperty("--drift", `${drift.toFixed(0)}px`);
    petals.appendChild(petal);
  }

  for (let i = 0; i < dustCount; i++) {
    const dot = document.createElement("i");
    dot.className = "dust-dot";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.setProperty("--s", `${(Math.random() * 2.2 + .7).toFixed(1)}px`);
    dot.style.setProperty("--o", `${(Math.random() * .46 + .08).toFixed(2)}`);
    dot.style.setProperty("--d", `${(Math.random() * 7 + 5).toFixed(1)}s`);
    dot.style.setProperty("--x", `${(Math.random() * 80 - 40).toFixed(0)}px`);
    dot.style.setProperty("--y", `${(Math.random() * 58 - 29).toFixed(0)}px`);
    dust.appendChild(dot);
  }
}

function applyWorld(index, initial = false) {
  current = (index + worlds.length) % worlds.length;
  const world = worlds[current];

  app.dataset.world = current;
  app.style.setProperty("--world-rgb", world.rgb);
  butterfly.style.setProperty("--butterfly-hue", world.hue);
  returnButterfly.style.setProperty("--butterfly-hue", world.hue);

  if (!initial) {
    app.classList.add("is-changing");
    setTimeout(() => app.classList.remove("is-changing"), 560);
  }

  setTimeout(() => {
    // 注入修改：改由 WebGL 动态读取渲染图片贴图
    homeCanvasRenderer.loadTexture(world.asset);

    worldIndex.textContent = `0${current + 1} / 04`;
    worldName.textContent = world.name;
    worldCN.textContent = world.name;
    worldCN.textContent = world.cn;
    worldTitle.textContent = world.name;
    worldDescription.innerHTML = world.description;
    createAmbient();

    const curtainLayer = document.querySelector(".wind-layer--curtain");
    const grassLayer = document.querySelector(".wind-layer--grass");
    const mistLayer = document.querySelector(".mist");

    if (current === 0) {
      curtainLayer.style.display = "block";
      mistLayer.style.opacity = "0.4";
      grassLayer.style.display = "none";
    } else if (current === 3) {
      curtainLayer.style.display = "none";
      mistLayer.style.opacity = "0";
      grassLayer.style.display = "block";
    } else {
      curtainLayer.style.display = "none";
      grassLayer.style.display = "none";
      mistLayer.style.opacity = "0";
    }
  }, initial ? 0 : 180);
}

function moveWorld(direction) {
  if (wheelLocked || entering || subpage.classList.contains("is-open")) return;
  wheelLocked = true;
  applyWorld(current + direction);
  setTimeout(() => { wheelLocked = false; }, 980);
}

function createTransitionParticles() {
  transitionParticles.innerHTML = "";
  for (let i = 0; i < 52; i++) {
    const p = document.createElement("i");
    p.className = "transition-particle";
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    p.style.setProperty("--x", `${x}vw`);
    p.style.setProperty("--y", `${y}vh`);
    p.style.setProperty("--s", `${(Math.random() * 4 + 1).toFixed(1)}px`);
    p.style.setProperty("--d", `${(Math.random() * .7 + .65).toFixed(2)}s`);
    transitionParticles.appendChild(p);
  }
}

function enterWorld() {
  if (entering || subpage.classList.contains("is-open")) return;
  entering = true;
  const world = worlds[current];

  app.classList.add("butterfly-hover");
  butterfly.style.setProperty("--butterfly-scale", "1.28");
  createTransitionParticles();
  transition.classList.add("is-active");
  transition.setAttribute("aria-hidden", "false");

  // RESONANCE is a single artwork, not an archive category. Enter it directly.
  if (world.key === "residue") {
    setTimeout(() => {
      window.top.location.assign("/resonance");
    }, 420);
    return;
  }

  // Prepare the destination while the transition is still transparent. Keeping
  // this work ahead of the visible cross-fade avoids a blank/jumped frame.
  subpageCanvasRenderer.loadTexture(world.asset);
  subpage.dataset.world = world.key;
  subpageWorld.textContent = `0${current + 1} / ${world.name}`;
  subpageTitle.textContent = world.name;
  subpageBody.textContent = world.sub;
  buildTimeline(world.key);

  setTimeout(() => {
    // 注入修改：将子页面的 WebGL 贴图同步加载
    butterfly.style.opacity = "0";
    subpage.classList.add("is-open");
    subpage.setAttribute("aria-hidden", "false");
  }, 420);

  setTimeout(() => {
    transition.classList.remove("is-active");
    transition.setAttribute("aria-hidden", "true");
    entering = false;
  }, 1120);
}

function returnToRandomWorld() {
  if (entering) return;

  entering = true;
  createTransitionParticles();

  transition.classList.add("is-active", "is-returning");
  transition.setAttribute("aria-hidden", "false");
  subpage.classList.add("is-returning");

  setTimeout(() => {
    subpage.classList.remove("is-open", "is-returning");
    subpage.setAttribute("aria-hidden", "true");
    resetTimeline();

    butterfly.style.opacity = "1";
    butterfly.style.setProperty("--butterfly-scale", "1");
    app.classList.remove("butterfly-hover");

    const choices = worlds
      .map((_, index) => index)
      .filter((index) => index !== current);

    applyWorld(choices[Math.floor(Math.random() * choices.length)]);
  }, 1120);

  setTimeout(() => {
    transition.classList.remove("is-active", "is-returning");
    transition.setAttribute("aria-hidden", "true");
    entering = false;
  }, 2050);
}

let projectOpening = false;

function enterProject(target, event) {
  if (!target || projectOpening) return;
  projectOpening = true;

  const x = event?.clientX ?? window.innerWidth / 2;
  const y = event?.clientY ?? window.innerHeight / 2;
  const portal = document.createElement("div");
  portal.className = "project-blackhole";
  portal.style.setProperty("--portal-x", `${x}px`);
  portal.style.setProperty("--portal-y", `${y}px`);
  document.body.appendChild(portal);

  sessionStorage.setItem("nyanArchiveReturn", JSON.stringify({
    world: current,
    timelineX: timelineState.x
  }));

  // A fullscreen request must originate from the click itself. Starting it here
  // lets the Orphic film inherit fullscreen across the same-origin navigation.
  if (target.includes("the-orphic-passage") && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
  }

  requestAnimationFrame(() => portal.classList.add("is-opening"));

  // The href on each card remains a native fallback. This JS path only adds the intake transition.
  window.setTimeout(() => {
    window.location.assign(target);
  }, 420);
}

// Full-card native anchors remain the fallback path. This listener only adds
// the black-hole intake; it never depends on iframe clicks or drag capture.
timelineRail.addEventListener("click", (event) => {
  const link = event.target.closest(".timeline-item__project-link");
  if (!link) return;
  event.preventDefault();
  enterProject(link.href, event);
});

timelineRail.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const item = event.target.closest(".timeline-item--link");
  if (!item) return;
  event.preventDefault();
  const link = item.querySelector(".timeline-item__project-link");
  enterProject(link ? link.href : item.dataset.target, event);
});

window.addEventListener("wheel", (event) => {
  event.preventDefault();

  if (subpage.classList.contains("is-open")) {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

    timelineState.targetX -= delta * 1.08;
    return;
  }

  if (Math.abs(event.deltaY) < 8) return;
  moveWorld(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

window.addEventListener("keydown", (event) => {
  if (subpage.classList.contains("is-open")) {
    if (event.key === "Escape") returnToRandomWorld();
    return;
  }
  if (event.key === "ArrowDown" || event.key === "ArrowRight") moveWorld(1);
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") moveWorld(-1);
  if (event.key === "Enter") enterWorld();
});

window.addEventListener("mousemove", (event) => {
  const mx = (event.clientX / window.innerWidth - .5) * 2;
  const my = (event.clientY / window.innerHeight - .5) * 2;
  app.style.setProperty("--pointer-x", `${mx * -10}px`);
  app.style.setProperty("--pointer-y", `${my * -7}px`);
  
  // 更新着色器专用的平滑视差变量
  updateRenderersParallax(mx, my);
});

butterfly.addEventListener("mouseenter", () => app.classList.add("butterfly-hover"));
butterfly.addEventListener("mouseleave", () => app.classList.remove("butterfly-hover"));
butterfly.addEventListener("click", enterWorld);

returnButterfly.addEventListener("click", returnToRandomWorld);
randomHome.addEventListener("click", (event) => {
  event.preventDefault();
  if (subpage.classList.contains("is-open")) returnToRandomWorld();
  else {
    const next = Math.floor(Math.random() * worlds.length);
    applyWorld(next);
  }
});

soundToggle.addEventListener("click", () => {
  const nextState = soundToggle.getAttribute("aria-pressed") !== "true";
  soundToggle.setAttribute("aria-pressed", String(nextState));
  document.querySelector("#soundState").textContent = nextState ? "ON" : "OFF";
});

const savedReturn = (() => {
  try { return JSON.parse(sessionStorage.getItem("nyanArchiveReturn") || "null"); }
  catch { return null; }
})();

if (savedReturn && Number.isInteger(savedReturn.world)) current = savedReturn.world;
applyWorld(current, true);
createAmbient();

window.addEventListener("pageshow", (event) => {
  projectOpening = false;
  document.querySelector(".project-blackhole")?.remove();
  if (!event.persisted) return;
  requestAnimationFrame(() => updateTimeline(true));
});

if (!homeCanvasRenderer.gl || !subpageCanvasRenderer.gl) {
  console.warn("WebGL unavailable: background shader will not render in this browser.");
}
