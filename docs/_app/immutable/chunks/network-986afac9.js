import{S as xe,i as Pe,s as Ue,k as je,P as E,e as se,q as _e,l as Ge,m as b,Q as A,h as g,r as ge,n as e,p as ue,b as ie,F as w,L as ne,f as j,g as de,d as ke,t as re,A as Je,H as me,R as Qe,J as qe,T as ve,u as Ve,M as Ke}from"./index-8d2061e5.js";import{s as De}from"./config-f23957d4.js";import{f as pe}from"./index-c469a12e.js";import{c as M,T as he,b as ce,A as Me,s as Q}from"./helpers-d31f3b08.js";import{I as Oe}from"./types-64b52b35.js";function Ze(t,i){if(typeof t[Symbol.iterator]!="function")throw new TypeError("values is not iterable");if(typeof i!="function")throw new TypeError("mapper is not a function");return Array.from(t,(r,h)=>i(r,h,t))}function He(t,i,r){const h=t.slice();return h[30]=i[r],h}function Xe(t,i,r){const h=t.slice();return h[33]=i[r],h}function We(t,i,r){const h=t.slice();return h[33]=i[r],h}function Fe(t,i,r){const h=t.slice();return h[38]=i[r],h}function Ne(t){let i,r,h,l,c,u;return{c(){i=E("circle"),this.h()},l(o){i=A(o,"circle",{cx:!0,cy:!0,r:!0,fill:!0}),b(i).forEach(g),this.h()},h(){e(i,"cx",r=t[38].x+t[0]/2-G),e(i,"cy",h=t[38].y),e(i,"r",l=t[5]*1.75),e(i,"fill","#F93B3B")},m(o,s){ie(o,i,s),u=!0},p(o,s){(!u||s[0]&17&&r!==(r=o[38].x+o[0]/2-G))&&e(i,"cx",r),(!u||s[0]&16&&h!==(h=o[38].y))&&e(i,"cy",h),(!u||s[0]&32&&l!==(l=o[5]*1.75))&&e(i,"r",l)},i(o){u||(qe(()=>{c||(c=ve(i,pe,{},!0)),c.run(1)}),u=!0)},o(o){c||(c=ve(i,pe,{},!1)),c.run(0),u=!1},d(o){o&&g(i),o&&c&&c.end()}}}function Le(t){let i,r,h,l,c,u,o,s,m;return{c(){i=E("g"),r=E("line"),this.h()},l(d){i=A(d,"g",{});var _=b(i);r=A(_,"line",{x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0,"stroke-width":!0}),b(r).forEach(g),_.forEach(g),this.h()},h(){e(r,"x1",h=t[33].source.x+t[0]/2-G),e(r,"y1",l=t[33].source.y-V),e(r,"x2",c=t[33].target.x+t[0]/2-G),e(r,"y2",u=t[33].target.y-V),e(r,"stroke","#F93B3B"),e(r,"stroke-width",o=t[5]*1.5)},m(d,_){ie(d,i,_),w(i,r),m=!0},p(d,_){(!m||_[0]&9&&h!==(h=d[33].source.x+d[0]/2-G))&&e(r,"x1",h),(!m||_[0]&8&&l!==(l=d[33].source.y-V))&&e(r,"y1",l),(!m||_[0]&9&&c!==(c=d[33].target.x+d[0]/2-G))&&e(r,"x2",c),(!m||_[0]&8&&u!==(u=d[33].target.y-V))&&e(r,"y2",u),(!m||_[0]&32&&o!==(o=d[5]*1.5))&&e(r,"stroke-width",o)},i(d){m||(qe(()=>{s||(s=ve(r,pe,{},!0)),s.run(1)}),m=!0)},o(d){s||(s=ve(r,pe,{},!1)),s.run(0),m=!1},d(d){d&&g(i),d&&s&&s.end()}}}function Se(t){let i=t[10](t[33]),r,h,l=i&&Le(t);return{c(){l&&l.c(),r=se()},l(c){l&&l.l(c),r=se()},m(c,u){l&&l.m(c,u),ie(c,r,u),h=!0},p(c,u){u[0]&8&&(i=c[10](c[33])),i?l?(l.p(c,u),u[0]&8&&j(l,1)):(l=Le(c),l.c(),j(l,1),l.m(r.parentNode,r)):l&&(de(),re(l,1,1,()=>{l=null}),ke())},i(c){h||(j(l),h=!0)},o(c){re(l),h=!1},d(c){l&&l.d(c),c&&g(r)}}}function Ye(t){let i,r,h=t[3],l=[];for(let u=0;u<h.length;u+=1)l[u]=Se(We(t,h,u));const c=u=>re(l[u],1,1,()=>{l[u]=null});return{c(){for(let u=0;u<l.length;u+=1)l[u].c();i=se()},l(u){for(let o=0;o<l.length;o+=1)l[o].l(u);i=se()},m(u,o){for(let s=0;s<l.length;s+=1)l[s].m(u,o);ie(u,i,o),r=!0},p(u,o){if(o[0]&1065){h=u[3];let s;for(s=0;s<h.length;s+=1){const m=We(u,h,s);l[s]?(l[s].p(m,o),j(l[s],1)):(l[s]=Se(m),l[s].c(),j(l[s],1),l[s].m(i.parentNode,i))}for(de(),s=h.length;s<l.length;s+=1)c(s);ke()}},i(u){if(!r){for(let o=0;o<h.length;o+=1)j(l[o]);r=!0}},o(u){l=l.filter(Boolean);for(let o=0;o<l.length;o+=1)re(l[o]);r=!1},d(u){me(l,u),u&&g(i)}}}function ze(t){let i,r,h,l,c,u;return{c(){i=E("g"),r=E("line"),this.h()},l(o){i=A(o,"g",{});var s=b(i);r=A(s,"line",{"marker-end":!0,"marker-start":!0,x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0}),b(r).forEach(g),s.forEach(g),this.h()},h(){e(r,"marker-end","url(#arrowhead)"),e(r,"marker-start","url(#arrowtail)"),e(r,"x1",h=t[33].source.x+t[0]/2-G),e(r,"y1",l=t[33].source.y-V),e(r,"x2",c=t[33].target.x+t[0]/2-G),e(r,"y2",u=t[33].target.y-V),e(r,"stroke","black")},m(o,s){ie(o,i,s),w(i,r)},p(o,s){s[0]&9&&h!==(h=o[33].source.x+o[0]/2-G)&&e(r,"x1",h),s[0]&8&&l!==(l=o[33].source.y-V)&&e(r,"y1",l),s[0]&9&&c!==(c=o[33].target.x+o[0]/2-G)&&e(r,"x2",c),s[0]&8&&u!==(u=o[33].target.y-V)&&e(r,"y2",u)},d(o){o&&g(i)}}}function Ce(t){let i,r,h,l,c,u,o,s,m,d,_,F,R,z,N,L,p,I=t[30].artist+"",T,O,S,J,H,Y,K;function x(...B){return t[18](t[30],...B)}function le(...B){return t[19](t[30],...B)}function Z(...B){return t[20](t[30],...B)}function $(...B){return t[21](t[30],...B)}function D(...B){return t[22](t[30],...B)}return{c(){i=E("g"),r=E("image"),m=E("circle"),_=E("rect"),p=E("text"),T=_e(I),this.h()},l(B){i=A(B,"g",{transform:!0,id:!0,class:!0});var a=b(i);r=A(a,"image",{id:!0,href:!0,height:!0,width:!0,x:!0,y:!0,style:!0}),b(r).forEach(g),m=A(a,"circle",{id:!0,cx:!0,cy:!0,r:!0,stroke:!0,fill:!0}),b(m).forEach(g),_=A(a,"rect",{id:!0,x:!0,width:!0,y:!0,height:!0,fill:!0,stroke:!0,rx:!0,opacity:!0,class:!0}),b(_).forEach(g),p=A(a,"text",{class:!0,id:!0,x:!0,y:!0,opacity:!0,"text-anchor":!0});var k=b(p);T=ge(k,I),k.forEach(g),a.forEach(g),this.h()},h(){e(r,"id",h=M(t[30])+"-image"),e(r,"href",l=De+t[30].thumbnail),e(r,"height",c=t[5]*2),e(r,"width",u=t[5]*2),e(r,"x",o=-t[5]),e(r,"y",s=-t[5]),ue(r,"outline","none"),e(m,"id",d=M(t[30])+"-circle"),e(m,"cx","0"),e(m,"cy","0"),e(m,"r",t[5]),e(m,"stroke","black"),e(m,"fill","none"),e(_,"id",F=M(t[30])+"-rect"),e(_,"x",R=-(he("#"+M(t[30])+"-text",t[30].artist)+q)/2),e(_,"width",z=he("#"+M(t[30])+"-text",t[30].artist)+q),e(_,"y",N=t[5]+65-(ce("#"+M(t[30])+"-text",t[30].artist)+q)/2),e(_,"height",L=ce("#"+M(t[30])+"-text",t[30].artist)+q-10),e(_,"fill","white"),e(_,"stroke","black"),e(_,"rx","15"),e(_,"opacity","0"),e(_,"class","pointer-events-none"),e(p,"class","cursor-default pointer-events-none"),e(p,"id",O=M(t[30])+"-text"),e(p,"x","0"),e(p,"y",S=t[5]+65),e(p,"opacity","0"),e(p,"text-anchor","middle"),e(i,"transform",J=t[7](t[30].x+t[0]/2,t[30].y)),e(i,"id",H=M(t[30])+"-group"),e(i,"class","cursor-pointer")},m(B,a){ie(B,i,a),w(i,r),w(i,m),w(i,_),w(i,p),w(p,T),Y||(K=[ne(r,"focus",x),ne(r,"mouseover",le),ne(r,"blur",Z),ne(r,"mouseout",$),ne(r,"click",D)],Y=!0)},p(B,a){t=B,a[0]&4&&h!==(h=M(t[30])+"-image")&&e(r,"id",h),a[0]&4&&l!==(l=De+t[30].thumbnail)&&e(r,"href",l),a[0]&32&&c!==(c=t[5]*2)&&e(r,"height",c),a[0]&32&&u!==(u=t[5]*2)&&e(r,"width",u),a[0]&32&&o!==(o=-t[5])&&e(r,"x",o),a[0]&32&&s!==(s=-t[5])&&e(r,"y",s),a[0]&4&&d!==(d=M(t[30])+"-circle")&&e(m,"id",d),a[0]&32&&e(m,"r",t[5]),a[0]&4&&F!==(F=M(t[30])+"-rect")&&e(_,"id",F),a[0]&4&&R!==(R=-(he("#"+M(t[30])+"-text",t[30].artist)+q)/2)&&e(_,"x",R),a[0]&4&&z!==(z=he("#"+M(t[30])+"-text",t[30].artist)+q)&&e(_,"width",z),a[0]&36&&N!==(N=t[5]+65-(ce("#"+M(t[30])+"-text",t[30].artist)+q)/2)&&e(_,"y",N),a[0]&4&&L!==(L=ce("#"+M(t[30])+"-text",t[30].artist)+q-10)&&e(_,"height",L),a[0]&4&&I!==(I=t[30].artist+"")&&Ve(T,I),a[0]&4&&O!==(O=M(t[30])+"-text")&&e(p,"id",O),a[0]&32&&S!==(S=t[5]+65)&&e(p,"y",S),a[0]&5&&J!==(J=t[7](t[30].x+t[0]/2,t[30].y))&&e(i,"transform",J),a[0]&4&&H!==(H=M(t[30])+"-group")&&e(i,"id",H)},d(B){B&&g(i),Y=!1,Ke(K)}}}function $e(t){let i,r,h,l,c,u,o,s,m,d,_,F,R,z=t[6],N,L,p,I,T,O,S,J,H,Y,K,x,le,Z,$,D,B,a,k=t[4],v=[];for(let n=0;n<k.length;n+=1)v[n]=Ne(Fe(t,k,n));const fe=n=>re(v[n],1,1,()=>{v[n]=null});let C=Ye(t),oe=t[3],X=[];for(let n=0;n<oe.length;n+=1)X[n]=ze(Xe(t,oe,n));let ae=t[2],W=[];for(let n=0;n<ae.length;n+=1)W[n]=Ce(He(t,ae,n));return{c(){i=je("div"),r=E("svg"),h=E("defs"),l=E("marker"),c=E("path"),o=E("marker"),s=E("circle"),d=E("g"),_=E("rect"),F=E("g");for(let n=0;n<v.length;n+=1)v[n].c();R=E("g"),C.c(),N=se();for(let n=0;n<X.length;n+=1)X[n].c();L=E("g");for(let n=0;n<W.length;n+=1)W[n].c();p=E("g"),I=E("rect"),T=E("line"),O=E("circle"),S=E("text"),J=_e("A"),H=E("circle"),Y=E("text"),K=_e("B"),x=E("text"),le=_e("A influenced B"),this.h()},l(n){i=Ge(n,"DIV",{id:!0,class:!0,style:!0});var y=b(i);r=A(y,"svg",{class:!0,viewBox:!0,preserveAspectRatio:!0});var f=b(r);h=A(f,"defs",{});var U=b(h);l=A(U,"marker",{id:!0,viewBox:!0,refX:!0,refY:!0,orient:!0,markerWidth:!0,markerHeight:!0});var we=b(l);c=A(we,"path",{d:!0,fill:!0,stroke:!0}),b(c).forEach(g),we.forEach(g),o=A(U,"marker",{id:!0,viewBox:!0,refX:!0,refY:!0,orient:!0,markerWidth:!0,markerHeight:!0});var be=b(o);s=A(be,"circle",{cx:!0,cy:!0,r:!0,fill:!0,stroke:!0}),b(s).forEach(g),be.forEach(g),U.forEach(g),d=A(f,"g",{});var Ee=b(d);_=A(Ee,"rect",{x:!0,y:!0,width:!0,height:!0,fill:!0}),b(_).forEach(g),Ee.forEach(g),F=A(f,"g",{id:!0});var Ae=b(F);for(let P=0;P<v.length;P+=1)v[P].l(Ae);Ae.forEach(g),R=A(f,"g",{id:!0});var ye=b(R);C.l(ye),N=se();for(let P=0;P<X.length;P+=1)X[P].l(ye);ye.forEach(g),L=A(f,"g",{id:!0});var Be=b(L);for(let P=0;P<W.length;P+=1)W[P].l(Be);Be.forEach(g),p=A(f,"g",{transform:!0});var ee=b(p);I=A(ee,"rect",{x:!0,y:!0,width:!0,height:!0,fill:!0,stroke:!0,rx:!0}),b(I).forEach(g),T=A(ee,"line",{"marker-end":!0,"marker-start":!0,x1:!0,y1:!0,x2:!0,y2:!0,stroke:!0}),b(T).forEach(g),O=A(ee,"circle",{cx:!0,cy:!0,r:!0,fill:!0,stroke:!0}),b(O).forEach(g),S=A(ee,"text",{x:!0,y:!0});var Ie=b(S);J=ge(Ie,"A"),Ie.forEach(g),H=A(ee,"circle",{cx:!0,cy:!0,r:!0,fill:!0,stroke:!0}),b(H).forEach(g),Y=A(ee,"text",{x:!0,y:!0});var Re=b(Y);K=ge(Re,"B"),Re.forEach(g),x=A(ee,"text",{x:!0,y:!0});var Te=b(x);le=ge(Te,"A influenced B"),Te.forEach(g),ee.forEach(g),f.forEach(g),y.forEach(g),this.h()},h(){e(c,"d","M 0,-5 L 10 ,0 L 0,5"),e(c,"fill","black"),e(c,"stroke","none"),e(l,"id","arrowhead"),e(l,"viewBox","-0 -5 10 10"),e(l,"refX",u=t[5]*2),e(l,"refY","0"),e(l,"orient","auto"),e(l,"markerWidth","7"),e(l,"markerHeight","7"),e(s,"cx","8"),e(s,"cy","0"),e(s,"r","5"),e(s,"fill","black"),e(s,"stroke","none"),e(o,"id","arrowtail"),e(o,"viewBox","-0 -5 10 10"),e(o,"refX",m=t[5]*2),e(o,"refY","0"),e(o,"orient","auto-start-reverse"),e(o,"markerWidth","7"),e(o,"markerHeight","7"),e(_,"x","0"),e(_,"y","0"),e(_,"width",t[0]),e(_,"height",t[1]),e(_,"fill","white"),e(F,"id","splat"),e(R,"id","links"),e(L,"id","nodes"),e(I,"x","-3"),e(I,"y","0"),e(I,"width","140"),e(I,"height","60"),e(I,"fill","white"),e(I,"stroke","black"),e(I,"rx","15"),e(T,"marker-end","url(#arrowhead)"),e(T,"marker-start","url(#arrowtail)"),e(T,"x1","20"),e(T,"y1","20"),e(T,"x2","115"),e(T,"y2","20"),e(T,"stroke","black"),e(O,"cx","20"),e(O,"cy","20"),e(O,"r",t[5]),e(O,"fill","white"),e(O,"stroke","black"),e(S,"x","15"),e(S,"y","25"),e(H,"cx","115"),e(H,"cy","20"),e(H,"r",t[5]),e(H,"fill","white"),e(H,"stroke","black"),e(Y,"x","110"),e(Y,"y","25"),e(x,"x","15"),e(x,"y","50"),e(p,"transform",Z=t[7](t[0]-q*6,t[1]-q*4)),e(r,"class","inline-block absolute top-0 left-0"),e(r,"viewBox",$="0, 0, "+t[0]+", "+t[1]),e(r,"preserveAspectRatio","xMidYMid meet"),e(i,"id","container"),e(i,"class","inline-block relative align-top overflow-hidden"),ue(i,"width",t[0]+"px"),ue(i,"height",t[1]+"px")},m(n,y){ie(n,i,y),w(i,r),w(r,h),w(h,l),w(l,c),w(h,o),w(o,s),w(r,d),w(d,_),w(r,F);for(let f=0;f<v.length;f+=1)v[f].m(F,null);w(r,R),C.m(R,null),w(R,N);for(let f=0;f<X.length;f+=1)X[f].m(R,null);w(r,L);for(let f=0;f<W.length;f+=1)W[f].m(L,null);w(r,p),w(p,I),w(p,T),w(p,O),w(p,S),w(S,J),w(p,H),w(p,Y),w(Y,K),w(p,x),w(x,le),D=!0,B||(a=ne(d,"click",t[12]),B=!0)},p(n,y){if((!D||y[0]&32&&u!==(u=n[5]*2))&&e(l,"refX",u),(!D||y[0]&32&&m!==(m=n[5]*2))&&e(o,"refX",m),(!D||y[0]&1)&&e(_,"width",n[0]),(!D||y[0]&2)&&e(_,"height",n[1]),y[0]&49){k=n[4];let f;for(f=0;f<k.length;f+=1){const U=Fe(n,k,f);v[f]?(v[f].p(U,y),j(v[f],1)):(v[f]=Ne(U),v[f].c(),j(v[f],1),v[f].m(F,null))}for(de(),f=k.length;f<v.length;f+=1)fe(f);ke()}if(y[0]&64&&Ue(z,z=n[6])?(de(),re(C,1,1,Je),ke(),C=Ye(n),C.c(),j(C,1),C.m(R,N)):C.p(n,y),y[0]&9){oe=n[3];let f;for(f=0;f<oe.length;f+=1){const U=Xe(n,oe,f);X[f]?X[f].p(U,y):(X[f]=ze(U),X[f].c(),X[f].m(R,null))}for(;f<X.length;f+=1)X[f].d(1);X.length=oe.length}if(y[0]&2981){ae=n[2];let f;for(f=0;f<ae.length;f+=1){const U=He(n,ae,f);W[f]?W[f].p(U,y):(W[f]=Ce(U),W[f].c(),W[f].m(L,null))}for(;f<W.length;f+=1)W[f].d(1);W.length=ae.length}(!D||y[0]&32)&&e(O,"r",n[5]),(!D||y[0]&32)&&e(H,"r",n[5]),(!D||y[0]&3&&Z!==(Z=n[7](n[0]-q*6,n[1]-q*4)))&&e(p,"transform",Z),(!D||y[0]&3&&$!==($="0, 0, "+n[0]+", "+n[1]))&&e(r,"viewBox",$),(!D||y[0]&1)&&ue(i,"width",n[0]+"px"),(!D||y[0]&2)&&ue(i,"height",n[1]+"px")},i(n){if(!D){for(let y=0;y<k.length;y+=1)j(v[y]);j(C),D=!0}},o(n){v=v.filter(Boolean);for(let y=0;y<v.length;y+=1)re(v[y]);re(C),D=!1},d(n){n&&g(i),me(v,n),C.d(n),me(X,n),me(W,n),B=!1,a()}}}const te=500,q=20,G=40,V=0;function et(t,i,r){let h,l,c=new Worker(""+new URL("../workers/sim-links.worker-e49b8071.js",import.meta.url).href);const u=a=>{r(2,o=a.data.nodes),r(3,s=a.data.links)};c.onmessage=u;let o,s,m,d,_,F,{width:R=0}=i,{height:z=0}=i;const N=Qe(),L=(a,k)=>`translate(${a-G}, ${k-V})`,p=a=>{N("highlight_artist",{artist:a,influence_type:Oe.Both})},I=a=>{N("restore_artist",{artist:a,influence_type:Oe.Both})},T=a=>{const k="#"+Me(a);Q(k+"-group").raise(),Q(k+"-text").transition().duration(te).attr("opacity",1),Q(k+"-rect").transition().duration(te).attr("opacity",1),Q(k+"-image").transition().duration(te).attr("width",100).attr("height",100).attr("x",-50).attr("y",-50),Q(k+"-circle").transition().duration(te).attr("r",50)},O=a=>{const k="#"+Me(a);Q(k+"-text").transition().duration(te).attr("opacity",0),Q(k+"-rect").transition().duration(te).attr("opacity",0),Q(k+"-image").transition().duration(te).attr("width",l*2).attr("height",l*2).attr("x",-l).attr("y",-l),Q(k+"-circle").transition().duration(te).attr("r",l)},S=a=>{r(4,m=[]);for(const k of a){const v=o.filter(fe=>fe.artist===k)[0];m.push({x:v.x,y:v.y})}d=a,r(6,h+=1)},J=()=>{r(4,m=[]),d=[],r(6,h+=1)},H=a=>d.includes(a.source.artist)&&d.includes(a.target.artist),Y=a=>{N("display_influence",{artist:a})},K=()=>{N("reset_influences",{})},x=(a,k)=>{for(let v of a)v.x=0,v.y=z/2;_=a,F=Ze(k,v=>({source:v.artist,target:v.influenced})),r(2,o=_),c.postMessage({nodes:_,links:F,radius:l,height:z})},le=(a,k)=>p(a.artist),Z=(a,k)=>p(a.artist),$=(a,k)=>I(a.artist),D=(a,k)=>I(a.artist),B=(a,k)=>Y(a.artist);return t.$$set=a=>{"width"in a&&r(0,R=a.width),"height"in a&&r(1,z=a.height)},t.$$.update=()=>{t.$$.dirty[0]&2&&r(5,l=z/37)},r(2,o=[]),r(3,s=[]),r(4,m=[]),d=[],r(6,h=0),[R,z,o,s,m,l,h,L,p,I,H,Y,K,T,O,S,J,x,le,Z,$,D,B]}class at extends xe{constructor(i){super(),Pe(this,i,et,$e,Ue,{width:0,height:1,HighlightArtist:13,RestoreArtist:14,DisplayInfluence:15,ResetInfluences:16,Initialize:17},null,[-1,-1])}get HighlightArtist(){return this.$$.ctx[13]}get RestoreArtist(){return this.$$.ctx[14]}get DisplayInfluence(){return this.$$.ctx[15]}get ResetInfluences(){return this.$$.ctx[16]}get Initialize(){return this.$$.ctx[17]}}export{at as N};