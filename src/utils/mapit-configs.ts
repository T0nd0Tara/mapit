import { path, fs } from '@/utils/node.ts';
import JSON5 from 'json5';
export interface Config {
  routesDir: string
};

export function readFile(filename: Parameters<typeof fs.readFile>[0], options: Parameters<typeof fs.readFile>[1] & { encoding: BufferEncoding }): Promise<string | null> {
  return fs.readFile(filename, options).catch((_) => null);
}
export function getDefaultConfig(): Config {
  return {
    routesDir: path.join(nw.App.dataPath, 'routes'),
  }
}
export async function getConfig(): Promise<Config> {
  const configPath = path.join(nw.App.dataPath, "config.json5");
  const configStr: string | null = await readFile(configPath, { encoding: 'utf8' });

  if (configStr !== null) {
    return JSON5.parse(configStr);
  }

  const defaultConfig = getDefaultConfig();
  await fs.writeFile(configPath, JSON5.stringify(defaultConfig, null, 4));
  return defaultConfig;
}

