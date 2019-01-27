// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
export default {
  input: './src/index.ts',
  output: [{
    file: './cjs/index.js',
    format: 'cjs'
  },
  {
    file: './lib/index.js',
    format: 'umd',
    name: 'index.umd.js'
  },
  {
    file: './esm/index.esm.js',
    format: 'esm'
  }],
  plugins: [
    resolve(),
    typescript()
  ]
}