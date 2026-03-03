import { homedir } from "node:os";
import { join } from "node:path";

function getEnvPath(name) {
  const value = process.env[name];
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getDataHome() {
  return getEnvPath("XDG_DATA_HOME") || join(homedir(), ".local", "share");
}

function getStateHome() {
  return getEnvPath("XDG_STATE_HOME") || join(homedir(), ".local", "state");
}

function getBaseDirOverride() {
  return getEnvPath("CDP_BROWSER_BASE_DIR");
}

export function getUserDataDir() {
  const baseDirOverride = getBaseDirOverride();
  if (baseDirOverride) {
    return join(baseDirOverride, "browser-data");
  }

  return join(getDataHome(), "cdp-browser", "browser-data");
}

export function getLogRootDir() {
  const baseDirOverride = getBaseDirOverride();
  if (baseDirOverride) {
    return join(baseDirOverride, "logs");
  }

  return join(getStateHome(), "cdp-browser", "logs");
}
