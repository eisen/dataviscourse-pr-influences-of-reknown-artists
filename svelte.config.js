import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

const dev = process.argv.includes('dev')

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    postcss: true,
  }),

  kit: {
    adapter: adapter({
      fallback: '200.html',
      paths: {
        base: dev ? '' : '/dataviscourse-pr-influences-of-reknown-artists',
      },
    }),
    prerender: { entries: [] }
  }
}

export default config
