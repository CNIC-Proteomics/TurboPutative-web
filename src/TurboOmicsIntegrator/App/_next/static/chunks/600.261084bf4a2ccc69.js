"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[600],{51600:function(e,a,t){t.r(a);var l=t(57437),n=t(96507),o=t(49600),i=t(2265),r=t(93202),s=t(80553),c=t(92069),u=t(33457);a.default=e=>{let{mCat:a,idType:t}=e,p=t.id,{myData:d,mySet:g}=(0,i.useMemo)(()=>{let e=[];a.pathway_mapped.map(t=>{let l=s.g[a.db].indexOf(t);e.push({ID:s.g[p][l],Name:s.g.Name[l],Target:a.pathway_sig.includes(t)})}),e.sort((e,a)=>a.Target-e.Target);let t={};return e.map(e=>{e.Target&&(t[e.ID]=!0)}),{myData:e,mySet:t}},[a,p]),m=(0,i.useMemo)(()=>[{header:"ID",accessorKey:"ID",size:60},{header:"Name",accessorKey:"Name",size:60}],[]),b=()=>{let e=(0,c.iL)({fieldSeparator:",",decimalSeparator:".",useKeysAsHeaders:!0,filename:"CategoryMetabolites"}),a=d.map(e=>({ID:e.ID,Name:e.Name,Filtered:e.Target})),t=(0,c.gB)(e)(a);(0,c.LR)(e)(t)},x=(0,i.useRef)(null),[f,h]=(0,i.useState)(!0),[w,y]=(0,i.useState)([]);(0,i.useEffect)(()=>{h(!1)},[]),(0,i.useEffect)(()=>{try{var e,a;null===(a=x.current)||void 0===a||null===(e=a.scrollToIndex)||void 0===e||e.call(a,0)}catch(e){console.error(e)}},[w]);let T=(0,u.X0)({columns:m,data:d,layoutMode:"grid",enableBottomToolbar:!0,positionToolbarAlertBanner:"bottom",enableSelectAll:!1,enablePagination:!1,enableRowPinning:!1,enableRowSelection:!1,enableStickyHeader:!0,enableColumnPinning:!1,enableDensityToggle:!1,enableColumnFilters:!1,enableFullScreenToggle:!1,enableHiding:!1,enableColumnActions:!1,rowPinningDisplayMode:"select-sticky",muiTableContainerProps:{sx:{maxHeight:"250px",minHeight:"250px"}},enableRowVirtualization:!0,enableColumnVirtualization:!0,getRowId:e=>e.ID,state:{rowSelection:g,isLoading:f,sorting:w},rowVirtualizerInstanceRef:x,rowVirtualizerOptions:{overscan:5},columnVirtualizerOptions:{overscan:2},initialState:{rowSelection:g,density:"compact",showGlobalFilter:!0},renderTopToolbarCustomActions:e=>{let{table:a}=e;return(0,l.jsx)(n.Z,{sx:{display:"flex",gap:"16px",padding:"8px",flexWrap:"wrap"},children:(0,l.jsx)(o.Z,{onClick:b,startIcon:(0,l.jsx)(r.Z,{}),children:"Export All Data"})})}});return(0,l.jsx)(u.P2,{table:T})}}}]);