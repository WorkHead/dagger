import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: './src/dagger-instance.js',
  format: 'umd',
  moduleName: 'Dagger',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  dest: './dest/dagger.js'
};