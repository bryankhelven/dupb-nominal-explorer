(()=>{
const resources=[
['https://bryankhelven.github.io/dupb-nominal-explorer/','Nomes','nominal'],
['https://bryankhelven.github.io/dupb-verbal-explorer/','Verbos','verbal'],
['https://bryankhelven.github.io/dupb-multiclass-explorer/','Multiclasses','multi']
];
document.addEventListener('DOMContentLoaded',()=>{
  const top=document.querySelector('.topbar');
  const nav=top?.querySelector('nav');
  if(!top||!nav)return;
  if(top.querySelector('.resource-switch'))return;
  const sw=document.createElement('div');
  sw.className='resource-switch';
  sw.setAttribute('aria-label','Recursos DUPB');
  sw.innerHTML=resources.map(([url,label,key])=>`<a href="${url}" class="${key==='nominal'?'active':''}">${label}</a>`).join('');
  top.insertBefore(sw,nav);
});
})();