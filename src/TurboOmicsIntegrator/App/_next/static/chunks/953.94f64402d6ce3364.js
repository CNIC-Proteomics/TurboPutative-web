"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[953],{13716:function(e,t,l){l.d(t,{E:function(){return s},c:function(){return i}});var n=l(57437),a=l(96507);function s(e){let{children:t,sx:l}=e;return(0,n.jsx)(a.Z,{sx:{...l},style:{scrollSnapAlign:"center",border:"0px solid yellow"},children:t})}function i(e){let{children:t,height:l}=e;return(0,n.jsx)(a.Z,{sx:{height:{height:l},scrollSnapType:"y mandatory",overflow:"auto",border:"0px solid red"},children:t})}l(2265)},50294:function(e,t,l){l.d(t,{$S:function(){return c},AT:function(){return o}});var n=l(57437),a=l(64728),s=l(96507),i=l(2265),r=l(97472);function o(e){let{options:t,handleSelect:l,label:o}=e,c=(0,a.a0)().EDA.DD.groupby,[u,d]=(0,i.useState)(c);return(0,n.jsxs)(s.Z,{children:[(0,n.jsx)("label",{id:"aria-label",htmlFor:"aria-example-input",children:o}),(0,n.jsx)(r.ZP,{"aria-labelledby":"aria-label",inputId:"aria-example-input",className:"basic-single",classNamePrefix:"select",placeholder:"",isSearchable:!0,isClearable:!1,options:t,value:u,onChange:e=>{d({label:e.value,value:e.value}),setTimeout(()=>l(e),100)}})]})}function c(e){let{options:t,value:l,onChange:a,label:i}=e;return(0,n.jsxs)(s.Z,{children:[(0,n.jsx)("label",{id:"aria-label",htmlFor:"aria-example-input",children:i}),(0,n.jsx)(r.ZP,{"aria-labelledby":"aria-label",inputId:"aria-example-input",className:"basic-single",classNamePrefix:"select",placeholder:"",isSearchable:!0,isClearable:!1,options:t,value:l,onChange:a})]})}},19636:function(e,t,l){l.d(t,{Z:function(){return o}});var n=l(57437),a=l(11093),s=l(41637),i=l(96507),r=l(2265);function o(e){let{selOmic:t,setSelOmic:l,omicViewRef:r}=e,{omics:o}=(0,s.tc)(),{OMIC2NAME:u}=(0,a.S)();return(0,n.jsx)(i.Z,{sx:{display:"flex",justifyContent:"center",mt:1},children:o.map((e,a)=>(0,n.jsx)(c,{selOmic:t,id:e,title:u[e],setSelOmic:l,omicViewRef:r},e))})}let c=e=>{let{selOmic:t,id:l,title:a,setSelOmic:o,omicViewRef:c}=e,{omics:u}=(0,s.tc)(),[d,h]=(0,r.useState)(!1),x=l==t,f="#00000015",p="#000000aa";return x?(f="#1976D2ff",p="#ffffff"):d&&(f="#00000033",p="#000000aa"),(0,n.jsx)(i.Z,{sx:{px:3,py:1,mx:.1,fontSize:"1.1em",color:p,backgroundColor:f,userSelect:"none",cursor:"pointer",transition:"ease 1s"},onMouseEnter:()=>h(!0),onMouseLeave:()=>h(!1),onClick:()=>{let e=u.indexOf(l)-u.indexOf(t);setTimeout(()=>{c.current.scrollLeft=c.current.scrollLeft+e*c.current.clientWidth},100),o(l)},children:a})}},93097:function(e,t,l){let{default:n}=l(31863),a=async(e,t,l)=>{let a=e.container.firstChild.cloneNode(!0),s=t.firstChild.firstChild.firstChild,i=s.children[0].cloneNode(!0),r=s.children[2].cloneNode(!0),o=window.document.createElement("div");o.style.position="relative";let c=window.document.createElement("div");c.appendChild(a),c.style.paddingLeft="20px";let u=window.document.createElement("div");u.appendChild(i);let d=window.document.createElement("div");d.style.position="absolute",d.style.top="230px",d.appendChild(r),o.appendChild(c),o.appendChild(u),o.appendChild(d);let h=window.document.createElement("div");h.appendChild(c),console.log(h);let x=window.document.createElement("div");x.appendChild(u),n(h,"DensityPlot_".concat(l)),n(x,"BoxPlot_".concat(l))};e.exports=a},15632:function(e,t,l){function n(e,t){let l=Math.min(...e),n=(Math.max(...e)-l)/t,a=Array(t).fill(0);e.forEach(e=>{let s=Math.floor((e-l)/n);s>=0&&s<t&&a[s]++});let s=a.map(t=>t/(e.length*n)),i=Array(t).fill(0).map((e,t)=>l+(t+.5)*n),r=[];for(let e=0;e<t;e++)r.push({binCenter:i[e],density:s[e]});return r}function a(e,t){let l=e.slice().sort((e,t)=>e-t),n=Math.floor(l.length*t),a=l[n];return a}function s(e,t,l){let n=(t-e)/(l-1),a=[];for(let t=0;t<l;t++){let l=e+t*n;a.push(l)}return a.filter(e=>e<0).length>0&&a.filter(e=>e>0).length>0&&a.push(0),a.sort((e,t)=>e-t),a=a.map(e=>e<=0?Math.floor(100*e)/100:e>0?Math.ceil(100*e)/100:void 0)}l.d(t,{jI:function(){return s},vi:function(){return a},wH:function(){return n}})},14953:function(e,t,l){l.r(t),l.d(t,{default:function(){return U}});var n=l(57437),a=l(2265),s=l(60642),i=l(55303),r=l(85269),o=l(96507),c=l(41637),u=l(38939),d=l(15632),h=l(90045),x=l(16573),f=l(24235),p=l(50039),m=l(2047),b=l(51125),g=l(90053);function j(e){let{dataHist:t,gValues:l,xrange:a,yrange:s,xTicks:i,figRef:r,omic:o}=e;return(0,n.jsxs)(h.T,{ref:e=>{r.current[o].Hist=e},style:{margin:"auto"},width:500,height:210,data:t,margin:{top:10,right:30,left:0,bottom:0},children:[(0,n.jsx)(x.q,{strokeDasharray:"3 3"}),(0,n.jsx)(f.K,{dataKey:"binCenter",type:"number",ticks:i,domain:a}),(0,n.jsx)(p.B,{domain:s}),(0,n.jsx)(m.u,{}),l.map((e,t)=>(0,n.jsx)(b.u,{connectNulls:!0,type:"monotone",dataKey:e,fillOpacity:.3,stroke:g.s[t%g.s.length],fill:g.s[t%g.s.length]},e))]})}var v=l(98864),y=l.n(v);let w=y()(()=>Promise.all([l.e(934),l.e(901)]).then(l.bind(l,87022)),{loadableGenerated:{webpack:()=>[87022]},ssr:!1});function C(e){let{data:t,xrange:l,xTicks:a,figRef:s,omic:i}=e;return(0,n.jsx)(o.Z,{ref:e=>{s.current[i].Box=e},children:(0,n.jsx)(w,{style:{position:"relative",left:-20},data:t,layout:{width:570,height:280,showlegend:!0,legend:{orientation:"h"},xaxis:{zeroline:!1,range:l,tickvals:a},yaxis:{type:"category",showticklabels:!1},margin:{t:0}},config:{staticPlot:!0,displayModeBar:!1},onChange:e=>console.log(e)})})}var Z=l(10537),A=l(9140);function S(e){let{omic:t,fileType:l,filteredID:s,groupby:i,showNorm:r,figRef:u}=e,h=(0,c.tc)().user.mdata,x=(0,c.tc)().norm[l],f=(0,a.useMemo)(()=>{let e=Math.floor(Math.max(1,s.length/1e4)),t=[];for(let l=0;l<s.length;l+=e)t.push(s[l]);let l=[],n=(0,Z.$i)(x.T);for(let e=0;e<t.length;e++)l.push(n[t[e]]);let a=new dfd.DataFrame(l);return a.setIndex({index:t,inplace:!0}),(0,Z.$i)(a.T)},[x,s]),{myData:p,gValues:m,idx2g:b}=(0,a.useMemo)(()=>{let e={};for(let t=0;t<h.shape[0];t++)h.columns.includes(i)?null!=h.column(i).values[t]&&(e[h.index[t]]=h.column(i).values[t]):e[h.index[t]]="All values";let t=Object.keys(e).map(t=>e[t]).filter((e,t,l)=>l.indexOf(e)===t),l={};return t.map(e=>l[e]=[]),Object.keys(f).map(t=>{Object.keys(e).includes(t)&&Object.keys(f[t]).map(n=>l[e[t]].push(f[t][n]))}),{myData:l,gValues:t,idx2g:e}},[i,h,f]),{xrange:v,xTicks:y,minimum:w,maximum:S}=(0,a.useMemo)(e=>{let t=Object.keys(p).map(e=>p[e]).flat(),l=(0,d.vi)(t,1e-4),n=(0,d.vi)(t,.9999),a=[l-Math.abs(.05*l),n+Math.abs(.05*n)],s=(0,d.jI)(l,n,6);return{xrange:a,xTicks:s,minimum:l,maximum:n}},[p]),{dataHist:k,yrange:E}=(0,a.useMemo)(()=>{let e={};Object.keys(p).map(t=>{e[t]=p[t].filter(e=>w<=e&&e<=S);let l=Math.max(1,Math.floor(e[t].length/5e4)),n=[];for(let a=0;a<e[t].length;a+=l)n.push(e[t][a]);n.push(e[t].slice(-1)),e[t]=n}),Object.keys(e).map(t=>{try{e[t].length>0?e[t]=(0,d.wH)(e[t],1+Math.ceil(Math.log2(e[t].length))):delete e[t]}catch(e){console.error(e)}}),(e=(e=Object.keys(e).map(t=>e[t].map(e=>{let{binCenter:l,density:n}=e;return{binCenter:Math.round(100*l)/100,[t]:Number.parseFloat(n).toExponential(3),d:n}}))).flat()).sort((e,t)=>e.binCenter-t.binCenter);let t=0,l=e.map(e=>e.d);for(let e=0;e<l.length;e++)t=l[e]>t?l[e]:t;let n=[0,Number.parseFloat((1.05*t).toPrecision(2))];return{dataHist:e,yrange:n}},[p,w,S]),D=(0,a.useMemo)(()=>Object.keys(p).map((e,t)=>p[e].length>0?{x:p[e],type:"box",name:"".concat(e),marker:{color:g.s[t%g.s.length]}}:null).filter(e=>null!=e),[p]);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.Z,{sx:{height:210},children:(0,n.jsx)(j,{dataHist:k,gValues:m,xrange:v,xTicks:y,yrange:E,figRef:u,omic:t})}),(0,n.jsx)(o.Z,{sx:{height:280,width:500,margin:"auto",overflowX:"hidden",overflowY:"hidden"},children:(0,n.jsx)(A.Z,{children:(0,n.jsx)(C,{data:D,xrange:v,xTicks:y,figRef:u,omic:t})})})]})}var k=l(50294),E=l(67248),D=l(33457);function F(e){let{columns:t,data:l}=e,s=(0,a.useRef)(null),[i,r]=(0,a.useState)(!0),[o,c]=(0,a.useState)([]);(0,a.useEffect)(()=>{r(!1)},[]),(0,a.useEffect)(()=>{try{var e,t;null===(t=s.current)||void 0===t||null===(e=t.scrollToIndex)||void 0===e||e.call(t,0)}catch(e){console.error(e)}},[o]);let u=(0,D.X0)({columns:t,data:l,defaultDisplayColumn:{enableResizing:!0},layoutMode:"grid",enableBottomToolbar:!1,enableTopToolbar:!1,enableColumnResizing:!1,enableColumnVirtualization:!0,enableGlobalFilterModes:!1,enablePagination:!1,enableColumnPinning:!1,enableRowNumbers:!1,enableRowVirtualization:!0,enableColumnFilters:!1,muiTableContainerProps:{sx:{maxHeight:"450px"}},onSortingChange:c,state:{isLoading:i,sorting:o},rowVirtualizerInstanceRef:s,rowVirtualizerOptions:{overscan:5},columnVirtualizerOptions:{overscan:2}});return(0,n.jsx)(A.Z,{children:(0,n.jsx)("div",{style:{opacity:.9,width:"100%",margin:"auto"},children:(0,n.jsx)(D.P2,{table:u})})})}var M=l(64728),T=l(75745);function O(e){let{omic:t,setFilteredID:l,updatePlot:s}=e,i=(0,M.a0)().EDA.DD.filterText["".concat(t,"2i")],[r,c]=(0,a.useState)(i),u=(0,M.a0)().EDA.DD.filterCol["".concat(t,"2i")],[d,h]=(0,a.useState)(u),[x]=(0,T.Z)(t),{filteredFeatures:f,columns:p}=(0,a.useMemo)(()=>{console.log("calculating filteredFeatures");let e=[],t=[{accessorKey:" ",header:" ",size:60}];if(x.columns.includes(d)){e=(e=x.column(d)).values.map((t,l)=>({" ":e.index[l],[d]:t}));let l=RegExp("");try{l=new RegExp(r)}catch(e){l=RegExp("")}e=e.filter(e=>null!=e[d]&&l.test(e[d])),t.push({accessorKey:d,header:d})}else e=(e=x.index).map((e,t)=>({" ":e}));return{filteredFeatures:e,columns:t}},[r,d,x]);return(0,a.useEffect)(()=>{console.log("useEffect: Recalculating features");let e=setTimeout(()=>{l(f.map(e=>e[" "])),s([t]),console.log("Features recalculated")},1e3);return()=>clearTimeout(e)},[f,l,s,t]),(0,n.jsxs)(o.Z,{sx:{width:"95%",margin:"auto"},children:[(0,n.jsxs)(o.Z,{sx:{display:"flex",height:"10vh"},children:[(0,n.jsx)(o.Z,{sx:{width:"40%",pt:1},children:(0,n.jsx)(k.$S,{options:[{label:"All features",value:"All features"},...x.columns.map(e=>({label:e,value:e}))],onChange:e=>h(e.value),value:{label:d,value:d}})}),x.columns.includes(d)&&(0,n.jsx)(A.Z,{children:(0,n.jsx)(o.Z,{sx:{mt:3,ml:3},children:(0,n.jsx)(E.Z,{id:"standard-name",placeholder:"Filter text",value:r,onChange:e=>c(e.target.value)})})})]}),(0,n.jsx)(o.Z,{sx:{mt:0},children:(0,n.jsx)(F,{data:f,columns:p})})]})}var P=l(93097),R=l.n(P);l(13716);var I=l(11093),N=l(46776),B=l(47042),z=l(52481),L=function(e){let{omic:t,figRef:l,showPlot:s,showNorm:i,updatePlot:c,groupby:u}=e,[d,h]=(0,a.useState)(),{OMIC2NAME:x}=(0,I.S)();return(0,n.jsx)(o.Z,{children:(0,n.jsxs)(o.Z,{sx:{display:"flex",justifyContent:"space-evenly",alignItems:"flex-start"},children:[(0,n.jsxs)(o.Z,{sx:{width:"45%",height:"600px",pt:4},children:[(0,n.jsxs)(r.Z,{variant:"h6",sx:{textAlign:"center",color:"#555555"},children:["Data Distribution",(0,n.jsx)(N.Z,{"aria-label":"download",size:"small",onClick:e=>R()(l.current[t].Hist,l.current[t].Box,x[t]),sx:{opacity:.5,visibility:s[t]?"visible":"hidden",paddingBottom:1},children:(0,n.jsx)(z.Z,{})})]}),s[t]?(0,n.jsx)(o.Z,{sx:{height:500,overflow:"hidden",mt:3},children:(0,n.jsx)(S,{omic:t,fileType:"x".concat(t),filteredID:d,groupby:u,showNorm:i,figRef:l})}):(0,n.jsx)(o.Z,{sx:{textAlign:"center",pt:20,height:550},children:(0,n.jsx)(B.Z,{size:100,thickness:2})})]}),(0,n.jsx)(o.Z,{sx:{width:"45%",height:"600px"},children:(0,n.jsx)(O,{omic:t,setFilteredID:h,updatePlot:c})})]})})},_=l(19636);function G(){let e=(0,a.useRef)(),{omics:t}=(0,c.tc)(),[l,s]=(0,a.useState)(t[0]),i=(0,a.useRef)(t.reduce((e,t)=>({...e,[t]:{}}),{})),r=(0,M.mX)(),d=(0,M.a0)().EDA.DD.showNorm,[h,x]=(0,a.useState)(d),f=(0,M.a0)().EDA.DD.groupby,[p,m]=(0,a.useState)(f),{mdataType:b}=(0,c.tc)(),g=(0,c.tc)().user.mdata.columns.map(e=>({label:e,value:e})).filter(e=>"categorical"==b[e.value].type);g=[{label:"All values",value:"All values"},...g];let[j,v]=(0,a.useState)(t.reduce((e,t)=>({...e,[t]:!1}),{})),y=(0,a.useCallback)(function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e;e.map(e=>{v(t=>({...t,[e]:!1}))}),e.map(e=>setTimeout(()=>v(t=>({...t,[e]:!0})),300))},[]),w=(0,a.useCallback)(e=>{let l={label:e.value,value:e.value};m(l),r({type:"set-eda-dd-groupby",groupby:l}),y(t)},[y,t,r]);return(0,a.useCallback)(e=>{x(e.target.checked),y(t)},[y,t]),(0,n.jsxs)(o.Z,{children:[(0,n.jsx)(_.Z,{selOmic:l,setSelOmic:s,omicViewRef:e}),(0,n.jsxs)(u.ZP,{container:!0,direction:"row",justifyContent:"center",alignItems:"center",sx:{mb:3,mt:3},children:[!1,(0,n.jsx)(u.ZP,{item:!0,xs:3,children:(0,n.jsx)(k.AT,{options:g,handleSelect:w,label:"Group by"})})]}),(0,n.jsx)(o.Z,{ref:e,sx:{overflow:"hidden"},children:(0,n.jsx)(o.Z,{sx:{display:"flex",width:"".concat(t.length,"00%")},children:t.map(e=>(0,n.jsx)(o.Z,{sx:{width:"".concat(100/t.length,"%"),opacity:l==e?1:0,transition:"all 1s ease"},children:(0,n.jsx)(L,{omic:e,figRef:i,showPlot:j,showNorm:h,updatePlot:y,groupby:p.value})},e))})})]})}var H=l(15095);let V=y()(()=>Promise.all([l.e(48),l.e(125),l.e(16),l.e(141)]).then(l.bind(l,17141)),{loadableGenerated:{webpack:()=>[17141]}}),Y=y()(()=>Promise.all([l.e(48),l.e(227),l.e(125),l.e(16),l.e(124),l.e(113)]).then(l.bind(l,113)),{loadableGenerated:{webpack:()=>[113]}}),X=y()(()=>Promise.all([l.e(813),l.e(48),l.e(261),l.e(227),l.e(30),l.e(794),l.e(468)]).then(l.bind(l,27130)),{loadableGenerated:{webpack:()=>[27130]}}),K=y()(()=>Promise.all([l.e(48),l.e(125),l.e(794),l.e(589)]).then(l.bind(l,23589)),{loadableGenerated:{webpack:()=>[23589]}});function U(){let e=(0,M.mX)(),{API_URL:t}=(0,I.S)(),l=(0,a.useRef)(),u=(0,M.a0)().status,[d,h]=(0,a.useState)(u),x=(0,M.a0)().value,[f,p]=(0,a.useState)(x),{jobID:m,omics:b}=(0,c.tc)(),g=(0,a.useCallback)(async()=>{let n=await fetch("".concat(t,"/get_status/").concat(m,"/").concat(b.join(""))),a=await n.json();Object.keys(d).some(e=>d[e].status!=a[e].status)&&(console.log("Set status: ".concat(a)),h(a),e({type:"set-status",status:a})),Object.keys(a).every(e=>"waiting"!=a[e].status)&&clearInterval(l.current)},[t,m,l,e,d,b]);return(0,a.useEffect)(()=>{if(console.log("useEffect: Check status"),Object.keys(u).some(e=>"waiting"==u[e].status))return console.log("useEffect: Initialize status fetching"),l.current=setInterval(g,2500),()=>clearInterval(l.current)},[l,g,u]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(r.Z,{variant:"body2",sx:{textAlign:"right",pr:4},children:["Job ID: ",m]}),(0,n.jsxs)(o.Z,{sx:{display:"flex",flexGrow:1,bgcolor:"background.paper"},children:[(0,n.jsx)(o.Z,{sx:{width:"15%",borderRight:1,borderColor:"divider"},children:(0,n.jsxs)(s.Z,{orientation:"vertical",variant:"scrollable",value:f,onChange:(t,l)=>{p(l),e({type:"set-tab-value",value:l})},"aria-label":"Results Sections Tabs",sx:{width:"15%",position:"fixed"},children:[(0,n.jsx)(i.Z,{label:(0,n.jsx)($,{text:"EXPLORATORY DATA ANALYSIS",status:""}),value:.1,sx:{mt:2,p:0,color:0==Math.floor(f)?"#1976d2":"#00000099"}}),(0,n.jsx)(i.Z,{label:(0,n.jsx)($,{text:"DATA DISTRIBUTION",status:""}),value:.1,sx:{fontSize:12,m:0,p:0,borderTop:"1px solid #cccccc"}}),(0,n.jsx)(i.Z,{label:(0,n.jsx)($,{text:"PCA",status:d.EDA_PCA.status}),value:.2,sx:{fontSize:12,m:0,p:0,borderBottom:"1px solid #cccccc"},disabled:"ok"!=d.EDA_PCA.status}),(0,n.jsx)(i.Z,{label:(0,n.jsx)($,{text:"MULTIOMICS FACTOR ANALYSIS",status:d.MOFA.status}),value:1.1,sx:{fontSize:12,mt:2,p:0},disabled:"ok"!=d.MOFA.status}),(0,n.jsx)(i.Z,{label:(0,n.jsx)($,{text:"PATHWAY ANALYSIS",status:""}),value:2.1,sx:{fontSize:12,m:0,p:0},disabled:!1}),(0,n.jsx)(i.Z,{label:(0,n.jsx)($,{text:"ENRICHMENT ANALYSIS",status:""}),value:3.1,sx:{fontSize:12,m:0,p:0},disabled:!1})]})}),(0,n.jsxs)(o.Z,{sx:{width:"85%",borderTop:"1px solid #cccccc"},children:[.1==f&&(0,n.jsx)(o.Z,{sx:{p:1},children:(0,n.jsx)(G,{})}),.2==f&&(0,n.jsx)(o.Z,{sx:{p:1},children:(0,n.jsx)(V,{})}),1.1==f&&(0,n.jsx)(o.Z,{sx:{p:1},children:(0,n.jsx)(Y,{})}),2.1==f&&(0,n.jsx)(o.Z,{sx:{p:1},children:(0,n.jsx)(K,{})}),3.1==f&&(0,n.jsx)(o.Z,{sx:{p:1},children:(0,n.jsx)(X,{})})]})]})]})}let $=e=>{let{text:t,status:l}=e;return(0,n.jsxs)(u.ZP,{container:!0,sx:{m:"auto",height:55},children:[("waiting"==l||"error"==l)&&(0,n.jsx)(o.Z,{sx:{position:"absolute",height:"100%"},children:(0,n.jsxs)(o.Z,{sx:{height:20,position:"relative",top:"35%",left:20},children:["waiting"==l&&(0,n.jsx)(B.Z,{sx:{verticalAlign:"middle"},size:15,thickness:5}),"error"==l&&(0,n.jsx)(H.Z,{})]})}),(0,n.jsx)(r.Z,{sx:{m:"auto",width:"85%",fontSize:13,position:"relative",right:-12},children:t})]})}},75745:function(e,t,l){var n=l(41637),a=l(2265);t.Z=function(e){let t=(0,n.tc)().user["".concat(e,"2i")],l=(0,n.tc)().f2x[e],s=(0,a.useMemo)(()=>{let e=dfd.toJSON(t).filter((e,t)=>l[t]);return(e=new dfd.DataFrame(e)).setIndex({column:e.columns[0],inplace:!0}),e},[t,l]);return[s]}},31863:function(e,t,l){function n(e,t){let l=new XMLSerializer().serializeToString(e.childNodes[0].childNodes[0]),n=new Blob([l],{type:"image/svg+xml;charset=utf-8"});var a=URL.createObjectURL(n);let s=window.document.createElement("a");s.style="display:none",s.download="".concat(t),s.href=a,document.body.appendChild(s),s.click(),document.body.removeChild(s),s.remove()}l.r(t),l.d(t,{default:function(){return n}})},90053:function(e,t,l){l.d(t,{s:function(){return n}});let n=["#636EFA","#EF553B","#00CC96","#AB63FA","#FFA15A","#19D3F3","#FF6692","#B6E880","#FF97FF","#FECB52","#2E91E5","#E15F99","#1CA71C","#FB0D0D","#DA16FF","#222A2A","#B68100","#750D86","#EB663B","#511CFB","#00A08B","#FB00D1","#FC0080","#B2828D","#6C7C32","#778AAE","#862A16","#A777F1","#620042","#1616A7","#DA60CA","#6C4516","#0D2A63","#AF0038"]}}]);