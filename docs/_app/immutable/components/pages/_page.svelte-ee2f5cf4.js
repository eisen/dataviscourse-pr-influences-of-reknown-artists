import{H as he,S as _e,i as re,s as fe,k as C,l as N,m as S,h as c,n as M,p as u,b as z,A as x,I as ue,J as ee,K as ce,q as te,a as P,v as U,r as se,c as O,w as q,F as L,x as H,L as me,f as I,t as j,d as pe,y as K,o as ge,M as de,g as ye,N as G}from"../../chunks/index-cc78b405.js";import{s as V}from"../../chunks/config-2227fd0b.js";import{C as ve}from"../../chunks/chord-80c287c3.js";import{M as we}from"../../chunks/map-c4bb3140.js";import{M as be}from"../../chunks/matrix-767c94fe.js";import{N as ke}from"../../chunks/network-793c0ef5.js";import{j as J}from"../../chunks/json-634995b1.js";function ze(t,{delay:e=0,duration:s=400,easing:i=he}={}){const n=+getComputedStyle(t).opacity;return{delay:e,duration:s,easing:i,css:a=>`opacity: ${a*n}`}}const ne=/[a-zA-Z]/,le=(t,e=0)=>[...Array(t).keys()].map(s=>s+e);function ie(t,e,s){const i=t.slice();return i[7]=e[s],i}function ae(t){let e;return{c(){e=C("div"),this.h()},l(s){e=N(s,"DIV",{class:!0,style:!0}),S(e).forEach(c),this.h()},h(){M(e,"class","ring svelte-noii95"),u(e,"animation-delay",t[7]*(+t[6]/25)+t[5]),u(e,"width",t[7]*(+t[3]/6)+t[1]),u(e,"height",t[7]*(+t[3]/6)/2+t[1]),ee(e,"pause-animation",t[4])},m(s,i){z(s,e,i)},p(s,i){i&10&&u(e,"width",s[7]*(+s[3]/6)+s[1]),i&10&&u(e,"height",s[7]*(+s[3]/6)/2+s[1]),i&16&&ee(e,"pause-animation",s[4])},d(s){s&&c(e)}}}function Me(t){let e,s=le(6,0),i=[];for(let n=0;n<s.length;n+=1)i[n]=ae(ie(t,s,n));return{c(){e=C("div");for(let n=0;n<i.length;n+=1)i[n].c();this.h()},l(n){e=N(n,"DIV",{class:!0,style:!0});var a=S(e);for(let o=0;o<i.length;o+=1)i[o].l(a);a.forEach(c),this.h()},h(){M(e,"class","wrapper svelte-noii95"),u(e,"--size",t[3]+t[1]),u(e,"--color",t[0]),u(e,"--motionOne",-t[3]/5+t[1]),u(e,"--motionTwo",+t[3]/4+t[1]),u(e,"--motionThree",-t[3]/5+t[1]),u(e,"--duration",t[2])},m(n,a){z(n,e,a);for(let o=0;o<i.length;o+=1)i[o].m(e,null)},p(n,[a]){if(a&122){s=le(6,0);let o;for(o=0;o<s.length;o+=1){const r=ie(n,s,o);i[o]?i[o].p(r,a):(i[o]=ae(r),i[o].c(),i[o].m(e,null))}for(;o<i.length;o+=1)i[o].d(1);i.length=s.length}a&10&&u(e,"--size",n[3]+n[1]),a&1&&u(e,"--color",n[0]),a&10&&u(e,"--motionOne",-n[3]/5+n[1]),a&10&&u(e,"--motionTwo",+n[3]/4+n[1]),a&10&&u(e,"--motionThree",-n[3]/5+n[1]),a&4&&u(e,"--duration",n[2])},i:x,o:x,d(n){n&&c(e),ue(i,n)}}}function Ee(t,e,s){var k,m;let{color:i="#FF3E00"}=e,{unit:n="px"}=e,{duration:a="2.5s"}=e,{size:o="60"}=e,{pause:r=!1}=e,v=(m=(k=a.match(ne))==null?void 0:k[0])!=null?m:"s",g=a.replace(ne,"");return t.$$set=h=>{"color"in h&&s(0,i=h.color),"unit"in h&&s(1,n=h.unit),"duration"in h&&s(2,a=h.duration),"size"in h&&s(3,o=h.size),"pause"in h&&s(4,r=h.pause)},[i,n,a,o,r,v,g]}class Ie extends _e{constructor(e){super(),re(this,e,Ee,Me,fe,{color:0,unit:1,duration:2,size:3,pause:4})}}function oe(t){let e,s,i,n,a;return i=new Ie({props:{size:"100",color:"#CC0000",unit:"px",duration:"1s"}}),{c(){e=C("div"),s=C("div"),U(i.$$.fragment),this.h()},l(o){e=N(o,"DIV",{class:!0});var r=S(e);s=N(r,"DIV",{class:!0});var v=S(s);q(i.$$.fragment,v),v.forEach(c),r.forEach(c),this.h()},h(){M(s,"class","absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"),M(e,"class","absolute inset-0 z-10 bg-white")},m(o,r){z(o,e,r),L(e,s),H(i,s,null),a=!0},p(o,r){},i(o){a||(I(i.$$.fragment,o),n&&n.end(1),a=!0)},o(o){j(i.$$.fragment,o),n=de(e,ze,{duration:Ne}),a=!1},d(o){o&&c(e),K(i),o&&n&&n.end()}}}function Ce(t){let e,s,i,n,a,o,r,v,g,k,m,h,A,w,d,b,E,D,F,B;ce(t[15]);let X={width:t[14],height:t[13]};a=new ke({props:X}),t[16](a);let Y={width:t[12],height:t[11]};r=new ve({props:Y}),t[17](r);let p={width:t[10],height:t[9]};g=new be({props:p}),t[18](g);let W={width:t[8],height:t[7]};m=new we({props:W}),t[19](m);let f=t[6]===!1&&oe();return{c(){e=C("header"),s=te("Influences of Reknown Artists"),i=P(),n=C("div"),U(a.$$.fragment),o=P(),U(r.$$.fragment),v=P(),U(g.$$.fragment),k=P(),U(m.$$.fragment),A=P(),f&&f.c(),w=P(),d=C("footer"),b=C("span"),E=te("Team members: Nishita Kharche, Nick Lord-Ender-Laing, Eisen Montalvo"),this.h()},l(l){e=N(l,"HEADER",{class:!0});var _=S(e);s=se(_,"Influences of Reknown Artists"),_.forEach(c),i=O(l),n=N(l,"DIV",{class:!0,style:!0});var y=S(n);q(a.$$.fragment,y),o=O(y),q(r.$$.fragment,y),v=O(y),q(g.$$.fragment,y),k=O(y),q(m.$$.fragment,y),y.forEach(c),A=O(l),f&&f.l(l),w=O(l),d=N(l,"FOOTER",{class:!0});var R=S(d);b=N(R,"SPAN",{});var T=S(b);E=se(T,"Team members: Nishita Kharche, Nick Lord-Ender-Laing, Eisen Montalvo"),T.forEach(c),R.forEach(c),this.h()},h(){M(e,"class","flex absolute top-4 left-4 w-full font-bold text-4xl z-20"),M(n,"class","grid-cols-2"),M(n,"style",h=t[6]?"opacity: 1;":"opacity:0;"),M(d,"class","flex justify-center absolute w-full")},m(l,_){z(l,e,_),L(e,s),z(l,i,_),z(l,n,_),H(a,n,null),L(n,o),H(r,n,null),L(n,v),H(g,n,null),L(n,k),H(m,n,null),z(l,A,_),f&&f.m(l,_),z(l,w,_),z(l,d,_),L(d,b),L(b,E),D=!0,F||(B=me(window,"resize",t[15]),F=!0)},p(l,[_]){const y={};_&16384&&(y.width=l[14]),_&8192&&(y.height=l[13]),a.$set(y);const R={};_&4096&&(R.width=l[12]),_&2048&&(R.height=l[11]),r.$set(R);const T={};_&1024&&(T.width=l[10]),_&512&&(T.height=l[9]),g.$set(T);const $={};_&256&&($.width=l[8]),_&128&&($.height=l[7]),m.$set($),(!D||_&64&&h!==(h=l[6]?"opacity: 1;":"opacity:0;"))&&M(n,"style",h),l[6]===!1?f?(f.p(l,_),_&64&&I(f,1)):(f=oe(),f.c(),I(f,1),f.m(w.parentNode,w)):f&&(ye(),j(f,1,1,()=>{f=null}),pe())},i(l){D||(I(a.$$.fragment,l),I(r.$$.fragment,l),I(g.$$.fragment,l),I(m.$$.fragment,l),I(f),D=!0)},o(l){j(a.$$.fragment,l),j(r.$$.fragment,l),j(g.$$.fragment,l),j(m.$$.fragment,l),j(f),D=!1},d(l){l&&c(e),l&&c(i),l&&c(n),t[16](null),K(a),t[17](null),K(r),t[18](null),K(g),t[19](null),K(m),l&&c(A),f&&f.d(l),l&&c(w),l&&c(d),F=!1,B()}}}const Ne=1e3,Z=24,Q=30;function Se(t,e,s){let i,n,a,o,r,v,g,k,m,h,A,w,d,b,E;ge(async()=>{const p=await J(`${V}/data/world.json`),W=await J(`${V}/data/artist-locations.json`),f=await J(`${V}/data/artist-mediums.json`),l=await J(`${V}/data/artist-data.json`),_=await J(`${V}/data/artist-influences.json`);d.Initialize(W,f),b.Initialize(p,_,W),E.Initialize(l,_),w.Initialize(l,_),s(6,i=!0)});function D(){s(1,n=window.innerWidth),s(0,a=window.innerHeight)}function F(p){G[p?"unshift":"push"](()=>{w=p,s(2,w)})}function B(p){G[p?"unshift":"push"](()=>{d=p,s(3,d)})}function X(p){G[p?"unshift":"push"](()=>{E=p,s(5,E)})}function Y(p){G[p?"unshift":"push"](()=>{b=p,s(4,b)})}return t.$$.update=()=>{t.$$.dirty&2&&s(14,o=Math.abs(n-Z)/2),t.$$.dirty&1&&s(13,r=Math.abs(a-Q)/2),t.$$.dirty&2&&s(12,v=Math.abs(n-Z)/2),t.$$.dirty&1&&s(11,g=Math.abs(a-Q)/2),t.$$.dirty&2&&s(10,k=Math.abs(n-Z)/2),t.$$.dirty&1&&s(9,m=Math.abs(a-Q)/2),t.$$.dirty&2&&s(8,h=Math.abs(n-Z)/2),t.$$.dirty&1&&s(7,A=Math.abs(a-Q)/2)},s(6,i=!1),s(1,n=0),s(0,a=0),[a,n,w,d,b,E,i,A,h,m,k,g,v,r,o,D,F,B,X,Y]}class Oe extends _e{constructor(e){super(),re(this,e,Se,Ce,fe,{})}}export{Oe as default};