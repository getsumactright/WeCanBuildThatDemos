const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const updateView=change=>{if(document.startViewTransition&&!reduced)document.startViewTransition(change);else change();};
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>a.closest('details').open=false));
const feedback=document.querySelector('.booking-feedback');
function booking(){feedback.hidden=false;}
document.querySelectorAll('[data-booking-demo]').forEach(b=>b.addEventListener('click',booking));
document.querySelectorAll('form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();booking();}));
feedback?.querySelector('button').addEventListener('click',()=>feedback.hidden=true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&feedback)feedback.hidden=true;});
document.querySelectorAll('a[href="#consultation"]').forEach(a=>a.addEventListener('click',()=>{const s=document.querySelector('#consultation');s?.setAttribute('tabindex','-1');setTimeout(()=>s?.focus({preventScroll:true}),100);}));
const tabs=[...document.querySelectorAll('.look-tab')],cards=[...document.querySelectorAll('.look-card')];
function filter(category){tabs.forEach(t=>t.setAttribute('aria-pressed',String(t.id==='tab-'+category)));updateView(()=>cards.forEach(c=>c.hidden=category!=='all'&&c.dataset.category!==category));}
tabs.forEach(t=>t.addEventListener('click',()=>filter(t.id.replace('tab-',''))));if(tabs.length)filter('all');
const choice=[...document.querySelectorAll('.selector-tab-btn')],views=[...document.querySelectorAll('.service-view')];
function select(i){choice.forEach((c,k)=>{c.setAttribute('aria-pressed',String(k===i));c.setAttribute('aria-controls','service-view-'+k);});views.forEach((v,k)=>{v.classList.remove('hidden');v.hidden=i!==k;});}
choice.forEach((c,i)=>c.addEventListener('click',()=>select(i)));if(choice.length)select(0);
window.addEventListener('message',e=>{if(e.origin!==location.origin||!Number.isFinite(e.data?.assistHeight))return;for(const f of document.querySelectorAll('iframe'))if(f.contentWindow===e.source)f.style.height=Math.min(1000,Math.max(200,e.data.assistHeight))+'px';});
document.querySelectorAll('#consultation a[href="#consultation"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();booking();}));
