const foods=[['Pechuga de pollo',165,31,0,3.6,1.0,0,0,0.15],['Pechuga de pavo',104,24,0,1,0.3,0,0,0.12],['Atún al natural',116,26,0,1,0.2,0,0,1.0],['Salmón',208,20,0,13,3.1,0,0,0.13],['Huevo',143,12.6,.7,9.5,3.1,0.4,0,0.36],['Arroz cocido',130,2.7,28,.3,0.1,0,0.4,0],['Arroz crudo',360,7,79,.7,0.2,0.1,1.3,0.01],['Pasta cocida',158,5.8,30.9,.9,0.2,0.5,1.8,0.01],['Avena',389,16.9,66.3,6.9,1.2,0.9,10.6,0],['Pan integral',247,13,41,4.2,0.7,5.0,6.5,1.2],['Patata cocida',87,1.9,20,.1,0,0.9,1.8,0.01],['Lentejas cocidas',116,9,20,.4,0.1,1.8,7.9,0.01],['Garbanzos cocidos',164,8.9,27.4,2.6,0.3,2.4,7.6,0.01],['Leche semidesnatada',46,3.3,4.8,1.6,1.0,4.8,0,0.1],['Yogur natural',61,3.5,4.7,3.3,2.1,4.7,0,0.1],['Plátano',89,1.1,22.8,.3,0.1,12.2,2.6,0],['Manzana',52,.3,14,.2,0.03,10.4,2.4,0],['Tomate',18,.9,3.9,.2,0.03,2.6,1.2,0.01],['Aguacate',160,2,8.5,14.7,2.1,0.7,6.7,0.01],['Almendras',579,21,22,50,3.8,4.4,12.5,0],['Aceite de oliva',884,0,0,100,14.0,0,0,0],['Brócoli',35,2.4,7.2,.4,0.05,1.4,3.3,0.03],['Zanahoria',41,.9,9.6,.2,0.03,4.7,2.8,0.07],['Queso fresco',174,11,3,13,8.5,3.0,0,0.8],['Ternera magra',172,26,0,7,2.7,0,0,0.15],['Cerdo magro',143,21,0,6,2.1,0,0,0.15],['Merluza',89,18,0,1.8,0.4,0,0,0.16],['Gamba',99,24,0,0.3,0.1,0,0,1.0],['Naranja',47,.9,11.8,.1,0.02,8.5,2.4,0],['Fresas',32,.7,7.7,.3,0.02,4.9,2.0,0],['Kiwi',61,1.1,14.7,.5,0.03,8.9,3.0,0.01],['Cacahuetes',567,25.8,16.1,49.2,6.8,4.0,8.5,0]];
let profile=JSON.parse(localStorage.getItem('nf_profile_v3')||'null'),log=JSON.parse(localStorage.getItem('nf_log_v3')||'[]'),water=+localStorage.getItem('nf_water_v3')||0,favs=JSON.parse(localStorage.getItem('nf_favs_v3')||'[]'),history=JSON.parse(localStorage.getItem('nf_history_v3')||'[]'),selected=null;
const $=id=>document.getElementById(id);
function go(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));if(id==='home')render();renderWeekV4();renderShoppingV4();if(id==='progress')renderProgress();if(id==='favorites')renderFavorites();}
function saveProfile(){let a=+$('age').value,h=+$('height').value,w=+$('weight').value;if(!a||!h||!w)return alert('Completa edad, altura y peso.');let bmr=10*w+6.25*h-5*a+($('sex').value==='m'?5:-161),tdee=bmr*+$('activity').value,g=$('goal').value,kcal=Math.round((tdee+(g==='lose'?-350:g==='gain'?250:0))/10)*10,protein=Math.round(w*(g==='gain'?1.8:1.6)),fat=Math.round(kcal*.25/9),carb=Math.max(0,Math.round((kcal-protein*4-fat*9)/4));profile={kcal,protein,carb,fat};localStorage.setItem('nf_profile_v3',JSON.stringify(profile));go('home')}
function clearProfile(){profile=null;localStorage.removeItem('nf_profile_v3');go('home')}
function openFood(){if(!$('modal'))return;$('modal').classList.add('open');$('search').value='';$('amountBox').hidden=true;renderFoods();setTimeout(()=>$('search').focus(),100)}
function closeFood(){$('modal').classList.remove('open');selected=null}
function renderFoods(){let q=$('search').value.toLowerCase();$('foodList').innerHTML=foods.filter(f=>f[0].toLowerCase().includes(q)).map((f,i)=>`<div class="food" onclick="selectFood(${i})"><b>${f[0]} ${favs.includes(f[0])?'⭐':''}</b><small>${f[1]} kcal · ${f[2]} g proteína · ${f[3]} g carbos · ${f[4]} g grasa</small><em>${f[5]} g saturadas · ${f[6]} g azúcares · ${f[7]} g fibra · ${f[8]} g sal / 100 g</em></div>`).join('')||'<p>Sin resultados.</p>'}
function selectFood(i){selected=foods[i];$('foodName').textContent=selected[0];$('foodInfo').textContent=`${selected[1]} kcal · ${selected[2]} g proteína · ${selected[3]} g carbos · ${selected[4]} g grasa · ${selected[5]} g saturadas · ${selected[6]} g azúcares · ${selected[7]} g fibra · ${selected[8]} g sal / 100 g`;$('amountBox').hidden=false}
function toggleFavorite(){if(!selected)return;let n=selected[0];favs=favs.includes(n)?favs.filter(x=>x!==n):[...favs,n];localStorage.setItem('nf_favs_v3',JSON.stringify(favs));renderFoods()}
function addFood(){if(!selected)return;let g=+$('amount').value||100,m=$('meal').value,k=g/100;log.push({id:Date.now(),food:selected[0],meal:m,g,kcal:selected[1]*k,p:selected[2]*k,c:selected[3]*k,f:selected[4]*k,sat:selected[5]*k,sugar:selected[6]*k,fiber:selected[7]*k,salt:selected[8]*k});localStorage.setItem('nf_log_v3',JSON.stringify(log));saveHistory();closeFood();render()}
function del(id){log=log.filter(x=>x.id!==id);localStorage.setItem('nf_log_v3',JSON.stringify(log));render()}
function addWater(){water=Math.min(5000,water+250);localStorage.setItem('nf_water_v3',water);render()}
function totals(){return log.reduce((a,x)=>({k:a.k+x.kcal,p:a.p+x.p,c:a.c+x.c,f:a.f+x.f,sat:a.sat+(x.sat||0),sugar:a.sugar+(x.sugar||0),fiber:a.fiber+(x.fiber||0),salt:a.salt+(x.salt||0)}),{k:0,p:0,c:0,f:0,sat:0,sugar:0,fiber:0,salt:0})}
function saveHistory(){let t=totals(),key=new Date().toISOString().slice(0,10);history=history.filter(x=>x.date!==key);history.unshift({date:key,kcal:Math.round(t.k),foods:log.length});history=history.slice(0,14);localStorage.setItem('nf_history_v3',JSON.stringify(history))}
function render(){let t=totals();$('kcal').textContent=Math.round(t.k);$('p').textContent=Math.round(t.p)+' g';$('c').textContent=Math.round(t.c)+' g';$('f').textContent=Math.round(t.f)+' g';$('foodCount').textContent=log.length+' alimento'+(log.length===1?'':'s');if(profile){$('targetKcal').textContent=' / '+profile.kcal;$('remaining').textContent=t.k>=profile.kcal?`Has alcanzado tu objetivo de ${profile.kcal} kcal`:`Te quedan ${Math.round(profile.kcal-t.k)} kcal`;$('pt').textContent=`${Math.round(t.p)} / ${profile.protein} g`;$('ct').textContent=`${Math.round(t.c)} / ${profile.carb} g`;$('ft').textContent=`${Math.round(t.f)} / ${profile.fat} g`;[['pb',t.p,profile.protein],['cb',t.c,profile.carb],['fb',t.f,profile.fat]].forEach(([id,v,m])=>$(id).style.width=Math.min(100,v/m*100)+'%');let pct=Math.min(100,t.k/profile.kcal*100);$('kcalPct').textContent=Math.round(pct)+'%';document.querySelector('.donut').style.setProperty('--deg',pct*3.6+'deg')}else{$('targetKcal').textContent='';$('remaining').textContent='Configura tu perfil para ver objetivos personalizados';$('kcalPct').textContent='—';['pt','ct','ft'].forEach(id=>$(id).textContent='Sin objetivo');['pb','cb','fb'].forEach(id=>$(id).style.width='0%')}$('waterText').textContent=(water/1000).toFixed(1).replace('.',',')+' / 2,5 L';$('waterBar').style.width=Math.min(100,water/25)+'%';$('meals').innerHTML=['Desayuno','Comida','Merienda','Cena','Snack'].map(m=>{let a=log.filter(x=>x.meal===m),sum=a.reduce((s,x)=>s+x.kcal,0);return `<div class="meal"><div class="mealhead"><b>${m}</b><span>${Math.round(sum)} kcal</span></div><button class="mealAddBtn" type="button" aria-label="Añadir a ${m}" onclick="openFoodForMeal('${m}')">＋</button>${a.length?a.map(x=>`<div class="foodrow"><span>${x.food} · ${x.g} g</span><span>${Math.round(x.kcal)} kcal <button class="rowedit" onclick="editLoggedFood(${x.id})">✎</button><button onclick="del(${x.id})">×</button></span></div>`).join(''):'<div class="empty">Sin alimentos registrados</div>'}</div>`}).join('')}
function generateDay(){if(!$('dayPlan'))return;let options=[['Desayuno','Avena con leche y plátano','Avena + leche + plátano'],['Comida','Pollo con arroz y brócoli','Pollo + arroz + brócoli'],['Merienda','Yogur con fresas y almendras','Yogur + fresas + almendras'],['Cena','Merluza con patata y tomate','Merluza + patata + tomate']];$('dayPlan').innerHTML='<div class="daycard"><h3>Plan orientativo</h3>'+options.map(x=>`<div class="daymeal"><b>${x[0]}</b>${x[1]}<small>${x[2]}</small></div>`).join('')+'</div>'}
function renderProgress(){$('todayKcal').textContent=Math.round(totals().k);$('todayFoods').textContent=log.length;$('favCount').textContent=favs.length;$('history').innerHTML=history.length?history.map(x=>`<div class="historyrow"><span>${x.date}</span><b>${x.kcal} kcal · ${x.foods} alimentos</b></div>`).join(''):'<div class="coming">Todavía no hay historial.</div>'}
function renderFavorites(){$('favoritesList').innerHTML=favs.length?favs.map(n=>`<div class="meal"><b>${n}</b><button class="ghost" onclick="quickFavorite('${n.replace(/'/g,"\\'")}')">Añadir</button></div>`).join(''):'<div class="coming">Todavía no tienes favoritos.</div>'}
function quickFavorite(n){let i=foods.findIndex(f=>f[0]===n);if(i>=0){openFood();selectFood(i)}}
function ask(q){$('chatInput').value=q;sendChat()}
function sendChat(){let q=$('chatInput').value.trim();if(!q)return;let box=$('chatbox');box.innerHTML+=`<div class="bubble user">${q}</div>`;let t=totals(),ans;if(q.toLowerCase().includes('proteína'))ans=profile?`Llevas ${Math.round(t.p)} g de proteína de ${profile.protein} g objetivo.`:`Llevas ${Math.round(t.p)} g de proteína. Configura tu perfil para tener una meta.`;else if(q.toLowerCase().includes('cenar')){let rem=profile?Math.max(0,Math.round(profile.kcal-t.k)):600;ans=`Te quedan aproximadamente ${rem} kcal. Una idea sencilla: merluza con patata y verduras, ajustando la cantidad a lo que te quede.`}else ans='Con lo que llevas hoy, priorizaría una comida con proteína, verduras y una fuente de carbohidratos ajustada a tus calorías restantes. Recuerda que soy un asistente orientativo, no sustituyo a un profesional.';box.innerHTML+=`<div class="bubble ai">${ans}</div>`;box.scrollTop=box.scrollHeight;$('chatInput').value=''}
$('date').textContent=new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short'}).format(new Date());render();

const weekRecipes=[
{name:'Avena con yogur y plátano',meal:'Desayuno',k:430,p:23,c:62,f:11,tags:['rápido','barato','dulce'],items:['Avena 60 g','Yogur natural 200 g','Plátano 120 g']},
{name:'Tostadas de pavo y tomate',meal:'Desayuno',k:390,p:29,c:45,f:9,tags:['rápido','salado','carne'],items:['Pan integral 90 g','Pavo 80 g','Tomate 100 g']},
{name:'Tortilla con pan y tomate',meal:'Desayuno',k:410,p:25,c:35,f:18,tags:['rápido','salado','barato'],items:['Huevos 3 ud','Pan integral 60 g','Tomate 150 g']},
{name:'Pollo con arroz y brócoli',meal:'Comida',k:610,p:51,c:70,f:13,tags:['proteína','barato','carne'],items:['Pollo 180 g','Arroz cocido 220 g','Brócoli 150 g','Aceite 8 g']},
{name:'Lentejas con huevo',meal:'Comida',k:560,p:31,c:65,f:18,tags:['barato','vegetariano'],items:['Lentejas 300 g','Huevos 2 ud','Tomate 100 g']},
{name:'Ternera con patata y verduras',meal:'Comida',k:590,p:44,c:50,f:20,tags:['proteína','carne'],items:['Ternera magra 180 g','Patata 280 g','Verduras 150 g']},
{name:'Yogur con fresas y almendras',meal:'Merienda',k:300,p:14,c:28,f:15,tags:['rápido','dulce','barato'],items:['Yogur 200 g','Fresas 200 g','Almendras 20 g']},
{name:'Plátano y yogur proteico',meal:'Merienda',k:260,p:20,c:35,f:5,tags:['rápido','dulce','proteína'],items:['Yogur alto en proteína 200 g','Plátano 120 g']},
{name:'Merluza con patata y ensalada',meal:'Cena',k:520,p:40,c:52,f:14,tags:['rápido','pescado'],items:['Merluza 200 g','Patata 300 g','Tomate 120 g','Aceite 8 g']},
{name:'Salmón con arroz y verduras',meal:'Cena',k:650,p:38,c:55,f:29,tags:['pescado','proteína'],items:['Salmón 170 g','Arroz 180 g','Brócoli 150 g']},
{name:'Pasta con pollo',meal:'Cena',k:600,p:45,c:68,f:12,tags:['rápido','carne','proteína'],items:['Pasta cocida 280 g','Pollo 150 g','Tomate 100 g']},
{name:'Ensalada completa de atún',meal:'Cena',k:480,p:42,c:32,f:18,tags:['rápido','pescado','ligero'],items:['Atún 140 g','Patata 180 g','Tomate 150 g','Aguacate 50 g']}
];
let currentSwap=null, swapPrefs=JSON.parse(localStorage.getItem('nf_swap_prefs_v4')||'{}'), weekV4=JSON.parse(localStorage.getItem('nf_week_v4')||'null'), shopV4=JSON.parse(localStorage.getItem('nf_shop_v4')||'null');

function generateWeek(){
 const days=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
 weekV4=days.map((day,di)=>({day,meals:[
  weekRecipes[(di+0)%weekRecipes.length],
  weekRecipes[(di+3)%weekRecipes.length],
  weekRecipes[(di+6)%weekRecipes.length],
  weekRecipes[(di+8)%weekRecipes.length]
]}));
 localStorage.setItem('nf_week_v4',JSON.stringify(weekV4)); renderWeekV4();
}
function renderWeekV4(){
 if(!weekV4){$('weekPlan').innerHTML='<div class="coming"><span>🥗</span><h2>Tu semana está vacía</h2><p>Pulsa “Generar semana” para empezar.</p></div>';return}
 $('weekPlan').innerHTML=weekV4.map((d,di)=>`<div class="daycard"><div class="daytop"><h3>${d.day}</h3><span>${Math.round(d.meals.reduce((s,r)=>s+r.k,0))} kcal aprox.</span></div>${d.meals.map((r,mi)=>`<div class="daymeal"><b>${r.meal}</b><strong>${r.name}</strong><small>${r.k} kcal · ${r.p} g proteína · ${r.c} g carbos · ${r.f} g grasa</small><div class="items">${r.items.join(' · ')}</div><button class="swapbtn" onclick="openSwap(${di},${mi})">🔄 Cambiar esta comida</button></div>`).join('')}</div>`).join('');
}
function openSwap(di,mi){
 currentSwap={di,mi};let r=weekV4[di].meals[mi];
 $('swapTitle').textContent=`Cambia ${r.meal.toLowerCase()}`;
 const prefs=['❤️ Me gusta más','⚡ Rápido','💰 Barato','💪 Más proteína','🔥 Menos kcal','🥩 Carne','🐟 Pescado','🥗 Vegetariano','🎲 Sorpréndeme'];
 $('swapChips').innerHTML=prefs.map((p,i)=>`<button onclick="swapFilter(${i})">${p}</button>`).join('');
 swapFilter(0);$('swapModal').classList.add('open');
}
function closeSwap(){$('swapModal').classList.remove('open');currentSwap=null}
function swapFilter(i){
 if(!currentSwap)return;let r=weekV4[currentSwap.di].meals[currentSwap.mi], tags=['favorito','rápido','barato','proteína','ligero','carne','pescado','vegetariano','random'];
 let tag=tags[i], pool=weekRecipes.filter(x=>x.meal===r.meal&&x.name!==r.name);
 if(tag==='favorito') pool.sort((a,b)=>(swapPrefs[b.name]||0)-(swapPrefs[a.name]||0));
 else if(tag==='random') pool.sort(()=>Math.random()-.5);
 else if(tag==='proteína') pool.sort((a,b)=>b.p-a.p);
 else if(tag==='ligero') pool.sort((a,b)=>a.k-b.k);
 else pool=pool.filter(x=>x.tags.includes(tag)).concat(pool.filter(x=>!x.tags.includes(tag)));
 $('swapOptions').innerHTML=pool.slice(0,4).map(x=>`<div class="swapoption"><b>${x.name}</b><small>${x.k} kcal · ${x.p} g proteína · ${x.c} g carbos · ${x.f} g grasa<br>${x.items.join(' · ')}</small><button onclick="chooseSwap('${x.name.replace(/'/g,"\\'")}')">Elegir</button></div>`).join('');
}
function chooseSwap(name){
 let chosen=weekRecipes.find(x=>x.name===name);if(!chosen||!currentSwap)return;
 weekV4[currentSwap.di].meals[currentSwap.mi]=chosen;
 swapPrefs[name]=(swapPrefs[name]||0)+1;
 localStorage.setItem('nf_swap_prefs_v4',JSON.stringify(swapPrefs));
 localStorage.setItem('nf_week_v4',JSON.stringify(weekV4));
 closeSwap();renderWeekV4();
}
function makeShoppingListV4(){
 if(!weekV4){alert('Genera primero una semana.');return}
 let c={};weekV4.forEach(d=>d.meals.forEach(r=>r.items.forEach(x=>c[x]=(c[x]||0)+1)));
 shopV4=Object.keys(c);localStorage.setItem('nf_shop_v4',JSON.stringify(shopV4));renderShoppingV4();$('shopping').hidden=false;
}
function renderShoppingV4(){if(!shopV4)return;$('shoppingList').innerHTML='<div class="shopcard">'+shopV4.map(x=>`<label class="check"><input type="checkbox"><span>${x}</span></label>`).join('')+'</div>'}
async function copyShoppingV4(){if(!shopV4)return;let text='Lista NutriFit\\n'+shopV4.map(x=>'• '+x).join('\\n');try{await navigator.clipboard.writeText(text);alert('Lista copiada.')}catch(e){alert(text)}}

function makeShoppingList(){makeShoppingListV4()} function renderShopping(){renderShoppingV4()} function copyShopping(){copyShoppingV4()}

function updateV6(){
 if($('streak'))$('streak').textContent=Math.max(1,Math.min(30,history.length+1));
 if($('insightText')){let t=totals();if(!profile){$('insightTitle').textContent=log.length?'Buen comienzo 🌱':'Tu primer paso';$('insightText').textContent=log.length?'Configura tus objetivos para recibir recomendaciones personalizadas.':'Registra una comida y empieza a construir tu día.'}else if(t.p<profile.protein){$('insightTitle').textContent='Un empujón de proteína 💪';$('insightText').textContent=`Te faltan ${Math.max(0,Math.round(profile.protein-t.p))} g para tu objetivo de hoy.`}else{$('insightTitle').textContent='Vas muy bien ✨';$('insightText').textContent=`Te quedan aproximadamente ${Math.max(0,Math.round(profile.kcal-t.k))} kcal.`}}
 if($('microgrid')){let t=totals(),v=[['Proteína',t.p,profile?.protein||100,'g'],['Hidratos',t.c,profile?.carb||100,'g'],['Grasas',t.f,profile?.fat||70,'g'],['Saturadas',t.sat,20,'g'],['Azúcares',t.sugar,50,'g'],['Fibra',t.fiber,30,'g'],['Sal',t.salt,5,'g'],['Calorías',t.k,profile?.kcal||2000,'kcal']];$('microgrid').innerHTML=v.map(x=>`<div class="microcard"><b>${Math.round(x[1])} ${x[3]}</b><span>${x[0]} · objetivo ${x[2]} ${x[3]}</span><div class="microbar"><i style="width:${Math.min(100,x[1]/x[2]*100)}%"></i></div></div>`).join('')}}
const renderV6Base=render;render=function(){renderV6Base();updateV6();}

let pendingMealV7=null;
function openFoodForMeal(meal){
  pendingMealV7=meal;
  openFood();
  setTimeout(()=>{
    const sel=$('meal');
    if(sel) sel.value=meal;
    const title=document.querySelector('#modal h2,#modal h3');
    if(title) title.textContent='Añadir a '+meal;
  },60);
}

/* NutriFit 1.0 — small features that make daily logging faster */
function recentFoodsV10(){
  const box=$('recentList'); if(!box)return;
  const names=[...new Set(log.slice().reverse().map(x=>x.food))].slice(0,5);
  if(!names.length){box.innerHTML='<span class="recentempty">Tus alimentos recientes aparecerán aquí.</span>';return;}
  box.innerHTML=names.map(n=>`<button class="recentpill" onclick="quickRecent('${n.replace(/'/g,"\\'")}')">↺ ${n}</button>`).join('');
}
function quickRecent(n){
  const i=foods.findIndex(f=>f[0]===n);
  if(i<0)return;
  openFood();selectFood(i);
}
function duplicateLastMeal(){
  if(!log.length){openFood();return;}
  const last=log[log.length-1];
  const same=log.filter(x=>x.meal===last.meal);
  if(!same.length)return;
  same.forEach(x=>{log.push({...x,id:Date.now()+Math.random()});});
  localStorage.setItem('nf_log_v3',JSON.stringify(log));saveHistory();render();
}
function showTodayTip(){
  const tips=[
    'Intenta que cada comida principal tenga una fuente de proteína.',
    'Si te quedan pocas kcal, prioriza alimentos saciantes y ricos en proteína.',
    'Un vaso de agua antes de comer puede ayudarte a mantener una buena hidratación.',
    'No hace falta clavar el objetivo todos los días: mira también la tendencia semanal.',
    'Si entrenas hoy, puedes repartir la proteína entre varias comidas.'
  ];
  alert('💡 Consejo NutriFit\\n\\n'+tips[new Date().getDate()%tips.length]);
}
function editLoggedFood(id){
  const x=log.find(a=>a.id===id); if(!x)return;
  const g=prompt(`Cantidad de ${x.food} (gramos):`,Math.round(x.g));
  if(g===null)return;
  const grams=Number(g); if(!isFinite(grams)||grams<=0)return alert('Introduce una cantidad válida.');
  const f=foods.find(a=>a[0]===x.food); if(!f)return;
  const k=grams/100;
  x.g=grams;x.kcal=f[1]*k;x.p=f[2]*k;x.c=f[3]*k;x.f=f[4]*k;x.sat=f[5]*k;x.sugar=f[6]*k;x.fiber=f[7]*k;x.salt=f[8]*k;
  localStorage.setItem('nf_log_v3',JSON.stringify(log));saveHistory();render();
}
const oldRenderFoodRowsV10=render;
render=function(){
  oldRenderFoodRowsV10();
  recentFoodsV10();
};

const tipsV12=[
 {cat:'comida',title:'Construye el plato',text:'Una forma sencilla es combinar una fuente de proteína, verduras y una fuente de hidratos ajustada a tu objetivo.'},
 {cat:'proteina',title:'Reparte la proteína',text:'En lugar de concentrarla toda en una comida, intenta repartirla entre desayuno, comida, merienda y cena.'},
 {cat:'habitos',title:'Mira la semana, no un día',text:'Un día por encima o por debajo de tus kcal no define tu progreso. Observa la tendencia de varios días.'},
 {cat:'comida',title:'Hazlo fácil',text:'Ten 2 o 3 comidas rápidas que sepas preparar y que encajen con tus objetivos para los días con poco tiempo.'},
 {cat:'proteina',title:'No olvides las cantidades',text:'Una comida puede ser saludable y aun así tener muchas o pocas kcal. Las cantidades importan tanto como la elección.'},
 {cat:'habitos',title:'Hidratación',text:'Mantén agua disponible durante el día y usa el contador de NutriFit para crear el hábito.'},
 {cat:'comida',title:'Más fibra',text:'Frutas, verduras, legumbres, avena y cereales integrales ayudan a aumentar la fibra de la dieta.'},
 {cat:'habitos',title:'Planifica antes de tener hambre',text:'Dejar preparada una opción equilibrada reduce la probabilidad de acabar eligiendo cualquier cosa por falta de tiempo.'}
];
function renderTipsV12(cat='todos'){
 const box=$('tipsList'); if(!box)return;
 const arr=cat==='todos'?tipsV12:tipsV12.filter(x=>x.cat===cat);
 box.innerHTML=arr.map(x=>`<article class="tipcard"><span>${x.cat==='proteina'?'💪':x.cat==='comida'?'🍽️':'🌱'}</span><div><b>${x.title}</b><p>${x.text}</p></div></article>`).join('');
 const t=tipsV12[new Date().getDate()%tipsV12.length];
 $('tipTitle').textContent=t.title;$('tipMain').textContent=t.text;
}
function filterTips(cat,btn){
 document.querySelectorAll('.tipfilter').forEach(x=>x.classList.remove('active'));
 if(btn)btn.classList.add('active');renderTipsV12(cat);
}
function openSponsor(){
 alert('⭐ Patrocinio NutriFit\\n\\nEl espacio está diseñado para un patrocinio de $1 durante 24 horas.\\n\\nPara cobrar pagos reales necesitaremos conectar Stripe/PayPal y un pequeño backend seguro. Esta versión deja preparada la zona de patrocinadores sin fingir que el pago ya está conectado.');
}
const goV12Base=go;
go=function(id){goV12Base(id);if(id==='tips')renderTipsV12();};

const sponsorsV13=[
 {id:1,name:'Tu marca aquí',status:'empty'},
 {id:2,name:'Tu marca aquí',status:'empty'},
 {id:3,name:'Tu marca aquí',status:'empty'},
 {id:4,name:'Tu marca aquí',status:'empty'},
 {id:5,name:'Tu marca aquí',status:'empty'},
 {id:6,name:'Tu marca aquí',status:'empty'},
 {id:7,name:'Tu marca aquí',status:'empty'},
 {id:8,name:'Tu marca aquí',status:'empty'}
];
function renderProfileV13(){
 const grid=$('sponsorGridV13');if(!grid)return;
 const saved=JSON.parse(localStorage.getItem('nf_sponsors_v13')||'[]');
 const merged=sponsorsV13.map(s=>saved.find(x=>x.id===s.id)||s);
 grid.innerHTML=merged.map(s=>s.status==='active'
 ? `<button class="sponsorSlot active" onclick="viewSponsor(${s.id})"><span class="sponsorLogo">${s.logo||'⭐'}</span><b>${s.name}</b><small>${s.hours||24} h restantes</small></button>`
 : `<button class="sponsorSlot" onclick="openSponsorSlot(${s.id})"><span class="plusSponsor">＋</span><b>Patrocina este espacio</b><small>$1 · 24 horas</small></button>`).join('');
 if(profile){
   const g=$('profileGoalV13'),k=$('profileKcalV13'),p=$('profileProteinV13');
   if(g)g.textContent=profile.goal==='lose'?'Perder peso':profile.goal==='gain'?'Ganar peso':'Mantener';
   if(k)k.textContent=profile.kcal+' kcal';
   if(p)p.textContent=profile.protein+' g';
 }
}
function openSponsorSlot(id){
 alert('⭐ NutriFit Sponsors\\n\\nEspacio #'+id+'\\n\\nPrecio: $1 durante 24 horas.\\n\\nEl cobro real se conectará después mediante un proveedor de pagos seguro.');
}
function viewSponsor(id){
 const saved=JSON.parse(localStorage.getItem('nf_sponsors_v13')||'[]');
 const s=saved.find(x=>x.id===id);if(!s)return;
 alert('⭐ '+s.name+'\\n\\nPatrocinador NutriFit activo.');
}
function openProfileEdit(){
 if(!profile){go('profile');return;}
 alert('Puedes editar tus datos desde la sección de configuración de objetivos.');
}
const goV13Base=go;
go=function(id){goV13Base(id);if(id==='profile')renderProfileV13();};
