const foods=[['Pechuga de pollo',165,31,0,3.6],['Pechuga de pavo',104,24,0,1],['Atún al natural',116,26,0,1],['Salmón',208,20,0,13],['Huevo',143,12.6,.7,9.5],['Arroz cocido',130,2.7,28,.3],['Arroz crudo',360,7,79,.7],['Pasta cocida',158,5.8,30.9,.9],['Avena',389,16.9,66.3,6.9],['Pan integral',247,13,41,4.2],['Patata cocida',87,1.9,20,.1],['Lentejas cocidas',116,9,20,.4],['Garbanzos cocidos',164,8.9,27.4,2.6],['Leche semidesnatada',46,3.3,4.8,1.6],['Yogur natural',61,3.5,4.7,3.3],['Plátano',89,1.1,22.8,.3],['Manzana',52,.3,14,.2],['Tomate',18,.9,3.9,.2],['Aguacate',160,2,8.5,14.7],['Almendras',579,21,22,50],['Aceite de oliva',884,0,0,100],['Brócoli',35,2.4,7.2,.4],['Zanahoria',41,.9,9.6,.2],['Queso fresco',174,11,3,13],['Ternera magra',172,26,0,7],['Cerdo magro',143,21,0,6],['Merluza',89,18,0,1.8],['Gamba',99,24,0,0.3],['Naranja',47,.9,11.8,.1],['Fresas',32,.7,7.7,.3],['Kiwi',61,1.1,14.7,.5],['Cacahuetes',567,25.8,16.1,49.2]];
let profile=JSON.parse(localStorage.getItem('nf_profile_v3')||'null'),log=JSON.parse(localStorage.getItem('nf_log_v3')||'[]'),water=+localStorage.getItem('nf_water_v3')||0,favs=JSON.parse(localStorage.getItem('nf_favs_v3')||'[]'),history=JSON.parse(localStorage.getItem('nf_history_v3')||'[]'),selected=null;
const $=id=>document.getElementById(id);
function go(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));if(id==='home')render();renderWeekV4();renderShoppingV4();if(id==='progress')renderProgress();if(id==='favorites')renderFavorites();}
function saveProfile(){let a=+$('age').value,h=+$('height').value,w=+$('weight').value;if(!a||!h||!w)return alert('Completa edad, altura y peso.');let bmr=10*w+6.25*h-5*a+($('sex').value==='m'?5:-161),tdee=bmr*+$('activity').value,g=$('goal').value,kcal=Math.round((tdee+(g==='lose'?-350:g==='gain'?250:0))/10)*10,protein=Math.round(w*(g==='gain'?1.8:1.6)),fat=Math.round(kcal*.25/9),carb=Math.max(0,Math.round((kcal-protein*4-fat*9)/4));profile={kcal,protein,carb,fat};localStorage.setItem('nf_profile_v3',JSON.stringify(profile));go('home')}
function clearProfile(){profile=null;localStorage.removeItem('nf_profile_v3');go('home')}
function openFood(){if(!$('modal'))return;$('modal').classList.add('open');$('search').value='';$('amountBox').hidden=true;renderFoods();setTimeout(()=>$('search').focus(),100)}
function closeFood(){$('modal').classList.remove('open');selected=null}
function renderFoods(){let q=$('search').value.toLowerCase();$('foodList').innerHTML=foods.filter(f=>f[0].toLowerCase().includes(q)).map((f,i)=>`<div class="food" onclick="selectFood(${i})"><b>${f[0]} ${favs.includes(f[0])?'⭐':''}</b><small>${f[1]} kcal · ${f[2]} g proteína · ${f[3]} g carbos · ${f[4]} g grasa / 100 g</small></div>`).join('')||'<p>Sin resultados.</p>'}
function selectFood(i){selected=foods[i];$('foodName').textContent=selected[0];$('foodInfo').textContent=`${selected[1]} kcal · ${selected[2]} g proteína · ${selected[3]} g carbos · ${selected[4]} g grasa / 100 g`;$('amountBox').hidden=false}
function toggleFavorite(){if(!selected)return;let n=selected[0];favs=favs.includes(n)?favs.filter(x=>x!==n):[...favs,n];localStorage.setItem('nf_favs_v3',JSON.stringify(favs));renderFoods()}
function addFood(){if(!selected)return;let g=+$('amount').value||100,m=$('meal').value,k=g/100;log.push({id:Date.now(),food:selected[0],meal:m,g,kcal:selected[1]*k,p:selected[2]*k,c:selected[3]*k,f:selected[4]*k});localStorage.setItem('nf_log_v3',JSON.stringify(log));saveHistory();closeFood();render()}
function del(id){log=log.filter(x=>x.id!==id);localStorage.setItem('nf_log_v3',JSON.stringify(log));render()}
function addWater(){water=Math.min(5000,water+250);localStorage.setItem('nf_water_v3',water);render()}
function totals(){return log.reduce((a,x)=>({k:a.k+x.kcal,p:a.p+x.p,c:a.c+x.c,f:a.f+x.f}),{k:0,p:0,c:0,f:0})}
function saveHistory(){let t=totals(),key=new Date().toISOString().slice(0,10);history=history.filter(x=>x.date!==key);history.unshift({date:key,kcal:Math.round(t.k),foods:log.length});history=history.slice(0,14);localStorage.setItem('nf_history_v3',JSON.stringify(history))}
function render(){let t=totals();$('kcal').textContent=Math.round(t.k);$('p').textContent=Math.round(t.p)+' g';$('c').textContent=Math.round(t.c)+' g';$('f').textContent=Math.round(t.f)+' g';$('foodCount').textContent=log.length+' alimento'+(log.length===1?'':'s');if(profile){$('targetKcal').textContent=' / '+profile.kcal;$('remaining').textContent=t.k>=profile.kcal?`Has alcanzado tu objetivo de ${profile.kcal} kcal`:`Te quedan ${Math.round(profile.kcal-t.k)} kcal`;$('pt').textContent=`${Math.round(t.p)} / ${profile.protein} g`;$('ct').textContent=`${Math.round(t.c)} / ${profile.carb} g`;$('ft').textContent=`${Math.round(t.f)} / ${profile.fat} g`;[['pb',t.p,profile.protein],['cb',t.c,profile.carb],['fb',t.f,profile.fat]].forEach(([id,v,m])=>$(id).style.width=Math.min(100,v/m*100)+'%');let pct=Math.min(100,t.k/profile.kcal*100);$('kcalPct').textContent=Math.round(pct)+'%';document.querySelector('.donut').style.setProperty('--deg',pct*3.6+'deg')}else{$('targetKcal').textContent='';$('remaining').textContent='Configura tu perfil para ver objetivos personalizados';$('kcalPct').textContent='—';['pt','ct','ft'].forEach(id=>$(id).textContent='Sin objetivo');['pb','cb','fb'].forEach(id=>$(id).style.width='0%')}$('waterText').textContent=(water/1000).toFixed(1).replace('.',',')+' / 2,5 L';$('waterBar').style.width=Math.min(100,water/25)+'%';$('meals').innerHTML=['Desayuno','Comida','Merienda','Cena','Snack'].map(m=>{let a=log.filter(x=>x.meal===m),sum=a.reduce((s,x)=>s+x.kcal,0);return `<div class="meal"><div class="mealhead"><b>${m}</b><span>${Math.round(sum)} kcal</span></div>${a.length?a.map(x=>`<div class="foodrow"><span>${x.food} · ${x.g} g</span><span>${Math.round(x.kcal)} kcal <button onclick="del(${x.id})">×</button></span></div>`).join(''):'<div class="empty">Sin alimentos registrados</div>'}</div>`}).join('')}
function generateDay(){let options=[['Desayuno','Avena con leche y plátano','Avena + leche + plátano'],['Comida','Pollo con arroz y brócoli','Pollo + arroz + brócoli'],['Merienda','Yogur con fresas y almendras','Yogur + fresas + almendras'],['Cena','Merluza con patata y tomate','Merluza + patata + tomate']];$('dayPlan').innerHTML='<div class="daycard"><h3>Plan orientativo</h3>'+options.map(x=>`<div class="daymeal"><b>${x[0]}</b>${x[1]}<small>${x[2]}</small></div>`).join('')+'</div>'}
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
 if($('microgrid')){let t=totals(),v=[['Proteína',t.p,profile?.protein||100,'g'],['Hidratos',t.c,profile?.carb||100,'g'],['Grasas',t.f,profile?.fat||70,'g'],['Saturadas',0,20,'g'],['Azúcares',0,50,'g'],['Fibra',0,30,'g'],['Sal',0,5,'g'],['Calorías',t.k,profile?.kcal||2000,'kcal']];$('microgrid').innerHTML=v.map(x=>`<div class="microcard"><b>${Math.round(x[1])} ${x[3]}</b><span>${x[0]} · objetivo ${x[2]} ${x[3]}</span><div class="microbar"><i style="width:${Math.min(100,x[1]/x[2]*100)}%"></i></div></div>`).join('')}}
const renderV6Base=render;render=function(){renderV6Base();updateV6();}

let pendingMealV7=null;
function openFoodForMeal(meal){
  pendingMealV7=meal;
  openFood();
}
function decorateMealButtonsV7(){
  const names=['Desayuno','Comida','Merienda','Cena','Snack'];
  document.querySelectorAll('.meal').forEach(card=>{
    if(card.querySelector('.mealAddBtn')) return;
    const txt=(card.textContent||'').trim();
    const meal=names.find(n=>txt.includes(n));
    if(!meal)return;
    const b=document.createElement('button');
    b.className='mealAddBtn';
    b.type='button';
    b.textContent='＋';
    b.setAttribute('aria-label','Añadir a '+meal);
    b.onclick=function(){openFoodForMeal(meal)};
    card.appendChild(b);
  });
}
const renderV7Base=render;
render=function(){
  renderV7Base();
  setTimeout(decorateMealButtonsV7,0);
};
