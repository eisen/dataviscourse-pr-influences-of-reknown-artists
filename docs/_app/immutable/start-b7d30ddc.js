import{S as We,i as Ye,s as Xe,a as Ze,e as F,c as Qe,b as W,g as pe,t as J,d as de,f as G,h as K,j as xe,o as ke,k as et,l as tt,m as nt,n as ve,p as q,q as rt,r as at,u as ot,v as X,w as Ie,x as Z,y as Q,z as Ce}from"./chunks/index-8d2061e5.js";import{g as Be,f as Fe,s as H,a as Re,i as st}from"./chunks/singletons-b46e3941.js";import{s as it}from"./chunks/paths-6cd3a76e.js";function lt(r,e){return r==="/"||e==="ignore"?r:e==="never"?r.endsWith("/")?r.slice(0,-1):r:e==="always"&&!r.endsWith("/")?r+"/":r}function ct(r){for(const e in r)r[e]=r[e].replace(/%23/g,"#").replace(/%3[Bb]/g,";").replace(/%2[Cc]/g,",").replace(/%2[Ff]/g,"/").replace(/%3[Ff]/g,"?").replace(/%3[Aa]/g,":").replace(/%40/g,"@").replace(/%26/g,"&").replace(/%3[Dd]/g,"=").replace(/%2[Bb]/g,"+").replace(/%24/g,"$");return r}const ft=["href","pathname","search","searchParams","toString","toJSON"];function ut(r,e){const t=new URL(r);for(const o of ft){let s=t[o];Object.defineProperty(t,o,{get(){return e(),s},enumerable:!0,configurable:!0})}return pt(t),t}function pt(r){Object.defineProperty(r,"hash",{get(){throw new Error("Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead")}})}const dt="/__data.json";function ht(r){return r.replace(/\/$/,"")+dt}function mt(r){let e=5381;if(typeof r=="string"){let t=r.length;for(;t;)e=e*33^r.charCodeAt(--t)}else if(ArrayBuffer.isView(r)){const t=new Uint8Array(r.buffer,r.byteOffset,r.byteLength);let o=t.length;for(;o;)e=e*33^t[--o]}else throw new TypeError("value must be a string or TypedArray");return(e>>>0).toString(36)}const he=window.fetch;window.fetch=(r,e)=>{if((r instanceof Request?r.method:(e==null?void 0:e.method)||"GET")!=="GET"){const o=new URL(r instanceof Request?r.url:r.toString(),document.baseURI).href;ue.delete(o)}return he(r,e)};const ue=new Map;function _t(r,e,t){let s=`script[data-sveltekit-fetched][data-url=${JSON.stringify(r instanceof Request?r.url:r)}]`;(t==null?void 0:t.body)&&(typeof t.body=="string"||ArrayBuffer.isView(t.body))&&(s+=`[data-hash="${mt(t.body)}"]`);const c=document.querySelector(s);if(c!=null&&c.textContent){const{body:n,...f}=JSON.parse(c.textContent),m=c.getAttribute("data-ttl");return m&&ue.set(e,{body:n,init:f,ttl:1e3*Number(m)}),Promise.resolve(new Response(n,f))}return he(r,t)}function gt(r,e){const t=ue.get(r);if(t){if(performance.now()<t.ttl)return new Response(t.body,t.init);ue.delete(r)}return he(r,e)}const wt=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function yt(r){const e=[],t=[],o=[];let s=!0;return{pattern:r==="/"?/^\/$/:new RegExp(`^${vt(r).map((n,f,m)=>{const d=decodeURIComponent(n),g=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(d);if(g)return e.push(g[1]),t.push(g[2]),o.push(!1),"(?:/(.*))?";const y=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(d);if(y)return e.push(y[1]),t.push(y[2]),o.push(!0),"(?:/([^/]+))?";const O=f===m.length-1;if(!d)return;const z=d.split(/\[(.+?)\](?!\])/).map((U,D)=>{if(D%2){const C=wt.exec(U);if(!C)throw new Error(`Invalid param: ${U}. Params and matcher names can only have underscores and alphanumeric characters.`);const[,M,ae,x,oe]=C;return e.push(x),t.push(oe),o.push(!!M),ae?"(.*?)":M?"([^/]*)?":"([^/]+?)"}return O&&U.includes(".")&&(s=!1),U.normalize().replace(/%5[Bb]/g,"[").replace(/%5[Dd]/g,"]").replace(/#/g,"%23").replace(/\?/g,"%3F").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}).join("");return"/"+z}).join("")}${s?"/?":""}$`),names:e,types:t,optional:o}}function bt(r){return!/^\([^)]+\)$/.test(r)}function vt(r){return r.slice(1).split("/").filter(bt)}function Et(r,{names:e,types:t,optional:o},s){const c={};for(let n=0;n<e.length;n+=1){const f=e[n],m=t[n];let d=r[n+1];if(d||!o[n]){if(m){const g=s[m];if(!g)throw new Error(`Missing "${m}" param matcher`);if(!g(d))return}c[f]=d!=null?d:""}}return c}function kt(r,e,t,o){const s=new Set(e);return Object.entries(t).map(([f,[m,d,g]])=>{const{pattern:y,names:O,types:T,optional:z}=yt(f),U={id:f,exec:D=>{const C=y.exec(D);if(C)return Et(C,{names:O,types:T,optional:z},o)},errors:[1,...g||[]].map(D=>r[D]),layouts:[0,...d||[]].map(n),leaf:c(m)};return U.errors.length=U.layouts.length=Math.max(U.errors.length,U.layouts.length),U});function c(f){const m=f<0;return m&&(f=~f),[m,r[f]]}function n(f){return f===void 0?f:[s.has(f),r[f]]}}function Rt(r){let e,t,o;var s=r[0][0];function c(n){return{props:{data:n[2],form:n[1]}}}return s&&(e=new s(c(r))),{c(){e&&X(e.$$.fragment),t=F()},l(n){e&&Ie(e.$$.fragment,n),t=F()},m(n,f){e&&Z(e,n,f),W(n,t,f),o=!0},p(n,f){const m={};if(f&4&&(m.data=n[2]),f&2&&(m.form=n[1]),s!==(s=n[0][0])){if(e){pe();const d=e;J(d.$$.fragment,1,0,()=>{Q(d,1)}),de()}s?(e=new s(c(n)),X(e.$$.fragment),G(e.$$.fragment,1),Z(e,t.parentNode,t)):e=null}else s&&e.$set(m)},i(n){o||(e&&G(e.$$.fragment,n),o=!0)},o(n){e&&J(e.$$.fragment,n),o=!1},d(n){n&&K(t),e&&Q(e,n)}}}function Ot(r){let e,t,o;var s=r[0][0];function c(n){return{props:{data:n[2],$$slots:{default:[St]},$$scope:{ctx:n}}}}return s&&(e=new s(c(r))),{c(){e&&X(e.$$.fragment),t=F()},l(n){e&&Ie(e.$$.fragment,n),t=F()},m(n,f){e&&Z(e,n,f),W(n,t,f),o=!0},p(n,f){const m={};if(f&4&&(m.data=n[2]),f&523&&(m.$$scope={dirty:f,ctx:n}),s!==(s=n[0][0])){if(e){pe();const d=e;J(d.$$.fragment,1,0,()=>{Q(d,1)}),de()}s?(e=new s(c(n)),X(e.$$.fragment),G(e.$$.fragment,1),Z(e,t.parentNode,t)):e=null}else s&&e.$set(m)},i(n){o||(e&&G(e.$$.fragment,n),o=!0)},o(n){e&&J(e.$$.fragment,n),o=!1},d(n){n&&K(t),e&&Q(e,n)}}}function St(r){let e,t,o;var s=r[0][1];function c(n){return{props:{data:n[3],form:n[1]}}}return s&&(e=new s(c(r))),{c(){e&&X(e.$$.fragment),t=F()},l(n){e&&Ie(e.$$.fragment,n),t=F()},m(n,f){e&&Z(e,n,f),W(n,t,f),o=!0},p(n,f){const m={};if(f&8&&(m.data=n[3]),f&2&&(m.form=n[1]),s!==(s=n[0][1])){if(e){pe();const d=e;J(d.$$.fragment,1,0,()=>{Q(d,1)}),de()}s?(e=new s(c(n)),X(e.$$.fragment),G(e.$$.fragment,1),Z(e,t.parentNode,t)):e=null}else s&&e.$set(m)},i(n){o||(e&&G(e.$$.fragment,n),o=!0)},o(n){e&&J(e.$$.fragment,n),o=!1},d(n){n&&K(t),e&&Q(e,n)}}}function Je(r){let e,t=r[5]&&Ge(r);return{c(){e=et("div"),t&&t.c(),this.h()},l(o){e=tt(o,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var s=nt(e);t&&t.l(s),s.forEach(K),this.h()},h(){ve(e,"id","svelte-announcer"),ve(e,"aria-live","assertive"),ve(e,"aria-atomic","true"),q(e,"position","absolute"),q(e,"left","0"),q(e,"top","0"),q(e,"clip","rect(0 0 0 0)"),q(e,"clip-path","inset(50%)"),q(e,"overflow","hidden"),q(e,"white-space","nowrap"),q(e,"width","1px"),q(e,"height","1px")},m(o,s){W(o,e,s),t&&t.m(e,null)},p(o,s){o[5]?t?t.p(o,s):(t=Ge(o),t.c(),t.m(e,null)):t&&(t.d(1),t=null)},d(o){o&&K(e),t&&t.d()}}}function Ge(r){let e;return{c(){e=rt(r[6])},l(t){e=at(t,r[6])},m(t,o){W(t,e,o)},p(t,o){o&64&&ot(e,t[6])},d(t){t&&K(e)}}}function Lt(r){let e,t,o,s,c;const n=[Ot,Rt],f=[];function m(g,y){return g[0][1]?0:1}e=m(r),t=f[e]=n[e](r);let d=r[4]&&Je(r);return{c(){t.c(),o=Ze(),d&&d.c(),s=F()},l(g){t.l(g),o=Qe(g),d&&d.l(g),s=F()},m(g,y){f[e].m(g,y),W(g,o,y),d&&d.m(g,y),W(g,s,y),c=!0},p(g,[y]){let O=e;e=m(g),e===O?f[e].p(g,y):(pe(),J(f[O],1,1,()=>{f[O]=null}),de(),t=f[e],t?t.p(g,y):(t=f[e]=n[e](g),t.c()),G(t,1),t.m(o.parentNode,o)),g[4]?d?d.p(g,y):(d=Je(g),d.c(),d.m(s.parentNode,s)):d&&(d.d(1),d=null)},i(g){c||(G(t),c=!0)},o(g){J(t),c=!1},d(g){f[e].d(g),g&&K(o),d&&d.d(g),g&&K(s)}}}function It(r,e,t){let{stores:o}=e,{page:s}=e,{components:c}=e,{form:n}=e,{data_0:f=null}=e,{data_1:m=null}=e;xe(o.page.notify);let d=!1,g=!1,y=null;return ke(()=>{const O=o.page.subscribe(()=>{d&&(t(5,g=!0),t(6,y=document.title||"untitled page"))});return t(4,d=!0),O}),r.$$set=O=>{"stores"in O&&t(7,o=O.stores),"page"in O&&t(8,s=O.page),"components"in O&&t(0,c=O.components),"form"in O&&t(1,n=O.form),"data_0"in O&&t(2,f=O.data_0),"data_1"in O&&t(3,m=O.data_1)},r.$$.update=()=>{r.$$.dirty&384&&o.page.set(s)},[c,n,f,m,d,g,y,o,s]}class $t extends We{constructor(e){super(),Ye(this,e,It,Lt,Xe,{stores:7,page:8,components:0,form:1,data_0:2,data_1:3})}}const At=function(){const e=document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}(),Pt=function(r,e){return new URL(r,e).href},Ke={},V=function(e,t,o){return!t||t.length===0?e():Promise.all(t.map(s=>{if(s=Pt(s,o),s in Ke)return;Ke[s]=!0;const c=s.endsWith(".css"),n=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${n}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":At,c||(f.as="script",f.crossOrigin=""),f.href=s,document.head.appendChild(f),c)return new Promise((m,d)=>{f.addEventListener("load",m),f.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>e())},jt={},me=[()=>V(()=>import("./chunks/0-49e729a6.js"),["chunks/0-49e729a6.js","chunks/_layout-314e9585.js","components/pages/_layout.svelte-2db1035c.js","assets/_layout-16ad52b0.css","chunks/index-8d2061e5.js"],import.meta.url),()=>V(()=>import("./chunks/1-8dfc8cf3.js"),["chunks/1-8dfc8cf3.js","components/error.svelte-0e1cc2cd.js","chunks/index-8d2061e5.js","chunks/singletons-b46e3941.js","chunks/paths-6cd3a76e.js"],import.meta.url),()=>V(()=>import("./chunks/2-826871b4.js"),["chunks/2-826871b4.js","components/pages/_page.svelte-b3c10ad5.js","assets/_page-31e647e2.css","chunks/index-8d2061e5.js","chunks/config-331e8422.js","chunks/paths-6cd3a76e.js","chunks/area-88d406db.js","chunks/ordinal-7966dd64.js","chunks/init-e15d50c4.js","chunks/range-cc563a65.js","chunks/linear-4ecbf3f0.js","chunks/axis-000f9faf.js","chunks/catmullRom-d00a189e.js","chunks/math-84088ecb.js","chunks/group-4b12f8cd.js","chunks/constant-b8884f20.js","chunks/chord-ef616c5b.js","chunks/helpers-c17ebcc8.js","chunks/selectAll-237a4934.js","chunks/legend-7a7948f2.js","chunks/map-1347aa39.js","chunks/index-c469a12e.js","chunks/matrix-cb81d05d.js","chunks/types-64b52b35.js","chunks/network-f3281806.js","chunks/scatter-9841bf28.js","chunks/json-634995b1.js"],import.meta.url),()=>V(()=>import("./chunks/3-a249143e.js"),["chunks/3-a249143e.js","components/pages/area/_page.svelte-19d17b71.js","chunks/index-8d2061e5.js","chunks/config-331e8422.js","chunks/paths-6cd3a76e.js","chunks/area-88d406db.js","chunks/ordinal-7966dd64.js","chunks/init-e15d50c4.js","chunks/range-cc563a65.js","chunks/linear-4ecbf3f0.js","chunks/axis-000f9faf.js","chunks/catmullRom-d00a189e.js","chunks/math-84088ecb.js","chunks/group-4b12f8cd.js","chunks/constant-b8884f20.js","chunks/json-634995b1.js"],import.meta.url),()=>V(()=>import("./chunks/4-e349112c.js"),["chunks/4-e349112c.js","components/pages/chords/_page.svelte-b1c6b879.js","chunks/index-8d2061e5.js","chunks/config-331e8422.js","chunks/paths-6cd3a76e.js","chunks/chord-ef616c5b.js","chunks/helpers-c17ebcc8.js","chunks/selectAll-237a4934.js","chunks/ordinal-7966dd64.js","chunks/init-e15d50c4.js","chunks/range-cc563a65.js","chunks/group-4b12f8cd.js","chunks/constant-b8884f20.js","chunks/math-84088ecb.js"],import.meta.url),()=>V(()=>import("./chunks/5-dbb754d5.js"),["chunks/5-dbb754d5.js","components/pages/legend/_page.svelte-38732fdb.js","chunks/index-8d2061e5.js","chunks/config-331e8422.js","chunks/paths-6cd3a76e.js","chunks/legend-7a7948f2.js","chunks/helpers-c17ebcc8.js","chunks/selectAll-237a4934.js","chunks/ordinal-7966dd64.js","chunks/init-e15d50c4.js"],import.meta.url),()=>V(()=>import("./chunks/6-a459d5c2.js"),["chunks/6-a459d5c2.js","components/pages/map/_page.svelte-0d1d0943.js","chunks/index-8d2061e5.js","chunks/config-331e8422.js","chunks/paths-6cd3a76e.js","chunks/map-1347aa39.js","chunks/helpers-c17ebcc8.js","chunks/index-c469a12e.js","chunks/range-cc563a65.js","chunks/selectAll-237a4934.js","chunks/linear-4ecbf3f0.js","chunks/init-e15d50c4.js","chunks/group-4b12f8cd.js","chunks/catmullRom-d00a189e.js","chunks/math-84088ecb.js","chunks/json-634995b1.js"],import.meta.url),()=>V(()=>import("./chunks/7-759fac20.js"),["chunks/7-759fac20.js","components/pages/matrix/_page.svelte-f3ff5faa.js","chunks/index-8d2061e5.js","chunks/config-331e8422.js","chunks/paths-6cd3a76e.js","chunks/matrix-cb81d05d.js","chunks/helpers-c17ebcc8.js","chunks/types-64b52b35.js","chunks/init-e15d50c4.js","chunks/ordinal-7966dd64.js","chunks/range-cc563a65.js","chunks/selectAll-237a4934.js","chunks/json-634995b1.js"],import.meta.url),()=>V(()=>import("./chunks/8-3e30b5c8.js"),["chunks/8-3e30b5c8.js","components/pages/network/_page.svelte-0511dba9.js","chunks/index-8d2061e5.js","chunks/config-331e8422.js","chunks/paths-6cd3a76e.js","chunks/network-f3281806.js","chunks/index-c469a12e.js","chunks/helpers-c17ebcc8.js","chunks/types-64b52b35.js","chunks/json-634995b1.js"],import.meta.url),()=>V(()=>import("./chunks/9-8cb3abb3.js"),["chunks/9-8cb3abb3.js","components/pages/scatter/_page.svelte-9a401143.js","chunks/index-8d2061e5.js","chunks/config-331e8422.js","chunks/paths-6cd3a76e.js","chunks/scatter-9841bf28.js","chunks/helpers-c17ebcc8.js","chunks/selectAll-237a4934.js","chunks/linear-4ecbf3f0.js","chunks/init-e15d50c4.js","chunks/axis-000f9faf.js","chunks/group-4b12f8cd.js","chunks/ordinal-7966dd64.js"],import.meta.url)],Nt=[],Tt={"/":[2],"/area":[3],"/chords":[4],"/legend":[5],"/map":[6],"/matrix":[7],"/network":[8],"/scatter":[9]},Ut={handleError:({error:r})=>{console.error(r)}};class Oe{constructor(e,t){this.status=e,typeof t=="string"?this.body={message:t}:t?this.body=t:this.body={message:`Error: ${e}`}}toString(){return JSON.stringify(this.body)}}class ze{constructor(e,t){this.status=e,this.location=t}}async function Dt(r){var e;for(const t in r)if(typeof((e=r[t])==null?void 0:e.then)=="function")return Object.fromEntries(await Promise.all(Object.entries(r).map(async([o,s])=>[o,await s])));return r}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");Object.getOwnPropertyNames(Object.prototype).sort().join("\0");const Vt=-1,qt=-2,Ct=-3,Bt=-4,Ft=-5,Jt=-6;function Gt(r){const e=JSON.parse(r);if(typeof e=="number")return s(e);const t=e,o=Array(t.length);function s(c){if(c===Vt)return;if(c===Ct)return NaN;if(c===Bt)return 1/0;if(c===Ft)return-1/0;if(c===Jt)return-0;if(c in o)return o[c];const n=t[c];if(!n||typeof n!="object")o[c]=n;else if(Array.isArray(n))if(typeof n[0]=="string")switch(n[0]){case"Date":o[c]=new Date(n[1]);break;case"Set":const m=new Set;o[c]=m;for(let y=1;y<n.length;y+=1)m.add(s(n[y]));break;case"Map":const d=new Map;o[c]=d;for(let y=1;y<n.length;y+=2)d.set(s(n[y]),s(n[y+1]));break;case"RegExp":o[c]=new RegExp(n[1],n[2]);break;case"Object":o[c]=Object(n[1]);break;case"BigInt":o[c]=BigInt(n[1]);break;case"null":const g=Object.create(null);o[c]=g;for(let y=1;y<n.length;y+=2)g[n[y]]=s(n[y+1]);break}else{const f=new Array(n.length);o[c]=f;for(let m=0;m<n.length;m+=1){const d=n[m];d!==qt&&(f[m]=s(d))}}else{const f={};o[c]=f;for(const m in n){const d=n[m];f[m]=s(d)}}return o[c]}return s(0)}const He="sveltekit:scroll",B="sveltekit:index",le=kt(me,Nt,Tt,jt),Se=me[0],Le=me[1];Se();Le();let re={};try{re=JSON.parse(sessionStorage[He])}catch{}function Ee(r){re[r]=Re()}function Kt({target:r,base:e,trailing_slash:t}){var De;const o=[];let s=null;const c={before_navigate:[],after_navigate:[]};let n={branch:[],error:null,url:null},f=!1,m=!1,d=!0,g=!1,y=!1,O,T=(De=history.state)==null?void 0:De[B];T||(T=Date.now(),history.replaceState({...history.state,[B]:T},"",location.href));const z=re[T];z&&(history.scrollRestoration="manual",scrollTo(z.x,z.y));let U=!1,D,C,M;async function ae(){M=M||Promise.resolve(),await M,M=null;const a=new URL(location.href),u=we(a,!0);s=null,await $e(u,a,[])}async function x(a,{noscroll:u=!1,replaceState:p=!1,keepfocus:i=!1,state:l={},invalidateAll:h=!1},_,E){return typeof a=="string"&&(a=new URL(a,Be(document))),ye({url:a,scroll:u?Re():null,keepfocus:i,redirect_chain:_,details:{state:l,replaceState:p},nav_token:E,accepted:()=>{h&&(y=!0)},blocked:()=>{},type:"goto"})}async function oe(a){const u=we(a,!1);if(!u)throw new Error(`Attempted to prefetch a URL that does not belong to this app: ${a}`);return s={id:u.id,promise:je(u)},s.promise}async function $e(a,u,p,i,l={},h){var E,k;C=l;let _=a&&await je(a);if(_||(_=await Ue(u,null,ne(new Error(`Not found: ${u.pathname}`),{url:u,params:{},routeId:null}),404)),u=(a==null?void 0:a.url)||u,C!==l)return!1;if(_.type==="redirect")if(p.length>10||p.includes(u.pathname))_=await se({status:500,error:ne(new Error("Redirect loop"),{url:u,params:{},routeId:null}),url:u,routeId:null});else return x(new URL(_.location,u).href,{},[...p,u.pathname],l),!1;else((k=(E=_.props)==null?void 0:E.page)==null?void 0:k.status)>=400&&await H.updated.check()&&await ie(u);if(o.length=0,y=!1,g=!0,i&&i.details){const{details:b}=i,v=b.replaceState?0:1;b.state[B]=T+=v,history[b.replaceState?"replaceState":"pushState"](b.state,"",u)}if(s=null,m){n=_.state,_.props.page&&(_.props.page.url=u);const b=fe();O.$set(_.props),b()}else Ae(_);if(i){const{scroll:b,keepfocus:v}=i;if(!v){const S=document.body,I=S.getAttribute("tabindex");S.tabIndex=-1,S.focus({preventScroll:!0}),setTimeout(()=>{var $;($=getSelection())==null||$.removeAllRanges()}),I!==null?S.setAttribute("tabindex",I):S.removeAttribute("tabindex")}if(await Ce(),d){const S=u.hash&&document.getElementById(u.hash.slice(1));b?scrollTo(b.x,b.y):S?S.scrollIntoView():scrollTo(0,0)}}else await Ce();d=!0,_.props.page&&(D=_.props.page),h&&h(),g=!1}function Ae(a){var l,h;n=a.state;const u=document.querySelector("style[data-sveltekit]");u&&u.remove(),D=a.props.page;const p=fe();O=new $t({target:r,props:{...a.props,stores:H},hydrate:!0}),p();const i={from:null,to:ce("to",{params:n.params,routeId:(h=(l=n.route)==null?void 0:l.id)!=null?h:null,url:new URL(location.href)}),type:"load"};c.after_navigate.forEach(_=>_(i)),m=!0}async function ee({url:a,params:u,branch:p,status:i,error:l,route:h,form:_}){var I;const E=p.filter(Boolean),k={type:"loaded",state:{url:a,params:u,branch:p,error:l,route:h},props:{components:E.map($=>$.node.component)}};_!==void 0&&(k.props.form=_);let b={},v=!D;for(let $=0;$<E.length;$+=1){const j=E[$];b={...b,...j.data},(v||!n.branch.some(N=>N===j))&&(k.props[`data_${$}`]=b,v=v||Object.keys((I=j.data)!=null?I:{}).length>0)}if(v||(v=Object.keys(D.data).length!==Object.keys(b).length),!n.url||a.href!==n.url.href||n.error!==l||_!==void 0||v){k.props.page={error:l,params:u,routeId:h&&h.id,status:i,url:a,form:_,data:v?b:D.data};const $=(j,N)=>{Object.defineProperty(k.props.page,j,{get:()=>{throw new Error(`$page.${j} has been replaced by $page.url.${N}`)}})};$("origin","origin"),$("path","pathname"),$("query","searchParams")}return k}async function _e({loader:a,parent:u,url:p,params:i,routeId:l,server_data_node:h}){var b,v,S,I,$;let _=null;const E={dependencies:new Set,params:new Set,parent:!1,url:!1},k=await a();if((b=k.shared)!=null&&b.load){let j=function(...L){for(const w of L){const{href:R}=new URL(w,p);E.dependencies.add(R)}};const N={routeId:l,params:new Proxy(i,{get:(L,w)=>(E.params.add(w),L[w])}),data:(v=h==null?void 0:h.data)!=null?v:null,url:ut(p,()=>{E.url=!0}),async fetch(L,w){let R;L instanceof Request?(R=L.url,w={body:L.method==="GET"||L.method==="HEAD"?void 0:await L.blob(),cache:L.cache,credentials:L.credentials,headers:L.headers,integrity:L.integrity,keepalive:L.keepalive,method:L.method,mode:L.mode,redirect:L.redirect,referrer:L.referrer,referrerPolicy:L.referrerPolicy,signal:L.signal,...w}):R=L;const P=new URL(R,p).href;return j(P),m?gt(P,w):_t(R,P,w)},setHeaders:()=>{},depends:j,parent(){return E.parent=!0,u()}};Object.defineProperties(N,{props:{get(){throw new Error("@migration task: Replace `props` with `data` stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1},session:{get(){throw new Error("session is no longer available. See https://github.com/sveltejs/kit/discussions/5883")},enumerable:!1},stuff:{get(){throw new Error("@migration task: Remove stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1}}),_=(S=await k.shared.load.call(null,N))!=null?S:null,_=_?await Dt(_):null}return{node:k,loader:a,server:h,shared:(I=k.shared)!=null&&I.load?{type:"data",data:_,uses:E}:null,data:($=_!=null?_:h==null?void 0:h.data)!=null?$:null}}function Pe(a,u,p,i){if(y)return!0;if(!p)return!1;if(p.parent&&u||p.url&&a)return!0;for(const l of p.params)if(i[l]!==n.params[l])return!0;for(const l of p.dependencies)if(o.some(h=>h(new URL(l))))return!0;return!1}function ge(a,u){var p,i;return(a==null?void 0:a.type)==="data"?{type:"data",data:a.data,uses:{dependencies:new Set((p=a.uses.dependencies)!=null?p:[]),params:new Set((i=a.uses.params)!=null?i:[]),parent:!!a.uses.parent,url:!!a.uses.url}}:(a==null?void 0:a.type)==="skip"&&u!=null?u:null}async function je({id:a,invalidating:u,url:p,params:i,route:l}){var L;if((s==null?void 0:s.id)===a)return s.promise;const{errors:h,layouts:_,leaf:E}=l,k=[..._,E];h.forEach(w=>w==null?void 0:w().catch(()=>{})),k.forEach(w=>w==null?void 0:w[1]().catch(()=>{}));let b=null;const v=n.url?a!==n.url.pathname+n.url.search:!1,S=k.reduce((w,R,P)=>{var te;const A=n.branch[P],Y=!!(R!=null&&R[0])&&((A==null?void 0:A.loader)!==R[1]||Pe(v,w.some(Boolean),(te=A.server)==null?void 0:te.uses,i));return w.push(Y),w},[]);if(S.some(Boolean)){try{b=await Me(p,S)}catch(w){return se({status:500,error:ne(w,{url:p,params:i,routeId:l.id}),url:p,routeId:l.id})}if(b.type==="redirect")return b}const I=b==null?void 0:b.nodes;let $=!1;const j=k.map(async(w,R)=>{var te;if(!w)return;const P=n.branch[R],A=I==null?void 0:I[R];if((!A||A.type==="skip")&&w[1]===(P==null?void 0:P.loader)&&!Pe(v,$,(te=P.shared)==null?void 0:te.uses,i))return P;if($=!0,(A==null?void 0:A.type)==="error")throw A;return _e({loader:w[1],url:p,params:i,routeId:l.id,parent:async()=>{var qe;const Ve={};for(let be=0;be<R;be+=1)Object.assign(Ve,(qe=await j[be])==null?void 0:qe.data);return Ve},server_data_node:ge(A===void 0&&w[0]?{type:"skip"}:A!=null?A:null,P==null?void 0:P.server)})});for(const w of j)w.catch(()=>{});const N=[];for(let w=0;w<k.length;w+=1)if(k[w])try{N.push(await j[w])}catch(R){if(R instanceof ze)return{type:"redirect",location:R.location};let P=500,A;I!=null&&I.includes(R)?(P=(L=R.status)!=null?L:P,A=R.error):R instanceof Oe?(P=R.status,A=R.body):A=ne(R,{params:i,url:p,routeId:l.id});const Y=await Ne(w,N,h);return Y?await ee({url:p,params:i,branch:N.slice(0,Y.idx).concat(Y.node),status:P,error:A,route:l}):await Ue(p,l.id,A,P)}else N.push(void 0);return await ee({url:p,params:i,branch:N,status:200,error:null,route:l,form:u?void 0:null})}async function Ne(a,u,p){for(;a--;)if(p[a]){let i=a;for(;!u[i];)i-=1;try{return{idx:i+1,node:{node:await p[a](),loader:p[a],data:{},server:null,shared:null}}}catch{continue}}}async function se({status:a,error:u,url:p,routeId:i}){var b;const l={},h=await Se();let _=null;if(h.server)try{const v=await Me(p,[!0]);if(v.type!=="data"||v.nodes[0]&&v.nodes[0].type!=="data")throw 0;_=(b=v.nodes[0])!=null?b:null}catch{(p.origin!==location.origin||p.pathname!==location.pathname||f)&&await ie(p)}const E=await _e({loader:Se,url:p,params:l,routeId:i,parent:()=>Promise.resolve({}),server_data_node:ge(_)}),k={node:await Le(),loader:Le,shared:null,server:null,data:null};return await ee({url:p,params:l,branch:[E,k],status:a,error:u,route:null})}function we(a,u){if(Te(a))return;const p=decodeURI(a.pathname.slice(e.length)||"/");for(const i of le){const l=i.exec(p);if(l){const h=new URL(a.origin+lt(a.pathname,t)+a.search+a.hash);return{id:h.pathname+h.search,invalidating:u,route:i,params:ct(l),url:h}}}}function Te(a){return a.origin!==location.origin||!a.pathname.startsWith(e)}async function ye({url:a,scroll:u,keepfocus:p,redirect_chain:i,details:l,type:h,delta:_,nav_token:E,accepted:k,blocked:b}){var j,N,L,w;let v=!1;const S=we(a,!1),I={from:ce("from",{params:n.params,routeId:(N=(j=n.route)==null?void 0:j.id)!=null?N:null,url:n.url}),to:ce("to",{params:(L=S==null?void 0:S.params)!=null?L:null,routeId:(w=S==null?void 0:S.route.id)!=null?w:null,url:a}),type:h};_!==void 0&&(I.delta=_);const $={...I,cancel:()=>{v=!0}};if(c.before_navigate.forEach(R=>R($)),v){b();return}Ee(T),k(),m&&H.navigating.set(I),await $e(S,a,i,{scroll:u,keepfocus:p,details:l},E,()=>{c.after_navigate.forEach(R=>R(I)),H.navigating.set(null)})}async function Ue(a,u,p,i){return a.origin===location.origin&&a.pathname===location.pathname&&!f?await se({status:i,error:p,url:a,routeId:u}):await ie(a)}function ie(a){return location.href=a.href,new Promise(()=>{})}return{after_navigate:a=>{ke(()=>(c.after_navigate.push(a),()=>{const u=c.after_navigate.indexOf(a);c.after_navigate.splice(u,1)}))},before_navigate:a=>{ke(()=>(c.before_navigate.push(a),()=>{const u=c.before_navigate.indexOf(a);c.before_navigate.splice(u,1)}))},disable_scroll_handling:()=>{(g||!m)&&(d=!1)},goto:(a,u={})=>x(a,u,[]),invalidate:a=>{if(a===void 0)throw new Error("`invalidate()` (with no arguments) has been replaced by `invalidateAll()`");if(typeof a=="function")o.push(a);else{const{href:u}=new URL(a,location.href);o.push(p=>p.href===u)}return ae()},invalidateAll:()=>(y=!0,ae()),prefetch:async a=>{const u=new URL(a,Be(document));await oe(u)},prefetch_routes:async a=>{const p=(a?le.filter(i=>a.some(l=>i.exec(l))):le).map(i=>Promise.all([...i.layouts,i.leaf].map(l=>l==null?void 0:l[1]())));await Promise.all(p)},apply_action:async a=>{if(a.type==="error"){const u=new URL(location.href),{branch:p,route:i}=n;if(!i)return;const l=await Ne(n.branch.length,p,i.errors);if(l){const h=await ee({url:u,params:n.params,branch:p.slice(0,l.idx).concat(l.node),status:500,error:a.error,route:i});n=h.state;const _=fe();O.$set(h.props),_()}}else if(a.type==="redirect")x(a.location,{invalidateAll:!0},[]);else{const u={form:a.data,page:{...D,form:a.data,status:a.status}},p=fe();O.$set(u),p()}},_start_router:()=>{history.scrollRestoration="manual",addEventListener("beforeunload",i=>{var _,E;let l=!1;const h={from:ce("from",{params:n.params,routeId:(E=(_=n.route)==null?void 0:_.id)!=null?E:null,url:n.url}),to:null,type:"unload",cancel:()=>l=!0};c.before_navigate.forEach(k=>k(h)),l?(i.preventDefault(),i.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){Ee(T);try{sessionStorage[He]=JSON.stringify(re)}catch{}}});const a=i=>{const{url:l,options:h}=Fe(i);if(l&&h.prefetch){if(Te(l))return;oe(l)}};let u;const p=i=>{clearTimeout(u),u=setTimeout(()=>{var l;(l=i.target)==null||l.dispatchEvent(new CustomEvent("sveltekit:trigger_prefetch",{bubbles:!0}))},20)};addEventListener("touchstart",a),addEventListener("mousemove",p),addEventListener("sveltekit:trigger_prefetch",a),addEventListener("click",i=>{if(i.button||i.which!==1||i.metaKey||i.ctrlKey||i.shiftKey||i.altKey||i.defaultPrevented)return;const{a:l,url:h,options:_}=Fe(i);if(!l||!h)return;const E=l instanceof SVGAElement;if(!E&&h.protocol!==location.protocol&&!(h.protocol==="https:"||h.protocol==="http:"))return;const k=(l.getAttribute("rel")||"").split(/\s+/);if(l.hasAttribute("download")||k.includes("external")||_.reload||(E?l.target.baseVal:l.target))return;const[b,v]=h.href.split("#");if(v!==void 0&&b===location.href.split("#")[0]){U=!0,Ee(T),n.url=h,H.page.set({...D,url:h}),H.page.notify();return}ye({url:h,scroll:_.noscroll?Re():null,keepfocus:!1,redirect_chain:[],details:{state:{},replaceState:h.href===location.href},accepted:()=>i.preventDefault(),blocked:()=>i.preventDefault(),type:"link"})}),addEventListener("popstate",i=>{if(i.state){if(i.state[B]===T)return;const l=i.state[B]-T;ye({url:new URL(location.href),scroll:re[i.state[B]],keepfocus:!1,redirect_chain:[],details:null,accepted:()=>{T=i.state[B]},blocked:()=>{history.go(-l)},type:"popstate",delta:l})}}),addEventListener("hashchange",()=>{U&&(U=!1,history.replaceState({...history.state,[B]:++T},"",location.href))});for(const i of document.querySelectorAll("link"))i.rel==="icon"&&(i.href=i.href);addEventListener("pageshow",i=>{i.persisted&&H.navigating.set(null)})},_hydrate:async({status:a,error:u,node_ids:p,params:i,routeId:l,data:h,form:_})=>{var b;f=!0;const E=new URL(location.href);let k;try{const v=p.map(async(S,I)=>{const $=h[I];return _e({loader:me[S],url:E,params:i,routeId:l,parent:async()=>{const j={};for(let N=0;N<I;N+=1)Object.assign(j,(await v[N]).data);return j},server_data_node:ge($)})});k=await ee({url:E,params:i,branch:await Promise.all(v),status:a,error:u,form:_,route:(b=le.find(S=>S.id===l))!=null?b:null})}catch(v){if(v instanceof ze){await ie(new URL(v.location,location.href));return}k=await se({status:v instanceof Oe?v.status:500,error:ne(v,{url:E,params:i,routeId:l}),url:E,routeId:l})}Ae(k)}}}async function Me(r,e){const t=new URL(r);t.pathname=ht(r.pathname);const o=await he(t.href,{headers:{"x-sveltekit-invalidated":e.map(c=>c?"1":"").join(",")}}),s=await o.text();if(!o.ok)throw new Error(JSON.parse(s));return Gt(s)}function ne(r,e){var t;return r instanceof Oe?r.body:(t=Ut.handleError({error:r,event:e}))!=null?t:{message:e.routeId!=null?"Internal Error":"Not Found"}}const zt=["hash","href","host","hostname","origin","pathname","port","protocol","search","searchParams","toString","toJSON"];function ce(r,e){for(const t of zt)Object.defineProperty(e,t,{get(){throw new Error(`The navigation shape changed - ${r}.${t} should now be ${r}.url.${t}`)},enumerable:!1});return e}function fe(){return()=>{}}async function Yt({env:r,hydrate:e,paths:t,target:o,trailing_slash:s}){it(t);const c=Kt({target:o,base:t.base,trailing_slash:s});st({client:c}),e?await c._hydrate(e):c.goto(location.href,{replaceState:!0}),c._start_router()}export{Yt as start};
