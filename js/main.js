(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- mobile nav ---- */
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){ nav.classList.remove('open'); burger.textContent='Menu'; burger.setAttribute('aria-expanded','false'); }
  });

  /* ---- scrollspy: highlight the nav link for the section in view ---- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var linkFor = {};
  navLinks.forEach(function(a){ linkFor[a.getAttribute('href').slice(1)] = a; });
  var spySections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'))
    .filter(function(s){ return linkFor[s.id]; });
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      var link = linkFor[en.target.id];
      if(link) link.classList.toggle('active', en.isIntersecting);
    });
  }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
  spySections.forEach(function(s){ spy.observe(s); });

  /* ---- tech stack: mobile category filter ---- */
  var stackFilter = document.querySelector('.stack-filter');
  if(stackFilter){
    var chips = Array.prototype.slice.call(stackFilter.querySelectorAll('.chip'));
    var tiles = Array.prototype.slice.call(document.querySelectorAll('#skills .tile'));
    stackFilter.addEventListener('click', function(e){
      var btn = e.target.closest('.chip');
      if(!btn) return;
      var cat = btn.dataset.filter;
      chips.forEach(function(c){
        var on = c === btn;
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      tiles.forEach(function(t){
        t.hidden = !(cat === 'all' || t.dataset.cat === cat);
      });
    });
  }

  /* ---- marquee: duplicated so the loop is seamless ---- */
  var track = document.getElementById('track');
  if(track){
    var stack = ['Active Directory','Hyper-V','Exchange Server','SQL Server','PowerShell','RHEL','SELinux',
                 'Nginx','Laravel 12','PHP 8','MySQL','Docker','AWS','Wireshark','Python','Bash'];
    track.innerHTML = stack.concat(stack).map(function(s){ return '<span>'+s+'</span>'; }).join('');
  }

  /* ---- Berlin clock ---- */
  var clock = document.getElementById('clock');
  if(clock){
    (function(){
      function tick(){
        clock.textContent = new Intl.DateTimeFormat('en-GB',{
          timeZone:'Europe/Berlin', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
        }).format(new Date());
      }
      tick(); setInterval(tick, 1000);
    })();
  }

  /* ---- hero console line ---- */
  var out = document.getElementById('termOut');
  if(out){
    var text = 'systems engineer · security · automation — available';
    if(reduce){
      out.innerHTML = '<span class="ok">→</span> ' + text;
    } else {
      var i = 0;
      out.innerHTML = '<span class="cursor"></span>';
      var typer = setInterval(function(){
        i++;
        out.innerHTML = '<span class="ok">→</span> ' + text.slice(0,i) + '<span class="cursor"></span>';
        if(i >= text.length){ clearInterval(typer); }
      }, 34);
    }
  }

  /* ---- scroll reveal ---- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

  /* ---- contact form -> mailto ---- */
  var form = document.getElementById('cform');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.reportValidity()) return;
      var v = function(id){ return document.getElementById(id).value.trim(); };
      var subject = encodeURIComponent(v('f-subject'));
      var body = encodeURIComponent(
        'Name: ' + v('f-name') + '\nEmail: ' + v('f-email') + '\n\n' + v('f-message')
      );
      window.location.href = 'mailto:farhan.anik@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  /* ---- scroll progress ---- */
  var prog = document.getElementById('progress');
  if(prog){
    var ticking = false;
    window.addEventListener('scroll', function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        var h = document.documentElement;
        var p = h.scrollTop / (h.scrollHeight - h.clientHeight);
        prog.style.width = (p * 100) + '%';
        ticking = false;
      });
    }, {passive:true});
  }

  /* ---- hero spotlight follows the cursor ---- */
  var hero = document.getElementById('hero');
  if(hero && !reduce && window.matchMedia('(pointer: fine)').matches){
    hero.addEventListener('mousemove', function(e){
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ---- identity card 3D tilt (desktop pointers only) ---- */
  var pcard = document.querySelector('.pcard');
  if(pcard && !reduce && window.matchMedia('(pointer: fine)').matches){
    var maxTilt = 4;
    pcard.addEventListener('mousemove', function(e){
      var r = pcard.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var rotY = (px - 0.5) * (maxTilt * 2);
      var rotX = (0.5 - py) * (maxTilt * 2);
      pcard.style.transition = 'transform .08s linear';
      pcard.style.transform = 'perspective(900px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
    });
    pcard.addEventListener('mouseleave', function(){
      pcard.style.transition = 'transform .45s cubic-bezier(.2,.7,.2,1)';
      pcard.style.transform = '';
    });
  }

  /* ---- tab title trick ---- */
  var baseTitle = document.title;
  window.addEventListener('blur', function(){ document.title = '⚠ Connection idle — Farhan'; });
  window.addEventListener('focus', function(){ document.title = baseTitle; });

  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- console easter egg ---- */
  console.log(
    '%cFARHAN.%c\n%c→ github.com/farhanrahmananik',
    'font-family:"IBM Plex Mono",monospace;font-size:32px;font-weight:800;letter-spacing:.03em;color:#D9A441;',
    '',
    'font-family:"IBM Plex Mono",monospace;font-size:12px;color:#AEB4BE;'
  );
})();
