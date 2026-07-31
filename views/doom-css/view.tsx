/** MCP App starter view — edit this file to build your UI. */
import {
  getPublicBaseUrl,
  Image,
  ModelContext,
  ThemeProvider,
  useCallTool,
  useDisplayMode,
  useHostContext,
  useOpenExternal,
  useSendFollowUp,
  useToolContext,
  useViewTheme,
  useViewTool,
} from "mcp-use/react";
import { useEffect } from "react";
import { z } from "zod";

import "./view.css";

export default function McpApp() {
  const publicBaseUrl = getPublicBaseUrl();
  const assetUrl = (path: string) => `${publicBaseUrl}${path}`;

  // useToolContext — tool lifecycle (pending / error / result)
  const view = useToolContext<"doom-css">();
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

    (
      window as Window & { __mcpDoomPublicBaseUrl?: string }
    ).__mcpDoomPublicBaseUrl = publicBaseUrl;

    const scriptId = "doom-css-runtime";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "module";
      script.src = assetUrl("assets/index-D353JIYS.js");
      document.body.appendChild(script);
    }

    const fullscreenButton = document.getElementById("fullscreen-button");
    const helpButton = document.getElementById("help-button");
    const helpOverlay = document.getElementById("help-overlay");

    if (!fullscreenButton || !helpButton || !helpOverlay) {
      return;
    }

    const toggleFullscreen = async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          (error.name === "AbortError" || error.name === "NotAllowedError")
        ) {
          return;
        }

        console.error("Fullscreen request failed", error);
      }
    };

    const showHelp = () => {
      helpOverlay.hidden = false;
    };

    const hideHelp = () => {
      helpOverlay.hidden = true;
    };

    fullscreenButton.addEventListener("click", toggleFullscreen);
    helpButton.addEventListener("click", showHelp);
    helpOverlay.addEventListener("click", hideHelp);

    return () => {
      fullscreenButton.removeEventListener("click", toggleFullscreen);
      helpButton.removeEventListener("click", showHelp);
      helpOverlay.removeEventListener("click", hideHelp);
    };
  }, [publicBaseUrl]);

  return (
    <div className="doom-app-shell">
      <link
        rel="stylesheet"
        href={assetUrl("assets/index-BvGB871g.css")}
      ></link>
      <svg width="0" height="0" aria-hidden="true">
        {/* Doom "fuzz" effect for Spectre — displaces pixels using animated noise */}
        <filter id="fuzz" x="-10%" y="-10%" width="120%" height="120%">
          {/* Animated noise for displacement and shimmer */}
          <feTurbulence
            type="turbulence"
            baseFrequency="0.8 0.03"
            numOctaves="3"
            result="noise"
          >
            <animate
              attributeName="seed"
              values="0;1;2;3;4;5;6;7;8;9"
              dur="0.4s"
              repeatCount="indefinite"
              calcMode="discrete"
            />
          </feTurbulence>
          {/* Vertically displace the sprite shape */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* Flatten to pure black, preserve alpha silhouette */}
          <feColorMatrix
            type="matrix"
            in="displaced"
            values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
            result="shadow"
          />
          {/* Add shimmering noise variation to alpha */}
          <feComposite
            in="noise"
            in2="displaced"
            operator="in"
            result="clippedNoise"
          />
          <feColorMatrix
            type="matrix"
            in="clippedNoise"
            values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0.4 0 0 0 0"
            result="noiseAlpha"
          />
          <feComposite
            in="shadow"
            in2="noiseAlpha"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          />
        </filter>
      </svg>
      {/* Loading overlay */}
      <div id="loading-overlay" className="visible"></div>
      {/* Renderer — wraps viewport, HUD, and overlays */}
      <div id="renderer">
        {/* Scene viewport */}
        <div id="viewport">
          <div id="scene"></div>
        </div>

        {/* HUD — gameplay overlay elements */}
        <div id="hud">
          {/* Status bar */}
          <div id="status">
            <div className="hud-section" id="hud-ammo">
              <output id="ammo" className="hud-number">
                {" 50"}
              </output>
            </div>
            <div className="hud-section" id="hud-health">
              <div className="hud-pct">
                <output id="health" className="hud-number">
                  100
                </output>
              </div>
            </div>
            <div className="hud-section" id="hud-arms">
              <div className="slot" data-slot="2"></div>
              <div className="slot" data-slot="3"></div>
              <div className="slot" data-slot="4"></div>
              <div className="slot" data-slot="5"></div>
              <div className="slot" data-slot="6"></div>
              <div className="slot" data-slot="7"></div>
            </div>
            <div className="hud-section" id="hud-face">
              <div id="face-sprite"></div>
            </div>
            <div className="hud-section" id="hud-armor">
              <div className="hud-pct">
                <output id="armor" className="hud-number">
                  {"  0"}
                </output>
              </div>
            </div>
            <div className="hud-section" id="hud-keys">
              <div className="key key-blue"></div>
              <div className="key key-yellow"></div>
              <div className="key key-red"></div>
            </div>
            <div className="hud-section" id="hud-ammo-types">
              <div className="ammo-row" data-ammo="bullets">
                <output
                  className="small-number ammo-cur"
                  id="ammo-cur-bullets"
                ></output>
                <output
                  className="small-number ammo-max"
                  id="ammo-max-bullets"
                ></output>
              </div>
              <div className="ammo-row" data-ammo="shells">
                <output
                  className="small-number ammo-cur"
                  id="ammo-cur-shells"
                ></output>
                <output
                  className="small-number ammo-max"
                  id="ammo-max-shells"
                ></output>
              </div>
              <div className="ammo-row" data-ammo="rockets">
                <output
                  className="small-number ammo-cur"
                  id="ammo-cur-rockets"
                ></output>
                <output
                  className="small-number ammo-max"
                  id="ammo-max-rockets"
                ></output>
              </div>
              <div className="ammo-row" data-ammo="cells">
                <output
                  className="small-number ammo-cur"
                  id="ammo-cur-cells"
                ></output>
                <output
                  className="small-number ammo-max"
                  id="ammo-max-cells"
                ></output>
              </div>
            </div>
          </div>

          {/* Weapon (after status bar for CSS anchor positioning) */}
          <div id="weapon"></div>

          {/* Overlays for color effects */}
          <div id="damage-overlay"></div>
          <div id="pickup-overlay"></div>
          <div id="teleport-overlay"></div>
        </div>
      </div>
      {/* Spectator UI */}
      <div id="spectator">
        <div id="spectator-controls" className="hidden">
          <div className="spectator-stack">
            <div className="spectator-group" id="spectator-rotate">
              <button data-key="q" title="Rotate Left">
                <img
                  src={assetUrl("assets/icons/rotate-left.svg")}
                  alt=""
                />
              </button>
              <button data-key="e" title="Rotate Right">
                <img
                  src={assetUrl("assets/icons/rotate-right.svg")}
                  alt=""
                />
              </button>
            </div>
            <div className="spectator-group" id="spectator-zoom">
              <button data-key="r" title="Zoom In">
                <img src={assetUrl("assets/icons/plus.svg")} alt="" />
              </button>
              <button data-key="f" title="Zoom Out">
                <img src={assetUrl("assets/icons/minus.svg")} alt="" />
              </button>
            </div>
          </div>
          <div className="spectator-group" id="spectator-arrows">
            <button data-key="w" title="Pan Forward">
              <img src={assetUrl("assets/icons/up.svg")} alt="" />
            </button>
            <button data-key="a" title="Pan Left">
              <img src={assetUrl("assets/icons/left.svg")} alt="" />
            </button>
            <button data-key="s" title="Pan Backward">
              <img src={assetUrl("assets/icons/down.svg")} alt="" />
            </button>
            <button data-key="d" title="Pan Right">
              <img src={assetUrl("assets/icons/right.svg")} alt="" />
            </button>
          </div>
          <div className="spectator-group" id="spectator-tabs">
            <button className="spectator-tab active" data-mode="top">
              <img src={assetUrl("assets/icons/map.svg")} alt="Map" />
            </button>
            <button className="spectator-tab" data-mode="follow">
              <img
                src={assetUrl("assets/icons/follow.svg")}
                alt="Follow"
              />
            </button>
          </div>
        </div>
        <button id="spectator-button" aria-label="Spectator">
          <img src={assetUrl("assets/icons/binoculars.svg")} alt="" />
        </button>
        <div id="aim-line"></div>
      </div>
      {/* Help overlay */}
      <button id="fullscreen-button" aria-label="Fullscreen">
        <img src={assetUrl("assets/icons/fullscreen.svg")} alt="" />
      </button>
      <button id="help-button" aria-label="Help">
        <img src={assetUrl("assets/icons/help.svg")} alt="" />
      </button>
      <div id="help-overlay" hidden>
        <div id="help-content">
          <table>
            <tbody>
              <tr>
                <td>
                  <kbd>↑</kbd> <kbd>W</kbd>
                </td>
                <td>Move forward</td>
              </tr>
              <tr>
                <td>
                  <kbd>↓</kbd> <kbd>S</kbd>
                </td>
                <td>Move backward</td>
              </tr>
              <tr>
                <td>
                  <kbd>←</kbd> <kbd>→</kbd>
                </td>
                <td>Turn left / right</td>
              </tr>
              <tr>
                <td>
                  <kbd>A</kbd> <kbd>D</kbd> <kbd>,</kbd> <kbd>.</kbd>
                </td>
                <td>Strafe</td>
              </tr>
              <tr>
                <td>
                  <kbd>Shift</kbd>
                </td>
                <td>Run</td>
              </tr>
              <tr>
                <td>
                  <kbd>Z</kbd>
                </td>
                <td>Strafe modifier</td>
              </tr>
              <tr>
                <td>
                  <kbd>Alt</kbd> <kbd>X</kbd> <kbd>Click</kbd>
                </td>
                <td>Fire weapon</td>
              </tr>
              <tr>
                <td>
                  <kbd>Space</kbd>
                </td>
                <td>Use (doors, switches)</td>
              </tr>
              <tr>
                <td>
                  <kbd>1</kbd>–<kbd>7</kbd>
                </td>
                <td>Select weapon</td>
              </tr>
              <tr>
                <td>
                  <kbd>Esc</kbd>
                </td>
                <td>Menu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Menu */}
      <div id="menu">
        <button id="menu-button" aria-label="Menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 665.79 375.13"
            width="28"
          >
            <path
              fill="#fff"
              d="M103.11 375.03C38.88 374.97-.75 338.8.01 272.24V103.85c0-33.74 9.88-59.4 29.64-76.96 35.49-34.19 117.83-36.27 152.59.52 21.42 18.89 29.5 57.48 27.58 93.49H136.1c.56-14.15-.19-35.58-8.51-43.65-10.81-14.63-39.36-12.91-46.91 2.32-4.64 8.26-6.96 20.49-6.96 36.67v146.18c0 30.65 10.65 46.15 31.96 46.49 9.96 0 17.53-3.62 22.68-10.85 7.19-8.58 8.31-27.58 7.73-41.32h73.72c5.04 70.07-36.32 119.16-106.71 118.29zm234.04 0c-71.17.98-103.01-49.66-101.04-118.29h69.59c-1.93 29.92 8.35 57.17 32.99 55.27 10.99 0 18.73-3.44 23.2-10.33 8.5-12.59 10.09-48.95-2.06-63.02-8.49-13.55-39.03-25.51-55.16-33.57-23.03-11.02-39.61-24.1-49.75-39.26-22.87-33.64-20.75-107.48 11.34-137.4 31.18-36.92 112.61-38.62 143.82-.77 19.25 19.51 27.66 57.9 26.03 93.23h-67.02c.57-14.52-.8-37.95-6.44-46.49-3.95-7.23-11.43-10.85-22.42-10.85-19.59 0-29.38 11.71-29.38 35.12.21 24.86 9.9 35.06 32.48 45.45 29.24 11.36 66.42 30.76 79.9 54.24 40.2 71.54 12.62 180.82-86.09 176.65v.02Zm224.76 0c-71.17.98-103.01-49.66-101.04-118.29h69.59c-1.93 29.92 8.35 57.17 32.99 55.27 10.99 0 18.73-3.44 23.2-10.33 8.5-12.59 10.09-48.95-2.06-63.02-8.49-13.55-39.03-25.51-55.16-33.57-23.03-11.02-39.61-24.1-49.75-39.26-22.87-33.64-20.75-107.48 11.34-137.4 31.18-36.92 112.61-38.62 143.82-.77 19.25 19.51 27.66 57.9 26.03 93.23h-67.02c.57-14.52-.8-37.95-6.44-46.49-3.95-7.23-11.43-10.85-22.42-10.85-19.59 0-29.38 11.71-29.38 35.12.21 24.86 9.9 35.06 32.48 45.45 29.24 11.36 66.42 30.76 79.9 54.24 40.2 71.54 12.62 180.82-86.09 176.65v.02Z"
            />
          </svg>
        </button>
        <div id="menu-overlay" hidden>
          <div id="menu-inner">
            <div id="menu-content">
              <div className="menu-column" id="menu-levels">
                <div className="menu-heading">Level</div>
                <img
                  className="menu-episode"
                  src={assetUrl("assets/menu/M_EPI1.png")}
                  alt="Knee-Deep in the Dead"
                />
                <div className="menu-level-list"></div>
              </div>
              <div className="menu-column" id="menu-skills">
                <div className="menu-heading">Skill</div>
                <button className="menu-skill" data-skill="1">
                  <img
                    src={assetUrl("assets/menu/M_JKILL.png")}
                    alt="I'm too young to die"
                  />
                </button>
                <button className="menu-skill" data-skill="2">
                  <img
                    src={assetUrl("assets/menu/M_ROUGH.png")}
                    alt="Hey, not too rough"
                  />
                </button>
                <button className="menu-skill" data-skill="3">
                  <img
                    src={assetUrl("assets/menu/M_HURT.png")}
                    alt="Hurt me plenty"
                  />
                </button>
                <button className="menu-skill" data-skill="4">
                  <img
                    src={assetUrl("assets/menu/M_ULTRA.png")}
                    alt="Ultra-Violence"
                  />
                </button>
                <button className="menu-skill" data-skill="5">
                  <img
                    src={assetUrl("assets/menu/M_NMARE.png")}
                    alt="Nightmare!"
                  />
                </button>
              </div>
            </div>
            <div id="menu-about">
              <p>
                cssDOOM is DOOM, but completely rendered using CSS. The game
                logic is reimplemented in JavaScript, but the rendering is all
                CSS transforms, animations, and SVG filters.{" "}
                <a href="https://nielsleenheer.com/articles/2026/css-is-doomed-rendering-doom-in-3d-with-css/">
                  Read more...
                </a>
              </p>
              <p>
                Created by Niels Leenheer, no copyright infringement intended.
                All original DOOM assets are used under fair use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
