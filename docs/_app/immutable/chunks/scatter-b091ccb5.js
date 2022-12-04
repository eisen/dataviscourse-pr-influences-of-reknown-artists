import{S as Ft,i as Pt,s as zt,k as Rt,K as X,l as Tt,m as E,L as j,h as T,n as g,p as G,b as K,F as $,A as lt,H as Bt,T as Mt,q as et,r as at,u as rt,R as Nt}from"./index-57d070b8.js";import{a as A}from"./config-331e8422.js";import{A as _,M as ct,T as H}from"./helpers-2dd99694.js";import{s as y}from"./selectAll-237a4934.js";import{l as it,f as W,m as ft}from"./linear-9a7b9918.js";import{m as I,a as St,b as Et}from"./axis-000f9faf.js";import{g as nt,a as Lt}from"./colors-08d4fe23.js";import{o as Gt}from"./ordinal-7966dd64.js";import{P as It}from"./Paired-3f249ea6.js";function ut(l,n,u){const i=l.slice();return i[41]=n[u],i}function yt(l){let n,u=l[41].name+"",i,s,c,Y=`Aged ${l[41].age}`,h,o,m,r=`${l[41].finalYear}`,x,w;return{c(){n=X("text"),i=et(u),c=X("text"),h=et(Y),m=X("text"),x=et(r),this.h()},l(f){n=j(f,"text",{x:!0,y:!0,id:!0});var d=E(n);i=at(d,u),d.forEach(T),c=j(f,"text",{x:!0,y:!0,id:!0});var D=E(c);h=at(D,Y),D.forEach(T),m=j(f,"text",{x:!0,y:!0,id:!0});var F=E(m);x=at(F,r),F.forEach(T),this.h()},h(){g(n,"x","0"),g(n,"y","0"),g(n,"id",s=_(l[41].name)+"-name"),g(c,"x","0"),g(c,"y","0"),g(c,"id",o=_(l[41].name)+"-age"),g(m,"x","0"),g(m,"y","0"),g(m,"id",w=_(l[41].name)+"-year")},m(f,d){K(f,n,d),$(n,i),K(f,c,d),$(c,h),K(f,m,d),$(m,x)},p(f,d){d[0]&16&&u!==(u=f[41].name+"")&&rt(i,u),d[0]&16&&s!==(s=_(f[41].name)+"-name")&&g(n,"id",s),d[0]&16&&Y!==(Y=`Aged ${f[41].age}`)&&rt(h,Y),d[0]&16&&o!==(o=_(f[41].name)+"-age")&&g(c,"id",o),d[0]&16&&r!==(r=`${f[41].finalYear}`)&&rt(x,r),d[0]&16&&w!==(w=_(f[41].name)+"-year")&&g(m,"id",w)},d(f){f&&T(n),f&&T(c),f&&T(m)}}}function Xt(l){let n,u,i,s,c,Y=l[4],h=[];for(let o=0;o<Y.length;o+=1)h[o]=yt(ut(l,Y,o));return{c(){n=Rt("div"),u=X("svg"),i=X("g"),s=X("g");for(let o=0;o<h.length;o+=1)h[o].c();this.h()},l(o){n=Tt(o,"DIV",{id:!0,class:!0,style:!0});var m=E(n);u=j(m,"svg",{class:!0,viewBox:!0,preserveAspectRatio:!0});var r=E(u);i=j(r,"g",{id:!0,transform:!0}),E(i).forEach(T),s=j(r,"g",{id:!0,opacity:!0});var x=E(s);for(let w=0;w<h.length;w+=1)h[w].l(x);x.forEach(T),r.forEach(T),m.forEach(T),this.h()},h(){g(i,"id","scatterViz"),g(i,"transform","translate(0, 0)"),g(s,"id","hidden-text"),g(s,"opacity","0"),g(u,"class","inline-block absolute top-0 left-0"),g(u,"viewBox",c="0, 0, "+l[0]+", "+l[1]),g(u,"preserveAspectRatio","xMidYMid meet"),g(n,"id","container"),g(n,"class","inline-block relative align-top overflow-hidden"),G(n,"width",l[0]+"px"),G(n,"height",l[1]+"px"),G(n,"top",(l[2]>50?50:l[2]*.9)+"px")},m(o,m){K(o,n,m),$(n,u),$(u,i),l[16](i),$(u,s);for(let r=0;r<h.length;r+=1)h[r].m(s,null)},p(o,m){if(m[0]&16){Y=o[4];let r;for(r=0;r<Y.length;r+=1){const x=ut(o,Y,r);h[r]?h[r].p(x,m):(h[r]=yt(x),h[r].c(),h[r].m(s,null))}for(;r<h.length;r+=1)h[r].d(1);h.length=Y.length}m[0]&3&&c!==(c="0, 0, "+o[0]+", "+o[1])&&g(u,"viewBox",c),m[0]&1&&G(n,"width",o[0]+"px"),m[0]&2&&G(n,"height",o[1]+"px"),m[0]&4&&G(n,"top",(o[2]>50?50:o[2]*.9)+"px")},i:lt,o:lt,d(o){o&&T(n),l[16](null),Bt(h,o)}}}let M=20;const z=250;let R=30;function ht(l){return new Promise(n=>setTimeout(n,l))}function jt(l,n,u){let i,s,c;const Y=Mt();let{width:h=0}=n,{height:o=0}=n,{topOffset:m=0}=n,r,x,w,f,d=[],D,F=!1,N="",L,U,ot,Q,st,J,B=!1,k=0,P=0,V=0,q=0;const dt=a=>{Y("highlight_scatter_dots",{deathGroup:a})},mt=()=>{Y("restore_scatter_dots",{})},pt=a=>{B?console.log("sorry. the points are busy moving right now..."):(y(".allPoints").transition().duration(z).style("opacity",function(p,v){return"0.15"}),y(".allPoints_"+a).transition().duration(z).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2),(a=="murder"&&!F||a=="murder"&&N=="1400")&&(A(r).append("text").attr("x",i/2).attr("y",s*.8).attr("font-size",c*.7).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("According to legend, Masaccio was posioned by a jealous rival").style("opacity",0),y(".storyText").transition().duration(300).style("opacity",1)))},gt=()=>{B?console.log("sorry. the points are busy moving right now..."):(y(".allPoints").transition().duration(z).style("opacity","1.0").attr("stroke",(a,p)=>D[d.indexOf(a.typeOfDeath)]?"#3C1900":"none"),y(".storyText").transition().duration(300).style("opacity",0).remove())},xt=(a,p)=>{B?console.log("sorry. the points are busy moving right now..."):(y(".allPoints").transition().duration(z).style("opacity","0.15"),y(".allPoints_"+a+"_"+p).transition().duration(z).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2),(a=="murder"&&!F||a=="murder"&&N=="1400")&&(A(r).append("text").attr("x",i/2).attr("y",s*.8).attr("font-size",c*.7).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("According to legend, Masaccio was posioned by a jealous rival").style("opacity",0),y(".storyText").transition().duration(300).style("opacity",1)))},_t=()=>{B?console.log("sorry. the points are busy moving right now..."):(y(".allPoints").transition().duration(z).style("opacity","1.0").attr("stroke",(a,p)=>D[d.indexOf(a.typeOfDeath)]?"#3C1900":"none"),y(".storyText").transition().duration(300).style("opacity",0).remove())},kt=(a,p)=>{if(F){y(".allPoints").style("opacity","0.15");for(let v=0;v<p.length;v++)y(".allPoints_"+p[v]+"_"+a).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2)}else{y(".allPoints").style("opacity","0.15");for(let v=0;v<p.length;v++)y(".allPoints_"+p[v]+"_"+a).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2)}},bt=a=>{F?y(".allPoints").style("opacity",function(p,v){return Math.floor(p.finalYear/100)*100==Number(N)?"1.0":"0.0"}).attr("stroke",(p,v)=>D[d.indexOf(p.typeOfDeath)]?"#3C1900":"none"):y(".allPoints").style("opacity","1.0").attr("stroke",(p,v)=>D[d.indexOf(p.typeOfDeath)]?"#3C1900":"none")},vt=(a,p)=>{let v=F;if((v=!0)&&a!=N&&(v=!1),v==!1){B=!0,F=!0,N=a,k=Number(a),P=a=="2000"?Number(a)+22:Number(a)+100;let O=it().domain(a=="2000"?[Number(a),Number(a)+22]:[Number(a),Number(a)+100]).range([R,i-R*2]);J.transition().duration(1e3).call(Q.scale(O).ticks(i<=490?8:13).tickFormat(W("d"))),y(".allPoints").transition().duration(1e3).attr("cx",(C,S)=>O(C.finalYear)+R).style("opacity",0).attr("r",I([i,s])*.015);for(let C=0;C<p.length;C++)y(".allPoints_"+p[C]+"_"+a).transition().duration(1e3).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2).attr("r",I([i,s])*.02).attr("cx",(S,Z)=>O(S.finalYear)+R);ht(1200).then(()=>B=!1)}else{B=!0,F=!1,N="",k=V,P=q,J.transition().duration(1e3).call(Q.scale(L).ticks(i<=490?8:13).tickFormat(W("d"))),y(".allPoints").transition().duration(1e3).attr("cx",(O,C)=>L(O.finalYear)+R).style("opacity",1);for(let O=0;O<p.length;O++)y(".allPoints_"+p[O]+"_"+a).transition().duration(1e3).style("opacity","1.0").attr("stroke","#3C1900").attr("stroke-width",2).attr("r",I([i,s])*.015).attr("cx",(C,S)=>L(C.finalYear)+R);ht(1200).then(()=>B=!1)}},Yt=a=>{D[d.indexOf(a)]=!D[d.indexOf(a)]},wt=(a,p)=>{if(a&&p){x=nt(a,e=>e.artist),w=nt(p,e=>e.artist);let v=nt(p,e=>e.death_type);for(let e=0;e<v.length;e++)d.push(v[e][0]);d.sort(Lt),D=new Array(d.length).fill(!1);let O,C,S=!1,Z;for(let e=0;e<x.length;e++){S=!1,x[e][1].length>1?(O=Number(x[e][1][1].year)-Number(x[e][1][0].year),C=Number(x[e][1][1].year)):(O=2022-Number(x[e][1][0].year),C=2022);for(let t=0;t<w.length;t++)if(w[t][0]==x[e][0]){Z=w[t][1][0].death_type,S=!0;break}S&&f.push({name:x[e][0],age:O,finalYear:C,typeOfDeath:Z})}q=ft(f,function(e){return e.finalYear}),V=I(f,function(e){return e.finalYear});let At=ft(f,function(e){return e.age});I(f,function(e){return e.age}),k=V,P=q,L=it().domain([V,q]).range([R,i-R*2]),U=it().domain([At,0]).range([0,s*.65]),ot=Gt().domain(d).range(It),Q=St(L),st=Et(U);let Dt=A(r).append("g").attr("class","pointGroup").selectAll("g").data(f).enter().append("g").attr("transform",e=>"translate(0, 0)");c>30&&(c=30),Dt.append("circle").attr("cx",(e,t)=>L(e.finalYear)+R).attr("cy",(e,t)=>U(e.age)+s*.2).attr("r",(e,t)=>I([i,s])*.015).attr("fill",(e,t)=>ot(e.typeOfDeath)).attr("class",function(e,t){return"allPoints_"+e.typeOfDeath+" allPoints_"+e.typeOfDeath+"_"+Math.floor(e.finalYear/100)*100}).classed("allPoints",!0).on("mouseover",function(e,t,tt=B){tt||(y(".allPoints").transition().duration(z).style("opacity",.15).attr("stroke",(b,Ct)=>D[d.indexOf(b.typeOfDeath)]?"#3C1900":"none"),A(this).transition().duration(z).style("opacity",1).attr("stroke","#3C1900").attr("stroke-width",2),(t.typeOfDeath=="murder"&&!F||t.typeOfDeath=="murder"&&N=="1400")&&(A(r).append("text").attr("x",i/2).attr("y",s*.8).attr("font-size",c*.7).style("fontStyle","italic").attr("text-anchor","middle").classed("storyText",!0).text("According to legend, Masaccio was posioned by a jealous rival").style("opacity",0),y(".storyText").transition().duration(300).style("opacity",1)),y(".tempTextT").remove(),A(r).append("rect").classed("tempTextT",!0).attr("rx",6).attr("ry",6).attr("width",()=>ct(["#"+_(t.name)+"-name","#"+_(t.name)+"-age","#"+_(t.name)+"-year"],[t.name,`Aged ${t.age}`,`${t.finalYear}`])+M).attr("height",()=>(H("#"+_(t.name)+"-name",t.name)+M*.5)*3).attr("fill","white").attr("stroke","black").attr("opacity",0).attr("x",function(){let b=0;return(t.finalYear-k)/(P-k)>=.8?b=-i*.1:(t.finalYear-k)/(P-k)<=.2&&(b=i*.1),e.offsetX+b-(ct(["#"+_(t.name)+"-name","#"+_(t.name)+"-age","#"+_(t.name)+"-year"],[t.name,`Aged ${t.age}`,`${t.finalYear}`])+M)*.5}).attr("y",e.offsetY-1.25*M-(H("#"+_(t.name)+"-name",t.name)+M*.5)*3),A(r).append("text").attr("x",function(){let b=0;return(t.finalYear-k)/(P-k)>=.8?b=-i*.1:(t.finalYear-k)/(P-k)<=.2&&(b=i*.1),e.offsetX+b}).attr("y",e.offsetY-(H("#"+_(t.name)+"-name",t.name)+M*.5)*3).attr("fill","black").style("text-anchor","middle").classed("tempTextT",!0).attr("id",()=>_(t.name)+"-name").style("font-size",t.name.length>=15?c*.52:c*.6).text(`${t.name}`).style("opacity",0),A(r).append("text").attr("x",function(){let b=0;return(t.finalYear-k)/(P-k)>=.8?b=-i*.1:(t.finalYear-k)/(P-k)<=.2&&(b=i*.1),e.offsetX+b}).attr("y",e.offsetY+.125*M-(H("#"+_(t.name)+"-name",t.name)+M*.5)*2).attr("fill","black").style("text-anchor","middle").classed("tempTextT",!0).style("font-size",c*.6).attr("id",()=>_(t.name)+"-age").text(`Aged ${t.age}`).style("opacity",0),A(r).append("text").attr("x",function(){let b=0;return(t.finalYear-k)/(P-k)>=.8?b=-i*.1:(t.finalYear-k)/(P-k)<=.2&&(b=i*.1),e.offsetX+b}).attr("y",e.offsetY-(H("#"+_(t.name)+"-name",t.name)+M*.5)).attr("id",()=>_(t.name)+"-year").attr("fill","black").style("text-anchor","middle").classed("tempTextT",!0).style("font-size",c*.6).text(`${t.finalYear}`).style("opacity",0),y(".tempTextT").transition().duration(z).style("opacity",1),dt(t.typeOfDeath))}).on("mouseout",function(e,t,tt=B){tt||(y(".allPoints").transition().duration(z).style("opacity",1).attr("stroke",(b,Ct)=>D[d.indexOf(b.typeOfDeath)]?"#3C1900":"none"),y(".tempTextT").transition().duration(z).style("opacity",0).remove(),mt(),y(".storyText").transition().duration(300).style("opacity",0).remove())}),J=A(r).append("g").classed("axis",!0).attr("transform",`translate(${R},${s*.85})`).call(Q.ticks(i<=490?8:13).tickFormat(W("d"))),A(r).append("g").classed("axis",!0).attr("transform",`translate(${R*1.75},${s*.2})`).call(st.ticks(15).tickFormat(W("d"))),A(r).append("text").attr("x",i/2).attr("y",s*.93).attr("fill","black").style("text-anchor","middle").attr("font-weight",700).classed("axesBigLabel",!0).style("font-size",c*.65).text("Latest Year Alive").style("opacity",1),A(r).append("text").attr("x",-s/2).attr("y",15).attr("fill","black").attr("font-weight",700).style("text-anchor","middle").classed("axesBigLabel",!0).style("font-size",c*.65).text("Most Recent Age").style("opacity",1).attr("transform","rotate(-90)")}else console.error("Unable to load Artist Locations!");u(4,f)};function Ot(a){Nt[a?"unshift":"push"](()=>{r=a,u(3,r)})}return l.$$set=a=>{"width"in a&&u(0,h=a.width),"height"in a&&u(1,o=a.height),"topOffset"in a&&u(2,m=a.topOffset)},l.$$.update=()=>{l.$$.dirty[0]&1&&u(15,i=h),l.$$.dirty[0]&2&&u(14,s=o),l.$$.dirty[0]&49155&&(c=o<=h?s/270*15:i/370*15),l.$$.dirty[0]&32768},x=[],w=[],u(4,f=[]),[h,o,m,r,f,pt,gt,xt,_t,kt,bt,vt,Yt,wt,s,i,Ot]}class Zt extends Ft{constructor(n){super(),Pt(this,n,jt,Xt,zt,{width:0,height:1,topOffset:2,chordGroupingFocus:5,chordGroupingReFocus:6,chordRibbonFocus:7,chordRibbonReFocus:8,chordButtonFocus:9,chordButtonReFocus:10,chordButtonClick:11,chordArcClick:12,Initialize:13},null,[-1,-1])}get chordGroupingFocus(){return this.$$.ctx[5]}get chordGroupingReFocus(){return this.$$.ctx[6]}get chordRibbonFocus(){return this.$$.ctx[7]}get chordRibbonReFocus(){return this.$$.ctx[8]}get chordButtonFocus(){return this.$$.ctx[9]}get chordButtonReFocus(){return this.$$.ctx[10]}get chordButtonClick(){return this.$$.ctx[11]}get chordArcClick(){return this.$$.ctx[12]}get Initialize(){return this.$$.ctx[13]}}export{Zt as S};