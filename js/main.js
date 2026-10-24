const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
const lb=document.getElementById('lb'),li=lb.querySelector('img');
document.querySelectorAll('.gal img').forEach(i=>i.onclick=()=>{li.src=i.src;lb.classList.add('on')});
lb.onclick=()=>lb.classList.remove('on');
