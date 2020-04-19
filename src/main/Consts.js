import path from 'path'
import { app } from 'electron'
import packageJson from '../../package.json'

const ENV = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'
const WINDOW_PRELOAD_SCRIPT = isDev
  ? path.resolve('./src/renderer/preload/index.js')
  : path.join(__dirname, 'preload.js')
const WINDOW_URL = isDev
  ? 'http://localhost:9080'
  : path.join(__dirname, 'index.html')
export default {
  ENV,
  isDev,
  WINDOW_PRELOAD_SCRIPT,
  WINDOW_URL
}
