import{S as nt,i as ut,s as st,k as Ne,K as y,q as be,a as ze,e as me,l as Oe,m as w,L as E,h as g,r as we,c as Ve,n as e,p as Q,b as ce,F as p,N as de,f as z,g as ye,d as Ee,t as se,A as ft,H as xe,T as ct,J as We,U as ke,u as at,O as ht,z as _t}from"./index-57d070b8.js";import{s as qe,a as K}from"./config-331e8422.js";import{f as pe}from"./index-244dc857.js";import{b as X,c as Ie,T as Be,A as Re,D as gt,d as dt}from"./helpers-2dd99694.js";import{I as je}from"./types-fa1113f9.js";function mt(t,l){if(typeof t[Symbol.iterator]!="function")throw new TypeError("values is not iterable");if(typeof l!="function")throw new TypeError("mapper is not a function");return Array.from(t,(r,s)=>l(r,s,t))}function Je(t,l,r){const s=t.slice();return s[36]=l[r],s}function Ke(t,l,r){const s=t.slice();return s[39]=l[r],s}function Qe(t,l,r){const s=t.slice();return s[39]=l[r],s}function Ze(t,l,r){const s=t.slice();return s[44]=l[r],s}function $e(t){let l,r,s,i,a,o;return{c(){l=y("circle"),this.h()},l(n){l=E(n,"circle",{cx:!0,cy:!0,r:!0,fill:!0}),w(l).forEach(g),this.h()},h(){e(l,"cx",r=t[44].x+t[0]/2-le),e(l,"cy",s=t[44].y),e(l,"r",i=t[5]*1.75),e(l,"fill","#F93B3B")},m(n,f){ce(n,l,f),o=!0},p(n,f){(!o||f[0]&17&&r!==(r=n[44].x+n[0]/2-le))&&e(l,"cx",r),(!o||f[0]&16&&s!==(s=n[44].y))&&e(l,"cy",s),(!o||f[0]&32&&i!==(i=n[5]*1.75))&&e(l,"r",i)},i(n){o||(We(()=>{a||(a=ke(l,pe,{},!0)),a.run(1)}),o=!0)},o(n){a||(a=ke(l,pe,{},!1)),a.run(0),o=!1},d(n){n&&g(l),n&&a&&a.end()}}}function et(t){let l,r,s,i,a,o,n,f,d;return{c(){l=y("g"),r=y("line"),this.h()},l(A){l=E(A,"g",{});var k=w(l);r=E(k,"line",{x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0,"stroke-width":!0}),w(r).forEach(g),k.forEach(g),this.h()},h(){e(r,"x1",s=t[39].source.x+t[0]/2-le),e(r,"y1",i=t[39].source.y-ae),e(r,"x2",a=t[39].target.x+t[0]/2-le),e(r,"y2",o=t[39].target.y-ae),e(r,"stroke","#F93B3B"),e(r,"stroke-width",n=t[5]*1.5)},m(A,k){ce(A,l,k),p(l,r),d=!0},p(A,k){(!d||k[0]&9&&s!==(s=A[39].source.x+A[0]/2-le))&&e(r,"x1",s),(!d||k[0]&8&&i!==(i=A[39].source.y-ae))&&e(r,"y1",i),(!d||k[0]&9&&a!==(a=A[39].target.x+A[0]/2-le))&&e(r,"x2",a),(!d||k[0]&8&&o!==(o=A[39].target.y-ae))&&e(r,"y2",o),(!d||k[0]&32&&n!==(n=A[5]*1.5))&&e(r,"stroke-width",n)},i(A){d||(We(()=>{f||(f=ke(r,pe,{},!0)),f.run(1)}),d=!0)},o(A){f||(f=ke(r,pe,{},!1)),f.run(0),d=!1},d(A){A&&g(l),A&&f&&f.end()}}}function tt(t){let l=t[14](t[39]),r,s,i=l&&et(t);return{c(){i&&i.c(),r=me()},l(a){i&&i.l(a),r=me()},m(a,o){i&&i.m(a,o),ce(a,r,o),s=!0},p(a,o){o[0]&8&&(l=a[14](a[39])),l?i?(i.p(a,o),o[0]&8&&z(i,1)):(i=et(a),i.c(),z(i,1),i.m(r.parentNode,r)):i&&(ye(),se(i,1,1,()=>{i=null}),Ee())},i(a){s||(z(i),s=!0)},o(a){se(i),s=!1},d(a){i&&i.d(a),a&&g(r)}}}function rt(t){let l,r,s=t[3],i=[];for(let o=0;o<s.length;o+=1)i[o]=tt(Qe(t,s,o));const a=o=>se(i[o],1,1,()=>{i[o]=null});return{c(){for(let o=0;o<i.length;o+=1)i[o].c();l=me()},l(o){for(let n=0;n<i.length;n+=1)i[n].l(o);l=me()},m(o,n){for(let f=0;f<i.length;f+=1)i[f].m(o,n);ce(o,l,n),r=!0},p(o,n){if(n[0]&16425){s=o[3];let f;for(f=0;f<s.length;f+=1){const d=Qe(o,s,f);i[f]?(i[f].p(d,n),z(i[f],1)):(i[f]=tt(d),i[f].c(),z(i[f],1),i[f].m(l.parentNode,l))}for(ye(),f=s.length;f<i.length;f+=1)a(f);Ee()}},i(o){if(!r){for(let n=0;n<s.length;n+=1)z(i[n]);r=!0}},o(o){i=i.filter(Boolean);for(let n=0;n<i.length;n+=1)se(i[n]);r=!1},d(o){xe(i,o),o&&g(l)}}}function lt(t){let l,r,s,i,a,o;return{c(){l=y("g"),r=y("line"),this.h()},l(n){l=E(n,"g",{});var f=w(l);r=E(f,"line",{"marker-end":!0,"marker-start":!0,x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0}),w(r).forEach(g),f.forEach(g),this.h()},h(){e(r,"marker-end","url(#arrowhead)"),e(r,"marker-start","url(#arrowtail)"),e(r,"x1",s=t[39].source.x+t[0]/2-le),e(r,"y1",i=t[39].source.y-ae),e(r,"x2",a=t[39].target.x+t[0]/2-le),e(r,"y2",o=t[39].target.y-ae),e(r,"stroke","black")},m(n,f){ce(n,l,f),p(l,r)},p(n,f){f[0]&9&&s!==(s=n[39].source.x+n[0]/2-le)&&e(r,"x1",s),f[0]&8&&i!==(i=n[39].source.y-ae)&&e(r,"y1",i),f[0]&9&&a!==(a=n[39].target.x+n[0]/2-le)&&e(r,"x2",a),f[0]&8&&o!==(o=n[39].target.y-ae)&&e(r,"y2",o)},d(n){n&&g(l)}}}function it(t){let l,r,s,i,a,o,n,f,d,A,k,V,b,P,G,Z,q,R,B,T=t[36].artist+"",S,j,M,O,$,Y,F;function ee(...D){return t[24](t[36],...D)}function C(...D){return t[25](t[36],...D)}function he(...D){return t[26](t[36],...D)}function ne(...D){return t[27](t[36],...D)}function te(...D){return t[28](t[36],...D)}return{c(){l=y("g"),r=y("image"),d=y("circle"),b=y("rect"),B=y("text"),S=be(T),this.h()},l(D){l=E(D,"g",{transform:!0,id:!0,class:!0});var v=w(l);r=E(v,"image",{id:!0,href:!0,height:!0,width:!0,x:!0,y:!0,style:!0}),w(r).forEach(g),d=E(v,"circle",{id:!0,cx:!0,cy:!0,r:!0,stroke:!0,"stroke-width":!0,fill:!0}),w(d).forEach(g),b=E(v,"rect",{id:!0,x:!0,width:!0,y:!0,height:!0,fill:!0,stroke:!0,rx:!0,opacity:!0,class:!0}),w(b).forEach(g),B=E(v,"text",{class:!0,id:!0,x:!0,y:!0,opacity:!0,"text-anchor":!0});var W=w(B);S=we(W,T),W.forEach(g),v.forEach(g),this.h()},h(){e(r,"id",s=X(t[36])+"-image"),e(r,"href",i=qe+t[36].thumbnail),e(r,"height",a=t[5]*2),e(r,"width",o=t[5]*2),e(r,"x",n=-t[5]),e(r,"y",f=-t[5]),Q(r,"outline","none"),e(d,"id",A=X(t[36])+"-circle"),e(d,"cx","0"),e(d,"cy","0"),e(d,"r",t[5]),e(d,"stroke",k=t[36].blurb?"#c00":"black"),e(d,"stroke-width",V=t[36].blurb?"3":"1"),e(d,"fill","none"),e(b,"id",P=X(t[36])+"-rect"),e(b,"x",G=-(Ie("#"+X(t[36])+"-text",t[36].artist)+fe)/2),e(b,"width",Z=Ie("#"+X(t[36])+"-text",t[36].artist)+fe),e(b,"y",q=t[5]+65-(Be("#"+X(t[36])+"-text",t[36].artist)+fe)/2),e(b,"height",R=Be("#"+X(t[36])+"-text",t[36].artist)+fe-10),e(b,"fill","white"),e(b,"stroke","black"),e(b,"rx","15"),e(b,"opacity","0"),e(b,"class","pointer-events-none"),e(B,"class","cursor-default pointer-events-none"),e(B,"id",j=X(t[36])+"-text"),e(B,"x","0"),e(B,"y",M=t[5]+65),e(B,"opacity","0"),e(B,"text-anchor","middle"),e(l,"transform",O=t[11](t[36].x+t[0]/2,t[36].y)),e(l,"id",$=X(t[36])+"-group"),e(l,"class","cursor-pointer")},m(D,v){ce(D,l,v),p(l,r),p(l,d),p(l,b),p(l,B),p(B,S),Y||(F=[de(r,"focus",ee),de(r,"mouseover",C),de(r,"blur",he),de(r,"mouseout",ne),de(r,"click",te)],Y=!0)},p(D,v){t=D,v[0]&4&&s!==(s=X(t[36])+"-image")&&e(r,"id",s),v[0]&4&&i!==(i=qe+t[36].thumbnail)&&e(r,"href",i),v[0]&32&&a!==(a=t[5]*2)&&e(r,"height",a),v[0]&32&&o!==(o=t[5]*2)&&e(r,"width",o),v[0]&32&&n!==(n=-t[5])&&e(r,"x",n),v[0]&32&&f!==(f=-t[5])&&e(r,"y",f),v[0]&4&&A!==(A=X(t[36])+"-circle")&&e(d,"id",A),v[0]&32&&e(d,"r",t[5]),v[0]&4&&k!==(k=t[36].blurb?"#c00":"black")&&e(d,"stroke",k),v[0]&4&&V!==(V=t[36].blurb?"3":"1")&&e(d,"stroke-width",V),v[0]&4&&P!==(P=X(t[36])+"-rect")&&e(b,"id",P),v[0]&4&&G!==(G=-(Ie("#"+X(t[36])+"-text",t[36].artist)+fe)/2)&&e(b,"x",G),v[0]&4&&Z!==(Z=Ie("#"+X(t[36])+"-text",t[36].artist)+fe)&&e(b,"width",Z),v[0]&36&&q!==(q=t[5]+65-(Be("#"+X(t[36])+"-text",t[36].artist)+fe)/2)&&e(b,"y",q),v[0]&4&&R!==(R=Be("#"+X(t[36])+"-text",t[36].artist)+fe-10)&&e(b,"height",R),v[0]&4&&T!==(T=t[36].artist+"")&&at(S,T),v[0]&4&&j!==(j=X(t[36])+"-text")&&e(B,"id",j),v[0]&32&&M!==(M=t[5]+65)&&e(B,"y",M),v[0]&5&&O!==(O=t[11](t[36].x+t[0]/2,t[36].y))&&e(l,"transform",O),v[0]&4&&$!==($=X(t[36])+"-group")&&e(l,"id",$)},d(D){D&&g(l),Y=!1,ht(F)}}}function ot(t){let l,r,s,i;return{c(){l=Ne("div"),r=be(t[10]),this.h()},l(a){l=Oe(a,"DIV",{id:!0,class:!0,style:!0});var o=w(l);r=we(o,t[10]),o.forEach(g),this.h()},h(){e(l,"id","blurb_node"),e(l,"class","absolute border border-black border-solid rounded-lg p-4 w-80 bg-white"),Q(l,"top",t[8]+"px"),Q(l,"left",t[9]+"px")},m(a,o){ce(a,l,o),p(l,r),i=!0},p(a,o){(!i||o[0]&1024)&&at(r,a[10]),(!i||o[0]&256)&&Q(l,"top",a[8]+"px"),(!i||o[0]&512)&&Q(l,"left",a[9]+"px")},i(a){i||(We(()=>{s||(s=ke(l,pe,{},!0)),s.run(1)}),i=!0)},o(a){s||(s=ke(l,pe,{},!1)),s.run(0),i=!1},d(a){a&&g(l),a&&s&&s.end()}}}function kt(t){let l,r,s,i,a,o,n,f,d,A,k,V,b,P,G,Z,q,R,B,T,S,j,M,O,$,Y,F,ee,C,he=t[6],ne,te,D,v,W,ve,Ae,h=t[4],_=[];for(let u=0;u<h.length;u+=1)_[u]=$e(Ze(t,h,u));const L=u=>se(_[u],1,1,()=>{_[u]=null});let I=rt(t),U=t[3],H=[];for(let u=0;u<U.length;u+=1)H[u]=lt(Ke(t,U,u));let ie=t[2],N=[];for(let u=0;u<ie.length;u+=1)N[u]=it(Je(t,ie,u));let x=t[7]&&ot(t);return{c(){l=Ne("div"),r=Ne("div"),s=y("svg"),i=y("g"),a=y("rect"),o=y("line"),n=y("circle"),d=y("text"),A=be("A"),k=y("circle"),b=y("text"),P=be("B"),G=y("text"),Z=be("A influenced B"),q=ze(),R=y("svg"),B=y("defs"),T=y("marker"),S=y("path"),M=y("marker"),O=y("circle"),Y=y("g"),F=y("rect"),ee=y("g");for(let u=0;u<_.length;u+=1)_[u].c();C=y("g"),I.c(),ne=me();for(let u=0;u<H.length;u+=1)H[u].c();te=y("g");for(let u=0;u<N.length;u+=1)N[u].c();v=ze(),x&&x.c(),this.h()},l(u){l=Oe(u,"DIV",{id:!0,class:!0,style:!0});var m=w(l);r=Oe(m,"DIV",{class:!0,style:!0});var c=w(r);s=E(c,"svg",{id:!0,class:!0,style:!0,xmlns:!0,viewBox:!0,preserveAspectRatio:!0});var J=w(s);i=E(J,"g",{transform:!0});var ue=w(i);a=E(ue,"rect",{x:!0,y:!0,width:!0,height:!0,fill:!0,stroke:!0,rx:!0}),w(a).forEach(g),o=E(ue,"line",{"marker-end":!0,"marker-start":!0,x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0}),w(o).forEach(g),n=E(ue,"circle",{cx:!0,cy:!0,r:!0,fill:!0,stroke:!0}),w(n).forEach(g),d=E(ue,"text",{x:!0,y:!0});var Xe=w(d);A=we(Xe,"A"),Xe.forEach(g),k=E(ue,"circle",{cx:!0,cy:!0,r:!0,fill:!0,stroke:!0}),w(k).forEach(g),b=E(ue,"text",{x:!0,y:!0});var Ge=w(b);P=we(Ge,"B"),Ge.forEach(g),G=E(ue,"text",{x:!0,y:!0});var Se=w(G);Z=we(Se,"A influenced B"),Se.forEach(g),ue.forEach(g),J.forEach(g),c.forEach(g),q=Ve(m),R=E(m,"svg",{class:!0,viewBox:!0,preserveAspectRatio:!0});var ge=w(R);B=E(ge,"defs",{});var He=w(B);T=E(He,"marker",{id:!0,viewBox:!0,refX:!0,refY:!0,orient:!0,markerWidth:!0,markerHeight:!0});var Fe=w(T);S=E(Fe,"path",{d:!0,fill:!0,stroke:!0}),w(S).forEach(g),Fe.forEach(g),M=E(He,"marker",{id:!0,viewBox:!0,refX:!0,refY:!0,orient:!0,markerWidth:!0,markerHeight:!0});var Pe=w(M);O=E(Pe,"circle",{cx:!0,cy:!0,r:!0,fill:!0,stroke:!0}),w(O).forEach(g),Pe.forEach(g),He.forEach(g),Y=E(ge,"g",{});var Ye=w(Y);F=E(Ye,"rect",{x:!0,y:!0,width:!0,height:!0,fill:!0}),w(F).forEach(g),Ye.forEach(g),ee=E(ge,"g",{id:!0});var Ce=w(ee);for(let re=0;re<_.length;re+=1)_[re].l(Ce);Ce.forEach(g),C=E(ge,"g",{id:!0});var Te=w(C);I.l(Te),ne=me();for(let re=0;re<H.length;re+=1)H[re].l(Te);Te.forEach(g),te=E(ge,"g",{id:!0});var Ue=w(te);for(let re=0;re<N.length;re+=1)N[re].l(Ue);Ue.forEach(g),ge.forEach(g),v=Ve(m),x&&x.l(m),m.forEach(g),this.h()},h(){e(a,"x","2"),e(a,"y","2"),e(a,"width",Le-8),e(a,"height",Me-4),e(a,"fill","white"),e(a,"stroke","black"),e(a,"rx","15"),e(o,"marker-end","url(#arrowhead)"),e(o,"marker-start","url(#arrowtail)"),e(o,"x1","20"),e(o,"y1","20"),e(o,"x2","115"),e(o,"y2","20"),e(o,"stroke","black"),e(n,"cx","20"),e(n,"cy","20"),e(n,"r",f=t[5]*_e),e(n,"fill","white"),e(n,"stroke","black"),e(d,"x","15"),e(d,"y","25"),e(k,"cx","115"),e(k,"cy","20"),e(k,"r",V=t[5]*_e),e(k,"fill","white"),e(k,"stroke","black"),e(b,"x","110"),e(b,"y","25"),e(G,"x","15"),e(G,"y","50"),e(i,"transform","scale("+_e+")"),e(s,"id","legend"),e(s,"class","inline-block absolute top-0 left-0"),Q(s,"padding-top","10px"),e(s,"xmlns","http://www.w3.org/2000/svg"),e(s,"viewBox","0 0 "+Le+" "+Me),e(s,"preserveAspectRatio","xMidYMid meet"),e(r,"class","absolute left-1/2 -translate-x-1/2 bottom-0"),Q(r,"width",Le*_e+"px"),Q(r,"height",Me*_e+"px"),e(S,"d","M 0,-5 L 10 ,0 L 0,5"),e(S,"fill","black"),e(S,"stroke","none"),e(T,"id","arrowhead"),e(T,"viewBox","-0 -5 10 10"),e(T,"refX",j=t[5]*2),e(T,"refY","0"),e(T,"orient","auto"),e(T,"markerWidth","7"),e(T,"markerHeight","7"),e(O,"cx","8"),e(O,"cy","0"),e(O,"r","5"),e(O,"fill","black"),e(O,"stroke","none"),e(M,"id","arrowtail"),e(M,"viewBox","-0 -5 10 10"),e(M,"refX",$=t[5]*2),e(M,"refY","0"),e(M,"orient","auto-start-reverse"),e(M,"markerWidth","7"),e(M,"markerHeight","7"),e(F,"x","0"),e(F,"y","0"),e(F,"width",t[0]),e(F,"height",t[1]),e(F,"fill","transparent"),e(ee,"id","splat"),e(C,"id","links"),e(te,"id","nodes"),e(R,"class","inline-block absolute top-0 left-0"),e(R,"viewBox",D="0, 0, "+t[0]+", "+t[1]),e(R,"preserveAspectRatio","xMidYMid meet"),e(l,"id","container"),e(l,"class","inline-block relative align-top overflow-hidden"),Q(l,"width",t[0]+"px"),Q(l,"height",t[1]+"px")},m(u,m){ce(u,l,m),p(l,r),p(r,s),p(s,i),p(i,a),p(i,o),p(i,n),p(i,d),p(d,A),p(i,k),p(i,b),p(b,P),p(i,G),p(G,Z),p(l,q),p(l,R),p(R,B),p(B,T),p(T,S),p(B,M),p(M,O),p(R,Y),p(Y,F),p(R,ee);for(let c=0;c<_.length;c+=1)_[c].m(ee,null);p(R,C),I.m(C,null),p(C,ne);for(let c=0;c<H.length;c+=1)H[c].m(C,null);p(R,te);for(let c=0;c<N.length;c+=1)N[c].m(te,null);p(l,v),x&&x.m(l,null),W=!0,ve||(Ae=de(Y,"click",t[16]),ve=!0)},p(u,m){if((!W||m[0]&32&&f!==(f=u[5]*_e))&&e(n,"r",f),(!W||m[0]&32&&V!==(V=u[5]*_e))&&e(k,"r",V),(!W||m[0]&32&&j!==(j=u[5]*2))&&e(T,"refX",j),(!W||m[0]&32&&$!==($=u[5]*2))&&e(M,"refX",$),(!W||m[0]&1)&&e(F,"width",u[0]),(!W||m[0]&2)&&e(F,"height",u[1]),m[0]&49){h=u[4];let c;for(c=0;c<h.length;c+=1){const J=Ze(u,h,c);_[c]?(_[c].p(J,m),z(_[c],1)):(_[c]=$e(J),_[c].c(),z(_[c],1),_[c].m(ee,null))}for(ye(),c=h.length;c<_.length;c+=1)L(c);Ee()}if(m[0]&64&&st(he,he=u[6])?(ye(),se(I,1,1,ft),Ee(),I=rt(u),I.c(),z(I,1),I.m(C,ne)):I.p(u,m),m[0]&9){U=u[3];let c;for(c=0;c<U.length;c+=1){const J=Ke(u,U,c);H[c]?H[c].p(J,m):(H[c]=lt(J),H[c].c(),H[c].m(C,null))}for(;c<H.length;c+=1)H[c].d(1);H.length=U.length}if(m[0]&47141){ie=u[2];let c;for(c=0;c<ie.length;c+=1){const J=Je(u,ie,c);N[c]?N[c].p(J,m):(N[c]=it(J),N[c].c(),N[c].m(te,null))}for(;c<N.length;c+=1)N[c].d(1);N.length=ie.length}(!W||m[0]&3&&D!==(D="0, 0, "+u[0]+", "+u[1]))&&e(R,"viewBox",D),u[7]?x?(x.p(u,m),m[0]&128&&z(x,1)):(x=ot(u),x.c(),z(x,1),x.m(l,null)):x&&(ye(),se(x,1,1,()=>{x=null}),Ee()),(!W||m[0]&1)&&Q(l,"width",u[0]+"px"),(!W||m[0]&2)&&Q(l,"height",u[1]+"px")},i(u){if(!W){for(let m=0;m<h.length;m+=1)z(_[m]);z(I),z(x),W=!0}},o(u){_=_.filter(Boolean);for(let m=0;m<_.length;m+=1)se(_[m]);se(I),se(x),W=!1},d(u){u&&g(l),xe(_,u),I.d(u),xe(H,u),xe(N,u),x&&x.d(),ve=!1,Ae()}}}const oe=500,fe=20,le=40,ae=0,De=50,Le=140,Me=60,_e=.8;function pt(t,l,r){let s,i,a,o,n,f,d=new Worker(""+new URL("../workers/sim-links.worker-e49b8071.js",import.meta.url).href);const A=h=>{r(2,k=h.data.nodes),r(3,V=h.data.links)};d.onmessage=A;let k,V,b,P,G,Z,{width:q=0}=l,{height:R=0}=l;const B=ct(),T=(h,_)=>`translate(${h-le}, ${_-ae})`,S=h=>{B("highlight_artist",{artist:h,influence_type:je.Both})},j=h=>{B("restore_artist",{artist:h,influence_type:je.Both})},M=(h,_)=>{O(h,_),O(_,h)},O=(h,_)=>{const L="#"+Re(h);K(L+"-group").raise(),K(L+"-text").transition().duration(oe).attr("opacity",1),K(L+"-rect").transition().duration(oe).attr("opacity",1),K(L+"-image").transition().duration(oe).attr("width",100).attr("height",100).attr("x",-De).attr("y",-De),K(L+"-circle").transition().duration(oe).attr("r",De);const I=k.find(U=>U.artist===h);if(_){let U=1;const H=k.find(N=>N.artist===_);let ie=gt(I.x,I.y,H.x,H.y);if(I.x<H.x&&(U=-1),ie<De*3){const N="#"+Re(h)+"-group",x=K(N),u=x.attr("transform"),m=dt(u),J=x.node().getBoundingClientRect().width;x.transition().duration(oe).attr("transform",`translate(${m[0]+U*J/2},${m[1]})`)}}else I.blurb&&(r(7,f=!0),r(10,n=I.blurb),r(9,a=q/2+I.x+i*1.5),_t().then(()=>{const H=K("#blurb_node").node().getBoundingClientRect().height;r(8,o=I.y-H/2)}))},$=(h,_)=>{Y(h,_),Y(_,h)},Y=(h,_)=>{const L="#"+Re(h);if(K(L+"-text").transition().duration(oe).attr("opacity",0),K(L+"-rect").transition().duration(oe).attr("opacity",0),K(L+"-image").transition().duration(oe).attr("width",i*2).attr("height",i*2).attr("x",-i).attr("y",-i),K(L+"-circle").transition().duration(oe).attr("r",i),r(7,f=!1),_){const I=k.find(ie=>ie.artist===h),U="#"+Re(h)+"-group";K(U).transition().duration(oe).attr("transform",T(I.x+q/2,I.y))}},F=h=>{r(4,b=[]);for(const _ of h){const L=k.filter(I=>I.artist===_)[0];b.push({x:L.x,y:L.y})}P=h,r(6,s+=1)},ee=()=>{r(4,b=[]),P=[],r(6,s+=1)},C=h=>P.includes(h.source.artist)&&P.includes(h.target.artist),he=h=>{B("display_influence",{artist:h})},ne=()=>{B("reset_influences",{})},te=(h,_)=>{for(let L of h)L.x=0,L.y=R/2;G=h,Z=mt(_,L=>({source:L.artist,target:L.influenced})),r(2,k=G),d.postMessage({nodes:G,links:Z,radius:i,height:R})},D=(h,_)=>S(h.artist),v=(h,_)=>S(h.artist),W=(h,_)=>j(h.artist),ve=(h,_)=>j(h.artist),Ae=(h,_)=>he(h.artist);return t.$$set=h=>{"width"in h&&r(0,q=h.width),"height"in h&&r(1,R=h.height)},t.$$.update=()=>{t.$$.dirty[0]&2&&r(5,i=R/37)},r(2,k=[]),r(3,V=[]),r(4,b=[]),P=[],r(6,s=0),r(9,a=0),r(8,o=0),r(10,n=""),r(7,f=!1),[q,R,k,V,b,i,s,f,o,a,n,T,S,j,C,he,ne,M,O,$,Y,F,ee,te,D,v,W,ve,Ae]}class At extends nt{constructor(l){super(),ut(this,l,pt,kt,st,{width:0,height:1,HighlightPair:17,HighlightArtist:18,RestorePair:19,RestoreArtist:20,DisplayInfluence:21,ResetInfluences:22,Initialize:23},null,[-1,-1])}get HighlightPair(){return this.$$.ctx[17]}get HighlightArtist(){return this.$$.ctx[18]}get RestorePair(){return this.$$.ctx[19]}get RestoreArtist(){return this.$$.ctx[20]}get DisplayInfluence(){return this.$$.ctx[21]}get ResetInfluences(){return this.$$.ctx[22]}get Initialize(){return this.$$.ctx[23]}}export{At as N};
