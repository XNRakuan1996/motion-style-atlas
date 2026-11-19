// Independent time-addressable Canvas studies. Sources document visual principles only.
const mediaStyles=[
 {id:'contact-cyanotype',name:'蓝晒植物印相',desc:'一张涂蓝的纸托住幼苗。标本从纸面抬起时，遮光处留下乳白叶形和细细的根须。',use:'自然教育、物候记录、农场标本册',mood:'安静、日光、手作',signals:['接触印相 · 标本和留下的负形先重合再分离','刷涂纸边 · 深浅不均的普鲁士蓝'],source:'https://github.com/rustyameadows/cyanotype',sourceName:'Cyanotype playground',paint:cyanFarm},
 {id:'barrier-grid',name:'栅栏错视动画',desc:'四张生长分解图交错印在同一张卡上。开细缝的栅片横移，缝里依次露出种子、嫩茎和双叶。',use:'互动包装、科普封面、纸上机关',mood:'巧妙、好奇',signals:['交错条带 · 四幅图共享同一片纸','移动狭缝 · 栅栏位移决定露出哪一格'],source:'https://github.com/jthawme/kinegram',sourceName:'Kinegram',paint:barrierFarm},
 {id:'falling-sand-stencil',name:'漏沙成画',desc:'细沙从铜筛的窄口落下，在透明苗形模腔里由低到高堆积；底部先变实，最后才填满叶尖。',use:'土壤主题、农时片头、自然材料',mood:'缓慢、触感、重量',signals:['竖直落沙 · 沙流先于堆面出现','重力填模 · 新颗粒落在已堆积的沙粒上方'],source:'https://github.com/MaxBittker/sandspiel',sourceName:'Sandspiel',paint:sandFarm},
 {id:'cylinder-mirror',name:'柱面镜变形画',desc:'桌上弯成扇面的图案逐段展开。中央镜柱上，同一组扭曲线条还原为直立的茎与两片叶。',use:'展陈装置、艺术农业、视觉谜题',mood:'错视、精密',signals:['径向展形 · 平面线稿沿镜柱周围张开','同时对照 · 镜面幼苗与桌面扇形同步出现'],source:'https://github.com/FDaCostaB/CylindricAnamorphosis',sourceName:'CylindricAnamorphosis',paint:mirrorFarm},
 {id:'punched-paper-score',name:'打孔纸带乐谱',desc:'带有苗形孔阵的纸带通过读孔线。碰到圆孔的簧片依次轻颤，一株苗的轮廓像一小节乐谱那样被读过。',use:'农场栏目、儿童课程、手工品牌',mood:'轻巧、节奏、机械',signals:['孔距写节奏 · 纸带上的圆孔组成苗形','逐列读取 · 只有对应孔位的簧片被拨动'],source:'https://github.com/waydenie/PaperStripMusicBox',sourceName:'PaperStripMusicBox',paint:scoreFarm}
];
for(const s of mediaStyles)s.batch='光影与介质';
const mediaTau=2*Math.PI;
function mediaLeaf(side,u){
 const a=u*mediaTau,spread=(1-Math.cos(a))/2;
 return [side*(98*spread+7*Math.sin(a)), -105-48*spread+19*Math.sin(a)];
}
function mediaPlant(g,k,fill,veins){
 if(k<=0)return;
 g.save();g.scale(.45+.55*k,k);g.lineCap='round';
 strokePath(g,[[1,0],[-4,-36],[-3,-72],[0,-105]],fill,6);
 for(const side of [-1,1]){
  const pts=Array.from({length:65},(_,i)=>mediaLeaf(side,i/64));
  face(g,pts,fill);strokePath(g,[[0,-105],[side*45,-123],[side*94,-151]],veins,1.25);
  for(let j=1;j<6;j++){let u=j/7;strokePath(g,[[side*88*u,-105-42*u],[side*(88*u+6),-105-42*u-12*Math.sin(u*Math.PI)]],veins,.85);}
 }
 for(let i=0;i<7;i++){const x=i-3;strokePath(g,[[0,-3],[x*2,7],[x*3+2,13],[x*5,24-Math.abs(x)*3]],fill,1.15)}
 g.restore();
}
function cyanFarm(g,t){
 tile(g,'#e7dfc6');const grow=.16+.84*phase(t,.12,1.75), lift=phase(t,2.1,1.45);
 // Irregular emulsion edge and brush overlap are fixed to the sheet.
 const rim=[];for(let x=0;x<=508;x+=4)rim.push([100+x,31+2*Math.sin(x*.17)+1.5*Math.sin(x*.43)]);
 for(let y=36;y<276;y+=5)rim.push([610+2*Math.sin(y*.21),y]);
 for(let x=508;x>=0;x-=4)rim.push([100+x,277+2*Math.sin(x*.18)]);
 for(let y=276;y>31;y-=5)rim.push([99+2*Math.sin(y*.17),y]);
 face(g,rim,'#345d83');const grad=g.createRadialGradient(323,150,12,347,150,265);grad.addColorStop(0,'#326989');grad.addColorStop(.62,'#174d76');grad.addColorStop(1,'#244966');g.fillStyle=grad;g.fillRect(106,37,497,235);
 for(let i=0;i<850;i++){const x=107+(i*139%494),y=38+((i*137+Math.floor(i/41)*7)%232);g.fillStyle=i%3?'#b4d9d61b':'#0c426323';g.fillRect(x,y,1+i%3,.8);}
 g.save();g.translate(346,234);mediaPlant(g,grow,'#ede9cd','#55829a');g.restore();
 g.save();g.translate(346+111*lift,234-44*lift);g.rotate(.35*lift);g.globalAlpha=(1-lift*.78)*.91;mediaPlant(g,grow,'#304f4d','#94a99a');g.restore();
 extraTitle(g,350,'#234d69','serif',t);
}
let barrierPrint;
function makeBarrier(){
 const c=document.createElement('canvas');c.width=400;c.height=190;const ctx=c.getContext('2d');
 for(let i=0;i<4;i++){ctx.save();ctx.beginPath();for(let x=i*2;x<400;x+=8)ctx.rect(x,0,2,190);ctx.clip();
 ctx.fillStyle='#f4e9c7';ctx.fillRect(0,0,400,190);ctx.translate(200,161);ellipse(ctx,0,0,9,4,-.2,'#24574e');mediaPlant(ctx,[.07,.42,.70,1][i],'#24574e','#d6dfbc');ctx.restore()}return c;
}
function barrierFarm(g,t){
 tile(g,'#ebba73');g.fillStyle='#8d5533';g.fillRect(130,34,462,224);g.fillStyle='#f9edcd';g.fillRect(124,29,462,224);
 barrierPrint ||= makeBarrier();const left=155,top=47;g.drawImage(barrierPrint,left,top);
 // Four phases per 8-unit pitch. Slide smoothly between dwell positions.
 const shift=2*(phase(t,.42,.48)+phase(t,1.32,.5)+phase(t,2.23,.52));
 g.save();g.beginPath();g.rect(left,top,400,190);g.clip();g.fillStyle='#42554b';
 for(let x=-8;x<408;x+=8)g.fillRect(left+x+shift+2,top,6,190);
 g.restore();
 // A small inspection window makes the selected interlaced frame legible on phones.
 g.save();g.translate(547,207);ellipse(g,3,4,43,43,0,'#78553b');ellipse(g,0,0,43,43,0,'#b68e56');ellipse(g,0,0,38,38,0,'#f4e9c7');g.translate(0,26);g.scale(.34,.34);mediaPlant(g,[.07,.42,.70,1][Math.round(shift/2)],'#24574e','#d6dfbc');g.restore();
 g.fillStyle='#40594e';g.fillRect(141+shift,39,12,207);g.fillRect(553+shift,39,12,122);
 for(let i=0;i<4;i++)ellipse(g,324+i*22,274,3,3,0,i===Math.round(shift/2)?'#28493d':'#ba854b');
 extraTitle(g,349,'#3a4638','sans-serif',t);
}
const sandNoise=n=>{const v=Math.sin(n*127.1)*43758.5453;return v-Math.floor(v)};
function inMold(x,y){
 const stem=y>=-106&&y<=2&&Math.abs(x+3*Math.sin((y+106)/108*Math.PI))<5;
 const u=Math.abs(x)/93,leaf=u<=1&&Math.abs(y+105+45*u)<19*Math.sin(Math.PI*u);
 return stem||leaf||((x/12)**2+(y/6)**2<1);
}
let moldColumns;
function sandFarm(g,t){
 tile(g,'#232d32');const progress=phase(t,.28,3.35),height=8-progress*162;
 if(!moldColumns){moldColumns=[];for(let x=-94;x<95;x+=2.5){const ys=[];for(let y=5;y>=-153;y-=2.6)if(inMold(x,y))ys.push(y);if(ys.length)moldColumns.push({x,ys})}}
 const ox=362,oy=238;g.fillStyle='#314048';g.fillRect(205,60,310,200);
 for(const {x,ys} of moldColumns){const front=height+2.5*Math.sin(x*.13);let topY=null;
  for(const y of ys){const rnd=sandNoise(x*93+y*7);g.fillStyle=y>=front?['#dcb578','#f0cb8a','#b98a55','#d2a267'][Math.floor(rnd*4)]:'#486068';g.fillRect(ox+x+rnd*.6,oy+y,2.35,2.55);if(y>=front)topY=y}
  if(t>.12&&t<3.58&&Math.abs(x%5)<1.2){let bottom=oy+(topY??ys[0]);let start=53;
   for(let j=0;j<4;j++){let yy=start+((t*151+j*67+sandNoise(x)*85)%(bottom-start));g.fillStyle='#e0b476b5';g.fillRect(ox+x,yy,1.3,2)}}
 }
 face(g,[[238,21],[483,21],[460,46],[263,46]],'#ad8354');g.fillStyle='#e0b474';g.fillRect(259,46,204,4);strokePath(g,[[204,61],[204,261],[516,261],[516,61]],'#8aaba7',1.4);
 extraTitle(g,350,'#edc993','serif',t);
}
function mirrorFarm(g,t){
 tile(g,'#dbcbb1');const f=phase(t,.25,2.9);const cx=365,cy=201;
 const paths=[Array.from({length:40},(_,i)=>[Math.sin(i/39*Math.PI)*-4,-100*i/39]),...[-1,1].map(s=>Array.from({length:67},(_,i)=>mediaLeaf(s,i/66)))];
 // The same source vertices are mapped into a fan and into a mirror diagram.
 const fan=([x,y])=>{const rad=71-y*.60,ang=x*.014;return [cx+rad*Math.sin(ang)*1.65,cy+rad*Math.cos(ang)*.54]};
 for(let i=0;i<6;i++){const r=70+i*15;g.beginPath();g.ellipse(cx,cy,r*1.65,r*.54,0,0,Math.PI);g.strokeStyle='#b39c7c';g.lineWidth=.7;g.stroke()}
 const gr=g.createLinearGradient(cx-62,0,cx+62,0);for(const [s,col] of [[0,'#6c7470'],[.14,'#dde4d6'],[.36,'#aeb6a9'],[.57,'#f2f0da'],[.86,'#aab0a1'],[1,'#656d67']])gr.addColorStop(s,col);
 g.fillStyle=gr;g.fillRect(cx-62,45,124,153);ellipse(g,cx,198,62,12,0,gr);ellipse(g,cx,45,62,12,0,'#e8e6d5');ellipse(g,cx,44,54,7,0,'#a5ada2');
 for(const path of paths){const n=Math.max(1,Math.ceil(path.length*f));const pts=path.slice(0,n);strokePath(g,pts.map(fan),'#396656',3.7);strokePath(g,pts.map(([x,y])=>[cx+x*.50,cy-12+y*.78]),'#37594e',2.7);}
 ellipse(g,cx,cy+38,8,3,0,'#9b6d49');ellipse(g,cx,cy-11,5,2.5,0,'#916442');
 extraTitle(g,350,'#4c5044','serif',t);
}
const scoreHoles=[];
for(let col=-12;col<=12;col++)for(let row=0;row<14;row++){
 let x=Math.abs(col)/12;const leaf=x>0&&Math.abs(row-(7-5*x))<.5+1.8*Math.sin(Math.PI*x);
 if(leaf||(!col&&row>=6)||(row===13&&Math.abs(col)<2))scoreHoles.push({col,row});
}
function scoreFarm(g,t){
 tile(g,'#4d3e36');const reader=368,offset=569-phase(t,.15,3.95)*346;
 g.fillStyle='#2d2925';g.fillRect(42,46,638,208);g.fillStyle='#f1dcb0';g.fillRect(38,40,640,206);
 for(let row=0;row<14;row++)strokePath(g,[[38,70+row*10],[678,70+row*10]],'#cfb88a',.65);
 g.save();g.beginPath();g.rect(38,40,640,206);g.clip();
 for(let i=-8;i<43;i++){const x=offset+i*21;for(const y of [49,234])ellipse(g,x,y,2.6,2.6,0,'#685646');}
 for(const h of scoreHoles)ellipse(g,offset+h.col*11,70+h.row*10,3.8,3.7,0,'#473a32');
 g.restore();g.fillStyle='#967448';g.fillRect(reader-6,52,8,176);
 for(let row=0;row<14;row++){const dist=Math.min(...scoreHoles.filter(p=>p.row===row).map(p=>Math.abs(offset+p.col*11-reader)));const kick=Math.max(0,1-dist/9);let y=70+row*10;
 face(g,[[reader-3,y-2],[reader+28,y-2-kick*4],[reader+32,y+1-kick*4],[reader-3,y+2]],kick>.2?'#efba65':'#ae8b58');}
 extraTitle(g,349,'#f2dbaf','serif',t);
}
