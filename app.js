'use strict';
const canvas=document.getElementById('lcd'),ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
const W=84,H=48,ink='#263b2b',paper='#a5b795';
// Fixed 5x7 bitmap glyphs avoid iOS font rendering differences on the LCD.
const glyphs={
'A':['01110','10001','10001','11111','10001','10001','10001'],'B':['11110','10001','10001','11110','10001','10001','11110'],'C':['01111','10000','10000','10000','10000','10000','01111'],'D':['11110','10001','10001','10001','10001','10001','11110'],'E':['11111','10000','10000','11110','10000','10000','11111'],'F':['11111','10000','10000','11110','10000','10000','10000'],'G':['01111','10000','10000','10111','10001','10001','01111'],'H':['10001','10001','10001','11111','10001','10001','10001'],'I':['11111','00100','00100','00100','00100','00100','11111'],'J':['00111','00010','00010','00010','10010','10010','01100'],'K':['10001','10010','10100','11000','10100','10010','10001'],'L':['10000','10000','10000','10000','10000','10000','11111'],'M':['10001','11011','10101','10101','10001','10001','10001'],'N':['10001','11001','10101','10011','10001','10001','10001'],'O':['01110','10001','10001','10001','10001','10001','01110'],'P':['11110','10001','10001','11110','10000','10000','10000'],'Q':['01110','10001','10001','10001','10101','10010','01101'],'R':['11110','10001','10001','11110','10100','10010','10001'],'S':['01111','10000','10000','01110','00001','00001','11110'],'T':['11111','00100','00100','00100','00100','00100','00100'],'U':['10001','10001','10001','10001','10001','10001','01110'],'V':['10001','10001','10001','10001','10001','01010','00100'],'W':['10001','10001','10001','10101','10101','10101','01010'],'X':['10001','10001','01010','00100','01010','10001','10001'],'Y':['10001','10001','01010','00100','00100','00100','00100'],'Z':['11111','00001','00010','00100','01000','10000','11111'],
'0':['01110','10011','10101','10101','11001','10001','01110'],'1':['00100','01100','00100','00100','00100','00100','01110'],'2':['01110','10001','00001','00010','00100','01000','11111'],'3':['11110','00001','00001','01110','00001','00001','11110'],'4':['00010','00110','01010','10010','11111','00010','00010'],'5':['11111','10000','10000','11110','00001','00001','11110'],'6':['01111','10000','10000','11110','10001','10001','01110'],'7':['11111','00001','00010','00100','01000','01000','01000'],'8':['01110','10001','10001','01110','10001','10001','01110'],'9':['01110','10001','10001','01111','00001','00001','11110'],
' ':['00000','00000','00000','00000','00000','00000','00000'],'.':['00000','00000','00000','00000','00000','01100','01100'],':':['00000','01100','01100','00000','01100','01100','00000'],'-':['00000','00000','00000','11111','00000','00000','00000'],'_':['00000','00000','00000','00000','00000','00000','11111'],'/':['00001','00001','00010','00100','01000','10000','10000'],'+':['00000','00100','00100','11111','00100','00100','00000'],'!':['00100','00100','00100','00100','00100','00000','00100'],'?':['01110','10001','00001','00010','00100','00000','00100'],'Æ':['01111','10100','10100','11111','10100','10100','10111'],'Ø':['01111','10011','10101','10101','11001','10001','11110'],'Å':['00100','00000','01110','10001','11111','10001','10001']};
function pixelText(s,x,y,align='left',inverse=false){const chars=Array.from(String(s).toUpperCase());const width=chars.length*6-1;let xx=align==='center'?Math.round(x-width/2):align==='right'?x-width:x;const old=ctx.fillStyle;ctx.fillStyle=inverse?paper:ink;for(const ch of chars){const g=glyphs[ch]||glyphs['?'];for(let row=0;row<7;row++)for(let col=0;col<5;col++)if(g[row][col]==='1')ctx.fillRect(xx+col,y+row,1,1);xx+=6}ctx.fillStyle=old}
// Every LCD drawing is made on the original 84 x 48 pixel grid.
ctx.imageSmoothingEnabled=false;
const menus=[['Telefonbok',['Søk','Legg til navn','Slett','Rediger','Tildel tone','Send visittkort','Valg','Hurtigvalg','Talenummer','Tjenestenumre']],['Meldinger',['Skriv melding','Innboks','Utboks','Bildemeldinger','Maler','Smilefjes','Meldingsvalg','Infoservice','Talepostnummer']],['Chat',['Start chat']],['Anropslogg',['Ubesvarte anrop','Mottatte anrop','Oppringte numre','Slett anropslister','Samtalevarighet']],['Toner',['Ringetone','Ringevolum','Anropsvarsling','Tastetoner','Varseltone','Vibrering','Komponist']],['Innstillinger',['Telefoninnstillinger','Språk','Velkomstmelding']],['Viderekobling',['Informasjon']],['Spill',['Snake II','Space Impact','Pairs II','Bantumi']],['Kalkulator',[]],['Huskelapper',['Legg til','Vis']],['Klokke',['Alarm','Klokkeinnstillinger','Stoppeklokke','Nedtelling']],['Profiler',['Generell','Lydløs','Møte','Utendørs']],['SIM-tjenester',['Ikke tilgjengelig']]];
const letters={2:'ABCÆÅ',3:'DEF',4:'GHI',5:'JKL',6:'MNOØ',7:'PQRS',8:'TUV',9:'WXYZ'};
let state='standby',menu=0,sub=0,stack=[],value='',number='',lastDigit='',lastTime=0,cycle=0,contacts=[],outbox=[],notes=[],profile='Generell',snake=null,loop=null,score=0,level=1,locked=false,lockFirst=false,lockTimer=0,toast='',toastUntil=0;
function load(k,fallback){try{return JSON.parse(localStorage.getItem('3310-'+k))||fallback}catch{return fallback}}
contacts=load('contacts',[]);outbox=load('outbox',[]);notes=load('notes',[]);
if(!Array.isArray(contacts))contacts=[];if(!Array.isArray(outbox))outbox=[];if(!Array.isArray(notes))notes=[];
function save(k,v){try{localStorage.setItem('3310-'+k,JSON.stringify(v))}catch{message('Lagring mislyktes')}}
function rect(x,y,w,h,c=ink){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
// Render every label through the same bitmap font; never depend on iOS fonts.
function text(s,x,y,size=8,align='left',bold=true){
 const str=String(s);const max=Math.max(0,Math.floor((W-2)/6));
 pixelText(str.length>max?str.slice(0,max):str,x,y,align);
}
function center(s,y,size=8){text(s,42,y,size,'center')}
function frame(){rect(0,0,W,H,paper);ctx.strokeStyle=ink;ctx.lineWidth=1}
function header(){const d=new Date();
 // Pixel-drawn cellular reception and battery meter, not Unicode glyphs.
 for(let i=0;i<4;i++)rect(2+i*3,7-(i+1)*2,2,(i+1)*2);
 text(d.toLocaleTimeString('no-NO',{hour:'2-digit',minute:'2-digit'}),42,1,7,'center');
 ctx.strokeRect(72,2,9,6);rect(81,4,2,2);for(let i=0;i<3;i++)rect(74+i*2,4,1,3);
}
function footer(label='Velg'){rect(0,38,84,1);center(label,40,7)}
function lines(items,index,label='Velg'){
 const item=String(items[index]||'(Tom)');
 rect(1,13,74,18,ink);
 // 12 bitmap glyphs fit within the 74-pixel highlight.
 const max=12;const start=item.length>max?Math.floor(Date.now()/1100)%(item.length-max+2):0;
 pixelText(item.length>max?item.slice(start,start+max):item,38,18,'center',true);
 rect(79,12,1,23);const count=Math.max(1,items.length);
 rect(77,12+Math.floor(index*20/count),5,Math.max(3,Math.ceil(20/count)));
 footer(label);
}
// Simple hand-drawn monochrome pictograms; no platform-dependent emoji.
function icon(n){
 const x=32,y=11;
 ctx.strokeStyle=ink;ctx.lineWidth=1;
 if(n===0){ctx.strokeRect(x+3,y+1,14,19);rect(x+6,y+4,8,2);rect(x+6,y+9,8,1);rect(x+6,y+13,8,1)}
 else if(n===1){ctx.strokeRect(x,y+4,20,13);ctx.beginPath();ctx.moveTo(x,y+4);ctx.lineTo(x+10,y+12);ctx.lineTo(x+20,y+4);ctx.stroke()}
 else if(n===7){ctx.strokeRect(x+2,y+2,16,16);for(let i=0;i<3;i++)rect(x+5+i*4,y+5,2,2);rect(x+9,y+11,3,3)}
 else if(n===4){ctx.beginPath();ctx.arc(x+10,y+10,8,0,Math.PI*2);ctx.stroke();rect(x+8,y+5,4,10)}
 else if(n===8){rect(x+8,y+2,4,16);rect(x+2,y+8,16,4)}
 else if(n===10){ctx.strokeRect(x+3,y+1,14,19);rect(x+9,y+4,2,7);rect(x+10,y+10,5,2)}
 else {ctx.strokeRect(x+2,y+2,16,16);rect(x+6,y+6,8,8)}
}
function message(s){toast=s;toastUntil=Date.now()+1600;draw()}
function draw(){frame();if(locked){header();center('Tastelås',17,9);footer('Lås opp');return}if(state==='standby'){header();center(profile==='Generell'?'':profile,18,11);footer('Meny');return}
if(state==='menu'){icon(menu);center(menus[menu][0],32,7);text(`${menu+1}`,78,10,7,'right');footer('Velg')}
else if(state==='submenu'){header();lines(menus[menu][1],sub)}
else if(state==='dial'){header();center(number.slice(-17)+'_',20,10);footer('Ring')}
else if(['compose','name','contactnum','recipient','note','editname','editnum','welcome'].includes(state)){const titles={compose:'Skriv melding',name:'Legg til navn',contactnum:'Telefonnummer',recipient:'Mottaker',note:'Huskelapp',editname:'Rediger navn',editnum:'Rediger nr',welcome:'Velkomstmelding'};text(titles[state],2,1,7);const v=(['contactnum','recipient','editnum'].includes(state))?number:value;let chunks=v.match(/.{1,17}/g)||[''];chunks=chunks.slice(-3);chunks.forEach((s,i)=>text(s,2,12+i*8,7));text('_',Math.min(78,(chunks.at(-1)||'').length*4+2),12+(chunks.length-1)*8,7);footer(state==='compose'?'Valg':'OK')}
else if(state==='snake'){text(`SNAKE II ${score}`,2,0,7);rect(1,9,82,1);if(snake){for(const [x,y] of snake.body)rect(3+x*3,11+y*3,3,3);rect(3+snake.food[0]*3,11+snake.food[1]*3,3,3)}if(snake&&!snake.alive)center('SPILLET ER OVER',23,7);else if(snake&&!loop)center('PAUSE',23,9)}
else if(state==='snakeintro'){center('SNAKE II',10,11);center('Nivå '+level,23,8);footer('Start')}
else if(state==='list'){header();lines(listItems(),sub,'Velg')}
else if(state==='detail'){header();center((detail||'').slice(0,18),19,8);footer('Tilbake')}
else if(state==='calculator'){text('Kalkulator',2,2,8);center(value.slice(-16)||'0',22,10);footer('=')}
else if(state==='profiles'){header();lines(menus[11][1],sub)}
else if(state==='tones'){header();lines(toneNames,sub,'Spill')}
else if(state==='settingslist'){header();lines(settingsPages[settingsPage]||[],settingsCursor)}
else if(state==='contactactions'){header();lines(['Ring','Send SMS','Rediger','Slett'],sub)}
else if(state==='volume'){header();center('Ringevolum',10,8);center('I'.repeat(volume)+'-'.repeat(5-volume),23,8);footer('OK')}
else if(state==='poweroff'){center('NOKIA',17,13)}else if(state==='info'){header();center('Kun i iOS',15,8);center('Trykk C',26,7);footer('Tilbake')}
if(Date.now()<toastUntil){rect(4,13,76,22,paper);ctx.strokeRect(4,13,76,22);center(toast.slice(0,18),20,8)}}
let listType='',detail='',pendingName='',caps=true,soundEnabled=true,ringtone=0,volume=3,settingsPage='',settingsCursor=0,selectedContact=-1;
const settingsPages={
 'Telefoninnstillinger':['Språk','Velkomstmelding','Automatisk tastelås','Hjelpetekster'],
 'Klokke':['Still klokke','Datoformat','Vis klokke'],
 'Meldingsvalg':['Meldingssentral','Leveringsrapporter','Svar via samme sentral'],
 'Anropsvarsling':['Ring','Stigende','Ett pip','Lydløs'],
 'Vibrering':['På','Av']
};
let welcome=load('welcome','NOKIA'),autoLock=load('autolock',false),vibrate=load('vibrate',false),alertMode=load('alert','Ring');const toneNames=['Nokia tone','Ring ring','Ascending','Bee','Jumping'];
// The ringtone synthesis is an approximation, not an original Nokia audio recording.
function listItems(){if(listType==='contacts')return contacts.map(c=>c.name);if(listType==='outbox')return outbox.map(x=>x.text.slice(0,16));if(listType==='notes')return notes;return []}
function go(s){stack.push([state,menu,sub]);state=s;sub=0;lastDigit='';draw()}
function back(){if(locked)return;if(state==='snake')stopSnake();if(['compose','name','note','editname','welcome'].includes(state)&&value){value=value.slice(0,-1);draw();return}if(['dial','contactnum','recipient','editnum'].includes(state)&&number){number=number.slice(0,-1);draw();return}if(stack.length){[state,menu,sub]=stack.pop()}else state='standby';draw()}
function enter(){if(locked){locked=false;draw();return}if(state==='poweroff'){state='standby'}else if(state==='standby'){state='menu';menu=0}
else if(state==='menu'){if(menus[menu][1].length){go('submenu')}else if(menu===8){value='';go('calculator')}else message('Ikke tilgjengelig')}
else if(state==='submenu')openMenu();else if(state==='dial'){if(number)openDialer(number)}
else if(state==='compose'){if(value.trim()){const recipient=number;go('recipient');number=recipient||''}}
else if(state==='recipient'){if(number.trim()&&value.trim()){const n=number.replace(/[^+\d]/g,'');if(!n){message('Ugyldig nummer');return}save('draft',{number:n,text:value,updated:Date.now()});openSMS(n,value);message('Åpner Meldinger')}}
else if(state==='name'){if(value.trim()){pendingName=value;value='';number='';go('contactnum')}}
else if(state==='contactnum'){if(number){contacts.push({name:pendingName,number});save('contacts',contacts);state='standby';stack=[];message('Lagret')}}
else if(state==='note'){if(value.trim()){notes.push(value);save('notes',notes);state='standby';stack=[];message('Lagret')}}
else if(state==='list'){const items=listItems();if(items.length){if(listType==='contacts'){selectedContact=sub;go('contactactions')}else{detail=listType==='outbox'?outbox[sub].text:items[sub];go('detail')}}}
else if(state==='contactactions'){const c=contacts[selectedContact];if(!c){back();return}if(sub===0){number=c.number;go('dial')}else if(sub===1){value='';number=c.number;go('compose')}else if(sub===2){pendingName=c.name;value=c.name;go('editname')}else if(sub===3){contacts.splice(selectedContact,1);save('contacts',contacts);state='standby';stack=[];message('Slettet')}}
else if(state==='editname'){if(value.trim()){pendingName=value;number=contacts[selectedContact]?.number||'';go('editnum')}}
else if(state==='editnum'){if(contacts[selectedContact]&&number){contacts[selectedContact]={name:pendingName,number};save('contacts',contacts);state='standby';stack=[];message('Endret')}}
else if(state==='settingslist'){const choice=(settingsPages[settingsPage]||[])[settingsCursor];if(settingsPage==='Telefoninnstillinger'&&choice==='Automatisk tastelås'){autoLock=!autoLock;save('autolock',autoLock);message(autoLock?'Tastelås på':'Tastelås av')}else if(settingsPage==='Vibrering'){vibrate=choice==='På';save('vibrate',vibrate);message(vibrate?'Vibrering på':'Vibrering av')}else if(settingsPage==='Anropsvarsling'){alertMode=choice;save('alert',alertMode);message('Lagret')}else if(settingsPage==='Telefoninnstillinger'&&choice==='Velkomstmelding'){value=welcome;go('welcome')}else message('Kun visning')}
else if(state==='welcome'){welcome=value.slice(0,16)||'NOKIA';save('welcome',welcome);state='standby';stack=[];message('Lagret')}
else if(state==='profiles'){profile=menus[11][1][sub];save('profile',profile);state='standby';stack=[];message('Profil valgt')}else if(state==='tones'){ringtone=sub;localStorage.setItem('3310-ring',String(ringtone));playTone(ringtone);message('Ringetone valgt')}else if(state==='volume'){localStorage.setItem('3310-volume',String(volume));back()}else if(state==='snakeintro')startSnake();else if(state==='snake'){if(!snake?.alive){go('snakeintro')}else if(loop){clearInterval(loop);loop=null;message('Pause')}else loop=setInterval(tick,Math.max(75,210-level*15))}
else if(state==='calculator'){value=calculate(value);draw()}}
function calculate(expression){const match=expression.match(/^\s*(-?\d+(?:\.\d+)?)\s*([+*\/-])\s*(-?\d+(?:\.\d+)?)\s*$/);if(!match)return 'Feil';const a=Number(match[1]),b=Number(match[3]);const result=match[2]==='+'?a+b:match[2]==='-'?a-b:match[2]==='*'?a*b:b===0?NaN:a/b;return Number.isFinite(result)?String(Number(result.toPrecision(9))):'Feil'}
function openMenu(){const item=menus[menu][1][sub];if(menu===0){if(sub===0){listType='contacts';go('list')}else if(sub===1){value='';go('name')}else message('Ikke tilgjengelig')}
else if(menu===1){if(sub===0){value='';go('compose')}else if(sub===2){listType='outbox';go('list')}else if(sub===1){showIOSInboxInfo()}else message('Ikke tilgjengelig')}
else if(menu===7){if(sub===0)go('snakeintro');else message('Kommer senere')}
else if(menu===9){if(sub===0){value='';go('note')}else{listType='notes';go('list')}}
else if(menu===11){profile=item;save('profile',profile);state='standby';stack=[];message('Profil valgt')}
else if(menu===4){if(sub===0){sub=ringtone;go('tones')}else if(sub===1){go('volume')}else if(sub===2||sub===5){settingsPage=sub===2?'Anropsvarsling':'Vibrering';settingsCursor=0;go('settingslist')}else if(sub===3){soundEnabled=!soundEnabled;save('keysound',soundEnabled);message(soundEnabled?'Tastetoner på':'Tastetoner av')}else if(sub===4){playTone(1)}else message('Ikke tilgjengelig')}
else if(menu===5){settingsPage='Telefoninnstillinger';settingsCursor=0;go('settingslist')}
else if(menu===3){showIOSCallInfo()}
else if(menu===10){detail=new Date().toLocaleTimeString('no-NO');go('detail')}
else message('Ikke tilgjengelig')}
function move(dir){if(state==='snake'){turn(dir);return}if(state==='menu')menu=(menu+(dir==='up'?-1:1)+menus.length)%menus.length;else if(state==='submenu')sub=(sub+(dir==='up'?-1:1)+menus[menu][1].length)%menus[menu][1].length;else if(state==='list'){const n=listItems().length;if(n)sub=(sub+(dir==='up'?-1:1)+n)%n}else if(state==='profiles')sub=(sub+(dir==='up'?-1:1)+menus[11][1].length)%menus[11][1].length;else if(state==='tones')sub=(sub+(dir==='up'?-1:1)+toneNames.length)%toneNames.length;else if(state==='contactactions')sub=(sub+(dir==='up'?-1:1)+4)%4;else if(state==='settingslist'){const n=(settingsPages[settingsPage]||[]).length;if(n)settingsCursor=(settingsCursor+(dir==='up'?-1:1)+n)%n;}else if(state==='volume')volume=Math.max(1,Math.min(5,volume+(dir==='up'?1:-1)));else if(state==='standby'&&(dir==='down'||dir==='up')){listType='contacts';go('list')}draw()}
function digit(k){if(locked){if(k==='*'){lockFirst=true;lockTimer=Date.now();message('Trykk Navi')}return}if(state==='standby'){if(k==='*'){lockFirst=true;lockTimer=Date.now();message('Trykk Navi');return}if(k==='#'){message('Hold # for lydløs');return}number=k;go('dial');return}if(state==='menu'&&/^[1-9]$/.test(k)&&Number(k)<=menus.length){menu=Number(k)-1;enter();return}if(state==='snake'){turn({2:'up',8:'down',4:'left',6:'right'}[k]);return}if(['dial','recipient','contactnum','editnum'].includes(state)){number+=k;draw();return}if(state==='calculator'){value+=k==='*'?'*':k==='#'?'+':k;draw();return}if(['compose','name','note','editname','welcome'].includes(state)){if(k==='0'){value+=' ';lastDigit=''}else if(k==='1'){value+='.';lastDigit=''}else if(k==='#'){caps=!caps;lastDigit='';message(caps?'ABC':'abc');return}else if(letters[k]){const now=Date.now(),chars=letters[k];if(lastDigit===k&&now-lastTime<950&&value){cycle=(cycle+1)%chars.length;value=value.slice(0,-1)+(caps?chars[cycle]:chars[cycle].toLowerCase())}else{cycle=0;value+=(caps?chars[0]:chars[0].toLowerCase())}lastDigit=k;lastTime=now}draw()}}
function key(k){if(locked){if(k==='select'&&lockFirst&&Date.now()-lockTimer<3500){locked=false;lockFirst=false;message('Tastatur åpnet')}else if(k==='select'){lockFirst=true;lockTimer=Date.now();message('Trykk *')}else if(k==='*'&&lockFirst&&Date.now()-lockTimer<3500){locked=false;lockFirst=false;message('Tastatur åpnet')}return}if(k==='select'&&lockFirst&&state==='standby'&&Date.now()-lockTimer<3500){locked=true;lockFirst=false;message('Tastatur låst');return}if(k==='select')enter();else if(k==='back')back();else if(k==='power'){if(state==='poweroff'){state='standby';draw()}else if(state==='standby'){sub=0;go('profiles')}else{state='standby';stack=[];draw()}}else if(k==='call'){if(state==='standby'){number='';go('dial')}else if(state==='dial')enter();else if(state==='list'&&listType==='contacts'){const c=contacts[sub];if(c)openDialer(c.number)}}else if(k==='up'||k==='down')move(k);else if(/^\d$|^[*#]$/.test(k))digit(k)}
function openDialer(n){const clean=n.replace(/[^0-9+*#]/g,'');if(!clean)return;window.location.href='tel:'+encodeURIComponent(clean)}
function openSMS(n,body){const clean=n.replace(/[^0-9+]/g,'');if(!clean)return;const sep=/iPhone|iPad|iPod/.test(navigator.userAgent)?'&':'?';window.location.href='sms:'+clean+sep+'body='+encodeURIComponent(body)}
function showIOSInboxInfo(){message('Innboks kun i iOS')}
function showIOSCallInfo(){message('Anrop i iOS')}
const keylabels=[['1',''],['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ'],['*',''],['0','+'],['#','']];document.getElementById('keypad').innerHTML=keylabels.map(([n,l])=>`<button data-key="${n}" aria-label="${n} ${l}">${n}<small>${l||' '}</small></button>`).join('');
let audio;function beep(f=640,t=.035){try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.type='square';o.frequency.value=f;g.gain.value=.018;o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+t)}catch{}}
let longPressTimer=null,longPressHandled=false;
const keypadElement=document.getElementById('keypad');
keypadElement.addEventListener('pointerdown',e=>{
 const b=e.target.closest('[data-key]');if(!b)return;longPressHandled=false;
 if(b.dataset.key==='0')longPressTimer=setTimeout(()=>{
  if(['dial','recipient','contactnum','editnum'].includes(state)){
   number+='+';lastDigit='';draw();longPressHandled=true;
  }
 },650);
});
for(const event of ['pointerup','pointercancel','pointerleave'])keypadElement.addEventListener(event,()=>clearTimeout(longPressTimer));
document.addEventListener('click',e=>{const b=e.target.closest('[data-key]');if(b){if(longPressHandled){longPressHandled=false;return}if(soundEnabled)beep();if(vibrate&&navigator.vibrate)navigator.vibrate(12);key(b.dataset.key)}});document.addEventListener('keydown',e=>{const k={ArrowUp:'up',ArrowDown:'down',Enter:'select',Escape:'back',Backspace:'back',ArrowLeft:'back',ArrowRight:'select'}[e.key]||e.key;if(['up','down','select','back'].includes(k)||/^[0-9*#]$/.test(k)){e.preventDefault();key(k)}});
function playTone(id){const seq=[[659,587,370,415,554,494,294,330],[440,440,523,440],[392,494,587,784],[880,660,880],[330,392,440,523]][id]||[440];seq.forEach((hz,i)=>setTimeout(()=>beep(hz,.14),i*170))}
function stopSnake(){if(loop)clearInterval(loop);loop=null;snake=null}
function startSnake(){stopSnake();state='snake';score=0;snake={body:[[10,6],[9,6],[8,6]],dir:[1,0],next:[1,0],food:[5,4],alive:true};loop=setInterval(tick,Math.max(75,210-level*15));draw()}
function turn(k){if(!snake)return;const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[k];if(d&&!(d[0]===-snake.dir[0]&&d[1]===-snake.dir[1]))snake.next=d}
function tick(){if(!snake||!snake.alive)return;snake.dir=snake.next;const [x,y]=snake.body[0],h=[x+snake.dir[0],y+snake.dir[1]],eat=h[0]===snake.food[0]&&h[1]===snake.food[1];const body=eat?snake.body:snake.body.slice(0,-1);if(h[0]<0||h[0]>=26||h[1]<0||h[1]>=12||body.some(p=>p[0]===h[0]&&p[1]===h[1])){snake.alive=false;clearInterval(loop);loop=null;draw();return}snake.body.unshift(h);if(eat){score+=10;const free=[];for(let i=0;i<26;i++)for(let j=0;j<12;j++)if(!snake.body.some(p=>p[0]===i&&p[1]===j))free.push([i,j]);if(free.length)snake.food=free[Math.floor(Math.random()*free.length)];else{snake.alive=false;clearInterval(loop);loop=null}}else snake.body.pop();draw()}
profile=load('profile','Generell');soundEnabled=load('keysound',true);ringtone=Number(localStorage.getItem('3310-ring')||0);volume=Number(localStorage.getItem('3310-volume')||3);document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='snake'&&loop){clearInterval(loop);loop=null}else if(!document.hidden)draw()});setInterval(()=>{if(!document.hidden&&['standby','dial','submenu','menu','list'].includes(state))draw()},900);draw();
