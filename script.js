const preloader=document.getElementById('preloader');
window.addEventListener('load',()=>setTimeout(()=>preloader.classList.add('done'),450));
document.getElementById('year').textContent=new Date().getFullYear();

const roles=['Frontend Developer','Web Developer','Aspiring Full Stack Developer','Creative Problem Solver'];
const roleEl=document.getElementById('typedRole');
let roleIndex=0,charIndex=0,deleting=false;
function typeRole(){
  const word=roles[roleIndex];
  roleEl.textContent=word.substring(0,charIndex);
  if(!deleting && charIndex<word.length){charIndex++;setTimeout(typeRole,85);}
  else if(!deleting){deleting=true;setTimeout(typeRole,1250);}
  else if(charIndex>0){charIndex--;setTimeout(typeRole,38);}
  else{deleting=false;roleIndex=(roleIndex+1)%roles.length;setTimeout(typeRole,250);}
}
setTimeout(typeRole,900);

const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const menuToggle=document.getElementById('menuToggle');
const nav=document.getElementById('nav');
menuToggle.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>nav.classList.remove('open')));

const glow=document.getElementById('cursorGlow');
if(window.matchMedia('(pointer:fine)').matches){
  window.addEventListener('pointermove',e=>{
    glow.style.left=e.clientX+'px';
    glow.style.top=e.clientY+'px';
  },{passive:true});
}

// Subtle pointer tilt for project cards on desktop
if(window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${-y*3}deg) rotateY(${x*3}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}

// Smooth anchor scrolling with reduced-motion support
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener('click',e=>{
    const target=document.querySelector(anchor.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }
  });
});
