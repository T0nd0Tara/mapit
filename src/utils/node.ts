
const req = (window as any).require;
export const fs = req('node:fs').promises as typeof import('fs/promises');
export const os = req('node:os') as typeof import('os');
export const path = req('node:path') as typeof import('path');
