import{S as wt,i as Tt,s as Rt,k as Ct,O as yt,l as kt,m as ct,P as Mt,h as st,n as J,p as lt,b as zt,F as xt,A as At,N as St}from"./index-cc78b405.js";import{r as Lt}from"./config-2227fd0b.js";import{o as _t}from"./ordinal-ceb38b17.js";import{r as vt}from"./init-08c38208.js";import{g as bt}from"./group-d3aa616c.js";import{s as ot}from"./select-4d4fd839.js";const dt=Math.PI,gt=2*dt,at=1e-6,qt=gt-at;function pt(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function mt(){return new pt}pt.prototype=mt.prototype={constructor:pt,moveTo:function(t,r){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+r)},closePath:function(){this._x1!==null&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,r){this._+="L"+(this._x1=+t)+","+(this._y1=+r)},quadraticCurveTo:function(t,r,l,a){this._+="Q"+ +t+","+ +r+","+(this._x1=+l)+","+(this._y1=+a)},bezierCurveTo:function(t,r,l,a,h,m){this._+="C"+ +t+","+ +r+","+ +l+","+ +a+","+(this._x1=+h)+","+(this._y1=+m)},arcTo:function(t,r,l,a,h){t=+t,r=+r,l=+l,a=+a,h=+h;var m=this._x1,p=this._y1,i=l-t,u=a-r,n=m-t,M=p-r,o=n*n+M*M;if(h<0)throw new Error("negative radius: "+h);if(this._x1===null)this._+="M"+(this._x1=t)+","+(this._y1=r);else if(o>at)if(!(Math.abs(M*i-u*n)>at)||!h)this._+="L"+(this._x1=t)+","+(this._y1=r);else{var c=l-m,b=a-p,T=i*i+u*u,R=c*c+b*b,g=Math.sqrt(T),D=Math.sqrt(o),x=h*Math.tan((dt-Math.acos((T+o-R)/(2*g*D)))/2),P=x/D,k=x/g;Math.abs(P-1)>at&&(this._+="L"+(t+P*n)+","+(r+P*M)),this._+="A"+h+","+h+",0,0,"+ +(M*c>n*b)+","+(this._x1=t+k*i)+","+(this._y1=r+k*u)}},arc:function(t,r,l,a,h,m){t=+t,r=+r,l=+l,m=!!m;var p=l*Math.cos(a),i=l*Math.sin(a),u=t+p,n=r+i,M=1^m,o=m?a-h:h-a;if(l<0)throw new Error("negative radius: "+l);this._x1===null?this._+="M"+u+","+n:(Math.abs(this._x1-u)>at||Math.abs(this._y1-n)>at)&&(this._+="L"+u+","+n),l&&(o<0&&(o=o%gt+gt),o>qt?this._+="A"+l+","+l+",0,1,"+M+","+(t-p)+","+(r-i)+"A"+l+","+l+",0,1,"+M+","+(this._x1=u)+","+(this._y1=n):o>at&&(this._+="A"+l+","+l+",0,"+ +(o>=dt)+","+M+","+(this._x1=t+l*Math.cos(h))+","+(this._y1=r+l*Math.sin(h))))},rect:function(t,r,l,a){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+r)+"h"+ +l+"v"+ +a+"h"+-l+"Z"},toString:function(){return this._}};function $(t){return function(){return t}}const It=Math.abs,S=Math.atan2,nt=Math.cos,Et=Math.max,ft=Math.min,Z=Math.sin,rt=Math.sqrt,B=1e-12,it=Math.PI,ut=it/2,Bt=2*it;function Dt(t){return t>1?0:t<-1?it:Math.acos(t)}function Pt(t){return t>=1?ut:t<=-1?-ut:Math.asin(t)}function jt(t){return t.innerRadius}function Gt(t){return t.outerRadius}function Nt(t){return t.startAngle}function Ft(t){return t.endAngle}function Ht(t){return t&&t.padAngle}function Ot(t,r,l,a,h,m,p,i){var u=l-t,n=a-r,M=p-h,o=i-m,c=o*u-M*n;if(!(c*c<B))return c=(M*(r-m)-o*(t-h))/c,[t+c*u,r+c*n]}function ht(t,r,l,a,h,m,p){var i=t-l,u=r-a,n=(p?m:-m)/rt(i*i+u*u),M=n*u,o=-n*i,c=t+M,b=r+o,T=l+M,R=a+o,g=(c+T)/2,D=(b+R)/2,x=T-c,P=R-b,k=x*x+P*P,U=h-m,N=c*R-T*b,I=(P<0?-1:1)*rt(Et(0,U*U*k-N*N)),L=(N*P-x*I)/k,_=(-N*x-P*I)/k,A=(N*P+x*I)/k,f=(-N*x+P*I)/k,s=L-g,d=_-D,e=A-g,v=f-D;return s*s+d*d>e*e+v*v&&(L=A,_=f),{cx:L,cy:_,x01:-M,y01:-o,x11:L*(h/U-1),y11:_*(h/U-1)}}function Vt(){var t=jt,r=Gt,l=$(0),a=null,h=Nt,m=Ft,p=Ht,i=null;function u(){var n,M,o=+t.apply(this,arguments),c=+r.apply(this,arguments),b=h.apply(this,arguments)-ut,T=m.apply(this,arguments)-ut,R=It(T-b),g=T>b;if(i||(i=n=mt()),c<o&&(M=c,c=o,o=M),!(c>B))i.moveTo(0,0);else if(R>Bt-B)i.moveTo(c*nt(b),c*Z(b)),i.arc(0,0,c,b,T,!g),o>B&&(i.moveTo(o*nt(T),o*Z(T)),i.arc(0,0,o,T,b,g));else{var D=b,x=T,P=b,k=T,U=R,N=R,I=p.apply(this,arguments)/2,L=I>B&&(a?+a.apply(this,arguments):rt(o*o+c*c)),_=ft(It(c-o)/2,+l.apply(this,arguments)),A=_,f=_,s,d;if(L>B){var e=Pt(L/o*Z(I)),v=Pt(L/c*Z(I));(U-=e*2)>B?(e*=g?1:-1,P+=e,k-=e):(U=0,P=k=(b+T)/2),(N-=v*2)>B?(v*=g?1:-1,D+=v,x-=v):(N=0,D=x=(b+T)/2)}var y=c*nt(D),z=c*Z(D),Y=o*nt(k),Q=o*Z(k);if(_>B){var W=c*nt(x),tt=c*Z(x),q=o*nt(P),F=o*Z(P),C;if(R<it&&(C=Ot(y,z,q,F,W,tt,Y,Q))){var j=y-C[0],H=z-C[1],X=W-C[0],O=tt-C[1],E=1/Z(Dt((j*X+H*O)/(rt(j*j+H*H)*rt(X*X+O*O)))/2),w=rt(C[0]*C[0]+C[1]*C[1]);A=ft(_,(o-w)/(E-1)),f=ft(_,(c-w)/(E+1))}}N>B?f>B?(s=ht(q,F,y,z,c,f,g),d=ht(W,tt,Y,Q,c,f,g),i.moveTo(s.cx+s.x01,s.cy+s.y01),f<_?i.arc(s.cx,s.cy,f,S(s.y01,s.x01),S(d.y01,d.x01),!g):(i.arc(s.cx,s.cy,f,S(s.y01,s.x01),S(s.y11,s.x11),!g),i.arc(0,0,c,S(s.cy+s.y11,s.cx+s.x11),S(d.cy+d.y11,d.cx+d.x11),!g),i.arc(d.cx,d.cy,f,S(d.y11,d.x11),S(d.y01,d.x01),!g))):(i.moveTo(y,z),i.arc(0,0,c,D,x,!g)):i.moveTo(y,z),!(o>B)||!(U>B)?i.lineTo(Y,Q):A>B?(s=ht(Y,Q,W,tt,o,-A,g),d=ht(y,z,q,F,o,-A,g),i.lineTo(s.cx+s.x01,s.cy+s.y01),A<_?i.arc(s.cx,s.cy,A,S(s.y01,s.x01),S(d.y01,d.x01),!g):(i.arc(s.cx,s.cy,A,S(s.y01,s.x01),S(s.y11,s.x11),!g),i.arc(0,0,o,S(s.cy+s.y11,s.cx+s.x11),S(d.cy+d.y11,d.cx+d.x11),g),i.arc(d.cx,d.cy,A,S(d.y11,d.x11),S(d.y01,d.x01),!g))):i.arc(0,0,o,k,P,g)}if(i.closePath(),n)return i=null,n+""||null}return u.centroid=function(){var n=(+t.apply(this,arguments)+ +r.apply(this,arguments))/2,M=(+h.apply(this,arguments)+ +m.apply(this,arguments))/2-it/2;return[nt(M)*n,Z(M)*n]},u.innerRadius=function(n){return arguments.length?(t=typeof n=="function"?n:$(+n),u):t},u.outerRadius=function(n){return arguments.length?(r=typeof n=="function"?n:$(+n),u):r},u.cornerRadius=function(n){return arguments.length?(l=typeof n=="function"?n:$(+n),u):l},u.padRadius=function(n){return arguments.length?(a=n==null?null:typeof n=="function"?n:$(+n),u):a},u.startAngle=function(n){return arguments.length?(h=typeof n=="function"?n:$(+n),u):h},u.endAngle=function(n){return arguments.length?(m=typeof n=="function"?n:$(+n),u):m},u.padAngle=function(n){return arguments.length?(p=typeof n=="function"?n:$(+n),u):p},u.context=function(n){return arguments.length?(i=n==null?null:n,u):i},u}function Ut(t){let r,l,a,h,m;return{c(){r=Ct("div"),l=yt("svg"),a=yt("g"),this.h()},l(p){r=kt(p,"DIV",{id:!0,class:!0,style:!0});var i=ct(r);l=Mt(i,"svg",{class:!0,viewBox:!0,preserveAspectRatio:!0});var u=ct(l);a=Mt(u,"g",{id:!0,transform:!0}),ct(a).forEach(st),u.forEach(st),i.forEach(st),this.h()},h(){J(a,"id","chordViz"),J(a,"transform",h="translate("+t[0]/2+", "+t[2]*1.1+")"),J(l,"class","inline-block absolute top-0 left-0"),J(l,"viewBox",m="0, 0, "+t[0]+", "+t[1]),J(l,"preserveAspectRatio","xMidYMid meet"),J(r,"id","container"),J(r,"class","inline-block relative align-top overflow-hidden"),lt(r,"width",t[0]+"px"),lt(r,"height",t[1]+"px")},m(p,i){zt(p,r,i),xt(r,l),xt(l,a),t[6](a)},p(p,[i]){i&5&&h!==(h="translate("+p[0]/2+", "+p[2]*1.1+")")&&J(a,"transform",h),i&3&&m!==(m="0, 0, "+p[0]+", "+p[1])&&J(l,"viewBox",m),i&1&&lt(r,"width",p[0]+"px"),i&2&&lt(r,"height",p[1]+"px")},i:At,o:At,d(p){p&&st(r),t[6](null)}}}let Yt="Century",Zt="Artistic Mediums";function Qt(t,r,l){let a,h,m,p,i,u,{width:n}=r,{height:M}=r,o,c,b,T=["rgb(211, 157, 69)","#ff69b4","#ffe4c4","rgb(20, 57, 59)","rgb(163, 0, 48)","rgb(222, 182, 254)","#1e90ff","#00ff00","#7624C2","rgb(195, 72, 54)","rgb(52, 25, 58)","rgb(252, 179, 75)"],R=["sculptor","painter","printmaker","draughtsman","photography","film","watercolourist","oilpainter","illustrator","muralist","architect","ink","ceramicist","calligrapher","engraving"],g=R.length,D=_t().domain(R).range(vt(g)),x=[{cent:1e3,people:[],nums:[1],death:[0],meds:new Array(g).fill(0)},{cent:1100,people:[],nums:[1],death:[1],meds:new Array(g).fill(0)},{cent:1200,people:[],nums:[1],death:[2],meds:new Array(g).fill(0)},{cent:1300,people:[],nums:[1],death:[3],meds:new Array(g).fill(0)},{cent:1400,people:[],nums:[1],death:[4],meds:new Array(g).fill(0)},{cent:1500,people:[],nums:[1],death:[0],meds:new Array(g).fill(0)},{cent:1600,people:[],nums:[1],death:[1],meds:new Array(g).fill(0)},{cent:1700,people:[],nums:[1],death:[2],meds:new Array(g).fill(0)},{cent:1800,people:[],nums:[1],death:[3],meds:new Array(g).fill(0)},{cent:1900,people:[],nums:[1],death:[4],meds:new Array(g).fill(0)}],P=_t().domain(vt(12)).range(T);function k(I){var L,_=h*.9125,A=I.startAngle*180/Math.PI-90,f=I.endAngle*180/Math.PI-90,s=null;s||(s=L=mt()),s.moveTo(_*Math.cos(A*Math.PI/180),_*Math.sin(A*Math.PI/180)),s.arc(0,0,_,A*Math.PI/180,f*Math.PI/180);let d,e=f>0&&f<90||f<-90&&f>-180?.4:1.1;d=180-90-(90-(Math.abs(f-A)*e+A));let v=_*Math.sin(d*Math.PI/180),y=_*Math.cos(d*Math.PI/180),z=v/2+Math.abs(f-A)*.1*5,Y=-1;f>-90&&f<90?Y=Math.abs(f-A)*.1*10:Y=-1*(Math.abs(f-A)*.1*10);let Q=y/2+Y,W,tt=f>0&&f<90||f<-90&&f>-180?1.1:.4;W=180-90-(90-(f-Math.abs(f-A)*tt));let q=_*Math.sin(W*Math.PI/180),F=_*Math.cos(W*Math.PI/180),C=q/2+Math.abs(f-A)*.1*5,j=-1;f>-90&&f<90?j=Math.abs(f-A)*.1*10:j=-1*(Math.abs(f-A)*.1*10);let H=F/2+j,X=[];for(let O=0;O<R.length;O++)X.push(O*((a*2+.05*a)/R.length)-a*.9125);if(s.quadraticCurveTo(Q,z,I.half==0?p/2:-p/2,X[I.death]),s.quadraticCurveTo(H,C,_*Math.cos(A*Math.PI/180),_*Math.sin(A*Math.PI/180)),L)return s=null,L+""||null}const U=(I,L)=>{if(I&&L){b=bt(L,e=>e.artist),c=bt(I,e=>e.artist);for(let e=0;e<c.length;e++)x[Math.floor(Number(c[e][1][0].year)/100)-10].nums[0]++,x[Math.floor(Number(c[e][1][0].year)/100)-10].people.push(c[e][0]);for(let e=0;e<x.length;e++)for(let v=0;v<x[e].people.length;v++)for(let y=0;y<b.length;y++)if(x[e].people[v]==b[y][0]){for(let z=0;z<b[y][1].length;z++)x[e].meds[D(b[y][1][z].medium)]+=1;break}let _=0;for(let e=0;e<x.length;e++)for(let v=0;v<x[e].meds.length;v++)_+=x[e].meds[v];let A=Vt().innerRadius(h*.925).outerRadius(h).cornerRadius(3);ot(o).datum(function(e,v){let y=x.sort(function(w,V){let G=0,K=0;for(let et=0;et<w.nums.length;et++)G+=w.nums[et];for(let et=0;et<V.nums.length;et++)K+=V.nums[et];return G>K?1:K>G?-1:0}),z=[],Y=x.length,Q=m*Math.PI/180,q=2*m*Math.PI/180/_,F=a/270*.02,C=-1,j=(Math.PI-Q)/2,H=(Math.PI-Q)/2,X=0,O=!1;y[0].meds[0]=1,y[1].meds[11]=1,console.log(x);let E=!1;for(let w=0;w<Y;w++){C++,E=!0;for(let V=0;V<y[w].meds.length;V++)if(y[w].meds[V]>0){let G=y[w].meds[V];if(X+=q*G,X<m*Math.PI/180)z.push({index:C,startAngle:E&&w>0?F+j:j,endAngle:E&&w>0?F+q*G+j:q*G+j,value:29630,nums:y[w].meds[V],death:V,colorIndex:C,half:0,cent:y[w].cent,addLabel:!!E}),j+=E&&w>0?F+q*G:q*G;else{let K=2*Math.PI;z.push({index:C,startAngle:E&&w>0?K-F-q*G-H:K-q*G-H,endAngle:E&&w>0?K-F-H:K-H,value:29630,nums:y[w].meds[V],death:V,colorIndex:C,half:1,cent:y[w].cent,addLabel:!!(E||!O)}),O||(O=!0),H+=E&&w>0?F+q*G:q*G}E&&(E=!1)}}return z}),ot(o).append("g").attr("class","ribbons").selectAll("path").data(e=>e).enter().append("path").attr("d",k).style("fill",function(e){return P(e.colorIndex)}).style("stroke",(e,v)=>Lt(P(e.colorIndex)).darker()).style("opacity",.5);let f=ot(o).append("g").attr("class","groups").selectAll("g").data(e=>e).enter().append("g");f.append("path").style("fill",function(e,v){return P(e.index)}).style("stroke","white").attr("d",A),f.append("g").attr("class","groups").selectAll("g").data(e=>e).enter().append("g"),f.append("rect").data(R).attr("x",-1*p/2).attr("y",(e,v)=>v*((a*2+ +(.05*a))/R.length)-a*.9-.05*a).attr("rx",6).attr("ry",6).attr("width",p).attr("height",.1*a).attr("fill","#00005C").attr("opacity",1),f.append("text").data(R).attr("x",0).attr("y",(e,v)=>v*((a*2+ +(.05*a))/R.length)-a*.875).attr("fill","white").style("text-anchor","middle").style("font-size",i).text(e=>e.charAt(0).toUpperCase()+e.slice(1));let s=h*.9125;f.append("text").data(e=>e).attr("x",function(e,v){let y=e.half==0?s*Math.cos((e.endAngle*180/Math.PI-90)*Math.PI/180):s*Math.cos((e.startAngle*180/Math.PI-90)*Math.PI/180);return e.half==0?y+=65*(n/930):y-=65*(n/930),e.addLabel&&console.log("Angle: ",e.startAngle*180/Math.PI-90),y}).attr("y",function(e,v){let y=e.half==0?s*Math.sin((e.endAngle*180/Math.PI-90)*Math.PI/180):s*Math.sin((e.startAngle*180/Math.PI-90)*Math.PI/180);return Math.abs(e.startAngle*180/Math.PI-90-(e.endAngle*180/Math.PI-90))<1.5*(2*m/_)&&(y-=15),y}).attr("fill","black").style("text-anchor","middle").style("font-size",i).text(e=>e.addLabel?e.cent:"");let d=ot(o).append("g").attr("class","groups");d.append("text").attr("x",0).attr("y",a/270*-270).style("text-anchor","middle").style("font-size",u>20?20:u).text("Distribution of Artists by "+Yt+" Over "+Zt),d.append("rect").attr("x",h*.17+125).attr("y",a/270*300-15).attr("width",p*.5).attr("height",.05*a).attr("fill","white").attr("stroke","black"),d.append("rect").attr("x",-h*.7+120).attr("y",a/270*300-15).attr("width",p*.5).attr("height",.05*a).attr("fill","white").attr("stroke","black"),d.append("text").attr("x",h*.17).attr("y",a/270*300-5).style("font-size",u-6>14?14:u-6).text("Select an Attribute:"),d.append("text").attr("x",-h*.7).attr("y",a/270*300-5).style("font-size",u-6>14?14:u-6).text("Select a Grouping:")}else console.error("Unable to load Artist Locations!")};function N(I){St[I?"unshift":"push"](()=>{o=I,l(3,o)})}return t.$$set=I=>{"width"in I&&l(0,n=I.width),"height"in I&&l(1,M=I.height)},t.$$.update=()=>{t.$$.dirty&2&&l(2,a=M*.45>275?275:M*.45),t.$$.dirty&1&&l(5,h=n*.45>390?390:n*.45),t.$$.dirty&4&&(m=a/270*90-10),t.$$.dirty&32&&(p=h/370*120),t.$$.dirty&39&&(i=M<=n?a/270*15:h/370*15),t.$$.dirty&39&&(u=M<=n?a/170*20:h/270*20)},c=[],b=[],[n,M,a,o,U,h,N]}class ee extends wt{constructor(r){super(),Tt(this,r,Qt,Ut,Rt,{width:0,height:1,Initialize:4})}get Initialize(){return this.$$.ctx[4]}}export{ee as C};
