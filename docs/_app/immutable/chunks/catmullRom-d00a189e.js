import{e as u}from"./math-84088ecb.js";function k(_){for(var i=_.length/6|0,n=new Array(i),s=0;s<i;)n[s]="#"+_.slice(s*6,++s*6);return n}function x(_,i,n){_._context.bezierCurveTo(_._x1+_._k*(_._x2-_._x0),_._y1+_._k*(_._y2-_._y0),_._x2+_._k*(_._x1-i),_._y2+_._k*(_._y1-n),_._x2,_._y2)}function l(_,i){this._context=_,this._k=(1-i)/6}l.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:x(this,this._x1,this._y1);break}(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line=1-this._line},point:function(_,i){switch(_=+_,i=+i,this._point){case 0:this._point=1,this._line?this._context.lineTo(_,i):this._context.moveTo(_,i);break;case 1:this._point=2,this._x1=_,this._y1=i;break;case 2:this._point=3;default:x(this,_,i);break}this._x0=this._x1,this._x1=this._x2,this._x2=_,this._y0=this._y1,this._y1=this._y2,this._y2=i}};(function _(i){function n(s){return new l(s,i)}return n.tension=function(s){return _(+s)},n})(0);function f(_,i,n){var s=_._x1,t=_._y1,e=_._x2,o=_._y2;if(_._l01_a>u){var h=2*_._l01_2a+3*_._l01_a*_._l12_a+_._l12_2a,c=3*_._l01_a*(_._l01_a+_._l12_a);s=(s*h-_._x0*_._l12_2a+_._x2*_._l01_2a)/c,t=(t*h-_._y0*_._l12_2a+_._y2*_._l01_2a)/c}if(_._l23_a>u){var r=2*_._l23_2a+3*_._l23_a*_._l12_a+_._l12_2a,a=3*_._l23_a*(_._l23_a+_._l12_a);e=(e*r+_._x1*_._l23_2a-i*_._l12_2a)/a,o=(o*r+_._y1*_._l23_2a-n*_._l12_2a)/a}_._context.bezierCurveTo(s,t,e,o,_._x2,_._y2)}function p(_,i){this._context=_,this._alpha=i}p.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:this.point(this._x2,this._y2);break}(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line=1-this._line},point:function(_,i){if(_=+_,i=+i,this._point){var n=this._x2-_,s=this._y2-i;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(n*n+s*s,this._alpha))}switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(_,i):this._context.moveTo(_,i);break;case 1:this._point=2;break;case 2:this._point=3;default:f(this,_,i);break}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=_,this._y0=this._y1,this._y1=this._y2,this._y2=i}};const b=function _(i){function n(s){return i?new p(s,i):new l(s,0)}return n.alpha=function(s){return _(+s)},n}(.5);export{b as a,k as c};