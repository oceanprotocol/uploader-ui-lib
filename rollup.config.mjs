import typescript from 'rollup-plugin-typescript2';
import svgr from '@svgr/rollup'
import packageJson from './package.json' assert { type: 'json' };
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from 'rollup-plugin-postcss';
import {terser} from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import postcssImport from 'postcss-import';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default [
  {
    input: 'src/index.ts',
    output: [
      {file: packageJson.main, format: 'cjs', sourcemap: true, inlineDynamicImports: true},
      {file: packageJson.module, format: 'es', sourcemap: true, inlineDynamicImports: true}
    ],
    plugins: [
      peerDepsExternal(),
      commonjs(),
      nodePolyfills(),
      typescript({ useTsconfigDeclarationDir: true }),
      json(),
      postcss({
        sourceMap: true,
        extract: true,
        minimize: true,
        plugins: [postcssImport()]
      }),
      svgr(),
      terser()
    ],
    watch: {
      clearScreen: false
    }
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
    external: [/\.css$/], // telling rollup anything that is .css aren't part of type exports 
  }
];