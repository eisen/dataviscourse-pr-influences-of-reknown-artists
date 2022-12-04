import{S as At,i as Ct,s as St,k as Ft,K as $,l as Pt,m as E,L as X,h as R,n as g,p as I,b as K,F as j,A as lt,H as Rt,T as Bt,q as et,r as at,u as it,R as Mt}from"./index-57d070b8.js";import{a as m}from"./config-331e8422.js";import{A as k,M as ft,T as Q}from"./helpers-2dd99694.js";import{s as o}from"./selectAll-237a4934.js";import{l as nt,f as G,m as ct}from"./linear-9a7b9918.js";import{m as L,a as Nt,b as Et}from"./axis-000f9faf.js";import{g as rt,a as Ht}from"./colors-08d4fe23.js";import{o as It}from"./ordinal-7966dd64.js";import{P as Lt}from"./Paired-3f249ea6.js";function yt(c,l,h){const i=c.slice();return i[41]=l[h],i}function ut(c){let l,h=c[41].name+"",i,r,s,D=`Aged ${c[41].age}`,d,f,x,a=`${c[41].finalYear}`,_,Y;return{c(){l=$("text"),i=et(h),s=$("text"),d=et(D),x=$("text"),_=et(a),this.h()},l(u){l=X(u,"text",{x:!0,y:!0,id:!0});var p=E(l);i=at(p,h),p.forEach(R),s=X(u,"text",{x:!0,y:!0,id:!0});var C=E(s);d=at(C,D),C.forEach(R),x=X(u,"text",{x:!0,y:!0,id:!0});var b=E(x);_=at(b,a),b.forEach(R),this.h()},h(){g(l,"x","0"),g(l,"y","0"),g(l,"id",r=k(c[41].name)+"-name"),g(s,"x","0"),g(s,"y","0"),g(s,"id",f=k(c[41].name)+"-age"),g(x,"x","0"),g(x,"y","0"),g(x,"id",Y=k(c[41].name)+"-year")},m(u,p){K(u,l,p),j(l,i),K(u,s,p),j(s,d),K(u,x,p),j(x,_)},p(u,p){p[0]&16&&h!==(h=u[41].name+"")&&it(i,h),p[0]&16&&r!==(r=k(u[41].name)+"-name")&&g(l,"id",r),p[0]&16&&D!==(D=`Aged ${u[41].age}`)&&it(d,D),p[0]&16&&f!==(f=k(u[41].name)+"-age")&&g(s,"id",f),p[0]&16&&a!==(a=`${u[41].finalYear}`)&&it(_,a),p[0]&16&&Y!==(Y=k(u[41].name)+"-year")&&g(x,"id",Y)},d(u){u&&R(l),u&&R(s),u&&R(x)}}}function $t(c){let l,h,i,r,s,D=c[4],d=[];for(let f=0;f<D.length;f+=1)d[f]=ut(yt(c,D,f));return{c(){l=Ft("div"),h=$("svg"),i=$("g"),r=$("g");for(let f=0;f<d.length;f+=1)d[f].c();this.h()},l(f){l=Pt(f,"DIV",{id:!0,class:!0,style:!0});var x=E(l);h=X(x,"svg",{class:!0,viewBox:!0,preserveAspectRatio:!0});var a=E(h);i=X(a,"g",{id:!0,transform:!0}),E(i).forEach(R),r=X(a,"g",{id:!0,opacity:!0});var _=E(r);for(let Y=0;Y<d.length;Y+=1)d[Y].l(_);_.forEach(R),a.forEach(R),x.forEach(R),this.h()},h(){g(i,"id","scatterViz"),g(i,"transform","translate(0, 0)"),g(r,"id","hidden-text"),g(r,"opacity","0"),g(h,"class","inline-block absolute top-0 left-0"),g(h,"viewBox",s="0, 0, "+c[0]+", "+c[1]),g(h,"preserveAspectRatio","xMidYMid meet"),g(l,"id","container"),g(l,"class","inline-block relative align-top overflow-hidden"),I(l,"width",c[0]+"px"),I(l,"height",c[1]+"px"),I(l,"top",(c[2]>50?50:c[2]*.9)+"px")},m(f,x){K(f,l,x),j(l,h),j(h,i),c[16](i),j(h,r);for(let a=0;a<d.length;a+=1)d[a].m(r,null)},p(f,x){if(x[0]&16){D=f[4];let a;for(a=0;a<D.length;a+=1){const _=yt(f,D,a);d[a]?d[a].p(_,x):(d[a]=ut(_),d[a].c(),d[a].m(r,null))}for(;a<d.length;a+=1)d[a].d(1);d.length=D.length}x[0]&3&&s!==(s="0, 0, "+f[0]+", "+f[1])&&g(h,"viewBox",s),x[0]&1&&I(l,"width",f[0]+"px"),x[0]&2&&I(l,"height",f[1]+"px"),x[0]&4&&I(l,"top",(f[2]>50?50:f[2]*.9)+"px")},i:lt,o:lt,d(f){f&&R(l),c[16](null),Rt(d,f)}}}let M=20;const F=250;let P=30;function ht(c){return new Promise(l=>setTimeout(l,c))}function Xt(c,l,h){let i,r,s;const D=Bt();let{width:d=0}=l,{height:f=0}=l,{topOffset:x=0}=l,a,_,Y,u,p=[],C,b=!1,z="",H,U,st,W,ot,J,B=!1,v=0,S=0,V=0,q=0;const dt=e=>{D("highlight_scatter_dots",{deathGroup:e})},pt=()=>{D("restore_scatter_dots",{})},xt=e=>{console.log(e),B?console.log("sorry. the points are busy moving right now..."):(o(".allPoints").transition().duration(F).style("opacity",function(y,O){return"0.15"}),o(".allPoints_"+e).transition().duration(F).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2))},mt=()=>{B?console.log("sorry. the points are busy moving right now..."):(o(".allPoints").transition().duration(F).style("opacity","1.0").attr("stroke",(e,y)=>C[p.indexOf(e.typeOfDeath)]?"#3C1900":"none"),o(".storyText").remove())},gt=(e,y)=>{B?console.log("sorry. the points are busy moving right now..."):(o(".allPoints").transition().duration(F).style("opacity","0.15"),o(".allPoints_"+e+"_"+y).transition().duration(F).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2),e=="murder"&&!b||e=="murder"&&z=="1400"?(m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("According to legend, Masaccio was poisoned by a jealous rival").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):e=="suicide"&&!b&&y=="1800"||e=="suicide"&&z=="1800"?(console.log("mo"),m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("van Gogh's gun that he used to kill himself sold for $182,000").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):e=="natural"&&!b&&y=="2000"||e=="natural"&&z=="2000"?(m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("S.H. Raza's wish to be burried next to his father in Mandla, India was fulfilled").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):e=="illness"&&!b&&y=="2000"||e=="illness"&&z=="2000"?(m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("Antoni T\xE0piez's died from health issues. He was married and had 3 kids").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):e=="illness"&&!b&&y=="1700"||e=="illness"&&z=="1700"?(m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("Antoine Watteau's lost 1718 painting was found nearly 300 years after he died").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):(e=="no-mention"&&!b&&y=="1300"||e=="no-mention"&&z=="1300")&&(m(a).append("text").attr("x",i/2).attr("y",r*.75).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("Giotto's bones were found in the 1970's, and they suggest that").style("opacity",0),m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("he often held a paint brush between his teeth").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)))},_t=()=>{B?console.log("sorry. the points are busy moving right now..."):(o(".allPoints").transition().duration(F).style("opacity","1.0").attr("stroke",(e,y)=>C[p.indexOf(e.typeOfDeath)]?"#3C1900":"none"),o(".storyText").remove())},bt=(e,y)=>{if(b){o(".allPoints").style("opacity","0.15");for(let O=0;O<y.length;O++)o(".allPoints_"+y[O]+"_"+e).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2)}else{o(".allPoints").style("opacity","0.15");for(let O=0;O<y.length;O++)o(".allPoints_"+y[O]+"_"+e).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2)}},kt=e=>{b?o(".allPoints").style("opacity",function(y,O){return Math.floor(y.finalYear/100)*100==Number(z)?"1.0":"0.0"}).attr("stroke",(y,O)=>C[p.indexOf(y.typeOfDeath)]?"#3C1900":"none"):o(".allPoints").style("opacity","1.0").attr("stroke",(y,O)=>C[p.indexOf(y.typeOfDeath)]?"#3C1900":"none")},vt=(e,y)=>{let O=b;if((O=!0)&&e!=z&&(O=!1),O==!1){B=!0,b=!0,z=e,v=Number(e),S=e=="2000"?Number(e)+22:Number(e)+100;let T=nt().domain(e=="2000"?[Number(e),Number(e)+22]:[Number(e),Number(e)+100]).range([P,i-P*2]);J.transition().duration(1e3).call(W.scale(T).ticks(i<=490?8:13).tickFormat(G("d"))),o(".allPoints").transition().duration(1e3).attr("cx",(A,N)=>T(A.finalYear)+P).style("opacity",0).attr("r",L([i,r])*.015);for(let A=0;A<y.length;A++)o(".allPoints_"+y[A]+"_"+e).transition().duration(1e3).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2).attr("r",L([i,r])*.02).attr("cx",(N,Z)=>T(N.finalYear)+P);ht(1200).then(()=>B=!1)}else{B=!0,b=!1,z="",v=V,S=q,J.transition().duration(1e3).call(W.scale(H).ticks(i<=490?8:13).tickFormat(G("d"))),o(".allPoints").transition().duration(1e3).attr("cx",(T,A)=>H(T.finalYear)+P).style("opacity",1);for(let T=0;T<y.length;T++)o(".allPoints_"+y[T]+"_"+e).transition().duration(1e3).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2).attr("r",L([i,r])*.015).attr("cx",(A,N)=>H(A.finalYear)+P);ht(1200).then(()=>B=!1)}},wt=e=>{C[p.indexOf(e)]=!C[p.indexOf(e)]},Ot=(e,y)=>{if(e&&y){_=rt(e,n=>n.artist),Y=rt(y,n=>n.artist);let O=rt(y,n=>n.death_type);for(let n=0;n<O.length;n++)p.push(O[n][0]);p.sort(Ht),C=new Array(p.length).fill(!1);let T,A,N=!1,Z;for(let n=0;n<_.length;n++){N=!1,_[n][1].length>1?(T=Number(_[n][1][1].year)-Number(_[n][1][0].year),A=Number(_[n][1][1].year)):(T=2022-Number(_[n][1][0].year),A=2022);for(let t=0;t<Y.length;t++)if(Y[t][0]==_[n][0]){Z=Y[t][1][0].death_type,N=!0;break}N&&u.push({name:_[n][0],age:T,finalYear:A,finalCent:String(Math.floor(A/100)*100),typeOfDeath:Z})}q=ct(u,function(n){return n.finalYear}),V=L(u,function(n){return n.finalYear});let Dt=ct(u,function(n){return n.age});L(u,function(n){return n.age}),v=V,S=q,H=nt().domain([V,q]).range([P,i-P*2]),U=nt().domain([Dt,0]).range([0,r*.65]),st=It().domain(p).range(Lt),W=Nt(H),ot=Et(U);let Yt=m(a).append("g").attr("class","pointGroup").selectAll("g").data(u).enter().append("g").attr("transform",n=>"translate(0, 0)");s>30&&(s=30),Yt.append("circle").attr("cx",(n,t)=>H(n.finalYear)+P).attr("cy",(n,t)=>U(n.age)+r*.2).attr("r",(n,t)=>L([i,r])*.015).attr("fill",(n,t)=>st(n.typeOfDeath)).attr("class",function(n,t){return"allPoints_"+n.typeOfDeath+" allPoints_"+n.typeOfDeath+"_"+Math.floor(n.finalYear/100)*100}).classed("allPoints",!0).on("mouseover",function(n,t,tt=B){tt||(o(".allPoints").transition().duration(F).style("opacity",.15).attr("stroke",(w,Tt)=>C[p.indexOf(w.typeOfDeath)]?"#3C1900":"none"),m(this).transition().duration(F).style("opacity",1).attr("stroke","#3C1900").attr("stroke-width",2),t.typeOfDeath=="murder"&&!b||t.typeOfDeath=="murder"&&z=="1400"?(m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("According to legend, Masaccio was poisoned by a jealous rival").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):t.typeOfDeath=="suicide"&&!b&&t.finalCent=="1800"||t.typeOfDeath=="suicide"&&z=="1800"?(console.log("mo"),m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("van Gogh's gun that he used to kill himself sold for $182,000").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):t.typeOfDeath=="natural"&&!b&&t.finalCent=="2000"||t.typeOfDeath=="natural"&&z=="2000"?(m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("S.H. Raza's wish to be burried next to his father in Mandla, India was fulfilled").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):t.typeOfDeath=="illness"&&!b&&t.finalCent=="2000"||t.typeOfDeath=="illness"&&z=="2000"?(m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("Antoni T\xE0piez's died from health issues. He was married and had 3 kids").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):t.typeOfDeath=="illness"&&!b&&t.finalCent=="1700"||t.typeOfDeath=="illness"&&z=="1700"?(m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("Antoine Watteau's lost 1718 painting was found nearly 300 years after he died").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)):(t.typeOfDeath=="no-mention"&&!b&&t.finalCent=="1300"||t.typeOfDeath=="no-mention"&&z=="1300")&&(m(a).append("text").attr("x",i/2).attr("y",r*.75).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("Giotto's bones were found in the 1970's, and they suggest that").style("opacity",0),m(a).append("text").attr("x",i/2).attr("y",r*.8).attr("font-size",s*.55).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("he often held a paint brush between his teeth").style("opacity",0),o(".storyText").transition().duration(300).style("opacity",1)),o(".tempTextT").remove(),m(a).append("rect").classed("tempTextT",!0).attr("rx",6).attr("ry",6).attr("width",()=>ft(["#"+k(t.name)+"-name","#"+k(t.name)+"-age","#"+k(t.name)+"-year"],[t.name,`Aged ${t.age}`,`${t.finalYear}`])+M).attr("height",()=>(Q("#"+k(t.name)+"-name",t.name)+M*.5)*3).attr("fill","white").attr("stroke","black").attr("opacity",0).attr("x",function(){let w=0;return(t.finalYear-v)/(S-v)>=.8?w=-i*.1:(t.finalYear-v)/(S-v)<=.2&&(w=i*.1),n.offsetX+w-(ft(["#"+k(t.name)+"-name","#"+k(t.name)+"-age","#"+k(t.name)+"-year"],[t.name,`Aged ${t.age}`,`${t.finalYear}`])+M)*.5}).attr("y",n.offsetY-1.25*M-(Q("#"+k(t.name)+"-name",t.name)+M*.5)*3),m(a).append("text").attr("x",function(){let w=0;return(t.finalYear-v)/(S-v)>=.8?w=-i*.1:(t.finalYear-v)/(S-v)<=.2&&(w=i*.1),n.offsetX+w}).attr("y",n.offsetY-(Q("#"+k(t.name)+"-name",t.name)+M*.5)*3).attr("fill","black").style("text-anchor","middle").classed("tempTextT",!0).attr("id",()=>k(t.name)+"-name").style("font-size",t.name.length>=15?s*.52:s*.6).text(`${t.name}`).style("opacity",0),m(a).append("text").attr("x",function(){let w=0;return(t.finalYear-v)/(S-v)>=.8?w=-i*.1:(t.finalYear-v)/(S-v)<=.2&&(w=i*.1),n.offsetX+w}).attr("y",n.offsetY+.125*M-(Q("#"+k(t.name)+"-name",t.name)+M*.5)*2).attr("fill","black").style("text-anchor","middle").classed("tempTextT",!0).style("font-size",s*.6).attr("id",()=>k(t.name)+"-age").text(`Aged ${t.age}`).style("opacity",0),m(a).append("text").attr("x",function(){let w=0;return(t.finalYear-v)/(S-v)>=.8?w=-i*.1:(t.finalYear-v)/(S-v)<=.2&&(w=i*.1),n.offsetX+w}).attr("y",n.offsetY-(Q("#"+k(t.name)+"-name",t.name)+M*.5)).attr("id",()=>k(t.name)+"-year").attr("fill","black").style("text-anchor","middle").classed("tempTextT",!0).style("font-size",s*.6).text(`${t.finalYear}`).style("opacity",0),o(".tempTextT").transition().duration(F).style("opacity",1),dt(t.typeOfDeath))}).on("mouseout",function(n,t,tt=B){tt||(o(".allPoints").transition().duration(F).style("opacity",1).attr("stroke",(w,Tt)=>C[p.indexOf(w.typeOfDeath)]?"#3C1900":"none"),o(".tempTextT").transition().duration(F).style("opacity",0).remove(),pt(),o(".storyText").remove())}),J=m(a).append("g").classed("axis",!0).attr("transform",`translate(${P},${r*.85})`).call(W.ticks(i<=490?8:13).tickFormat(G("d"))),m(a).append("g").classed("axis",!0).attr("transform",`translate(${P*1.75},${r*.2})`).call(ot.ticks(15).tickFormat(G("d"))),m(a).append("text").attr("x",i/2).attr("y",r*.93).attr("fill","black").style("text-anchor","middle").attr("font-weight",700).classed("axesBigLabel",!0).style("font-size",s*.65).text("Latest Year Alive").style("opacity",1),m(a).append("text").attr("x",-r/2).attr("y",15).attr("fill","black").attr("font-weight",700).style("text-anchor","middle").classed("axesBigLabel",!0).style("font-size",s*.65).text("Most Recent Age").style("opacity",1).attr("transform","rotate(-90)")}else console.error("Unable to load Artist Locations!");h(4,u)};function zt(e){Mt[e?"unshift":"push"](()=>{a=e,h(3,a)})}return c.$$set=e=>{"width"in e&&h(0,d=e.width),"height"in e&&h(1,f=e.height),"topOffset"in e&&h(2,x=e.topOffset)},c.$$.update=()=>{c.$$.dirty[0]&1&&h(15,i=d),c.$$.dirty[0]&2&&h(14,r=f),c.$$.dirty[0]&49155&&(s=f<=d?r/270*15:i/370*15),c.$$.dirty[0]&32768},_=[],Y=[],h(4,u=[]),[d,f,x,a,u,xt,mt,gt,_t,bt,kt,vt,wt,Ot,r,i,zt]}class Zt extends At{constructor(l){super(),Ct(this,l,Xt,$t,St,{width:0,height:1,topOffset:2,chordGroupingFocus:5,chordGroupingReFocus:6,chordRibbonFocus:7,chordRibbonReFocus:8,chordButtonFocus:9,chordButtonReFocus:10,chordButtonClick:11,chordArcClick:12,Initialize:13},null,[-1,-1])}get chordGroupingFocus(){return this.$$.ctx[5]}get chordGroupingReFocus(){return this.$$.ctx[6]}get chordRibbonFocus(){return this.$$.ctx[7]}get chordRibbonReFocus(){return this.$$.ctx[8]}get chordButtonFocus(){return this.$$.ctx[9]}get chordButtonReFocus(){return this.$$.ctx[10]}get chordButtonClick(){return this.$$.ctx[11]}get chordArcClick(){return this.$$.ctx[12]}get Initialize(){return this.$$.ctx[13]}}export{Zt as S};
