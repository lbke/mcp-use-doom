/** MCP App starter view — edit this file to build your UI. */
import {
  getPublicBaseUrl,
  useDisplayMode,
  useHostContext,
  useOpenExternal,
  useSendFollowUp,
  useToolContext,
  useViewTheme,
} from "mcp-use/react";
import { useEffect } from "react";

import "./view.css";

export default function McpApp() {
  const publicBaseUrl = getPublicBaseUrl();

  // useToolContext — tool lifecycle (pending / error / result)
  const view = useToolContext<"doom-wasm">();
  // useHostContext — locale, timezone, platform, capabilities
  const { hostCapabilities, platform, displayMode, locale, timeZone } =
    useHostContext();
  const theme = useViewTheme();
  // useDisplayMode — request pip / fullscreen / inline
  const { availableDisplayModes, requestDisplayMode } = useDisplayMode();
  // useOpenExternal — open URLs via the host
  const openExternal = useOpenExternal();
  // useSendFollowUp — send a prompt back to the host
  const sendFollowUp = useSendFollowUp();

  useEffect(() => {
    if (!publicBaseUrl) {
      return;
    }

    const canvas = document.getElementById(
      "canvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    const doomBaseUrl = `${publicBaseUrl}doom-wasm`;
    const commonArgs = [
      "-iwad",
      "doom1.wad",
      "-window",
      "-nogui",
      "-nomusic",
      "-config",
      "default.cfg",
      "-servername",
      "doomflare",
    ];

    const onWebglContextLost = (event: Event) => {
      event.preventDefault();
      console.error("WebGL context lost. Reload is required.");
    };

    canvas.addEventListener("webglcontextlost", onWebglContextLost, false);

    (window as any).Module = {
      noInitialRun: true,
      locateFile: (path: string) => `${doomBaseUrl}/${path}`,
      preRun: () => {
        (window as any).Module.FS.createPreloadedFile(
          "",
          "doom1.wad",
          `${doomBaseUrl}/doom1.wad`,
          true,
          true,
        );
        (window as any).Module.FS.createPreloadedFile(
          "",
          "default.cfg",
          `${doomBaseUrl}/default.cfg`,
          true,
          true,
        );
      },
      onRuntimeInitialized: () => {
        (window as any).callMain(commonArgs);
      },
      printErr: (...args: unknown[]) => {
        console.error(...args);
      },
      print: (...args: unknown[]) => {
        console.log(...args);
      },
      setStatus: (text: string) => {
        console.log(text);
      },
      monitorRunDependencies: (left: number) => {
        console.log(
          left ? `Preparing... (${left})` : "All downloads complete.",
        );
      },
      canvas,
    };

    const scriptId = "doom-wasm-runtime";
    if (document.getElementById(scriptId)) {
      return () => {
        canvas.removeEventListener("webglcontextlost", onWebglContextLost);
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `${doomBaseUrl}/websockets-doom.js`;
    script.async = false;
    document.body.appendChild(script);

    return () => {
      canvas.removeEventListener("webglcontextlost", onWebglContextLost);
    };
  }, [publicBaseUrl]);

  return (
    <>
      <div id="container" className="noselect">
        <canvas
          className="frame"
          id="canvas"
          // @ts-ignore
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          tabIndex={-1}
        ></canvas>
      </div>
    </>
  );
}
