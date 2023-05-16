import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import image from '@rollup/plugin-image';
import {sizeSnapshot} from 'rollup-plugin-size-snapshot';
import packageJson from './package.json';
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import {terser} from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.ts',
    external: [
      ...Object.keys(packageJson.devDependencies)
    ],
    output: [
      {file: packageJson.main, format: 'cjs', sourcemap: true},
      {file: packageJson.module, format: 'es', sourcemap: true}
    ],
    plugins: [
      peerDepsExternal(),
      nodeResolve(),
      typescript({ useTsconfigDeclarationDir: true }),
      postcss({
        sourceMap: true,
        extract: true,
        minimize: true
      }),
      image(),
      terser(),
      sizeSnapshot()
    ],
    watch: {
      clearScreen: false
    }
  }
];