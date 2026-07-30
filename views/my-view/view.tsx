/** MCP App starter view — edit this file to build your UI. */
import {
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
import { useState } from "react";
import { z } from "zod";

import {
  ExpandIcon,
  ExternalLinkIcon,
  MonitorIcon,
  MoonIcon,
  PipIcon,
  SmartphoneIcon,
  SunIcon,
} from "./icons.js";
import "./view.css";

export default function McpApp() {
  // useToolContext — tool lifecycle (pending / error / result)
  const view = useToolContext<"doom-iframe">();
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
    <div>
      <iframe
        src="https://js-dos.com/games/doom.exe.html"
        width="740"
        height="375"
        frameBorder="0"
        scrolling="yes"
        allowFullScreen
      ></iframe>
    </div>
  );
}
