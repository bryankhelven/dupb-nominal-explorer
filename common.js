(()=>{
  const R=window.DUPB_RELEASE_INFO||{};
  const fold=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const format=n=>Number(n).toLocaleString('pt-BR');
  const baseUrl=()=>{const u=new URL(location.href);u.search='';u.hash='';u.pathname=u.pathname.replace(/(?:index|about|stats|download|404)\.html$/,'');return u.toString()};
  const entryUrl=lemma=>{const u=new URL(baseUrl());u.searchParams.set('lemma',lemma);return u.toString()};
  const citation=lemma=>{
    const target=lemma?`: entrada “${lemma}”`:'';
    const url=lemma?entryUrl(lemma):baseUrl();
    return `KHELVEN, Bryan. DUPB Nominal Explorer${target}. Release 1, 2026. Disponível em: ${url}`;
  };
  const bibtex=lemma=>{
    const key=lemma?`dupb-${fold(lemma).replace(/[^a-z0-9]+/g,'-')}`:'dupb-nominal-explorer';
    const title=lemma?`DUPB Nominal Explorer: entrada ${lemma}`:'DUPB Nominal Explorer';
    const url=lemma?entryUrl(lemma):baseUrl();
    return `@misc{${key},\n  author = {Bryan Khelven},\n  title = {${title}},\n  year = {2026},\n  note = {Release 1},\n  url = {${url}}\n}`;
  };
  async function copy(text,button){try{await navigator.clipboard.writeText(text);if(button){const old=button.textContent;button.textContent='Copiado';setTimeout(()=>button.textContent=old,1000)}}catch{window.prompt('Copie o texto:',text)}}
  document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.onclick=()=>window.DUPB_THEME.toggle());window.DUPB_THEME.paint();document.querySelectorAll('[data-release]').forEach(x=>x.textContent=`Release ${R.release}`);document.querySelectorAll('[data-dataset-sha]').forEach(x=>x.textContent=R.dataset_sha256||'')});
  window.DUPB_COMMON={R,fold,esc,format,entryUrl,citation,bibtex,copy};
})();
