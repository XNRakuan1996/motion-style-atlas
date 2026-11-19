// Seekable, silent five-second studies. No external assets or runtime dependencies.
const labStyles = [
 {id:'farm-wind-tunnel',name:'风洞烟线',desc:'烟线原本平直。种子出苗后，流线绕开叶面，在叶后卷出两道移动的尾迹。',use:'设施农业、通风讲解、田间观察',mood:'流动、清透',signals:['上游平直 · 烟线持续送入','叶后尾迹 · 弯曲和波动从苗的位置向下游传递'],source:'https://github.com/matthias-research/pages/blob/master/tenMinutePhysics/17-fluidSim.html',sourceName:'Ten Minute Physics · Fluid Simulation',paint:windTunnelFarm},
 {id:'frost-dendrite',name:'冰窗枝晶',desc:'一粒晶核贴在玻璃上，白霜沿主脉生出侧枝。越靠近叶尖，晶枝越细，最终长成一株透光的冰苗。',use:'冬季物候、节气片头、自然教育',mood:'凛冽、细密',signals:['从晶核生长 · 侧枝在母枝经过后启动','末梢发亮 · 生长前沿与已形成的晶骨有明暗差'],source:'https://github.com/jasonwebb/2d-diffusion-limited-aggregation-experiments',sourceName:'2D DLA Experiments',paint:frostWindowFarm},
 {id:'xy-phosphor',name:'示波器荧光描迹',desc:'一束亮点沿横纵轴信号指定的路径扫描，扫过的线渐暗；光点反复走过同一条路径，苗形便留在荧光屏上。',use:'数字农业、电子工具、实验课开场',mood:'精密、复古电子',signals:['光点领笔 · 两轴共同定位一个亮点','余辉衰减 · 刚扫过的线最亮，旧轮廓较暗'],source:'https://github.com/jameshball/osci-render',sourceName:'osci-render',paint:scopeFarm},
 {id:'thermal-field-slip',name:'热敏出纸',desc:'打印头停在原地，纸条向下送出。苗形和片名按行出现在纸上，末尾压出一排撕纸齿。',use:'农场市集、采收记录、订单开场',mood:'日常、干脆',signals:['固定出纸口 · 已印图文随纸移动','逐行显色 · 最后一行先经过打印头再进入视野'],source:'https://github.com/jflaflamme/escpresso',sourceName:'escpresso',paint:thermalFarm},
 {id:'prism-seed',name:'万花筒镜室',desc:'一对嫩叶进入镜室，一圈相邻镜面把它复制为对称纹样。转动镜筒，所有扇区的叶片同时开合。',use:'花卉品牌、春日市集、节庆开场',mood:'明丽、旋转',signals:['交替镜像 · 相邻扇区左右手性相反','共同变化 · 一个叶片动作同时出现在每面镜中'],source:'https://github.com/coldhead/kaleidos',sourceName:'Kaleidos',paint:prismFarm}
];
for(const s of labStyles)s.batch='显影实验室';

function windTunnelFarm(g,t){
 tile(g,'#102e39');const rise=.04+.96*phase(t,.35,2.4),mid=205-100*rise;
 g.save();g.beginPath();g.rect(33,24,654,242);g.clip();
 for(let row=0;row<22;row++){
  const y=36+row*10.4,dy=y-mid,side=dy>=0?1:-1;
  g.beginPath();
  for(let x=32;x<=689;x+=4){
   const wake=phase(x,352,80)*Math.exp(-Math.max(0,x-420)/190);
   const envelope=Math.exp(-Math.abs(dy)/51);
   const bulge=side*rise*envelope*44*Math.exp(-((x-344)**2)/5300);
   const ripple=rise*envelope*wake*(11+4*Math.sin(row*.71))*Math.sin((x-354)*.045-t*4.3+row*.14);
   let yy=y+bulge+ripple;x===32?g.moveTo(x,yy):g.lineTo(x,yy)
  }
  g.strokeStyle=row%4===0?'#9acec9':'#477e86';g.lineWidth=row%4===0?1.7:.85;g.stroke();
  g.setLineDash([10,117]);g.lineDashOffset=-t*77-row*11;g.strokeStyle='#dbede1';g.lineWidth=1.85;g.stroke();g.setLineDash([]);
 }
 g.translate(344,237);g.transform(1,0,-.12*rise,1,0,0);mediaPlant(g,rise,'#d4cd8e','#5b807e');g.restore();
 for(let x=35;x<=684;x+=12)strokePath(g,[[x,264],[x,264-(x%4===3?5:2)]],'#7c9e99',.7);
 extraTitle(g,346,'#dce7cf','serif',t)
}

// A deterministic branching approximation: each child starts when its attachment point has grown.
const frostSegments=[];
function frostBranch(x,y,angle,length,start,duration,level,seed){
 const tip=[x+Math.cos(angle)*length,y+Math.sin(angle)*length];frostSegments.push({p:[x,y],q:tip,start,duration,level});
 if(level>0)for(let i=1;i<=5;i++)for(const side of [-1,1]){
  const u=.14+i*.125,variation=sandNoise(seed*103+i*7+side);
  frostBranch(x+(tip[0]-x)*u,y+(tip[1]-y)*u,angle+side*(.55+.26*variation),length*(.27+.1*variation)*(1-u*.64),start+duration*u,duration*.43,level-1,seed*17+i+side*.27);
 }
}
frostSegments.push({p:[354,246],q:[351,161],start:.12,duration:.86,level:3});
for(const side of [-1,1])frostBranch(351,161,side===1?-.51:Math.PI+.51,115,.98,1.48,2,5+side);
frostBranch(351,161,-1.46,62,1.23,1.22,2,9);
function frostWindowFarm(g,t){
 const glass=g.createLinearGradient(0,0,720,405);glass.addColorStop(0,'#18334b');glass.addColorStop(.52,'#517588');glass.addColorStop(1,'#253f5f');tile(g,glass);
 for(let i=0;i<170;i++){let x=sandNoise(i+9)*720,y=sandNoise(i+303)*260,r=.4+1.5*sandNoise(i+501);ellipse(g,x,y,r,r,0,'#e6f6f534');}
 ellipse(g,354,245,17,3,0,'#a2c5cc');g.lineCap='round';
 for(const s of frostSegments){const u=phase(t,s.start,s.duration);if(!u)continue;const q=between(s.p,s.q,u);strokePath(g,[s.p,q],s.level>1?'#f1fbfa':'#cde7ee',.6+s.level*.66);
 if(u<1&&s.level>0)ellipse(g,q[0],q[1],2.4,2.4,0,'#fffdf0')}
 extraTitle(g,346,'#f0f3dd','serif',t)
}

const scopeRoute=(()=>{const pts=[[0,0],[-4,-37],[0,-105]];
 for(const side of [-1,1]){for(let i=0;i<=72;i++)pts.push(mediaLeaf(side,i/72));pts.push([side*95,-147],[0,-105]);}
 pts.push([-4,-37],[0,0],[5,6],[0,10],[-5,5],[0,0]);const samples=[];
 for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/2));for(let j=0;j<n;j++)samples.push(between(a,b,j/n));}
 return samples})();
function scopeFarm(g,t){
 tile(g,'#263435');g.fillStyle='#101f20';g.fillRect(105,22,510,248);const phosphor=g.createRadialGradient(360,149,4,360,149,242);phosphor.addColorStop(0,'#23404a');phosphor.addColorStop(1,'#10292d');g.fillStyle=phosphor;g.fillRect(115,31,490,230);
 for(let x=140;x<600;x+=28)strokePath(g,[[x,32],[x,260]],'#456054',.65);
 for(let y=48;y<260;y+=28)strokePath(g,[[116,y],[604,y]],'#456054',.65);
 const n=scopeRoute.length,clock=(t*.53)*n,end=Math.floor(clock);
 g.save();g.translate(360,226);g.lineJoin='round';g.lineCap='round';
 for(let j=0;j<24;j++){const a=Math.max(0,Math.floor(clock-n+j*n/24)),b=Math.min(end,Math.floor(clock-n+(j+1)*n/24));if(b<=a)continue;let pts=[];for(let k=a;k<=b;k++)pts.push(scopeRoute[k%n]);g.globalAlpha=.22+.78*(j/23)**2;strokePath(g,pts,'#abf6ae',1.6+1.2*j/23)}
 g.globalAlpha=1;let p=scopeRoute[end%n];ellipse(g,...p,5.6,5.6,0,'#c5ffbf50');ellipse(g,...p,2.25,2.25,0,'#f1ffdc');g.restore();extraTitle(g,347,'#d9e8bb','sans-serif',t)
}

function thermalFarm(g,t){
 tile(g,'#d2b59a');g.fillStyle='#746e66';g.fillRect(156,21,408,64);g.fillStyle='#293b38';g.fillRect(168,16,384,63);g.fillStyle='#112321';g.fillRect(181,53,358,17);
 const feed=16+250*phase(t,.15,3.45),bottom=61+feed,w=330,x=195;
 // The paper's leading edge leaves first. Its printed design travels with it.
 g.save();g.beginPath();g.rect(x,62,w,feed);g.clip();g.fillStyle='#faf1d6';g.fillRect(x,58,w,feed+5);
 g.translate(360,bottom-20);
 g.fillStyle='#222d29';g.font='700 32px sans-serif';g.textAlign='center';g.fillText('令人向往的农场',0,-165);
 strokePath(g,[[-133,-150],[133,-150]],'#48514a',1);
 g.save();g.translate(0,-33);g.scale(.68,.68);mediaPlant(g,1,'#333c32','#e7e2c9');g.restore();
 for(let i=0;i<43;i++){g.fillStyle='#414438';g.fillRect(-71+i*3.3,-12,1+(i*7%3),8+(i%4===0?3:0));}
 g.restore();
 for(let i=0;i<33;i++)face(g,[[x+i*10,bottom],[x+i*10+5,bottom+4],[x+i*10+10,bottom]],'#faf1d6');
 ellipse(g,523,35,3.5,3.5,0,t<3.6?'#d6b957':'#a2c5ab');g.fillStyle='#d8c5a7';g.fillRect(191,59,338,3)
}
function prismFarm(g,t){
 tile(g,'#253144');const X=360,Y=148,R=125,count=12,wedge=Math.PI*2/count,open=phase(t,.2,2.7);
 ellipse(g,X,Y,R+10,R+10,0,'#94714d');ellipse(g,X,Y,R+6,R+6,0,'#debf85');
 for(let i=0;i<count;i++){
  g.save();g.translate(X,Y);g.rotate(i*wedge);if(i%2){g.rotate(wedge);g.scale(1,-1)}
  g.beginPath();g.moveTo(0,0);g.arc(0,0,R,0,wedge);g.closePath();g.clip();g.fillStyle='#1f4e55';g.fillRect(-R,-R,2*R,2*R);
  // Only this wedge is drawn; its mirror is the adjacent wedge.
  g.rotate(wedge*.5);g.translate(18+open*17,6*Math.sin(t*1.5));g.rotate(.17*Math.sin(t*1.8));
  ellipse(g,12,0,15,7,0,'#d7a05e');strokePath(g,[[6,0],[42,-2],[71,3]],'#c6d192',3.6);
  for(const s of [-1,1]){ellipse(g,49,s*(3+open*6),18+9*open,6+2*open,s*.44,'#90c1a1');strokePath(g,[[29,0],[65,s*13]],'#e7d088',1.25)}
  ellipse(g,91,-4,11,6,-.28,'#d67f72');g.restore()
 }
 ellipse(g,X,Y,5,5,0,'#eac78b');extraTitle(g,348,'#eddec1','serif',t)
}
