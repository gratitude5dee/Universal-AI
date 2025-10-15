import { Logger } from "../types";

function log(level: string, correlationId: string, message: string, meta?: Record<string, unknown>) {
  const payload = {
    level,
    correlationId,
    message,
    meta: meta ?? {},
    timestamp: new Date().toISOString()
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

export function createLogger(correlationId: string): Logger {
  return {
    debug(message, meta) {
      log("debug", correlationId, message, meta);
    },
    info(message, meta) {
      log("info", correlationId, message, meta);
    },
    warn(message, meta) {
      log("warn", correlationId, message, meta);
    },
    error(message, meta) {
      log("error", correlationId, message, meta);
    }
  };
}
