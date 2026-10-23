'use strict';
const photos = [
  ['0O4A4825','kitchen','Кухня и гостиная'],['0O4A4892','kitchen','Фактуры и рабочая зона'],['0O4A4794','storage','Гардеробная за стеклом'],['0O4A4750','living','Пространство для жизни'],
  ['0O4A4912','storage','Встроенное хранение'],['0O4A4991','details','Детали ванной комнаты'],['0O4A4800','living','Спальня в спокойных тонах'],['0O4A4778','living','Рабочее место у окна'],
  ['0O4A4741','kitchen','Графитовая кухня'],['0O4A4746','living','Гостиная и ТВ-зона'],['0O4A4755','living','Открытая планировка'],['0O4A4768','storage','Стеклянные перегородки'],
  ['0O4A4815','living','Спальня: детали'],['0O4A4824','kitchen','Кухня по размеру пространства'],['0O4A4851','kitchen','Кухонный остров'],['0O4A4860','kitchen','Встроенная кухня'],
  ['0O4A4904','storage','Лаконичные фасады'],['0O4A4917','storage','Шкаф до потолка'],['0O4A4928','storage','Геометрия хранения'],['0O4A4940','storage','Прихожая'],
  ['0O4A4945','details','Ванная комната'],['0O4A4952','details','Подвесная тумба'],['0O4A4957','details','Ванная: фактуры'],['0O4A4963','storage','Скрытое хранение'],
  ['0O4A4970','details','Свет и фактура'],['0O4A4973','details','Детали интерьера'],['0O4A4997','details','Сочетание материалов'],['0O4A5010','living','Рабочая зона']
].map(([id,category,title])=>({id,category,title}));
const gallery=document.querySelector('#gallery');
const more=document.querySelector('#show-more');
let filter='all',expanded=false,visiblePhotos=photos,photoIndex=0,lastFocus;
function renderGallery(){
  visiblePhotos=photos.filter(p=>filter==='all'||p.category===filter);
  const shown=expanded?visiblePhotos:visiblePhotos.slice(0,8);
  gallery.replaceChildren(...shown.map(p=>{
    const button=document.createElement('button');button.className='gallery-card';
    button.setAttribute('aria-label',`Открыть фотографию: ${p.title}`);
    button.innerHTML=`<span class="gallery-image"><img src="assets/${p.id}-thumb.webp" alt="${p.title} — работа Мебельтрон" loading="lazy" width="800" height="1000"><span class="gallery-expand" aria-hidden="true">↗</span></span>`;
    button.addEventListener('click',()=>openPhoto(visiblePhotos.indexOf(p)));return button;
  }));
  document.querySelector('#gallery-count').textContent=`Показано ${shown.length} из ${visiblePhotos.length} фотографий`;
  more.hidden=shown.length===visiblePhotos.length;
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;expanded=false;
  document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  renderGallery();
}));
more.addEventListener('click',()=>{expanded=true;renderGallery();gallery.querySelectorAll('button')[8]?.focus({preventScroll:true});});
function showDialog(dialog){lastFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocus?.focus({preventScroll:true});});
});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
document.querySelectorAll('[data-contact]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.copy-status').textContent='';showDialog(document.querySelector('#contact-dialog'));}));
document.querySelector('.copy-phone').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText('+79189959595');document.querySelector('.copy-status').textContent='Номер скопирован';}
  catch{document.querySelector('.copy-status').textContent='Номер для звонка: +7 (918) 995-95-95';}
});
const lightbox=document.querySelector('#lightbox');
function updatePhoto(){
  const p=visiblePhotos[photoIndex];const img=document.querySelector('#lightbox-image');
  img.src=`assets/${p.id}.webp`;img.alt=`${p.title} — работа Мебельтрон`;
  document.querySelector('#lightbox-caption').textContent=p.title;
  document.querySelector('#lightbox-count').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${visiblePhotos.length}`;
}
function openPhoto(index){photoIndex=index;updatePhoto();showDialog(lightbox);}
function movePhoto(direction){photoIndex=(photoIndex+direction+visiblePhotos.length)%visiblePhotos.length;updatePhoto();}
document.querySelector('.prev').addEventListener('click',()=>movePhoto(-1));
document.querySelector('.next').addEventListener('click',()=>movePhoto(1));
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();movePhoto(1);}if(event.key==='ArrowLeft'){event.preventDefault();movePhoto(-1);}});
let touchStart;
lightbox.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX;},{passive:true});
lightbox.addEventListener('touchend',e=>{if(touchStart===undefined)return;const dx=e.changedTouches[0].clientX-touchStart;if(Math.abs(dx)>65)movePhoto(dx<0?1:-1);touchStart=undefined;},{passive:true});
const menuButton=document.querySelector('.menu-button');const nav=document.querySelector('.navigation');
function closeMenu(){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');}
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
document.querySelector('#year').textContent=new Date().getFullYear();
renderGallery();
