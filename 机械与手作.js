// Five independent drawings. Geometry depends only on the sample clock, including during scrubbing.
const craftStyles = [
 {id:'pin-thread',name:'钉线画',desc:'从一枚种子钉出发，棉线在铜钉之间来回拉紧。直线交叠，织出扇形叶面。',use:'农场品牌、匠人故事、包装片头',mood:'细密、温暖',signals:['走线顺序 · 线头从上一枚钉子牵到下一枚','渐密弦线 · 上百道直线围出叶缘'],source:'https://github.com/piellardj/image-stylization-threading',sourceName:'Image Stylization – Threading',paint:threadFarm},
 {id:'split-disc-field',name:'机械翻点牌',desc:'黑色圆片逐行翻出黄色背面，种子落地、苗向上长。圆片转到侧面时会收成一道细缝。',use:'市集开场、丰收倒计时、短促片头',mood:'机械、利落',signals:['圆片转轴 · 单点经历收窄、换面、展开','传播次序 · 相邻圆片错时翻转'],source:'https://github.com/owenmcateer/FlipDots',sourceName:'FlipDots',paint:flipFarm},
 {id:'folded-seed',name:'折纸萌芽',desc:'一颗菱形纸种子沿中央折痕撑起，两片折叠的叶子依次绕铰线展开，光线从暗面滑到亮面。',use:'种子包装、节气海报、礼盒开场',mood:'干净、灵巧',signals:['共享折痕 · 两个纸面绕同一条边开合','折面明暗 · 转角决定叶片两侧受光'],source:'https://github.com/amandaghassaei/OrigamiSimulator',sourceName:'Origami Simulator',paint:foldFarm},
 {id:'domino-sprout',name:'骨牌分叉',desc:'第一枚骨牌倒向下一枚，连锁从种子位置沿茎上行，在叶柄处分成两路，最终倒出两片叶子的轮廓。',use:'团队接力、项目启动、流程串联',mood:'俏皮、期待',signals:['倒伏接力 · 每一枚绕自己的底边转动','分叉传递 · 主干到达后两列叶片才开始倾倒'],source:'https://github.com/liabru/matter-js',sourceName:'Matter.js',paint:dominoFarm},
 {id:'seed-zoetrope',name:'走马盘逐格动画',desc:'圆盘把萌芽拆成十二幅小画。盘面旋转，右侧观片窗依次选取经过标记的画格，静止的分解图就连成了一次生长。',use:'自然教育、物候观察、展陈开场',mood:'复古、好奇',signals:['圆周分格 · 同一圈同时看见十二个生长阶段','观片窗 · 每转过一格就替换一次画面'],source:'https://github.com/autonk/Corridoritrope',sourceName:'Corridoritrope',paint:zoetropeFarm}
];
for (const s of craftStyles) s.batch='机械与手作';
function tile(g,color){g.fillStyle=color;g.fillRect(0,0,720,405)}
function ellipse(g,x,y,rx,ry,angle,color){g.beginPath();g.ellipse(x,y,Math.max(.02,rx),Math.max(.02,ry),angle,0,Math.PI*2);g.fillStyle=color;g.fill()}
function face(g,points,color){g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=color;g.fill()}
function phase(t,start,length){const u=clamp01((t-start)/length);return u*u*(3-2*u)}
function between(a,b,k){return [a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k]}
function threadFarm(g,t){
 tile(g,'#44352d');for(let y=2;y<405;y+=5)strokePath(g,[[0,y],[240,y+1.5*Math.sin(y)],[490,y-2],[720,y+1]],'#503d32',.85);
 const origin=[360,257],joint=[351,154],pins=[origin,joint],route=[origin,joint];
 for(const side of [-1,1]){
  const rim=Array.from({length:19},(_,i)=>{let u=i*Math.PI/9.5;return [joint[0]+side*(60-60*Math.cos(u)),joint[1]-29*(1-Math.cos(u))-22*Math.sin(u)]});
  pins.push(...rim);route.push(joint);
  for(let i=0;i<25;i++)route.push(rim[(i*7)%19],rim[(i*7+9)%19]);
  route.push(joint);
 }
 const n=phase(t,.22,3.45)*(route.length-1);
 for(let i=0;i<n;i++)strokePath(g,[route[i],between(route[i],route[i+1],Math.min(1,n-i))],i<2?'#f4e4b5':i<54?'#bad4a3':'#f0c77e',1.3);
 for(const [x,y] of pins){ellipse(g,x+1,y+2,2.5,2.5,0,'#302119');ellipse(g,x,y,2.2,2.2,0,'#daa871')}
 extraTitle(g,342,'#f0e1c4','serif',t);
}
function flipFarm(g,t){
 tile(g,'#202a29');g.fillStyle='#0e1818';g.fillRect(80,27,560,248);
 for(let row=0;row<21;row++)for(let col=0;col<48;col++){
  const x=col-23.5,y=17-row;
  const seed=Math.abs(x)<2&&y>=-1&&y<=0,stem=Math.abs(x)<1&&y>=0&&y<11;
  const leaf=(Math.abs(x)-5.4)**2/27+(y-10.2-.46*Math.abs(x))**2/7<1;
  const when=seed?.22:stem?.53+y*.10:1.58+Math.abs(x)*.10+(y%2)*.06;
  const angle=(seed||stem||leaf)?phase(t,when,.28)*Math.PI:0;
  const px=102+col*11,py=41+row*11;
  ellipse(g,px,py,4.65,4.65,0,'#0a1111');ellipse(g,px,py,4.6,Math.abs(Math.cos(angle))*4.6,0,angle>Math.PI/2?'#e6e55f':'#364442');
 }
 extraTitle(g,344,'#e6e55f','sans-serif',t);
}
function foldFarm(g,t){
 tile(g,'#e8ddcc');const rise=phase(t,.32,1.3),swing=phase(t,1.2,1.2);
 ellipse(g,363,245,21+55*swing,5+swing*3,-.02,'#c8bda8');
 const base=[360,242],bud=[360,222-rise*91];
 face(g,[base,[343,222],bud],'#6b8164');face(g,[base,[371,218],bud],'#a6ac7c');
 for(const side of [-1,1]){
  const k=phase(t,side<0?1.04:1.5,1.36),angle=k*1.36;
  const hinge=[360, bud[1]+5],tip=[360+side*(9+101*Math.sin(angle)),bud[1]-39-35*Math.cos(angle)];
  const mid=between(hinge,tip,.56),upper=[mid[0]-side*7,mid[1]-24*Math.sin(angle)],lower=[mid[0]+side*12,mid[1]+18*Math.sin(angle)];
  face(g,[hinge,upper,tip],side<0?'#83a080':'#acc29a');face(g,[hinge,tip,lower],side<0?'#416756':'#638268');strokePath(g,[hinge,tip],'#e5dbaf',1.1);
 }
 face(g,[[342,237],[354,225],[373,235],[359,251]],'#a07b50');face(g,[[342,237],[354,225],[359,251]],'#cfac74');extraTitle(g,340,'#3c5143','serif',t)
}
function dominoFarm(g,t){
 tile(g,'#f1e9d4');const pieces=[];
 for(let i=0;i<14;i++)pieces.push([362,242-i*6,0,i*.095]);
 for(const side of [-1,1])for(let i=0;i<28;i++){
  const u=i*Math.PI/14,dx=side*(1-Math.cos(u))*52,dy=-25*(1-Math.cos(u))-20*Math.sin(u);
  const tangent=Math.atan2(side*52*Math.sin(u),25*Math.sin(u)+20*Math.cos(u));
  pieces.push([362+dx,159+dy,tangent,1.32+i*.057]);
 }
 // Paint back rows first so the front edge overlaps the row behind it.
 pieces.sort((a,b)=>a[1]-b[1]);
 for(const [x,y,az,delay] of pieces){
  const k=phase(t,.26+delay,.28),reach=18*Math.sin(k*1.44),top=[x+reach*Math.sin(az),y-21*Math.cos(k*1.44)-reach*Math.cos(az)];
  const span=4.2;face(g,[[x-span,y],[x+span,y],[top[0]+span,top[1]],[top[0]-span,top[1]]],k>.75?'#c56642':'#38655a');
  face(g,[[x+span,y],[x+span+2,y-1],[top[0]+span+2,top[1]-1],[top[0]+span,top[1]]],'#27483e');
  ellipse(g,top[0]*.68+x*.32,top[1]*.68+y*.32,1.1,1,0,'#f7dfac');
 }
 extraTitle(g,341,'#304e44','sans-serif',t);
}
function frameSprout(g,x,y,size,k){
 g.save();g.translate(x,y);g.scale(size,size);ellipse(g,0,0,4,2,-.35,'#a86d3d');const h=29*k;
 strokePath(g,[[0,0],[-1,-h*.45],[0,-h]],'#385f4a',2);
 if(k>.1)for(const s of [-1,1])ellipse(g,s*k*7,-h-k*3,k*9,k*3.5,-s*.5,'#62855d');g.restore()
}
function zoetropeFarm(g,t){
 tile(g,'#273c44');const turn=clamp01((t-.15)/4.3)*11,theta=turn*Math.PI/6;
 const X=235,Y=146,R=116;ellipse(g,X,Y,R+8,R+8,0,'#986c45');ellipse(g,X,Y,R,R,0,'#ecd9ad');
 g.save();g.translate(X,Y);g.rotate(theta);
 for(let i=0;i<12;i++){g.save();g.rotate(-i*Math.PI/6);strokePath(g,[[15,-57],[29,-110]],'#b3a07f');g.fillStyle='#32454b';g.fillRect(-3,-112,6,13);frameSprout(g,0,-66,.62,i/11);g.restore()}g.restore();
 ellipse(g,X,Y,16,16,0,'#74523c');ellipse(g,X-3,Y-3,4,4,0,'#dbb278');
 face(g,[[X-7,12],[X+7,12],[X,23]],'#f2bd71');
 g.fillStyle='#17282e';g.fillRect(418,52,184,179);g.fillStyle='#e6d6b0';g.fillRect(427,61,166,161);
 frameSprout(g,510,196,3.1,Math.min(11,Math.floor(turn+.5))/11);
 extraTitle(g,345,'#f3e2ba','serif',t);
}
