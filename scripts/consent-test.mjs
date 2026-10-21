import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('public/consent.js','utf8'),code=fs.readFileSync('dist/consent.js','utf8');
assert.equal(code,source,'built initializer matches source');
const html=fs.readFileSync('dist/cookies/index.html','utf8');
assert.match(html,/<html[^>]*lang="ko"/);
const initializer=html.match(/<script[^>]*src="\/consent.js"[^>]*>/)?.[0];
assert.ok(initializer);assert.match(initializer,/\bdefer\b/);
assert.ok(html.indexOf('/consent.js')<html.indexOf('id="analytics"'),'deferred initializer follows parsed controls');
for(const id of ['analytics','save','reject','status'])assert.match(html,new RegExp(`id="${id}"`));
assert.equal(/googletagmanager\.com\/gtag\/js/.test(html),false,'no independent analytics initializer');
const KEY='yeosu-cookie-consent',DENY='yeosu-analytics-denied',GA='ga-disable-G-HXM22WWPKP';
function store(map=new Map()) {return {map,fail:{},writes:[],getItem(k){if(this.fail.read)throw Error('read');return map.get(k)??null;},setItem(k,v){if(this.fail.write)throw Error('write');this.writes.push([k,v]);map.set(k,v);},removeItem(k){if(this.fail.clear)throw Error('clear');map.delete(k);}};}
function page({local=store(),session=store(),name='',nameFail={}}={}){
 const scripts=[],events={},handlers={},status={textContent:''},checkbox={checked:false,addEventListener:(_t,f)=>handlers.change=f};
 const context={localStorage:local,sessionStorage:session,document:{getElementById:id=>id==='status'?status:id==='analytics'?checkbox:['save','reject'].includes(id)?{addEventListener:(_t,f)=>handlers[id]=f}:scripts.find(s=>s.id===id),createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}},addEventListener(t,f){events[t]=f;}};
 Object.defineProperty(context,'name',{get(){if(nameFail.read)throw Error('readname');return name;},set(v){if(nameFail.write)throw Error('writename');name=v;}});
 context.window=context;vm.createContext(context);vm.runInContext(code,context);
 return {context,scripts,status,checkbox,local,session,nameFail,save(value){checkbox.checked=value;handlers.change();assert.equal(status.textContent,'');handlers.save();},repeat(){handlers.save();},deny(){handlers.reject();},reload(){return page({local,session,name,nameFail});},event(value,key=KEY){events.storage({key,newValue:value});},allowed:()=>context[GA]===false,runtime:()=>Array.from(context.dataLayer||[]).filter(x=>x[0]==='consent').at(-1)?.[2].analytics_storage};
}
let p=page();assert.equal(p.allowed(),false);assert.equal(p.checkbox.checked,false);assert.equal(p.scripts.length,0);
for(const value of [true,false,true,false,false]){p.save(value);assert.equal(p.allowed(),value);assert.equal(p.checkbox.checked,value);assert.equal(p.runtime(),value?'granted':'denied');assert.match(p.status.textContent,value?/허용 설정을 저장/:/거부 설정을 저장/);p.repeat();assert.equal(p.allowed(),value);assert.match(p.status.textContent,value?/허용 설정을 저장/:/거부 설정을 저장/);}
assert.equal(p.scripts.length,1,'regrant updates old library without duplicate');
for(const which of ['local','session'])for(const prior of [true,false]){
 const local=store(new Map([[KEY,JSON.stringify({analytics:prior})]])),session=store();(which==='local'?local:session).fail.read=true;p=page({local,session});assert.equal(p.scripts.length,0);p.save(true);assert.equal(p.allowed(),false);assert.equal(p.checkbox.checked,false);assert.equal(p.scripts.length,0);assert.equal(local.map.get(KEY),JSON.stringify({analytics:prior}),'read failure/write success must not publish grant');assert.match(p.status.textContent,/꺼져/);const healthy=page({local:store(local.map)});assert.equal(healthy.allowed(),prior,'healthy separate tab sees unchanged stored choice');assert.notEqual(healthy.session,session);
}
p=page();p.save(true);p.local.fail.write=true;p.deny();assert.equal(p.runtime(),'denied');assert.equal(p.checkbox.checked,false);assert.equal(JSON.parse(p.local.getItem(KEY)).analytics,true);assert.equal(p.session.getItem(DENY),'1');assert.match(p.status.textContent,/이 탭/);assert.equal(p.reload().allowed(),false);assert.equal(p.reload().scripts.length,0);
p=page();p.save(true);p.local.fail.write=true;p.session.fail.write=true;p.deny();assert.match(p.context.name,/yeosu-analytics-denied/);p.local.fail.write=false;assert.equal(p.reload().allowed(),false);
p=page();p.save(true);p.local.fail.write=true;p.session.fail.write=true;p.nameFail.write=true;p.deny();assert.equal(p.runtime(),'denied');assert.match(p.status.textContent,/이 페이지/);
for(const fail of ['sessionClear','localClear','nameWrite']){
 const shared=store(new Map([[KEY,'{"analytics":false}']])),a=page({local:shared}),b=page({local:shared});a.deny();if(fail==='sessionClear')a.session.fail.clear=true;if(fail==='localClear')shared.fail.clear=true;if(fail==='nameWrite')a.nameFail.write=true;const writes=shared.writes.length;a.save(true);assert.equal(a.allowed(),false);assert.equal(a.checkbox.checked,false);assert.equal(shared.map.get(KEY),'{"analytics":false}');assert.equal(shared.writes.slice(writes).some(([k,v])=>k===KEY&&JSON.parse(v).analytics),false);b.event(shared.map.get(KEY));assert.equal(b.allowed(),false);assert.notEqual(a.session,b.session,'separate session stores');
}
const shared=store(),a=page({local:shared}),b=page({local:shared});a.save(true);b.event(shared.getItem(KEY));assert.equal(b.allowed(),true);a.deny();b.event(shared.getItem(KEY));assert.equal(b.runtime(),'denied');assert.equal(b.checkbox.checked,false);assert.match(b.status.textContent,/꺼져/);a.save(true);b.event(shared.getItem(KEY));assert.equal(b.allowed(),false,'foreign grant cannot clear local veto');b.save(true);assert.equal(b.runtime(),'granted');b.repeat();assert.match(b.status.textContent,/허용 설정을 저장/);assert.equal(b.scripts.length,1);shared.map.delete(KEY);b.event(null,null);assert.equal(b.runtime(),'denied');assert.equal(b.checkbox.checked,false);
for(const raw of ['broken','null','{"analytics":"true"}']){p=page({local:store(new Map([[KEY,raw]]))});assert.equal(p.scripts.length,0);}
p=page();p.save(true);p.session.fail.read=true;p.event('{"analytics":true}');assert.equal(p.runtime(),'denied');assert.equal(p.checkbox.checked,false);
console.log('PASS built Korean deferred initializer and actual registered button handlers: default off, repeated allow/off saves, loaded-library regrant, read-fail/write-ok no shared grant, failed withdrawal/reload veto, window-name fallback, page-only failure scope, failed veto clearing before shared write, separate-session cross-tab denial/regrant/clear. VM DOM fixture; no browser or network analytics claim.');
