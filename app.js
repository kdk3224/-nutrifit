const foods=[
['Pechuga de pollo',165,31,0,3.6],['Pechuga de pavo',104,24,0,1],['Atún al natural',116,26,0,1],['Salmón',208,20,0,13],['Huevo',143,12.6,.7,9.5],
['Arroz cocido',130,2.7,28,.3],['Arroz crudo',360,7,79,.7],['Pasta cocida',158,5.8,30.9,.9],['Avena',389,16.9,66.3,6.9],['Pan integral',247,13,41,4.2],
['Patata cocida',87,1.9,20,.1],['Lentejas cocidas',116,9,20,.4],['Garbanzos cocidos',164,8.9,27.4,2.6],
['Leche semidesnatada',46,3.3,4.8,1.6],['Yogur natural',61,3.5,4.7,3.3],['Plátano',89,1.1,22.8,.3],['Manzana',52,.3,14,.2],
['Tomate',18,.9,3.9,.2],['Aguacate',160,2,8.5,14.7],['Almendras',579,21,22,50],['Aceite de oliva',884,0,0,100],
['Brócoli',35,2.4,7.2,.4],['Zanahoria',41,.9,9.6,.2],['Queso fresco',174,11,3,13]
];
let profile=JSON.parse(localStorage.getItem('nf_profile_v2')||'null');
let log=JSON.parse(localStorage.getItem('nf_log_v2')||'[]');
let water=+localStorage.getItem('nf_water_v2')||0, selected=null;
const $=id=>document.getElementById(id);
function go(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));if(id==='home')render();}
function saveProfile(){
 const a=+$('age').value,h=+$('height').value,w=+$('weight').value;
 if(!a||!h||!w)return alert('Completa edad, altura y peso.');
 const bmr=10*w+6.25*h-5*a+($('sex').value==='m'?5:-161),tdee=bmr*+$('activity').value,g=$('goal').value;
 const kcal=Math.round((tdee+(g==='lose'?-350:g==='gain'?250:0))/10)*10;
 const protein=Math.round(w*(g==='gain'?1.8:1.6)),fat=Math.round(kcal*.25/9),carb=Math.max(0,Math.round((kcal-protein*4-fat*9)/4));
 profile={kcal,protein,carb,fat};localStorage.setItem('nf_profile_v2',JSON.stringify(profile));go('home');
}
function clearProfile(){profile=null;localStorage.removeItem('nf_profile_v2');go('home')}
function openFood(){$('modal').classList.add('open');$('search').value='';$('amountBox').hidden=true;renderFoods();setTimeout(()=>$('search').focus(),100)}
function closeFood(){$('modal').classList.remove('open');selected=null}
function renderFoods(){let q=$('search').value.toLowerCase();$('foodList').innerHTML=foods.filter(f=>f[0].toLowerCase().includes(q)).map((f,i)=>`<div class="food" onclick="selectFood(${i})"><b>${f[0]}</b><small>${f[1]} kcal · ${f[2]} g proteína · ${f[3]} g carbos · ${f[4]} g grasa / 100 g</small></div>`).join('')||'<p>Sin resultados.</p>'}
function selectFood(i){selected=foods[i];$('foodName').textContent=selected[0];$('foodInfo').textContent=`${selected[1]} kcal · ${selected[2]} g proteína · ${selected[3]} g carbos · ${selected[4]} g grasa / 100 g`;$('amountBox').hidden=false;$('amount').focus()}
function addFood(){if(!selected)return;let g=+$('amount').value||100,m=$('meal').value,k=g/100;log.push({id:Date.now(),food:selected[0],meal:m,g,kcal:selected[1]*k,p:selected[2]*k,c:selected[3]*k,f:selected[4]*k});localStorage.setItem('nf_log_v2',JSON.stringify(log));closeFood();render()}
function del(id){log=log.filter(x=>x.id!==id);localStorage.setItem('nf_log_v2',JSON.stringify(log));render()}
function addWater(){water=Math.min(5000,water+250);localStorage.setItem('nf_water_v2',water);render()}
function render(){
 const t=log.reduce((a,x)=>({k:a.k+x.kcal,p:a.p+x.p,c:a.c+x.c,f:a.f+x.f}),{k:0,p:0,c:0,f:0});
 $('kcal').textContent=Math.round(t.k);$('p').textContent=Math.round(t.p)+' g';$('c').textContent=Math.round(t.c)+' g';$('f').textContent=Math.round(t.f)+' g';$('foodCount').textContent=log.length+' alimento'+(log.length===1?'':'s');
 if(profile){$('targetKcal').textContent=' / '+profile.kcal;$('remaining').textContent=t.k>=profile.kcal?`Has alcanzado tu objetivo de ${profile.kcal} kcal`:`Te quedan ${Math.round(profile.kcal-t.k)} kcal`;$('pt').textContent=`${Math.round(t.p)} / ${profile.protein} g`;$('ct').textContent=`${Math.round(t.c)} / ${profile.carb} g`;$('ft').textContent=`${Math.round(t.f)} / ${profile.fat} g`;[['pb',t.p,profile.protein],['cb',t.c,profile.carb],['fb',t.f,profile.fat]].forEach(([id,v,m])=>$(id).style.width=Math.min(100,v/m*100)+'%');let pct=Math.min(100,t.k/profile.kcal*100);$('kcalPct').textContent=Math.round(pct)+'%';document.querySelector('.donut').style.setProperty('--deg',(pct*3.6)+'deg')}
 else{$('targetKcal').textContent='';$('remaining').textContent='Configura tu perfil para ver objetivos personalizados';['pt','ct','ft'].forEach(id=>$(id).textContent='Sin objetivo');['pb','cb','fb'].forEach(id=>$(id).style.width='0%');$('kcalPct').textContent='—'}
 $('waterText').textContent=(water/1000).toFixed(1).replace('.',',')+' / 2,5 L';$('waterBar').style.width=Math.min(100,water/25)+'%';
 $('meals').innerHTML=['Desayuno','Comida','Merienda','Cena','Snack'].map(m=>{let a=log.filter(x=>x.meal===m),sum=a.reduce((s,x)=>s+x.kcal,0);return `<div class="meal"><div class="mealhead"><b>${m}</b><span>${Math.round(sum)} kcal</span></div>${a.length?a.map(x=>`<div class="foodrow"><span>${x.food} · ${x.g} g</span><span>${Math.round(x.kcal)} kcal <button onclick="del(${x.id})">×</button></span></div>`).join(''):'<div class="empty">Sin alimentos registrados</div>'}</div>`}).join('')
}
$('date').textContent=new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short'}).format(new Date());
render();