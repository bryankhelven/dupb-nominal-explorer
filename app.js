(()=>{
const E=window.DUPB_ENTRIES||[],M=window.DUPB_METADATA||{},C=window.DUPB_COMMON;
let pf='all',sf='all',alpha='all',sel=null,renderRows=[],rendered=0,observer=null;

const senses=e=>e.entries.flatMap(x=>x.senses);
const predCount=e=>senses(e).filter(x=>x.predicator).length;
const nonPredCount=e=>senses(e).length-predCount(e);
const profile=e=>{const n=senses(e).length,p=predCount(e);return p===0?'nonly':p===n?'allS':'mixed'};
const profileText=e=>{const p=profile(e);return p==='allS'?'Todos os sentidos predicadores':p==='mixed'?'Sentidos predicadores e não predicadores':'Sem sentidos predicadores'};
const plural=(n,one,many)=>Number(n)===1?one:many;
const fmt=n=>C.format(n);
const qel=()=>document.querySelector('#q');
const SEARCH_INDEX=E.map(e=>({e,lemma:C.fold(e.lemma),description:C.fold(senses(e).map(s=>s.description||'').join(' '))}));

function okpMode(e,mode){const p=profile(e);return mode==='all'||(mode==='hasS'&&predCount(e)>0)||mode===p}
function okp(e){return okpMode(e,pf)}
function oks(s){return sf==='all'||(sf==='S'&&s.predicator)||(sf==='N'&&!s.predicator)}
function visibleCount(e,mode=sf){return mode==='S'?predCount(e):mode==='N'?nonPredCount(e):senses(e).length}

function boundedNear(a,b){
  if(Math.abs(a.length-b.length)>2||a.slice(0,3)!==b.slice(0,3))return false;
  if(a===b)return true;
  const m=a.length,n=b.length,prev=Array.from({length:n+1},(_,i)=>i),cur=new Array(n+1);
  for(let i=1;i<=m;i++){cur[0]=i;let rowMin=cur[0];for(let j=1;j<=n;j++){cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));rowMin=Math.min(rowMin,cur[j])}if(rowMin>2)return false;for(let j=0;j<=n;j++)prev[j]=cur[j]}return prev[n]<=2
}
function rankIndexed(x,q){if(!q)return {score:0,reason:'all'};const lemma=x.lemma;if(lemma===q)return {score:0,reason:'exact'};if(lemma.startsWith(q))return {score:10,reason:'prefix'};if(lemma.includes(q))return {score:20,reason:'contains'};if(q.length>=4&&boundedNear(lemma,q))return {score:28,reason:'near'};if(x.description.includes(q))return {score:40,reason:'description'};return null}
function baseFacetRows(){const q=C.fold(qel().value.trim()),min=Number(document.querySelector('#minSenses').value),max=Number(document.querySelector('#maxSenses').value),out=[];for(const x of SEARCH_INDEX){const e=x.e,n=senses(e).length;if(n<min||n>max)continue;if(alpha!=='all'&&!x.lemma.startsWith(C.fold(alpha)))continue;const r=rankIndexed(x,q);if(r===null)continue;out.push({e,r,n:x.lemma})}out.sort((a,b)=>a.r.score-b.r.score||a.n.localeCompare(b.n,'pt-BR'));return out}
function rows(){return baseFacetRows().filter(x=>okp(x.e)&&visibleCount(x.e)>0).map(x=>x.e)}

function resultMeta(e){const total=senses(e).length,p=predCount(e),n=total-p;if(sf==='S')return `${fmt(p)} ${plural(p,'acepção predicadora','acepções predicadoras')}`;if(sf==='N')return `${fmt(n)} ${plural(n,'acepção não predicadora','acepções não predicadoras')}`;const parts=[`${fmt(total)} ${plural(total,'acepção','acepções')}`];if(p>0)parts.push(`${fmt(p)} ${plural(p,'predicadora','predicadoras')}`);if(n>0)parts.push(`${fmt(n)} ${plural(n,'não predicadora','não predicadoras')}`);return parts.join(' · ')}
function renderMore(batch=140){const host=document.querySelector('#list'),end=Math.min(rendered+batch,renderRows.length);if(end<=rendered)return;const html=renderRows.slice(rendered,end).map(e=>`<button class="lem lexical-row ${sel===e.lemma?'sel':''}" data-l="${C.esc(e.lemma)}"><span class="lex-main"><strong>${C.esc(e.lemma)}</strong><small>${C.esc(resultMeta(e))}</small></span><span class="chev" aria-hidden="true">›</span></button>`).join('');host.insertAdjacentHTML('beforeend',html);host.querySelectorAll('.lem:not([data-bound])').forEach(b=>{b.dataset.bound='1';b.onclick=()=>show(b.dataset.l)});rendered=end}
function list(){const r=rows(),names=r.length,vis=r.reduce((a,e)=>a+visibleCount(e),0);const suffix=sf==='S'?plural(vis,'acepção predicadora','acepções predicadoras'):sf==='N'?plural(vis,'acepção não predicadora','acepções não predicadoras'):plural(vis,'acepção','acepções');document.querySelector('#count').textContent=`${fmt(names)} ${plural(names,'nome','nomes')} · ${fmt(vis)} ${suffix}`;const host=document.querySelector('#list');host.innerHTML='';renderRows=r;rendered=0;renderMore();updateFacetCounts();activeFilters()}

function current(){return E.find(x=>x.lemma===sel)}
function save(filename,text,type){const blob=new Blob([text],{type}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function fname(s){return C.fold(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'entrada'}
function exportJSON(){const e=current();if(e)save(`${fname(e.lemma)}.json`,JSON.stringify(e,null,2)+'\n','application/json;charset=utf-8')}
function exportJSONL(){const e=current();if(!e)return;const lines=[];e.entries.forEach(g=>g.senses.forEach(s=>lines.push(JSON.stringify({lemma:e.lemma,entry:g.entry,...s}))));save(`${fname(e.lemma)}.jsonl`,lines.join('\n')+'\n','application/x-ndjson;charset=utf-8')}
function updateUrl(l){const u=new URL(location.href);u.searchParams.set('lemma',l);history.pushState({lemma:l},'',u)}
function entrySummary(e){
  const ss=senses(e),p=predCount(e),n=ss.length-p;
  if(sf==='S')return `${fmt(p)} ${plural(p,'acepção predicadora','acepções predicadoras')} de ${fmt(ss.length)} ${plural(ss.length,'acepção','acepções')} no DUPB`;
  if(sf==='N')return `${fmt(n)} ${plural(n,'acepção não predicadora','acepções não predicadoras')} de ${fmt(ss.length)} ${plural(ss.length,'acepção','acepções')} no DUPB`;
  return `${fmt(ss.length)} ${plural(ss.length,'acepção','acepções')} · ${fmt(p)} ${plural(p,'predicadora','predicadoras')} · ${fmt(n)} ${plural(n,'não predicadora','não predicadoras')}`
}
function renderEntry(e){
  sel=e.lemma;document.querySelector('#intro').hidden=true;document.querySelector('#entry').hidden=false;document.querySelector('#title').textContent=e.lemma;
  const ss=senses(e),sc=predCount(e),nc=ss.length-sc;document.querySelector('#summary').textContent=entrySummary(e);
  document.querySelector('#lexicalData').innerHTML=`<dt>Acepções</dt><dd>${fmt(ss.length)}</dd><dt>Predicadoras</dt><dd>${fmt(sc)}</dd><dt>Não predicadoras</dt><dd>${fmt(nc)}</dd><dt>Perfil</dt><dd>${C.esc(profileText(e))}</dd>`;
  document.querySelector('#groups').innerHTML=e.entries.map(g=>{const s=g.senses.filter(oks);if(!s.length)return'';return `<section class="grp">${e.entries.length>1?`<h3>${C.esc(e.lemma)}<sup>${g.entry}</sup></h3>`:''}${s.map(x=>`<article class="card"><div class="top"><span class="num">Sentido DUPB ${x.sense}</span><span class="badge ${x.predicator?'S':'N'}">${x.predicator?'Predicador':'Não predicador'}</span></div><p class="desc">${C.esc(x.description)}</p></article>`).join('')}</section>`}).join('')||'<p>Nenhuma acepção corresponde ao filtro atual.</p>';
  list()
}
function show(l,writeUrl=true){const e=E.find(x=>x.lemma===l);if(!e)return;if(writeUrl)updateUrl(l);renderEntry(e)}
function alphabet(){const chars=['all',...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];document.querySelector('#alphabet').innerHTML=chars.map(x=>`<button data-a="${x}" class="alpha ${x==='all'?'on':''}">${x==='all'?'Todos':x}</button>`).join('');document.querySelectorAll('.alpha').forEach(b=>b.onclick=()=>{alpha=b.dataset.a;document.querySelectorAll('.alpha').forEach(x=>x.classList.toggle('on',x===b));list()})}

function setButtonCount(button,n){const c=button.querySelector('.facet-count');if(c)c.textContent=fmt(n)}
function updateFacetCounts(){const base=baseFacetRows().map(x=>x.e);const pc={all:base.length,hasS:base.filter(e=>predCount(e)>0).length,allS:base.filter(e=>profile(e)==='allS').length,mixed:base.filter(e=>profile(e)==='mixed').length,nonly:base.filter(e=>profile(e)==='nonly').length};document.querySelectorAll('#profiles button').forEach(b=>setButtonCount(b,pc[b.dataset.p]||0))}
function activeFilters(){
  const host=document.querySelector('#activeFilters'),chips=[];
  const q=qel().value.trim();if(q)chips.push(['Busca: '+q,()=>{qel().value='';list()}]);
  if(pf!=='all')chips.push([document.querySelector(`#profiles [data-p="${pf}"] .facet-label`).textContent.trim(),()=>{pf='all';syncButtons();list()}]);
  if(sf!=='all')chips.push([sf==='S'?'Acepções predicadoras':'Acepções não predicadoras',()=>{sf='all';syncButtons();if(sel)renderEntry(current());else list()}]);
  if(alpha!=='all')chips.push(['Letra: '+alpha,()=>{alpha='all';document.querySelectorAll('.alpha').forEach(x=>x.classList.toggle('on',x.dataset.a==='all'));list()}]);
  host.innerHTML='';host.hidden=!chips.length;chips.forEach(([t,fn])=>{const b=document.createElement('button');b.type='button';b.className='filter-chip';b.textContent=t+' ×';b.onclick=fn;host.appendChild(b)})
}

function syncButtons(){document.querySelectorAll('#profiles button').forEach(b=>{const on=b.dataset.p===pf;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});document.querySelectorAll('#senseFilters button').forEach(b=>{const on=b.dataset.s===sf;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)})}

let searchFrame=null;document.querySelector('#q').oninput=()=>{if(searchFrame)cancelAnimationFrame(searchFrame);searchFrame=requestAnimationFrame(list)};
document.querySelector('#jsonOne').onclick=exportJSON;document.querySelector('#jsonlOne').onclick=exportJSONL;document.querySelector('#copyLink').onclick=e=>sel&&C.copy(C.entryUrl(sel),e.currentTarget);document.querySelector('#copyCitation').onclick=e=>sel&&C.copy(C.citation(sel),e.currentTarget);document.querySelector('#copyBibtex').onclick=e=>sel&&C.copy(C.bibtex(sel),e.currentTarget);
document.querySelectorAll('#profiles button').forEach(b=>b.onclick=()=>{pf=b.dataset.p;syncButtons();list()});
document.querySelectorAll('#senseFilters button').forEach(b=>b.onclick=()=>{sf=b.dataset.s;syncButtons();if(sel)renderEntry(current());else list()});
document.querySelector('#minSenses').onchange=list;document.querySelector('#maxSenses').onchange=list;
const sentinel=document.querySelector('#listSentinel');if('IntersectionObserver' in window&&sentinel){observer=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting))renderMore()},{root:document.querySelector('.filters'),rootMargin:'500px 0px'});observer.observe(sentinel)}
const st=[['total_lemmas','nomes'],['has_predicator_lemmas','com algum sentido predicador'],['n_only_lemmas','sem sentidos predicadores'],['senses','acepções'],['predicator_senses','acepções predicadoras'],['non_predicator_senses','acepções não predicadoras']];document.querySelector('#stats').innerHTML=st.map(([k,t])=>`<div class="stat"><b>${C.format(M[k])}</b><span>${t}</span></div>`).join('');alphabet();syncButtons();
const requested=new URL(location.href).searchParams.get('lemma');if(requested){const exact=E.find(e=>C.fold(e.lemma)===C.fold(requested));if(exact){document.querySelector('#q').value=exact.lemma;renderEntry(exact)}else list()}else list();
window.onpopstate=()=>{const q=new URL(location.href).searchParams.get('lemma');if(q){const e=E.find(x=>C.fold(x.lemma)===C.fold(q));if(e){document.querySelector('#q').value=e.lemma;renderEntry(e);return}}sel=null;document.querySelector('#entry').hidden=true;document.querySelector('#intro').hidden=false;list()};
})();
