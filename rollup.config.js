import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import image from '@rollup/plugin-image';
import packageJson from './package.json';
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from 'rollup-plugin-postcss';
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";

export default [
  {
    input: 'src/index.ts',
    external: [
      ...Object.keys(packageJson.devDependencies)
    ],
    output: [
      {file: packageJson.main, format: 'cjs', sourcemap: true, inlineDynamicImports: true},
      {file: packageJson.module, format: 'es', sourcemap: true, inlineDynamicImports: true}
    ],
    plugins: [
      peerDepsExternal(),
      nodeResolve(),
      typescript({ useTsconfigDeclarationDir: true }),
      json(),
      postcss({
        sourceMap: true,
        extract: true,
        minimize: true
      }),
      image(),
      terser(),
      commonjs()
    ],
    watch: {
      clearScreen: false
    }
  }
];