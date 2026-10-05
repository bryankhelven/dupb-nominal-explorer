(()=>{
const M=window.DUPB_PROV_META,D=window.DUPB_PROV_DATA,C=window.DUPB_COMMON;
const [q,origin,method,relation,scope]=['provQ','provOrigin','provMethod','provRelation','provScope'].map(id=>document.getElementById(id));
const results=document.getElementById('provResults'),count=document.getElementById('provCount');
const fmt=n=>Number(n).toLocaleString('pt-BR'),esc=s=>C.esc(s||''),fold=s=>C.fold(s||'');
const role=i=>M.roles[i],org=i=>M.origins[i],met=i=>M.methods[i],rso=i=>M.rolesetOrigins[i],rel=i=>M.relations[i],sch=i=>M.schemas[i];
function fill(sel,values){values.forEach((x,i)=>{const o=document.createElement('option');o.value=i;o.textContent=x;sel.appendChild(o)})}
fill(origin,M.origins);fill(method,M.methods);fill(relation,M.relations);
document.getElementById('provSummary').innerHTML=[
  [M.counts.senses,'acepções predicadoras'],
  [M.counts.arguments,'argumentos com provenance'],
  [M.counts.historicalNotRecovered,'fontes históricas antigas não recuperadas'],
  [M.counts.bounded,'análises restritas a um caso específico']
].map(([n,t])=>`<div class="prov-stat"><b>${fmt(n)}</b><span>${esc(t)}</span></div>`).join('');
function explanation(lemma,sense,a){
  const [slot,roleId,oi,mi,ri,reli,si,bounded,hist,source]=a;
  const r=role(roleId),o=org(oi),m=met(mi),re=rel(reli);
  if(hist){
    if(o==='PropBank em inglês'){
      return `Para a acepção ${sense} de ${lemma}, consultamos ${source||'um frame do PropBank em inglês'}. Comparamos a estrutura desse frame com a acepção do DUPB e atribuímos ${slot} ao participante descrito como “${r}”. A atribuição foi feita pela função semântica do participante, não pela posição em que ele aparece.`;
    }
    if(m==='Convenção para relações simétricas'){
      return `Para a acepção ${sense} de ${lemma}, identificamos uma relação entre dois participantes sem um agente separado. Aplicamos a convenção documentada no DUPB Noun para relações desse tipo, em que os dois membros recebem papéis distintos de acordo com sua função dentro da relação. Por isso, ${slot} foi definido como “${r}”.`;
    }
    if(m==='Associação ARG e papel já explícita no registro anterior'){
      return `Antes desta auditoria, a análise aceita para a acepção ${sense} de ${lemma} já registrava explicitamente ${slot} como “${r}”. Na revisão, recuperamos essa associação diretamente do registro existente e a preservamos sem alteração.`;
    }
    if(m==='Atribuição por função semântica'){
      return `Para a acepção ${sense} de ${lemma}, examinamos a função semântica deste participante, descrita como “${r}”. Comparamos essa função com o inventário de papéis usado no DUPB Noun e atribuímos ${slot} por correspondência semântica.`;
    }
    if(m==='Evidência explícita de frame ou significado lexical'){
      return `Para a acepção ${sense} de ${lemma}, o registro aceito continha evidência explícita de frame ou de significado lexical que associava este participante a ${slot}. A função registrada é “${r}”. Na auditoria, recuperamos essa associação e a mantivemos.`;
    }
    if(m==='Reutilização da definição de papel já registrada'){
      return `Para a acepção ${sense} de ${lemma}, reutilizamos uma definição de papel já registrada e semanticamente explícita no DUPB Noun. Essa definição foi aplicada a ${slot}, resultando em “${r}”.`;
    }
    if(m==='Reutilização de uma estrutura interna explicitamente identificada'){
      return `Para a acepção ${sense} de ${lemma}, reutilizamos a estrutura de troca já estabelecida para troca.01 no DUPB Noun. Como ${slot} desempenha a mesma função nessa estrutura, ele foi definido como “${r}”.`;
    }
    if(m==='Correspondência com estrutura interna de acordo'){
      return `Para a acepção ${sense} de ${lemma}, usamos a estrutura de acordo já documentada no DUPB Noun. Comparamos a função deste participante com os papéis dessa estrutura e atribuímos ${slot} à função “${r}”.`;
    }
  }
  if(o==='DUPB')return `Para a acepção ${sense} de ${lemma}, definimos este papel a partir dos usos documentados no DUPB. O participante correspondente a ${slot} foi descrito como “${r}”, representando a estrutura argumental observada para essa acepção.`;
  if(o.includes('PropBank'))return `Para a acepção ${sense} de ${lemma}, usamos ${o} como referência. Comparamos a estrutura da fonte com o uso registrado no DUPB e atribuímos ${slot} à função “${r}”. A relação com a fonte é: ${re.toLowerCase()}.`;
  if(o.includes('NomBank')||o.includes('NounBank'))return `Para a acepção ${sense} de ${lemma}, usamos ${o} como referência. Comparamos essa análise com a acepção do DUPB e atribuímos ${slot} à função “${r}”. A relação com a fonte é: ${re.toLowerCase()}.`;
  if(o.includes('Criado')||o.includes('Criada')||o.includes('Definida')||o.includes('Análise anterior'))return `Para a acepção ${sense} de ${lemma}, a análise de ${slot}, “${r}”, foi estabelecida no DUPB Noun. O procedimento registrado é: ${m.toLowerCase()}.`;
  return `Para a acepção ${sense} de ${lemma}, a análise associa ${slot} à função “${r}”. A origem registrada é ${o} e a relação com a fonte é ${re.toLowerCase()}.`;
}
function okSense(s){
  const [lemma,sense,val,args]=s,fq=fold(q.value.trim());
  return args.some(a=>{
    const text=fold([lemma,sense,role(a[1]),org(a[2]),met(a[3]),rso(a[4]),rel(a[5])].join(' '));
    if(fq&&!text.includes(fq))return false;
    if(origin.value!==''&&Number(origin.value)!==a[2])return false;
    if(method.value!==''&&Number(method.value)!==a[3])return false;
    if(relation.value!==''&&Number(relation.value)!==a[5])return false;
    if(scope.value==='bounded'&&!a[7])return false;
    return true;
  });
}
function visibleArgs(s){const [lemma,sense,val,args]=s,fq=fold(q.value.trim());return args.filter(a=>{
  const text=fold([lemma,sense,role(a[1]),org(a[2]),met(a[3]),rso(a[4]),rel(a[5])].join(' '));
  return (!fq||text.includes(fq))&&(origin.value===''||Number(origin.value)===a[2])&&(method.value===''||Number(method.value)===a[3])&&(relation.value===''||Number(relation.value)===a[5])&&(scope.value!=='bounded'||a[7]);
})}
function card(s){const [lemma,sense,val]=s,args=visibleArgs(s);return `<article class="prov-sense"><div class="prov-head"><div><h3>${esc(lemma)} · acepção ${esc(sense)}</h3><div class="prov-meta">${esc(val)} · ${args.length} ${args.length===1?'argumento':'argumentos'} nesta seleção</div></div><a class="prov-link" href="../../index.html?lemma=${encodeURIComponent(lemma)}">abrir entrada</a></div><div class="prov-args">${args.map(a=>{const [slot,roleId,oi,mi,ri,reli,si,bounded,hist]=a;return `<div class="prov-arg"><div class="prov-arg-title"><b>${esc(slot)}</b><span class="prov-role">${esc(role(roleId))}</span></div><div class="prov-tags"><span class="prov-tag">${esc(org(oi))}</span><span class="prov-tag">${esc(met(mi))}</span><span class="prov-tag">${esc(rel(reli))}</span>${bounded?'<span class="prov-tag">Válido somente para este caso</span>':''}</div><p class="prov-expl">${esc(explanation(lemma,sense,a))}</p>${hist?'<p class="prov-historical">Detalhe histórico: a fonte externa mais antiga usada em etapas anteriores não pôde ser recuperada. A origem científica atual acima permanece documentada.</p>':''}</div>`}).join('')}</div></article>`}
let timer=null;
function render(){
 const matches=D.filter(okSense);
 count.textContent=`${fmt(matches.length)} ${matches.length===1?'acepção':'acepções'} encontradas`;
 if(!matches.length){results.innerHTML='<div class="prov-empty">Nenhuma provenance corresponde aos filtros atuais.</div>';return}
 const first=matches.slice(0,120);
 results.innerHTML=first.map(card).join('')+(matches.length>120?`<div class="prov-empty">Mostrando as primeiras 120 acepções de ${fmt(matches.length)}. Refine os filtros para reduzir o resultado.</div>`:'');
}
[q,origin,method,relation,scope].forEach(el=>el.addEventListener(el===q?'input':'change',()=>{clearTimeout(timer);timer=setTimeout(render,80)}));
render();
})();