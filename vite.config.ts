import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    return {
      // The define block for process.env.API_KEY has been removed
      // as the API key is no longer needed on the client-side.
    };
});