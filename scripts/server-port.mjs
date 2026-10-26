export const DEFAULT_PORT = 3001;

export function serverPort(value) {
  if (value === undefined) return DEFAULT_PORT;
  if (!/^\d+$/.test(String(value))) throw new Error('PORT must be an integer from 1024 to 65535.');
  const port = Number(value);
  if (!Number.isSafeInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be an integer from 1024 to 65535.');
  return port;
}
