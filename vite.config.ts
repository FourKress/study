import { createVitePlugins } from './build/vite/plugins';
import proxyConfig from './build/vite/proxy';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import { wrapperEnv } from './build/utils';

function licensePublicKey() {
  const file = resolve(process.cwd(), 'src/generated/license-public.json');
  if (!existsSync(file)) return '';
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as { key?: unknown };
    return typeof parsed.key === 'string' ? parsed.key : '';
  } catch {
    return '';
  }
}

const pathResolve = (dir: string) => {
  return resolve(process.cwd(), '.', dir);
};

export default function ({ command, mode }: ConfigEnv): UserConfig {
  const isProduction = command === 'build';
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  return {
    root,
    base: './',
    resolve: {
      alias: [
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      port: 2222,
      host: true,
      hmr: true,
      proxy: proxyConfig,
    },
    preview: {
      port: 2222,
      host: true,
    },
    define: {
      'import.meta.env.VITE_LICENSE_PUBLIC_KEY': JSON.stringify(licensePublicKey()),
    },
    plugins: createVitePlugins(viteEnv, isProduction),
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 配置 全局 scss 变量
          additionalData: `@import '/@/styles/mixin.scss'; @import '/@/styles/vant.scss';`,
        },
      },
    },
  };
}
