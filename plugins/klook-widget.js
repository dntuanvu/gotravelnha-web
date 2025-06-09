export default defineNuxtPlugin((nuxtApp) => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://affiliate.klook.com/widget/fetch-iframe-init.js';
      script.async = true;
      document.body.appendChild(script);
    }
});
  