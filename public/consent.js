(() => {
  const KEY='yeosu-cookie-consent', DENY='yeosu-analytics-denied', MARK='|yeosu-analytics-denied|', ID='G-HXM22WWPKP';
  function denied(){
    if(window.__yeosuDenied)return true;
    try{if(sessionStorage.getItem(DENY)==='1')return true;}catch{return true;}
    try{return window.name.includes(MARK);}catch{return true;}
  }
  function markDeny(){
    window.__yeosuDenied=true;window['ga-disable-'+ID]=true;
    let retained=false;
    try{sessionStorage.setItem(DENY,'1');retained=sessionStorage.getItem(DENY)==='1';}catch{}
    try{window.name=window.name.split(MARK).join('')+MARK;retained=window.name.includes(MARK)||retained;}catch{}
    return retained;
  }
  function clearDeny(){
    // Verify tab-local veto removal before publishing a shared grant.
    sessionStorage.removeItem(DENY);
    if(sessionStorage.getItem(DENY)==='1')throw Error('Session refusal remains');
    window.name=window.name.split(MARK).join('');
    if(window.name.includes(MARK))throw Error('Tab refusal remains');
  }
  function read(){
    if(denied())return null;
    try{
      const saved=JSON.parse(localStorage.getItem(KEY)||'null');
      // A stale stored grant must not revive while writes are blocked.
      localStorage.setItem(KEY+'-write-check','1');localStorage.removeItem(KEY+'-write-check');
      return saved && typeof saved.analytics==='boolean'?saved:null;
    }catch{return null;}
  }
  let active=false;
  function apply(grant){
    active=grant===true;
    window['ga-disable-'+ID]=!grant;
    if(!grant){window.gtag?.('consent','update',{analytics_storage:'denied'});return;}
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
    if(document.getElementById('yeosu-ga4')){window.gtag('consent','update',{analytics_storage:'granted'});return;}
    window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('consent','update',{analytics_storage:'granted'});
    const script=document.createElement('script');script.id='yeosu-ga4';script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.appendChild(script);
    window.gtag('js',new Date());window.gtag('config',ID,{allow_google_signals:false,allow_ad_personalization_signals:false});
  }
  let retainedDenial=false;
  function save(analytics){
    analytics=analytics===true;
    if(!analytics){retainedDenial=markDeny();apply(false);}
    try{
      if(analytics){clearDeny();localStorage.getItem(KEY);localStorage.setItem(KEY+'-write-check','1');localStorage.removeItem(KEY+'-write-check');}
      localStorage.setItem(KEY,JSON.stringify({analytics}));
      if(analytics)window.__yeosuDenied=false;
      apply(read()?.analytics===true);return true;
    }catch{retainedDenial=markDeny();apply(false);return false;}
  }
  window.yeosuConsent={read,save};
  const saved=read();apply(saved?.analytics===true);
  const checkbox=document.getElementById('analytics'),status=document.getElementById('status');
  if(checkbox)checkbox.checked=active;
  function choose(value){
    const stored=save(value);
    if(checkbox)checkbox.checked=active;
    if(status)status.textContent=stored
      ?active?'Google Analytics 허용 설정을 저장했습니다.':value?'선택을 저장했지만 브라우저 저장소를 확인할 수 없어 이 탭에서 Google Analytics는 꺼져 있습니다.':'Google Analytics 거부 설정을 저장했습니다.'
      :retainedDenial?'Google Analytics는 이 탭에서 꺼져 있으며 페이지 이동이나 새로고침 시에도 거부를 유지합니다. 영구 설정을 저장하지 못해 다른 탭에 이전 허용 설정이 남아 있을 수 있습니다. 저장된 허용을 지우려면 브라우저 설정에서 사이트 데이터를 삭제하세요.'
        :'Google Analytics는 이 페이지에서 꺼져 있습니다. 선택을 저장하지 못했습니다. 페이지를 이동하거나 새로고침하기 전에 브라우저 설정에서 사이트 데이터를 삭제하세요.';
  }
  checkbox?.addEventListener('change',()=>{if(status)status.textContent='';});
  document.getElementById('save')?.addEventListener('click',()=>choose(checkbox?.checked===true));
  document.getElementById('reject')?.addEventListener('click',()=>choose(false));
  window.addEventListener('storage',event=>{
    if(event.key!==KEY&&event.key!==null)return;
    let grant=false;try{grant=JSON.parse(event.newValue||'null')?.analytics===true;}catch{}
    if(!grant)markDeny();
    apply(read()?.analytics===true);
    if(checkbox)checkbox.checked=active;
    if(status)status.textContent=active?'이 탭에서 Google Analytics가 켜져 있습니다.':'이 탭에서 Google Analytics가 꺼져 있습니다.';
  });
})();
