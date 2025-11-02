(function(){
  // Countdown to Jan 3 2026 18:00 local time
  const target = new Date('2026-01-03T18:00:00');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  
  function updateCountdown(){
    const now = new Date();
    const diff = target - now;
    if(diff <= 0){ 
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return; 
    }
    const days = Math.floor(diff/86400000);
    const hours = Math.floor((diff%86400000)/3600000);
    const mins = Math.floor((diff%3600000)/60000);
    const secs = Math.floor((diff%60000)/1000);
    
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown,1000);

  // Canvas romantic petals + hearts animation
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let petals = [], hearts = [];

  function init(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    petals = [];
    hearts = [];
    // Create initial petals
    const petalCount = Math.floor((W*H)/8000) + 20;
    for(let i=0;i<petalCount;i++){
      petals.push({
        x:Math.random()*W, 
        y:Math.random()*H-200, 
        vx:(Math.random()-0.5)*0.5, 
        vy:Math.random()*0.3+0.2, 
        r:Math.random()*6+3, 
        rotation:Math.random()*360,
        rotSpeed:(Math.random()-0.5)*2,
        color: ['#ffb6c1','#ffc0cb','#ff69b4','#d4a574','#c97b8a'][Math.floor(Math.random()*5)],
        opacity:Math.random()*0.6+0.3
      });
    }
  }
  init();
  window.addEventListener('resize', ()=>{ init(); });

  // Create new falling petal
  function emitPetal(){
    const x = Math.random()*W;
    const y = -20;
    const vx = (Math.random()-0.5)*0.5;
    const vy = Math.random()*0.3+0.2;
    petals.push({
      x,y,vx,vy,
      r:Math.random()*6+3,
      rotation:Math.random()*360,
      rotSpeed:(Math.random()-0.5)*2,
      color: ['#ffb6c1','#ffc0cb','#ff69b4','#d4a574','#c97b8a'][Math.floor(Math.random()*5)],
      opacity:Math.random()*0.6+0.3
    });
  }

  // Create floating heart
  function emitHeart(){
    const x = Math.random()*W;
    const y = H + 20;
    const vx = (Math.random()-0.5)*0.3;
    const vy = -(Math.random()*0.4+0.3);
    hearts.push({x,y,vx,vy,size:Math.random()*15+10,life:200+Math.random()*100,opacity:0.6});
  }

  setInterval(()=>{ if(Math.random()>0.7) emitPetal(); }, 300);
  setInterval(()=>{ if(Math.random()>0.85) emitHeart(); }, 800);

  function draw(){
    ctx.clearRect(0,0,W,H);

    // Draw falling petals
    for(let i=petals.length-1;i>=0;i--){
      const p = petals[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.vx += (Math.random()-0.5)*0.05; // gentle drift
      
      // Draw petal (ellipse with rotation)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI/180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r*1.5, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
      
      // Remove petals that fall off screen
      if(p.y > H + 50) petals.splice(i,1);
    }

    // Draw floating hearts
    for(let i=hearts.length-1;i>=0;i--){
      const h = hearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.life -= 1;
      h.opacity = Math.min(0.6, h.life/200);
      
      // Draw heart shape
      ctx.save();
      ctx.translate(h.x, h.y);
      const s = h.size;
      ctx.globalAlpha = h.opacity;
      ctx.fillStyle = '#ff6b9d';
      ctx.beginPath();
      ctx.moveTo(0, s*0.3);
      ctx.bezierCurveTo(-s*0.5, -s*0.2, -s*0.8, s*0.2, 0, s*0.8);
      ctx.bezierCurveTo(s*0.8, s*0.2, s*0.5, -s*0.2, 0, s*0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      
      // Remove hearts that float off screen or fade out
      if(h.y < -50 || h.life <= 0) hearts.splice(i,1);
    }

    requestAnimationFrame(draw);
  }
  draw();

  // Aggressive autoplay background music
  const audio = document.getElementById('bgMusic');
  
  function playAudio(){
    if(audio && audio.paused){
      audio.volume = 0.16;
      audio.play().then(()=>{
        console.log('Audio playing automatically');
      }).catch((error)=>{
        console.log('Autoplay blocked, waiting for user interaction:', error);
      });
    }
  }
  
  // Try to play immediately
  playAudio();
  
  // Try again after a short delay
  setTimeout(playAudio, 100);
  setTimeout(playAudio, 500);
  
  // Try on any user interaction
  const events = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];
  const tryPlay = () => {
    playAudio();
    // Remove listeners after first successful play
    events.forEach(event => document.removeEventListener(event, tryPlay));
  };
  events.forEach(event => document.addEventListener(event, tryPlay, { once: true }));

  // Download invite placeholder
  document.getElementById('downloadInvite').addEventListener('click', ()=>{
    const url = 'assets/invite.pdf';
    const a = document.createElement('a'); a.href = url; a.download = 'Lubna_Ahmad_Invitation.pdf'; document.body.appendChild(a); a.click(); a.remove();
  });

  // WhatsApp share
  document.getElementById('shareWhatsApp').addEventListener('click', ()=>{
    const text = encodeURIComponent('You are invited 🎉\nLubna Khalid Weds Ahmad Syedain\n3rd Jan 2026 • 6:00 PM\nHotel Awadh International, Lucknow\nDetails: ' + ('https://tinyurl.com/LubnaWedsAhmad'));
    const wa = 'https://wa.me/?text=' + text;
    window.open(wa,'_blank');
  });

  // Add to calendar (.ics)
  document.getElementById('addCal').addEventListener('click', ()=>{
    const title = 'Wedding Ceremony - Lubna & Ahmad';
    const location = 'Hotel Awadh International, Lucknow';
    const start = new Date('2026-01-03T18:00:00');
    const end = new Date(start.getTime() + 2*60*60*1000);
    const pad = n=>String(n).padStart(2,'0');
    const ymd = d => d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+'00Z';
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
      'SUMMARY:'+title,
      'DTSTART:'+ymd(start),
      'DTEND:'+ymd(end),
      'LOCATION:'+location,
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics],{type:'text/calendar'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'Lubna_Ahmad_Wedding.ics'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });

})(); 
