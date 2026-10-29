var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// virtual:App.tsx
import { useState as useState6 } from "react";
import { Flow as Flow8 } from "flow-sdk";

// virtual:components/TopPipelineNav.tsx
import { useRef } from "react";

// virtual:components/SanjaLogo.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var SanjaLogo = ({ size = "md", showText = true }) => {
  const sizeMap = {
    sm: { box: "w-7 h-7", text: "text-sm", sub: "text-[9px]" },
    md: { box: "w-9 h-9", text: "text-base", sub: "text-[10px]" },
    lg: { box: "w-12 h-12", text: "text-xl", sub: "text-xs" }
  };
  const current = sizeMap[size];
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 select-none group", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative ${current.box} rounded-xl bg-gradient-to-br from-[#1c1b29] via-[#0d0c14] to-[#1e1422] p-[1.5px] shadow-lg shadow-amber-500/15 group-hover:shadow-amber-500/30 transition-all duration-300 flex items-center justify-center`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity" }),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -top-3 -right-3 w-6 h-6 bg-amber-400/20 rounded-full blur-xs" }),
            /* @__PURE__ */ jsx("div", { className: "absolute -bottom-3 -left-3 w-6 h-6 bg-rose-500/20 rounded-full blur-xs" }),
            /* @__PURE__ */ jsxs(
              "svg",
              {
                viewBox: "0 0 36 36",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                className: "w-5/6 h-5/6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",
                children: [
                  /* @__PURE__ */ jsxs("defs", { children: [
                    /* @__PURE__ */ jsxs("linearGradient", { id: "sanjaGold", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                      /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#FBBF24" }),
                      /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "#F59E0B" }),
                      /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#D97706" })
                    ] }),
                    /* @__PURE__ */ jsxs("linearGradient", { id: "sanjaNeon", x1: "0%", y1: "100%", x2: "100%", y2: "0%", children: [
                      /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#F43F5E" }),
                      /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#818CF8" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("circle", { cx: "18", cy: "18", r: "16", stroke: "#2a2a3c", strokeWidth: "1.2", strokeDasharray: "2 2", opacity: "0.6" }),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M18 3 L27 10 L25 15",
                      stroke: "url(#sanjaGold)",
                      strokeWidth: "1.2",
                      strokeLinecap: "round",
                      opacity: "0.7"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M33 18 L26 27 L21 25",
                      stroke: "url(#sanjaNeon)",
                      strokeWidth: "1.2",
                      strokeLinecap: "round",
                      opacity: "0.7"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M18 33 L9 26 L11 21",
                      stroke: "url(#sanjaGold)",
                      strokeWidth: "1.2",
                      strokeLinecap: "round",
                      opacity: "0.7"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M3 18 L10 9 L15 11",
                      stroke: "url(#sanjaNeon)",
                      strokeWidth: "1.2",
                      strokeLinecap: "round",
                      opacity: "0.7"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M23 11.5 C23 9.5 21 8.5 18 8.5 C14.5 8.5 13 10 13 12 C13 14.5 15.5 15.5 18 16.5 C21 17.5 23.5 18.8 23.5 22 C23.5 24.5 21.5 26.5 18 26.5 C13.5 26.5 12 24.2 12 22.5",
                      stroke: "url(#sanjaGold)",
                      strokeWidth: "2.8",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ jsx("circle", { cx: "18", cy: "17.5", r: "1", fill: "#fff", opacity: "0.9" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    showText && /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxs("span", { className: `font-black tracking-tight text-white ${current.text} flex items-center`, children: [
          "SANJA",
          /* @__PURE__ */ jsx("span", { className: "text-amber-400 font-extrabold ml-1", children: "DARK" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] font-mono font-semibold tracking-wider px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30", children: "STUDIO" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-zinc-400 font-mono tracking-widest text-[9px] uppercase", children: [
        /* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-emerald-400 animate-pulse" }),
        /* @__PURE__ */ jsx("span", { children: "AI Production Suite" })
      ] })
    ] })
  ] });
};

// virtual:components/TopPipelineNav.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var TopPipelineNav = ({
  currentStep,
  onSelectStep,
  assetCount,
  sceneCount,
  videoCount,
  onOpenAbout,
  onSaveProject,
  onLoadProjectJson
}) => {
  const fileInputRef = useRef(null);
  const steps = [
    { key: "script", label: "1. Roteiro", icon: "edit_note" },
    { key: "assets", label: "2. Ativos & Visuais", icon: "perm_media", countBadge: assetCount },
    { key: "storyboard", label: "3. Storyboard", icon: "view_timeline", countBadge: sceneCount },
    { key: "animation", label: "4. Anima\xE7\xE3o & Timeline", icon: "movie_creation", countBadge: videoCount },
    { key: "export", label: "5. Exporta\xE7\xE3o", icon: "folder_zip" }
  ];
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (content) {
        onLoadProjectJson(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  return /* @__PURE__ */ jsxs2("header", { className: "bg-[#101016] border-b border-[#23232d] sticky top-0 z-40 px-3 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md", children: [
    /* @__PURE__ */ jsx2("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx2(SanjaLogo, { size: "md", showText: true }) }),
    /* @__PURE__ */ jsx2("nav", { className: "flex items-center gap-1 overflow-x-auto py-1 max-w-full", children: steps.map((st) => {
      const isActive = currentStep === st.key;
      return /* @__PURE__ */ jsxs2(
        "button",
        {
          onClick: () => onSelectStep(st.key),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${isActive ? "bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20" : "text-zinc-300 hover:text-white hover:bg-[#1a1a24]"}`,
          children: [
            /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[17px]", children: st.icon }),
            /* @__PURE__ */ jsx2("span", { children: st.label }),
            typeof st.countBadge === "number" && st.countBadge > 0 && /* @__PURE__ */ jsx2(
              "span",
              {
                className: `text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? "bg-black text-amber-300" : "bg-[#252535] text-zinc-300"}`,
                children: st.countBadge
              }
            )
          ]
        },
        st.key
      );
    }) }),
    /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx2(
        "input",
        {
          type: "file",
          ref: fileInputRef,
          onChange: handleFileChange,
          accept: ".json",
          className: "hidden"
        }
      ),
      /* @__PURE__ */ jsxs2(
        "button",
        {
          onClick: () => fileInputRef.current?.click(),
          className: "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white bg-[#161620] border border-[#2b2b38] hover:border-amber-500/40 transition-all cursor-pointer",
          title: "Abrir Projeto salvo em JSON",
          children: [
            /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[15px] text-indigo-400", children: "file_open" }),
            /* @__PURE__ */ jsx2("span", { className: "hidden sm:inline", children: "Abrir" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs2(
        "button",
        {
          onClick: onSaveProject,
          className: "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white bg-[#161620] border border-[#2b2b38] hover:border-amber-500/40 transition-all cursor-pointer",
          title: "Salvar Projeto atual em JSON para continuar epis\xF3dios",
          children: [
            /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[15px] text-amber-400", children: "save" }),
            /* @__PURE__ */ jsx2("span", { className: "hidden sm:inline", children: "Salvar" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs2(
        "button",
        {
          onClick: onOpenAbout,
          className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white bg-[#161620] border border-[#2b2b38] hover:border-amber-500/50 transition-all cursor-pointer",
          title: "Manual e Guia do Sanja Dark Studio",
          children: [
            /* @__PURE__ */ jsx2("span", { className: "material-symbols-outlined text-[16px] text-amber-400", children: "info" }),
            /* @__PURE__ */ jsx2("span", { className: "hidden md:inline", children: "Sobre" })
          ]
        }
      )
    ] })
  ] });
};

// virtual:components/ScriptEditorStep.tsx
import { useState } from "react";
import { Flow as Flow2 } from "flow-sdk";

// virtual:constants.ts
var VISUAL_STYLES = [
  "Cinematogr\xE1fico Ultra-Realista",
  "Anime Contempor\xE2neo",
  "Cyberpunk Neon",
  "Fantasia Sombria",
  "Aquarela Expressiva",
  "Vintage 35mm Retr\xF4",
  "Anima\xE7\xE3o 3D Pixar Style",
  "Fic\xE7\xE3o Cient\xEDfica Hiper-detalhada"
];
var ASPECT_RATIOS = [
  { value: "9:16", label: "9:16 Vertical (Shorts, Reels, TikTok)", icon: "crop_portrait" },
  { value: "16:9", label: "16:9 Horizontal (YouTube, Cinema)", icon: "crop_16_9" }
];
var DRAMA_GENRES = [
  {
    type: "Drama Familiar",
    title: "Drama Familiar",
    explanation: "Focado em dilemas de sangue, segredos guardados entre pais e filhos, heran\xE7as disputadas e reconcilia\xE7\xF5es dif\xEDceis.",
    defaultKeywords: ["heran\xE7a", "d\xEDvida de honra", "irm\xE3os rivais", "perd\xE3o tardio", "segredo de fam\xEDlia", "patriarca autorit\xE1rio"]
  },
  {
    type: "Drama Psicol\xF3gico",
    title: "Drama Psicol\xF3gico",
    explanation: "Explora conflitos internos intensos, obsess\xF5es, culpa, dilemas morais profundos e a fragilidade da mente humana.",
    defaultKeywords: ["culpa obsessiva", "alucina\xE7\xE3o", "dupla identidade", "dilema \xE9tico", "isolamento", "paranoia"]
  },
  {
    type: "Melodrama / Novela",
    title: "Melodrama / Novela",
    explanation: "Emo\xE7\xF5es \xE0 flor da pele, grandes contrastes sociais (o rico e o humilde), reviravoltas no casamento e justi\xE7a po\xE9tica.",
    defaultKeywords: ["humilha\xE7\xE3o inicial", "riqueza inesperada", "falsa identidade", "vil\xE3 manipuladora", "triunfo moral", "revela\xE7\xE3o no altar"]
  },
  {
    type: "Drama Policial & Investigativo",
    title: "Drama Policial & Investigativo",
    explanation: "Tens\xF5es sobre \xE9tica na lei, corrup\xE7\xE3o, falso culpado e busca obstinada pela verdade custe o que custar.",
    defaultKeywords: ["falso culpado", "dossi\xEA secreto", "testemunha chave", "trai\xE7\xE3o policial", "vingan\xE7a fria", "interrogat\xF3rio"]
  },
  {
    type: "Drama de \xC9poca / Hist\xF3rico",
    title: "Drama de \xC9poca / Hist\xF3rico",
    explanation: "Ambientado em momentos marcantes do passado com rigor est\xE9tico, costumes severos e conflitos de classe.",
    defaultKeywords: ["tradi\xE7\xE3o colonial", "revolu\xE7\xE3o", "casamento arranjado", "honra do nome", "cartas secretas", "diferen\xE7a de classes"]
  },
  {
    type: "Drama Social & Supera\xE7\xE3o",
    title: "Drama Social & Supera\xE7\xE3o",
    explanation: "Jornadas de pessoas comuns enfrentando desigualdades, trabalho duro, dignidade e conquista de respeito.",
    defaultKeywords: ["da lama ao topo", "dignidade de trabalhador", "segunda chance", "preconceito superado", "comunidade unida", "triunfo"]
  },
  {
    type: "Trag\xE9dia e Consequ\xEAncia",
    title: "Trag\xE9dia e Consequ\xEAncia",
    explanation: "Uma escolha errada ou gan\xE2ncia desenfreada gera uma espiral de perda e destino implac\xE1vel.",
    defaultKeywords: ["ambi\xE7\xE3o cega", "pacto arriscado", "ponto sem retorno", "ru\xEDna financeira", "orgulho ferido", "pre\xE7o alto"]
  },
  {
    type: "Romance Dram\xE1tico",
    title: "Romance Dram\xE1tico",
    explanation: "Amores intensos marcados pela dist\xE2ncia, oposi\xE7\xE3o familiar ou sacrif\xEDcios extremos de vida.",
    defaultKeywords: ["amor proibido", "sacrif\xEDcio m\xFAtuo", "reencontro anos depois", "despedida dolorosa", "promessa inquebr\xE1vel"]
  }
];
var NARRATIVE_STRUCTURES = [
  {
    value: "Par\xE1bola de contraste",
    label: "Par\xE1bola de contraste",
    description: "Dois caminhos opostos, cortes alternados, status contrastante e consequ\xEAncia forte."
  },
  {
    value: "Ascens\xE3o e queda",
    label: "Ascens\xE3o e queda",
    description: "Ambi\xE7\xE3o desmedida, conquista e ru\xEDna visual implac\xE1vel."
  },
  {
    value: "Vingan\xE7a e virada",
    label: "Vingan\xE7a e virada",
    description: "Injusti\xE7a inicial, prepara\xE7\xE3o silenciosa e reviravolta no \xFAltimo ter\xE7o."
  },
  {
    value: "Segredo revelado",
    label: "Segredo revelado",
    description: "Uma verdade oculta sob tens\xE3o que explode e muda tudo."
  },
  {
    value: "Injusti\xE7a e recompensa",
    label: "Injusti\xE7a e recompensa",
    description: "Humilha\xE7\xE3o superada com trabalho, honra e triunfo p\xFAblico."
  },
  {
    value: "Mist\xE9rio",
    label: "Mist\xE9rio",
    description: "Pistas conectadas, suspeitas crescentes e resolu\xE7\xE3o impactante."
  },
  {
    value: "Romance proibido",
    label: "Romance proibido",
    description: "Dois mundos incompat\xEDveis, riscos e sacrif\xEDcio m\xFAtuo."
  },
  {
    value: "Supera\xE7\xE3o",
    label: "Supera\xE7\xE3o",
    description: "Adversidade extrema, teste de car\xE1ter e reden\xE7\xE3o \xE9pica."
  },
  {
    value: "Personalizada",
    label: "Personalizada",
    description: "Estrutura livre definida pelo tema ou roteiro colado."
  }
];
var WORD_LIMITS_BY_DURATION = {
  4: 9,
  6: 14,
  8: 18,
  10: 23
};
var CATEGORIES = [
  "Hist\xF3ria e Sociedade",
  "Drama e Conflito Humano",
  "Fic\xE7\xE3o Cient\xEDfica",
  "Suspense e Mist\xE9rio",
  "Fantasia \xC9pica",
  "Aventura e Explora\xE7\xE3o",
  "Terror Psicol\xF3gico",
  "Supera\xE7\xE3o e Vida Real"
];
var SUBGENRES_BY_CATEGORY = {
  "Hist\xF3ria e Sociedade": ["Conflito de Gera\xE7\xF5es", "Heran\xE7a & Terra", "Ascens\xE3o Social", "Cr\xF4nica de \xC9poca"],
  "Drama e Conflito Humano": ["Dilema Familiar", "Trai\xE7\xE3o de Confian\xE7a", "Rivalidade Entre Irm\xE3os", "D\xEDvida de Honra"],
  "Fic\xE7\xE3o Cient\xEDfica": ["Viagem no Tempo", "Intelig\xEAncia Artificial", "P\xF3s-Apocal\xEDptico", "Coloniza\xE7\xE3o"],
  "Suspense e Mist\xE9rio": ["Conspira\xE7\xE3o Secreta", "Crime Passional", "Investiga\xE7\xE3o Noturna", "Falso Culpado"],
  "Fantasia \xC9pica": ["Reino Dividido", "Pacto Sombrio", "Destino Marcado", "Batalha pela Sucess\xE3o"],
  "Aventura e Explora\xE7\xE3o": ["Sobreviv\xEAncia Extrema", "Ouro Perdido", "Rota Perigosa", "Descoberta"],
  "Terror Psicol\xF3gico": ["Isolamento Rural", "Culpa Obsessiva", "Vozes da Escurid\xE3o", "Presen\xE7a Inquieta"],
  "Supera\xE7\xE3o e Vida Real": ["Da Mis\xE9ria ao Sucesso", "Reconstru\xE7\xE3o", "Gratid\xE3o e Retorno", "Voz da Justi\xE7a"]
};
var SHOT_TYPES = [
  "Plano Geral (Wide)",
  "Plano M\xE9dio (Medium)",
  "Primeiro Plano (Close-up)",
  "Plano Detalhe (Extreme Close-up)",
  "Plano Sequ\xEAncia A\xE9reo"
];
var CAMERA_MOVEMENTS = [
  "Est\xE1tico",
  "Panor\xE2mica Lenta",
  "Dolly In / Zoom Suave",
  "Travelling Lateral",
  "C\xE2mera na M\xE3o / Din\xE2mico"
];
var DEFAULT_IMAGE_MODEL = "\u{1F34C} Nano Banana Pro";
var VIDEO_MODELS_CAPABILITIES = {
  "Omni 1.1 Flash": {
    displayName: "Omni 1.1 Flash",
    badge: "Padr\xE3o / Mais R\xE1pido",
    description: "Ideal para gera\xE7\xE3o em lote de rascunhos em 360p (4-7 cr\xE9ditos) e finaliza\xE7\xE3o em 720p com lip-sync nativo.",
    supportedDurations: [4, 6, 8, 10],
    supportedResolutions: ["360p", "720p"],
    creditCosts: {
      "4s_360p": 4,
      "4s_720p": 7,
      "6s_360p": 5,
      "6s_720p": 10,
      "8s_360p": 6,
      "8s_720p": 12,
      "10s_360p": 7,
      "10s_720p": 15
    },
    notes: "Suporta modo rascunho 360p e finaliza\xE7\xE3o em 720p em 4s, 6s, 8s e 10s."
  },
  "Veo 3.1 - Lite": {
    displayName: "Veo 3.1 - Lite",
    badge: "Econ\xF4mico HD",
    description: "Renderiza\xE7\xE3o em 720p (8s padr\xE3o: 10 cr\xE9ditos). \xD3tima f\xEDsica e coer\xEAncia cinematogr\xE1fica.",
    supportedDurations: [8],
    supportedResolutions: ["720p"],
    creditCosts: {
      "8s_720p": 10
    },
    notes: "Suporta apenas 8s em 720p no plano Pro/Plus (10 cr\xE9ditos)."
  },
  "Veo 3.1 - Fast": {
    displayName: "Veo 3.1 - Fast",
    badge: "Alta Din\xE2mica",
    description: "Movimento cinematogr\xE1fico refinado em 720p (8s: 20 cr\xE9ditos).",
    supportedDurations: [8],
    supportedResolutions: ["720p"],
    creditCosts: {
      "8s_720p": 20
    },
    notes: "Suporta 8s em 720p (20 cr\xE9ditos). N\xE3o possui modo 360p."
  },
  "Veo 3.1 - Quality": {
    displayName: "Veo 3.1 - Quality",
    badge: "Master Cinematogr\xE1fico",
    description: "Qualidade m\xE1xima de ilumina\xE7\xE3o e texturas (8s em 720p: 100 cr\xE9ditos).",
    supportedDurations: [8],
    supportedResolutions: ["720p"],
    creditCosts: {
      "8s_720p": 100
    },
    notes: "Renderiza\xE7\xE3o cinematogr\xE1fica final de alt\xEDssima fidelidade (100 cr\xE9ditos/tomada)."
  }
};
function calculateShotCredits(modelName, duration, resolution) {
  const cap = VIDEO_MODELS_CAPABILITIES[modelName] || VIDEO_MODELS_CAPABILITIES["Omni 1.1 Flash"];
  const key = `${duration}s_${resolution}`;
  if (cap.creditCosts[key] !== void 0) {
    return cap.creditCosts[key];
  }
  if (resolution === "360p" && !cap.supportedResolutions.includes("360p")) {
    return cap.creditCosts[`${duration}s_720p`] || cap.creditCosts["8s_720p"] || 10;
  }
  return 7;
}

// virtual:services/narrativeEngine.ts
import { Flow } from "flow-sdk";
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
function sanitizeJsonString(str) {
  const quoteChar = String.fromCharCode(34);
  const singleQuoteChar = String.fromCharCode(39);
  const backslashChar = String.fromCharCode(92);
  let cleaned = str.replace(/[\u201C\u201D\u00AB\u00BB]/g, quoteChar).replace(/[\u2018\u2019]/g, singleQuoteChar);
  let inString = false;
  let isEscaped = false;
  let buffer = "";
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === backslashChar && !isEscaped) {
      isEscaped = true;
      buffer += ch;
      continue;
    }
    if (ch === quoteChar && !isEscaped) {
      inString = !inString;
    }
    if (inString && (ch === "\n" || ch === "\r")) {
      buffer += backslashChar + "n";
    } else {
      buffer += ch;
    }
    if (isEscaped) {
      isEscaped = false;
    }
  }
  buffer = buffer.replace(/,\s*([}\]])/g, "$1");
  return buffer;
}
function extractStrictJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Texto vazio recebido para parse de JSON.");
  }
  const quoteChar = String.fromCharCode(34);
  const backslashChar = String.fromCharCode(92);
  let text = rawText.replace(/^```(?:json)?\s*/gim, "").replace(/```\s*$/gim, "").trim();
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  let startIndex = -1;
  let isArray = false;
  if (firstBrace === -1 && firstBracket === -1) {
    throw new Error("Nenhum bloco JSON ({ ou [) encontrado na resposta da IA.");
  }
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
    isArray = false;
  } else {
    startIndex = firstBracket;
    isArray = true;
  }
  let depth = 0;
  let inString = false;
  let isEscaped = false;
  let firstBlockEnd = -1;
  const capturedObjects = [];
  let currentObjectStart = -1;
  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];
    if (char === backslashChar && !isEscaped) {
      isEscaped = true;
      continue;
    }
    if (char === quoteChar && !isEscaped) {
      inString = !inString;
    }
    if (!inString) {
      if (char === "{" || char === "[") {
        if (depth === 0) {
          currentObjectStart = i;
        }
        depth++;
      } else if (char === "}" || char === "]") {
        depth--;
        if (depth === 0) {
          if (firstBlockEnd === -1) {
            firstBlockEnd = i;
          }
          if (currentObjectStart !== -1) {
            capturedObjects.push(text.substring(currentObjectStart, i + 1));
            currentObjectStart = -1;
          }
        }
      }
    }
    if (isEscaped) {
      isEscaped = false;
    }
  }
  if (capturedObjects.length > 1 && !isArray) {
    try {
      const sanitizedArrayStr = `[${capturedObjects.map(sanitizeJsonString).join(",")}]`;
      return JSON.parse(sanitizedArrayStr);
    } catch {
    }
  }
  if (firstBlockEnd !== -1) {
    const rawBlock = text.substring(startIndex, firstBlockEnd + 1);
    const sanitized = sanitizeJsonString(rawBlock);
    return JSON.parse(sanitized);
  }
  const fallback = sanitizeJsonString(text.substring(startIndex));
  return JSON.parse(fallback);
}
async function callAiWithStrictJsonRetry(prompt, systemRole) {
  let lastError = null;
  let lastRawText = "";
  const strictSystemInstruction = `${systemRole}
IMPORTANTE: Responda APENAS com JSON puro sem qualquer formata\xE7\xE3o adicional, texto antes ou texto depois.`;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const callPrompt = attempt === 2 ? `${prompt}
(Aten\xE7\xE3o: A resposta anterior foi truncada ou inv\xE1lida. Retorne apenas o JSON completo e sinteticamente limpo).` : prompt;
      const response = await Flow.generate.text(callPrompt, {
        systemInstruction: strictSystemInstruction
      });
      lastRawText = response?.text || "";
      if (!lastRawText.trim()) {
        throw new Error("Resposta vazia da IA.");
      }
      const parsed = extractStrictJson(lastRawText);
      return { parsed, rawResponse: lastRawText };
    } catch (err) {
      lastError = err;
      console.warn(`[Sanja Narrativa] Tentativa ${attempt} falhou:`, err?.message);
    }
  }
  const enhancedError = new Error(
    `Falha no processamento do JSON retornado pela IA (${lastError?.message || "formato inv\xE1lido"}).`
  );
  enhancedError.rawResponse = lastRawText;
  throw enhancedError;
}
function createSyntheticFoundation(idea, theme, settings) {
  const storyTitle = idea?.title || "Destino e Consequ\xEAncia";
  const storyPremise = idea?.premise || theme || "Um conflito dram\xE1tico intenso onde a verdade \xE9 posta \xE0 prova.";
  const storyHook = idea?.hook || "Primeiros 3 segundos: uma revela\xE7\xE3o chocante quebra o sil\xEAncio da sala.";
  const realism = idea?.storyRealism || settings.storyRealism || "real";
  return {
    title: storyTitle,
    logline: storyPremise,
    storyRealism: realism,
    narrativeStructure: idea?.structure || settings.narrativeStructure,
    hook: storyHook,
    centralConflict: "O confronto inevit\xE1vel entre os personagens pela honra e pela verdade.",
    ending: {
      type: "moral",
      description: "Uma conclus\xE3o marcante onde as m\xE1scaras caem e a justi\xE7a dram\xE1tica se consolida.",
      finalPunchline: "A verdade pode demorar, mas o destino cobra cada escolha."
    },
    characters: [
      {
        id: "char_1",
        name: "Carlos Mendes",
        age: 34,
        role: "protagonist",
        archetype: "Homem de Honra",
        physicalTraits: {
          face: "Rosto anguloso, olhar sincero e firme com marcas de cansa\xE7o",
          hair: "Cabelo castanho curto penteado para tr\xE1s",
          beard: "Barba por fazer bem aparada",
          physique: "Porte m\xE9dio, 1.78m, postura ereta"
        },
        fixedVisualPrompt: "Homem brasileiro na faixa dos 30 anos com fei\xE7\xF5es realistas aut\xEAnticas",
        wardrobes: [
          {
            id: "w_1",
            name: "figurino principal",
            description: "Camisa de linho clara simples sem logotipos e cal\xE7a de sarja escura"
          }
        ],
        defaultWardrobeId: "w_1",
        personality: "Determinado, focado na dignidade e na fam\xEDlia",
        voiceProfile: {
          gender: "masculino",
          ageGroup: "adulto",
          timbre: "grave e firme",
          accent: "Paulista do interior",
          rhythm: "compassado e seguro"
        },
        status: "pending"
      },
      {
        id: "char_2",
        name: "Roberto Valente",
        age: 48,
        role: "antagonist",
        archetype: "Rival Calculista",
        physicalTraits: {
          face: "Tra\xE7os severos, olhar penetrante e sorriso c\xEDnico",
          hair: "Cabelo grisalho nas t\xEAmporas bem cortado",
          beard: "Rosto liso e escanhoado",
          physique: "Porte imponente e elegante"
        },
        fixedVisualPrompt: "Homem de neg\xF3cios maduro e autorit\xE1rio",
        wardrobes: [
          {
            id: "w_2",
            name: "figurino formal",
            description: "Blazer escuro s\xF3brio sem marcas, camisa branca e cal\xE7a grafite"
          }
        ],
        defaultWardrobeId: "w_2",
        personality: "Manipulador, ambicioso e austero",
        voiceProfile: {
          gender: "masculino",
          ageGroup: "adulto",
          timbre: "autorit\xE1rio e pausado",
          accent: "Carioca neutro",
          rhythm: "firme e incisivo"
        },
        status: "pending"
      }
    ],
    locations: [
      {
        id: "loc_1",
        name: "Sala de Estar Colonial",
        fixedDescription: "Sala austera de casar\xE3o com piso de madeira nobre, mesa pesada e luz lateral forte",
        atmosphere: "Tens\xE3o dram\xE1tica, segredos velados e confronto familiar",
        lightingPalette: "Luz dourada do entardecer com sombras pronunciadas",
        timeOfDay: "Final de tarde",
        status: "pending"
      },
      {
        id: "loc_2",
        name: "Escrit\xF3rio Reservado",
        fixedDescription: "Ambiente fechado com estantes de livros antigos e luz pontual de abajur quente",
        atmosphere: "Press\xE3o moral, acusa\xE7\xF5es e revela\xE7\xF5es cruciais",
        lightingPalette: "Ilumina\xE7\xE3o focada e penumbra de fundo",
        timeOfDay: "Noite",
        status: "pending"
      }
    ],
    acts: [
      { actNumber: 1, title: "O Ponto de Partida", narrativeGoal: "O gancho dos 3 segundos e a quebra da rotina" },
      { actNumber: 2, title: "A Escalada da Tens\xE3o", narrativeGoal: "Confronto direto com respostas conectadas" },
      { actNumber: 3, title: "A Revela\xE7\xE3o Final", narrativeGoal: "Desfecho e consequ\xEAncia definitiva" }
    ]
  };
}
function normalizeStoryFoundation(raw, idea, settings) {
  const synthetic = createSyntheticFoundation(idea || null, raw?.title || "", settings || {});
  if (!raw || typeof raw !== "object") {
    return synthetic;
  }
  const title = raw.title || synthetic.title;
  const logline = raw.logline || synthetic.logline;
  const hook = raw.hook || synthetic.hook;
  const centralConflict = raw.centralConflict || synthetic.centralConflict;
  const narrativeStructure = raw.narrativeStructure || synthetic.narrativeStructure;
  const storyRealism = raw.storyRealism || synthetic.storyRealism;
  const ending = raw.ending && typeof raw.ending === "object" ? {
    type: raw.ending.type || "moral",
    description: raw.ending.description || synthetic.ending.description,
    finalPunchline: raw.ending.finalPunchline || synthetic.ending.finalPunchline
  } : synthetic.ending;
  let characters = synthetic.characters;
  if (Array.isArray(raw.characters) && raw.characters.length > 0) {
    characters = raw.characters.map((c, idx) => ({
      id: c.id || `char_${idx + 1}`,
      name: c.name || (idx === 0 ? "Protagonista" : "Antagonista"),
      age: c.age || (idx === 0 ? 32 : 46),
      role: c.role || (idx === 0 ? "protagonist" : "antagonist"),
      archetype: c.archetype || "Determinado",
      physicalTraits: {
        face: c.physicalTraits?.face || "Rosto expressivo e aut\xEAntico",
        hair: c.physicalTraits?.hair || "Cabelo escuro cl\xE1ssico",
        beard: c.physicalTraits?.beard || "Rosto alinhado",
        physique: c.physicalTraits?.physique || "Porte m\xE9dio"
      },
      fixedVisualPrompt: c.fixedVisualPrompt || `${c.name || "Personagem"}, tra\xE7os cinematogr\xE1ficos realistas`,
      wardrobes: Array.isArray(c.wardrobes) && c.wardrobes.length > 0 ? c.wardrobes : [
        { id: `w_${idx + 1}`, name: "figurino principal", description: "Roupas cotidianas lisas sem logotipos" }
      ],
      defaultWardrobeId: c.defaultWardrobeId || `w_${idx + 1}`,
      personality: c.personality || "Firme e objetivo",
      voiceProfile: {
        gender: c.voiceProfile?.gender || (idx === 0 ? "masculino" : "feminino"),
        ageGroup: c.voiceProfile?.ageGroup || "adulto",
        timbre: c.voiceProfile?.timbre || "grave e firme",
        accent: c.voiceProfile?.accent || "Paulista do interior",
        rhythm: c.voiceProfile?.rhythm || "compassado"
      },
      status: "pending"
    }));
  }
  let locations = synthetic.locations;
  if (Array.isArray(raw.locations) && raw.locations.length > 0) {
    locations = raw.locations.map((l, idx) => ({
      id: l.id || `loc_${idx + 1}`,
      name: l.name || `Cen\xE1rio ${idx + 1}`,
      fixedDescription: l.fixedDescription || "Ambiente cinematogr\xE1fico aut\xEAntico",
      atmosphere: l.atmosphere || "Tens\xE3o e profundidade narrativa",
      lightingPalette: l.lightingPalette || "Luz dourada do entardecer",
      timeOfDay: l.timeOfDay || "Final de tarde",
      status: "pending"
    }));
  }
  const acts = Array.isArray(raw.acts) && raw.acts.length > 0 ? raw.acts : synthetic.acts;
  return {
    title,
    logline,
    storyRealism,
    narrativeStructure,
    hook,
    centralConflict,
    ending,
    characters,
    locations,
    acts
  };
}
function renderScriptTextFromBible(bible) {
  const parts = [];
  const realismTag = bible.storyRealism === "real" ? "HIST\xD3RIA REAL" : "HIST\xD3RIA FICT\xCDCIA";
  parts.push(`T\xCDTULO: ${bible.title.toUpperCase()}`);
  parts.push(`NATUREZA: ${realismTag}`);
  parts.push(`LOGLINE: ${bible.logline}`);
  parts.push(`ESTRUTURA: ${bible.narrativeStructure} | FINAL: ${bible.ending.type.toUpperCase()}`);
  parts.push(`GANCHO (0-3s): "${bible.hook}"`);
  parts.push(`CONFLITO CENTRAL: ${bible.centralConflict}
`);
  parts.push(`--- PERSONAGENS ---`);
  bible.characters.forEach((c) => {
    parts.push(`\u2022 ${c.name.toUpperCase()} (${c.role}): ${c.fixedVisualPrompt}`);
  });
  parts.push("");
  parts.push(`--- LOCA\xC7\xD5ES ---`);
  bible.locations.forEach((l) => {
    parts.push(`\u2022 ${l.name}: ${l.atmosphere} [${l.fixedDescription}]`);
  });
  parts.push("");
  parts.push(`--- TOMADAS (SHOTS COM COER\xCANCIA CONTEXTUAL) ---`);
  bible.scenes.forEach((scene) => {
    parts.push(`
[CENA ${scene.sceneNumber} - ATO ${scene.actNumber}: ${scene.title}]`);
    parts.push(`Objetivo: ${scene.objective}`);
    scene.shots.forEach((shot, sIdx) => {
      parts.push(`  TOMADA ${sIdx + 1} (${shot.durationSeconds}s) | ${shot.shotType} | C\xE2m: ${shot.cameraMovement}`);
      parts.push(`  A\xE7\xE3o: ${shot.visualAction}`);
      if (shot.speakerName && shot.dialogueLine) {
        parts.push(`  ${shot.speakerName.toUpperCase()}: "${shot.dialogueLine}"`);
      } else {
        parts.push(`  (A\xE7\xE3o puramente visual / Sem fala)`);
      }
      parts.push(`  SFX: ${shot.sfxAmbience}
`);
    });
  });
  parts.push(`
--- CONCLUS\xC3O ---`);
  parts.push(`${bible.ending.description}`);
  if (bible.ending.finalPunchline) {
    parts.push(`Frase Final: "${bible.ending.finalPunchline}"`);
  }
  return parts.join("\n");
}
async function generateStoryBibleFoundation(themeOrPrompt, settings, continuationFromBible, selectedIdea) {
  const chosenTitle = selectedIdea?.title || themeOrPrompt || "Hist\xF3ria Dram\xE1tica";
  const chosenPremise = selectedIdea?.premise || settings.nicheTheme || "Conflito de honra e escolhas morais.";
  const chosenHook = selectedIdea?.hook || "Primeiros 3 segundos: revela\xE7\xE3o inesperada.";
  const realism = selectedIdea?.storyRealism || settings.storyRealism || "real";
  const genre = settings.selectedDramaGenre || "Drama Familiar";
  const structure = selectedIdea?.structure || settings.narrativeStructure || "Par\xE1bola de contraste";
  const prompt = `Escreva a base da hist\xF3ria (Story Bible) em Portugu\xEAs do Brasil estritamente baseado nesta premissa:
T\xEDtulo: "${chosenTitle}"
Premissa: "${chosenPremise}"
Gancho dos 3s: "${chosenHook}"
G\xEAnero: "${genre}" (${realism === "real" ? "Baseada em Fatos Reais" : "Fict\xEDcia"})
Palavras-chave: ${settings.keywords.join(", ")}
Estrutura: "${structure}"

Responda exclusivamente com um JSON limpo no seguinte formato:
{
  "title": "${chosenTitle.replace(/"/g, "")}",
  "logline": "Resumo em 2 frases da hist\xF3ria",
  "storyRealism": "${realism}",
  "narrativeStructure": "${structure}",
  "hook": "${chosenHook.replace(/"/g, "")}",
  "centralConflict": "Conflito central forte",
  "ending": {
    "type": "moral",
    "description": "Desfecho dram\xE1tico conclusivo",
    "finalPunchline": "Frase de impacto"
  },
  "characters": [
    {
      "id": "char_1",
      "name": "Nome Protagonista",
      "age": 32,
      "role": "protagonist",
      "archetype": "L\xEDder Determinado",
      "physicalTraits": {
        "face": "Rosto anguloso expressivo",
        "hair": "Cabelo escuro curto",
        "beard": "Barba por fazer",
        "physique": "Porte atl\xE9tico"
      },
      "fixedVisualPrompt": "Homem brasileiro na faixa dos 30 anos com olhar sincero",
      "wardrobes": [{ "id": "w_1", "name": "figurino principal", "description": "Camisa de linho clara e cal\xE7a escura sem logotipos" }],
      "defaultWardrobeId": "w_1",
      "personality": "Observador e leal",
      "voiceProfile": { "gender": "masculino", "ageGroup": "adulto", "timbre": "grave e firme", "accent": "Paulista do interior", "rhythm": "compassado" },
      "status": "pending"
    },
    {
      "id": "char_2",
      "name": "Nome Antagonista",
      "age": 46,
      "role": "antagonist",
      "archetype": "Rival",
      "physicalTraits": {
        "face": "Olhar calculista e frio",
        "hair": "Cabelo grisalho alinhado",
        "beard": "Rosto escanhoado",
        "physique": "Porte imponente"
      },
      "fixedVisualPrompt": "Homem brasileiro maduro autorit\xE1rio",
      "wardrobes": [{ "id": "w_2", "name": "figurino formal", "description": "Blazer escuro sem marcas e camisa branca" }],
      "defaultWardrobeId": "w_2",
      "personality": "Calculista",
      "voiceProfile": { "gender": "masculino", "ageGroup": "adulto", "timbre": "autorit\xE1rio", "accent": "Carioca neutro", "rhythm": "firme" },
      "status": "pending"
    }
  ],
  "locations": [
    {
      "id": "loc_1",
      "name": "Ambiente Central",
      "fixedDescription": "Cen\xE1rio cinematogr\xE1fico aut\xEAntico com ilumina\xE7\xE3o dram\xE1tica",
      "atmosphere": "Tens\xE3o e peso do passado",
      "lightingPalette": "Luz dourada com sombras longas",
      "timeOfDay": "Tarde",
      "status": "pending"
    }
  ],
  "acts": [
    { "actNumber": 1, "title": "Ato 1: O Ponto de Partida", "narrativeGoal": "Gancho inicial e quebra" },
    { "actNumber": 2, "title": "Ato 2: O Confronto", "narrativeGoal": "Escalada e respostas conectadas" },
    { actNumber: 3, "title": "Ato 3: O Desfecho", "narrativeGoal": "Resolu\xE7\xE3o e verdade" }
  ]
}`;
  try {
    const { parsed, rawResponse } = await callAiWithStrictJsonRetry(
      prompt,
      "Voc\xEA \xE9 um roteirista profissional de cinema e s\xE9ries dram\xE1ticas. Retorne APENAS JSON puro."
    );
    const normalized = normalizeStoryFoundation(parsed, selectedIdea, settings);
    return { foundation: normalized, rawResponse };
  } catch (err) {
    console.warn("[Sanja Studio] Usando funda\xE7\xE3o sint\xE9tica de alta fidelidade para n\xE3o travar o fluxo:", err?.message);
    const fallbackFoundation = createSyntheticFoundation(selectedIdea || null, themeOrPrompt, settings);
    return { foundation: fallbackFoundation, rawResponse: err?.rawResponse || JSON.stringify(fallbackFoundation) };
  }
}
async function generateShotsInBatches(foundation, settings) {
  const totalDurationSec = Math.max(30, settings.durationMinutes * 60);
  const shotDuration = settings.secondsPerShot || 6;
  const targetTotalShots = Math.max(4, Math.ceil(totalDurationSec / shotDuration));
  const maxWords = shotDuration === 4 ? 9 : shotDuration === 6 ? 14 : shotDuration === 8 ? 18 : 23;
  const prompt = `Decupe a hist\xF3ria "${foundation.title}" em EXATAMENTE ${targetTotalShots} tomadas (shots) de ${shotDuration} segundos cada.
Premissa: "${foundation.logline}"
Gancho dos 3 segundos (Obrigat\xF3rio na Tomada 1): "${foundation.hook}"
Conflito: "${foundation.centralConflict}"

Personagens dispon\xEDveis:
${foundation.characters.map((c) => `- ${c.name} (id: "${c.id}")`).join("\n")}

Loca\xE7\xE3o: ${foundation.locations[0]?.name || "Cen\xE1rio"} (id: "${foundation.locations[0]?.id || "loc_1"}")

REGRAS ESTREITAS:
1. Tomada 1 DEVE conter o gancho dos 3 segundos: "${foundation.hook}".
2. Cada tomada seguinte DEVE responder diretamente ao di\xE1logo ou a\xE7\xE3o da anterior.
3. M\xE1ximo de ${maxWords} palavras na fala por tomada.
4. Responda APENAS com um array JSON de objetos:
[
  {
    "shotId": "shot_1",
    "durationSeconds": ${shotDuration},
    "shotType": "Primeiro Plano (Close-up)",
    "cameraMovement": "Dolly In / Zoom Suave",
    "locationId": "${foundation.locations[0]?.id || "loc_1"}",
    "characterIds": ["${foundation.characters[0]?.id || "char_1"}"],
    "visualAction": "Abertura com o gancho dos 3 segundos",
    "speakerName": "${foundation.characters[0]?.name || "Protagonista"}",
    "dialogueLine": "Fala com menos de ${maxWords} palavras.",
    "emotion": "tenso",
    "voiceTone": "firme",
    "sfxAmbience": "Som ambiente natural",
    "transition": "corte seco"
  }
]`;
  let rawList = [];
  const rawResponses = [];
  try {
    const { parsed, rawResponse } = await callAiWithStrictJsonRetry(
      prompt,
      "Voc\xEA \xE9 um diretor de cinema decupando planos de c\xE2mera e di\xE1logos. Retorne apenas o array JSON."
    );
    rawResponses.push(rawResponse);
    rawList = Array.isArray(parsed) ? parsed : parsed.shots || [parsed];
  } catch (err) {
    console.warn("[Sanja Studio] Criando decupagem estruturada resiliente:", err?.message);
    rawList = Array.from({ length: targetTotalShots }).map((_, i) => ({
      shotId: `shot_${i + 1}`,
      durationSeconds: shotDuration,
      shotType: i === 0 ? "Primeiro Plano (Close-up)" : i % 2 === 0 ? "Plano M\xE9dio (Medium)" : "Primeiro Plano (Close-up)",
      cameraMovement: i === 0 ? "Dolly In / Zoom Suave" : "Est\xE1tico",
      locationId: foundation.locations[0]?.id || "loc_1",
      characterIds: [foundation.characters[i % foundation.characters.length]?.id || "char_1"],
      visualAction: i === 0 ? `Gancho de impacto imediato dos 3 segundos: ${foundation.hook}` : `Rea\xE7\xE3o dram\xE1tica e confronto direto entre os personagens`,
      speakerName: foundation.characters[i % foundation.characters.length]?.name || "Personagem",
      dialogueLine: i === 0 ? foundation.hook.slice(0, 45) : i === 1 ? "Eu sei o que voc\xEA est\xE1 escondendo de todos." : "A verdade n\xE3o vai ficar em sil\xEAncio.",
      emotion: "intenso",
      voiceTone: "firme",
      sfxAmbience: "Som ambiente cinematogr\xE1fico",
      transition: "corte seco"
    }));
  }
  const allShots = rawList.map((shot, idx) => ({
    shotId: shot.shotId || `shot_${idx + 1}`,
    durationSeconds: shot.durationSeconds || shotDuration,
    shotType: shot.shotType || "Primeiro Plano (Close-up)",
    cameraMovement: shot.cameraMovement || "Dolly In / Zoom Suave",
    locationId: shot.locationId || foundation.locations[0]?.id || "loc_1",
    characterIds: Array.isArray(shot.characterIds) && shot.characterIds.length > 0 ? shot.characterIds : [foundation.characters[0]?.id || "char_1"],
    wardrobeMap: shot.wardrobeMap || {},
    visualAction: String(shot.visualAction || "A\xE7\xE3o cinematogr\xE1fica dram\xE1tica"),
    speakerCharacterId: shot.speakerCharacterId || foundation.characters.find((c) => c.name === shot.speakerName)?.id,
    speakerName: String(shot.speakerName || ""),
    dialogueLine: String(shot.dialogueLine || ""),
    emotion: String(shot.emotion || "firme"),
    voiceTone: String(shot.voiceTone || "coloquial"),
    sfxAmbience: String(shot.sfxAmbience || "Ambi\xEAncia sonora aut\xEAntica"),
    transition: String(shot.transition || "corte"),
    imageStatus: "pending",
    videoStatus: "pending"
  }));
  const scenes = [];
  const shotsPerScene = 3;
  let currentSceneNum = 1;
  for (let i = 0; i < allShots.length; i += shotsPerScene) {
    const chunk = allShots.slice(i, i + shotsPerScene);
    const actNumber = i < allShots.length * 0.33 ? 1 : i < allShots.length * 0.67 ? 2 : 3;
    scenes.push({
      sceneId: `scene_${currentSceneNum}`,
      sceneNumber: currentSceneNum,
      actNumber,
      title: `Cena ${currentSceneNum} - Ato ${actNumber}`,
      objective: "Desenvolvimento e tens\xE3o direta",
      cause: chunk[0]?.visualAction?.slice(0, 70) || "Abertura",
      consequence: chunk[chunk.length - 1]?.dialogueLine?.slice(0, 70) || "Consequ\xEAncia",
      shots: chunk
    });
    currentSceneNum++;
  }
  return { scenes, rawResponses };
}
async function convertRawScriptToStoryBible(rawScript, settings) {
  const prompt = `Converta este roteiro para Story Bible em formato JSON:
"""
${rawScript.slice(0, 3e3)}
"""
Formato: ${settings.aspectRatio}, tomada: ${settings.secondsPerShot}s.
Responda exclusivamente com um \xFAnico objeto JSON:
{
  "title": "T\xEDtulo",
  "logline": "Logline",
  "storyRealism": "${settings.storyRealism}",
  "narrativeStructure": "${settings.narrativeStructure}",
  "hook": "Gancho inicial",
  "centralConflict": "Conflito",
  "ending": { "type": "moral", "description": "Final" },
  "characters": [
    {
      "id": "char_1",
      "name": "Nome",
      "age": 30,
      "role": "protagonist",
      "archetype": "L\xEDder",
      "physicalTraits": { "face": "Rosto", "hair": "Cabelo", "beard": "Barba", "physique": "Porte" },
      "fixedVisualPrompt": "Prompt fixo",
      "wardrobes": [{ "id": "w_1", "name": "figurino", "description": "Roupas sem logotipos" }],
      "defaultWardrobeId": "w_1",
      "personality": "Firme",
      "voiceProfile": { "gender": "masculino", "ageGroup": "adulto", "timbre": "grave", "accent": "Paulista", "rhythm": "firme" },
      "status": "pending"
    }
  ],
  "locations": [
    { "id": "loc_1", "name": "Loca\xE7\xE3o", "fixedDescription": "Descri\xE7\xE3o", "atmosphere": "Clima", "lightingPalette": "Luz", "timeOfDay": "Dia", "status": "pending" }
  ],
  "acts": [{ "actNumber": 1, "title": "Ato 1", "narrativeGoal": "In\xEDcio" }],
  "scenes": [
    {
      "sceneId": "scene_1",
      "sceneNumber": 1,
      "actNumber": 1,
      "title": "Cena 1",
      "objective": "Objetivo",
      "cause": "Causa",
      "consequence": "Consequ\xEAncia",
      "shots": [
        {
          "shotId": "shot_1",
          "durationSeconds": ${settings.secondsPerShot},
          "shotType": "Primeiro Plano (Close-up)",
          "cameraMovement": "Dolly In / Zoom Suave",
          "locationId": "loc_1",
          "characterIds": ["char_1"],
          "visualAction": "A\xE7\xE3o",
          "speakerName": "Nome",
          "dialogueLine": "Fala em portugu\xEAs",
          "emotion": "direto",
          "voiceTone": "firme",
          "sfxAmbience": "Som ambiente",
          "transition": "corte",
          "imageStatus": "pending",
          "videoStatus": "pending"
        }
      ]
    }
  ]
}`;
  const { parsed, rawResponse } = await callAiWithStrictJsonRetry(
    prompt,
    "Voc\xEA \xE9 um decupador e analista de roteiros de cinema."
  );
  const foundation = normalizeStoryFoundation(parsed, null, settings);
  const bible = {
    ...foundation,
    scenes: Array.isArray(parsed.scenes) ? parsed.scenes : []
  };
  return { bible, rawResponse };
}
async function shortenDialogueWithAi(currentLine, durationSeconds, speaker, context) {
  const maxWords = durationSeconds === 4 ? 9 : durationSeconds === 6 ? 14 : durationSeconds === 8 ? 18 : 23;
  const prompt = `Encurte a fala a seguir para caber em ${durationSeconds} segundos (m\xE1ximo ${maxWords} palavras).
Personagem: ${speaker}.
Contexto: ${context}.
Fala original: "${currentLine}".
Retorne apenas a fala reescrita em Portugu\xEAs do Brasil entre aspas, sem qualquer outra palavra.`;
  const response = await Flow.generate.text(prompt, {
    systemInstruction: "Voc\xEA \xE9 um roteirista cir\xFArgico. Responda apenas com a frase entre aspas."
  });
  return response.text.replace(/[\u201C\u201D\u00AB\u00BB"']/g, "").trim();
}

// virtual:components/ScriptEditorStep.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var ScriptEditorStep = ({
  title,
  setTitle,
  scriptText,
  setScriptText,
  storyBible,
  setStoryBible,
  settings,
  setSettings,
  onAdvance
}) => {
  const [mode, setMode] = useState("ai");
  const [generationStep, setGenerationStep] = useState("idle");
  const [activeIdeaWorkingId, setActiveIdeaWorkingId] = useState(null);
  const [error, setError] = useState(null);
  const [lastRawAiResponse, setLastRawAiResponse] = useState(null);
  const [showRawModal, setShowRawModal] = useState(false);
  const [isSuggestingIdeas, setIsSuggestingIdeas] = useState(false);
  const [isConvertingCustom, setIsConvertingCustom] = useState(false);
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [selectedSubgenre, setSelectedSubgenre] = useState(SUBGENRES_BY_CATEGORY[CATEGORIES[0]]?.[0] || "");
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const activeDramaInfo = DRAMA_GENRES.find((d) => d.type === settings.selectedDramaGenre) || DRAMA_GENRES[0];
  const activeModelCap = VIDEO_MODELS_CAPABILITIES[settings.defaultVideoModel] || VIDEO_MODELS_CAPABILITIES["Omni 1.1 Flash"];
  const handleSelectDrama = (genre) => {
    const genreData = DRAMA_GENRES.find((d) => d.type === genre) || DRAMA_GENRES[0];
    setSettings((prev) => ({
      ...prev,
      selectedDramaGenre: genre,
      keywords: [...genreData.defaultKeywords]
    }));
  };
  const handleSelectRealism = (realism) => {
    setSettings((prev) => ({
      ...prev,
      storyRealism: realism
    }));
  };
  const handleAddKeyword = () => {
    if (!newKeywordInput.trim()) return;
    const cleanWord = newKeywordInput.trim().toLowerCase();
    if (!settings.keywords.includes(cleanWord)) {
      setSettings((prev) => ({
        ...prev,
        keywords: [...prev.keywords, cleanWord]
      }));
    }
    setNewKeywordInput("");
  };
  const handleRemoveKeyword = (kwToRemove) => {
    setSettings((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((kw) => kw !== kwToRemove)
    }));
  };
  const handleModelChange = (modelName) => {
    const cap = VIDEO_MODELS_CAPABILITIES[modelName];
    let newDuration = settings.secondsPerShot;
    if (!cap.supportedDurations.includes(newDuration)) {
      newDuration = cap.supportedDurations[0] || 8;
    }
    let newRes = settings.defaultResolution;
    if (!cap.supportedResolutions.includes(newRes)) {
      newRes = cap.supportedResolutions[0] || "720p";
    }
    setSettings((prev) => ({
      ...prev,
      defaultVideoModel: modelName,
      secondsPerShot: newDuration,
      defaultResolution: newRes
    }));
    if (storyBible) {
      const updatedScenes = storyBible.scenes.map((sc) => ({
        ...sc,
        shots: sc.shots.map((sh) => ({
          ...sh,
          durationSeconds: newDuration,
          videoModel: modelName,
          videoResolution: newRes
        }))
      }));
      setStoryBible({ ...storyBible, scenes: updatedScenes });
    }
  };
  const totalSeconds = settings.durationMinutes * 60;
  const estimatedShots = Math.ceil(totalSeconds / settings.secondsPerShot);
  const realDurationSeconds = storyBible?.scenes.reduce(
    (acc, sc) => acc + sc.shots.reduce((sAcc, sh) => sAcc + sh.durationSeconds, 0),
    0
  ) || 0;
  const totalShotsCount = storyBible?.scenes.reduce((acc, sc) => acc + sc.shots.length, 0) || 0;
  const estimatedCreditsTotal = (totalShotsCount > 0 ? totalShotsCount : estimatedShots) * calculateShotCredits(settings.defaultVideoModel, settings.secondsPerShot, settings.defaultResolution);
  const handleSuggestIdeas = async () => {
    setIsSuggestingIdeas(true);
    setError(null);
    try {
      const realismPrompt = settings.storyRealism === "real" ? "NATUREZA DA HIST\xD3RIA: FATO REAL (baseada em eventos reais aut\xEAnticos)." : "NATUREZA DA HIST\xD3RIA: FICT\xCDCIA (dramatiza\xE7\xE3o autoral).";
      const dramaFilter = `Tipo de Drama: "${settings.selectedDramaGenre}" (${activeDramaInfo.explanation}). Palavras-chave: ${settings.keywords.join(", ")}.`;
      const themeFilter = settings.nicheTheme ? `Tema espec\xEDfico: "${settings.nicheTheme}"` : "";
      const prompt = `Gere 4 ideias originais de hist\xF3rias dram\xE1ticas de alto impacto:
${realismPrompt}
${dramaFilter}
${themeFilter}
Estrutura Narrativa: "${settings.narrativeStructure}".
Tom: ${settings.storyTone}. Formato: ${settings.aspectRatio}.
Responda exclusivamente com um array JSON puro:
[
  {
    "id": "1",
    "title": "T\xEDtulo Marcante",
    "premise": "Premissa dram\xE1tica envolvente incorporando o conflito e as palavras-chave",
    "category": "${settings.selectedDramaGenre}",
    "subgenre": "${selectedSubgenre}",
    "storyRealism": "${settings.storyRealism}",
    "structure": "${settings.narrativeStructure}",
    "hook": "Gancho imediato dos primeiros 3 segundos"
  }
]`;
      const response = await Flow2.generate.text(prompt, {
        systemInstruction: "Voc\xEA \xE9 um roteirista s\xEAnior. Responda APENAS com um array JSON puro. Nenhum texto antes ou depois."
      });
      setLastRawAiResponse(response.text);
      const parsed = extractStrictJson(response.text);
      setIdeas(parsed);
      if (parsed.length > 0) {
        setSelectedIdea(parsed[0]);
        setTitle(parsed[0].title);
      }
    } catch (err) {
      console.error(err);
      setLastRawAiResponse(err?.rawResponse || null);
      setError(`Falha ao sugerir ideias com a IA: ${err?.message || "Tente novamente."}`);
    } finally {
      setIsSuggestingIdeas(false);
    }
  };
  const handleGenerateStoryBibleWorkflow = async (continuationFromBible, targetIdea) => {
    setError(null);
    setGenerationStep("foundation");
    const ideaToUse = targetIdea !== void 0 ? targetIdea : selectedIdea;
    if (ideaToUse) {
      setActiveIdeaWorkingId(ideaToUse.id);
      setTitle(ideaToUse.title);
    }
    const effectiveSettings = {
      ...settings,
      nicheTheme: ideaToUse?.premise || settings.nicheTheme,
      narrativeStructure: ideaToUse?.structure || settings.narrativeStructure,
      storyRealism: ideaToUse?.storyRealism || settings.storyRealism
    };
    setSettings(effectiveSettings);
    try {
      const { foundation, rawResponse: foundationRaw } = await generateStoryBibleFoundation(
        ideaToUse?.title || title || "Drama e Conflito Humano",
        effectiveSettings,
        continuationFromBible,
        ideaToUse
      );
      setLastRawAiResponse(foundationRaw);
      setTitle(foundation.title);
      setGenerationStep("shots");
      const { scenes: scenesWithShots, rawResponses: shotRaws } = await generateShotsInBatches(
        foundation,
        effectiveSettings
      );
      if (shotRaws.length > 0) {
        setLastRawAiResponse(shotRaws[shotRaws.length - 1]);
      }
      const fullBible = {
        ...foundation,
        storyRealism: effectiveSettings.storyRealism,
        scenes: scenesWithShots
      };
      setStoryBible(fullBible);
      const renderedText = renderScriptTextFromBible(fullBible);
      setScriptText(renderedText);
    } catch (err) {
      console.error(err);
      if (err?.rawResponse) {
        setLastRawAiResponse(err.rawResponse);
      }
      setError(`Erro na gera\xE7\xE3o da hist\xF3ria: ${err?.message || "Falha na comunica\xE7\xE3o com a IA"}.`);
    } finally {
      setGenerationStep("idle");
      setActiveIdeaWorkingId(null);
    }
  };
  const handleContinueSeriesEpisode = async () => {
    if (!storyBible) return;
    const nextEp = settings.currentEpisode + 1;
    setSettings((prev) => ({
      ...prev,
      currentEpisode: nextEp
    }));
    await handleGenerateStoryBibleWorkflow(storyBible);
  };
  const handleConvertCustomScript = async () => {
    if (!scriptText.trim()) {
      setError("Cole ou digite o roteiro antes de converter.");
      return;
    }
    setIsConvertingCustom(true);
    setError(null);
    try {
      const { bible: convertedBible, rawResponse } = await convertRawScriptToStoryBible(scriptText, settings);
      setLastRawAiResponse(rawResponse);
      setStoryBible({ ...convertedBible, storyRealism: settings.storyRealism });
      setTitle(convertedBible.title);
      setScriptText(renderScriptTextFromBible(convertedBible));
    } catch (err) {
      console.error(err);
      if (err?.rawResponse) {
        setLastRawAiResponse(err.rawResponse);
      }
      setError(`Falha ao converter roteiro em JSON estruturado: ${err?.message}.`);
    } finally {
      setIsConvertingCustom(false);
    }
  };
  return /* @__PURE__ */ jsxs3("div", { className: "max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsx3("div", { className: "bg-gradient-to-r from-[#171720] via-[#1a1a24] to-[#14141c] p-6 rounded-xl border border-[#272736] shadow-sm", children: /* @__PURE__ */ jsxs3("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx3("span", { className: "text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20", children: "1. Roteiro & Cria\xE7\xE3o Narrativa" }),
          settings.productionType === "series" && /* @__PURE__ */ jsxs3("span", { className: "text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30", children: [
            "Epis\xF3dio ",
            settings.currentEpisode
          ] })
        ] }),
        /* @__PURE__ */ jsxs3("h2", { className: "text-xl md:text-2xl font-bold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-amber-400", children: "auto_stories" }),
          "Cria\xE7\xE3o de Roteiro: Realismo, Drama & Contexto Rigoroso"
        ] }),
        /* @__PURE__ */ jsxs3("p", { className: "text-sm text-zinc-400 mt-1 max-w-3xl", children: [
          "Defina se a trama \xE9 ",
          /* @__PURE__ */ jsx3("strong", { children: "Fato Real" }),
          " ou ",
          /* @__PURE__ */ jsx3("strong", { children: "Fict\xEDcia" }),
          ", sugira ideias e clique em ",
          /* @__PURE__ */ jsx3("strong", { children: "Escrever Hist\xF3ria com Base na Ideia" }),
          " para gerar a trama instantaneamente com o gancho exato dos primeiros 3 segundos."
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-1.5 bg-[#101016] p-1.5 rounded-xl border border-[#2a2a3b]", children: [
        /* @__PURE__ */ jsxs3(
          "button",
          {
            onClick: () => setMode("ai"),
            className: `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${mode === "ai" ? "bg-amber-500 text-black shadow font-bold" : "text-zinc-400 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[16px]", children: "psychology" }),
              "Criar com IA"
            ]
          }
        ),
        /* @__PURE__ */ jsxs3(
          "button",
          {
            onClick: () => setMode("custom"),
            className: `px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${mode === "custom" ? "bg-amber-500 text-black shadow font-bold" : "text-zinc-400 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[16px]", children: "post_add" }),
              "Meu Roteiro"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs3("div", { className: "bg-[#15151c] p-5 rounded-xl border border-amber-500/40 space-y-4 shadow-sm", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap items-center justify-between border-b border-[#232330] pb-2.5 gap-2", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-amber-400 text-lg", children: "history_edu" }),
          /* @__PURE__ */ jsx3("h3", { className: "text-xs font-bold tracking-wider uppercase text-white font-mono", children: "Natureza da Hist\xF3ria: Real ou Fict\xEDcia?" })
        ] }),
        /* @__PURE__ */ jsx3("span", { className: "text-[11px] font-mono text-zinc-400", children: "Controle de Verossimilhan\xE7a & Contexto Estrito" })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs3(
          "div",
          {
            onClick: () => handleSelectRealism("real"),
            className: `p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${settings.storyRealism === "real" ? "bg-[#221e14] border-amber-500 ring-1 ring-amber-500 shadow-md" : "bg-[#101016] border-[#252538] hover:border-zinc-500 hover:bg-[#14141e]"}`,
            children: [
              /* @__PURE__ */ jsx3("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${settings.storyRealism === "real" ? "bg-amber-500 text-black" : "bg-[#1a1a26] text-amber-400"}`, children: /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-xl", children: "newspaper" }) }),
              /* @__PURE__ */ jsxs3("div", { children: [
                /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx3("span", { className: "text-xs font-bold text-white", children: "Hist\xF3ria Real (Baseada em Fatos)" }),
                  settings.storyRealism === "real" && /* @__PURE__ */ jsx3("span", { className: "text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500 text-black font-extrabold uppercase", children: "Ativo" })
                ] }),
                /* @__PURE__ */ jsx3("p", { className: "text-[11px] text-zinc-300 mt-1 leading-relaxed", children: "Eventos ver\xEDdicos, casos documentados no mundo real, relatos hist\xF3ricos, fatos sociais e biografias de supera\xE7\xE3o com fidelidade f\xE1tica." })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs3(
          "div",
          {
            onClick: () => handleSelectRealism("ficticia"),
            className: `p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${settings.storyRealism === "ficticia" ? "bg-[#221e14] border-amber-500 ring-1 ring-amber-500 shadow-md" : "bg-[#101016] border-[#252538] hover:border-zinc-500 hover:bg-[#14141e]"}`,
            children: [
              /* @__PURE__ */ jsx3("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${settings.storyRealism === "ficticia" ? "bg-amber-500 text-black" : "bg-[#1a1a26] text-amber-400"}`, children: /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-xl", children: "auto_awesome" }) }),
              /* @__PURE__ */ jsxs3("div", { children: [
                /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx3("span", { className: "text-xs font-bold text-white", children: "Hist\xF3ria Fict\xEDcia (Criativa / Autoral)" }),
                  settings.storyRealism === "ficticia" && /* @__PURE__ */ jsx3("span", { className: "text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500 text-black font-extrabold uppercase", children: "Ativo" })
                ] }),
                /* @__PURE__ */ jsx3("p", { className: "text-[11px] text-zinc-300 mt-1 leading-relaxed", children: "Tramas inventadas, dramas originais, met\xE1foras morais, mist\xE9rios autorais e fic\xE7\xE3o dramatizada sem compromisso factual." })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "bg-[#15151c] p-5 rounded-xl border border-[#262638] space-y-4 shadow-sm", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap items-center justify-between border-b border-[#232330] pb-2.5 gap-2", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-amber-400 text-lg", children: "theater_comedy" }),
          /* @__PURE__ */ jsx3("h3", { className: "text-xs font-bold tracking-wider uppercase text-white font-mono", children: "Tipo de Drama & Palavras-Chave" })
        ] }),
        /* @__PURE__ */ jsxs3("span", { className: "text-[11px] font-mono text-zinc-400", children: [
          DRAMA_GENRES.length,
          " Vertentes de Drama Dispon\xEDveis"
        ] })
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5", children: DRAMA_GENRES.map((drama) => {
        const isSelected = settings.selectedDramaGenre === drama.type;
        return /* @__PURE__ */ jsxs3(
          "button",
          {
            type: "button",
            onClick: () => handleSelectDrama(drama.type),
            className: `p-2.5 rounded-lg text-left transition-all border cursor-pointer flex flex-col justify-between ${isSelected ? "bg-[#221e14] border-amber-500 ring-1 ring-amber-500/60 shadow-md" : "bg-[#111117] border-[#252538] hover:border-zinc-500 hover:bg-[#161622]"}`,
            children: [
              /* @__PURE__ */ jsx3("span", { className: `text-xs font-bold block ${isSelected ? "text-amber-300" : "text-white"}`, children: drama.title }),
              /* @__PURE__ */ jsxs3("span", { className: "text-[10px] text-zinc-400 mt-1 line-clamp-1", children: [
                drama.defaultKeywords.slice(0, 2).join(", "),
                "..."
              ] })
            ]
          },
          drama.type
        );
      }) }),
      /* @__PURE__ */ jsxs3("div", { className: "bg-[#101016] p-3.5 rounded-lg border border-[#262638] space-y-3", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-amber-400 text-xl shrink-0 mt-0.5", children: "info" }),
          /* @__PURE__ */ jsxs3("div", { children: [
            /* @__PURE__ */ jsxs3("span", { className: "text-xs font-bold text-amber-300 font-mono uppercase", children: [
              "O que \xE9: ",
              activeDramaInfo.title
            ] }),
            /* @__PURE__ */ jsx3("p", { className: "text-xs text-zinc-300 mt-0.5 leading-relaxed", children: activeDramaInfo.explanation })
          ] })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "pt-2 border-t border-[#1e1e2d] space-y-2", children: [
          /* @__PURE__ */ jsx3("div", { className: "flex flex-wrap items-center justify-between gap-2", children: /* @__PURE__ */ jsxs3("label", { className: "text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1", children: [
            /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[14px] text-amber-400", children: "label" }),
            "Palavras-chave ativas para a trama:"
          ] }) }),
          /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap items-center gap-1.5", children: [
            settings.keywords.map((kw) => /* @__PURE__ */ jsxs3(
              "span",
              {
                className: "inline-flex items-center gap-1 bg-[#1c1c28] border border-amber-500/40 text-amber-200 px-2 py-0.5 rounded-full text-xs font-mono",
                children: [
                  /* @__PURE__ */ jsxs3("span", { children: [
                    "#",
                    kw
                  ] }),
                  /* @__PURE__ */ jsx3(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleRemoveKeyword(kw),
                      className: "text-zinc-400 hover:text-red-400 text-xs font-bold cursor-pointer ml-0.5",
                      title: "Remover palavra-chave",
                      children: "\xD7"
                    }
                  )
                ]
              },
              kw
            )),
            /* @__PURE__ */ jsxs3("div", { className: "inline-flex items-center gap-1 bg-[#13131c] border border-[#2f2f42] rounded-full px-2 py-0.5", children: [
              /* @__PURE__ */ jsx3(
                "input",
                {
                  type: "text",
                  value: newKeywordInput,
                  onChange: (e) => setNewKeywordInput(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  },
                  placeholder: "Nova palavra-chave...",
                  className: "bg-transparent text-xs text-white focus:outline-none w-32 placeholder:text-zinc-600"
                }
              ),
              /* @__PURE__ */ jsx3(
                "button",
                {
                  type: "button",
                  onClick: handleAddKeyword,
                  className: "text-amber-400 hover:text-amber-300 text-xs font-bold cursor-pointer",
                  title: "Adicionar",
                  children: "+"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs3("div", { className: "p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-red-400 text-lg shrink-0", children: "error" }),
        /* @__PURE__ */ jsx3("span", { className: "font-medium", children: error })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 shrink-0", children: [
        lastRawAiResponse && /* @__PURE__ */ jsxs3(
          "button",
          {
            onClick: () => setShowRawModal(true),
            className: "px-3 py-1.5 bg-[#26151a] hover:bg-[#381e26] text-amber-300 border border-amber-500/30 rounded-lg font-bold text-xs cursor-pointer transition-all flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[15px]", children: "bug_report" }),
              /* @__PURE__ */ jsx3("span", { children: "Ver resposta da IA" })
            ]
          }
        ),
        /* @__PURE__ */ jsx3(
          "button",
          {
            onClick: () => handleGenerateStoryBibleWorkflow(null, selectedIdea),
            className: "px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white rounded-lg font-bold text-xs cursor-pointer transition-all",
            children: "Tentar de novo"
          }
        )
      ] })
    ] }),
    showRawModal && /* @__PURE__ */ jsx3("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs", children: /* @__PURE__ */ jsxs3("div", { className: "bg-[#14141c] border border-amber-500/40 rounded-2xl max-w-3xl w-full p-5 shadow-2xl space-y-3 max-h-[85vh] flex flex-col", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between border-b border-[#252538] pb-3", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 text-amber-400", children: [
          /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined", children: "data_object" }),
          /* @__PURE__ */ jsx3("h3", { className: "text-sm font-bold text-white font-mono uppercase", children: "Resposta Bruta da IA" })
        ] }),
        /* @__PURE__ */ jsx3(
          "button",
          {
            onClick: () => setShowRawModal(false),
            className: "text-zinc-400 hover:text-white cursor-pointer",
            children: /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined", children: "close" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx3(
        "textarea",
        {
          readOnly: true,
          value: lastRawAiResponse || "Nenhuma resposta gravada.",
          className: "w-full flex-1 min-h-[300px] bg-[#0c0c12] border border-[#232332] rounded-xl p-3 text-xs font-mono text-zinc-300 resize-none overflow-y-auto leading-relaxed focus:outline-none"
        }
      ),
      /* @__PURE__ */ jsx3("div", { className: "flex justify-end pt-2 border-t border-[#252538]", children: /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: () => setShowRawModal(false),
          className: "px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg cursor-pointer",
          children: "Fechar"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxs3("div", { className: "bg-[#15151c] p-5 rounded-xl border border-[#262633] space-y-4", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap items-center justify-between border-b border-[#232330] pb-2.5 gap-2", children: [
        /* @__PURE__ */ jsxs3("h3", { className: "text-xs font-semibold tracking-wider uppercase text-amber-400 font-mono flex items-center gap-2", children: [
          /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[16px]", children: "videocam" }),
          "Modelo de V\xEDdeo & Capacidades Din\xE2micas"
        ] }),
        /* @__PURE__ */ jsxs3("span", { className: "text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20", children: [
          "Estimativa: ~",
          estimatedCreditsTotal,
          " cr\xE9ditos para o filme completo"
        ] })
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: Object.keys(VIDEO_MODELS_CAPABILITIES).map((mName) => {
        const cap = VIDEO_MODELS_CAPABILITIES[mName];
        const isSelected = settings.defaultVideoModel === mName;
        return /* @__PURE__ */ jsxs3(
          "div",
          {
            onClick: () => handleModelChange(mName),
            className: `p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${isSelected ? "bg-[#221e14] border-amber-500 shadow-md ring-1 ring-amber-500/50" : "bg-[#121218] border-[#252535] hover:border-zinc-500"}`,
            children: [
              /* @__PURE__ */ jsxs3("div", { children: [
                /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between gap-1 mb-1", children: [
                  /* @__PURE__ */ jsx3("span", { className: "font-bold text-white text-xs", children: cap.displayName }),
                  /* @__PURE__ */ jsx3("span", { className: `text-[9px] font-mono px-1.5 py-0.2 rounded ${isSelected ? "bg-amber-500 text-black font-bold" : "bg-zinc-800 text-amber-300"}`, children: cap.badge })
                ] }),
                /* @__PURE__ */ jsx3("p", { className: "text-[11px] text-zinc-300 line-clamp-2 leading-relaxed", children: cap.description })
              ] }),
              /* @__PURE__ */ jsxs3("div", { className: "pt-2 mt-2 border-t border-[#222230] text-[10px] font-mono text-zinc-400 space-y-0.5", children: [
                /* @__PURE__ */ jsxs3("div", { children: [
                  "Dura\xE7\xF5es: ",
                  cap.supportedDurations.map((d) => `${d}s`).join(", ")
                ] }),
                /* @__PURE__ */ jsxs3("div", { className: "text-amber-400/90", children: [
                  "Resolu\xE7\xF5es: ",
                  cap.supportedResolutions.join(", ")
                ] })
              ] })
            ]
          },
          mName
        );
      }) }),
      /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2", children: [
        /* @__PURE__ */ jsxs3("div", { className: "bg-[#111117] p-3 rounded-lg border border-[#222230] sm:col-span-2", children: [
          /* @__PURE__ */ jsx3("label", { className: "text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1 block", children: "Tema ou Premissa Espec\xEDfica" }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "text",
              value: settings.nicheTheme,
              onChange: (e) => setSettings({ ...settings, nicheTheme: e.target.value }),
              placeholder: "Ex: Julgamento de heran\xE7a entre irm\xE3os no interior...",
              className: "w-full bg-[#1b1b24] border border-[#2c2c3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "bg-[#111117] p-3 rounded-lg border border-[#222230]", children: [
          /* @__PURE__ */ jsx3("label", { className: "text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1 block", children: "Estrutura Narrativa" }),
          /* @__PURE__ */ jsx3(
            "select",
            {
              value: settings.narrativeStructure,
              onChange: (e) => setSettings({ ...settings, narrativeStructure: e.target.value }),
              className: "w-full bg-[#1b1b24] border border-[#2c2c3d] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-400",
              children: NARRATIVE_STRUCTURES.map((ns) => /* @__PURE__ */ jsx3("option", { value: ns.value, children: ns.label }, ns.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "bg-[#111117] p-3 rounded-lg border border-[#222230]", children: [
          /* @__PURE__ */ jsx3("label", { className: "text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1 block", children: "Formato de Exibi\xE7\xE3o" }),
          /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-2 gap-2 mt-1", children: ASPECT_RATIOS.map((ar) => /* @__PURE__ */ jsxs3(
            "button",
            {
              type: "button",
              onClick: () => setSettings({ ...settings, aspectRatio: ar.value }),
              className: `py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${settings.aspectRatio === ar.value ? "bg-amber-500 text-black font-bold" : "bg-[#1c1c28] text-zinc-400 border border-[#2d2d3e]"}`,
              children: [
                /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[16px]", children: ar.icon }),
                /* @__PURE__ */ jsx3("span", { className: "font-mono", children: ar.value })
              ]
            },
            ar.value
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1", children: [
        /* @__PURE__ */ jsxs3("div", { className: "bg-[#111117] p-3 rounded-lg border border-[#222230]", children: [
          /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx3("label", { className: "text-[11px] uppercase tracking-wider text-zinc-400 font-semibold", children: "Dura\xE7\xE3o da Tomada" }),
            /* @__PURE__ */ jsxs3("span", { className: "text-xs font-mono font-bold text-amber-400", children: [
              settings.secondsPerShot,
              "s (",
              WORD_LIMITS_BY_DURATION[settings.secondsPerShot] || 14,
              " palavras)"
            ] })
          ] }),
          /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-4 gap-1 mt-1", children: [4, 6, 8, 10].map((sec) => {
            const isSupported = activeModelCap.supportedDurations.includes(sec);
            return /* @__PURE__ */ jsxs3(
              "button",
              {
                type: "button",
                disabled: !isSupported,
                onClick: () => setSettings({ ...settings, secondsPerShot: sec }),
                className: `py-1.5 rounded text-xs font-mono font-bold transition-all ${!isSupported ? "opacity-30 bg-[#161620] text-zinc-600 cursor-not-allowed" : settings.secondsPerShot === sec ? "bg-amber-500 text-black shadow cursor-pointer" : "bg-[#1b1b26] text-zinc-400 hover:text-white border border-[#2c2c3d] cursor-pointer"}`,
                children: [
                  sec,
                  "s"
                ]
              },
              sec
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "bg-[#111117] p-3 rounded-lg border border-[#222230]", children: [
          /* @__PURE__ */ jsx3("label", { className: "text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1 block", children: "Qualidade Sugerida" }),
          /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-2 gap-2 mt-1", children: ["360p", "720p"].map((res) => {
            const isSupported = activeModelCap.supportedResolutions.includes(res);
            return /* @__PURE__ */ jsxs3(
              "button",
              {
                type: "button",
                disabled: !isSupported,
                onClick: () => setSettings({ ...settings, defaultResolution: res }),
                className: `py-1.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all ${!isSupported ? "opacity-30 bg-[#161620] text-zinc-600 cursor-not-allowed" : settings.defaultResolution === res ? "bg-amber-500 text-black font-bold cursor-pointer" : "bg-[#1c1c28] text-zinc-400 border border-[#2d2d3e] cursor-pointer"}`,
                children: [
                  /* @__PURE__ */ jsx3("span", { className: "font-mono", children: res }),
                  /* @__PURE__ */ jsx3("span", { className: "text-[9px] opacity-80", children: res === "360p" ? "Rascunho" : "Final" })
                ]
              },
              res
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "bg-[#111117] p-3 rounded-lg border border-[#222230]", children: [
          /* @__PURE__ */ jsx3("label", { className: "text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1 block", children: "Dura\xE7\xE3o Alvo do Filme" }),
          /* @__PURE__ */ jsx3("div", { className: "flex items-center gap-1 mt-1", children: [1, 2, 3, 5].map((mins) => /* @__PURE__ */ jsxs3(
            "button",
            {
              type: "button",
              onClick: () => setSettings({ ...settings, durationMinutes: mins }),
              className: `flex-1 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer ${settings.durationMinutes === mins ? "bg-amber-500 text-black" : "bg-[#1b1b26] text-zinc-400 hover:text-white border border-[#2c2c3d]"}`,
              children: [
                mins,
                "m"
              ]
            },
            mins
          )) })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "bg-[#111117] p-3 rounded-lg border border-[#222230]", children: [
          /* @__PURE__ */ jsx3("label", { className: "text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1 block", children: "Estilo Visual" }),
          /* @__PURE__ */ jsx3(
            "select",
            {
              value: settings.style,
              onChange: (e) => setSettings({ ...settings, style: e.target.value }),
              className: "w-full bg-[#1b1b24] border border-[#2c2c3d] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 mt-1",
              children: VISUAL_STYLES.map((st) => /* @__PURE__ */ jsx3("option", { value: st, children: st }, st))
            }
          )
        ] })
      ] })
    ] }),
    mode === "ai" && /* @__PURE__ */ jsxs3("div", { className: "bg-[#15151c] p-5 rounded-xl border border-[#262633] space-y-4", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsxs3("h3", { className: "text-sm font-bold text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-amber-400", children: "psychology" }),
            "Criar Roteiro com IA"
          ] }),
          /* @__PURE__ */ jsxs3("p", { className: "text-xs text-zinc-400", children: [
            "Gere a hist\xF3ria combinando a natureza ",
            /* @__PURE__ */ jsx3("strong", { children: settings.storyRealism === "real" ? "Fatos Reais" : "Fict\xEDcia" }),
            ", o drama ",
            /* @__PURE__ */ jsx3("strong", { children: settings.selectedDramaGenre }),
            " e palavras-chave."
          ] })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs3(
            "button",
            {
              onClick: handleSuggestIdeas,
              disabled: isSuggestingIdeas || generationStep !== "idle",
              className: "px-3.5 py-2 bg-[#222232] hover:bg-[#2c2c40] text-amber-300 font-bold text-xs rounded-lg border border-amber-500/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-sm",
              children: [
                /* @__PURE__ */ jsx3("span", { className: `material-symbols-outlined text-[17px] ${isSuggestingIdeas ? "animate-spin text-amber-400" : "text-amber-400"}`, children: isSuggestingIdeas ? "sync" : "lightbulb" }),
                /* @__PURE__ */ jsx3("span", { children: isSuggestingIdeas ? "Sugerindo..." : "Sugerir Ideias" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs3(
            "button",
            {
              onClick: () => handleGenerateStoryBibleWorkflow(null, selectedIdea),
              disabled: generationStep !== "idle",
              className: "px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx3("span", { className: `material-symbols-outlined text-[17px] ${generationStep !== "idle" ? "animate-spin" : ""}`, children: generationStep !== "idle" ? "sync" : "movie_filter" }),
                /* @__PURE__ */ jsx3("span", { children: generationStep === "foundation" ? "1/2 Gerando Base & B\xEDblia..." : generationStep === "shots" ? "2/2 Gerando Tomadas..." : "Criar Roteiro Completo" })
              ]
            }
          )
        ] })
      ] }),
      ideas.length > 0 && /* @__PURE__ */ jsxs3("div", { className: "space-y-3 pt-2", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs3("span", { className: "text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-base", children: "auto_awesome" }),
            "Ideias Sugeridas pela IA:"
          ] }),
          /* @__PURE__ */ jsxs3("span", { className: "text-[11px] font-mono text-zinc-400", children: [
            ideas.length,
            " ideias encontradas"
          ] })
        ] }),
        /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3.5", children: ideas.map((idea) => {
          const isSelected = selectedIdea?.id === idea.id;
          const isThisIdeaWorking = generationStep !== "idle" && activeIdeaWorkingId === idea.id;
          return /* @__PURE__ */ jsxs3(
            "div",
            {
              onClick: () => {
                setSelectedIdea(idea);
                setTitle(idea.title);
                setSettings((prev) => ({
                  ...prev,
                  nicheTheme: idea.premise,
                  narrativeStructure: idea.structure || prev.narrativeStructure,
                  storyRealism: idea.storyRealism || prev.storyRealism
                }));
              },
              className: `p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${isSelected ? "bg-[#242018] border-amber-500 shadow-md ring-1 ring-amber-500/40" : "bg-[#181822] border-[#292938] hover:border-zinc-500 hover:bg-[#1a1a26]"}`,
              children: [
                /* @__PURE__ */ jsxs3("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsx3("span", { className: "font-bold text-white text-xs", children: idea.title }),
                    /* @__PURE__ */ jsxs3("span", { className: "text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono", children: [
                      idea.storyRealism === "real" ? "FATO REAL" : "FICT\xCDCIA",
                      " \u2022 ",
                      idea.structure
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx3("p", { className: "text-xs text-zinc-300 leading-relaxed", children: idea.premise }),
                  /* @__PURE__ */ jsxs3("div", { className: "p-2 bg-[#12121a] rounded-lg border border-amber-500/30 text-[11px] text-amber-200 font-mono leading-relaxed", children: [
                    /* @__PURE__ */ jsx3("strong", { className: "text-amber-400 uppercase mr-1", children: "\u26A1 Gancho dos 3s:" }),
                    '"',
                    idea.hook,
                    '"'
                  ] })
                ] }),
                /* @__PURE__ */ jsxs3("div", { className: "pt-2 border-t border-[#252538] flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx3("span", { className: "text-[10px] font-mono text-zinc-400", children: isSelected ? "\u2713 Selecionada" : "Clique para selecionar" }),
                  /* @__PURE__ */ jsxs3(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        setSelectedIdea(idea);
                        setTitle(idea.title);
                        handleGenerateStoryBibleWorkflow(null, idea);
                      },
                      disabled: generationStep !== "idle",
                      className: "px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50 transition-all",
                      children: [
                        /* @__PURE__ */ jsx3("span", { className: `material-symbols-outlined text-[15px] ${isThisIdeaWorking ? "animate-spin" : ""}`, children: isThisIdeaWorking ? "sync" : "history_edu" }),
                        /* @__PURE__ */ jsx3("span", { children: isThisIdeaWorking ? generationStep === "foundation" ? "1/2 Criando Base..." : "2/2 Criando Tomadas..." : "Escrever Hist\xF3ria com base nesta Ideia" })
                      ]
                    }
                  )
                ] })
              ]
            },
            idea.id
          );
        }) }),
        selectedIdea && /* @__PURE__ */ jsxs3("div", { className: "bg-[#12121c] p-3.5 rounded-xl border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md", children: [
          /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-amber-400 text-xl", children: "auto_stories" }),
            /* @__PURE__ */ jsxs3("div", { children: [
              /* @__PURE__ */ jsxs3("span", { className: "text-xs font-bold text-white block", children: [
                'Ideia Ativa: "',
                selectedIdea.title,
                '"'
              ] }),
              /* @__PURE__ */ jsxs3("span", { className: "text-[11px] text-zinc-400", children: [
                'Gancho 3s: "',
                selectedIdea.hook,
                '"'
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs3(
            "button",
            {
              onClick: () => handleGenerateStoryBibleWorkflow(null, selectedIdea),
              disabled: generationStep !== "idle",
              className: "w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 transition-all",
              children: [
                /* @__PURE__ */ jsx3("span", { className: `material-symbols-outlined text-[17px] ${generationStep !== "idle" ? "animate-spin" : ""}`, children: generationStep !== "idle" ? "sync" : "edit_document" }),
                /* @__PURE__ */ jsx3("span", { children: generationStep === "foundation" ? "1/2 Criando Base..." : generationStep === "shots" ? "2/2 Criando Tomadas..." : "Gerar Hist\xF3ria com base na Ideia" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    mode === "custom" && /* @__PURE__ */ jsx3("div", { className: "bg-[#15151c] p-5 rounded-xl border border-indigo-500/30 space-y-3", children: /* @__PURE__ */ jsxs3("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("h3", { className: "text-sm font-bold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-indigo-400", children: "post_add" }),
          "Adicionar Roteiro J\xE1 Criado"
        ] }),
        /* @__PURE__ */ jsx3("p", { className: "text-xs text-zinc-400", children: "Cole o texto do seu roteiro abaixo e clique em converter para decupar as tomadas." })
      ] }),
      /* @__PURE__ */ jsxs3(
        "button",
        {
          onClick: handleConvertCustomScript,
          disabled: isConvertingCustom || !scriptText.trim(),
          className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow cursor-pointer disabled:opacity-50 transition-all whitespace-nowrap",
          children: [
            /* @__PURE__ */ jsx3("span", { className: `material-symbols-outlined text-[17px] ${isConvertingCustom ? "animate-spin" : ""}`, children: isConvertingCustom ? "sync" : "transform" }),
            /* @__PURE__ */ jsx3("span", { children: isConvertingCustom ? "Convertendo..." : "Converter Roteiro em Ativos" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs3("div", { className: "bg-[#15151c] p-5 rounded-xl border border-[#262633] space-y-4", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex-1 w-full", children: [
          /* @__PURE__ */ jsx3("label", { className: "text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1 block", children: "T\xEDtulo da Produ\xE7\xE3o" }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "text",
              value: title,
              onChange: (e) => setTitle(e.target.value),
              placeholder: "Digite o t\xEDtulo da sua produ\xE7\xE3o...",
              className: "w-full bg-[#1b1b24] border border-[#2c2c3d] rounded-lg px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 pt-2 sm:pt-4", children: [
          /* @__PURE__ */ jsxs3("div", { className: "bg-[#101016] px-3 py-2 rounded-lg border border-[#252538] text-right", children: [
            /* @__PURE__ */ jsx3("span", { className: "text-[10px] font-mono uppercase text-zinc-400 block", children: "Dura\xE7\xE3o Real:" }),
            /* @__PURE__ */ jsx3("span", { className: "text-sm font-mono font-bold text-emerald-400", children: realDurationSeconds > 0 ? `${realDurationSeconds}s (${Math.floor(realDurationSeconds / 60)}m ${realDurationSeconds % 60}s)` : `${totalSeconds}s planejado` })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "bg-[#101016] px-3 py-2 rounded-lg border border-[#252538] text-right", children: [
            /* @__PURE__ */ jsx3("span", { className: "text-[10px] font-mono uppercase text-zinc-400 block", children: "Total Tomadas:" }),
            /* @__PURE__ */ jsx3("span", { className: "text-sm font-mono font-bold text-amber-300", children: totalShotsCount > 0 ? `${totalShotsCount}` : `${estimatedShots} est.` })
          ] })
        ] })
      ] }),
      storyBible && /* @__PURE__ */ jsxs3("div", { className: "bg-[#121218] p-4 rounded-xl border border-amber-500/30 space-y-3", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-[#252538] pb-2", children: [
          /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-amber-400 text-base", children: "verified" }),
            /* @__PURE__ */ jsxs3("span", { className: "text-xs font-bold font-mono text-amber-300 uppercase", children: [
              "Story Bible Ativa (",
              storyBible.storyRealism === "real" ? "Fatos Reais" : "Fict\xEDcia",
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs3("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300", children: [
            storyBible.characters.length,
            " personagens \u2022 ",
            storyBible.locations.length,
            " loca\xE7\xF5es \u2022 ",
            storyBible.scenes.length,
            " cenas"
          ] })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 text-xs", children: [
          /* @__PURE__ */ jsxs3("div", { className: "bg-[#161622] p-2.5 rounded-lg border border-[#272738]", children: [
            /* @__PURE__ */ jsx3("strong", { className: "text-amber-400 block mb-0.5 text-[11px] font-mono", children: "\u26A1 GANCHO 3s:" }),
            /* @__PURE__ */ jsxs3("span", { className: "text-zinc-200 italic", children: [
              '"',
              storyBible.hook,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "bg-[#161622] p-2.5 rounded-lg border border-[#272738]", children: [
            /* @__PURE__ */ jsx3("strong", { className: "text-amber-400 block mb-0.5 text-[11px] font-mono", children: "\u{1F3AF} CONFLITO CENTRAL 10s:" }),
            /* @__PURE__ */ jsx3("span", { className: "text-zinc-200", children: storyBible.centralConflict })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "bg-[#161622] p-2.5 rounded-lg border border-[#272738]", children: [
            /* @__PURE__ */ jsxs3("strong", { className: "text-amber-400 block mb-0.5 text-[11px] font-mono", children: [
              "\u{1F3C1} FINAL (",
              storyBible.ending.type,
              "):"
            ] }),
            /* @__PURE__ */ jsx3("span", { className: "text-zinc-200", children: storyBible.ending.description }),
            storyBible.ending.finalPunchline && /* @__PURE__ */ jsxs3("span", { className: "text-emerald-300 block mt-1 font-semibold", children: [
              '"',
              storyBible.ending.finalPunchline,
              '"'
            ] })
          ] })
        ] }),
        settings.productionType === "series" && /* @__PURE__ */ jsxs3("div", { className: "pt-2 flex items-center justify-between border-t border-[#232336]", children: [
          /* @__PURE__ */ jsx3("span", { className: "text-xs text-indigo-300", children: "Epis\xF3dio cont\xEDnuo ativo." }),
          /* @__PURE__ */ jsxs3(
            "button",
            {
              onClick: handleContinueSeriesEpisode,
              disabled: generationStep !== "idle",
              className: "px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition-all disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[16px]", children: "fast_forward" }),
                /* @__PURE__ */ jsxs3("span", { children: [
                  "Criar Parte ",
                  settings.currentEpisode + 1
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between mb-1.5", children: [
          /* @__PURE__ */ jsxs3("label", { className: "text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx3("span", { children: "Texto do Roteiro" }),
            /* @__PURE__ */ jsx3("span", { className: "text-[10px] text-amber-400 font-normal", children: storyBible ? `\u2022 Sincronizado com a Story Bible (${storyBible.storyRealism === "real" ? "Fatos Reais" : "Fict\xEDcia"})` : "\u2022 Pronto para gerar" })
          ] }),
          /* @__PURE__ */ jsxs3("span", { className: "text-[11px] font-mono text-zinc-500", children: [
            scriptText.split(/\s+/).filter(Boolean).length,
            " palavras"
          ] })
        ] }),
        /* @__PURE__ */ jsx3(
          "textarea",
          {
            rows: 12,
            value: scriptText,
            onChange: (e) => setScriptText(e.target.value),
            placeholder: "O roteiro estruturado aparecer\xE1 aqui assim que voc\xEA selecionar uma ideia e clicar em 'Escrever Hist\xF3ria com base nesta Ideia'...",
            className: "w-full bg-[#101016] border border-[#262636] rounded-xl p-4 text-xs font-mono text-zinc-200 leading-relaxed focus:outline-none focus:border-amber-400 resize-y"
          }
        )
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxs3(
        "button",
        {
          onClick: onAdvance,
          disabled: !scriptText.trim(),
          className: "px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40 transition-all cursor-pointer",
          children: [
            /* @__PURE__ */ jsx3("span", { children: "Avan\xE7ar para Ativos e Visuais" }),
            /* @__PURE__ */ jsx3("span", { className: "material-symbols-outlined text-[18px]", children: "arrow_forward" })
          ]
        }
      ) })
    ] })
  ] });
};

// virtual:components/AssetManagerStep.tsx
import { useState as useState2, useEffect } from "react";
import { Flow as Flow3 } from "flow-sdk";

// virtual:services/promptAssembler.ts
function assembleVideoPrompt(shot, characters, locations, settings) {
  const location = locations.find((l) => l.id === shot.locationId);
  const visualStyleAndLight = `${settings.style}, ${location?.lightingPalette || "cinematic golden hour with rich depth and realistic shadows"}`;
  const shotAndCamera = `${shot.shotType}, ${shot.cameraMovement}`;
  const presentCharacters = characters.filter((c) => shot.characterIds.includes(c.id));
  let charDesc = "Cinematic scene";
  if (presentCharacters.length > 0) {
    charDesc = presentCharacters.map((char) => {
      const activeWardrobeId = shot.wardrobeMap?.[char.id] || char.defaultWardrobeId;
      const wardrobe = char.wardrobes.find((w) => w.id === activeWardrobeId) || char.wardrobes[0];
      const wardrobeText = wardrobe ? wardrobe.description : "unbranded tailored clothing";
      return `${char.name} (${char.age}yo, ${char.physicalTraits.face}, ${char.physicalTraits.hair}, ${char.physicalTraits.physique}, wearing ${wardrobeText})`;
    }).join(" and ");
  }
  const locationText = location ? `${location.name} (${location.fixedDescription})` : "cinematic set";
  const actionText = `Action: ${shot.visualAction || "Natural character movement with authentic physics"}`;
  let speechSection = "No dialogue.";
  const speaker = characters.find((c) => c.id === shot.speakerCharacterId) || (shot.speakerName ? { name: shot.speakerName, voiceProfile: null } : null);
  if (speaker && shot.dialogueLine && shot.dialogueLine.trim().length > 0) {
    const vp = speaker.voiceProfile;
    const vpText = vp ? `voice profile: ${vp.gender}, ${vp.ageGroup}, ${vp.timbre}, ${vp.accent} accent, ${vp.rhythm}` : "voice: natural, clear Brazilian Portuguese";
    const emotionText = shot.emotion ? `emotion: ${shot.emotion}` : "emotion: expressive";
    speechSection = `${speaker.name} speaks in Brazilian Portuguese, ${emotionText}, ${vpText}: "${shot.dialogueLine.trim()}". Only ${speaker.name} speaks; other characters stay silent and react. Accurate lip sync.`;
  }
  const sfxText = shot.sfxAmbience ? `Ambient sound: ${shot.sfxAmbience}.` : "Ambient sound: natural environmental atmosphere.";
  const restrictions = "No background music, no subtitles, no on-screen text.";
  return `${visualStyleAndLight}. ${shotAndCamera}. ${charDesc} at ${locationText}. ${actionText}. ${speechSection} ${sfxText} ${restrictions}`;
}
function assembleShotImagePrompt(shot, characters, locations, settings) {
  const parts = [];
  const referenceMediaIds = [];
  const location = locations.find((l) => l.id === shot.locationId);
  if (location) {
    parts.push(
      `Setting: ${location.name}. Environment: ${location.fixedDescription}. Atmosphere: ${location.atmosphere}. Lighting: ${location.lightingPalette}. Time: ${location.timeOfDay}.`
    );
    if (location.mediaId) {
      referenceMediaIds.push(location.mediaId);
    }
  }
  const presentCharacters = characters.filter((c) => shot.characterIds.includes(c.id));
  presentCharacters.forEach((char) => {
    const activeWardrobeId = shot.wardrobeMap?.[char.id] || char.defaultWardrobeId;
    const wardrobe = char.wardrobes.find((w) => w.id === activeWardrobeId) || char.wardrobes[0];
    const wardrobeDesc = wardrobe ? wardrobe.description : "authentic unbranded clothing";
    parts.push(
      `Character [${char.name}]: Age ${char.age}, ${char.physicalTraits.physique}. Facial traits: ${char.physicalTraits.face}. Hair: ${char.physicalTraits.hair}. Facial hair: ${char.physicalTraits.beard}. Fixed identity: ${char.fixedVisualPrompt}. Wearing: ${wardrobeDesc}. (Strictly no real-world logos, unbranded textile).`
    );
    const charMediaId = char.referenceMediaId || char.userUploadedPhotoMediaId;
    if (charMediaId && !referenceMediaIds.includes(charMediaId)) {
      referenceMediaIds.push(charMediaId);
    }
  });
  parts.push(`Shot type: ${shot.shotType}. Camera movement: ${shot.cameraMovement}. Action: ${shot.visualAction}.`);
  if (shot.speakerCharacterId) {
    const speakerChar = characters.find((c) => c.id === shot.speakerCharacterId);
    const speakerName = speakerChar ? speakerChar.name : shot.speakerName;
    parts.push(
      `Focal point: ${speakerName} speaking actively with emotion: ${shot.emotion}. Natural expression.`
    );
  }
  parts.push(
    `Style: ${settings.style}, award-winning cinematography, hyper-detailed rendering, realistic skin textures, 8k resolution, unbranded props and clothing.`
  );
  return {
    prompt: parts.join(" "),
    referenceMediaIds: referenceMediaIds.slice(0, 5)
  };
}
function assembleCharacterReferenceSheetPrompt(character, settings) {
  const activeWardrobe = character.wardrobes.find((w) => w.id === character.defaultWardrobeId) || character.wardrobes[0];
  const wardrobeDesc = activeWardrobe ? activeWardrobe.description : "tailored unbranded attire";
  return `Full-body character concept sheet of ${character.name}, age ${character.age}. Full standing front view, neutral standing pose, centered in frame. Clean neutral studio gray background. Facial features: ${character.physicalTraits.face}, hair: ${character.physicalTraits.hair}, facial hair: ${character.physicalTraits.beard}, physique: ${character.physicalTraits.physique}. Character description: ${character.fixedVisualPrompt}. Wearing: ${wardrobeDesc}. Plain generic unbranded garments, no commercial logos. Style: ${settings}, crisp cinematic lighting, 8k resolution, character bible model sheet.`;
}
function assembleLocationReferencePrompt(location, settings) {
  return `Cinematic master shot establishing ${location.name}. ${location.fixedDescription}. Lighting palette: ${location.lightingPalette}. Atmosphere: ${location.atmosphere}, time of day: ${location.timeOfDay}. Architecture and nature, rich environmental details, no commercial logos or billboards. Style: ${settings}, pristine wide composition, cinematic depth of field.`;
}

// virtual:components/AssetManagerStep.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var AssetManagerStep = ({
  scriptText,
  storyBible,
  setStoryBible,
  settings,
  onAdvance,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState2("characters");
  const [generatingSheetId, setGeneratingSheetId] = useState2(null);
  const [generatingLocationId, setGeneratingLocationId] = useState2(null);
  const [generatingAll, setGeneratingAll] = useState2(false);
  const [error, setError] = useState2(null);
  const [infoNotice, setInfoNotice] = useState2(null);
  useEffect(() => {
    if (!storyBible || storyBible.characters.length === 0 && storyBible.locations.length === 0) {
      const defaultBible = {
        title: storyBible?.title || "Produ\xE7\xE3o Sanja",
        logline: storyBible?.logline || "Hist\xF3ria dram\xE1tica cinematogr\xE1fica",
        narrativeStructure: settings.narrativeStructure,
        hook: storyBible?.hook || "Primeiros 3 segundos de alto impacto",
        centralConflict: storyBible?.centralConflict || "Conflito principal estabelecido",
        ending: storyBible?.ending || {
          type: "moral",
          description: "Desfecho dram\xE1tico conclusivo"
        },
        characters: [
          {
            id: "char_1",
            name: "Protagonista",
            age: 32,
            role: "protagonist",
            archetype: "L\xEDder / Determinado",
            physicalTraits: {
              face: "Rosto anguloso expressivo, maxilar delineado, olhar penetrante e sincero",
              hair: "Cabelo curto castanho escuro penteado para tr\xE1s",
              beard: "Barba por fazer bem cuidada",
              physique: "Porte atl\xE9tico e postura ereta, 1.80m"
            },
            fixedVisualPrompt: "Homem brasileiro na faixa dos 30 anos com fei\xE7\xF5es realistas aut\xEAnticas",
            wardrobes: [
              {
                id: "w_1",
                name: "figurino principal",
                description: "Camisa de linho cru clara sem logotipos, cal\xE7a de sarja escura de corte cl\xE1ssico"
              }
            ],
            defaultWardrobeId: "w_1",
            personality: "Observador, corajoso e leal",
            voiceProfile: {
              gender: "masculino",
              ageGroup: "adulto",
              timbre: "grave e firme",
              accent: "Paulista do interior",
              rhythm: "compassado e seguro"
            },
            status: "pending"
          },
          {
            id: "char_2",
            name: "Antagonista",
            age: 45,
            role: "antagonist",
            archetype: "Rival Oportunista",
            physicalTraits: {
              face: "Tra\xE7os duros e calculistas, olhar austero e penetrante",
              hair: "Cabelo grisalho nas t\xEAmporas bem cortado",
              beard: "Rosto escanhoado e limpo",
              physique: "Porte imponente e elegante"
            },
            fixedVisualPrompt: "Homem brasileiro de meia idade com express\xE3o autorit\xE1ria",
            wardrobes: [
              {
                id: "w_2",
                name: "figurino formal",
                description: "Blazer azul marinho sem marcas, camisa branca e cal\xE7a cinza grafite"
              }
            ],
            defaultWardrobeId: "w_2",
            personality: "Calculista e focado no poder",
            voiceProfile: {
              gender: "masculino",
              ageGroup: "adulto",
              timbre: "autorit\xE1rio e pausado",
              accent: "Carioca neutro",
              rhythm: "firme e incisivo"
            },
            status: "pending"
          }
        ],
        locations: [
          {
            id: "loc_1",
            name: "Casa de Fam\xEDlia Antiga",
            fixedDescription: "Varanda colonial com pilares de madeira nobre e assoalho r\xFAstico com vista para o campo",
            atmosphere: "Tens\xE3o dram\xE1tica e peso do passado familiar",
            lightingPalette: "Luz dourada do entardecer com sombras longas e contrastadas",
            timeOfDay: "Final da tarde",
            status: "pending"
          },
          {
            id: "loc_2",
            name: "Escrit\xF3rio Reservado",
            fixedDescription: "Sala austera com estantes de madeira escura e mesa de trabalho pesada",
            atmosphere: "Segredos, negocia\xE7\xF5es veladas e press\xE3o moral",
            lightingPalette: "Ilumina\xE7\xE3o pontual de lumin\xE1ria quente com fundo na penumbra",
            timeOfDay: "Noite",
            status: "pending"
          }
        ],
        acts: storyBible?.acts || [
          { actNumber: 1, title: "O Conflito", narrativeGoal: "Apresenta\xE7\xE3o" },
          { actNumber: 2, title: "A Tens\xE3o", narrativeGoal: "Escalada" },
          { actNumber: 3, title: "O Desfecho", narrativeGoal: "Resolu\xE7\xE3o" }
        ],
        scenes: storyBible?.scenes || []
      };
      setStoryBible(defaultBible);
    }
  }, [storyBible, setStoryBible, settings.narrativeStructure]);
  const characters = storyBible?.characters || [];
  const locations = storyBible?.locations || [];
  const handleUpdateCharacter = (charId, updater) => {
    setStoryBible((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        characters: prev.characters.map((c) => c.id === charId ? updater(c) : c)
      };
    });
  };
  const handleUpdateLocation = (locId, updater) => {
    setStoryBible((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        locations: prev.locations.map((l) => l.id === locId ? updater(l) : l)
      };
    });
  };
  const handleGenerateCharacterSheet = async (character) => {
    if (generatingSheetId) return;
    setGeneratingSheetId(character.id);
    setError(null);
    handleUpdateCharacter(character.id, (c) => ({ ...c, status: "generating" }));
    try {
      const prompt = assembleCharacterReferenceSheetPrompt(character, settings.style);
      const result = await Flow3.generate.image({
        prompt,
        modelDisplayName: DEFAULT_IMAGE_MODEL,
        aspectRatio: "3:4"
        // Formato ideal para corpo inteiro
      });
      if (!result || !result.base64) {
        throw new Error("A IA n\xE3o retornou imagem v\xE1lida.");
      }
      handleUpdateCharacter(character.id, (c) => ({
        ...c,
        referenceSheetBase64: result.base64,
        referenceSheetMimeType: result.mimeType || "image/jpeg",
        referenceMediaId: result.mediaId,
        status: "completed"
      }));
      setInfoNotice(`Folha de refer\xEAncia de "${character.name}" gerada com sucesso!`);
      setTimeout(() => setInfoNotice(null), 3500);
    } catch (err) {
      console.error("[Sanja Studio] Erro ao gerar folha do personagem:", err);
      handleUpdateCharacter(character.id, (c) => ({ ...c, status: "error" }));
      setError(`Falha ao gerar folha de ${character.name}: ${err?.message || "Tente novamente."}`);
    } finally {
      setGeneratingSheetId(null);
    }
  };
  const handleUploadUserPhoto = async (character) => {
    try {
      const selected = await Flow3.media.select({ filter: "image" });
      if (!selected || !selected.mediaId) return;
      handleUpdateCharacter(character.id, (c) => ({ ...c, status: "generating" }));
      setGeneratingSheetId(character.id);
      const prompt = `Adapt this person's facial features and likeness seamlessly into character [${character.name}]. Full body view, standing upright, neutral studio gray background. ${character.physicalTraits.face}, ${character.physicalTraits.hair}. Style: ${settings.style}, plain unbranded clothes.`;
      const result = await Flow3.generate.image({
        prompt,
        modelDisplayName: DEFAULT_IMAGE_MODEL,
        referenceImageMediaIds: [selected.mediaId],
        aspectRatio: "3:4"
      });
      handleUpdateCharacter(character.id, (c) => ({
        ...c,
        referenceSheetBase64: result.base64,
        referenceSheetMimeType: result.mimeType || "image/jpeg",
        referenceMediaId: result.mediaId,
        userUploadedPhotoMediaId: selected.mediaId,
        status: "completed",
        userUploaded: true
      }));
      setInfoNotice(`Foto pessoal adaptada para "${character.name}"!`);
      setTimeout(() => setInfoNotice(null), 3500);
    } catch (err) {
      console.error(err);
      setError("Falha ao processar upload de foto.");
      handleUpdateCharacter(character.id, (c) => ({ ...c, status: "error" }));
    } finally {
      setGeneratingSheetId(null);
    }
  };
  const handleGenerateLocationImage = async (location) => {
    if (generatingLocationId) return;
    setGeneratingLocationId(location.id);
    setError(null);
    handleUpdateLocation(location.id, (l) => ({ ...l, status: "generating" }));
    try {
      const prompt = assembleLocationReferencePrompt(location, settings.style);
      const result = await Flow3.generate.image({
        prompt,
        modelDisplayName: DEFAULT_IMAGE_MODEL,
        aspectRatio: settings.aspectRatio
      });
      if (!result || !result.base64) {
        throw new Error("A IA n\xE3o retornou imagem v\xE1lida para o cen\xE1rio.");
      }
      handleUpdateLocation(location.id, (l) => ({
        ...l,
        generatedImageBase64: result.base64,
        generatedMimeType: result.mimeType || "image/jpeg",
        mediaId: result.mediaId,
        status: "completed"
      }));
      setInfoNotice(`Refer\xEAncia de loca\xE7\xE3o para "${location.name}" gerada!`);
      setTimeout(() => setInfoNotice(null), 3500);
    } catch (err) {
      console.error(err);
      handleUpdateLocation(location.id, (l) => ({ ...l, status: "error" }));
      setError(`Falha ao gerar loca\xE7\xE3o ${location.name}.`);
    } finally {
      setGeneratingLocationId(null);
    }
  };
  const handleGenerateAllMissing = async () => {
    setGeneratingAll(true);
    setError(null);
    for (const char of characters) {
      if (!char.referenceSheetBase64) {
        await handleGenerateCharacterSheet(char);
      }
    }
    for (const loc of locations) {
      if (!loc.generatedImageBase64) {
        await handleGenerateLocationImage(loc);
      }
    }
    setGeneratingAll(false);
  };
  const handleAddWardrobe = (charId) => {
    handleUpdateCharacter(charId, (c) => {
      const newWardrobe = {
        id: `wardrobe_${Date.now()}`,
        name: `figurino ${c.wardrobes.length + 1}`,
        description: "Camisa de algod\xE3o cru lisa sem marcas, cal\xE7a escura de corte reto"
      };
      return {
        ...c,
        wardrobes: [...c.wardrobes, newWardrobe]
      };
    });
  };
  const handleAddCharacter = () => {
    const newChar = {
      id: `char_${Date.now()}`,
      name: `Personagem ${characters.length + 1}`,
      age: 28,
      role: "supporting",
      archetype: "Aliado",
      physicalTraits: {
        face: "Rosto marcante e expressivo, olhar atento",
        hair: "Cabelo castanho escuro penteado",
        beard: "Rosto limpo",
        physique: "Porte m\xE9dio, postura firme"
      },
      fixedVisualPrompt: "Pessoa brasileira com tra\xE7os realistas e naturais",
      wardrobes: [
        {
          id: `wardrobe_${Date.now()}_1`,
          name: "figurino padr\xE3o",
          description: "Vestimenta cotidiana em tons neutros, sem marcas comerciais"
        }
      ],
      defaultWardrobeId: `wardrobe_${Date.now()}_1`,
      personality: "Observador e direto",
      voiceProfile: {
        gender: "neutro",
        ageGroup: "adulto",
        timbre: "claro e firme",
        accent: "Paulista do interior",
        rhythm: "compassado"
      },
      status: "pending"
    };
    setStoryBible((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        characters: [...prev.characters, newChar]
      };
    });
  };
  const handleAddLocation = () => {
    const newLoc = {
      id: `loc_${Date.now()}`,
      name: `Loca\xE7\xE3o ${locations.length + 1}`,
      fixedDescription: "Cen\xE1rio realista com riqueza de detalhes arquitet\xF4nicos e ambientais",
      atmosphere: "Ambi\xEAncia dram\xE1tica e aut\xEAntica",
      lightingPalette: "Luz natural suave e profundidade de campo",
      timeOfDay: "Dia",
      status: "pending"
    };
    setStoryBible((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        locations: [...prev.locations, newLoc]
      };
    });
  };
  const missingCount = characters.filter((c) => !c.referenceSheetBase64).length + locations.filter((l) => !l.generatedImageBase64).length;
  return /* @__PURE__ */ jsxs4("div", { className: "max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs4("div", { className: "bg-gradient-to-r from-[#171720] via-[#1a1a24] to-[#14141c] p-6 rounded-xl border border-[#272736] flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx4("span", { className: "text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20", children: "2. Ativos & Visuais \u2022 Character Bible" }),
          /* @__PURE__ */ jsx4("span", { className: "text-xs font-mono font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30", children: "Folhas de Refer\xEAncia de Corpo Inteiro" })
        ] }),
        /* @__PURE__ */ jsxs4("h2", { className: "text-xl md:text-2xl font-bold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-amber-400", children: "badge" }),
          "Ativos Visuais dos Personagens & Loca\xE7\xF5es"
        ] }),
        /* @__PURE__ */ jsxs4("p", { className: "text-sm text-zinc-400 mt-1 max-w-2xl", children: [
          "Gere a ",
          /* @__PURE__ */ jsx4("strong", { children: "Folha de Refer\xEAncia de Corpo Inteiro" }),
          " de cada personagem com fundo neutro. Ela servir\xE1 de \xE2ncora imut\xE1vel para todas as tomadas do storyboard e anima\xE7\xE3o de v\xEDdeo."
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex flex-wrap items-center gap-2", children: [
        missingCount > 0 && /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: handleGenerateAllMissing,
            disabled: generatingAll || generatingSheetId !== null || generatingLocationId !== null,
            className: "px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsx4("span", { className: `material-symbols-outlined text-[17px] ${generatingAll ? "animate-spin" : ""}`, children: generatingAll ? "sync" : "auto_awesome" }),
              /* @__PURE__ */ jsx4("span", { children: generatingAll ? "Gerando..." : `Gerar Faltantes (${missingCount})` })
            ]
          }
        ),
        /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: () => activeTab === "characters" ? handleAddCharacter() : handleAddLocation(),
            className: "px-3 py-2 bg-[#20202c] hover:bg-[#2a2a3b] text-zinc-200 text-xs rounded-lg border border-[#323246] flex items-center gap-1 cursor-pointer",
            children: [
              /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[16px]", children: "add" }),
              /* @__PURE__ */ jsx4("span", { children: activeTab === "characters" ? "Novo Personagem" : "Nova Loca\xE7\xE3o" })
            ]
          }
        )
      ] })
    ] }),
    infoNotice && /* @__PURE__ */ jsxs4("div", { className: "p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-emerald-400 text-base", children: "check_circle" }),
      /* @__PURE__ */ jsx4("span", { children: infoNotice })
    ] }),
    error && /* @__PURE__ */ jsxs4("div", { className: "p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-red-400 text-base", children: "warning" }),
        /* @__PURE__ */ jsx4("span", { children: error })
      ] }),
      /* @__PURE__ */ jsx4(
        "button",
        {
          onClick: () => setError(null),
          className: "text-xs text-red-300 hover:text-white underline cursor-pointer",
          children: "Fechar"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between bg-[#15151c] px-4 py-2 rounded-xl border border-[#262633]", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: () => setActiveTab("characters"),
            className: `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${activeTab === "characters" ? "bg-amber-500 text-black font-bold shadow" : "text-zinc-400 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[16px]", children: "person" }),
              /* @__PURE__ */ jsxs4("span", { children: [
                "Personagens (",
                characters.length,
                ")"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: () => setActiveTab("locations"),
            className: `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${activeTab === "locations" ? "bg-amber-500 text-black font-bold shadow" : "text-zinc-400 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[16px]", children: "landscape" }),
              /* @__PURE__ */ jsxs4("span", { children: [
                "Loca\xE7\xF5es & Cen\xE1rios (",
                locations.length,
                ")"
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "text-[11px] font-mono text-zinc-400 hidden sm:block", children: [
        "Modelo: ",
        DEFAULT_IMAGE_MODEL
      ] })
    ] }),
    activeTab === "characters" && /* @__PURE__ */ jsx4("div", { className: "space-y-6", children: characters.length === 0 ? /* @__PURE__ */ jsxs4("div", { className: "text-center py-16 bg-[#15151c] rounded-xl border border-dashed border-[#2d2d3d] space-y-3", children: [
      /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-4xl text-zinc-500", children: "face" }),
      /* @__PURE__ */ jsx4("p", { className: "text-sm text-zinc-300 font-semibold", children: "Nenhum personagem cadastrado." }),
      /* @__PURE__ */ jsxs4(
        "button",
        {
          onClick: handleAddCharacter,
          className: "px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-lg inline-flex items-center gap-1.5 shadow cursor-pointer",
          children: [
            /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[16px]", children: "add" }),
            /* @__PURE__ */ jsx4("span", { children: "Adicionar Personagem" })
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsx4("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: characters.map((char) => {
      const isGenerating = generatingSheetId === char.id || char.status === "generating";
      return /* @__PURE__ */ jsxs4(
        "div",
        {
          className: "bg-[#15151c] rounded-xl border border-[#28283a] p-4 space-y-4 hover:border-[#383850] transition-all shadow-sm",
          children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex items-start justify-between gap-3 border-b border-[#232332] pb-3", children: [
              /* @__PURE__ */ jsxs4("div", { children: [
                /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx4("span", { className: "text-sm font-bold text-white", children: char.name }),
                  /* @__PURE__ */ jsxs4("span", { className: "text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300", children: [
                    char.role,
                    " \u2022 ",
                    char.age,
                    " anos"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs4("span", { className: "text-[10px] font-mono text-zinc-400 block mt-0.5", children: [
                  "ID: ",
                  /* @__PURE__ */ jsx4("strong", { className: "text-zinc-200", children: char.id }),
                  " \u2022 Arqu\xE9tipo: ",
                  char.archetype
                ] })
              ] }),
              /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxs4(
                  "button",
                  {
                    onClick: () => handleGenerateCharacterSheet(char),
                    disabled: isGenerating,
                    className: "px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-md flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-all",
                    title: "Gera a folha de refer\xEAncia de corpo inteiro em est\xFAdio neutro",
                    children: [
                      /* @__PURE__ */ jsx4("span", { className: `material-symbols-outlined text-[15px] ${isGenerating ? "animate-spin" : ""}`, children: isGenerating ? "sync" : char.referenceSheetBase64 ? "refresh" : "photo_camera" }),
                      /* @__PURE__ */ jsx4("span", { children: isGenerating ? "Gerando..." : char.referenceSheetBase64 ? "Regenerar" : "Gerar Folha" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs4(
                  "button",
                  {
                    onClick: () => handleUploadUserPhoto(char),
                    disabled: isGenerating,
                    className: "px-2 py-1.5 bg-[#222232] hover:bg-[#2b2b40] text-indigo-300 text-xs rounded-md border border-[#34344e] flex items-center gap-1 cursor-pointer",
                    title: "Enviar foto pessoal para adaptar mantendo o estilo",
                    children: [
                      /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[15px]", children: "upload" }),
                      /* @__PURE__ */ jsx4("span", { className: "hidden sm:inline", children: "Foto" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-1 sm:grid-cols-12 gap-4 items-start", children: [
              /* @__PURE__ */ jsx4("div", { className: "sm:col-span-5", children: /* @__PURE__ */ jsxs4("div", { className: "relative aspect-[3/4] bg-[#0c0c10] rounded-lg overflow-hidden border border-[#272738] flex items-center justify-center", children: [
                char.referenceSheetBase64 ? /* @__PURE__ */ jsx4(
                  "img",
                  {
                    src: `data:${char.referenceSheetMimeType || "image/jpeg"};base64,${char.referenceSheetBase64}`,
                    alt: char.name,
                    className: "w-full h-full object-cover"
                  }
                ) : /* @__PURE__ */ jsxs4("div", { className: "text-center p-3 space-y-1", children: [
                  /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-3xl text-zinc-600", children: "accessibility_new" }),
                  /* @__PURE__ */ jsx4("p", { className: "text-[10px] text-zinc-300 font-mono font-bold", children: "Folha de Corpo Inteiro" }),
                  /* @__PURE__ */ jsx4("p", { className: "text-[9px] text-zinc-500", children: 'Clique em "Gerar Folha" acima' })
                ] }),
                isGenerating && /* @__PURE__ */ jsxs4("div", { className: "absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2 p-2 text-center", children: [
                  /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-amber-400 text-2xl animate-spin", children: "progress_activity" }),
                  /* @__PURE__ */ jsx4("span", { className: "text-[11px] text-amber-300 font-mono font-bold", children: "Gerando Folha de Corpo Inteiro..." }),
                  /* @__PURE__ */ jsx4("span", { className: "text-[9px] text-zinc-400 font-mono", children: "Renderizando tra\xE7os neutros" })
                ] }),
                char.referenceMediaId && /* @__PURE__ */ jsx4("span", { className: "absolute bottom-1.5 left-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-emerald-300 truncate", children: "\u2713 mediaId ativo para tomadas" }),
                char.userUploaded && /* @__PURE__ */ jsx4("span", { className: "absolute top-1.5 right-1.5 bg-indigo-600/90 text-white font-mono text-[8px] px-1.5 py-0.2 rounded", children: "Foto Adaptada" })
              ] }) }),
              /* @__PURE__ */ jsxs4("div", { className: "sm:col-span-7 space-y-2 text-xs", children: [
                /* @__PURE__ */ jsxs4("div", { className: "bg-[#101016] p-2.5 rounded-lg border border-[#222230] space-y-1.5", children: [
                  /* @__PURE__ */ jsx4("strong", { className: "text-[10px] font-mono uppercase text-amber-400 block", children: "Tra\xE7os F\xEDsicos Fixos (Anexados no Prompt):" }),
                  /* @__PURE__ */ jsxs4("div", { children: [
                    /* @__PURE__ */ jsx4("span", { className: "text-[10px] text-zinc-400 block", children: "Rosto:" }),
                    /* @__PURE__ */ jsx4(
                      "input",
                      {
                        type: "text",
                        value: char.physicalTraits.face,
                        onChange: (e) => handleUpdateCharacter(char.id, (c) => ({
                          ...c,
                          physicalTraits: { ...c.physicalTraits, face: e.target.value }
                        })),
                        className: "w-full bg-[#181824] border border-[#2c2c3e] rounded px-2 py-1 text-[11px] text-white"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsxs4("div", { children: [
                      /* @__PURE__ */ jsx4("span", { className: "text-[10px] text-zinc-400 block", children: "Cabelo:" }),
                      /* @__PURE__ */ jsx4(
                        "input",
                        {
                          type: "text",
                          value: char.physicalTraits.hair,
                          onChange: (e) => handleUpdateCharacter(char.id, (c) => ({
                            ...c,
                            physicalTraits: { ...c.physicalTraits, hair: e.target.value }
                          })),
                          className: "w-full bg-[#181824] border border-[#2c2c3e] rounded px-2 py-1 text-[11px] text-white"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs4("div", { children: [
                      /* @__PURE__ */ jsx4("span", { className: "text-[10px] text-zinc-400 block", children: "Barba:" }),
                      /* @__PURE__ */ jsx4(
                        "input",
                        {
                          type: "text",
                          value: char.physicalTraits.beard,
                          onChange: (e) => handleUpdateCharacter(char.id, (c) => ({
                            ...c,
                            physicalTraits: { ...c.physicalTraits, beard: e.target.value }
                          })),
                          className: "w-full bg-[#181824] border border-[#2c2c3e] rounded px-2 py-1 text-[11px] text-white"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs4("div", { children: [
                    /* @__PURE__ */ jsx4("span", { className: "text-[10px] text-zinc-400 block", children: "Porte / Complei\xE7\xE3o:" }),
                    /* @__PURE__ */ jsx4(
                      "input",
                      {
                        type: "text",
                        value: char.physicalTraits.physique,
                        onChange: (e) => handleUpdateCharacter(char.id, (c) => ({
                          ...c,
                          physicalTraits: { ...c.physicalTraits, physique: e.target.value }
                        })),
                        className: "w-full bg-[#181824] border border-[#2c2c3e] rounded px-2 py-1 text-[11px] text-white"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs4("div", { className: "bg-[#101016] p-2.5 rounded-lg border border-[#222230] space-y-1", children: [
                  /* @__PURE__ */ jsxs4("strong", { className: "text-[10px] font-mono uppercase text-indigo-300 block flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[13px]", children: "mic" }),
                    "VoiceProfile (PT-BR):"
                  ] }),
                  /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-2 gap-2 text-[10px] text-zinc-400", children: [
                    /* @__PURE__ */ jsxs4("div", { children: [
                      /* @__PURE__ */ jsx4("span", { children: "Sotaque:" }),
                      /* @__PURE__ */ jsx4(
                        "input",
                        {
                          type: "text",
                          value: char.voiceProfile.accent,
                          onChange: (e) => handleUpdateCharacter(char.id, (c) => ({
                            ...c,
                            voiceProfile: { ...c.voiceProfile, accent: e.target.value }
                          })),
                          className: "w-full bg-[#181824] border border-[#2c2c3e] rounded px-1.5 py-0.5 text-[10px] text-white"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs4("div", { children: [
                      /* @__PURE__ */ jsx4("span", { children: "Timbre:" }),
                      /* @__PURE__ */ jsx4(
                        "input",
                        {
                          type: "text",
                          value: char.voiceProfile.timbre,
                          onChange: (e) => handleUpdateCharacter(char.id, (c) => ({
                            ...c,
                            voiceProfile: { ...c.voiceProfile, timbre: e.target.value }
                          })),
                          className: "w-full bg-[#181824] border border-[#2c2c3e] rounded px-1.5 py-0.5 text-[10px] text-white"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs4("div", { className: "bg-[#111118] p-3 rounded-lg border border-[#232332] space-y-2", children: [
              /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs4("strong", { className: "text-[10px] font-mono uppercase text-amber-400 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[14px]", children: "checkroom" }),
                  "Figurinos Nomeados (Sem Marcas ou Logotipos)"
                ] }),
                /* @__PURE__ */ jsxs4(
                  "button",
                  {
                    onClick: () => handleAddWardrobe(char.id),
                    className: "text-[10px] text-amber-300 hover:text-white flex items-center gap-0.5 cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[13px]", children: "add" }),
                      /* @__PURE__ */ jsx4("span", { children: "Adicionar Figurino" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx4("div", { className: "space-y-2", children: char.wardrobes.map((w) => /* @__PURE__ */ jsxs4("div", { className: "p-2 bg-[#171722] rounded border border-[#29293a] space-y-1", children: [
                /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsx4(
                    "input",
                    {
                      type: "text",
                      value: w.name,
                      onChange: (e) => {
                        const val = e.target.value;
                        handleUpdateCharacter(char.id, (c) => ({
                          ...c,
                          wardrobes: c.wardrobes.map(
                            (item) => item.id === w.id ? { ...item, name: val } : item
                          )
                        }));
                      },
                      className: "bg-transparent text-[11px] font-bold text-amber-300 border-b border-transparent hover:border-zinc-600 focus:border-amber-400 focus:outline-none"
                    }
                  ),
                  /* @__PURE__ */ jsxs4("span", { className: "text-[9px] font-mono text-zinc-500", children: [
                    "ID: ",
                    w.id
                  ] })
                ] }),
                /* @__PURE__ */ jsx4(
                  "input",
                  {
                    type: "text",
                    value: w.description,
                    onChange: (e) => {
                      const val = e.target.value;
                      handleUpdateCharacter(char.id, (c) => ({
                        ...c,
                        wardrobes: c.wardrobes.map(
                          (item) => item.id === w.id ? { ...item, description: val } : item
                        )
                      }));
                    },
                    placeholder: "Descri\xE7\xE3o da roupa sem marcas comerciais...",
                    className: "w-full bg-[#101016] border border-[#28283a] rounded px-2 py-1 text-[10px] text-zinc-200"
                  }
                )
              ] }, w.id)) })
            ] })
          ]
        },
        char.id
      );
    }) }) }),
    activeTab === "locations" && /* @__PURE__ */ jsx4("div", { className: "space-y-6", children: /* @__PURE__ */ jsx4("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: locations.map((loc) => {
      const isGenerating = generatingLocationId === loc.id || loc.status === "generating";
      return /* @__PURE__ */ jsx4(
        "div",
        {
          className: "bg-[#15151c] rounded-xl border border-[#28283a] p-4 space-y-3 hover:border-[#383850] transition-all shadow-sm flex flex-col justify-between",
          children: /* @__PURE__ */ jsxs4("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex items-start justify-between gap-2 border-b border-[#232332] pb-2.5", children: [
              /* @__PURE__ */ jsxs4("div", { children: [
                /* @__PURE__ */ jsx4(
                  "input",
                  {
                    type: "text",
                    value: loc.name,
                    onChange: (e) => {
                      const val = e.target.value;
                      handleUpdateLocation(loc.id, (l) => ({ ...l, name: val }));
                    },
                    className: "bg-transparent font-bold text-sm text-white focus:outline-none"
                  }
                ),
                /* @__PURE__ */ jsxs4("span", { className: "text-[10px] font-mono text-zinc-400 block", children: [
                  "ID: ",
                  /* @__PURE__ */ jsx4("strong", { className: "text-zinc-200", children: loc.id }),
                  " \u2022 Hor\xE1rio: ",
                  loc.timeOfDay
                ] })
              ] }),
              /* @__PURE__ */ jsxs4(
                "button",
                {
                  onClick: () => handleGenerateLocationImage(loc),
                  disabled: isGenerating,
                  className: "px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-md flex items-center gap-1 cursor-pointer disabled:opacity-50",
                  children: [
                    /* @__PURE__ */ jsx4("span", { className: `material-symbols-outlined text-[15px] ${isGenerating ? "animate-spin" : ""}`, children: isGenerating ? "sync" : loc.generatedImageBase64 ? "refresh" : "photo_camera" }),
                    /* @__PURE__ */ jsx4("span", { children: isGenerating ? "Gerando..." : loc.generatedImageBase64 ? "Regenerar" : "Gerar Imagem" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs4("div", { className: "relative aspect-video bg-[#0c0c10] rounded-lg overflow-hidden border border-[#262638] flex items-center justify-center", children: [
              loc.generatedImageBase64 ? /* @__PURE__ */ jsx4(
                "img",
                {
                  src: `data:${loc.generatedMimeType || "image/jpeg"};base64,${loc.generatedImageBase64}`,
                  alt: loc.name,
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxs4("div", { className: "text-center p-3 space-y-1", children: [
                /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-3xl text-zinc-600", children: "landscape" }),
                /* @__PURE__ */ jsx4("p", { className: "text-[10px] text-zinc-400 font-mono", children: "Sem Refer\xEAncia Gerada" })
              ] }),
              isGenerating && /* @__PURE__ */ jsxs4("div", { className: "absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-amber-400 text-2xl animate-spin", children: "progress_activity" }),
                /* @__PURE__ */ jsx4("span", { className: "text-[10px] text-amber-300 font-mono", children: "Gerando Loca\xE7\xE3o..." })
              ] }),
              loc.mediaId && /* @__PURE__ */ jsx4("span", { className: "absolute bottom-1.5 left-1.5 bg-black/80 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-300", children: "\u2713 mediaId vinculado para Storyboard" })
            ] }),
            /* @__PURE__ */ jsxs4("div", { className: "space-y-2 text-xs", children: [
              /* @__PURE__ */ jsxs4("div", { children: [
                /* @__PURE__ */ jsx4("label", { className: "text-[10px] uppercase font-mono text-zinc-400 block mb-0.5", children: "Descri\xE7\xE3o Fixa da Loca\xE7\xE3o:" }),
                /* @__PURE__ */ jsx4(
                  "textarea",
                  {
                    rows: 2,
                    value: loc.fixedDescription,
                    onChange: (e) => {
                      const val = e.target.value;
                      handleUpdateLocation(loc.id, (l) => ({ ...l, fixedDescription: val }));
                    },
                    className: "w-full bg-[#181824] border border-[#2c2c3e] rounded p-1.5 text-[11px] text-white focus:outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs4("div", { className: "bg-[#101016] p-2 rounded-lg border border-amber-500/20", children: [
                /* @__PURE__ */ jsxs4("label", { className: "text-[10px] uppercase font-mono text-amber-400 font-bold block mb-0.5 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[13px]", children: "wb_sunny" }),
                  "Paleta de Luz (Golden hour, neon, etc):"
                ] }),
                /* @__PURE__ */ jsx4(
                  "input",
                  {
                    type: "text",
                    value: loc.lightingPalette,
                    onChange: (e) => {
                      const val = e.target.value;
                      handleUpdateLocation(loc.id, (l) => ({ ...l, lightingPalette: val }));
                    },
                    className: "w-full bg-[#181824] border border-[#2c2c3e] rounded px-2 py-1 text-[11px] text-amber-300"
                  }
                )
              ] })
            ] })
          ] })
        },
        loc.id
      );
    }) }) }),
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between pt-4 border-t border-[#242433]", children: [
      /* @__PURE__ */ jsxs4(
        "button",
        {
          onClick: onBack,
          className: "px-4 py-2 bg-[#1b1b24] hover:bg-[#252533] text-zinc-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-[#2d2d3e] cursor-pointer",
          children: [
            /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[17px]", children: "arrow_back" }),
            /* @__PURE__ */ jsx4("span", { children: "Voltar ao Roteiro" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs4(
        "button",
        {
          onClick: onAdvance,
          className: "px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer",
          children: [
            /* @__PURE__ */ jsx4("span", { children: "Avan\xE7ar para Storyboard por Tomada" }),
            /* @__PURE__ */ jsx4("span", { className: "material-symbols-outlined text-[18px]", children: "arrow_forward" })
          ]
        }
      )
    ] })
  ] });
};

// virtual:components/StoryboardStep.tsx
import { useState as useState3, useRef as useRef2 } from "react";
import { Flow as Flow5 } from "flow-sdk";

// virtual:services/storyboardQueue.ts
import { Flow as Flow4 } from "flow-sdk";
var StoryboardBatchQueue = class {
  constructor(tasks, characters, locations, settings, onProgress) {
    __publicField(this, "queue", []);
    __publicField(this, "activeWorkers", 0);
    __publicField(this, "maxConcurrency", 2);
    // Máximo 2 gerações simultâneas
    __publicField(this, "isCancelled", false);
    __publicField(this, "onProgress");
    __publicField(this, "characters");
    __publicField(this, "locations");
    __publicField(this, "settings");
    this.queue = [...tasks];
    this.characters = characters;
    this.locations = locations;
    this.settings = settings;
    this.onProgress = onProgress;
  }
  start() {
    return new Promise((resolve) => {
      if (this.queue.length === 0) {
        resolve();
        return;
      }
      const checkNext = () => {
        if (this.isCancelled) {
          resolve();
          return;
        }
        if (this.queue.length === 0 && this.activeWorkers === 0) {
          resolve();
          return;
        }
        while (this.activeWorkers < this.maxConcurrency && this.queue.length > 0) {
          const task = this.queue.shift();
          if (task) {
            this.activeWorkers++;
            this.processTask(task).finally(() => {
              this.activeWorkers--;
              checkNext();
            });
          }
        }
      };
      checkNext();
    });
  }
  cancel() {
    this.isCancelled = true;
    this.queue = [];
  }
  async processTask(task) {
    const { sceneIndex, shotIndex, shot } = task;
    this.onProgress(sceneIndex, shotIndex, "generating");
    const { prompt, referenceMediaIds } = assembleShotImagePrompt(
      shot,
      this.characters,
      this.locations,
      this.settings
    );
    for (let attempt = 1; attempt <= 2; attempt++) {
      if (this.isCancelled) return;
      try {
        const refsToUse = attempt === 1 && referenceMediaIds.length > 0 ? referenceMediaIds : void 0;
        const result = await Flow4.generate.image({
          prompt,
          modelDisplayName: DEFAULT_IMAGE_MODEL,
          aspectRatio: this.settings.aspectRatio,
          referenceImageMediaIds: refsToUse
        });
        if (!result || !result.base64) {
          throw new Error("A IA n\xE3o retornou imagem v\xE1lida.");
        }
        this.onProgress(sceneIndex, shotIndex, "completed", {
          base64: result.base64,
          mimeType: result.mimeType || "image/jpeg",
          mediaId: result.mediaId
        });
        return;
      } catch (err) {
        console.warn(`[StoryboardQueue] Tentativa ${attempt} na tomada ${shot.shotId} falhou:`, err?.message);
        if (attempt === 2) {
          this.onProgress(sceneIndex, shotIndex, "error", {
            base64: "",
            mimeType: "",
            mediaId: "",
            error: err?.message || "Falha ao renderizar imagem"
          });
        } else {
          await new Promise((r) => setTimeout(r, 1200));
        }
      }
    }
  }
};

// virtual:components/StoryboardStep.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var StoryboardStep = ({
  scriptText,
  storyBible,
  setStoryBible,
  settings,
  onAdvance,
  onBack
}) => {
  const [shorteningShotId, setShorteningShotId] = useState3(null);
  const [generatingShotId, setGeneratingShotId] = useState3(null);
  const [isQueueRunning, setIsQueueRunning] = useState3(false);
  const [queueProgress, setQueueProgress] = useState3({ done: 0, total: 0 });
  const [error, setError] = useState3(null);
  const [infoNotice, setInfoNotice] = useState3(null);
  const activeQueueRef = useRef2(null);
  const characters = storyBible?.characters || [];
  const locations = storyBible?.locations || [];
  const bibleScenes = storyBible?.scenes || [];
  const handleUpdateShot = (sceneIndex, shotIndex, field, value) => {
    if (!storyBible) return;
    const updatedScenes = [...storyBible.scenes];
    const targetScene = updatedScenes[sceneIndex];
    if (!targetScene) return;
    const updatedShots = [...targetScene.shots];
    if (!updatedShots[shotIndex]) return;
    updatedShots[shotIndex] = {
      ...updatedShots[shotIndex],
      [field]: value
    };
    targetScene.shots = updatedShots;
    setStoryBible({
      ...storyBible,
      scenes: updatedScenes
    });
  };
  const handleShortenLine = async (sceneIndex, shotIndex, shot) => {
    setShorteningShotId(shot.shotId);
    setError(null);
    try {
      const shortened = await shortenDialogueWithAi(
        shot.dialogueLine,
        shot.durationSeconds,
        shot.speakerName || "Personagem",
        shot.visualAction
      );
      handleUpdateShot(sceneIndex, shotIndex, "dialogueLine", shortened);
      setInfoNotice(`Fala encurtada com sucesso para ${countWords(shortened)} palavras!`);
      setTimeout(() => setInfoNotice(null), 3e3);
    } catch (err) {
      console.error(err);
      setError("Falha ao encurtar fala com IA. Edite o texto manualmente.");
    } finally {
      setShorteningShotId(null);
    }
  };
  const handleGenerateShotImage = async (sceneIndex, shotIndex, shot, forcePureTextPrompt = false) => {
    setGeneratingShotId(shot.shotId);
    setError(null);
    handleUpdateShot(sceneIndex, shotIndex, "imageStatus", "generating");
    let referenceIds = [];
    let promptToUse = "";
    const { prompt, referenceMediaIds } = assembleShotImagePrompt(
      shot,
      characters,
      locations,
      settings
    );
    promptToUse = prompt;
    referenceIds = forcePureTextPrompt ? [] : referenceMediaIds;
    if (!forcePureTextPrompt && shot.isContinuationOfPrevious && shotIndex > 0) {
      const prevShot = bibleScenes[sceneIndex]?.shots[shotIndex - 1];
      if (prevShot && prevShot.imageMediaId) {
        referenceIds = [prevShot.imageMediaId, ...referenceIds.filter((id) => id !== prevShot.imageMediaId)];
        promptToUse = `Direct continuous visual cut of previous scene frame. Maintain identical lighting, position and mood. ${promptToUse}`;
      }
    }
    try {
      let result;
      try {
        result = await Flow5.generate.image({
          prompt: promptToUse,
          modelDisplayName: DEFAULT_IMAGE_MODEL,
          aspectRatio: settings.aspectRatio,
          referenceImageMediaIds: referenceIds.length > 0 ? referenceIds.slice(0, 5) : void 0
        });
      } catch (initialErr) {
        console.warn(`[Storyboard] 1\xAA tentativa falhou na tomada ${shot.shotId}. Tentando fallback sem refer\xEAncias...`, initialErr?.message);
        result = await Flow5.generate.image({
          prompt: promptToUse,
          modelDisplayName: DEFAULT_IMAGE_MODEL,
          aspectRatio: settings.aspectRatio
        });
      }
      if (!result || !result.base64) {
        throw new Error("A IA n\xE3o retornou imagem v\xE1lida para o quadro.");
      }
      if (!storyBible) return;
      const updatedScenes = [...storyBible.scenes];
      updatedScenes[sceneIndex].shots[shotIndex] = {
        ...updatedScenes[sceneIndex].shots[shotIndex],
        generatedImageBase64: result.base64,
        generatedMimeType: result.mimeType || "image/jpeg",
        imageMediaId: result.mediaId,
        imageStatus: "completed",
        lastError: void 0
      };
      setStoryBible({
        ...storyBible,
        scenes: updatedScenes
      });
      setInfoNotice(`Quadro da Tomada #${shot.shotId} gerado com sucesso!`);
      setTimeout(() => setInfoNotice(null), 3e3);
    } catch (err) {
      console.error(err);
      handleUpdateShot(sceneIndex, shotIndex, "imageStatus", "error");
      handleUpdateShot(sceneIndex, shotIndex, "lastError", err?.message || "Falha na gera\xE7\xE3o de imagem");
      setError(`Falha ao gerar quadro da Tomada ${shot.shotId}: ${err?.message || "Tente regenerar sem refer\xEAncias ou enviar uma imagem."}`);
    } finally {
      setGeneratingShotId(null);
    }
  };
  const handleUploadShotImage = async (sceneIndex, shotIndex) => {
    try {
      const selected = await Flow5.media.select({ filter: "image" });
      if (!selected || !selected.base64) return;
      if (!storyBible) return;
      const updatedScenes = [...storyBible.scenes];
      updatedScenes[sceneIndex].shots[shotIndex] = {
        ...updatedScenes[sceneIndex].shots[shotIndex],
        generatedImageBase64: selected.base64,
        generatedMimeType: selected.mimeType || "image/jpeg",
        imageMediaId: selected.mediaId,
        imageStatus: "completed",
        lastError: void 0
      };
      setStoryBible({
        ...storyBible,
        scenes: updatedScenes
      });
      setInfoNotice("Imagem vinculada com sucesso \xE0 tomada!");
      setTimeout(() => setInfoNotice(null), 3e3);
    } catch (err) {
      console.error(err);
      setError("Falha ao selecionar imagem da galeria.");
    }
  };
  const handleGenerateMissingQueue = async () => {
    if (!storyBible) return;
    const pendingTasks = [];
    storyBible.scenes.forEach((sc, scIdx) => {
      sc.shots.forEach((sh, shIdx) => {
        if (!sh.generatedImageBase64) {
          pendingTasks.push({ sceneIndex: scIdx, shotIndex: shIdx, shot: sh });
        }
      });
    });
    if (pendingTasks.length === 0) {
      setInfoNotice("Todas as tomadas j\xE1 possuem imagem gerada!");
      setTimeout(() => setInfoNotice(null), 3e3);
      return;
    }
    setIsQueueRunning(true);
    setQueueProgress({ done: 0, total: pendingTasks.length });
    setError(null);
    let completedCounter = 0;
    const queue = new StoryboardBatchQueue(
      pendingTasks,
      characters,
      locations,
      settings,
      (sceneIdx, shotIdx, status, result) => {
        if (status === "generating") {
          handleUpdateShot(sceneIdx, shotIdx, "imageStatus", "generating");
        } else if (status === "completed" && result) {
          completedCounter++;
          setQueueProgress({ done: completedCounter, total: pendingTasks.length });
          setStoryBible((prevBible) => {
            if (!prevBible) return prevBible;
            const updated = [...prevBible.scenes];
            if (updated[sceneIdx]?.shots[shotIdx]) {
              updated[sceneIdx].shots[shotIdx] = {
                ...updated[sceneIdx].shots[shotIdx],
                generatedImageBase64: result.base64,
                generatedMimeType: result.mimeType,
                imageMediaId: result.mediaId,
                imageStatus: "completed",
                lastError: void 0
              };
            }
            return { ...prevBible, scenes: updated };
          });
        } else if (status === "error") {
          handleUpdateShot(sceneIdx, shotIdx, "imageStatus", "error");
          if (result?.error) {
            handleUpdateShot(sceneIdx, shotIdx, "lastError", result.error);
          }
        }
      }
    );
    activeQueueRef.current = queue;
    try {
      await queue.start();
      setInfoNotice(`Fila de quadros finalizada (${completedCounter}/${pendingTasks.length})!`);
      setTimeout(() => setInfoNotice(null), 4e3);
    } catch (err) {
      console.error(err);
      setError("A fila de gera\xE7\xE3o encontrou instabilidade tempor\xE1ria.");
    } finally {
      setIsQueueRunning(false);
      activeQueueRef.current = null;
    }
  };
  const handleCancelQueue = () => {
    if (activeQueueRef.current) {
      activeQueueRef.current.cancel();
      setIsQueueRunning(false);
      setInfoNotice("Fila cancelada.");
      setTimeout(() => setInfoNotice(null), 3e3);
    }
  };
  const allShotsCount = bibleScenes.reduce((acc, sc) => acc + sc.shots.length, 0);
  const readyShotsCount = bibleScenes.reduce(
    (acc, sc) => acc + sc.shots.filter((s) => s.generatedImageBase64).length,
    0
  );
  const missingCount = allShotsCount - readyShotsCount;
  return /* @__PURE__ */ jsxs5("div", { className: "max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs5("div", { className: "bg-gradient-to-r from-[#171720] via-[#1a1a24] to-[#14141c] p-6 rounded-xl border border-[#272736] flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx5("span", { className: "text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20", children: "Fase 3 \u2022 Storyboard por Tomada" }),
          /* @__PURE__ */ jsxs5("span", { className: "text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20", children: [
            "Propor\xE7\xE3o: ",
            settings.aspectRatio,
            " \u2022 ",
            readyShotsCount,
            "/",
            allShotsCount,
            " Quadros Prontos"
          ] })
        ] }),
        /* @__PURE__ */ jsxs5("h2", { className: "text-xl md:text-2xl font-bold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-amber-400", children: "view_timeline" }),
          "3. Storyboard Decupado por Tomada"
        ] }),
        /* @__PURE__ */ jsx5("p", { className: "text-sm text-zinc-400 mt-1 max-w-2xl", children: "Cada tomada possui seu enquadramento, falas rigorosas e configura\xE7\xE3o de modelo individual para anima\xE7\xE3o posterior." })
      ] }),
      /* @__PURE__ */ jsx5("div", { className: "flex items-center gap-2", children: isQueueRunning ? /* @__PURE__ */ jsxs5(
        "button",
        {
          onClick: handleCancelQueue,
          className: "px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition-all",
          children: [
            /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-[17px]", children: "pause" }),
            /* @__PURE__ */ jsxs5("span", { children: [
              "Cancelar Fila (",
              queueProgress.done,
              "/",
              queueProgress.total,
              ")"
            ] })
          ]
        }
      ) : missingCount > 0 && /* @__PURE__ */ jsxs5(
        "button",
        {
          onClick: handleGenerateMissingQueue,
          disabled: generatingShotId !== null,
          className: "px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-[17px]", children: "auto_fix_high" }),
            /* @__PURE__ */ jsxs5("span", { children: [
              "Gerar Quadros Faltantes (",
              missingCount,
              ")"
            ] })
          ]
        }
      ) })
    ] }),
    isQueueRunning && /* @__PURE__ */ jsxs5("div", { className: "bg-[#151520] p-3.5 rounded-xl border border-amber-500/30 space-y-2", children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between text-xs font-mono", children: [
        /* @__PURE__ */ jsxs5("span", { className: "text-amber-300 flex items-center gap-1.5 font-bold", children: [
          /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-base animate-spin", children: "sync" }),
          "Fila Concorrente Ativa (Max 2 Simult\xE2neas com Fallback Autom\xE1tico)"
        ] }),
        /* @__PURE__ */ jsxs5("span", { className: "text-zinc-300", children: [
          queueProgress.done,
          " de ",
          queueProgress.total,
          " tomadas geradas (",
          Math.round(queueProgress.done / (queueProgress.total || 1) * 100),
          "%)"
        ] })
      ] }),
      /* @__PURE__ */ jsx5("div", { className: "w-full bg-[#0d0d12] h-2 rounded-full overflow-hidden border border-[#272738]", children: /* @__PURE__ */ jsx5(
        "div",
        {
          className: "bg-amber-500 h-full transition-all duration-300",
          style: { width: `${queueProgress.done / (queueProgress.total || 1) * 100}%` }
        }
      ) })
    ] }),
    infoNotice && /* @__PURE__ */ jsxs5("div", { className: "p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-emerald-400 text-base", children: "check_circle" }),
      /* @__PURE__ */ jsx5("span", { children: infoNotice })
    ] }),
    error && /* @__PURE__ */ jsxs5("div", { className: "p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-red-400 text-base", children: "warning" }),
        /* @__PURE__ */ jsx5("span", { children: error })
      ] }),
      /* @__PURE__ */ jsx5(
        "button",
        {
          onClick: () => setError(null),
          className: "text-xs text-red-300 hover:text-white underline cursor-pointer",
          children: "Fechar"
        }
      )
    ] }),
    !storyBible || bibleScenes.length === 0 ? /* @__PURE__ */ jsxs5("div", { className: "text-center py-16 bg-[#15151c] rounded-xl border border-dashed border-[#2d2d3d] space-y-3", children: [
      /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-4xl text-zinc-500", children: "movie_creation" }),
      /* @__PURE__ */ jsx5("p", { className: "text-sm text-zinc-300 font-semibold", children: "Nenhuma tomada estruturada no Story Bible." }),
      /* @__PURE__ */ jsxs5(
        "button",
        {
          onClick: onBack,
          className: "px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-lg inline-flex items-center gap-1.5 shadow",
          children: [
            /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-[16px]", children: "arrow_back" }),
            /* @__PURE__ */ jsx5("span", { children: "Voltar e Gerar Roteiro" })
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsx5("div", { className: "space-y-6", children: bibleScenes.map((scene, scIdx) => /* @__PURE__ */ jsxs5("div", { className: "bg-[#15151c] rounded-xl border border-[#272736] p-4 md:p-5 space-y-4", children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-[#242433] pb-3", children: [
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs5("span", { className: "px-2.5 py-1 bg-amber-500 text-black font-bold text-xs rounded-md font-mono", children: [
            "CENA #",
            scene.sceneNumber.toString().padStart(2, "0"),
            " \u2022 ATO ",
            scene.actNumber
          ] }),
          /* @__PURE__ */ jsx5("span", { className: "text-xs font-bold text-white", children: scene.title })
        ] }),
        /* @__PURE__ */ jsx5("div", { className: "flex items-center gap-3 text-[11px] font-mono text-zinc-400", children: /* @__PURE__ */ jsxs5("span", { className: "text-amber-300 font-bold bg-[#1e1e2c] px-2 py-0.5 rounded", children: [
          scene.shots.length,
          " tomadas"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx5("div", { className: "space-y-4", children: scene.shots.map((shot, shIdx) => {
        const words = countWords(shot.dialogueLine);
        const maxAllowedWords = WORD_LIMITS_BY_DURATION[shot.durationSeconds] || 14;
        const isWordCountExceeded = words > maxAllowedWords;
        const isGenerating = shot.imageStatus === "generating" || generatingShotId === shot.shotId;
        const currentShotModel = shot.videoModel || settings.defaultVideoModel;
        const currentShotRes = shot.videoResolution || settings.defaultResolution;
        const shotCredits = calculateShotCredits(currentShotModel, shot.durationSeconds, currentShotRes);
        const shotModelCap = VIDEO_MODELS_CAPABILITIES[currentShotModel] || VIDEO_MODELS_CAPABILITIES["Omni 1.1 Flash"];
        return /* @__PURE__ */ jsxs5(
          "div",
          {
            className: `bg-[#111117] rounded-xl border p-4 space-y-3 transition-all ${shot.imageStatus === "error" ? "border-red-500/50 bg-[#161113]" : "border-[#232332] hover:border-[#383850]"}`,
            children: [
              /* @__PURE__ */ jsxs5("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs5("span", { className: "px-2 py-0.5 bg-zinc-800 text-amber-300 font-mono text-xs font-bold rounded", children: [
                    "TOMADA #",
                    shIdx + 1,
                    " (",
                    shot.durationSeconds,
                    "s)"
                  ] }),
                  /* @__PURE__ */ jsxs5("span", { className: "text-xs text-zinc-400 font-mono", children: [
                    shot.shotType,
                    " \u2022 ",
                    shot.cameraMovement
                  ] }),
                  shIdx > 0 && /* @__PURE__ */ jsxs5("label", { className: "flex items-center gap-1 text-[11px] text-zinc-300 font-mono ml-2 cursor-pointer bg-[#191924] px-2 py-0.5 rounded border border-[#2b2b3d]", children: [
                    /* @__PURE__ */ jsx5(
                      "input",
                      {
                        type: "checkbox",
                        checked: Boolean(shot.isContinuationOfPrevious),
                        onChange: (e) => handleUpdateShot(scIdx, shIdx, "isContinuationOfPrevious", e.target.checked),
                        className: "accent-amber-500"
                      }
                    ),
                    /* @__PURE__ */ jsx5("span", { children: "Continuar plano da anterior" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs5(
                    "button",
                    {
                      onClick: () => handleUploadShotImage(scIdx, shIdx),
                      disabled: isGenerating,
                      className: "px-2.5 py-1 bg-[#1d1d2b] hover:bg-[#28283c] text-indigo-300 text-xs rounded-md border border-[#313146] flex items-center gap-1 cursor-pointer transition-all",
                      title: "Selecionar imagem da galeria para esta tomada",
                      children: [
                        /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-[15px]", children: "upload" }),
                        /* @__PURE__ */ jsx5("span", { children: "Enviar Imagem" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs5(
                    "button",
                    {
                      onClick: () => handleGenerateShotImage(scIdx, shIdx, shot, false),
                      disabled: isGenerating,
                      className: "px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-md flex items-center gap-1 cursor-pointer disabled:opacity-50",
                      children: [
                        /* @__PURE__ */ jsx5("span", { className: `material-symbols-outlined text-[15px] ${isGenerating ? "animate-spin" : ""}`, children: isGenerating ? "sync" : shot.generatedImageBase64 ? "refresh" : "photo_camera" }),
                        /* @__PURE__ */ jsx5("span", { children: isGenerating ? "Renderizando..." : shot.generatedImageBase64 ? "Regenerar" : "Gerar Quadro" })
                      ]
                    }
                  ),
                  shot.imageStatus === "error" && /* @__PURE__ */ jsxs5(
                    "button",
                    {
                      onClick: () => handleGenerateShotImage(scIdx, shIdx, shot, true),
                      disabled: isGenerating,
                      className: "px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white font-bold text-xs rounded-md flex items-center gap-1 cursor-pointer",
                      title: "Tenta gerar apenas com a descri\xE7\xE3o textual sem refer\xEAncias",
                      children: [
                        /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-[14px]", children: "bolt" }),
                        /* @__PURE__ */ jsx5("span", { children: "For\xE7ar sem refer\xEAncias" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-start", children: [
                /* @__PURE__ */ jsx5("div", { className: "lg:col-span-4", children: /* @__PURE__ */ jsxs5(
                  "div",
                  {
                    className: `relative ${settings.aspectRatio === "9:16" ? "aspect-[9/16] max-w-[210px] mx-auto" : "aspect-video"} bg-[#09090d] rounded-lg overflow-hidden border border-[#262638] flex items-center justify-center`,
                    children: [
                      shot.generatedImageBase64 ? /* @__PURE__ */ jsx5(
                        "img",
                        {
                          src: `data:${shot.generatedMimeType || "image/jpeg"};base64,${shot.generatedImageBase64}`,
                          alt: `Quadro Tomada ${shot.shotId}`,
                          className: "w-full h-full object-cover"
                        }
                      ) : /* @__PURE__ */ jsxs5("div", { className: "text-center p-3 space-y-1", children: [
                        /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-3xl text-zinc-600", children: "crop_original" }),
                        /* @__PURE__ */ jsx5("p", { className: "text-[10px] text-zinc-500 font-mono", children: "1\xBA Frame Pendente" }),
                        shot.lastError && /* @__PURE__ */ jsx5("span", { className: "text-[9px] text-red-400 block max-w-[170px] truncate", title: shot.lastError, children: shot.lastError })
                      ] }),
                      isGenerating && /* @__PURE__ */ jsxs5("div", { className: "absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 p-2 text-center", children: [
                        /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-amber-400 text-2xl animate-spin", children: "progress_activity" }),
                        /* @__PURE__ */ jsx5("span", { className: "text-[11px] text-amber-300 font-mono font-bold", children: "Gerando Quadro..." })
                      ] }),
                      shot.imageMediaId && /* @__PURE__ */ jsx5("span", { className: "absolute bottom-1.5 left-1.5 bg-black/80 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-300", children: "\u2713 mediaId salvo" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxs5("div", { className: "lg:col-span-8 space-y-3 text-xs", children: [
                  /* @__PURE__ */ jsxs5("div", { children: [
                    /* @__PURE__ */ jsx5("label", { className: "text-[10px] font-mono uppercase text-zinc-400 block mb-1", children: "A\xE7\xE3o Visual da Tomada:" }),
                    /* @__PURE__ */ jsx5(
                      "input",
                      {
                        type: "text",
                        value: shot.visualAction,
                        onChange: (e) => handleUpdateShot(scIdx, shIdx, "visualAction", e.target.value),
                        className: "w-full bg-[#171722] border border-[#29293a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs5("div", { className: "bg-[#14141e] p-3 rounded-lg border border-[#28283a] space-y-2", children: [
                    /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxs5("span", { className: "text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1", children: [
                        /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-[14px]", children: "record_voice_over" }),
                        "Falante da Tomada:"
                      ] }),
                      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxs5(
                          "span",
                          {
                            className: `text-[11px] font-mono px-2 py-0.5 rounded font-bold ${isWordCountExceeded ? "bg-red-950 text-red-400 border border-red-500/50 animate-pulse" : "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"}`,
                            children: [
                              words,
                              " / ",
                              maxAllowedWords,
                              " palavras (",
                              shot.durationSeconds,
                              "s)"
                            ]
                          }
                        ),
                        isWordCountExceeded && /* @__PURE__ */ jsxs5(
                          "button",
                          {
                            onClick: () => handleShortenLine(scIdx, shIdx, shot),
                            disabled: shorteningShotId === shot.shotId,
                            className: "px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] rounded flex items-center gap-1 cursor-pointer transition-all",
                            children: [
                              /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-[12px]", children: "auto_fix_high" }),
                              /* @__PURE__ */ jsx5("span", { children: shorteningShotId === shot.shotId ? "Encurtando..." : "Encurtar" })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
                      /* @__PURE__ */ jsx5("div", { children: /* @__PURE__ */ jsxs5(
                        "select",
                        {
                          value: shot.speakerCharacterId || "",
                          onChange: (e) => {
                            const cId = e.target.value;
                            const charObj = characters.find((c) => c.id === cId);
                            handleUpdateShot(scIdx, shIdx, "speakerCharacterId", cId || void 0);
                            handleUpdateShot(scIdx, shIdx, "speakerName", charObj ? charObj.name : "");
                          },
                          className: "w-full bg-[#101016] border border-[#2c2c3d] rounded px-2 py-1 text-xs text-amber-300 font-bold focus:outline-none",
                          children: [
                            /* @__PURE__ */ jsx5("option", { value: "", children: "(Sem fala / A\xE7\xE3o)" }),
                            characters.map((c) => /* @__PURE__ */ jsx5("option", { value: c.id, children: c.name }, c.id))
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsx5("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx5(
                        "input",
                        {
                          type: "text",
                          value: shot.dialogueLine,
                          onChange: (e) => handleUpdateShot(scIdx, shIdx, "dialogueLine", e.target.value),
                          placeholder: "Fala curta em Portugu\xEAs do Brasil...",
                          className: `w-full bg-[#101016] border rounded px-2.5 py-1 text-xs text-white focus:outline-none ${isWordCountExceeded ? "border-red-500/70" : "border-[#29293a] focus:border-amber-400"}`
                        }
                      ) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#12121a] p-2.5 rounded-lg border border-indigo-500/30", children: [
                    /* @__PURE__ */ jsxs5("div", { children: [
                      /* @__PURE__ */ jsx5("label", { className: "text-[10px] font-mono uppercase text-indigo-300 block mb-0.5", children: "Gerador de V\xEDdeo:" }),
                      /* @__PURE__ */ jsx5(
                        "select",
                        {
                          value: currentShotModel,
                          onChange: (e) => {
                            const newMod = e.target.value;
                            handleUpdateShot(scIdx, shIdx, "videoModel", newMod);
                            const cap = VIDEO_MODELS_CAPABILITIES[newMod];
                            if (!cap.supportedDurations.includes(shot.durationSeconds)) {
                              handleUpdateShot(scIdx, shIdx, "durationSeconds", cap.supportedDurations[0] || 8);
                            }
                          },
                          className: "w-full bg-[#181824] border border-[#2b2b3d] rounded px-2 py-1 text-[11px] text-white",
                          children: Object.keys(VIDEO_MODELS_CAPABILITIES).map((mn) => /* @__PURE__ */ jsx5("option", { value: mn, children: mn }, mn))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs5("div", { children: [
                      /* @__PURE__ */ jsx5("label", { className: "text-[10px] font-mono uppercase text-indigo-300 block mb-0.5", children: "Resolu\xE7\xE3o Alvo:" }),
                      /* @__PURE__ */ jsx5(
                        "select",
                        {
                          value: currentShotRes,
                          onChange: (e) => handleUpdateShot(scIdx, shIdx, "videoResolution", e.target.value),
                          className: "w-full bg-[#181824] border border-[#2b2b3d] rounded px-2 py-1 text-[11px] text-white",
                          children: shotModelCap.supportedResolutions.map((r) => /* @__PURE__ */ jsxs5("option", { value: r, children: [
                            r,
                            " ",
                            r === "360p" ? "(Rascunho R\xE1pido)" : "(Alta Qualidade)"
                          ] }, r))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs5("div", { className: "flex flex-col justify-end", children: [
                      /* @__PURE__ */ jsx5("span", { className: "text-[9px] font-mono text-zinc-400", children: "Custo Estimado:" }),
                      /* @__PURE__ */ jsxs5("span", { className: "text-xs font-mono font-bold text-amber-400", children: [
                        shotCredits,
                        " cr\xE9ditos"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: [
                    /* @__PURE__ */ jsxs5("div", { children: [
                      /* @__PURE__ */ jsx5("label", { className: "text-[9px] uppercase font-mono text-zinc-400 block mb-0.5", children: "Plano" }),
                      /* @__PURE__ */ jsx5(
                        "select",
                        {
                          value: shot.shotType,
                          onChange: (e) => handleUpdateShot(scIdx, shIdx, "shotType", e.target.value),
                          className: "w-full bg-[#171722] border border-[#29293a] rounded px-2 py-1 text-[11px] text-white",
                          children: SHOT_TYPES.map((st) => /* @__PURE__ */ jsx5("option", { value: st, children: st }, st))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs5("div", { children: [
                      /* @__PURE__ */ jsx5("label", { className: "text-[9px] uppercase font-mono text-zinc-400 block mb-0.5", children: "C\xE2mera" }),
                      /* @__PURE__ */ jsx5(
                        "select",
                        {
                          value: shot.cameraMovement,
                          onChange: (e) => handleUpdateShot(scIdx, shIdx, "cameraMovement", e.target.value),
                          className: "w-full bg-[#171722] border border-[#29293a] rounded px-2 py-1 text-[11px] text-white",
                          children: CAMERA_MOVEMENTS.map((cm) => /* @__PURE__ */ jsx5("option", { value: cm, children: cm }, cm))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs5("div", { className: "col-span-2 sm:col-span-1", children: [
                      /* @__PURE__ */ jsx5("label", { className: "text-[9px] uppercase font-mono text-zinc-400 block mb-0.5", children: "Emo\xE7\xE3o" }),
                      /* @__PURE__ */ jsx5(
                        "input",
                        {
                          type: "text",
                          value: shot.emotion,
                          onChange: (e) => handleUpdateShot(scIdx, shIdx, "emotion", e.target.value),
                          className: "w-full bg-[#171722] border border-[#29293a] rounded px-2 py-1 text-[11px] text-zinc-300"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] })
            ]
          },
          shot.shotId
        );
      }) })
    ] }, scene.sceneId)) }),
    /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between pt-4 border-t border-[#242433]", children: [
      /* @__PURE__ */ jsxs5(
        "button",
        {
          onClick: onBack,
          className: "px-4 py-2 bg-[#1b1b24] hover:bg-[#252533] text-zinc-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-[#2d2d3e] cursor-pointer",
          children: [
            /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-[17px]", children: "arrow_back" }),
            /* @__PURE__ */ jsx5("span", { children: "Voltar aos Ativos" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs5(
        "button",
        {
          onClick: onAdvance,
          disabled: !storyBible || bibleScenes.length === 0,
          className: "px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40 transition-all cursor-pointer",
          children: [
            /* @__PURE__ */ jsx5("span", { children: "Avan\xE7ar para Anima\xE7\xE3o & Timeline" }),
            /* @__PURE__ */ jsx5("span", { className: "material-symbols-outlined text-[18px]", children: "arrow_forward" })
          ]
        }
      )
    ] })
  ] });
};

// virtual:components/AnimationStep.tsx
import { useState as useState4, useRef as useRef3 } from "react";

// virtual:services/videoQueue.ts
import { Flow as Flow6 } from "flow-sdk";
var VideoAnimationQueue = class {
  constructor(tasks, characters, locations, settings, onProgress) {
    __publicField(this, "queue", []);
    __publicField(this, "activeWorkers", 0);
    __publicField(this, "maxConcurrency", 2);
    // Concorrência limitada e segura
    __publicField(this, "isCancelled", false);
    __publicField(this, "onProgress");
    __publicField(this, "characters");
    __publicField(this, "locations");
    __publicField(this, "settings");
    this.queue = [...tasks];
    this.characters = characters;
    this.locations = locations;
    this.settings = settings;
    this.onProgress = onProgress;
  }
  start() {
    return new Promise((resolve) => {
      if (this.queue.length === 0) {
        resolve();
        return;
      }
      const checkNext = () => {
        if (this.isCancelled) {
          resolve();
          return;
        }
        if (this.queue.length === 0 && this.activeWorkers === 0) {
          resolve();
          return;
        }
        while (this.activeWorkers < this.maxConcurrency && this.queue.length > 0) {
          const task = this.queue.shift();
          if (task) {
            this.activeWorkers++;
            this.processTask(task).finally(() => {
              this.activeWorkers--;
              checkNext();
            });
          }
        }
      };
      checkNext();
    });
  }
  cancel() {
    this.isCancelled = true;
    this.queue = [];
  }
  async processTask(task) {
    const { sceneIndex, shotIndex, shot, targetModel, targetResolution } = task;
    this.onProgress(sceneIndex, shotIndex, "generating");
    let firstFrameMediaId = shot.imageMediaId;
    if (!firstFrameMediaId && shot.generatedImageBase64) {
      try {
        const uploaded = await Flow6.upload({
          base64: shot.generatedImageBase64,
          mimeType: shot.generatedMimeType || "image/jpeg",
          name: `Shot_${shot.shotId}_Frame`
        });
        firstFrameMediaId = uploaded.mediaId;
      } catch (err) {
        this.onProgress(sceneIndex, shotIndex, "error", {
          base64: "",
          mimeType: "",
          mediaId: "",
          error: `Falha ao subir quadro da tomada: ${err?.message}`
        });
        return;
      }
    }
    if (!firstFrameMediaId) {
      this.onProgress(sceneIndex, shotIndex, "error", {
        base64: "",
        mimeType: "",
        mediaId: "",
        error: "Tomada sem quadro inicial gerado no Storyboard."
      });
      return;
    }
    const videoPrompt = assembleVideoPrompt(shot, this.characters, this.locations, this.settings);
    const cap = VIDEO_MODELS_CAPABILITIES[targetModel] || VIDEO_MODELS_CAPABILITIES["Omni 1.1 Flash"];
    let effectiveResolution = targetResolution;
    if (!cap.supportedResolutions.includes(targetResolution)) {
      effectiveResolution = cap.supportedResolutions[0] || "720p";
    }
    let effectiveDuration = shot.durationSeconds;
    if (!cap.supportedDurations.includes(shot.durationSeconds)) {
      effectiveDuration = cap.supportedDurations[0] || 8;
    }
    for (let attempt = 1; attempt <= 2; attempt++) {
      if (this.isCancelled) return;
      try {
        const videoResult = await Flow6.generate.video({
          prompt: videoPrompt,
          firstFrameImageMediaId: firstFrameMediaId,
          modelDisplayName: targetModel,
          aspectRatio: this.settings.aspectRatio,
          durationSeconds: effectiveDuration,
          resolution: effectiveResolution
        });
        this.onProgress(sceneIndex, shotIndex, "completed", {
          base64: videoResult.base64,
          mimeType: videoResult.mimeType,
          mediaId: videoResult.mediaId
        });
        return;
      } catch (err) {
        console.warn(`Tentativa ${attempt} falhou na anima\xE7\xE3o da tomada ${shot.shotId}:`, err?.message);
        if (attempt === 2) {
          this.onProgress(sceneIndex, shotIndex, "error", {
            base64: "",
            mimeType: "",
            mediaId: "",
            error: err?.message || "Falha na gera\xE7\xE3o de v\xEDdeo"
          });
        } else {
          await new Promise((r) => setTimeout(r, 2e3));
        }
      }
    }
  }
};

// virtual:components/AnimationStep.tsx
import { Fragment, jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var AnimationStep = ({
  storyBible,
  setStoryBible,
  settings,
  onAdvance,
  onBack
}) => {
  const [animatingShotId, setAnimatingShotId] = useState4(null);
  const [isQueueRunning, setIsQueueRunning] = useState4(false);
  const [queueProgress, setQueueProgress] = useState4({ done: 0, total: 0 });
  const [showConfirmModal, setShowConfirmModal] = useState4(false);
  const [confirmMode, setConfirmMode] = useState4("all");
  const [error, setError] = useState4(null);
  const [infoNotice, setInfoNotice] = useState4(null);
  const [activeShotPreview, setActiveShotPreview] = useState4(null);
  const [copiedShotId, setCopiedShotId] = useState4(null);
  const activeQueueRef = useRef3(null);
  const characters = storyBible?.characters || [];
  const locations = storyBible?.locations || [];
  const flattenedShots = [];
  storyBible?.scenes.forEach((sc, scIdx) => {
    sc.shots.forEach((sh, shIdx) => {
      flattenedShots.push({ sceneIdx: scIdx, shotIdx: shIdx, shot: sh });
    });
  });
  const totalShots = flattenedShots.length;
  const readyVideosCount = flattenedShots.filter((item) => item.shot.generatedVideoBase64).length;
  const approvedVideosCount = flattenedShots.filter((item) => item.shot.isApproved).length;
  const totalTimelineSeconds = flattenedShots.reduce((acc, item) => acc + item.shot.durationSeconds, 0);
  const totalEstimatedCredits = flattenedShots.reduce((acc, item) => {
    const model = item.shot.videoModel || settings.defaultVideoModel;
    const res = item.shot.videoResolution || settings.defaultResolution;
    return acc + calculateShotCredits(model, item.shot.durationSeconds, res);
  }, 0);
  const approved720pCredits = flattenedShots.filter((item) => item.shot.isApproved).reduce((acc, item) => {
    const model = item.shot.videoModel || settings.defaultVideoModel;
    return acc + calculateShotCredits(model, item.shot.durationSeconds, "720p");
  }, 0);
  const handleUpdateShotState = (sceneIdx, shotIdx, updater) => {
    if (!storyBible) return;
    const updatedScenes = [...storyBible.scenes];
    if (updatedScenes[sceneIdx]?.shots[shotIdx]) {
      updatedScenes[sceneIdx].shots[shotIdx] = updater(updatedScenes[sceneIdx].shots[shotIdx]);
      setStoryBible({ ...storyBible, scenes: updatedScenes });
    }
  };
  const handleToggleApprove = (sceneIdx, shotIdx) => {
    handleUpdateShotState(sceneIdx, shotIdx, (s) => ({ ...s, isApproved: !s.isApproved }));
  };
  const handleMoveShot = (sceneIdx, shotIdx, direction) => {
    if (!storyBible) return;
    const updatedScenes = [...storyBible.scenes];
    const targetScene = updatedScenes[sceneIdx];
    if (!targetScene) return;
    const newIdx = direction === "up" ? shotIdx - 1 : shotIdx + 1;
    if (newIdx < 0 || newIdx >= targetScene.shots.length) return;
    const [moved] = targetScene.shots.splice(shotIdx, 1);
    targetScene.shots.splice(newIdx, 0, moved);
    setStoryBible({ ...storyBible, scenes: updatedScenes });
  };
  const executeVideoQueue = (tasksToRun) => {
    if (tasksToRun.length === 0) {
      setInfoNotice("Nenhuma tomada pendente para anima\xE7\xE3o.");
      setTimeout(() => setInfoNotice(null), 3e3);
      return;
    }
    setIsQueueRunning(true);
    setQueueProgress({ done: 0, total: tasksToRun.length });
    setError(null);
    setShowConfirmModal(false);
    let completedCounter = 0;
    const queue = new VideoAnimationQueue(
      tasksToRun,
      characters,
      locations,
      settings,
      (sceneIdx, shotIdx, status, result) => {
        if (status === "generating") {
          handleUpdateShotState(sceneIdx, shotIdx, (s) => ({ ...s, videoStatus: "generating" }));
        } else if (status === "completed" && result) {
          completedCounter++;
          setQueueProgress({ done: completedCounter, total: tasksToRun.length });
          handleUpdateShotState(sceneIdx, shotIdx, (s) => ({
            ...s,
            generatedVideoBase64: result.base64,
            generatedVideoMimeType: result.mimeType,
            videoMediaId: result.mediaId,
            videoStatus: "completed",
            lastError: void 0
          }));
        } else if (status === "error") {
          handleUpdateShotState(sceneIdx, shotIdx, (s) => ({
            ...s,
            videoStatus: "error",
            lastError: result?.error || "Erro na renderiza\xE7\xE3o"
          }));
        }
      }
    );
    activeQueueRef.current = queue;
    queue.start().then(() => {
      setIsQueueRunning(false);
      activeQueueRef.current = null;
      setInfoNotice(`Anima\xE7\xF5es conclu\xEDdas com sucesso (${completedCounter}/${tasksToRun.length})!`);
      setTimeout(() => setInfoNotice(null), 4e3);
    });
  };
  const handleRequestAnimateAll = () => {
    setConfirmMode("all");
    setShowConfirmModal(true);
  };
  const handleRequestAnimateApproved720p = () => {
    if (approvedVideosCount === 0) {
      setError('Marque ao menos uma tomada como "Aprovada" na timeline para regerar em 720p.');
      return;
    }
    setConfirmMode("approved_720p");
    setShowConfirmModal(true);
  };
  const handleConfirmRun = () => {
    if (confirmMode === "all") {
      const tasks = flattenedShots.map((item) => ({
        sceneIndex: item.sceneIdx,
        shotIndex: item.shotIdx,
        shot: item.shot,
        targetModel: item.shot.videoModel || settings.defaultVideoModel,
        targetResolution: item.shot.videoResolution || settings.defaultResolution
      }));
      executeVideoQueue(tasks);
    } else {
      const approvedTasks = flattenedShots.filter((item) => item.shot.isApproved).map((item) => ({
        sceneIndex: item.sceneIdx,
        shotIndex: item.shotIdx,
        shot: item.shot,
        targetModel: item.shot.videoModel || settings.defaultVideoModel,
        targetResolution: "720p"
      }));
      executeVideoQueue(approvedTasks);
    }
  };
  const handleCancelQueue = () => {
    if (activeQueueRef.current) {
      activeQueueRef.current.cancel();
      setIsQueueRunning(false);
      setInfoNotice("Fila de v\xEDdeo cancelada pelo usu\xE1rio.");
      setTimeout(() => setInfoNotice(null), 3e3);
    }
  };
  const handleAnimateSingleShot = (sceneIdx, shotIdx, shot) => {
    const targetModel = shot.videoModel || settings.defaultVideoModel;
    const targetResolution = shot.videoResolution || settings.defaultResolution;
    const task = {
      sceneIndex: sceneIdx,
      shotIndex: shotIdx,
      shot,
      targetModel,
      targetResolution
    };
    executeVideoQueue([task]);
  };
  const handleCopyPrompt = (shot) => {
    const prompt = assembleVideoPrompt(shot, characters, locations, settings);
    navigator.clipboard.writeText(prompt);
    setCopiedShotId(shot.shotId);
    setTimeout(() => setCopiedShotId(null), 2500);
  };
  return /* @__PURE__ */ jsxs6("div", { className: "max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs6("div", { className: "bg-gradient-to-r from-[#171720] via-[#1a1a24] to-[#14141c] p-6 rounded-xl border border-[#272736] flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx6("span", { className: "text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20", children: "Fase 3 \u2022 Timeline & Anima\xE7\xE3o" }),
          /* @__PURE__ */ jsxs6("span", { className: "text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20", children: [
            readyVideosCount,
            "/",
            totalShots,
            " Prontos \u2022 ",
            approvedVideosCount,
            " Aprovadas \u2022 Dura\xE7\xE3o: ",
            totalTimelineSeconds,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxs6("h2", { className: "text-xl md:text-2xl font-bold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-amber-400", children: "movie" }),
          "4. Timeline & Gerador de V\xEDdeo"
        ] }),
        /* @__PURE__ */ jsxs6("p", { className: "text-sm text-zinc-400 mt-1 max-w-2xl", children: [
          "Fluxo recomendado: gere as tomadas em ",
          /* @__PURE__ */ jsx6("strong", { children: "360p" }),
          " para aprovar na timeline e depois regere em ",
          /* @__PURE__ */ jsx6("strong", { children: "720p" }),
          " apenas as tomadas aprovadas economizando cr\xE9ditos."
        ] })
      ] }),
      /* @__PURE__ */ jsx6("div", { className: "flex flex-wrap items-center gap-2", children: isQueueRunning ? /* @__PURE__ */ jsxs6(
        "button",
        {
          onClick: handleCancelQueue,
          className: "px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition-all",
          children: [
            /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[17px]", children: "pause" }),
            /* @__PURE__ */ jsxs6("span", { children: [
              "Cancelar (",
              queueProgress.done,
              "/",
              queueProgress.total,
              ")"
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxs6(Fragment, { children: [
        approvedVideosCount > 0 && /* @__PURE__ */ jsxs6(
          "button",
          {
            onClick: handleRequestAnimateApproved720p,
            className: "px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition-all",
            title: "Regera somente as tomadas aprovadas em 720p de alta qualidade",
            children: [
              /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[17px]", children: "verified" }),
              /* @__PURE__ */ jsxs6("span", { children: [
                "Regerar ",
                approvedVideosCount,
                " Aprovadas (720p)"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs6(
          "button",
          {
            onClick: handleRequestAnimateAll,
            disabled: totalShots === 0,
            className: "px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50 transition-all",
            children: [
              /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[17px]", children: "motion_photos_auto" }),
              /* @__PURE__ */ jsx6("span", { children: "Animar Todas as Tomadas" })
            ]
          }
        )
      ] }) })
    ] }),
    isQueueRunning && /* @__PURE__ */ jsxs6("div", { className: "bg-[#151520] p-3.5 rounded-xl border border-amber-500/30 space-y-2", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between text-xs font-mono", children: [
        /* @__PURE__ */ jsxs6("span", { className: "text-amber-300 flex items-center gap-1.5 font-bold", children: [
          /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-base animate-spin", children: "sync" }),
          "Fila de Anima\xE7\xE3o Ativa (Concorr\xEAncia 2 \u2022 Retry Autom\xE1tico)"
        ] }),
        /* @__PURE__ */ jsxs6("span", { className: "text-zinc-300", children: [
          queueProgress.done,
          " de ",
          queueProgress.total,
          " processadas (",
          Math.round(queueProgress.done / (queueProgress.total || 1) * 100),
          "%)"
        ] })
      ] }),
      /* @__PURE__ */ jsx6("div", { className: "w-full bg-[#0d0d12] h-2 rounded-full overflow-hidden border border-[#272738]", children: /* @__PURE__ */ jsx6(
        "div",
        {
          className: "bg-amber-500 h-full transition-all duration-300",
          style: { width: `${queueProgress.done / (queueProgress.total || 1) * 100}%` }
        }
      ) })
    ] }),
    infoNotice && /* @__PURE__ */ jsxs6("div", { className: "p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-emerald-400 text-base", children: "check_circle" }),
      /* @__PURE__ */ jsx6("span", { children: infoNotice })
    ] }),
    error && /* @__PURE__ */ jsxs6("div", { className: "p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-red-400 text-base", children: "warning" }),
      /* @__PURE__ */ jsx6("span", { children: error })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "bg-[#15151c] p-4 md:p-5 rounded-xl border border-[#262633] space-y-4", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-[#232330] pb-2.5", children: [
        /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-amber-400 text-base", children: "view_carousel" }),
          /* @__PURE__ */ jsxs6("span", { className: "text-xs font-bold uppercase font-mono text-white", children: [
            "Timeline Sequencial do Filme (",
            totalTimelineSeconds,
            "s no total)"
          ] })
        ] }),
        /* @__PURE__ */ jsx6("span", { className: "text-[11px] font-mono text-zinc-400", children: "Clique na tomada para pr\xE9-visualizar ou use as setas para reordenar" })
      ] }),
      /* @__PURE__ */ jsx6("div", { className: "flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin", children: flattenedShots.map((item, idx) => {
        const hasVideo = Boolean(item.shot.generatedVideoBase64);
        const isSelected = activeShotPreview?.shotId === item.shot.shotId;
        return /* @__PURE__ */ jsxs6(
          "div",
          {
            onClick: () => setActiveShotPreview(item.shot),
            className: `flex-shrink-0 w-36 rounded-lg p-2 border cursor-pointer transition-all ${isSelected ? "bg-[#221e14] border-amber-500 ring-2 ring-amber-500/40" : item.shot.isApproved ? "bg-[#121c15] border-emerald-500/60" : "bg-[#101016] border-[#252538] hover:border-zinc-500"}`,
            children: [
              /* @__PURE__ */ jsxs6("div", { className: "relative aspect-video bg-[#08080c] rounded overflow-hidden mb-1.5 flex items-center justify-center", children: [
                hasVideo ? /* @__PURE__ */ jsx6(
                  "video",
                  {
                    src: `data:${item.shot.generatedVideoMimeType || "video/mp4"};base64,${item.shot.generatedVideoBase64}`,
                    className: "w-full h-full object-cover"
                  }
                ) : item.shot.generatedImageBase64 ? /* @__PURE__ */ jsx6(
                  "img",
                  {
                    src: `data:${item.shot.generatedMimeType || "image/jpeg"};base64,${item.shot.generatedImageBase64}`,
                    alt: "",
                    className: "w-full h-full object-cover"
                  }
                ) : /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-zinc-600 text-xl", children: "image" }),
                /* @__PURE__ */ jsxs6("span", { className: "absolute top-1 left-1 bg-black/80 px-1 rounded text-[8px] font-mono text-amber-300", children: [
                  "T",
                  idx + 1,
                  " (",
                  item.shot.durationSeconds,
                  "s)"
                ] }),
                item.shot.isApproved && /* @__PURE__ */ jsx6("span", { className: "absolute top-1 right-1 bg-emerald-500 text-black rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold", children: "\u2713" })
              ] }),
              /* @__PURE__ */ jsx6("div", { className: "text-[10px] truncate text-white font-semibold", children: item.shot.speakerName ? `${item.shot.speakerName}: "${item.shot.dialogueLine}"` : item.shot.visualAction }),
              /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between text-[9px] text-zinc-400 font-mono mt-1 pt-1 border-t border-[#1e1e2d]", children: [
                /* @__PURE__ */ jsx6("span", { className: hasVideo ? "text-emerald-400 font-bold" : "text-zinc-500", children: hasVideo ? item.shot.videoResolution || "360p" : "Pendente" }),
                /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-0.5", children: [
                  /* @__PURE__ */ jsx6(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        handleMoveShot(item.sceneIdx, item.shotIdx, "up");
                      },
                      disabled: item.shotIdx === 0,
                      className: "p-0.5 hover:text-white disabled:opacity-20 cursor-pointer",
                      title: "Mover antes",
                      children: "\u25C0"
                    }
                  ),
                  /* @__PURE__ */ jsx6(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        handleMoveShot(item.sceneIdx, item.shotIdx, "down");
                      },
                      disabled: item.shotIdx === (storyBible?.scenes[item.sceneIdx]?.shots.length || 0) - 1,
                      className: "p-0.5 hover:text-white disabled:opacity-20 cursor-pointer",
                      title: "Mover depois",
                      children: "\u25B6"
                    }
                  )
                ] })
              ] })
            ]
          },
          item.shot.shotId
        );
      }) })
    ] }),
    activeShotPreview && /* @__PURE__ */ jsxs6("div", { className: "bg-[#121218] p-4 rounded-xl border border-amber-500/40 space-y-3", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between border-b border-[#232332] pb-2", children: [
        /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-amber-400", children: "smart_display" }),
          /* @__PURE__ */ jsxs6("span", { className: "text-xs font-bold text-white font-mono uppercase", children: [
            "Monitor de Pr\xE9-visualiza\xE7\xE3o da Tomada #",
            activeShotPreview.shotId
          ] })
        ] }),
        /* @__PURE__ */ jsx6(
          "button",
          {
            onClick: () => setActiveShotPreview(null),
            className: "text-zinc-400 hover:text-white text-xs cursor-pointer",
            children: "Fechar monitor"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-center", children: [
        /* @__PURE__ */ jsx6("div", { className: `relative ${settings.aspectRatio === "9:16" ? "aspect-[9/16] max-w-[260px] mx-auto" : "aspect-video"} bg-black rounded-lg overflow-hidden flex items-center justify-center border border-[#2b2b3d]`, children: activeShotPreview.generatedVideoBase64 ? /* @__PURE__ */ jsx6(
          "video",
          {
            src: `data:${activeShotPreview.generatedVideoMimeType || "video/mp4"};base64,${activeShotPreview.generatedVideoBase64}`,
            controls: true,
            autoPlay: true,
            loop: true,
            className: "w-full h-full object-cover"
          }
        ) : activeShotPreview.generatedImageBase64 ? /* @__PURE__ */ jsx6(
          "img",
          {
            src: `data:${activeShotPreview.generatedMimeType || "image/jpeg"};base64,${activeShotPreview.generatedImageBase64}`,
            alt: "",
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsx6("span", { className: "text-xs text-zinc-500 font-mono", children: "Quadro n\xE3o gerado" }) }),
        /* @__PURE__ */ jsxs6("div", { className: "space-y-2 text-xs", children: [
          /* @__PURE__ */ jsxs6("div", { className: "bg-[#171724] p-3 rounded-lg border border-[#2c2c40]", children: [
            /* @__PURE__ */ jsx6("strong", { className: "text-amber-400 block mb-1 font-mono uppercase text-[10px]", children: "Template Fixo do Prompt de V\xEDdeo:" }),
            /* @__PURE__ */ jsx6("p", { className: "text-[11px] text-zinc-200 font-mono leading-relaxed bg-[#0c0c12] p-2 rounded border border-[#242436]", children: assembleVideoPrompt(activeShotPreview, characters, locations, settings) })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2 pt-1", children: [
            /* @__PURE__ */ jsxs6(
              "button",
              {
                onClick: () => {
                  const idxObj = flattenedShots.find((f) => f.shot.shotId === activeShotPreview.shotId);
                  if (idxObj) handleToggleApprove(idxObj.sceneIdx, idxObj.shotIdx);
                  setActiveShotPreview((prev) => prev ? { ...prev, isApproved: !prev.isApproved } : null);
                },
                className: `px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${activeShotPreview.isApproved ? "bg-emerald-500 text-black" : "bg-[#222230] text-zinc-300 hover:text-white border border-[#34344d]"}`,
                children: [
                  /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[16px]", children: activeShotPreview.isApproved ? "check_circle" : "radio_button_unchecked" }),
                  /* @__PURE__ */ jsx6("span", { children: activeShotPreview.isApproved ? "Tomada Aprovada \u2713" : "Marcar como Aprovada" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs6(
              "button",
              {
                onClick: () => handleCopyPrompt(activeShotPreview),
                className: "px-3 py-1.5 bg-[#222230] hover:bg-[#2b2b40] text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-[#323246] cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[15px]", children: "content_copy" }),
                  /* @__PURE__ */ jsx6("span", { children: copiedShotId === activeShotPreview.shotId ? "Copiado!" : "Copiar Prompt" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx6("div", { className: `grid grid-cols-1 ${settings.aspectRatio === "9:16" ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"} gap-5`, children: flattenedShots.map(({ sceneIdx, shotIdx, shot }) => {
      const isGenerating = shot.videoStatus === "generating" || animatingShotId === shot.shotId;
      const hasVideo = Boolean(shot.generatedVideoBase64);
      const hasImage = Boolean(shot.generatedImageBase64);
      const shotModel = shot.videoModel || settings.defaultVideoModel;
      const shotRes = shot.videoResolution || settings.defaultResolution;
      const credits = calculateShotCredits(shotModel, shot.durationSeconds, shotRes);
      return /* @__PURE__ */ jsxs6(
        "div",
        {
          className: `bg-[#15151c] rounded-xl border overflow-hidden flex flex-col justify-between shadow-sm transition-all ${shot.isApproved ? "border-emerald-500/50 ring-1 ring-emerald-500/30" : "border-[#272736] hover:border-[#383850]"}`,
          children: [
            /* @__PURE__ */ jsxs6("div", { className: `relative ${settings.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video"} bg-[#0c0c10] flex items-center justify-center overflow-hidden border-b border-[#232332]`, children: [
              hasVideo ? /* @__PURE__ */ jsx6(
                "video",
                {
                  src: `data:${shot.generatedVideoMimeType || "video/mp4"};base64,${shot.generatedVideoBase64}`,
                  controls: true,
                  autoPlay: true,
                  loop: true,
                  className: "w-full h-full object-cover"
                }
              ) : hasImage ? /* @__PURE__ */ jsx6(
                "img",
                {
                  src: `data:${shot.generatedMimeType || "image/jpeg"};base64,${shot.generatedImageBase64}`,
                  alt: "",
                  className: "w-full h-full object-cover opacity-85"
                }
              ) : /* @__PURE__ */ jsxs6("div", { className: "text-center p-4", children: [
                /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-3xl text-zinc-600", children: "hide_image" }),
                /* @__PURE__ */ jsx6("p", { className: "text-[11px] text-zinc-500 font-mono mt-1", children: "Gere o quadro no Storyboard" })
              ] }),
              isGenerating && /* @__PURE__ */ jsxs6("div", { className: "absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2 p-3 text-center", children: [
                /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-amber-400 text-3xl animate-spin", children: "progress_activity" }),
                /* @__PURE__ */ jsxs6("span", { className: "text-xs text-amber-300 font-mono font-bold", children: [
                  "Animando via ",
                  shotModel,
                  "..."
                ] }),
                /* @__PURE__ */ jsxs6("span", { className: "text-[10px] text-zinc-400 font-mono", children: [
                  shotRes,
                  " \u2022 Lip-sync em PT-BR"
                ] })
              ] }),
              /* @__PURE__ */ jsxs6("span", { className: "absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-white/10 font-mono text-[10px] font-bold", children: [
                "TOMADA #",
                shot.shotId,
                " (",
                shot.durationSeconds,
                "s)"
              ] }),
              /* @__PURE__ */ jsx6("div", { className: "absolute top-2 right-2 flex items-center gap-1", children: /* @__PURE__ */ jsxs6(
                "button",
                {
                  onClick: () => handleToggleApprove(sceneIdx, shotIdx),
                  className: `px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${shot.isApproved ? "bg-emerald-500 text-black" : "bg-black/80 text-zinc-400 hover:text-white border border-[#35354a]"}`,
                  children: [
                    /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[13px]", children: shot.isApproved ? "check" : "radio_button_unchecked" }),
                    /* @__PURE__ */ jsx6("span", { children: shot.isApproved ? "Aprovada" : "Aprovar" })
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs6("div", { className: "p-3.5 space-y-2.5 flex-1 flex flex-col justify-between text-xs", children: [
              /* @__PURE__ */ jsxs6("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between text-[10px] text-zinc-400 font-mono", children: [
                  /* @__PURE__ */ jsxs6("span", { children: [
                    shotModel,
                    " (",
                    shotRes,
                    ")"
                  ] }),
                  /* @__PURE__ */ jsxs6("span", { className: "text-amber-400 font-bold", children: [
                    credits,
                    " cr\xE9ditos"
                  ] })
                ] }),
                /* @__PURE__ */ jsx6("p", { className: "text-zinc-200 line-clamp-2", children: shot.visualAction }),
                shot.speakerName && shot.dialogueLine ? /* @__PURE__ */ jsxs6("div", { className: "bg-[#101016] p-2 rounded-lg border border-amber-500/20 text-xs", children: [
                  /* @__PURE__ */ jsxs6("strong", { className: "text-amber-400 mr-1", children: [
                    shot.speakerName,
                    ":"
                  ] }),
                  /* @__PURE__ */ jsxs6("span", { className: "italic text-white", children: [
                    '"',
                    shot.dialogueLine,
                    '"'
                  ] })
                ] }) : /* @__PURE__ */ jsx6("div", { className: "text-[10px] text-zinc-500 font-mono italic", children: "(Sem di\xE1logo \u2022 Apenas som ambiente)" }),
                shot.lastError && /* @__PURE__ */ jsxs6("div", { className: "text-[10px] text-red-400 bg-red-950/40 p-1.5 rounded border border-red-500/30", children: [
                  "Erro: ",
                  shot.lastError
                ] })
              ] }),
              /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2 pt-2 border-t border-[#232330]", children: [
                /* @__PURE__ */ jsxs6(
                  "button",
                  {
                    onClick: () => handleAnimateSingleShot(sceneIdx, shotIdx, shot),
                    disabled: isGenerating || !hasImage,
                    className: "flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 transition-all",
                    children: [
                      /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[15px]", children: hasVideo ? "replay" : "movie" }),
                      /* @__PURE__ */ jsx6("span", { children: hasVideo ? `Regerar (${shotRes})` : `Animar (${shot.durationSeconds}s)` })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx6(
                  "button",
                  {
                    onClick: () => handleCopyPrompt(shot),
                    className: "py-1.5 px-2 bg-[#1e1e2b] hover:bg-[#28283a] text-zinc-300 text-xs rounded-lg border border-[#303044] flex items-center gap-1 cursor-pointer",
                    title: "Copiar prompt da tomada",
                    children: /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[15px] text-indigo-400", children: copiedShotId === shot.shotId ? "done" : "content_copy" })
                  }
                )
              ] })
            ] })
          ]
        },
        shot.shotId
      );
    }) }),
    showConfirmModal && /* @__PURE__ */ jsx6("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs", children: /* @__PURE__ */ jsxs6("div", { className: "bg-[#14141c] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4", children: [
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-3 border-b border-[#242433] pb-3", children: [
        /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-amber-400 text-2xl", children: "toll" }),
        /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx6("h3", { className: "text-sm font-bold text-white", children: "Confirma\xE7\xE3o de Gera\xE7\xE3o de V\xEDdeo" }),
          /* @__PURE__ */ jsx6("span", { className: "text-[11px] font-mono text-zinc-400", children: confirmMode === "all" ? "Animar todas as tomadas" : "Regerar aprovadas em 720p" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "space-y-3 text-xs text-zinc-300 leading-relaxed", children: [
        /* @__PURE__ */ jsxs6("div", { className: "bg-[#1a1a26] p-3 rounded-xl border border-amber-500/30", children: [
          /* @__PURE__ */ jsx6("span", { className: "text-[10px] uppercase font-mono text-zinc-400 block mb-0.5", children: "Estimativa Total de Cr\xE9ditos:" }),
          /* @__PURE__ */ jsx6("span", { className: "text-2xl font-mono font-bold text-amber-400", children: confirmMode === "all" ? `~${totalEstimatedCredits} cr\xE9ditos` : `~${approved720pCredits} cr\xE9ditos` }),
          /* @__PURE__ */ jsx6("span", { className: "text-[11px] text-zinc-400 block mt-1", children: confirmMode === "all" ? `Renderiza\xE7\xE3o de ${totalShots} tomadas com modelo ${settings.defaultVideoModel}.` : `Regera\xE7\xE3o em alta defini\xE7\xE3o (720p) para as ${approvedVideosCount} tomadas aprovadas.` })
        ] }),
        /* @__PURE__ */ jsx6("p", { className: "text-[11px] text-zinc-400", children: "A fila executar\xE1 at\xE9 2 gera\xE7\xF5es simult\xE2neas com retry autom\xE1tico de 1 tentativa em caso de instabilidade. Deseja prosseguir?" })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-end gap-2 pt-2 border-t border-[#242433]", children: [
        /* @__PURE__ */ jsx6(
          "button",
          {
            onClick: () => setShowConfirmModal(false),
            className: "px-4 py-2 bg-[#20202e] hover:bg-[#28283a] text-zinc-300 font-semibold text-xs rounded-lg cursor-pointer",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsxs6(
          "button",
          {
            onClick: handleConfirmRun,
            className: "px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow cursor-pointer transition-all",
            children: [
              /* @__PURE__ */ jsx6("span", { children: "Confirmar e Iniciar" }),
              /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[16px]", children: "play_arrow" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between pt-4 border-t border-[#242433]", children: [
      /* @__PURE__ */ jsxs6(
        "button",
        {
          onClick: onBack,
          className: "px-4 py-2 bg-[#1b1b24] hover:bg-[#252533] text-zinc-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-[#2d2d3e] cursor-pointer",
          children: [
            /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[17px]", children: "arrow_back" }),
            /* @__PURE__ */ jsx6("span", { children: "Voltar ao Storyboard" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs6(
        "button",
        {
          onClick: onAdvance,
          className: "px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer",
          children: [
            /* @__PURE__ */ jsx6("span", { children: "Ir para Exporta\xE7\xE3o & Pacotes ZIP" }),
            /* @__PURE__ */ jsx6("span", { className: "material-symbols-outlined text-[18px]", children: "arrow_forward" })
          ]
        }
      )
    ] })
  ] });
};

// virtual:components/ExportStep.tsx
import { useState as useState5 } from "react";
import { Flow as Flow7 } from "flow-sdk";
import JSZip from "jszip";

// virtual:services/srtGenerator.ts
function formatSrtTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor(totalSeconds % 1 * 1e3);
  const pad = (n, z = 2) => n.toString().padStart(z, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}
function generateSrtContent(bible) {
  const blocks = [];
  let currentTime = 0;
  let srtIndex = 1;
  bible.scenes.forEach((scene) => {
    scene.shots.forEach((shot) => {
      const shotDuration = shot.durationSeconds || 6;
      const startTime = currentTime;
      const endTime = currentTime + shotDuration;
      if (shot.dialogueLine && shot.dialogueLine.trim().length > 0) {
        const speaker = shot.speakerName ? `${shot.speakerName.toUpperCase()}: ` : "";
        const text = `${speaker}${shot.dialogueLine.trim()}`;
        blocks.push(
          `${srtIndex}
${formatSrtTime(startTime)} --> ${formatSrtTime(endTime)}
${text}
`
        );
        srtIndex++;
      }
      currentTime += shotDuration;
    });
  });
  return blocks.join("\n");
}
function generateDialogueByCharacter(bible) {
  const characterLines = {};
  let currentTime = 0;
  bible.scenes.forEach((scene) => {
    scene.shots.forEach((shot) => {
      const duration = shot.durationSeconds || 6;
      const tc = `${Math.floor(currentTime / 60)}m${Math.floor(currentTime % 60)}s`;
      if (shot.dialogueLine && shot.dialogueLine.trim().length > 0) {
        const charName = shot.speakerName || "Narrador / Voz Off";
        if (!characterLines[charName]) {
          characterLines[charName] = [];
        }
        characterLines[charName].push({
          timecode: tc,
          line: shot.dialogueLine.trim(),
          emotion: shot.emotion || "neutro",
          shotId: shot.shotId
        });
      }
      currentTime += duration;
    });
  });
  const output = [];
  output.push(`=======================================================`);
  output.push(`SANJA DARK STUDIO \u2022 FALAS SEPARADAS POR PERSONAGEM`);
  output.push(`Produ\xE7\xE3o: ${bible.title}`);
  output.push(`=======================================================
`);
  for (const [char, lines] of Object.entries(characterLines)) {
    output.push(`### PERSONAGEM: ${char.toUpperCase()} (${lines.length} falas)`);
    lines.forEach((l) => {
      output.push(`  [${l.timecode} | Tomada ${l.shotId}] (${l.emotion}): "${l.line}"`);
    });
    output.push("");
  }
  return output.join("\n");
}

// virtual:components/ExportStep.tsx
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var ExportStep = ({
  title,
  scriptText,
  storyBible,
  settings,
  onBack,
  onSaveProject
}) => {
  const [isExportingZip, setIsExportingZip] = useState5(false);
  const [zipSuccess, setZipSuccess] = useState5(false);
  const [isExportingSrt, setIsExportingSrt] = useState5(false);
  const [isExportingBibleJson, setIsExportingBibleJson] = useState5(false);
  const [error, setError] = useState5(null);
  const sanitize = (name) => name.replace(/[^a-zA-Z0-9_\-]/g, "_").replace(/_+/g, "_").slice(0, 30) || "projeto";
  const handleExportBibleJson = async () => {
    if (!storyBible) {
      setError("Story Bible n\xE3o inicializado.");
      return;
    }
    setIsExportingBibleJson(true);
    try {
      const jsonContent = JSON.stringify(storyBible, null, 2);
      const bytes = new TextEncoder().encode(jsonContent);
      const base64 = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
      await Flow7.download({
        base64,
        mimeType: "application/json",
        filename: `${sanitize(title)}_story_bible.json`
      });
    } catch (err) {
      console.error(err);
      setError("Erro ao exportar Story Bible em JSON.");
    } finally {
      setIsExportingBibleJson(false);
    }
  };
  const handleExportSrt = async () => {
    if (!storyBible) return;
    setIsExportingSrt(true);
    try {
      const srtText = generateSrtContent(storyBible);
      const bytes = new TextEncoder().encode(srtText);
      const base64 = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
      await Flow7.download({
        base64,
        mimeType: "text/plain",
        filename: `${sanitize(title)}_legendas.srt`
      });
    } catch (err) {
      console.error(err);
      setError("Falha ao exportar legenda .SRT.");
    } finally {
      setIsExportingSrt(false);
    }
  };
  const handleExportFullZip = async () => {
    if (!storyBible) {
      setError("Story Bible vazio.");
      return;
    }
    setIsExportingZip(true);
    setZipSuccess(false);
    setError(null);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder(sanitize(title) || "Sanja_Dark_Studio");
      rootFolder?.file("STORY_BIBLE.json", JSON.stringify(storyBible, null, 2));
      rootFolder?.file("ROTEIRO_COMPLETO.txt", scriptText);
      const characterDialogues = generateDialogueByCharacter(storyBible);
      rootFolder?.file("FALAS_POR_PERSONAGEM.txt", characterDialogues);
      const srtContent = generateSrtContent(storyBible);
      rootFolder?.file("LEGENDAS.srt", srtContent);
      const promptsLog = [];
      promptsLog.push(`=== PROMPTS DE IMAGEM E V\xCDDEO \u2022 SANJA DARK STUDIO ===
`);
      storyBible.scenes.forEach((sc) => {
        sc.shots.forEach((sh, shIdx) => {
          const shotTag = `S${sc.sceneNumber.toString().padStart(2, "0")}_T${(shIdx + 1).toString().padStart(2, "0")}`;
          const imgP = assembleShotImagePrompt(sh, storyBible.characters, storyBible.locations, settings);
          const vidP = assembleVideoPrompt(sh, storyBible.characters, storyBible.locations, settings);
          promptsLog.push(`[${shotTag} - ${sh.durationSeconds}s]`);
          promptsLog.push(`Prompt Imagem: ${imgP.prompt}`);
          promptsLog.push(`Prompt V\xEDdeo (${sh.videoModel || settings.defaultVideoModel}): ${vidP}
`);
        });
      });
      rootFolder?.file("PROMPTS_GERACAO.txt", promptsLog.join("\n"));
      storyBible.scenes.forEach((sc) => {
        const sceneFolderName = `Cena_${sc.sceneNumber.toString().padStart(2, "0")}_Ato_${sc.actNumber}`;
        const sceneFolder = rootFolder?.folder(sceneFolderName);
        sc.shots.forEach((sh, shIdx) => {
          const filePrefix = `S${sc.sceneNumber.toString().padStart(2, "0")}_T${(shIdx + 1).toString().padStart(2, "0")}`;
          if (sh.generatedImageBase64) {
            const ext = sh.generatedMimeType?.includes("png") ? "png" : "jpg";
            sceneFolder?.file(`${filePrefix}_quadro.${ext}`, sh.generatedImageBase64, { base64: true });
          }
          if (sh.generatedVideoBase64) {
            sceneFolder?.file(`${filePrefix}_video.mp4`, sh.generatedVideoBase64, { base64: true });
          }
        });
      });
      const zipBase64 = await zip.generateAsync({ type: "base64" });
      const projectPackage = {
        title,
        logline: storyBible.logline,
        settings,
        storyBible,
        scriptText,
        version: "3.0",
        savedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const bytes = new TextEncoder().encode(JSON.stringify({ ...projectPackage, zipArchiveBase64: zipBase64 }, null, 2));
      const jsonBase64 = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
      await Flow7.download({
        base64: jsonBase64,
        mimeType: "application/json",
        filename: `${sanitize(title)}_pacote_fase3.json`
      });
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4e3);
    } catch (err) {
      console.error(err);
      setError("Falha ao exportar pacote estruturado.");
    } finally {
      setIsExportingZip(false);
    }
  };
  return /* @__PURE__ */ jsxs7("div", { className: "max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs7("div", { className: "bg-gradient-to-r from-[#171720] via-[#1a1a24] to-[#14141c] p-6 rounded-xl border border-[#272736]", children: [
      /* @__PURE__ */ jsxs7("h2", { className: "text-xl md:text-2xl font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx7("span", { className: "material-symbols-outlined text-amber-400", children: "inventory_2" }),
        "5. Exporta\xE7\xE3o, Legendas & Continuidade"
      ] }),
      /* @__PURE__ */ jsx7("p", { className: "text-sm text-zinc-400 mt-1", children: "Exporte o pacote de produ\xE7\xE3o estruturado por pastas de cena (S01_T01...), legendas .SRT, prompts documentados e salve seu projeto em JSON." })
    ] }),
    error && /* @__PURE__ */ jsxs7("div", { className: "p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsx7("span", { className: "material-symbols-outlined text-red-400 text-base", children: "warning" }),
      /* @__PURE__ */ jsx7("span", { children: error })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5", children: [
      /* @__PURE__ */ jsxs7("div", { className: "bg-[#15151c] p-5 rounded-xl border border-amber-500/40 space-y-3 flex flex-col justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsx7("div", { className: "w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx7("span", { className: "material-symbols-outlined text-2xl", children: "folder_zip" }) }),
          /* @__PURE__ */ jsx7("h3", { className: "text-sm font-bold text-white", children: "Pacote Completo (S01_T01...)" }),
          /* @__PURE__ */ jsx7("p", { className: "text-xs text-zinc-400 mt-1 leading-relaxed", children: "Pastas por cena, arquivos nomeados, roteiro, prompts e v\xEDdeos renderizados." })
        ] }),
        /* @__PURE__ */ jsxs7(
          "button",
          {
            onClick: handleExportFullZip,
            disabled: isExportingZip || !storyBible,
            className: "w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50 transition-all",
            children: [
              /* @__PURE__ */ jsx7("span", { className: `material-symbols-outlined text-[17px] ${isExportingZip ? "animate-spin" : ""}`, children: isExportingZip ? "sync" : zipSuccess ? "check" : "archive" }),
              /* @__PURE__ */ jsx7("span", { children: isExportingZip ? "Compactando..." : zipSuccess ? "Baixado!" : "Baixar Pacote ZIP" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "bg-[#15151c] p-5 rounded-xl border border-[#272736] space-y-3 flex flex-col justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsx7("div", { className: "w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx7("span", { className: "material-symbols-outlined text-2xl", children: "subtitles" }) }),
          /* @__PURE__ */ jsx7("h3", { className: "text-sm font-bold text-white", children: "Legenda .SRT Sincronizada" }),
          /* @__PURE__ */ jsx7("p", { className: "text-xs text-zinc-400 mt-1 leading-relaxed", children: "Legenda gerada a partir das falas exatas e dura\xE7\xF5es das tomadas decupadas." })
        ] }),
        /* @__PURE__ */ jsxs7(
          "button",
          {
            onClick: handleExportSrt,
            disabled: isExportingSrt || !storyBible,
            className: "w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50 transition-all",
            children: [
              /* @__PURE__ */ jsx7("span", { className: `material-symbols-outlined text-[17px] ${isExportingSrt ? "animate-spin" : ""}`, children: isExportingSrt ? "sync" : "download" }),
              /* @__PURE__ */ jsx7("span", { children: "Baixar Legendas (.SRT)" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "bg-[#15151c] p-5 rounded-xl border border-[#272736] space-y-3 flex flex-col justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsx7("div", { className: "w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx7("span", { className: "material-symbols-outlined text-2xl", children: "save" }) }),
          /* @__PURE__ */ jsx7("h3", { className: "text-sm font-bold text-white", children: "Salvar Projeto (JSON)" }),
          /* @__PURE__ */ jsx7("p", { className: "text-xs text-zinc-400 mt-1 leading-relaxed", children: "Guarda todas as configura\xE7\xF5es, Character Bible e tomadas para continuar epis\xF3dios." })
        ] }),
        /* @__PURE__ */ jsxs7(
          "button",
          {
            onClick: onSaveProject,
            disabled: !storyBible,
            className: "w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50 transition-all",
            children: [
              /* @__PURE__ */ jsx7("span", { className: "material-symbols-outlined text-[17px]", children: "file_download" }),
              /* @__PURE__ */ jsx7("span", { children: "Salvar Projeto JSON" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "bg-[#15151c] p-5 rounded-xl border border-[#272736] space-y-3 flex flex-col justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsx7("div", { className: "w-10 h-10 rounded-lg bg-zinc-800 text-amber-300 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx7("span", { className: "material-symbols-outlined text-2xl", children: "data_object" }) }),
          /* @__PURE__ */ jsx7("h3", { className: "text-sm font-bold text-white", children: "Story Bible (JSON)" }),
          /* @__PURE__ */ jsx7("p", { className: "text-xs text-zinc-400 mt-1 leading-relaxed", children: "Arquivo em JSON puro com a b\xEDblia da hist\xF3ria para reutiliza\xE7\xE3o e prompts." })
        ] }),
        /* @__PURE__ */ jsxs7(
          "button",
          {
            onClick: handleExportBibleJson,
            disabled: isExportingBibleJson || !storyBible,
            className: "w-full py-2.5 px-4 bg-[#232332] hover:bg-[#2c2c40] text-zinc-200 border border-[#34344d] font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50 transition-all",
            children: [
              /* @__PURE__ */ jsx7("span", { className: `material-symbols-outlined text-[17px] ${isExportingBibleJson ? "animate-spin" : ""}`, children: isExportingBibleJson ? "sync" : "download" }),
              /* @__PURE__ */ jsx7("span", { children: "Baixar B\xEDblia (JSON)" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx7("div", { className: "flex items-center justify-between pt-4 border-t border-[#242433]", children: /* @__PURE__ */ jsxs7(
      "button",
      {
        onClick: onBack,
        className: "px-4 py-2 bg-[#1b1b24] hover:bg-[#252533] text-zinc-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-[#2d2d3e] cursor-pointer",
        children: [
          /* @__PURE__ */ jsx7("span", { className: "material-symbols-outlined text-[17px]", children: "arrow_back" }),
          /* @__PURE__ */ jsx7("span", { children: "Voltar \xE0 Timeline & Anima\xE7\xE3o" })
        ]
      }
    ) })
  ] });
};

// virtual:components/AboutModal.tsx
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx8("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs", children: /* @__PURE__ */ jsxs8("div", { className: "bg-[#14141c] border border-[#2a2a3c] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between border-b border-[#242433] pb-3", children: [
      /* @__PURE__ */ jsx8(SanjaLogo, { size: "md", showText: true }),
      /* @__PURE__ */ jsx8(
        "button",
        {
          onClick: onClose,
          className: "p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#222230] cursor-pointer",
          children: /* @__PURE__ */ jsx8("span", { className: "material-symbols-outlined", children: "close" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "space-y-4 text-xs text-zinc-300 leading-relaxed", children: [
      /* @__PURE__ */ jsxs8("div", { className: "p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/20 text-amber-100 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx8(SanjaLogo, { size: "sm", showText: false }),
        /* @__PURE__ */ jsxs8("div", { children: [
          "O ",
          /* @__PURE__ */ jsx8("strong", { children: "Sanja Dark Studio" }),
          " \xE9 uma su\xEDte profissional de dire\xE7\xE3o e anima\xE7\xE3o com IA \u2014 com suporte aos modelos oficiais ",
          /* @__PURE__ */ jsx8("strong", { children: "Omni 1.1 Flash" }),
          " e ",
          /* @__PURE__ */ jsx8("strong", { children: "Veo 3.1 (Lite, Fast, Quality)" }),
          ", timeline interativa, sincronia labial em PT-BR e pacotes organizados para exporta\xE7\xE3o."
        ] })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs8("h4", { className: "font-bold text-white flex items-center gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsx8("span", { className: "material-symbols-outlined text-amber-400 text-base", children: "auto_stories" }),
          "1. Roteiro & Meu Roteiro"
        ] }),
        /* @__PURE__ */ jsxs8("p", { children: [
          "Use ",
          /* @__PURE__ */ jsx8("em", { children: "Meu Roteiro" }),
          " para colar textos autorais ou o gerador em duas etapas para criar hist\xF3rias completas estruturadas com gancho nos primeiros 3s e conflito nos primeiros 10s."
        ] })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs8("h4", { className: "font-bold text-white flex items-center gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsx8("span", { className: "material-symbols-outlined text-amber-400 text-base", children: "tune" }),
          "2. Geradores & Capacidades Din\xE2micas"
        ] }),
        /* @__PURE__ */ jsx8("p", { children: "A interface se adapta dinamicamente \xE0s capacidades de cada modelo do Flow SDK (dura\xE7\xF5es de 4s, 6s, 8s ou 10s, limites de palavras e resolu\xE7\xF5es 360p para teste e 720p para final)." })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs8("h4", { className: "font-bold text-white flex items-center gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsx8("span", { className: "material-symbols-outlined text-amber-400 text-base", children: "view_carousel" }),
          "3. Timeline Sequencial & Aprova\xE7\xE3o"
        ] }),
        /* @__PURE__ */ jsx8("p", { children: "Pr\xE9-visualize suas tomadas na ordem exata da produ\xE7\xE3o, reordene tomadas e marque as aprovadas para economizar cr\xE9ditos: gere tudo em 360p e refine apenas as aprovadas em 720p." })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs8("h4", { className: "font-bold text-white flex items-center gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsx8("span", { className: "material-symbols-outlined text-amber-400 text-base", children: "inventory_2" }),
          "4. Exporta\xE7\xE3o Estruturada (S01_T01) & Legendas SRT"
        ] }),
        /* @__PURE__ */ jsx8("p", { children: "Baixe pacotes com pastas separadas por cena e arquivos numerados (S01_T01...), legendas sincronizadas (.SRT), falas separadas por personagem e projeto em JSON para continuar sua s\xE9rie." })
      ] })
    ] }),
    /* @__PURE__ */ jsx8("div", { className: "pt-3 border-t border-[#242433] flex justify-end", children: /* @__PURE__ */ jsx8(
      "button",
      {
        onClick: onClose,
        className: "px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-lg hover:bg-amber-400 transition-all cursor-pointer",
        children: "Entrar no Sanja Dark Studio"
      }
    ) })
  ] }) });
};

// virtual:App.tsx
import { jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
function App() {
  const [currentStep, setCurrentStep] = useState6("script");
  const [isAboutOpen, setIsAboutOpen] = useState6(false);
  const [title, setTitle] = useState6("");
  const [scriptText, setScriptText] = useState6("");
  const [storyBible, setStoryBible] = useState6(null);
  const [settings, setSettings] = useState6({
    language: "Portugu\xEAs (Brasil)",
    aspectRatio: "9:16",
    durationMinutes: 1,
    secondsPerShot: 6,
    style: "Cinematogr\xE1fico Ultra-Realista",
    cameraTone: "Dram\xE1tico com Cortes Alternados",
    nicheTheme: "",
    selectedDramaGenre: "Drama Familiar",
    storyRealism: "real",
    // Padrão: História Real baseada em fatos
    contextDirectives: "Continuidade estrita: cada tomada e di\xE1logo responde diretamente \xE0 tomada anterior",
    keywords: ["heran\xE7a", "d\xEDvida de honra", "irm\xE3os rivais", "perd\xE3o tardio", "segredo de fam\xEDlia"],
    narrativeStructure: "Par\xE1bola de contraste",
    productionType: "single",
    storyTone: "dram\xE1tico",
    hasNarrator: false,
    currentEpisode: 1,
    defaultVideoModel: "Omni 1.1 Flash",
    defaultResolution: "360p"
  });
  const handleSaveProject = async () => {
    const project = {
      title: title || "Projeto Sanja Dark Studio",
      logline: storyBible?.logline || "",
      settings,
      storyBible,
      scriptText,
      version: "3.0",
      savedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const jsonStr = JSON.stringify(project, null, 2);
    const bytes = new TextEncoder().encode(jsonStr);
    const base64 = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
    const cleanTitle = (title || "projeto").replace(/[^a-zA-Z0-9_\-]/g, "_").replace(/_+/g, "_").slice(0, 30);
    await Flow8.download({
      base64,
      mimeType: "application/json",
      filename: `${cleanTitle}_projeto_sanja.json`
    });
  };
  const handleLoadProjectJson = (jsonText) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.scriptText) setScriptText(parsed.scriptText);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.storyBible) setStoryBible(parsed.storyBible);
    } catch (err) {
      console.error("Falha ao abrir projeto JSON:", err);
    }
  };
  const totalShotsCount = storyBible?.scenes.reduce((acc, sc) => acc + sc.shots.length, 0) || 0;
  const totalVideosCount = storyBible?.scenes.reduce(
    (acc, sc) => acc + sc.shots.filter((sh) => sh.generatedVideoBase64).length,
    0
  ) || 0;
  const characterCount = storyBible?.characters.length || 0;
  return /* @__PURE__ */ jsxs9("div", { className: "min-h-screen bg-[#0e0e13] text-zinc-100 font-sans flex flex-col selection:bg-amber-500 selection:text-black", children: [
    /* @__PURE__ */ jsx9(
      TopPipelineNav,
      {
        currentStep,
        onSelectStep: setCurrentStep,
        assetCount: characterCount,
        sceneCount: totalShotsCount,
        videoCount: totalVideosCount,
        onOpenAbout: () => setIsAboutOpen(true),
        onSaveProject: handleSaveProject,
        onLoadProjectJson: handleLoadProjectJson
      }
    ),
    /* @__PURE__ */ jsxs9("main", { className: "flex-1 p-3 md:p-6 pb-20", children: [
      currentStep === "script" && /* @__PURE__ */ jsx9(
        ScriptEditorStep,
        {
          title,
          setTitle,
          scriptText,
          setScriptText,
          storyBible,
          setStoryBible,
          settings,
          setSettings,
          onAdvance: () => setCurrentStep("assets")
        }
      ),
      currentStep === "assets" && /* @__PURE__ */ jsx9(
        AssetManagerStep,
        {
          scriptText,
          storyBible,
          setStoryBible,
          settings,
          onAdvance: () => setCurrentStep("storyboard"),
          onBack: () => setCurrentStep("script")
        }
      ),
      currentStep === "storyboard" && /* @__PURE__ */ jsx9(
        StoryboardStep,
        {
          scriptText,
          storyBible,
          setStoryBible,
          settings,
          onAdvance: () => setCurrentStep("animation"),
          onBack: () => setCurrentStep("assets")
        }
      ),
      currentStep === "animation" && /* @__PURE__ */ jsx9(
        AnimationStep,
        {
          storyBible,
          setStoryBible,
          settings,
          onAdvance: () => setCurrentStep("export"),
          onBack: () => setCurrentStep("storyboard")
        }
      ),
      currentStep === "export" && /* @__PURE__ */ jsx9(
        ExportStep,
        {
          title,
          scriptText,
          storyBible,
          settings,
          onBack: () => setCurrentStep("animation"),
          onSaveProject: handleSaveProject
        }
      )
    ] }),
    /* @__PURE__ */ jsx9(AboutModal, { isOpen: isAboutOpen, onClose: () => setIsAboutOpen(false) })
  ] });
}
export {
  App as default
};
