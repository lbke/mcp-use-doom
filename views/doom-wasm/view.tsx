// Clone https://github.com/NielsLeenheer/cssDOOM
// Build the app
// Copy HTML here + adapt for React (class -> className, close img, point "assets/" to "/mcp/_mcp-use/public/assets")
// Copy assets in /public and add script/link to load css and js
// Copy maps in /public (used by the JS code)
// replace /assets with /mcp/_mcp-use/public/mcp/_mcp-use/public/assets

/** MCP App starter view — edit this file to build your UI. */
import {
  useDisplayMode,
  useHostContext,
  useOpenExternal,
  useSendFollowUp,
  useToolContext,
  useViewTheme,
} from "mcp-use/react";

import "./view.css";

export default function McpApp() {
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
      <script
        type="text/javascript"
        src="/mcp/_mcp-use/public/doom-wasm/index_script.js"
      ></script>
      <script
        type="text/javascript"
        src="/mcp/_mcp-use/public/doom-wasm/websockets-doom.js"
      ></script>
    </>
  );
}
