import{S as tt,i as st,s as nt,k as c,l as d,m as p,h as f,n as u,p as m,b as $,A as Be,H as ft,I as We,J as ut,q as Se,a as z,v as le,r as Ae,c as S,w as ie,F as _,x as oe,K as Re,f as K,t as W,d as ct,y as re,L as dt,o as pt,M as gt,g as mt,N as he}from"../../chunks/index-fa249ad2.js";import{S as Ge,a as vt,r as yt,s as Ne}from"../../chunks/config-fd755020.js";import{A as wt}from"../../chunks/area-9ea8dd7e.js";import{C as Xe}from"../../chunks/chord-f4a78617.js";import{M as bt}from"../../chunks/map-964ab1a2.js";import{M as It}from"../../chunks/matrix-f062c9e3.js";import{N as Et}from"../../chunks/network-eca60b70.js";import{S as Dt}from"../../chunks/scatter-90a35d26.js";import{f as kt}from"../../chunks/index-91213610.js";import{j as Ve}from"../../chunks/json-634995b1.js";import{g as Fe}from"../../chunks/group-d3aa616c.js";import{s as Ze}from"../../chunks/select-087c8348.js";function Mt(e){return typeof e=="string"?new Ge([document.querySelectorAll(e)],[document.documentElement]):new Ge([vt(e)],yt)}const Qe=/[a-zA-Z]/,Ye=(e,t=0)=>[...Array(e).keys()].map(s=>s+t);function $e(e,t,s){const i=e.slice();return i[7]=t[s],i}function xe(e){let t;return{c(){t=c("div"),this.h()},l(s){t=d(s,"DIV",{class:!0,style:!0}),p(t).forEach(f),this.h()},h(){u(t,"class","ring svelte-noii95"),m(t,"animation-delay",e[7]*(+e[6]/25)+e[5]),m(t,"width",e[7]*(+e[3]/6)+e[1]),m(t,"height",e[7]*(+e[3]/6)/2+e[1]),We(t,"pause-animation",e[4])},m(s,i){$(s,t,i)},p(s,i){i&10&&m(t,"width",s[7]*(+s[3]/6)+s[1]),i&10&&m(t,"height",s[7]*(+s[3]/6)/2+s[1]),i&16&&We(t,"pause-animation",s[4])},d(s){s&&f(t)}}}function zt(e){let t,s=Ye(6,0),i=[];for(let a=0;a<s.length;a+=1)i[a]=xe($e(e,s,a));return{c(){t=c("div");for(let a=0;a<i.length;a+=1)i[a].c();this.h()},l(a){t=d(a,"DIV",{class:!0,style:!0});var o=p(t);for(let l=0;l<i.length;l+=1)i[l].l(o);o.forEach(f),this.h()},h(){u(t,"class","wrapper svelte-noii95"),m(t,"--size",e[3]+e[1]),m(t,"--color",e[0]),m(t,"--motionOne",-e[3]/5+e[1]),m(t,"--motionTwo",+e[3]/4+e[1]),m(t,"--motionThree",-e[3]/5+e[1]),m(t,"--duration",e[2])},m(a,o){$(a,t,o);for(let l=0;l<i.length;l+=1)i[l].m(t,null)},p(a,[o]){if(o&122){s=Ye(6,0);let l;for(l=0;l<s.length;l+=1){const w=$e(a,s,l);i[l]?i[l].p(w,o):(i[l]=xe(w),i[l].c(),i[l].m(t,null))}for(;l<i.length;l+=1)i[l].d(1);i.length=s.length}o&10&&m(t,"--size",a[3]+a[1]),o&1&&m(t,"--color",a[0]),o&10&&m(t,"--motionOne",-a[3]/5+a[1]),o&10&&m(t,"--motionTwo",+a[3]/4+a[1]),o&10&&m(t,"--motionThree",-a[3]/5+a[1]),o&4&&m(t,"--duration",a[2])},i:Be,o:Be,d(a){a&&f(t),ft(i,a)}}}function St(e,t,s){var R,G;let{color:i="#FF3E00"}=t,{unit:a="px"}=t,{duration:o="2.5s"}=t,{size:l="60"}=t,{pause:w=!1}=t,j=(G=(R=o.match(Qe))==null?void 0:R[0])!=null?G:"s",x=o.replace(Qe,"");return e.$$set=g=>{"color"in g&&s(0,i=g.color),"unit"in g&&s(1,a=g.unit),"duration"in g&&s(2,o=g.duration),"size"in g&&s(3,l=g.size),"pause"in g&&s(4,w=g.pause)},[i,a,o,l,w,j,x]}class At extends tt{constructor(t){super(),st(this,t,St,zt,nt,{color:0,unit:1,duration:2,size:3,pause:4})}}function et(e){let t,s,i,a,o;return i=new At({props:{size:"100",color:"#CC0000",unit:"px",duration:"1s"}}),{c(){t=c("div"),s=c("div"),le(i.$$.fragment),this.h()},l(l){t=d(l,"DIV",{class:!0});var w=p(t);s=d(w,"DIV",{class:!0});var j=p(s);ie(i.$$.fragment,j),j.forEach(f),w.forEach(f),this.h()},h(){u(s,"class","absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"),u(t,"class","absolute inset-0 z-10 bg-white")},m(l,w){$(l,t,w),_(t,s),oe(i,s,null),o=!0},p(l,w){},i(l){o||(K(i.$$.fragment,l),a&&a.end(1),o=!0)},o(l){W(i.$$.fragment,l),a=gt(t,kt,{duration:Vt}),o=!1},d(l){l&&f(t),re(i),l&&a&&a.end()}}}function Nt(e){let t,s,i,a,o,l,w,j,x,R,G,g,X,fe,ue,ee,ce,M,T,te,se,O,Z,P,v,I,D,_e,F,De,q,de,ke,C,J,Me,U,pe,ze,L,r,k,E,H,A,y,N,Q,Te,Y,Oe,qe;ut(e[26]);let at={width:e[19],height:e[18]};D=new Et({props:at}),e[27](D),D.$on("display_influence",e[25]);let lt={width:e[15],height:e[14]};F=new It({props:lt}),e[28](F);let it={width:e[13],height:e[12]};q=new bt({props:it}),e[29](q);let ot={width:e[17],height:e[16]};J=new Xe({props:ot}),e[30](J);let rt={width:e[11],height:e[10]};U=new Dt({props:rt}),e[31](U);let _t={width:e[17],height:e[16]};r=new Xe({props:_t}),e[32](r);let ht={width:e[21],height:e[20]};E=new wt({props:ht}),e[33](E);let b=e[9]===!1&&et();return{c(){t=c("header"),s=Se(`Influences, Deaths, and Mediums of Renown Artists
  `),i=c("div"),a=c("div"),o=c("nav"),l=c("div"),w=c("span"),j=Se("Influences"),x=z(),R=c("span"),G=z(),g=c("div"),X=c("span"),fe=Se("Deaths"),ue=z(),ee=c("span"),ce=z(),M=c("div"),T=c("span"),te=Se("Mediums"),se=z(),O=c("span"),Z=z(),P=c("div"),v=c("div"),I=c("div"),le(D.$$.fragment),_e=z(),le(F.$$.fragment),De=z(),le(q.$$.fragment),ke=z(),C=c("div"),le(J.$$.fragment),Me=z(),le(U.$$.fragment),ze=z(),L=c("div"),le(r.$$.fragment),k=z(),le(E.$$.fragment),A=z(),b&&b.c(),y=z(),N=c("footer"),Q=c("span"),Te=Se("Team members: Nishita Kharche, Nick Lord-Ender-Laing, Eisen Montalvo"),this.h()},l(n){t=d(n,"HEADER",{class:!0,style:!0});var h=p(t);s=Ae(h,`Influences, Deaths, and Mediums of Renown Artists
  `),i=d(h,"DIV",{class:!0});var ge=p(i);a=d(ge,"DIV",{class:!0});var me=p(a);o=d(me,"NAV",{class:!0});var B=p(o);l=d(B,"DIV",{class:!0});var ne=p(l);w=d(ne,"SPAN",{class:!0});var ve=p(w);j=Ae(ve,"Influences"),ve.forEach(f),x=S(ne),R=d(ne,"SPAN",{class:!0}),p(R).forEach(f),ne.forEach(f),G=S(B),g=d(B,"DIV",{class:!0});var ae=p(g);X=d(ae,"SPAN",{class:!0});var ye=p(X);fe=Ae(ye,"Deaths"),ye.forEach(f),ue=S(ae),ee=d(ae,"SPAN",{class:!0}),p(ee).forEach(f),ae.forEach(f),ce=S(B),M=d(B,"DIV",{class:!0});var Ce=p(M);T=d(Ce,"SPAN",{class:!0});var Je=p(T);te=Ae(Je,"Mediums"),Je.forEach(f),se=S(Ce),O=d(Ce,"SPAN",{class:!0}),p(O).forEach(f),Ce.forEach(f),B.forEach(f),me.forEach(f),ge.forEach(f),h.forEach(f),Z=S(n),P=d(n,"DIV",{class:!0});var Ue=p(P);v=d(Ue,"DIV",{id:!0,class:!0,style:!0});var we=p(v);I=d(we,"DIV",{class:!0,style:!0});var be=p(I);ie(D.$$.fragment,be),_e=S(be),ie(F.$$.fragment,be),De=S(be),ie(q.$$.fragment,be),be.forEach(f),ke=S(we),C=d(we,"DIV",{class:!0,style:!0});var Le=p(C);ie(J.$$.fragment,Le),Me=S(Le),ie(U.$$.fragment,Le),Le.forEach(f),ze=S(we),L=d(we,"DIV",{class:!0,style:!0});var je=p(L);ie(r.$$.fragment,je),k=S(je),ie(E.$$.fragment,je),je.forEach(f),we.forEach(f),Ue.forEach(f),A=S(n),b&&b.l(n),y=S(n),N=d(n,"FOOTER",{class:!0});var He=p(N);Q=d(He,"SPAN",{});var Ke=p(Q);Te=Ae(Ke,"Team members: Nishita Kharche, Nick Lord-Ender-Laing, Eisen Montalvo"),Ke.forEach(f),He.forEach(f),this.h()},h(){u(w,"class","pointer-events-none"),u(R,"class","highlight bg-utah-red absolute inset-x-0 bottom-0 h-0.5"),u(l,"class","text-gray-900 rounded-l-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"),u(X,"class","pointer-events-none"),u(ee,"class","highlight bg-transparent absolute inset-x-0 bottom-0 h-0.5"),u(g,"class","text-gray-500 hover:text-gray-700 group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"),u(T,"class","pointer-events-none"),u(O,"class","highlight bg-transparent absolute inset-x-0 bottom-0 h-0.5"),u(M,"class","text-gray-500 hover:text-gray-700 group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"),u(o,"class","isolate flex divide-x divide-gray-200 rounded-lg shadow"),u(a,"class","block"),u(i,"class","ml-4 mt-1 cursor-pointer"),u(t,"class","flex fixed top-4 left-4 w-full font-bold text-4xl z-20"),m(t,"height",V),u(I,"class","grid-cols-2 inline-block"),u(I,"style",de=(e[9]?"opacity: 1;":"opacity:0;")+"margin-top: "+V+"px; width: "+e[0]+"px;"),u(C,"class","grid-cols-2 inline-block"),u(C,"style",pe=(e[9]?"opacity: 1;":"opacity:0;")+"margin-top: "+V+"px; width: "+e[0]+"px;"),u(L,"class","grid-cols-2 inline-block"),u(L,"style",H=(e[9]?"opacity: 1;":"opacity:0;")+"margin-top: "+V+"px; width: "+e[0]+"px;"),u(v,"id","scrollable-container"),u(v,"class","flex flex-row"),m(v,"height",e[1]+"px"),m(v,"width",e[0]*3+"px"),m(v,"transition","0.5s ease all"),u(P,"class","absolute inset-0 overflow-x-hidden"),u(N,"class","flex fixed justify-center bottom-0 w-full")},m(n,h){$(n,t,h),_(t,s),_(t,i),_(i,a),_(a,o),_(o,l),_(l,w),_(w,j),_(l,x),_(l,R),_(o,G),_(o,g),_(g,X),_(X,fe),_(g,ue),_(g,ee),_(o,ce),_(o,M),_(M,T),_(T,te),_(M,se),_(M,O),$(n,Z,h),$(n,P,h),_(P,v),_(v,I),oe(D,I,null),_(I,_e),oe(F,I,null),_(I,De),oe(q,I,null),_(v,ke),_(v,C),oe(J,C,null),_(C,Me),oe(U,C,null),_(v,ze),_(v,L),oe(r,L,null),_(L,k),oe(E,L,null),$(n,A,h),b&&b.m(n,h),$(n,y,h),$(n,N,h),_(N,Q),_(Q,Te),Y=!0,Oe||(qe=[Re(window,"resize",e[26]),Re(l,"click",e[22]),Re(g,"click",e[23]),Re(M,"click",e[24])],Oe=!0)},p(n,h){const ge={};h[0]&524288&&(ge.width=n[19]),h[0]&262144&&(ge.height=n[18]),D.$set(ge);const me={};h[0]&32768&&(me.width=n[15]),h[0]&16384&&(me.height=n[14]),F.$set(me);const B={};h[0]&8192&&(B.width=n[13]),h[0]&4096&&(B.height=n[12]),q.$set(B),(!Y||h[0]&513&&de!==(de=(n[9]?"opacity: 1;":"opacity:0;")+"margin-top: "+V+"px; width: "+n[0]+"px;"))&&u(I,"style",de);const ne={};h[0]&131072&&(ne.width=n[17]),h[0]&65536&&(ne.height=n[16]),J.$set(ne);const ve={};h[0]&2048&&(ve.width=n[11]),h[0]&1024&&(ve.height=n[10]),U.$set(ve),(!Y||h[0]&513&&pe!==(pe=(n[9]?"opacity: 1;":"opacity:0;")+"margin-top: "+V+"px; width: "+n[0]+"px;"))&&u(C,"style",pe);const ae={};h[0]&131072&&(ae.width=n[17]),h[0]&65536&&(ae.height=n[16]),r.$set(ae);const ye={};h[0]&2097152&&(ye.width=n[21]),h[0]&1048576&&(ye.height=n[20]),E.$set(ye),(!Y||h[0]&513&&H!==(H=(n[9]?"opacity: 1;":"opacity:0;")+"margin-top: "+V+"px; width: "+n[0]+"px;"))&&u(L,"style",H),(!Y||h[0]&2)&&m(v,"height",n[1]+"px"),(!Y||h[0]&1)&&m(v,"width",n[0]*3+"px"),n[9]===!1?b?(b.p(n,h),h[0]&512&&K(b,1)):(b=et(),b.c(),K(b,1),b.m(y.parentNode,y)):b&&(mt(),W(b,1,1,()=>{b=null}),ct())},i(n){Y||(K(D.$$.fragment,n),K(F.$$.fragment,n),K(q.$$.fragment,n),K(J.$$.fragment,n),K(U.$$.fragment,n),K(r.$$.fragment,n),K(E.$$.fragment,n),K(b),Y=!0)},o(n){W(D.$$.fragment,n),W(F.$$.fragment,n),W(q.$$.fragment,n),W(J.$$.fragment,n),W(U.$$.fragment,n),W(r.$$.fragment,n),W(E.$$.fragment,n),W(b),Y=!1},d(n){n&&f(t),n&&f(Z),n&&f(P),e[27](null),re(D),e[28](null),re(F),e[29](null),re(q),e[30](null),re(J),e[31](null),re(U),e[32](null),re(r),e[33](null),re(E),n&&f(A),b&&b.d(n),n&&f(y),n&&f(N),Oe=!1,dt(qe)}}}const Vt=1e3,Pe=24,Ie=30,V=72,Ee=24;function Pt(e,t,s){let i,a,o,l,w,j,x,R,G,g,X,fe,ue,ee,ce,M,T,te,se,O,Z,P,v,I,D;const _e=(r,k)=>{Mt(".highlight").classed("bg-utah-red",!1).classed("bg-transparent",!0),Ze(r).select(".highlight").classed("bg-utah-red",!0).classed("bg-transparent",!1),Ze("#scrollable-container").attr("style",`height: ${o}px; width: ${a*3}px; transition: 1.0s ease all; transform: translateX(${k}px)`)},F=r=>{_e(r.target,0)},De=r=>{_e(r.target,-a)},q=r=>{_e(r.target,-a*2)},de=r=>{const k=r.detail.artist,E=[],H=te.filter(y=>y[0]===k),A=T.filter(y=>y[0]===k);if(H.length>0)for(let y of H[0][1]){const N=M.find(Q=>Q[1][0].artist===y.artist);N&&E.push(N)}if(A.length>0)for(let y of A[0][1]){const N=M.find(Q=>Q[1][0].artist===y.influenced);N&&E.push(N)}v.DisplayInfluences(k,E),O.DisplayInfluence(E.map(y=>y[0]))};pt(async()=>{const r=await Ve(`${Ne}/data/world.json`),k=await Ve(`${Ne}/data/artist-locations.json`),E=await Ve(`${Ne}/data/artist-mediums.json`),H=await Ve(`${Ne}/data/artist-data.json`),A=await Ve(`${Ne}/data/artist-influences.json`);A&&(T=Fe(A,y=>y.artist),te=Fe(A,y=>y.influenced)),k&&(M=Fe(k,y=>y.artist)),se.Initialize(),Z.Initialize(k,E),P.Initialize(k,E),v.Initialize(r,te,T,k,H),I.Initialize(H,A),O.Initialize(H,A),D.Initialize(),s(9,i=!0)});function ke(){s(0,a=window.innerWidth),s(1,o=window.innerHeight)}function C(r){he[r?"unshift":"push"](()=>{O=r,s(3,O)})}function J(r){he[r?"unshift":"push"](()=>{I=r,s(7,I)})}function Me(r){he[r?"unshift":"push"](()=>{v=r,s(6,v)})}function U(r){he[r?"unshift":"push"](()=>{Z=r,s(4,Z)})}function pe(r){he[r?"unshift":"push"](()=>{D=r,s(8,D)})}function ze(r){he[r?"unshift":"push"](()=>{P=r,s(5,P)})}function L(r){he[r?"unshift":"push"](()=>{se=r,s(2,se)})}return e.$$.update=()=>{e.$$.dirty[0]&1&&s(21,l=Math.abs(a-Pe)/2),e.$$.dirty[0]&2&&s(20,w=Math.abs(o-Ie-V-Ee)),e.$$.dirty[0]&1&&s(19,j=a),e.$$.dirty[0]&2&&s(18,x=Math.abs(o-Ie-V-Ee)/2),e.$$.dirty[0]&1&&s(17,R=Math.abs(a-Pe)/2),e.$$.dirty[0]&2&&s(16,G=Math.abs(o-Ie-V-Ee)),e.$$.dirty[0]&1&&s(15,g=Math.abs(a-Pe)/2),e.$$.dirty[0]&2&&s(14,X=Math.abs(o-Ie-V-Ee)/2),e.$$.dirty[0]&1&&s(13,fe=Math.abs(a-Pe)/2),e.$$.dirty[0]&2&&s(12,ue=Math.abs(o-Ie-V-Ee)/2),e.$$.dirty[0]&1&&s(11,ee=Math.abs(a-Pe)/2),e.$$.dirty[0]&2&&s(10,ce=Math.abs(o-Ie-V-Ee))},s(9,i=!1),s(0,a=0),s(1,o=0),M=[],T=[],te=[],[a,o,se,O,Z,P,v,I,D,i,ce,ee,ue,fe,X,g,G,R,x,j,w,l,F,De,q,de,ke,C,J,Me,U,pe,ze,L]}class Bt extends tt{constructor(t){super(),st(this,t,Pt,Nt,nt,{},null,[-1,-1])}}export{Bt as default};