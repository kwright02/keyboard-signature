import { useEffect, useMemo, useState } from "react";

type KeyboardLayout = "ansi_100";
type Key = {
  label: string;
  code: string;
  x: number;
  y: number;
  w?: number; // width multiplier
  h?: number; // height multiplier (for tall keys like Numpad Enter)
};

// 100% ANSI layout (US) + 10-key (numeric keypad)
const ansi100Layout: Key[] = [
  // Row 1
  { label: "~", code: "Backquote", x: 0, y: 1 },
  { label: "1", code: "Digit1", x: 1, y: 1 },
  { label: "2", code: "Digit2", x: 2, y: 1 },
  { label: "3", code: "Digit3", x: 3, y: 1 },
  { label: "4", code: "Digit4", x: 4, y: 1 },
  { label: "5", code: "Digit5", x: 5, y: 1 },
  { label: "6", code: "Digit6", x: 6, y: 1 },
  { label: "7", code: "Digit7", x: 7, y: 1 },
  { label: "8", code: "Digit8", x: 8, y: 1 },
  { label: "9", code: "Digit9", x: 9, y: 1 },
  { label: "0", code: "Digit0", x: 10, y: 1 },
  { label: "-", code: "Minus", x: 11, y: 1 },
  { label: "=", code: "Equal", x: 12, y: 1 },
  // Row 2
  { label: "Q", code: "KeyQ", x: 1.5, y: 2 },
  { label: "W", code: "KeyW", x: 2.5, y: 2 },
  { label: "E", code: "KeyE", x: 3.5, y: 2 },
  { label: "R", code: "KeyR", x: 4.5, y: 2 },
  { label: "T", code: "KeyT", x: 5.5, y: 2 },
  { label: "Y", code: "KeyY", x: 6.5, y: 2 },
  { label: "U", code: "KeyU", x: 7.5, y: 2 },
  { label: "I", code: "KeyI", x: 8.5, y: 2 },
  { label: "O", code: "KeyO", x: 9.5, y: 2 },
  { label: "P", code: "KeyP", x: 10.5, y: 2 },
  { label: "[", code: "BracketLeft", x: 11.5, y: 2 },
  { label: "]", code: "BracketRight", x: 12.5, y: 2 },
  { label: "\\", code: "Backslash", x: 13.5, y: 2, w: 1.5 },
  // Row 3
  { label: "A", code: "KeyA", x: 1.75, y: 3 },
  { label: "S", code: "KeyS", x: 2.75, y: 3 },
  { label: "D", code: "KeyD", x: 3.75, y: 3 },
  { label: "F", code: "KeyF", x: 4.75, y: 3 },
  { label: "G", code: "KeyG", x: 5.75, y: 3 },
  { label: "H", code: "KeyH", x: 6.75, y: 3 },
  { label: "J", code: "KeyJ", x: 7.75, y: 3 },
  { label: "K", code: "KeyK", x: 8.75, y: 3 },
  { label: "L", code: "KeyL", x: 9.75, y: 3 },
  { label: ";", code: "Semicolon", x: 10.75, y: 3 },
  { label: "'", code: "Quote", x: 11.75, y: 3 },
  // Row 4
  { label: "Z", code: "KeyZ", x: 2.25, y: 4 },
  { label: "X", code: "KeyX", x: 3.25, y: 4 },
  { label: "C", code: "KeyC", x: 4.25, y: 4 },
  { label: "V", code: "KeyV", x: 5.25, y: 4 },
  { label: "B", code: "KeyB", x: 6.25, y: 4 },
  { label: "N", code: "KeyN", x: 7.25, y: 4 },
  { label: "M", code: "KeyM", x: 8.25, y: 4 },
  { label: ",", code: "Comma", x: 9.25, y: 4 },
  { label: ".", code: "Period", x: 10.25, y: 4 },
  { label: "/", code: "Slash", x: 11.25, y: 4 },
];

const keyboardLayouts: Record<KeyboardLayout, Key[]> = {
  ansi_100: ansi100Layout,
};

export const KeyboardSignature = () => {
  const [name, setName] = useState("");
  // TODO: implement multiple keyboard layouts I guess
  const [currentKeyboardLayout, _setCurrentKeyboardLayout] = useState<KeyboardLayout>("ansi_100");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Flash keyboard when name changes
  useEffect(() => {
    if (name.length > 0) {
      setKeyboardVisible(true);
      const timer = setTimeout(() => {
        setKeyboardVisible(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [name]);

  // Parse name into tokens for signature and highlighting
  const tokens = useMemo(() => {
    const t: string[] = [];
    let j = 0;
    while (j < name.length) {
      if (name[j] === '[') {
        const end = name.indexOf(']', j);
        if (end !== -1) {
          t.push(name.slice(j, end + 1));
          j = end + 1;
          continue;
        }
      }
      t.push(name[j]);
      j++;
    }
    return t;
  }, [name]);

  // Calculate SVG path for signature
  const signaturePath = useMemo(() => {
    const points = [];
    const layout = keyboardLayouts[currentKeyboardLayout];
    const usedKeyIndices = new Set<number>();
    for (const token of tokens) {
      let idx = -1;
      if (token.startsWith('[') && token.endsWith(']')) {
        // e.g. [Numpad9]
        const code = token.slice(1, -1);
        idx = layout.findIndex((k, i) => !usedKeyIndices.has(i) && k.code === code);
      } else {
        idx = layout.findIndex((k, i) => !usedKeyIndices.has(i) && k.label.toLowerCase() === token.toLowerCase());
      }
      if (idx !== -1) {
        const key = layout[idx];
        // Center the point in the key: left + half width, top + half height
        const keyWidth = (key.w ?? 1) * 44;
        const keyHeight = (key.h ?? 1) * 44;
        // The left/top of the key is key.x * 48 + 2, key.y * 48 + 15
        points.push({
          x: key.x * 48 + 2 + keyWidth / 2,
          y: key.y * 48 + 15 + keyHeight / 2
        });
        usedKeyIndices.add(idx);
      }
    }
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  }, [tokens, currentKeyboardLayout]);

  // Get active keys for highlighting
  const activeKeys = useMemo(() => {
    const layout = keyboardLayouts[currentKeyboardLayout];
    const usedKeyIndices = new Set<number>();
    return new Set(
      tokens
        .map((token) => {
          let idx = -1;
          if (token.startsWith('[') && token.endsWith(']')) {
            const code = token.slice(1, -1);
            idx = layout.findIndex((k, i) => !usedKeyIndices.has(i) && k.code === code);
          } else {
            idx = layout.findIndex((k, i) => !usedKeyIndices.has(i) && k.label.toLowerCase() === token.toLowerCase());
          }
          if (idx !== -1) {
            usedKeyIndices.add(idx);
            return layout[idx].code;
          }
          return null;
        })
        .filter(Boolean)
    );
  }, [tokens, currentKeyboardLayout]);

  // Export functions
  const exportSVG = () => {
    if (!signaturePath || !name) return;
    const svgContent = `<svg width="650" height="200" xmlns="http://www.w3.org/2000/svg">
          <path d="${signaturePath}" stroke="black" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-signature.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPNG = () => {
    if (!signaturePath || !name) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1300;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Higher res
    ctx.scale(2, 2);
    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 650, 200);
    // Signature path
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const path = new Path2D(signaturePath);
    ctx.stroke(path);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}-signature.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div
      className={`flex flex-col sm:items-center sm:justify-center max-sm:mx-auto max-sm:w-[28rem] sm:w-fit`}
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="placeholder-neutral-800 [&::placeholder]:duration-200 [&::placeholder]:transition-all focus:placeholder-neutral-600 tracking-wide text-4xl text-white bg-transparent duration-150 transition-all ease-out px-4 py-2 text-center outline-none"
      />

  <div className="relative mb-4 mt-8 max-sm:mt-0 max-sm:scale-70 max-sm:-ml-22">
        {/* Keyboard */}
        <div
          className={`relative transition-opacity ease-out ${
            name.length === 0
              ? "opacity-100"
              : keyboardVisible
                ? "opacity-100 brightness-125 duration-50"
                : "opacity-0 duration-4000"
          }`}
          style={{ width: "650px", height: "200px" }}
        >
          {keyboardLayouts[currentKeyboardLayout].map((key) => {
            const isActive = activeKeys.has(key.code);
            const isCurrentKey =
              name.length > 0 &&
              key.label.toLowerCase() === name[name.length - 1]?.toLowerCase();

            // Special key actions
            const handleKeyClick = () => {
              if (key.code === "Backspace") {
                setName((p) => {
                  // Remove last token: either a [NumpadX] or a single char
                  if (p.endsWith(']')) {
                    const openIdx = p.lastIndexOf('[');
                    if (openIdx !== -1) {
                      return p.slice(0, openIdx);
                    }
                  }
                  return p.slice(0, -1);
                });
              } else if (key.code === "Space") {
                setName((p) => p + " ");
              } else if (key.code === "Enter") {
                setName((p) => p + "\n");
              } else if ([
                "ShiftLeft","ShiftRight","ControlLeft","ControlRight","AltLeft","AltRight","MetaLeft","MetaRight","ContextMenu","CapsLock","Tab","Escape","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"
              ].includes(key.code)) {
                // Optionally: show a visual effect, but don't add to name
              } else if (key.code.startsWith("Numpad")) {
                setName((p) => p + `[${key.code}]`);
              } else {
                setName((p) => p + key.label);
              }
            };

            return (
              <div
                key={key.code + key.x + key.y}
                onClick={handleKeyClick}
                className={`absolute rounded-lg border flex items-center justify-center text-xs font-mono transition-all duration-200 active:scale-95 select-none cursor-pointer
                  ${isCurrentKey
                    ? "bg-white/50 border-neutral-400 text-black shadow-lg shadow-white-500/50 scale-110"
                    : isActive
                      ? "bg-neutral-900 border-neutral-800 text-white"
                      : "bg-transparent border-neutral-800/50 text-neutral-300"}
                `}
                style={{
                  left: `${key.x * 48}px`,
                  top: `${key.y * 48 + 15}px`,
                  width: `${(key.w ?? 1) * 44}px`,
                  height: `${(key.h ?? 1) * 44}px`,
                  fontWeight: key.label.length > 1 ? 500 : 600,
                  fontSize: key.label.length > 1 ? 12 : 16,
                }}
              >
                {key.label}
              </div>
            );
          })}
        </div>

        {/* Signature */}
        <svg
          className="pointer-events-none absolute top-0 left-0"
          width="650"
          height="260"
          style={{ zIndex: 10 }}
        >
          <title>
            A digital signature, created by connecting the points of typed
            letters on the keyboard.
          </title>

          {signaturePath ? (
            <path
              d={signaturePath}
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>
      </div>

      {/* Move export buttons below keyboard to avoid overlap */}
      <div
        className={`max-sm:w-[20rem] max-sm:mx-auto flex flex-col gap-2 sm:mt-8 transition-all ease-in-out ${name.length > 0 ? "opacity-100 tramslate-y-0 duration-1000" : "opacity-0 translate-y-2 duration-150"}`}
        style={{ marginTop: 40 }}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={exportSVG}
            className="bg-white text-black px-3.5 py-1.5 origin-right rounded-md text-sm font-semibold cursor-pointer active:scale-98 active:brightness-70 hover:brightness-85 transition-all duration-100 ease-out"
          >
            Export SVG
          </button>

          <button
            type="button"
            onClick={exportPNG}
            className="bg-white text-black px-3.5 py-1.5 origin-left rounded-md text-sm font-semibold cursor-pointer active:scale-98 active:brightness-70 hover:brightness-85 transition-all duration-100 ease-out"
          >
            Export PNG
          </button>
        </div>

        <a
          href="https://github.com/cnrad/keyboard-signature"
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-neutral-500 border border-neutral-700/50 px-3.5 py-1.5 bg-neutral-900/50 text-sm rounded-md text-center hover:bg-neutral-900/75 hover:text-neutral-200 transition-all duration-100 ease-out"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};
