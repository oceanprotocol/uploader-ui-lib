import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import styles from 'rollup-plugin-styles';
import image from '@rollup/plugin-image';
import {sizeSnapshot} from 'rollup-plugin-size-snapshot';
import packageJson from './package.json';

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
      nodeResolve(),
      typescript(),
      styles(),
      image(),
      sizeSnapshot()
    ],
    watch: {
      clearScreen: false
    }
  }
];