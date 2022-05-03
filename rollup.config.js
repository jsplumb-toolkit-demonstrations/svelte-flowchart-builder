// rollup.config.js
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: './main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins: [
        resolve({ browser: true, extensions:['.svelte', '.js'] }),
        svelte({

            include: '**/*.svelte',

            // // Emit CSS as "files" for other plugins to process. default is true
            emitCss: false,
        })
    ]
}
