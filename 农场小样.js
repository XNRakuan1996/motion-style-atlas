// All previews share a 5-second clock. Geometry is evaluated from time so seeking is deterministic.
const farmLooks={
'swiss-editorial':['#eeeadd','#252823','#da4129'],'kinetic-brutalist':['#eff634','#161616','#fa5339'],'risograph-print':['#eddfb9','#134f65','#ed6655'],'editorial-collage':['#264ab4','#fff4d6','#ffd853'],'art-deco':['#103d37','#e8c689','#c89352'],'one-line':['#f7efe0','#283d32','#bd6641'],'concept-morph':['#162b35','#c4eed9','#62b7a2'],'minimal-ui':['#e8eee8','#245242','#89c3a3'],'dark-keynote':['#11151b','#f2f2ea','#aabfd3'],'isometric-infographic':['#ece8cf','#305c47','#8faf70'],'data-motion':['#152c33','#e6f0df','#8bce9e'],'blueprint':['#173d70','#dae9df','#8bbfdf'],'hologram-hud':['#092939','#95eee6','#3fbaed'],'pixel-game':['#253253','#f6dc9f','#89c986'],'pixel-diorama':['#c5d8a5','#375b45','#d5955e'],'crt-vhs':['#222941','#e8d4dc','#fa709d'],'terminal-ascii':['#10241a','#a6e8ae','#56ad70'],'glitch-digital':['#14162b','#f7f1dc','#f65fa9'],'synthwave-neon':['#251838','#fa9be2','#61efef'],'glass-material':['#9acae2','#16394e','#f7ffff'],'soft-3d-toy':['#f2cbbb','#553c39','#79a88e'],'liquid-shader':['#272450','#faf0dc','#8be4ce'],'stained-glass':['#252c39','#f5dc96','#dc955b'],'tilt-shift-miniature':['#bcd0ab','#344e39','#d7a75c'],'generative-geometry':['#f4eddd','#244d52','#e0814f'],'particle-field':['#10252a','#e8e9ce','#bfdf89'],'soft-organic':['#f4dfce','#674338','#a7be87'],'comic-pop':['#ffe39a','#202232','#ed6248'],'flat-vector':['#fae0ae','#25433d','#65a078'],'guochao':['#b94031','#fff1c7','#dfb452'],'painterly':['#eedeb6','#3d4f43','#bb775e'],'cel-anime-80s':['#f1b29c','#403950','#768ca4'],'rubber-hose':['#f0dfb5','#302b25','#c49252'],'whiteboard-explainer':['#faf9ee','#2c4648','#95bd87'],'crayon-storybook':['#f9e6bc','#634f37','#b89a5b'],'ink-wash':['#f0ede0','#273c38','#aa4839'],'paper-cut':['#ebd6ad','#284e45','#94ab78'],'copperplate-engraving':['#f2e6c9','#544331','#8a7758'],'ukiyo-e':['#edddb5','#284759','#bb684b'],'shadow-puppet':['#efcc90','#623523','#9e5132'],'illuminated-manuscript':['#ead7a6','#78362c','#ae8238'],'cinematic-title':['#1b2228','#efe2bf','#9baf9c'],'mixed-media-era':['#e6d1a5','#333e3a','#bf6851']};
const farmDuration=5;
function drawFarm(c,id,time){
 const ext=extensionById.get(id);
 if(ext){const ctx=c.getContext('2d');ctx.save();ctx.setTransform(c.width/720,0,0,c.height/405,0,0);ext.paint(ctx,Math.max(0,Math.min(5,time)));ctx.restore();return}
 const g=c.getContext('2d'), [bg,ink,acc]=farmLooks[id],T=Math.min(time,5), tau=Math.PI*2;
 const sat=x=>Math.max(0,Math.min(1,x)), ease=x=>1-(1-sat(x))**3;
 const pixel=id.startsWith('pixel')||id==='terminal-ascii', stepped=pixel||['cel-anime-80s','shadow-puppet','crayon-storybook','editorial-collage'].includes(id);
 const t=stepped?Math.floor(T*10)/10:T, v=ease((t-.65)/2.3), a=ease((t-1.5)/1.35), fly=1-ease(t/.8);
 g.setTransform(c.width/720,0,0,c.height/405,0,0);g.globalAlpha=1;g.fillStyle=bg;g.fillRect(0,0,720,405);
 const rect=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
 const line=(x,y,X,Y,col,w=1)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.stroke()};
 const poly=(pts,col,stroke,w=1)=>{g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();if(col){g.fillStyle=col;g.fill()}if(stroke){g.lineWidth=w;g.strokeStyle=stroke;g.stroke()}};
 const oval=(x,y,rx,ry,angle,col,outline)=>{g.beginPath();g.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),angle,0,tau);if(col){g.fillStyle=col;g.fill()}if(outline){g.strokeStyle=outline;g.lineWidth=1.6;g.stroke()}};
 const rand=n=>{let k=Math.sin(n*77.17+45)*43758;return k-Math.floor(k)};
 const wave=(y,h,col,w=2,speed=1)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();for(let x=-4;x<726;x+=4){let yy=y+Math.sin(x*.018+t*speed)*h;x===-4?g.moveTo(x,yy):g.lineTo(x,yy)}g.stroke()};
 const text=(s,x,y,sz,col,font='sans-serif',weight=650)=>{g.font=weight+' '+sz+'px '+font;g.fillStyle=col;g.fillText(s,x,y)};
 const ball=(x,y,r,light,color)=>{let gr=g.createRadialGradient(x-r*.33,y-r*.48,1,x,y,r);gr.addColorStop(0,light);gr.addColorStop(.72,color);gr.addColorStop(1,ink);oval(x,y,r,r,0,gr)};
 let cx=360,ground=237,mode='flat',titleMode='center',serif=false,stem=ink,leaf=acc;
 const groundLine=()=>line(90,ground,630,ground,ink,1.6);
 const sun=(x,y,r)=>oval(x,y,r,r,0,acc);
 const grid=(step,col)=>{for(let x=0;x<720;x+=step)line(x,0,x,405,col,.65);for(let y=0;y<405;y+=step)line(0,y,720,y,col,.65)};
 function hills(slope,col,y){const p=[[0,405]];for(let x=0;x<=720;x+=12)p.push([x,y+Math.sin(x*.009+slope)*19+Math.sin(x*.015+slope)*8]);p.push([720,405]);poly(p,col)}
 function fieldTiles(relief){for(let j=0;j<4;j++)for(let i=0;i<5;i++){let x=330+(i-j)*37,y=162+(i+j)*15-8*v;poly([[x,y],[x+37,y+15],[x,y+30],[x-37,y+15]],(i+j)%3?acc:bg,ink,1);if(relief)poly([[x-37,y+15],[x,y+30],[x,y+35],[x-37,y+20]],ink)}}
 function frame(m,col){g.strokeStyle=col;g.lineWidth=2;g.strokeRect(m,m,720-2*m,405-2*m)}
 switch(id){
 case 'swiss-editorial':cx=518;titleMode='left';rect(37,35,90*ease(t),12,acc);line(35,252,684,252,ink);break;
 case 'kinetic-brutalist':titleMode='slam';mode='angular';cx=375+Math.max(0,1-t)*100;for(let i=0;i<7;i++)poly([[0,30*i],[105,30*i],[77,30*i+12],[0,30*i+12]],ink);break;
 case 'risograph-print':mode='riso';serif=true;sun(480,124,63);for(let x=0;x<720;x+=8)for(let y=0;y<260;y+=8)if(y>175+Math.sin(x*.01)*23)oval(x,y,1.35,1.35,0,ink);break;
 case 'editorial-collage':mode='cut';g.save();g.translate(360,146);g.rotate(-.06+.06*fly);rect(-132,-95,266,193,'#f3e6c0');rect(-44,-102,84,17,acc);g.restore();stem='#263f35';leaf='#687d41';titleMode='sticker';break;
 case 'art-deco':serif=true;for(let i=-9;i<=9;i++)line(360,245,360+i*45,28+Math.abs(i)*5,acc,1.2);frame(15,acc);frame(21,acc);mode='angular';break;
 case 'one-line':mode='outline';groundLine();break;
 case 'concept-morph':mode='wire';for(let j=0;j<5;j++){const rad=20+j*8;oval(360,165,rad*(1-v)+9,rad,0,null,'#42615e')}break;
 case 'minimal-ui':rect(103,44,514,209,'#fbfcf8');for(let i=0;i<3;i++)oval(125+i*13,60,3,3,0,acc);rect(126,226,461,4,bg);rect(126,226,461*v,4,acc);break;
 case 'dark-keynote':{const gr=g.createRadialGradient(360,188,8,360,188,200);gr.addColorStop(0,'#465667');gr.addColorStop(1,bg);rect(0,0,720,270,gr);mode='sphere';break}
 case 'isometric-infographic':fieldTiles(true);ground=218;mode='angular';break;
 case 'data-motion':for(let i=0;i<12;i++){let h=18+i*i*.73;rect(75+i*50,244-h*v,18,h*v,'#456969')}groundLine();mode='wire';break;
 case 'blueprint':grid(24,'#3b6089');mode='wire';line(448,87,448,236,acc);for(let y=88;y<238;y+=10)line(448,y,455,y,acc);break;
 case 'hologram-hud':for(let i=0;i<3;i++){g.beginPath();g.arc(360,156,69+i*19,t*.38+i,t*.38+i+4.6);g.strokeStyle=acc;g.stroke()}mode='wire';break;
 case 'pixel-game':mode='pixel';for(let i=0;i<24;i++){rect(i*30,234,29,9,acc);rect(i*30+5,243,12,6,'#876a54')}break;
 case 'pixel-diorama':fieldTiles(true);ground=215;mode='pixel';break;
 case 'crt-vhs':mode='riso';text('PLAY  ▸',42,48,18,ink,'monospace');for(let y=0;y<405;y+=5)rect(0,y,720,1,'#8293b344');break;
 case 'terminal-ascii':mode='ascii';text('> grow(seed)_',50,66,23,acc,'monospace');text('['+'#'.repeat(Math.floor(v*14)).padEnd(14,'.')+']',260,260,18,ink,'monospace');break;
 case 'glitch-digital':mode='riso';titleMode='glitch';for(let i=0;i<11;i++)rect(rand(i)*710,rand(i+90)*260,15+45*rand(i+3),2+(i%3),i%2?acc:'#65ebea');break;
 case 'synthwave-neon':sun(360,120,74);for(let i=0;i<8;i++)rect(283,124+i*8,154,2+i*.4,bg);for(let i=-8;i<9;i++)line(360+i*9,202,360+i*68,266,acc);for(let i=0;i<5;i++)line(0,203+i*i*3,720,203+i*i*3,acc);stem=ink;leaf=bg;break;
 case 'glass-material':sun(270+30*Math.sin(t),126,76);oval(449,171,76,76,0,'#91add8');rect(188,44,344,210,'#ffffff59');g.strokeStyle='#ffffffcf';g.strokeRect(188,44,344,210);leaf='#388e86';break;
 case 'soft-3d-toy':mode='sphere';oval(360,237,66,9,0,'#ba9c87');break;
 case 'liquid-shader':for(let i=0;i<44;i++)wave(95+i*3,12+Math.sin(i*.17)*22,'hsla('+ (160+i*2)+',55%,68%,.55)',2,1.3);mode='sphere';break;
 case 'stained-glass':for(let i=0;i<9;i++){let x=i*90-45;poly([[x,0],[x+90,0],[360,237]],['#795154','#406574','#747146'][i%3],bg,4)}mode='angular';break;
 case 'tilt-shift-miniature':fieldTiles(false);ground=216;mode='sphere';{let gr=g.createLinearGradient(0,0,0,220);gr.addColorStop(0,'#fff4cbcc');gr.addColorStop(1,'#fff4cb00');rect(0,0,720,220,gr)}break;
 case 'generative-geometry':for(let i=0;i<14;i++){let z=i*tau/14+t*.24;oval(360+Math.cos(z)*93,147+Math.sin(z)*78,8+3*Math.sin(t+i),8,0,i%2?ink:acc)}mode='wire';break;
 case 'particle-field':for(let i=0;i<175;i++){let k=rand(i),x=rand(i+200)*720,y=rand(i+400)*259;let targetX=360+Math.sin(i)*55,targetY=210-k*115;oval(x+(targetX-x)*v*.79,y+(targetY-y)*v*.79,1+k,1+k,0,i%3?acc:ink)}mode='wire';break;
 case 'soft-organic':for(let i=0;i<4;i++)oval(115+i*165,165+30*Math.sin(t+i),87+12*Math.sin(t+i),58,.25*i,'#deb6ab');mode='round';break;
 case 'comic-pop':for(let i=0;i<42;i++){let z=i*tau/42;line(360+Math.cos(z)*155,155+Math.sin(z)*98,360+Math.cos(z)*440,155+Math.sin(z)*260,ink,i%3+1)}mode='cut';titleMode='sticker';break;
 case 'flat-vector':sun(490,82,37);hills(1,'#e9bf78',160);hills(3,'#a9bc83',211);break;
 case 'guochao':serif=true;for(let i=0;i<18;i++){let x=i*44;for(let j=1;j<4;j++){g.beginPath();g.arc(x,234,j*8,Math.PI,2*Math.PI);g.strokeStyle=acc;g.stroke()}}frame(18,acc);mode='angular';break;
 case 'painterly':for(let i=0;i<1300;i++){let x=rand(i)*720,y=rand(i+1700)*255;line(x,y,x+9+rand(i+2800)*19,y-4-Math.sin(t*.6+x*.012)*3,['#d4c097','#ccb896','#ddd1a3'][i%3],3)}mode='hatch';serif=true;break;
 case 'cel-anime-80s':sun(518,88,52);poly([[0,224],[179,106],[285,194],[455,101],[720,216],[720,260],[0,260]],'#8b8891');poly([[420,124],[455,101],[500,137],[467,127]],'#e9c2ac');mode='cut';break;
 case 'rubber-hose':mode='rubber';groundLine();break;
 case 'whiteboard-explainer':mode='outline';for(let i=0;i<3;i++){let x=135+i*16;line(x,155,x+11*ease(t-.35*i),155,ink,2)}line(182,149,191,155,ink,2);line(182,161,191,155,ink,2);break;
 case 'crayon-storybook':for(let i=0;i<340;i++){let x=rand(i)*720,y=205+rand(i+520)*48;line(x,y,x-9,y-12*rand(i+840),'#b9b17e',2.4)}sun(496,78,31);mode='hatch';break;
 case 'ink-wash':serif=true;for(let i=0;i<13;i++)wave(210+i*.9,11,'rgba(79,91,75,.14)',4,.2);mode='brush';rect(584,303,19,23,acc);leaf=ink;break;
 case 'paper-cut':hills(0,'#c49e75',137);hills(2,'#91a178',172);hills(4,'#709679',210);mode='shadow';ink===stem&&(stem='#143e35');break;
 case 'copperplate-engraving':mode='hatch';serif=true;for(let i=0;i<30;i++)wave(222+i,5,acc,.75,.23);break;
 case 'ukiyo-e':sun(499,83,42);for(let j=0;j<10;j++)wave(201+j*5,8+j*.3,j%2?ink:acc,1.6,.45);serif=true;mode='cut';break;
 case 'shadow-puppet':line(126,264,338,155+25*fly,acc,2);line(550,265,383,130+26*fly,acc,2);mode='puppet';break;
 case 'illuminated-manuscript':serif=true;frame(20,acc);frame(26,ink);for(let i=0;i<21;i++){let x=40+i*32;oval(x,34,6,3,-.5,acc);oval(x,372,6,3,.5,acc)}mode='hatch';break;
 case 'cinematic-title':serif=true;rect(0,0,720,37,'#090d10');rect(0,369,720,36,'#090d10');for(let i=0;i<65;i++)oval(rand(i)*720,40+(rand(i+96)*270+t*3)%270,1,1,0,'#babda14f');mode='brush';break;
 case 'mixed-media-era':for(let j=0;j<3;j++){rect(64+j*200,40,192,209,['#c9b384','#d38d77','#739f98'][j]);for(let k=0;k<8;k++)rect(68+j*200+k*24,44,8,4,bg)}mode=t<1.5?'pixel':t<3?'hatch':'flat';break;
 }
 // Same seed, stem and pair of leaves; each medium builds them in its own way.
 g.save();g.translate(cx,ground);const bounce=(mode==='rubber'||mode==='sphere')?Math.sin(t*8)*Math.exp(-Math.max(0,t-.9)*2)*v*.12:0;
 g.scale(1-bounce,1+bounce);const h=105*v,l=49*a;
 oval(0,-8-125*fly,11,6,-.5,mode==='wire'?bg:stem,stem);
 if(v>.005){g.save();g.strokeStyle=stem;g.lineWidth=mode==='brush'?6:mode==='wire'?1.8:4;g.lineCap='round';
 if(mode==='pixel'||mode==='ascii'){for(let i=0;i<h;i+=8){if(mode==='ascii')text('|',-5,-i,12,ink,'monospace');else rect(-4,-i-6,8,8,stem)}}else{g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(mode==='rubber'?18*Math.sin(t*4):-9,-h*.53,0,-h);g.stroke()}g.restore()}
 for(const side of [-1,1]){g.save();g.translate(0,-h+4);g.scale(side,1);g.rotate(-.44-.16*a+.05*Math.sin(t*2));if(l>.5){
 if(mode==='pixel'||mode==='ascii'){for(let j=0;j<l;j+=7){if(mode==='ascii')text(j%2?'*':'+',j,-j*.18,13,ink,'monospace');else rect(j,-Math.sin(j/l*Math.PI)*10,8,Math.max(5,Math.sin(j/l*Math.PI)*21),leaf)}}
 else if(mode==='sphere'||mode==='round'){g.scale(1,.57);if(mode==='sphere')ball(l*.55,0,l*.57,'#fff2cc',leaf);else oval(l*.55,0,l*.55,20*a,0,leaf)}
 else{const shape=new Path2D();shape.moveTo(0,0);if(mode==='angular'){shape.lineTo(l*.3,-16*a);shape.lineTo(l*1.2,-4);shape.lineTo(l*.65,13*a)}else{shape.bezierCurveTo(l*.18,-23*a,l*.85,-21*a,l*1.2,-4*a);shape.bezierCurveTo(l*.75,13*a,l*.24,20*a,0,0)}shape.closePath();
 if(mode==='riso'||mode==='shadow'){g.save();g.translate(5,4);g.fillStyle=mode==='riso'?acc:'#546751';g.fill(shape);g.restore()}
 g.fillStyle=mode==='hatch'||mode==='outline'||mode==='wire'?bg:mode==='riso'?ink:leaf;g.fill(shape);g.strokeStyle=stem;g.lineWidth=mode==='cut'||mode==='puppet'?3:1.5;g.stroke(shape);
 if(mode==='hatch'||mode==='brush'||mode==='puppet'){g.save();g.clip(shape);for(let j=0;j<l*1.3;j+=mode==='puppet'?8:3.4)line(j,-19,j-10,17,mode==='puppet'?bg:stem,.9);g.restore()}else if(mode!=='angular')line(0,0,l,0,stem,1);}
 }g.restore()}g.restore();
 const title='令人向往的农场', reveal=ease((t-1.65)/1.18), base=320;
 if(reveal>0){g.save();let size=titleMode==='slam'?65:51, weight=serif?700:800;const font=serif?'"Songti SC",serif':'"PingFang SC",sans-serif';g.font=weight+' '+size+'px '+font;let width=g.measureText(title).width,x=titleMode==='left'?38:(720-width)/2;
 if(titleMode==='sticker'){g.translate(360,base-19);g.rotate(-.035);g.translate(-360,-base+19);rect(x-15,base-55,(width+30)*reveal,70,acc)}
 g.beginPath();g.rect(0,262,720,90);g.clip();
 [...title].forEach((ch,i)=>{let p=ease((t-1.65-i*.065)/.65);if(p<=0)return;let xx=x+g.measureText(title.slice(0,i)).width,yy=base+(1-p)*(titleMode==='slam'?95:48);if(titleMode==='glitch')text(ch,xx+4*(1-p)+1.6,yy+1,size,acc,font,weight);g.globalAlpha=p;text(ch,xx,yy,size,titleMode==='sticker'?'#202a2d':ink,font,weight);g.globalAlpha=1});g.restore()}
}
