import{S as wt,i as Tt,s as Rt,k as Ct,P as yt,l as kt,m as ft,Q as Mt,h as st,n as J,p as lt,b as zt,F as xt,A as At,O as St}from"./index-3c9f222a.js";import{b as qt}from"./config-fd755020.js";import{o as _t}from"./ordinal-ceb38b17.js";import{r as vt}from"./init-08c38208.js";import{g as bt}from"./group-d3aa616c.js";import{s as ot}from"./select-087c8348.js";const dt=Math.PI,gt=2*dt,at=1e-6,Et=gt-at;function pt(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function mt(){return new pt}pt.prototype=mt.prototype={constructor:pt,moveTo:function(t,r){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+r)},closePath:function(){this._x1!==null&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,r){this._+="L"+(this._x1=+t)+","+(this._y1=+r)},quadraticCurveTo:function(t,r,l,a){this._+="Q"+ +t+","+ +r+","+(this._x1=+l)+","+(this._y1=+a)},bezierCurveTo:function(t,r,l,a,h,m){this._+="C"+ +t+","+ +r+","+ +l+","+ +a+","+(this._x1=+h)+","+(this._y1=+m)},arcTo:function(t,r,l,a,h){t=+t,r=+r,l=+l,a=+a,h=+h;var m=this._x1,p=this._y1,i=l-t,u=a-r,e=m-t,M=p-r,o=e*e+M*M;if(h<0)throw new Error("negative radius: "+h);if(this._x1===null)this._+="M"+(this._x1=t)+","+(this._y1=r);else if(o>at)if(!(Math.abs(M*i-u*e)>at)||!h)this._+="L"+(this._x1=t)+","+(this._y1=r);else{var f=l-m,b=a-p,T=i*i+u*u,R=f*f+b*b,g=Math.sqrt(T),D=Math.sqrt(o),A=h*Math.tan((dt-Math.acos((T+o-R)/(2*g*D)))/2),P=A/D,k=A/g;Math.abs(P-1)>at&&(this._+="L"+(t+P*e)+","+(r+P*M)),this._+="A"+h+","+h+",0,0,"+ +(M*f>e*b)+","+(this._x1=t+k*i)+","+(this._y1=r+k*u)}},arc:function(t,r,l,a,h,m){t=+t,r=+r,l=+l,m=!!m;var p=l*Math.cos(a),i=l*Math.sin(a),u=t+p,e=r+i,M=1^m,o=m?a-h:h-a;if(l<0)throw new Error("negative radius: "+l);this._x1===null?this._+="M"+u+","+e:(Math.abs(this._x1-u)>at||Math.abs(this._y1-e)>at)&&(this._+="L"+u+","+e),l&&(o<0&&(o=o%gt+gt),o>Et?this._+="A"+l+","+l+",0,1,"+M+","+(t-p)+","+(r-i)+"A"+l+","+l+",0,1,"+M+","+(this._x1=u)+","+(this._y1=e):o>at&&(this._+="A"+l+","+l+",0,"+ +(o>=dt)+","+M+","+(this._x1=t+l*Math.cos(h))+","+(this._y1=r+l*Math.sin(h))))},rect:function(t,r,l,a){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+r)+"h"+ +l+"v"+ +a+"h"+-l+"Z"},toString:function(){return this._}};function $(t){return function(){return t}}const It=Math.abs,S=Math.atan2,nt=Math.cos,Lt=Math.max,ct=Math.min,Y=Math.sin,rt=Math.sqrt,B=1e-12,it=Math.PI,ut=it/2,Bt=2*it;function Dt(t){return t>1?0:t<-1?it:Math.acos(t)}function Pt(t){return t>=1?ut:t<=-1?-ut:Math.asin(t)}function jt(t){return t.innerRadius}function Gt(t){return t.outerRadius}function Ft(t){return t.startAngle}function Ht(t){return t.endAngle}function Nt(t){return t&&t.padAngle}function Ot(t,r,l,a,h,m,p,i){var u=l-t,e=a-r,M=p-h,o=i-m,f=o*u-M*e;if(!(f*f<B))return f=(M*(r-m)-o*(t-h))/f,[t+f*u,r+f*e]}function ht(t,r,l,a,h,m,p){var i=t-l,u=r-a,e=(p?m:-m)/rt(i*i+u*u),M=e*u,o=-e*i,f=t+M,b=r+o,T=l+M,R=a+o,g=(f+T)/2,D=(b+R)/2,A=T-f,P=R-b,k=A*A+P*P,Q=h-m,F=f*R-T*b,I=(P<0?-1:1)*rt(Lt(0,Q*Q*k-F*F)),q=(F*P-A*I)/k,_=(-F*A-P*I)/k,x=(F*P+A*I)/k,c=(-F*A+P*I)/k,s=q-g,d=_-D,n=x-g,v=c-D;return s*s+d*d>n*n+v*v&&(q=x,_=c),{cx:q,cy:_,x01:-M,y01:-o,x11:q*(h/Q-1),y11:_*(h/Q-1)}}function Vt(){var t=jt,r=Gt,l=$(0),a=null,h=Ft,m=Ht,p=Nt,i=null;function u(){var e,M,o=+t.apply(this,arguments),f=+r.apply(this,arguments),b=h.apply(this,arguments)-ut,T=m.apply(this,arguments)-ut,R=It(T-b),g=T>b;if(i||(i=e=mt()),f<o&&(M=f,f=o,o=M),!(f>B))i.moveTo(0,0);else if(R>Bt-B)i.moveTo(f*nt(b),f*Y(b)),i.arc(0,0,f,b,T,!g),o>B&&(i.moveTo(o*nt(T),o*Y(T)),i.arc(0,0,o,T,b,g));else{var D=b,A=T,P=b,k=T,Q=R,F=R,I=p.apply(this,arguments)/2,q=I>B&&(a?+a.apply(this,arguments):rt(o*o+f*f)),_=ct(It(f-o)/2,+l.apply(this,arguments)),x=_,c=_,s,d;if(q>B){var n=Pt(q/o*Y(I)),v=Pt(q/f*Y(I));(Q-=n*2)>B?(n*=g?1:-1,P+=n,k-=n):(Q=0,P=k=(b+T)/2),(F-=v*2)>B?(v*=g?1:-1,D+=v,A-=v):(F=0,D=A=(b+T)/2)}var y=f*nt(D),z=f*Y(D),U=o*nt(k),Z=o*Y(k);if(_>B){var W=f*nt(A),tt=f*Y(A),E=o*nt(P),H=o*Y(P),C;if(R<it&&(C=Ot(y,z,E,H,W,tt,U,Z))){var j=y-C[0],N=z-C[1],X=W-C[0],O=tt-C[1],L=1/Y(Dt((j*X+N*O)/(rt(j*j+N*N)*rt(X*X+O*O)))/2),w=rt(C[0]*C[0]+C[1]*C[1]);x=ct(_,(o-w)/(L-1)),c=ct(_,(f-w)/(L+1))}}F>B?c>B?(s=ht(E,H,y,z,f,c,g),d=ht(W,tt,U,Z,f,c,g),i.moveTo(s.cx+s.x01,s.cy+s.y01),c<_?i.arc(s.cx,s.cy,c,S(s.y01,s.x01),S(d.y01,d.x01),!g):(i.arc(s.cx,s.cy,c,S(s.y01,s.x01),S(s.y11,s.x11),!g),i.arc(0,0,f,S(s.cy+s.y11,s.cx+s.x11),S(d.cy+d.y11,d.cx+d.x11),!g),i.arc(d.cx,d.cy,c,S(d.y11,d.x11),S(d.y01,d.x01),!g))):(i.moveTo(y,z),i.arc(0,0,f,D,A,!g)):i.moveTo(y,z),!(o>B)||!(Q>B)?i.lineTo(U,Z):x>B?(s=ht(U,Z,W,tt,o,-x,g),d=ht(y,z,E,H,o,-x,g),i.lineTo(s.cx+s.x01,s.cy+s.y01),x<_?i.arc(s.cx,s.cy,x,S(s.y01,s.x01),S(d.y01,d.x01),!g):(i.arc(s.cx,s.cy,x,S(s.y01,s.x01),S(s.y11,s.x11),!g),i.arc(0,0,o,S(s.cy+s.y11,s.cx+s.x11),S(d.cy+d.y11,d.cx+d.x11),g),i.arc(d.cx,d.cy,x,S(d.y11,d.x11),S(d.y01,d.x01),!g))):i.arc(0,0,o,k,P,g)}if(i.closePath(),e)return i=null,e+""||null}return u.centroid=function(){var e=(+t.apply(this,arguments)+ +r.apply(this,arguments))/2,M=(+h.apply(this,arguments)+ +m.apply(this,arguments))/2-it/2;return[nt(M)*e,Y(M)*e]},u.innerRadius=function(e){return arguments.length?(t=typeof e=="function"?e:$(+e),u):t},u.outerRadius=function(e){return arguments.length?(r=typeof e=="function"?e:$(+e),u):r},u.cornerRadius=function(e){return arguments.length?(l=typeof e=="function"?e:$(+e),u):l},u.padRadius=function(e){return arguments.length?(a=e==null?null:typeof e=="function"?e:$(+e),u):a},u.startAngle=function(e){return arguments.length?(h=typeof e=="function"?e:$(+e),u):h},u.endAngle=function(e){return arguments.length?(m=typeof e=="function"?e:$(+e),u):m},u.padAngle=function(e){return arguments.length?(p=typeof e=="function"?e:$(+e),u):p},u.context=function(e){return arguments.length?(i=e==null?null:e,u):i},u}function Qt(t){let r,l,a,h,m;return{c(){r=Ct("div"),l=yt("svg"),a=yt("g"),this.h()},l(p){r=kt(p,"DIV",{id:!0,class:!0,style:!0});var i=ft(r);l=Mt(i,"svg",{class:!0,viewBox:!0,preserveAspectRatio:!0});var u=ft(l);a=Mt(u,"g",{id:!0,transform:!0}),ft(a).forEach(st),u.forEach(st),i.forEach(st),this.h()},h(){J(a,"id","chordViz"),J(a,"transform",h="translate("+t[0]/2+", "+t[2]*1.1+")"),J(l,"class","inline-block absolute top-0 left-0"),J(l,"viewBox",m="0, 0, "+t[0]+", "+t[1]),J(l,"preserveAspectRatio","xMidYMid meet"),J(r,"id","container"),J(r,"class","inline-block relative align-top overflow-hidden"),lt(r,"width",t[0]+"px"),lt(r,"height",t[1]+"px")},m(p,i){zt(p,r,i),xt(r,l),xt(l,a),t[6](a)},p(p,[i]){i&5&&h!==(h="translate("+p[0]/2+", "+p[2]*1.1+")")&&J(a,"transform",h),i&3&&m!==(m="0, 0, "+p[0]+", "+p[1])&&J(l,"viewBox",m),i&1&&lt(r,"width",p[0]+"px"),i&2&&lt(r,"height",p[1]+"px")},i:At,o:At,d(p){p&&st(r),t[6](null)}}}let Ut="Century",Yt="Artistic Mediums";function Zt(t,r,l){let a,h,m,p,i,u,{width:e}=r,{height:M}=r,o,f,b,T=["rgb(211, 157, 69)","#ff69b4","#ffe4c4","rgb(20, 57, 59)","rgb(163, 0, 48)","rgb(222, 182, 254)","#1e90ff","#00ff00","#7624C2","rgb(195, 72, 54)","rgb(52, 25, 58)","rgb(252, 179, 75)"],R=["sculptor","painter","printmaker","draughtsman","photography","film","watercolourist","oilpainter","illustrator","muralist","architect","ink","ceramicist","calligrapher","engraving"],g=R.length,D=_t().domain(R).range(vt(g)),A=[{cent:1e3,people:[],nums:[1],death:[0],meds:new Array(g).fill(0)},{cent:1100,people:[],nums:[1],death:[1],meds:new Array(g).fill(0)},{cent:1200,people:[],nums:[1],death:[2],meds:new Array(g).fill(0)},{cent:1300,people:[],nums:[1],death:[3],meds:new Array(g).fill(0)},{cent:1400,people:[],nums:[1],death:[4],meds:new Array(g).fill(0)},{cent:1500,people:[],nums:[1],death:[0],meds:new Array(g).fill(0)},{cent:1600,people:[],nums:[1],death:[1],meds:new Array(g).fill(0)},{cent:1700,people:[],nums:[1],death:[2],meds:new Array(g).fill(0)},{cent:1800,people:[],nums:[1],death:[3],meds:new Array(g).fill(0)},{cent:1900,people:[],nums:[1],death:[4],meds:new Array(g).fill(0)}],P=_t().domain(vt(12)).range(T);function k(I){var q,_=h*.9125,x=I.startAngle*180/Math.PI-90,c=I.endAngle*180/Math.PI-90,s=null;s||(s=q=mt()),s.moveTo(_*Math.cos(x*Math.PI/180),_*Math.sin(x*Math.PI/180)),s.arc(0,0,_,x*Math.PI/180,c*Math.PI/180);let d,n=c>0&&c<90||c<-90&&c>-180?.4:1.1;d=180-90-(90-(Math.abs(c-x)*n+x));let v=_*Math.sin(d*Math.PI/180),y=_*Math.cos(d*Math.PI/180),z=v/2+Math.abs(c-x)*.1*5,U=-1;c>-90&&c<90?U=Math.abs(c-x)*.1*10:U=-1*(Math.abs(c-x)*.1*10);let Z=y/2+U,W,tt=c>0&&c<90||c<-90&&c>-180?1.1:.4;W=180-90-(90-(c-Math.abs(c-x)*tt));let E=_*Math.sin(W*Math.PI/180),H=_*Math.cos(W*Math.PI/180),C=E/2+Math.abs(c-x)*.1*5,j=-1;c>-90&&c<90?j=Math.abs(c-x)*.1*10:j=-1*(Math.abs(c-x)*.1*10);let N=H/2+j,X=[];for(let O=0;O<R.length;O++)X.push(O*((a*2+.05*a)/R.length)-a*.9125);if(s.quadraticCurveTo(Z,z,I.half==0?p/2:-p/2,X[I.death]),s.quadraticCurveTo(N,C,_*Math.cos(x*Math.PI/180),_*Math.sin(x*Math.PI/180)),q)return s=null,q+""||null}const Q=(I,q)=>{if(I&&q){b=bt(q,n=>n.artist),f=bt(I,n=>n.artist);for(let n=0;n<f.length;n++)A[Math.floor(Number(f[n][1][0].year)/100)-10].nums[0]++,A[Math.floor(Number(f[n][1][0].year)/100)-10].people.push(f[n][0]);for(let n=0;n<A.length;n++)for(let v=0;v<A[n].people.length;v++)for(let y=0;y<b.length;y++)if(A[n].people[v]==b[y][0]){for(let z=0;z<b[y][1].length;z++)A[n].meds[D(b[y][1][z].medium)]+=1;break}let _=0;for(let n=0;n<A.length;n++)for(let v=0;v<A[n].meds.length;v++)_+=A[n].meds[v];let x=Vt().innerRadius(h*.925).outerRadius(h).cornerRadius(3);ot(o).datum(function(n,v){let y=A.sort(function(w,V){let G=0,K=0;for(let et=0;et<w.nums.length;et++)G+=w.nums[et];for(let et=0;et<V.nums.length;et++)K+=V.nums[et];return G>K?1:K>G?-1:0}),z=[],U=A.length,Z=m*Math.PI/180,E=2*m*Math.PI/180/_,H=a/270*.02,C=-1,j=(Math.PI-Z)/2,N=(Math.PI-Z)/2,X=0,O=!1;y[0].meds[0]=1,y[1].meds[11]=1;let L=!1;for(let w=0;w<U;w++){C++,L=!0;for(let V=0;V<y[w].meds.length;V++)if(y[w].meds[V]>0){let G=y[w].meds[V];if(X+=E*G,X<m*Math.PI/180)z.push({index:C,startAngle:L&&w>0?H+j:j,endAngle:L&&w>0?H+E*G+j:E*G+j,value:29630,nums:y[w].meds[V],death:V,colorIndex:C,half:0,cent:y[w].cent,addLabel:!!L}),j+=L&&w>0?H+E*G:E*G;else{let K=2*Math.PI;z.push({index:C,startAngle:L&&w>0?K-H-E*G-N:K-E*G-N,endAngle:L&&w>0?K-H-N:K-N,value:29630,nums:y[w].meds[V],death:V,colorIndex:C,half:1,cent:y[w].cent,addLabel:!!(L||!O)}),O||(O=!0),N+=L&&w>0?H+E*G:E*G}L&&(L=!1)}}return z}),ot(o).append("g").attr("class","ribbons").selectAll("path").data(n=>n).enter().append("path").attr("d",k).style("fill",function(n){return P(n.colorIndex)}).style("stroke",(n,v)=>qt(P(n.colorIndex)).darker()).style("opacity",.5);let c=ot(o).append("g").attr("class","groups").selectAll("g").data(n=>n).enter().append("g");c.append("path").style("fill",function(n,v){return P(n.index)}).style("stroke","white").attr("d",x),c.append("g").attr("class","groups").selectAll("g").data(n=>n).enter().append("g"),c.append("rect").data(R).attr("x",-1*p/2).attr("y",(n,v)=>v*((a*2+ +(.05*a))/R.length)-a*.9-.05*a).attr("rx",6).attr("ry",6).attr("width",p).attr("height",.1*a).attr("fill","#00005C").attr("opacity",1),c.append("text").data(R).attr("x",0).attr("y",(n,v)=>v*((a*2+ +(.05*a))/R.length)-a*.875).attr("fill","white").style("text-anchor","middle").style("font-size",i).text(n=>n.charAt(0).toUpperCase()+n.slice(1));let s=h*.9125;c.append("text").data(n=>n).attr("x",function(n,v){let y=n.half==0?s*Math.cos((n.endAngle*180/Math.PI-90)*Math.PI/180):s*Math.cos((n.startAngle*180/Math.PI-90)*Math.PI/180);return n.half==0?y+=65*(e/930):y-=65*(e/930),y}).attr("y",function(n,v){let y=n.half==0?s*Math.sin((n.endAngle*180/Math.PI-90)*Math.PI/180):s*Math.sin((n.startAngle*180/Math.PI-90)*Math.PI/180);return Math.abs(n.startAngle*180/Math.PI-90-(n.endAngle*180/Math.PI-90))<1.5*(2*m/_)&&(y-=15),y}).attr("fill","black").style("text-anchor","middle").style("font-size",i).text(n=>n.addLabel?n.cent:"");let d=ot(o).append("g").attr("class","groups");d.append("text").attr("x",0).attr("y",a/270*-270).style("text-anchor","middle").style("font-size",u>20?20:u).text("Distribution of Artists by "+Ut+" Over "+Yt),d.append("rect").attr("x",h*.17+125).attr("y",a/270*300-15).attr("width",p*.5).attr("height",.05*a).attr("fill","white").attr("stroke","black"),d.append("rect").attr("x",-h*.7+120).attr("y",a/270*300-15).attr("width",p*.5).attr("height",.05*a).attr("fill","white").attr("stroke","black"),d.append("text").attr("x",h*.17).attr("y",a/270*300-5).style("font-size",u-6>14?14:u-6).text("Select an Attribute:"),d.append("text").attr("x",-h*.7).attr("y",a/270*300-5).style("font-size",u-6>14?14:u-6).text("Select a Grouping:")}else console.error("Unable to load Artist Locations!")};function F(I){St[I?"unshift":"push"](()=>{o=I,l(3,o)})}return t.$$set=I=>{"width"in I&&l(0,e=I.width),"height"in I&&l(1,M=I.height)},t.$$.update=()=>{t.$$.dirty&2&&l(2,a=M*.45>275?275:M*.45),t.$$.dirty&1&&l(5,h=e*.45>390?390:e*.45),t.$$.dirty&4&&(m=a/270*90-10),t.$$.dirty&32&&(p=h/370*120),t.$$.dirty&39&&(i=M<=e?a/270*15:h/370*15),t.$$.dirty&39&&(u=M<=e?a/170*20:h/270*20)},f=[],b=[],[e,M,a,o,Q,h,F]}class ee extends wt{constructor(r){super(),Tt(this,r,Zt,Qt,Rt,{width:0,height:1,Initialize:4})}get Initialize(){return this.$$.ctx[4]}}export{ee as C};
