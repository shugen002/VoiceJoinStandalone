import path from 'path'

const ENV = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'
const WINDOW_PRELOAD_SCRIPT = isDev
  ? path.resolve('./src/renderer/preload/index.js')
  : path.join(__dirname, 'preload.js')
const WEBVIEW_PRELOAD_SCRIPT = isDev
  ? path.resolve('./src/renderer/preload/fakeBiliBridge.js')
  : path.join(__dirname, 'fakeBiliBridge.js')
const WINDOW_URL = isDev
  ? 'http://localhost:9080'
  : path.join(__dirname, 'index.html')
export default {
  ENV,
  isDev,
  WINDOW_PRELOAD_SCRIPT,
  WEBVIEW_PRELOAD_SCRIPT,
  WINDOW_URL
}
