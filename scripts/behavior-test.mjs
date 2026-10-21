import assert from 'node:assert/strict';
import worker from '../worker.mjs';
import './consent-test.mjs';
const calls=[];
const env={ASSETS:{fetch:async request=>{calls.push(request);return new Response('missing noindex',{status:404});}}};
for(const origin of ['http://yeosupochast.com','https://www.yeosupochast.com'])for(const method of ['GET','HEAD']){
 const r=await worker.fetch(new Request(origin+'/404/?q=a%2Fb&q=2',{method}),env);assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://yeosupochast.com/404/?q=a%2Fb&q=2');
}
assert.equal(calls.length,0,'canonical redirect before Assets');
let r=await worker.fetch(new Request('https://yeosupochast.com/cookies?q=1'),env);assert.equal(r.headers.get('location'),'https://yeosupochast.com/cookies/?q=1');
for(const uri of ['/404','/404/','/404.html','/missing-test'])for(const method of ['GET','HEAD']){
 const r=await worker.fetch(new Request('https://yeosupochast.com'+uri+'?q=a%2Fb&q=2',{method}),env);assert.equal(r.status,404);assert.equal(r.headers.get('X-Robots-Tag'),'noindex');assert.equal(r.headers.get('location'),null);assert.equal(await r.text(),method==='HEAD'?'':'missing noindex');assert.equal(new URL(calls.at(-1).url).search,'?q=a%2Fb&q=2');if(uri!=='/missing-test')assert.equal(new URL(calls.at(-1).url).pathname,'/__missing_error_page__');
}
console.log('PASS Worker unit cases: canonical priority, query preservation, explicit errors and unknown GET/HEAD noindex404. Host branch regression is not evidence of public alias applicability.');
