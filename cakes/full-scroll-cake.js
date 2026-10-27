(function(){
 'use strict';
 window.createCakeStory=function(toolbar){
  const root=document.createElement('section');root.className='cake-story';root.setAttribute('aria-label','Демонстрационная начинка: ваниль — малина');
  root.innerHTML='<div class="cake-story-scene"><header><p class="story-eyebrow">Вкус — в каждой детали</p><h2 class="story-heading">Что внутри вашего торта</h2><p class="story-subtitle">Ваниль — малина · пример начинки для согласования</p></header><div class="layers-stage" role="img" aria-label="Три слоя ванильного бисквита, два слоя крема и ягодная прослойка. При прокрутке слои расходятся по вертикали."><div class="cake-stack"></div></div><footer class="story-footer"><div class="story-progress" aria-hidden="true"><span></span></div><p class="story-scroll-hint">Листайте вниз — торт раскроется ↓</p><p>Иллюстрация состава. Реальную начинку подтвердит Оксана.</p></footer></div>';
  const scene=root.firstElementChild,visual=root.querySelector('.layers-stage'),stack=root.querySelector('.cake-stack'),bar=root.querySelector('.story-progress span');
  const data=[{name:'Ванильный бисквит',pos:'100% 100%',offset:0},{name:'Нежный крем',pos:'0% 100%',offset:0},{name:'Ванильный бисквит',pos:'100% 50%',offset:0},{name:'Малиновая прослойка',pos:'0% 50%',offset:-.02},{name:'Нежный крем',pos:'100% 0%',offset:-.07},{name:'Ванильный бисквит',pos:'0% 0%',offset:-.05}];
  const parts=[],labels=[];data.forEach((d,i)=>{const part=document.createElement('div');part.className='cake-part';part.style.zIndex=String(i+1);const texture=document.createElement('div');texture.className='cake-texture';texture.style.backgroundPosition=d.pos;texture.style.transform='translateY('+d.offset*100+'%) scaleY(.6)';part.append(texture);stack.append(part);parts.push(part);const label=document.createElement('div');label.className='layer-label';label.setAttribute('aria-hidden','true');label.textContent=d.name;visual.append(label);labels.push(label)});
  let destroyed=false,ready=false,frame=0,layoutFrame=0,observer,distance=950,shown=0,previousTime=0,metrics;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=value=>Math.min(1,Math.max(0,value));
  function measure(){
   if(destroyed||!root.isConnected)return;
   const top=Math.ceil(toolbar?.getBoundingClientRect().height||0);
   root.style.setProperty('--toolbar-h',top+'px');
   root.classList.toggle('story-static',reduced.matches);
   root.classList.toggle('story-native',!reduced.matches);
   distance=root.clientWidth<600?950:1500;
   if(reduced.matches){root.style.removeProperty('height');scene.style.removeProperty('top')}
   else{scene.style.top=top+'px';root.style.height=Math.ceil(scene.getBoundingClientRect().height+distance)+'px'}
   const width=stack.clientWidth;
   metrics={top,start:width*.081,end:Math.max(24,Math.min(80,(visual.clientHeight-width*.28-20)/5))};
   schedule();
  }
  function paint(progress){
   if(!metrics)return;
   const spread=reduced.matches?1:clamp((progress-.08)/.8);
   for(let i=0;i<parts.length;i++){
    const y=(2.5-i)*(metrics.start+(metrics.end-metrics.start)*spread);
    const transform='translateY(calc(-50% + '+y.toFixed(3)+'px))';
    parts[i].style.transform=transform;labels[i].style.transform=transform;
    labels[i].style.opacity=reduced.matches?'1':String(clamp((progress-.22-(5-i)*.055)/.16));
   }
   bar.style.transform='scaleX('+spread+')';root.dataset.progress=progress.toFixed(3);
  }
  function tick(time){
   frame=0;if(destroyed||!ready||!metrics)return;
   const target=reduced.matches?1:clamp((metrics.top-root.getBoundingClientRect().top)/distance);
   const dt=previousTime?Math.min(64,time-previousTime):16;previousTime=time;
   shown+=(target-shown)*(1-Math.exp(-dt/110));
   if(Math.abs(target-shown)<.0005)shown=target;
   paint(shown);if(Math.abs(target-shown)>.0005)frame=requestAnimationFrame(tick);
  }
  function schedule(){if(ready&&!destroyed&&!frame)frame=requestAnimationFrame(tick)}
  function resize(){cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(measure)}
  function init(){
   const image=new Image();
   const loaded=new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src='cakes/assets/cake-layers-sprite.png';if(image.complete&&image.naturalWidth)resolve()});
   loaded.then(()=>{
    if(destroyed)return;ready=true;measure();
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize);reduced.addEventListener('change',resize);
    observer=new ResizeObserver(resize);observer.observe(scene);observer.observe(root);if(toolbar)observer.observe(toolbar);
    document.fonts?.ready.then(()=>{if(!destroyed)resize()});
   },()=>{
    if(destroyed)return;visual.className='story-fallback';visual.removeAttribute('role');visual.removeAttribute('aria-label');visual.textContent='Ванильный бисквит · нежный крем · малиновая прослойка. Изображение слоёв недоступно.';root.classList.add('story-static');
   });
  }
  return {element:root,init,destroy(){destroyed=true;observer?.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize);reduced.removeEventListener('change',resize);cancelAnimationFrame(frame);cancelAnimationFrame(layoutFrame)}};
 };
})();
