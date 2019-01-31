// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";

const index = process.argv.findIndex(val=>val=='--mode') + 1;
const plugins = [ resolve(), typescript()];
const mode = index ? process.argv[index] : 'umd';
if(mode !== 'esm') plugins.push(uglify());

export default {
  input: './src/index.ts',
  output: [{
    file: `./${mode}/index.${mode}.js`,
    format: mode,
    name: `index.${mode}.js`
  }],
  plugins
}