(() => {
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];

  // Loader
  window.addEventListener('load', () => {
    setTimeout(() => document.body.classList.add('loaded'), 250);
    setTimeout(() => $('.loader').classList.add('hide'), 1450);
  });

  // Lenis smooth scroll
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({duration:1.15, smoothWheel:true, syncTouch:false});
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Progress
  const progress = $('.progress span');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${Math.min(100, Math.max(0, scrollY / max * 100))}%`;
  }, {passive:true});

  // Navigation
  const nav = $('.story-nav');
  $('.menu-toggle').onclick = () => nav.classList.add('open');
  $('.nav-close').onclick = () => nav.classList.remove('open');
  $$('.story-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  $$('.scroll-cue').forEach(b => b.addEventListener('click', () => {
    document.querySelector(b.dataset.target)?.scrollIntoView({behavior:'smooth'});
  }));
  $('#replay').onclick = () => window.scrollTo({top:0,behavior:'smooth'});

  // Cursor
  if (matchMedia('(pointer:fine)').matches) {
    const dot=$('.cursor-dot'), ring=$('.cursor-ring');
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    window.addEventListener('mousemove', e => {mx=e.clientX;my=e.clientY});
    gsap.ticker.add(() => {
      rx += (mx-rx)*.16; ry += (my-ry)*.16;
      dot.style.left=mx+'px'; dot.style.top=my+'px';
      ring.style.left=rx+'px'; ring.style.top=ry+'px';
    });
    $$('.magnetic,.gallery-photo,.dream-card').forEach(el => {
      el.addEventListener('mouseenter',()=>{ring.style.width='58px';ring.style.height='58px';ring.style.borderColor='rgba(169,157,255,.8)'});
      el.addEventListener('mouseleave',()=>{ring.style.width='34px';ring.style.height='34px';ring.style.borderColor='rgba(255,255,255,.45)'});
    });
  }

  // Hero depth
  const heroPhoto = $('.hero-photo-wrap');
  if (heroPhoto && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
      gsap.to(heroPhoto,{rotationY:x*7,rotationX:-y*6,x:x*18,y:y*12,duration:.8,ease:'power3.out'});
    });
  }

  // Section entrances
  $$('.reveal').forEach(el => gsap.fromTo(el,{y:35,opacity:0},{y:0,opacity:1,duration:1.2,delay:.4,ease:'power3.out'}));

  $$('.float-photo').forEach((el,i) => {
    gsap.fromTo(el,{y:100,opacity:0,rotate: i%2?12:-14},{y:0,opacity:1,rotate:i%2?7:-9,duration:1.5,ease:'power3.out',scrollTrigger:{trigger:'#memories',start:'top 70%',end:'bottom 30%',scrub:1}});
    gsap.to(el,{y:i%2? -80:70,scrollTrigger:{trigger:'#memories',start:'top bottom',end:'bottom top',scrub:1.4}});
  });

  // Timeline horizontal illusion
  gsap.to('.timeline-track',{x:()=>-(document.querySelector('.timeline-track').scrollWidth-innerWidth*.82),ease:'none',scrollTrigger:{trigger:'.timeline-section',start:'top top',end:'+=1300',pin:true,scrub:1.2,anticipatePin:1}});

  // Dream cards
  $$('.dream-card').forEach((c,i)=>gsap.fromTo(c,{y:100,opacity:0,rotateY:i===1?0:-25},{y:i===1?-35:0,opacity:1,rotateY:i===1?0:i%2?-10:10,duration:1,scrollTrigger:{trigger:'.dreams-section',start:'top 65%',end:'center center',scrub:1}}));

  // Exam transformation
  gsap.timeline({scrollTrigger:{trigger:'.exam-section',start:'top 70%',end:'bottom 35%',scrub:1}})
    .fromTo('.exam-paper',{scale:.8,rotation:25,opacity:.1},{scale:1.15,rotation:-8,opacity:.18})
    .to('.exam-paper',{scale:.1,opacity:0,filter:'blur(20px)',duration:.7})
    .fromTo('.exam-reveal',{y:30,opacity:0},{y:0,opacity:1},'<');

  // Volleyball
  gsap.to('.volley-photo',{y:-130,rotation:7,scrollTrigger:{trigger:'.volley-section',start:'top bottom',end:'bottom top',scrub:1.2}});
  gsap.to('.volley-ball',{x:-180,rotation:720,scrollTrigger:{trigger:'.volley-section',start:'top bottom',end:'bottom top',scrub:1}});

  // Mountains parallax
  ['.m-back','.m-mid','.m-front'].forEach((s,i)=>gsap.to(s,{x:i%2?30:-30,y:-i*25,scrollTrigger:{trigger:'.mountain-section',start:'top bottom',end:'bottom top',scrub:1}}));
  gsap.to('.mountain-photo',{y:-90,scrollTrigger:{trigger:'.mountain-section',start:'top bottom',end:'bottom top',scrub:1.2}});
  gsap.to('.sun',{y:160,x:-80,scale:1.25,scrollTrigger:{trigger:'.mountain-section',start:'top bottom',end:'bottom top',scrub:1}});

  // Gallery floating
  $$('.gallery-photo').forEach((el,i)=>{
    gsap.to(el,{y:(i%2?-45:55),rotation:(i%2?4:-4),scrollTrigger:{trigger:'.gallery-section',start:'top bottom',end:'bottom top',scrub:1.4}});
  });

  // Video reveal
  gsap.fromTo('.video-frame',{y:120,rotateX:20,scale:.8,opacity:0},{y:0,rotateX:5,scale:1,opacity:1,scrollTrigger:{trigger:'.video-section',start:'top 75%',end:'center center',scrub:1}});
  const video=$('#memoryVideo');
  ScrollTrigger.create({trigger:'.video-section',start:'top 65%',end:'bottom 40%',onEnter:()=>video.play().catch(()=>{}),onLeave:()=>video.pause(),onEnterBack:()=>video.play().catch(()=>{}),onLeaveBack:()=>video.pause()});

  // Becoming
  gsap.to('.becoming-photo',{y:-80,rotate:-2,scrollTrigger:{trigger:'.becoming-section',start:'top bottom',end:'bottom top',scrub:1.2}});
  $$('.orbit-words span').forEach((el,i)=>gsap.to(el,{y:i%2?-60:60,x:i%3?35:-35,scrollTrigger:{trigger:'.becoming-section',start:'top bottom',end:'bottom top',scrub:1.5}}));

  // Final cinematic reveal
  gsap.fromTo('.final-line',{y:80,opacity:0},{y:0,opacity:1,stagger:.25,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'.final-section',start:'top 65%'}});

  // Gallery lightbox
  const lightbox=$('.lightbox'), lbImg=$('.lightbox img');
  $$('.gallery-photo').forEach(b=>b.addEventListener('click',()=>{
    lbImg.src=b.dataset.full; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
  }));
  const closeLB=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');};
  $('.lightbox-close').onclick=closeLB;
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLB()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLB()});

  // Tilt cards
  if(matchMedia('(pointer:fine)').matches){
    $$('.tilt').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        gsap.to(card,{rotationY:x*14,rotationX:-y*10,duration:.35});
      });
      card.addEventListener('mouseleave',()=>gsap.to(card,{rotationY:card.classList.contains('featured')?0:-10,rotationX:0,duration:.5}));
    });
  }

  // Three.js particle atmosphere
  const canvas=$('#particles');
  if(window.THREE && !matchMedia('(prefers-reduced-motion:reduce)').matches){
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); renderer.setSize(innerWidth,innerHeight);
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,100);
    camera.position.z=18;
    const count=window.innerWidth<700?500:900;
    const geo=new THREE.BufferGeometry(), pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*28;pos[i*3+1]=(Math.random()-.5)*18;pos[i*3+2]=(Math.random()-.5)*18}
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({color:0xc4bcff,size:.035,transparent:true,opacity:.7});
    const points=new THREE.Points(geo,mat);scene.add(points);
    let t=0;
    function animate(){t+=.001;points.rotation.y=t;points.rotation.x=Math.sin(t*.7)*.06;renderer.render(scene,camera)}
    gsap.ticker.add(animate);
    window.addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});
  }

  // Optional personal soundtrack: drop assets/riya-song.mp3 into this folder.
  const audio=$('#storyAudio'), playBtn=$('#playStory');
  fetch('assets/riya-song.mp3',{method:'HEAD'}).then(r=>{
    if(!r.ok) throw 0;
    audio.src='assets/riya-song.mp3';
    $('.music-status').textContent='Personal soundtrack ready.';
    playBtn.onclick=()=>audio.paused?audio.play():audio.pause();
    audio.addEventListener('play',()=>playBtn.querySelector('span').textContent='Pause Story');
    audio.addEventListener('pause',()=>playBtn.querySelector('span').textContent='Play Story');
  }).catch(()=>{playBtn.onclick=()=>alert('Add your MP3 as assets/riya-song.mp3 to enable the personal soundtrack.');});
})();