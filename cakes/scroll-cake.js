(function(){
 'use strict';
 window.createCakeStory=function(toolbar){
  const root=document.createElement('section');root.className='cake-story';root.setAttribute('aria-label','Демонстрационная начинка: ваниль — малина');
  root.innerHTML='<div class="cake-story-scene"><header><p class="story-eyebrow">Вкус — в каждой детали</p><h2 class="story-heading">Что внутри вашего торта</h2><p class="story-subtitle">Ваниль — малина · пример начинки для согласования</p></header><div class="layers-stage" role="img" aria-label="Три слоя ванильного бисквита, два слоя крема и ягодная прослойка. При прокрутке слои расходятся по вертикали."><div class="cake-stack"></div></div><footer class="story-footer"><div class="story-progress" aria-hidden="true"><span></span></div><p class="story-scroll-hint">Листайте вниз — торт раскроется ↓</p><p>Иллюстрация состава. Реальную начинку подтвердит Оксана.</p></footer></div>';
  const scene=root.firstElementChild,visual=root.querySelector('.layers-stage'),stack=root.querySelector('.cake-stack'),bar=root.querySelector('.story-progress span');
  const data=[{name:'Ванильный бисквит',pos:'100% 100%',offset:0},{name:'Нежный крем',pos:'0% 100%',offset:0},{name:'Ванильный бисквит',pos:'100% 50%',offset:0},{name:'Малиновая прослойка',pos:'0% 50%',offset:-.02},{name:'Нежный крем',pos:'100% 0%',offset:-.07},{name:'Ванильный бисквит',pos:'0% 0%',offset:-.05}];
  const parts=[],labels=[];data.forEach((d,i)=>{const part=document.createElement('div');part.className='cake-part';part.style.zIndex=String(i+1);const texture=document.createElement('div');texture.className='cake-texture';texture.style.backgroundPosition=d.pos;texture.style.transform='translateY('+d.offset*100+'%) scaleY(.6)';part.append(texture);stack.append(part);parts.push(part);const label=document.createElement('div');label.className='layer-label';label.setAttribute('aria-hidden','true');label.textContent=d.name;visual.append(label);labels.push(label)});
  let destroyed=false,media,resizeObserver,frame,timeline;
  const toolbarHeight=()=>Math.ceil(toolbar?.getBoundingClientRect().height||0);
  const startY=i=>(2.5-i)*stack.clientWidth*.081;
  const endY=i=>(2.5-i)*Math.max(24,Math.min(80,(visual.clientHeight-stack.clientWidth*.28-20)/5));
  function staticScene(){root.classList.add('story-static');parts.forEach((p,i)=>p.style.transform='translateY(calc(-50% + '+endY(i)+'px))');labels.forEach((p,i)=>{p.style.opacity='1';p.style.transform='translateY(calc(-50% + '+endY(i)+'px))'})}
  function init(){
   root.style.setProperty('--toolbar-h',toolbarHeight()+'px');
   const image=new Image();image.src='assets/cake-layers-sprite.png';
   const loaded=image.decode?image.decode():new Promise((ok,no)=>{image.onload=ok;image.onerror=no});
   loaded.then(()=>{if(destroyed)return;
    if(!window.gsap||!window.ScrollTrigger){staticScene();return}
    gsap.registerPlugin(ScrollTrigger);media=gsap.matchMedia();
    media.add({all:'(min-width:0px)',reduce:'(prefers-reduced-motion:reduce)'},context=>{
     if(context.conditions.reduce){staticScene();return()=>{root.classList.remove('story-static');parts.concat(labels).forEach(p=>p.removeAttribute('style'));parts.forEach((p,i)=>p.style.zIndex=String(i+1))}}
     root.classList.remove('story-static');gsap.set(parts,{yPercent:-50,y:i=>startY(i)});gsap.set(labels,{yPercent:-50,y:i=>startY(i),opacity:0});
     timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:root,pin:scene,start:()=> 'top '+toolbarHeight(),end:()=>'+='+(root.clientWidth<600?950:1500),scrub:.7,anticipatePin:1,invalidateOnRefresh:true,onRefreshInit:()=>{root.style.setProperty('--toolbar-h',toolbarHeight()+'px');}}});
     timeline.fromTo(parts,{yPercent:-50,y:i=>startY(i)},{y:i=>endY(i),duration:1},.12).fromTo(labels,{yPercent:-50,y:i=>startY(i)},{y:i=>endY(i),duration:1},.12).to([...labels].reverse(),{opacity:1,stagger:.07,duration:.18},.35).to(bar,{scaleX:1,duration:1},.12).to({}, {duration:.18});
     resizeObserver=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!destroyed)ScrollTrigger.refresh()})});resizeObserver.observe(toolbar);let previousWidth=root.clientWidth;const widthObserver=new ResizeObserver(()=>{if(root.clientWidth!==previousWidth){previousWidth=root.clientWidth;ScrollTrigger.refresh()}});widthObserver.observe(root);
     return()=>{resizeObserver?.disconnect();widthObserver.disconnect();cancelAnimationFrame(frame);timeline=null};
    });
    ScrollTrigger.refresh();
   }).catch(()=>{if(destroyed)return;visual.className='story-fallback';visual.removeAttribute('role');visual.removeAttribute('aria-label');visual.textContent='Ванильный бисквит · нежный крем · малиновая прослойка. Изображение слоёв недоступно.';root.classList.add('story-static')});
  }
  return {element:root,init,destroy(){destroyed=true;media?.revert();resizeObserver?.disconnect();cancelAnimationFrame(frame)}};
 };
})();
