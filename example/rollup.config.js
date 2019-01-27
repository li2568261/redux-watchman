// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
export default {
  input: './src/store.ts',
  output: {
    file: './dist/store.js',
    format: 'cjs'
  },
  
  plugins: [
    resolve(),
    typescript()
  ]
}