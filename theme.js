(()=>{
  const key='dupb-theme';
  const saved=localStorage.getItem(key);
  const system=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  document.documentElement.dataset.theme=saved||system;
  window.DUPB_THEME={
    toggle(){
      const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
      document.documentElement.dataset.theme=next;localStorage.setItem(key,next);this.paint();
    },
    paint(){document.querySelectorAll('[data-theme-toggle]').forEach(b=>{const dark=document.documentElement.dataset.theme==='dark';b.textContent=dark?'☀':'☾';b.setAttribute('aria-label',dark?'Usar tema claro':'Usar tema escuro');b.setAttribute('title',dark?'Usar tema claro':'Usar tema escuro')})}
  };
})();
