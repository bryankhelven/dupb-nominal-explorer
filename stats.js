(()=>{
  const E=window.DUPB_ENTRIES||[], C=window.DUPB_COMMON, R=window.DUPB_RELEASE_INFO||{};
  const senses=e=>e.entries.flatMap(x=>x.senses);
  const prof={allS:0,mixed:0,nonly:0};
  const bySense=new Map(), byPred=new Map();

  for(const e of E){
    const ss=senses(e), p=ss.filter(x=>x.predicator).length;
    if(p===0) prof.nonly++;
    else if(p===ss.length) prof.allS++;
    else prof.mixed++;
    bySense.set(ss.length,(bySense.get(ss.length)||0)+1);
    byPred.set(p,(byPred.get(p)||0)+1);
  }

  document.querySelector('#headline').innerHTML=[
    ['Nomes',R.total_lemmas],
    ['Acepções',R.senses],
    ['Acepções predicadoras',R.predicator_senses],
    ['Acepções não predicadoras',R.non_predicator_senses]
  ].map(([l,n])=>`<div class="info-card"><b>${C.format(n)}</b><span>${l}</span></div>`).join('');

  function bars(el,rows){
    const max=Math.max(...rows.map(x=>x[1]));
    document.querySelector(el).innerHTML=rows.map(([l,n])=>
      `<div class="bar-row"><span>${C.esc(l)}</span><span class="bar"><i style="width:${100*n/max}%"></i></span><b>${C.format(n)}</b></div>`
    ).join('');
  }

  bars('#profileBars',[
    ['Só predicadoras',prof.allS],
    ['Mistos',prof.mixed],
    ['Sem predicadoras',prof.nonly]
  ]);

  const buckets=[[1,1],[2,2],[3,3],[4,5],[6,10],[11,20],[21,999]];
  bars('#senseBars',buckets.map(([a,b])=>[
    a===b?`${a}`:`${a}–${b===999?'mais':b}`,
    [...bySense].filter(([k])=>k>=a&&k<=b).reduce((sum,[,v])=>sum+v,0)
  ]));

  const predRows=[
    ['0',byPred.get(0)||0],
    ['1',byPred.get(1)||0],
    ['2–3',[...byPred].filter(([k])=>k>=2&&k<=3).reduce((sum,[,v])=>sum+v,0)],
    ['4 ou mais',[...byPred].filter(([k])=>k>=4).reduce((sum,[,v])=>sum+v,0)]
  ];
  bars('#predBars',predRows);

  const top=E.map(e=>[e.lemma,senses(e).length])
    .sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'pt-BR'))
    .slice(0,15);
  document.querySelector('#topNames').innerHTML=top.map(([l,n])=>
    `<div class="bar-row"><span>${C.esc(l)}</span><span></span><b>${n}</b></div>`
  ).join('');
})();
