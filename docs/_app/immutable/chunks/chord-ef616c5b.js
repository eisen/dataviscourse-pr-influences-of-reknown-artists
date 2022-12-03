import{S as ie,i as ne,s as re,k as se,P as Et,l as le,m as Dt,Q as qt,h as It,n as ut,p as Ot,b as oe,F as Ft,A as Vt,R as ae,O as ce}from"./index-8d2061e5.js";import{a as D,r as ue}from"./config-331e8422.js";import{C as fe,a as he}from"./helpers-c17ebcc8.js";import{s as b}from"./selectAll-237a4934.js";import{o as Qt}from"./ordinal-7966dd64.js";import{r as de}from"./range-cc563a65.js";import{g as Ut}from"./group-4b12f8cd.js";import{c as pt}from"./constant-b8884f20.js";import{a as Wt,c as mt,s as nt,h as Yt,p as Xt,e as Y,t as ge,b as Pt,m as Ht,d as Jt,f as V,g as Kt,i as pe,j as ye}from"./math-84088ecb.js";function be(d){return d.innerRadius}function me(d){return d.outerRadius}function xe(d){return d.startAngle}function ke(d){return d.endAngle}function _e(d){return d&&d.padAngle}function Oe(d,_,T,m,S,G,w,u){var O=T-d,l=m-_,H=w-S,k=u-G,n=k*O-H*l;if(!(n*n<Y))return n=(H*(_-G)-k*(d-S))/n,[d+n*O,_+n*l]}function Gt(d,_,T,m,S,G,w){var u=d-T,O=_-m,l=(w?G:-G)/Pt(u*u+O*O),H=l*O,k=-l*u,n=d+H,L=_+k,I=T+H,N=m+k,A=(n+I)/2,et=(L+N)/2,U=I-n,Q=N-L,J=U*U+Q*Q,c=S-G,h=n*N-I*L,X=(Q<0?-1:1)*Pt(ye(0,c*c*J-h*h)),B=(h*Q-U*X)/J,g=(-h*U-Q*X)/J,f=(h*Q+U*X)/J,p=(-h*U+Q*X)/J,e=B-A,y=g-et,st=f-A,lt=p-et;return e*e+y*y>st*st+lt*lt&&(B=f,g=p),{cx:B,cy:g,x01:-H,y01:-k,x11:B*(S/c-1),y11:g*(S/c-1)}}function Pe(){var d=be,_=me,T=pt(0),m=null,S=xe,G=ke,w=_e,u=null;function O(){var l,H,k=+d.apply(this,arguments),n=+_.apply(this,arguments),L=S.apply(this,arguments)-Yt,I=G.apply(this,arguments)-Yt,N=Jt(I-L),A=I>L;if(u||(u=l=Xt()),n<k&&(H=n,n=k,k=H),!(n>Y))u.moveTo(0,0);else if(N>ge-Y)u.moveTo(n*mt(L),n*nt(L)),u.arc(0,0,n,L,I,!A),k>Y&&(u.moveTo(k*mt(I),k*nt(I)),u.arc(0,0,k,I,L,A));else{var et=L,U=I,Q=L,J=I,c=N,h=N,X=w.apply(this,arguments)/2,B=X>Y&&(m?+m.apply(this,arguments):Pt(k*k+n*n)),g=Ht(Jt(n-k)/2,+T.apply(this,arguments)),f=g,p=g,e,y;if(B>Y){var st=Kt(B/k*nt(X)),lt=Kt(B/n*nt(X));(c-=st*2)>Y?(st*=A?1:-1,Q+=st,J-=st):(c=0,Q=J=(L+I)/2),(h-=lt*2)>Y?(lt*=A?1:-1,et+=lt,U-=lt):(h=0,et=U=(L+I)/2)}var ft=n*mt(et),ht=n*nt(et),xt=k*mt(J),ot=k*nt(J);if(g>Y){var at=n*mt(U),kt=n*nt(U),vt=k*mt(Q),_t=k*nt(Q),Z;if(N<Wt&&(Z=Oe(ft,ht,vt,_t,at,kt,xt,ot))){var Mt=ft-Z[0],wt=ht-Z[1],Rt=at-Z[0],Ct=kt-Z[1],Tt=1/nt(pe((Mt*Rt+wt*Ct)/(Pt(Mt*Mt+wt*wt)*Pt(Rt*Rt+Ct*Ct)))/2),St=Pt(Z[0]*Z[0]+Z[1]*Z[1]);f=Ht(g,(k-St)/(Tt-1)),p=Ht(g,(n-St)/(Tt+1))}}h>Y?p>Y?(e=Gt(vt,_t,ft,ht,n,p,A),y=Gt(at,kt,xt,ot,n,p,A),u.moveTo(e.cx+e.x01,e.cy+e.y01),p<g?u.arc(e.cx,e.cy,p,V(e.y01,e.x01),V(y.y01,y.x01),!A):(u.arc(e.cx,e.cy,p,V(e.y01,e.x01),V(e.y11,e.x11),!A),u.arc(0,0,n,V(e.cy+e.y11,e.cx+e.x11),V(y.cy+y.y11,y.cx+y.x11),!A),u.arc(y.cx,y.cy,p,V(y.y11,y.x11),V(y.y01,y.x01),!A))):(u.moveTo(ft,ht),u.arc(0,0,n,et,U,!A)):u.moveTo(ft,ht),!(k>Y)||!(c>Y)?u.lineTo(xt,ot):f>Y?(e=Gt(xt,ot,at,kt,k,-f,A),y=Gt(ft,ht,vt,_t,k,-f,A),u.lineTo(e.cx+e.x01,e.cy+e.y01),f<g?u.arc(e.cx,e.cy,f,V(e.y01,e.x01),V(y.y01,y.x01),!A):(u.arc(e.cx,e.cy,f,V(e.y01,e.x01),V(e.y11,e.x11),!A),u.arc(0,0,k,V(e.cy+e.y11,e.cx+e.x11),V(y.cy+y.y11,y.cx+y.x11),A),u.arc(y.cx,y.cy,f,V(y.y11,y.x11),V(y.y01,y.x01),!A))):u.arc(0,0,k,J,Q,A)}if(u.closePath(),l)return u=null,l+""||null}return O.centroid=function(){var l=(+d.apply(this,arguments)+ +_.apply(this,arguments))/2,H=(+S.apply(this,arguments)+ +G.apply(this,arguments))/2-Wt/2;return[mt(H)*l,nt(H)*l]},O.innerRadius=function(l){return arguments.length?(d=typeof l=="function"?l:pt(+l),O):d},O.outerRadius=function(l){return arguments.length?(_=typeof l=="function"?l:pt(+l),O):_},O.cornerRadius=function(l){return arguments.length?(T=typeof l=="function"?l:pt(+l),O):T},O.padRadius=function(l){return arguments.length?(m=l==null?null:typeof l=="function"?l:pt(+l),O):m},O.startAngle=function(l){return arguments.length?(S=typeof l=="function"?l:pt(+l),O):S},O.endAngle=function(l){return arguments.length?(G=typeof l=="function"?l:pt(+l),O):G},O.padAngle=function(l){return arguments.length?(w=typeof l=="function"?l:pt(+l),O):w},O.context=function(l){return arguments.length?(u=l==null?null:l,O):u},O}function ve(d){let _,T,m,S,G;return{c(){_=se("div"),T=Et("svg"),m=Et("g"),this.h()},l(w){_=le(w,"DIV",{id:!0,class:!0,style:!0});var u=Dt(_);T=qt(u,"svg",{class:!0,viewBox:!0,preserveAspectRatio:!0});var O=Dt(T);m=qt(O,"g",{id:!0,transform:!0}),Dt(m).forEach(It),O.forEach(It),u.forEach(It),this.h()},h(){ut(m,"id","chordViz"),ut(m,"transform",S="translate("+d[0]/2+", "+d[1]/2+")"),ut(T,"class","inline-block absolute top-0 left-0"),ut(T,"viewBox",G="0, 0, "+d[0]+", "+d[1]),ut(T,"preserveAspectRatio","xMidYMid meet"),ut(_,"id","container"),ut(_,"class","inline-block relative align-top overflow-hidden"),Ot(_,"width",d[0]+"px"),Ot(_,"height",d[1]+"px"),Ot(_,"top",(d[2]>50?50:d[2]*.9)+"px")},m(w,u){oe(w,_,u),Ft(_,T),Ft(T,m),d[17](m)},p(w,u){u[0]&3&&S!==(S="translate("+w[0]/2+", "+w[1]/2+")")&&ut(m,"transform",S),u[0]&3&&G!==(G="0, 0, "+w[0]+", "+w[1])&&ut(T,"viewBox",G),u[0]&1&&Ot(_,"width",w[0]+"px"),u[0]&2&&Ot(_,"height",w[1]+"px"),u[0]&4&&Ot(_,"top",(w[2]>50?50:w[2]*.9)+"px")},i:Vt,o:Vt,d(w){w&&It(_),d[17](null)}}}let v=250;const W=250,rt=450;function Me(d,_,T){let m,S,G,w,u,O;const l=ae();let{width:H}=_,{height:k}=_,{grouping:n}=_,{topOffset:L}=_,I,N,A,et=["sculptor","painter","printmaker","draughtsman","photography","film","watercolourist","oilpainter","illustrator","muralist","architect","ink","ceramicist","calligrapher","engraving"],U=["illness","alive","suicide","no-mention","heartattack","heartattack-overdose-probably","natural","accident","murder"],Q=["1000","1100","1200","1300","1400","1500","1600","1700","1800","1900"],J=["1000","1100","1200","1300","1400","1500","1600","1700","1800","1900","2000"],c=[],h=[],X,B,g="",f=[],p=[],e=[],y;function st(s){var R,C=S*.9125,M=s.startAngle*180/Math.PI-90,i=s.endAngle*180/Math.PI-90,a=null;a||(a=R=Xt()),a.moveTo(C*Math.cos(M*Math.PI/180),C*Math.sin(M*Math.PI/180)),a.arc(0,0,C,M*Math.PI/180,i*Math.PI/180);let E,yt=i>0&&i<90||i<-90&&i>-180?.4:1.1;E=180-90-(90-(Math.abs(i-M)*yt+M));let zt=C*Math.sin(E*Math.PI/180),jt=C*Math.cos(E*Math.PI/180),r=zt/2+Math.abs(i-M)*.1*5,t=-1;i>-90&&i<90?t=Math.abs(i-M)*.1*10:t=-1*(Math.abs(i-M)*.1*10);let x=jt/2+t,z,o=i>0&&i<90||i<-90&&i>-180?1.1:.4;z=180-90-(90-(i-Math.abs(i-M)*o));let P=C*Math.sin(z*Math.PI/180),j=C*Math.cos(z*Math.PI/180),q=P/2+Math.abs(i-M)*.1*5,it=-1;i>-90&&i<90?it=Math.abs(i-M)*.05*10:it=-1*(Math.abs(i-M)*.2*10);let At=j/2+it,dt=[];for(let ct=0;ct<h.length;ct++)dt.push(ct*((m*2+.06*m)/h.length)-m*.9125);if(a.quadraticCurveTo(x,r,s.half==0?w/2:-w/2,dt[s.vertIdx]),a.quadraticCurveTo(At,q,C*Math.cos(M*Math.PI/180),C*Math.sin(M*Math.PI/180)),R)return a=null,R+""||null}const lt=(s,R,C)=>{l("highlight_chord_ribbon",{chordGroup:s,chordIdx:R,chordTime:C})},ft=(s,R)=>{l("restore_chord_ribbon",{chordGroup:s,chordIdx:R})},ht=(s,R)=>{l("highlight_chord_group",{chordGroup:s,chordTimeNum:R})},xt=s=>{l("restore_chord_group",{chordGroup:s})},ot=(s,R)=>{l("highlight_chord_button",{chordTime:s,chordGroups:R})},at=s=>{l("restore_chord_button",{chordTime:s})},kt=s=>{l("click_chord_by_arc",{chordGroup:s})},vt=(s,R)=>{l("click_chord_by_ribbon",{chordGroup:s,chordTime:R})},_t=(s,R)=>{l("click_chord_by_century",{chordTime:s,chordGroups:R})},Z=s=>{p[c.indexOf(s)]=!p[c.indexOf(s)]},Mt=(s,R)=>{},wt=(s,R)=>{},Rt=(s,R)=>{let C=[],M=Number(g)/100-10;for(let i=0;i<e.length;i++)e[i].groups[M]>0&&C.push(e[i].slice);f[R]?(b(".arcPaths"+n).transition().duration(W).style("opacity",(i,a)=>C.indexOf(i.slice)==-1&&p[c.indexOf(i.slice)]==!1?.4:1).style("stroke",(i,a)=>p[c.indexOf(i.slice)]==!1?"white":"#cf8217").style("stroke-width",1),b("#arc_"+s).transition().duration(W).style("opacity",1).style("stroke","#cf8217"),b(".ribbonPaths"+n).transition().duration(W).style("opacity",(i,a)=>y(i.cent)==g?.95:.1),b(".ribbonPaths_"+s).transition().duration(W).style("opacity",(i,a)=>y(i.cent)==g?.95:.5)):(b(".ribbonPaths"+n).transition().duration(W).style("opacity",(i,a)=>f[i.cent]?.95:.1),b(".ribbonPaths_"+s).transition().duration(W).style("opacity",.95),b(".arcPaths"+n).transition().duration(W).style("opacity",(i,a)=>C.indexOf(i.slice)==-1&&p[c.indexOf(i.slice)]==!1?.4:1).style("stroke",(i,a)=>p[c.indexOf(i.slice)]==!1?"white":"#cf8217").style("stroke-width",1),b("#arc_"+s).transition().duration(W).style("opacity",1).style("stroke","#cf8217"))},Ct=(s,R)=>{let C=[],M=Number(g)/100-10;for(let i=0;i<e.length;i++)e[i].groups[M]>0&&C.push(e[i].slice);f[R]?(b(".ribbonPaths_"+s).transition().duration(rt).style("opacity",(i,a)=>y(i.cent)==g?.95:.1),b(".arcPaths"+n).transition().duration(rt).style("opacity",(i,a)=>C.indexOf(i.slice)==-1&&p[c.indexOf(i.slice)]==!1?.4:1).style("stroke",(i,a)=>p[c.indexOf(i.slice)]==!1?"white":"#cf8217").style("stroke-width",1)):(b(".ribbonPaths"+n).transition().duration(rt).style("opacity",function(i,a){return f.includes(!0)?f[i.cent]?.95:.1:.5}),f.includes(!0)?b(".arcPaths"+n).transition().duration(rt).style("opacity",(i,a)=>C.indexOf(i.slice)==-1&&p[c.indexOf(i.slice)]==!1?.4:1).style("stroke",(i,a)=>p[c.indexOf(i.slice)]==!1?"white":"#cf8217").style("stroke-width",1):b(".arcPaths"+n).transition().duration(rt).style("opacity",(i,a)=>1).style("stroke",(i,a)=>p[c.indexOf(i.slice)]==!1?"white":"#cf8217").style("stroke-width",1))},Tt=(s,R)=>{let C=[],M=Number(g)/100-10;for(let i=0;i<e.length;i++)e[i].groups[M]>0&&C.push(e[i].slice);for(let i=0;i<h.length;i++)g!=h[i]&&b(".ribbonPaths_"+h[i]+"_"+n).transition().duration(W).style("opacity",.1);for(let i=0;i<c.length;i++)C.indexOf(c[i])==-1&&b("#arc_"+c[i]).transition().duration(W).style("opacity",(a,E)=>p[c.indexOf(a.slice)]==!1?.4:1).style("stroke",(a,E)=>p[c.indexOf(a.slice)]==!1?"white":"#cf8217").style("stroke-width",1);b(".ribbonPaths_"+s).transition().duration(W).style("opacity",(i,a)=>y(i.cent)==g?.95:.5),b("#r_"+s+"_"+R).transition().duration(W).style("opacity",.95),b("#arc_"+s).transition().duration(W).style("opacity",1).style("stroke",(i,a)=>p[c.indexOf(i.slice)]==!1?"white":"#cf8217").style("stroke-width",1)},St=(s,R,C)=>{let M=[],i=Number(g)/100-10;for(let a=0;a<e.length;a++)e[a].groups[i]>0&&M.push(e[a].slice);if(!f[C])f.includes(!0)?(b(".ribbonPaths"+n).transition().duration(rt).style("opacity",(a,E)=>f[a.cent]?.95:.1),b(".arcPaths"+n).transition().duration(rt).style("opacity",function(a,E){return M.includes(a.slice)||p[c.indexOf(a.slice)]==!0?1:.4}).style("stroke",(a,E)=>p[c.indexOf(a.slice)]==!1?"white":"#cf8217").style("stroke-width",1)):(b(".ribbonPaths"+n).transition().duration(rt).style("opacity",(a,E)=>.5),b(".arcPaths"+n).transition().duration(rt).style("opacity",1).style("stroke",(a,E)=>p[c.indexOf(a.slice)]==!1?"white":"#cf8217").style("stroke-width",1));else{b(".ribbonPaths_"+s).transition().duration(rt).style("opacity",(a,E)=>y(a.cent)==g?.95:.1);for(let a=0;a<c.length;a++)M.indexOf(c[a])==-1&&b("#arc_"+c[a]).transition().duration(W).style("opacity",(E,yt)=>p[c.indexOf(E.slice)]==!1?.4:1).style("stroke",(E,yt)=>p[c.indexOf(E.slice)]==!1?"white":"#cf8217").style("stroke-width",1)}},Zt=(s,R)=>{},$t=s=>{},te=(s,R)=>{if(s&&R){n=="Medium"?(c=et,X=fe,h=Q):(c=U,X=he,h=J),f=new Array(h.length).fill(!1),p=new Array(c.length).fill(!1),B=new Array(h.length).fill(!1);let C=Qt().domain(c).range(X);y=Qt().domain(de(h.length)).range(h);for(let r=0;r<c.length;r++)e.push({slice:c[r],groups:new Array(h.length).fill(0)});A=Ut(R,r=>r.artist),N=Ut(s,r=>r.artist);let M=[],i=!1;for(let r=0;r<N.length;r++){i=!1;for(let t=0;t<A.length;t++)if(A[t][0]==N[r][0]){M=A[t][1],i=!0;break}if(i){for(let t=0;t<M.length;t++)for(let x=0;x<e.length;x++)if(n=="Medium"){if(e[x].slice==M[t].medium){e[x].groups[Math.floor(Number(N[r][1][0].year)/100)-10]+=1,B[Math.floor(Number(N[r][1][0].year)/100)-10]=!0;break}}else if(e[x].slice==M[t].death_type)if(N[r][1].length>1){e[x].groups[Math.floor(Number(N[r][1][1].year)/100)-10]+=1,B[Math.floor(Number(N[r][1][1].year)/100)-10]=!0;break}else{e[x].groups[Math.floor(Number(N[r][1][0].year)/100)-10]+=1,B[Math.floor(Number(N[r][1][0].year)/100)-10]=!0;break}}}let a=0;for(let r=0;r<e.length;r++)for(let t=0;t<e[r].groups.length;t++)a+=e[r].groups[t];let E=Pe().innerRadius(S*.925).outerRadius(S).cornerRadius(3);D(I).datum(function(r,t){e.sort(function(F,tt){let K=0,gt=0;for(let bt=0;bt<F.groups.length;bt++)K+=F.groups[bt];for(let bt=0;bt<tt.groups.length;bt++)gt+=tt.groups[bt];return K>gt?1:gt>K?-1:0});let x=[],z=e.length,o=G*Math.PI/180,q=2*G*Math.PI/180/a,it=m/270*.02,At=-1,dt=(Math.PI-o)/2,ct=(Math.PI-o)/2,Lt=0,Bt=!1,Nt=0,$=!1;for(let F=0;F<z;F++){At++,$=!0;for(let tt=0;tt<e[F].groups.length;tt++)if(e[F].groups[tt]>0){let K=e[F].groups[tt];if(Lt+=q*K,Lt<G*Math.PI/180)x.push({startAngle:$&&F>0?it+dt:dt,endAngle:$&&F>0?it+q*K+dt:q*K+dt,vertIdx:tt,colorIndex:At,half:0,cent:tt,addLabel:!!$,slice:e[F].slice,defIndex:Nt}),dt+=$&&F>0?it+q*K:q*K;else{let gt=2*Math.PI;x.push({startAngle:$&&F>0?gt-it-q*K-ct:gt-q*K-ct,endAngle:$&&F>0?gt-it-ct:gt-ct,vertIdx:tt,colorIndex:At,half:1,cent:tt,addLabel:!!($||!Bt),slice:e[F].slice,defIndex:Nt}),Bt||(Bt=!0),ct+=$&&F>0?it+q*K:q*K}$&&($=!1),Nt++}}return x}),D(I).append("g").attr("class","ribbons").selectAll("path").data(r=>r).enter().append("path").attr("d",st).style("fill",function(r){return C(r.slice)}).style("stroke",(r,t)=>ue(C(r.slice)).darker()).style("stroke-width",1).attr("id",(r,t)=>"r_"+r.slice+"_"+t).attr("class",function(r,t){return"ribbonPaths_"+r.slice+" ribbonPaths_"+y(r.cent)+"_"+n}).classed("ribbonPaths"+n,!0).style("opacity",.5).on("mouseover",function(r,t){lt(t.slice,t.defIndex,y(t.cent))}).on("mouseout",(r,t)=>ft(t.slice,t.defIndex,t.cent)).on("click",(r,t)=>vt(t.slice,y(t.cent)));let yt=D(I).append("g").attr("class","groups").selectAll("g").data(r=>r).enter().append("g");yt.append("path").style("fill",function(r,t){return C(r.slice)}).style("stroke","white").attr("d",E).attr("id",(r,t)=>"arc_"+r.slice).attr("class",(r,t)=>"arcPaths_"+y(r.cent)).classed("arcPaths"+n,!0).classed("cursor-pointer",!0).on("mouseover",(r,t)=>ht(t.slice,t.cent)).on("mouseout",(r,t)=>xt(t.slice,t.cent)).on("click",(r,t)=>kt(t.slice)),yt.append("rect").data(h).classed("cursor-pointer",(r,t)=>B[t]).classed("cursor-not-allowed",(r,t)=>!B[t]).attr("x",-1*w/2).attr("y",(r,t)=>t*((m*2+.05*m)/h.length)-m*.9-.05*m).attr("rx",6).attr("ry",6).attr("width",w).attr("height",.1*m).attr("fill","#00005C").attr("opacity",1).on("mouseover",function(r,t){let x=[],z=[],o=Number(t)/100-10;for(let P=0;P<e.length;P++)e[P].groups[o]>0&&x.push(e[P].slice),e[P].groups[h.indexOf(g)]>0&&z.push(e[P].slice);if(f[h.indexOf(t)])g==t&&ot(t,x);else{let P=B[h.indexOf(t)];D(this).transition().duration(v).attr("fill",P?"#cf8217":"#00005C"),b(".ribbonPaths"+n).transition().duration(v).style("opacity",function(j,q){return f[j.cent]?.95:.1}),b(".ribbonPaths_"+t+"_"+n).transition().duration(v).style("opacity",.95),b(".arcPaths"+n).transition().duration(v).style("opacity",function(j,q){return x.includes(j.slice)||z.includes(j.slice)||p[c.indexOf(j.slice)]==!0?1:.4}).style("stroke",(j,q)=>p[c.indexOf(j.slice)]==!1?"white":"#cf8217"),ot(t,x)}}).on("mouseout",function(r,t){if(f[h.indexOf(t)])g==t&&at(t);else{D(this).transition().duration(v).attr("fill","#00005C"),b(".ribbonPaths"+n).transition().duration(v).style("opacity",function(o,P){return f.includes(!0)?f[o.cent]?.95:.1:.5});let x=[],z=Number(g)/100-10;for(let o=0;o<e.length;o++)e[o].groups[z]>0&&x.push(e[o].slice);f.includes(!0)?b(".arcPaths"+n).transition().duration(v).style("opacity",(o,P)=>x.indexOf(o.slice)==-1&&p[c.indexOf(o.slice)]==!1?.4:1).style("stroke",(o,P)=>p[c.indexOf(o.slice)]==!1?"white":"#cf8217"):b(".arcPaths"+n).transition().duration(v).style("opacity",(o,P)=>1).style("stroke",(o,P)=>p[c.indexOf(o.slice)]==!1?"white":"#cf8217"),at(t)}}).on("click",function(r,t){if(B[h.indexOf(t)]){let x=[],z=Number(t)/100-10;for(let o=0;o<e.length;o++)e[o].groups[z]>0&&x.push(e[o].slice);_t(t,x),f[h.indexOf(t)]?(D(this).transition().duration(v).attr("fill","#cf8217"),D("#centText_"+t+"_"+n).transition().duration(v).attr("fill","white"),f[h.indexOf(t)]=!1,g=""):(D(this).transition().duration(v).attr("fill","#3C1900"),D("#centText_"+t+"_"+n).transition().duration(v).attr("fill","#cf8217"),f.includes(!0)&&(D("#centRect_"+g+"_"+n).transition().duration(v).attr("fill","#00005C"),D("#centText_"+g+"_"+n).transition().duration(v).attr("fill","white")),g!=""&&(f[h.indexOf(g)]=!1),f[h.indexOf(t)]=!0,g=t,b(".ribbonPaths"+n).transition().duration(v).style("opacity",function(o,P){return f[o.cent]?.95:.1}),b(".arcPaths"+n).transition().duration(v).style("opacity",(o,P)=>x.includes(o.slice)||p[c.indexOf(o.slice)]==!0?1:.4))}}).classed("centRect"+n,!0).attr("id",(r,t)=>"centRect_"+r+"_"+n),yt.append("text").data(h).classed("cursor-pointer",(r,t)=>B[t]).classed("cursor-not-allowed",(r,t)=>!B[t]).attr("x",0).attr("y",(r,t)=>t*((m*2+.05*m)/h.length)-m*.88).attr("fill","white").style("text-anchor","middle").style("font-size",u).text(function(r){return String(Number(r)/100+1)}).classed("centText",!0).attr("id",(r,t)=>"centText_"+r+"_"+n).on("mouseover",function(r,t){let x=[],z=[],o=Number(t)/100-10;for(let P=0;P<e.length;P++)e[P].groups[o]>0&&x.push(e[P].slice),e[P].groups[h.indexOf(g)]>0&&z.push(e[P].slice);if(f[h.indexOf(t)])g==t&&ot(t,x);else{let P=B[h.indexOf(t)];D("#centRect_"+t+"_"+n).transition().duration(v).attr("fill",P?"#cf8217":"#00005C"),b(".ribbonPaths"+n).transition().duration(v).style("opacity",function(j,q){return f[j.cent]?.95:.1}),b(".ribbonPaths_"+t+"_"+n).transition().duration(v).style("opacity",.95),b(".arcPaths"+n).transition().duration(v).style("opacity",function(j,q){return x.includes(j.slice)||z.includes(j.slice)||p[c.indexOf(j.slice)]==!0?1:.4}).style("stroke",(j,q)=>p[c.indexOf(j.slice)]==!1?"white":"#cf8217"),ot(t,x)}}).on("mouseout",function(r,t){if(f[h.indexOf(t)])g==t&&at(t);else{D("#centRect_"+t+"_"+n).transition().duration(v).attr("fill","#00005C"),b(".ribbonPaths"+n).transition().duration(v).style("opacity",function(o,P){return f.includes(!0)?f[o.cent]?.95:.1:.5});let x=[],z=Number(g)/100-10;for(let o=0;o<e.length;o++)e[o].groups[z]>0&&x.push(e[o].slice);f.includes(!0)?b(".arcPaths"+n).transition().duration(v).style("opacity",(o,P)=>x.indexOf(o.slice)==-1&&p[c.indexOf(o.slice)]==!1?.4:1):b(".arcPaths"+n).transition().duration(v).style("opacity",(o,P)=>1),at(t)}}).on("click",function(r,t){if(B[h.indexOf(t)]){let x=[],z=Number(t)/100-10;for(let o=0;o<e.length;o++)e[o].groups[z]>0&&x.push(e[o].slice);_t(t,x),f[h.indexOf(t)]?(D(this).transition().duration(v).attr("fill","white"),D("#centRect_"+t+"_"+n).transition().duration(v).attr("fill","#cf8217"),f[h.indexOf(t)]=!1,g=""):(D("#centRect_"+t+"_"+n).transition().duration(v).attr("fill","#3C1900"),D(this).transition().duration(v).attr("fill","#cf8217"),f.includes(!0)&&(D("#centRect_"+g+"_"+n).transition().duration(v).attr("fill","#00005C"),D("#centText_"+g+"_"+n).transition().duration(v).attr("fill","white")),g!=""&&(f[h.indexOf(g)]=!1),f[h.indexOf(t)]=!0,g=t,b(".ribbonPaths"+n).transition().duration(v).style("opacity",function(o,P){return f[o.cent]?.95:.1}),b(".arcPaths"+n).transition().duration(v).style("opacity",function(o,P){return x.includes(o.slice)||p[c.indexOf(o.slice)]==!0?1:.4}))}}).append("tspan").attr("baseline-shift","super").attr("font-size",u*.6).text(function(r,t){return r=="2000"?"ST":"TH"}),D(I).append("g").attr("class","groups").append("text").attr("x",0).attr("y",m/270*-270+5).style("text-anchor","middle").style("font-size",O>20?20:O).text("Distribution of Artists by "+n+" Over Centuries")}else console.error("Unable to load Artist Locations!")};function ee(s){ce[s?"unshift":"push"](()=>{I=s,T(3,I)})}return d.$$set=s=>{"width"in s&&T(0,H=s.width),"height"in s&&T(1,k=s.height),"grouping"in s&&T(4,n=s.grouping),"topOffset"in s&&T(2,L=s.topOffset)},d.$$.update=()=>{d.$$.dirty[0]&2&&T(15,m=k*.45>275?275:k*.45),d.$$.dirty[0]&1&&T(16,S=H*.45>390?390:H*.45),d.$$.dirty[0]&32768&&(G=m/270*90-10),d.$$.dirty[0]&65536&&(w=S/370*120),d.$$.dirty[0]&98307&&(u=k<=H?m/270*15:S/370*15),d.$$.dirty[0]&98307&&(O=k<=H?m/170*20:S/270*20)},N=[],A=[],[H,k,L,I,n,Z,Mt,wt,Rt,Ct,Tt,St,Zt,$t,te,m,S,ee]}class Ne extends ie{constructor(_){super(),ne(this,_,Me,ve,re,{width:0,height:1,grouping:4,topOffset:2,ClickGrouping:5,ClickRibbon:6,ClickButton:7,HighlightGrouping:8,RestoreGrouping:9,HighlightRibbon:10,RestoreRibbon:11,HighlightButton:12,RestoreButton:13,Initialize:14},null,[-1,-1])}get ClickGrouping(){return this.$$.ctx[5]}get ClickRibbon(){return this.$$.ctx[6]}get ClickButton(){return this.$$.ctx[7]}get HighlightGrouping(){return this.$$.ctx[8]}get RestoreGrouping(){return this.$$.ctx[9]}get HighlightRibbon(){return this.$$.ctx[10]}get RestoreRibbon(){return this.$$.ctx[11]}get HighlightButton(){return this.$$.ctx[12]}get RestoreButton(){return this.$$.ctx[13]}get Initialize(){return this.$$.ctx[14]}}export{Ne as C};
