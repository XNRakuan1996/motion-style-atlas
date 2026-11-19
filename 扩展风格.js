// A catalog entry and its seekable renderer stay together. All art is drawn locally.
const extraStyles = [
  {
    id:'contour-atlas', name:'等高线地貌', desc:'层层等高线沿田垄隆起，线圈聚拢成两片叶子，像展开一张地貌图。',
    use:'地块介绍、农业地理、产区片头', mood:'理性、安静', signals:['等距色带 · 让地形起伏可见','叶片内环 · 从中心向外扩张'],
    source:'https://github.com/d3/d3-contour', sourceName:'d3-contour', paint:contourAtlas
  },
  {
    id:'field-flipbook', name:'田野翻页书', desc:'种子、茎和新叶画在相邻书页上；翻起的纸张越过书脊，翻一页就长大一步。',
    use:'四季记录、农场日记、系列片头', mood:'温暖、叙事', signals:['书脊阴影 · 两页保持固定轴线','折面背光 · 前一页翻走，露出下一幕'],
    source:'https://github.com/Nodlik/StPageFlip', sourceName:'StPageFlip', paint:fieldBook
  },
  {
    id:'linen-cross-stitch', name:'亚麻十字绣', desc:'彩线在亚麻方格上交叉落针，从种子一路绣到叶尖，画面留着纱线的纹理。',
    use:'农产品包装、乡村手作、节庆片头', mood:'亲切、手工', signals:['交叉落针 · 每格两针，逐行填色','经纬底布 · 从叶缘可以数出针脚'],
    source:'https://github.com/embroidery-space/embroiderly', sourceName:'Embroiderly', paint:linenStitch
  },
  ...craftStyles,
  ...mediaStyles,
  ...labStyles
];
for(const style of extraStyles){style.group='开源灵感扩展';catalog.push(style);farmLooks[style.id]=true;}
const extensionById=new Map(extraStyles.map(s=>[s.id,s]));
const clamp01=x=>Math.min(1,Math.max(0,x));
function extraTitle(g,y,color,font,t){
 g.save();g.globalAlpha=clamp01((t-1.7)/.85);g.textAlign='center';g.fillStyle=color;g.font='700 45px '+font;g.fillText('令人向往的农场',360,y+9*(1-g.globalAlpha));g.restore();
}
function strokePath(g,points,color,width=1,closed=false){
 g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));if(closed)g.closePath();g.strokeStyle=color;g.lineWidth=width;g.stroke();
}
function contourAtlas(g,t){
 g.fillStyle='#eee9d4';g.fillRect(0,0,720,405);const grow=clamp01((t-.45)/2.15);
 for(let j=0;j<31;j++){let pts=[];for(let x=-4;x<=724;x+=7){const y=183+j*3.1+Math.sin(x/84+j*.042+t*.23)*19+Math.cos(x/47-j*.06)*8;pts.push([x,y]);}strokePath(g,pts,j%5===0?'#566a50':'#a6ad88',j%5===0?1.6:.8);}
 const tip=207-grow*107;strokePath(g,[[360,213],[356,tip+27],[360,tip]],'#37553d',3);
 g.fillStyle='#854c2d';g.beginPath();g.ellipse(360,210-125*(1-clamp01(t/.65))**2,8,4,-.5,0,2*Math.PI);g.fill();
 for(const side of [-1,1])for(let ring=1;ring<=10;ring++){
 const p=clamp01((t-.9-ring*.045)/1.15);if(!p)continue;let pts=[];for(let n=0;n<=72;n++){let theta=n*Math.PI/36,r=ring/10;let dx=(38+36*r*Math.cos(theta))*p,dy=17*r*Math.sin(theta)*(1+.14*Math.cos(theta))*p;pts.push([360+side*dx,tip-dx*.43+dy])}strokePath(g,pts,ring%3===0?'#365741':'#83945d',ring%3===0?1.6:1,true);}
 extraTitle(g,341,'#304b36','serif',t);
}
function pageArt(g,x,y,stage){
 g.save();g.translate(x,y);g.lineCap='round';strokePath(g,[[-70,2],[65,2]],'#b6a78a',1);g.fillStyle='#9e6540';g.beginPath();g.ellipse(0,0,9,5,-.25,0,2*Math.PI);g.fill();
 if(stage>0){let h=stage===1?35:67;strokePath(g,[[0,-4],[-3,-22],[0,-h]],'#456448',3);for(const s of [-1,1]){g.fillStyle=s<0?'#8aa26f':'#5e8156';g.beginPath();g.ellipse(s*h*.34,-h-5,h*.41,h*.15,s*-.45,0,2*Math.PI);g.fill()}}g.restore()
}
function fieldBook(g,t){
 g.fillStyle='#a0654d';g.fillRect(0,0,720,405);g.fillStyle='#593e34';g.fillRect(83,50,554,219);g.fillStyle='#e4ceb0';g.fillRect(88,44,544,219);g.fillStyle='#fff0d2';g.fillRect(92,38,536,218);
 const turn=t<1.65?clamp01((t-.48)/.95):clamp01((t-1.82)/1.05),stage=t<1.65?0:1;
 pageArt(g,224,204,stage);pageArt(g,494,204,stage+1);
 const hinge=360,edge=hinge+266*Math.cos(Math.PI*turn),lift=32*Math.sin(Math.PI*turn);
 g.save();g.beginPath();g.moveTo(hinge,38);g.quadraticCurveTo((hinge+edge)/2,38-lift,edge,38-lift*.65);g.lineTo(edge,255-lift*.65);g.quadraticCurveTo((hinge+edge)/2,255-lift,hinge,255);g.closePath();g.fillStyle=turn>.5?'#ead6b1':'#fff3d9';g.fill();g.clip();g.translate(hinge,0);g.scale(Math.max(.001,Math.abs(Math.cos(Math.PI*turn)))*(turn>.5?-1:1),1);pageArt(g,133,204-lift*.45,turn>.5?stage+1:stage);g.restore();
 const shade=g.createLinearGradient(342,0,378,0);shade.addColorStop(0,'#33281800');shade.addColorStop(.5,'#33281844');shade.addColorStop(1,'#33281800');g.fillStyle=shade;g.fillRect(342,38,36,218);extraTitle(g,342,'#fff0d5','serif',t)
}
function linenStitch(g,t){
 g.fillStyle='#e7d6b8';g.fillRect(0,0,720,405);for(let i=0;i<720;i+=6){strokePath(g,[[i,0],[i,405]],'#f2e5cc');if(i<405)strokePath(g,[[0,i],[720,i]],'#cebea3');}
 const rows=24,cols=39,coverage=clamp01((t-.38)/2.4)*rows;
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
 const x=col-19,y=23-row;let shade='';
 if(y<2&&Math.abs(x)<4)shade='#a67142';
 if(y>=2&&y<17&&x===Math.round(Math.sin(y*.27)))shade='#3e6650';
 const lobe=(Math.abs(x)-6)**2/35+(y-16-Math.abs(x)*.38)**2/8;
 if(lobe<1)shade=x<0?'#66875a':'#436d4f';if(!shade)continue;
 const incoming=coverage-y-col*.008;if(incoming<=0)continue;const xx=204+col*8,yy=62+row*8;
 let u=clamp01(incoming*2);strokePath(g,[[xx,yy],[xx+7*u,yy+7*u]],shade,2.8);u=clamp01(incoming*2-1);if(u)strokePath(g,[[xx+7,yy],[xx+7-7*u,yy+7*u]],shade,2.2);}
 extraTitle(g,340,'#533e34','serif',t);
}
