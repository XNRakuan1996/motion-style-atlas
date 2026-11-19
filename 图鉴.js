const $=id=>document.getElementById(id), storeKey='akuan-motion-styles-v1';
let custom=[],selected,editing,base,broken=false;
try{custom=JSON.parse(localStorage.getItem(storeKey)||'[]');if(!Array.isArray(custom))throw Error()}catch{broken=true}
const terms={
 '江东村 人物卡 村里见 像杂志 贴纸 相册 年轻': ['editorial-collage','comic-pop','risograph-print'],
 '江东村 农田 乡村 自然 田园 传统 乡土':['ink-wash','ukiyo-e','paper-cut','copperplate-engraving'],
 '科技感 未来 植物工厂 科技 设施农业':['blueprint','hologram-hud','isometric-infographic','data-motion'],
 '课程讲解 像手绘 手画 教学 流程 简笔画':['one-line','whiteboard-explainer','flat-vector','concept-morph'],
 '像手绘 绘本 可爱 童趣':['crayon-storybook','painterly','soft-3d-toy'],
 '复古 老电视 怀旧 街机':['crt-vhs','pixel-game','cel-anime-80s','synthwave-neon'],
 '高级 大片 发布会 电影 大气':['cinematic-title','dark-keynote','art-deco'],
 '小程序 产品操作 录屏':['minimal-ui','isometric-infographic'],
 '农场 运营报表 数字 农业数据':['data-motion','swiss-editorial','isometric-infographic']
};
for(const group of new Set(catalog.map(r=>r.group).concat('我的风格')))$('group').add(new Option(group,group));
const el=(tag,t,cl)=>{const n=document.createElement(tag);n.textContent=t||'';if(cl)n.className=cl;return n};
function ref(r){return catalog.find(x=>x.id===r.base)}
function visual(r,large=false){const s=ref(r)||r;if(r.photo||s.img){const i=new Image();i.alt=r.name+'样图';i.loading=large?'eager':'lazy';i.src=r.photo||s.img;return i}if(s.paint){const c=document.createElement('canvas');c.width=600;c.height=338;drawFarm(c,s.id,3.7);return c}if(catalog.includes(s))return sketch(s.id);return el('div','尚未添加参考图','customBlank')}
function origin(r){return r.photo?'我的参考图':(ref(r)||r).img?'上游风格样图':catalog.includes(ref(r)||r)?'本页绘制的示意图':'我的描述'}
function render(){
 let words=$('search').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
 const rows=[...custom,...catalog].filter(r=>{
 const aliases=Object.entries(terms).filter(([k,ids])=>ids.includes(r.base||r.id)).map(x=>x[0]).join(' ');
 const hay=[r.name,r.id,r.group,r.batch,r.desc,r.use,r.mood,...(r.signals||[]),aliases].join(' ').toLowerCase();
 return (!$('group').value||r.group===$('group').value)&&(!$('scope').value||custom.includes(r))&&words.every(w=>hay.includes(w))
 });
 $('count').textContent='显示 '+rows.length+' 款　·　开源扩展 '+extraStyles.length+' 款 / 原库 '+(catalog.length-extraStyles.length)+' 款 / 我的补充 '+custom.length+' 款';
 $('grid').replaceChildren(...rows.map(r=>{let b=el('button','','card'),box=el('div','','body');box.append(el('small',r.group+'　/　'+(farmLooks[(ref(r)||r).id]?'▶ 5 秒小样':origin(r)),'meta'),el('h2',r.name),el('p',r.desc));b.append(visual(r),box);b.dataset.styleId=r.id;b.dataset.sample=farmLooks[(ref(r)||r).id]?'yes':'no';b.onclick=()=>openDetail(r);return b}));if(!rows.length)$('grid').append(el('p','没有匹配的风格。试试更短的词，或点「补充风格」记录你的想法。'));
}
function compose(){const r=selected, main=ref(r)||r;const style=main.source?'，按图鉴扩展「'+main.name+'」的画面和动作规则自定义':catalog.includes(main)?'，参考内置风格 '+main.id:'';
 $('prompt').value='用 motion-showreel 做'+($('topic').value.trim()||'我的视频')+'。我想要「'+r.name+'」'+style+'。画面和动作参考：'+r.desc+'。'+(r.signals?.length?'优先表现'+r.signals.slice(0,2).map(s=>s.split(' · ')[0]).join('和')+'。':'')+'先给我看风格帧，确认后再做完整预览。';}
function openDetail(r){selected=r;const m=ref(r)||r,link=$('styleSource');link.hidden=!m.source;if(m.source){link.href=m.source;link.textContent='视觉参考 · '+m.sourceName};$('name').textContent=r.name;$('detailMeta').textContent=r.group+'　/　'+origin(r);$('about').textContent=r.desc;$('visual').replaceChildren(visual(r,true));$('signals').replaceChildren(...(r.signals?.length?r.signals:[r.desc]).map(s=>el('li',s)));$('fit').textContent='适合 '+(r.use||'按素材选择')+'　·　'+(r.mood||'自定义');$('adapt').textContent=custom.includes(r)?'编辑这款风格':'存成我的风格';$('copymsg').textContent='';compose();if(!$('detail').open)$('detail').showModal();startSample(r)}
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('prompt').value);$('copymsg').textContent='话术已复制'}catch{$('prompt').select();$('copymsg').textContent=document.execCommand('copy')?'话术已复制':'已选中话术，按 ⌘C 或 Ctrl+C 复制'}};
$('topic').oninput=compose;
function editor(r){editing=r&&custom.includes(r)?r:null;base=r?(ref(r)?.id||(catalog.includes(r)?r.id:null)):null;$('entry').reset();$('titleIn').value=r?(editing?r.name:r.name+' · 我的版本'):'';$('descIn').value=r?.desc||'';$('tagsIn').value=r?.use||'';$('formmsg').textContent='';$('picHint').textContent=r?'不选新图时沿用原参考。':'';$('form').showModal()}
$('adapt').onclick=()=>{$('detail').close();editor(selected)};$('add').onclick=()=>editor(null);
function write(rows){if(broken)throw Error('当前浏览器的存储无法读取，请换浏览器或恢复原数据。');localStorage.setItem(storeKey,JSON.stringify(rows));custom=rows;render()}
async function photo(f){if(!f)return '';const bm=await createImageBitmap(f),c=document.createElement('canvas'),k=Math.min(1,720/Math.max(bm.width,bm.height));c.width=Math.max(1,Math.round(bm.width*k));c.height=Math.max(1,Math.round(bm.height*k));let ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(bm,0,0,c.width,c.height);bm.close();return c.toDataURL('image/jpeg',.77)}
$('entry').onsubmit=async e=>{e.preventDefault();try{let row={id:editing?.id||'user-'+crypto.randomUUID(),group:'我的风格',name:$('titleIn').value.trim(),desc:$('descIn').value.trim(),use:$('tagsIn').value.trim(),base,photo:await photo($('pic').files[0])||editing?.photo||'',signals:[]};if(!row.name||!row.desc)throw Error('请填写名字和画面描述');write([row,...custom.filter(x=>x.id!==row.id)]);$('form').close();$('search').value='';$('group').value='';$('scope').value='mine';render()}catch(err){$('formmsg').textContent=' 保存失败：'+err.message+'。图片较多时可缩小图片再试。'}};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
for(const id of ['scope','group','search'])$(id).oninput=render;
document.querySelectorAll('.examples button').forEach(b=>b.onclick=()=>{$('scope').value=$('group').value='';$('search').value=b.textContent==='清除筛选'?'':b.textContent;render()});
$('backup').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({version:1,styles:custom},null,2)],{type:'application/json'}));a.download='我的动效风格.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
$('restore').onclick=()=>$('jsonfile').click();
$('jsonfile').onchange=async e=>{try{const f=e.target.files[0];if(!f)return;const d=JSON.parse(await f.text());if(d.version!==1||!Array.isArray(d.styles))throw Error('备份格式不匹配');const next=[...custom];for(const x of d.styles){if(typeof x.id!=='string'||!x.id.startsWith('user-')||typeof x.name!=='string'||typeof x.desc!=='string'||(x.photo&&!/^data:image\/(jpeg|png|webp);base64,/.test(x.photo)))throw Error('条目格式不匹配');if(next.some(r=>r.id===x.id&&r.name===x.name&&r.desc===x.desc&&r.photo===x.photo&&r.use===x.use&&r.base===x.base))continue;next.push({...x,id:next.some(r=>r.id===x.id)?'user-'+crypto.randomUUID():x.id,group:'我的风格',signals:[]})}write(next);$('scope').value='mine';$('group').value=$('search').value='';render();$('msg').textContent='已导入，重复条目自动跳过'}catch(err){$('msg').textContent='导入失败：'+err.message}finally{e.target.value='';setTimeout(()=>$('msg').textContent='',4500)}};
const batchLabel = {craft:'机械与手作', media:'光影与介质', lab:'显影实验室'}[new URLSearchParams(location.search).get('batch')];
if (batchLabel) $('search').value=batchLabel;
render();
let sampleFrame=0,sampleTime=0,sampleStyle='',sampleRunning=false,sampleEpoch=0;
function paintSample(){drawFarm($('farmCanvas'),sampleStyle,sampleTime);$('scrubber').value=sampleTime;$('clockLabel').textContent=sampleTime.toFixed(1)+' / 5 秒'}
function tickSample(now){if(!sampleRunning)return;sampleTime=((now-sampleEpoch)/1000)%farmDuration;paintSample();sampleFrame=requestAnimationFrame(tickSample)}
function runSample(on){cancelAnimationFrame(sampleFrame);sampleRunning=on;$('togglePlay').textContent=on?'暂停':'播放';if(on){sampleEpoch=performance.now()-1000*sampleTime;sampleFrame=requestAnimationFrame(tickSample)}}
function startSample(r){runSample(false);const src=ref(r)||r;sampleStyle=src.id;$('player').hidden=!farmLooks[src.id];if($('player').hidden)return;sampleTime=0;paintSample();$('detailMeta').textContent=r.group+'　/　'+(ref(r)?'基于「'+src.name+'」的内置小样':'令人向往的农场 · 静音循环小样');runSample(true)}
$('togglePlay').onclick=()=>runSample(!sampleRunning);
$('scrubber').oninput=e=>{runSample(false);sampleTime=Number(e.target.value);paintSample()};
function adjacent(step){const cards=[...$('grid').querySelectorAll('.card')],current=cards.findIndex(b=>b.dataset.styleId===selected.id);if(current<0)return;for(let i=1;i<=cards.length;i++){const b=cards[(current+step*i+cards.length)%cards.length];if(b.dataset.sample==='yes'){b.click();$('detail').scrollTop=0;break}}}
$('previous').onclick=()=>adjacent(-1);$('next').onclick=()=>adjacent(1);$('detail').addEventListener('close',()=>runSample(false));
