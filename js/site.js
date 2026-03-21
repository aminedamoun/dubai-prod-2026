
// ═══════════════════════════════════════════
// SHARED FORM SUBMISSION — sends to info@dubaiprod.com via formsubmit.co
// ═══════════════════════════════════════════
(function(){
  var ENDPOINT = 'https://formsubmit.co/ajax/info@dubaiprod.com';

  // Generic form submit handler
  window.dpSubmitForm = function(form, successEl, opts){
    opts = opts || {};
    var btn = form.querySelector('button[type="submit"],button:not([type])');
    var origText = btn ? btn.textContent : '';
    if(btn){ btn.textContent = 'Sending...'; btn.disabled = true; }

    var data = new FormData(form);
    // Add hidden fields for formsubmit.co
    data.append('_subject', 'New Inquiry — Dubai Prod Website');
    data.append('_template', 'table');
    data.append('_captcha', 'false');

    fetch(ENDPOINT, { method:'POST', body:data, headers:{'Accept':'application/json'} })
      .then(function(res){ return res.json(); })
      .then(function(json){
        if(json.success){
          form.style.display = 'none';
          if(successEl) successEl.style.display = 'block';
          setTimeout(function(){
            if(opts.onDone) opts.onDone();
            setTimeout(function(){
              form.style.display = opts.formDisplay || 'flex';
              form.reset();
              if(successEl) successEl.style.display = 'none';
              if(btn){ btn.textContent = origText; btn.disabled = false; }
            }, 600);
          }, 3500);
        } else {
          alert('Something went wrong. Please try again or contact us via WhatsApp.');
          if(btn){ btn.textContent = origText; btn.disabled = false; }
        }
      })
      .catch(function(){
        alert('Network error. Please try again or contact us via WhatsApp.');
        if(btn){ btn.textContent = origText; btn.disabled = false; }
      });
  };
})();

// ── Connect With Us Form (nav) ──
(function () {
  var wrapper = document.getElementById('connect-card-wrapper');
  var panel = document.getElementById('connect-form-panel');
  var arrow = document.getElementById('connect-btn-arrow');
  if (!wrapper || !panel) return;
  var isOpen = false;
  function openForm() {
    if (isOpen) return; isOpen = true;
    panel.style.maxHeight = '600px'; panel.style.opacity = '1';
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  }
  function closeForm() {
    isOpen = false;
    panel.style.maxHeight = '0px'; panel.style.opacity = '0';
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }
  var closeTimer;
  wrapper.addEventListener('mouseenter', function(){ clearTimeout(closeTimer); openForm(); });
  wrapper.addEventListener('mouseleave', function(){ closeTimer = setTimeout(closeForm, 400); });
  document.addEventListener('click', function (e) {
    if (isOpen && !wrapper.contains(e.target)) closeForm();
  });
  window.handleConnectSubmit = function (e) {
    e.preventDefault();
    var form = document.getElementById('connect-contact-form');
    var success = document.getElementById('connect-success');
    dpSubmitForm(form, success, { onDone: closeForm });
  };
})();

// ── Main Contact Form (contact page) ──
(function(){
  window.handleMainContactSubmit = function(e){
    e.preventDefault();
    var form = document.getElementById('main-contact-form');
    var success = document.getElementById('main-contact-success');
    if(form && success) dpSubmitForm(form, success, { formDisplay:'flex' });
  };
})();

// ── Service Page Forms (generic — auto-binds all forms with data-dp-form) ──
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var forms = document.querySelectorAll('form[data-dp-form]');
    forms.forEach(function(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var successEl = form.parentElement.querySelector('[data-dp-success]');
        dpSubmitForm(form, successEl);
      });
    });
  });
})();

// ── Custom Cursor ──
(function(){
  var cur=document.getElementById('cur');
  var ring=document.getElementById('curR');
  if(!cur||!ring) return;
  var mx=0,my=0,rx=0,ry=0,shown=false;
  document.addEventListener('mousemove',function(e){
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
    if(!shown){ shown=true; cur.style.opacity='1'; ring.style.opacity='1'; rx=mx; ry=my; }
  });
  function animateRing(){
    rx+=(mx-rx)*0.15;
    ry+=(my-ry)*0.15;
    ring.style.left=rx+'px';
    ring.style.top=ry+'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.addEventListener('mouseleave',function(){
    cur.style.opacity='0'; ring.style.opacity='0';
  });
  document.addEventListener('mouseenter',function(e){
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
    rx=mx; ry=my;
    cur.style.opacity='1'; ring.style.opacity='1'; shown=true;
  });
  document.addEventListener('mouseover',function(e){
    var el=e.target.closest('.pf-item,[style*="cursor:none"]');
    if(el){
      cur.style.width='14px'; cur.style.height='14px';
      ring.style.width='52px'; ring.style.height='52px';
      ring.style.borderColor='rgba(255,106,0,0.7)';
    }
  });
  document.addEventListener('mouseout',function(e){
    var el=e.target.closest('.pf-item,[style*="cursor:none"]');
    if(el){
      cur.style.width='8px'; cur.style.height='8px';
      ring.style.width='32px'; ring.style.height='32px';
      ring.style.borderColor='rgba(255,106,0,0.45)';
    }
  });
})();

// ═══════════════════════════════════════════
// WHATSAPP CHAT WIDGET — Black/White design
// ═══════════════════════════════════════════
(function(){
  var PHONE = '971543333587';
  var MSG = encodeURIComponent('Hi Dubai Prod! I\'d like to learn more about your services.');

  // CSS
  var css = document.createElement('style');
  css.textContent = '\
#wa-widget{position:fixed;bottom:28px;right:28px;z-index:9990;font-family:Inter,sans-serif;}\
#wa-btn{width:56px;height:56px;border-radius:50%;background:#fff;border:1.5px solid rgba(0,0,0,0.12);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.15);transition:transform 0.3s,box-shadow 0.3s;}\
#wa-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(0,0,0,0.22);}\
#wa-btn svg{width:28px;height:28px;}\
#wa-bubble{position:absolute;bottom:68px;right:0;width:300px;background:#fff;border:1px solid rgba(0,0,0,0.1);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.18);overflow:hidden;opacity:0;transform:translateY(10px) scale(0.95);pointer-events:none;transition:opacity 0.3s,transform 0.3s;}\
#wa-bubble.wa-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}\
.wa-header{background:#000;padding:20px;display:flex;align-items:center;gap:12px;}\
.wa-avatar{width:40px;height:40px;border-radius:50%;background:#222;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid rgba(255,255,255,0.15);}\
.wa-avatar svg{width:20px;height:20px;}\
.wa-header-text h4{font-size:14px;font-weight:700;color:#fff;margin:0;}\
.wa-header-text p{font-size:11px;color:rgba(255,255,255,0.5);margin:2px 0 0;}\
.wa-body{padding:20px;background:#f5f5f5;}\
.wa-msg{background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:0 12px 12px 12px;padding:14px 16px;font-size:13px;color:#222;line-height:1.6;position:relative;box-shadow:0 1px 3px rgba(0,0,0,0.05);}\
.wa-msg::before{content:"";position:absolute;top:0;left:-6px;width:0;height:0;border-top:6px solid #fff;border-left:6px solid transparent;}\
.wa-time{font-size:10px;color:#999;text-align:right;margin-top:6px;}\
.wa-input{display:flex;gap:8px;padding:14px;background:#fff;border-top:1px solid rgba(0,0,0,0.06);}\
.wa-input input{flex:1;border:1px solid rgba(0,0,0,0.1);border-radius:20px;padding:10px 16px;font-size:13px;font-family:Inter,sans-serif;outline:none;color:#222;}\
.wa-input input:focus{border-color:#000;}\
.wa-input button{width:38px;height:38px;border-radius:50%;background:#000;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.2s;flex-shrink:0;}\
.wa-input button:hover{background:#333;}\
.wa-close{position:absolute;top:12px;right:12px;background:none;border:none;color:rgba(255,255,255,0.5);cursor:pointer;padding:4px;transition:color 0.2s;}\
.wa-close:hover{color:#fff;}\
#wa-badge{position:absolute;top:-2px;right:-2px;width:14px;height:14px;background:#FF6A00;border-radius:50%;border:2px solid #fff;}\
@media(max-width:480px){#wa-bubble{width:calc(100vw - 32px);right:-12px;}#wa-widget{bottom:16px;right:16px;}}\
';
  document.head.appendChild(css);

  // HTML
  var widget = document.createElement('div');
  widget.id = 'wa-widget';
  widget.innerHTML = '\
<div id="wa-bubble">\
  <div class="wa-header" style="position:relative;">\
    <div class="wa-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>\
    <div class="wa-header-text"><h4>Dubai Prod</h4><p>Usually replies within minutes</p></div>\
    <button class="wa-close" id="wa-close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>\
  </div>\
  <div class="wa-body">\
    <div class="wa-msg">Hi there! 👋 How can we help you today? Tell us about your project and we\'ll get back to you right away.</div>\
    <div class="wa-time">' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2,'0') + '</div>\
  </div>\
  <div class="wa-input">\
    <input type="text" id="wa-msg-input" placeholder="Type a message...">\
    <button id="wa-send"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>\
  </div>\
</div>\
<button id="wa-btn" aria-label="Chat on WhatsApp">\
  <div id="wa-badge"></div>\
  <svg viewBox="0 0 24 24" fill="#000"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>\
</button>';
  document.body.appendChild(widget);

  // Interactions
  var bubble = document.getElementById('wa-bubble');
  var waBtn = document.getElementById('wa-btn');
  var waClose = document.getElementById('wa-close');
  var waSend = document.getElementById('wa-send');
  var waInput = document.getElementById('wa-msg-input');
  var badge = document.getElementById('wa-badge');
  var isWaOpen = false;

  function toggleBubble(){
    isWaOpen = !isWaOpen;
    bubble.classList.toggle('wa-open', isWaOpen);
    if(isWaOpen && badge) badge.style.display = 'none';
  }

  waBtn.addEventListener('click', toggleBubble);
  waClose.addEventListener('click', function(e){ e.stopPropagation(); isWaOpen = false; bubble.classList.remove('wa-open'); });

  function sendToWhatsApp(){
    var text = waInput.value.trim();
    var message = text || 'Hi Dubai Prod! I\'d like to learn more about your services.';
    window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message), '_blank');
    waInput.value = '';
  }

  waSend.addEventListener('click', sendToWhatsApp);
  waInput.addEventListener('keydown', function(e){ if(e.key === 'Enter') sendToWhatsApp(); });

  // Auto-show badge after 3 seconds
  setTimeout(function(){ if(badge) badge.style.display = 'block'; }, 3000);
})();
