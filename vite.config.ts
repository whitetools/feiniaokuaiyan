
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import  path from 'path'
//element plus 使用的按需导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    resolve:{
        alias:{
            '@': path.resolve(__dirname, 'src'),
            '@/*': path.resolve(__dirname, 'src/*'),
            'com': path.resolve(__dirname, 'src/components')  // tsconfig.json 里也必须配置路径别名
        }
    },
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    },
    css: {
        //css预处理
        preprocessorOptions: {
            scss: {
                /*                引入全局预定义变量 需要设置 lang="scss" */
                additionalData: `@import "./src/styles/variables.scss";`,
            }
        }
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    server: {
        hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
        // 服务配置
        port: 18080, // 类型： number 指定服务器端口;
        open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
        cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
        //proxy look for https://vitejs.cn/config/#server-proxy
        proxy: {
            '/dev': {
                target: 'http://127.0.0.1:18888',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/dev/, '')
            }
        }
    }
})
