import { StyleSheet } from "react-native";

declare const require: any;

type Style = Record<string, unknown>;

const spacing: Record<string, number> = {
  "0": 0,
  "0.5": 2,
  "1": 4,
  "1.5": 6,
  "2": 8,
  "2.5": 10,
  "3": 12,
  "3.5": 14,
  "4": 16,
  "5": 20,
  "6": 24,
  "7": 28,
  "8": 32,
  "9": 36,
  "10": 40,
  "12": 48,
  "14": 56,
  "16": 64,
  "20": 80,
  "24": 96,
};

const fontSize: Record<string, number> = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
};

const colors: Record<string, string> = {
  transparent: "transparent",
  white: "#FFFFFF",
  black: "#000000",
  "blue-50": "#EFF6FF",
  "blue-100": "#DBEAFE",
  "blue-500": "#3B82F6",
  "blue-600": "#2563EB",
  "blue-700": "#1D4ED8",
  "amber-50": "#FFFBEB",
  "amber-700": "#B45309",
  "red-50": "#FEF2F2",
  "red-100": "#FEE2E2",
  "red-400": "#F87171",
  "red-500": "#EF4444",
  "red-600": "#DC2626",
  "green-50": "#F0FDF4",
  "green-100": "#DCFCE7",
  "green-200": "#BBF7D0",
  "green-600": "#16A34A",
  "green-700": "#15803D",
  "yellow-400": "#FACC15",
  "orange-50": "#FFF7ED",
  "orange-100": "#FFEDD5",
  "orange-600": "#EA580C",
  "slate-50": "#F8FAFC",
  "slate-100": "#F1F5F9",
  "slate-200": "#E2E8F0",
  "slate-300": "#CBD5E1",
  "slate-400": "#94A3B8",
  "slate-500": "#64748B",
  "slate-600": "#475569",
  "slate-700": "#334155",
  "slate-800": "#1E293B",
  "slate-900": "#0F172A",
};

const rounded: Record<string, number> = {
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
};

const cache = new Map<string, Style>();

function value(token: string): number | undefined {
  if (token === "px") return StyleSheet.hairlineWidth;
  if (spacing[token] !== undefined) return spacing[token];
  const match = token.match(/^\[(\d+(?:\.\d+)?)px\]$/);
  if (match) return Number(match[1]);
  return undefined;
}

function addSpacing(style: Style, prop: string, amount: number) {
  switch (prop) {
    case "p":
      style.padding = amount;
      break;
    case "px":
      style.paddingHorizontal = amount;
      break;
    case "py":
      style.paddingVertical = amount;
      break;
    case "pt":
      style.paddingTop = amount;
      break;
    case "pb":
      style.paddingBottom = amount;
      break;
    case "pl":
      style.paddingLeft = amount;
      break;
    case "pr":
      style.paddingRight = amount;
      break;
    case "m":
      style.margin = amount;
      break;
    case "mx":
      style.marginHorizontal = amount;
      break;
    case "my":
      style.marginVertical = amount;
      break;
    case "mt":
      style.marginTop = amount;
      break;
    case "mb":
      style.marginBottom = amount;
      break;
    case "ml":
      style.marginLeft = amount;
      break;
    case "mr":
      style.marginRight = amount;
      break;
  }
}

function tokenToStyle(token: string, style: Style) {
  if (!token) return;

  if (token === "flex-1") style.flex = 1;
  else if (token === "flex-row") style.flexDirection = "row";
  else if (token === "flex-col") style.flexDirection = "column";
  else if (token === "flex-wrap") style.flexWrap = "wrap";
  else if (token === "flex-shrink") style.flexShrink = 1;
  else if (token === "items-center") style.alignItems = "center";
  else if (token === "items-start") style.alignItems = "flex-start";
  else if (token === "items-end") style.alignItems = "flex-end";
  else if (token === "self-start") style.alignSelf = "flex-start";
  else if (token === "justify-center") style.justifyContent = "center";
  else if (token === "justify-between") style.justifyContent = "space-between";
  else if (token === "justify-end") style.justifyContent = "flex-end";
  else if (token === "text-center") style.textAlign = "center";
  else if (token === "capitalize") style.textTransform = "capitalize";
  else if (token === "uppercase") style.textTransform = "uppercase";
  else if (token === "absolute") style.position = "absolute";
  else if (token === "relative") style.position = "relative";
  else if (token === "overflow-hidden") style.overflow = "hidden";
  else if (token === "border") style.borderWidth = 1;
  else if (token === "border-2") style.borderWidth = 2;
  else if (token === "border-t") style.borderTopWidth = 1;
  else if (token === "border-b") style.borderBottomWidth = 1;
  else if (token === "opacity-0") style.opacity = 0;
  else if (token === "opacity-50") style.opacity = 0.5;
  else if (token === "opacity-60") style.opacity = 0.6;
  else if (token === "font-medium") style.fontWeight = "500";
  else if (token === "font-semibold") style.fontWeight = "600";
  else if (token === "font-bold") style.fontWeight = "700";
  else if (token === "leading-relaxed") style.lineHeight = 22;
  else if (token === "tracking-wider") style.letterSpacing = 0.8;

  const spacingMatch = token.match(
    /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-(.+)$/,
  );
  if (spacingMatch) {
    const amount = value(spacingMatch[2]);
    if (amount !== undefined) addSpacing(style, spacingMatch[1], amount);
    return;
  }

  const gapMatch = token.match(/^gap-(.+)$/);
  if (gapMatch) {
    const amount = value(gapMatch[1]);
    if (amount !== undefined) style.gap = amount;
    return;
  }

  const sizeMatch = token.match(/^(w|h|min-w|min-h|max-w|max-h)-(.+)$/);
  if (sizeMatch) {
    const fractions: Record<string, string> = {
      "1/2": "50%",
      "2/3": "66.6667%",
      "3/4": "75%",
      "4/5": "80%",
    };
    const size =
      sizeMatch[2] === "full"
        ? "100%"
        : fractions[sizeMatch[2]] || value(sizeMatch[2]);
    if (size !== undefined) {
      const propMap: Record<string, string> = {
        w: "width",
        h: "height",
        "min-w": "minWidth",
        "min-h": "minHeight",
        "max-w": "maxWidth",
        "max-h": "maxHeight",
      };
      style[propMap[sizeMatch[1]]] = size;
    }
    return;
  }

  const textMatch = token.match(/^text-(.+)$/);
  if (textMatch) {
    const key = textMatch[1];
    if (fontSize[key] !== undefined) style.fontSize = fontSize[key];
    else if (key.startsWith("[")) style.fontSize = value(key);
    else if (colors[key]) style.color = colors[key];
    return;
  }

  const bgMatch = token.match(/^bg-(.+)$/);
  if (bgMatch && colors[bgMatch[1]]) {
    style.backgroundColor = colors[bgMatch[1]];
    return;
  }

  const borderMatch = token.match(/^border-(.+)$/);
  if (borderMatch) {
    const key = borderMatch[1];
    const width = value(key);
    if (width !== undefined) style.borderWidth = width;
    else if (colors[key]) style.borderColor = colors[key];
    return;
  }

  const roundedMatch = token.match(/^rounded(?:-(.+))?$/);
  if (roundedMatch) {
    const key = roundedMatch[1] || "md";
    const radius = key.startsWith("[") ? value(key) : rounded[key];
    if (radius !== undefined) style.borderRadius = radius;
    return;
  }

  const leadingMatch = token.match(/^leading-(\[(\d+(?:\.\d+)?)px\]|\d+)$/);
  if (leadingMatch)
    style.lineHeight = leadingMatch[2]
      ? Number(leadingMatch[2])
      : value(leadingMatch[1]);

  const trackingMatch = token.match(/^tracking-\[(\d+(?:\.\d+)?)px\]$/);
  if (trackingMatch) style.letterSpacing = Number(trackingMatch[1]);
}

function classNameToStyle(className: string): Style {
  const cached = cache.get(className);
  if (cached) return cached;
  const style: Style = {};
  className.split(/\s+/).forEach((token) => tokenToStyle(token.trim(), style));
  if (className.includes("bg-white") && className.includes("rounded-2xl")) {
    style.shadowColor = "#0F172A";
    style.shadowOffset = { width: 0, height: 6 };
    style.shadowOpacity = 0.06;
    style.shadowRadius = 14;
    style.elevation = 2;
  }
  if (className.includes("bg-blue-600")) {
    style.shadowColor = "#2563EB";
    style.shadowOffset = { width: 0, height: 6 };
    style.shadowOpacity = 0.18;
    style.shadowRadius = 14;
    style.elevation = 3;
  }
  cache.set(className, style);
  return style;
}

function patchRuntime(runtime: Record<string, any>) {
  if (!runtime || runtime.__supplierConnectClassNamePatched) return;

  const wrap =
    (original: any) =>
    (type: any, props: any, key: any, ...restArgs: any[]) => {
      if (props?.className) {
        const { className, style, ...rest } = props;
        props = {
          ...rest,
          style: style
            ? [classNameToStyle(String(className)), style]
            : classNameToStyle(String(className)),
        };
      }
      return original(type, props, key, ...restArgs);
    };

  if (typeof runtime.jsx === "function") runtime.jsx = wrap(runtime.jsx);
  if (typeof runtime.jsxs === "function") runtime.jsxs = wrap(runtime.jsxs);
  if (typeof runtime.jsxDEV === "function")
    runtime.jsxDEV = wrap(runtime.jsxDEV);
  runtime.__supplierConnectClassNamePatched = true;
}

try {
  patchRuntime(require("react/jsx-runtime"));
  patchRuntime(require("react/jsx-dev-runtime"));
} catch {
  // Ignore: Expo may not expose both runtimes in every environment.
}
