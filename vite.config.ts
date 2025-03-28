/// <reference types="vitest" />

import path from 'path';
import process from 'process';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig, loadEnv } from 'vite';
import postcssPresetEnv from 'postcss-preset-env';
// vite 默认不支持 require，使用 requireTransform 将支持 require(...)
import requireTransform from 'vite-plugin-require-transform';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const define = Object.keys(env).reduce((memo, key) => {
    memo[key] = JSON.stringify(env[key]);
    return memo;
  }, {});

  return {
    mode,
    define,
    publicDir: 'public',
    envPrefix: ['VITE_'],
    base: env.VITE_BASE_URL,
    resolve: {
      extensions: [ '.tsx', '.ts', '.jsx', '.js' ],
      alias: {
        '@': path.resolve('src'),
      }
    },
    plugins: [
      react(),
      legacy(),
      requireTransform({}),
      // 如果是 vue 项目，请使用 vite-svg-loader 插件。
      // 对以 "?react" 这种形式引入的 svg，将被转成 react 组件。
      svgr({ include: "**/*.svg?react", }),
    ],
    build: {
      outDir: 'build',
      cssMinify: true,
      minify: 'terser',
      emptyOutDir: true,
      cssCodeSplit: true,
      copyPublicDir: true,
      sourcemap: 'hidden',
      assetsInlineLimit: 10 * 1024,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        keep_classnames: false,
        keep_fnames: false,
        pure_func: ['console.log', 'mockServer'],
        format: {
          comments: false,
        }
      },
      rollupOptions: {
        output: {
          assetFileNames: (chunkInfo) => {
            const { name } = chunkInfo;
            if (/\.(jpg|jpeg|png|webp|bmp|gif|svg)$/.test(name)) {
              return 'image/[name].[hash][extname]';
            } else if (/\.(woff2|woff|ttf|eot)$/.test(name)) {
              return 'font/[name].[hash][extname]';
            } else if (/\.css$/.test(name)) {
              return 'css/[name].[hash].css';
            } else {
              return '[ext]/[name].[hash][extname]';
            }
          },
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].chunk.js',
          manualChunks: {
            'vendor-react': [ 'react', 'react-dom' ]
          }
        }
      }
    },
    css: {
      postcss: {
        plugins: [ postcssPresetEnv ]
      },
      // modules: {
      //   scopeBehaviour: 'local',
      //   localsConvention: 'camelCaseOnly',
      //   globalModulePaths: [ /(?<!\.module)\.css/, /(?<!\.module)\.less/ ],
      // },
      preprocessorOptions: {
        less: {
          modifyVars: {
            themeColor: env.VITE_THEME_COLOR,
          },
          globalVars: {},
          additionalData: '',
          javascriptEnable: true,
        }
      },
      devSourcemap: false,
    },
    server: {
      port: 3333,
      open: true,
      strictPort: true,
      host: 'localhost',
      // proxy: {
      //   '/v1.0': {
      //     target: 'http://192.168.5.2:20021',// 测试环境
      //     // target: 'http://192.168.5.2:30021',// 正式环境
      //     // target: 'http://192.168.5.120:2006',
      //     // 测试
      //     // target: 'http://192.168.5.61:2006',
      //     changeOrigin: true,
      //   },
      //   '/group1': {
      //     // target: 'http://192.168.5.120:2005',
      //     // 测试
      //     target: 'http://192.168.5.2:20021',
      //     changeOrigin: true,
      //   },
      // }
    },
    test: {
      include: [ 'test/**/*.{test,spec}.[jt]s(x)?' ],
      environment: 'jsdom',
      reporters: 'verbose',
      // setup 文件的路径。它们将运行在每个测试文件之前。
      setupFiles: [ './vitest.setup.ts' ],
      // 配置是否应处理 CSS。
      css: {
        // /.+/ 将匹配所有的 css 文件
        include: [ /.+/ ],
      },
      // 覆盖分析选项
      coverage: {
        provider: 'v8',
        // 是否启用，默认 false。
        enabled: true,
        // 对哪些文件或路径下面的文件进行分析
        include: [ 'src/utils', 'src/components', 'src/pages' ]
      }
    },
  };
})
