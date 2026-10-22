'use strict';

const OFFICIAL = 'https://www.arch.uoa.gr';
const POST = OFFICIAL + '/anakoinoseis_kai_ekdiloseis/proboli_anakoinosis/';
const svg = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('el').replace(/ς/g, 'σ');
const el = id => document.getElementById(id);
const externalLink = (url, title) => `<a href="${url}" target="_blank" rel="noopener">${title} ${svg('external')}</a>`;
const dateLabel = iso => new Intl.DateTimeFormat('el-GR', {day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Europe/Athens'}).format(new Date(iso+'T12:00:00Z'));

const notices = [
  {id:'first-years', category:'undergrad', label:'ΠΡΟΠΤΥΧΙΑΚΑ', date:'2026-10-22', title:'Ψηφιακές υπηρεσίες: ένας οδηγός για πρωτοετείς', description:'Τα πρώτα βήματα στην ψηφιακή καθημερινότητα του Πανεπιστημίου.', detail:'Συγκεντρωτική ενημέρωση για τις ψηφιακές υπηρεσίες που χρειάζονται οι πρωτοετείς φοιτητές και φοιτήτριες. Ο πλήρης οδηγός διατίθεται στην επίσημη ανάρτηση του Τμήματος.', url:POST+'syntomos_odigos_psifiakon_ypiresion_gia_protoeteis_foitites'},
  {id:'internship', category:'undergrad', label:'ΠΡΟΠΤΥΧΙΑΚΑ', date:'2026-10-22', title:'Πρακτική άσκηση 2026–2027: πρόσκληση αιτήσεων', description:'Αιτήσεις από 23 Οκτωβρίου έως 8 Νοεμβρίου 2026.', detail:'Η πρόσκληση αφορά πρακτική άσκηση κατά την περίοδο Ιανουαρίου–Αυγούστου 2027. Οι αιτήσεις υποβάλλονται από 23 Οκτωβρίου έως την Κυριακή 8 Νοεμβρίου 2026, στις 23:59. Για τα κριτήρια, τα δικαιολογητικά και τη διαδικασία υποβολής, συμβουλευτείτε την πλήρη επίσημη πρόσκληση.', url:POST+'anartisi_prosklisis_aitiseon_gia_praktiki_askisi_2026_2027'},
  {id:'museum-studies', category:'postgrad', label:'ΜΕΤΑΠΤΥΧΙΑΚΑ', date:'2026-10-20', title:'Αιτήσεις για το ΔΠΜΣ «Μουσειακές Σπουδές»', description:'Πρόσκληση ενδιαφέροντος για το ακαδημαϊκό έτος 2026–2027.', detail:'Δημοσιεύτηκε η πρόσκληση εκδήλωσης ενδιαφέροντος για εισαγωγή στο Πρόγραμμα Μεταπτυχιακών Σπουδών «Μουσειακές Σπουδές», για το ακαδημαϊκό έτος 2026–2027. Οι όροι συμμετοχής, οι προθεσμίες και τα απαιτούμενα δικαιολογητικά βρίσκονται στην επίσημη ανάρτηση.', url:POST+'prosklisi_ekdilosis_endiaferontos_gia_tin_eisagogi_sto_dpms_moyseiakes_spoydes_akadimaikoy_etoys_2026_2027'},
  {id:'doctoral-seminar', category:'doctoral', label:'ΔΙΔΑΚΤΟΡΙΚΑ', date:'2026-10-20', title:'Σεμινάριο υποψηφίων διδακτόρων', description:'Ιστορία και αρχαιολογία · Χειμερινό εξάμηνο 2026.', detail:'Το Τμήμα ανακοινώνει το σεμινάριο υποψηφίων διδακτόρων στην Ιστορία και την Αρχαιολογία για το χειμερινό εξάμηνο του 2026. Το αναλυτικό πρόγραμμα των συναντήσεων βρίσκεται στην αφίσα της επίσημης ανάρτησης. Η 20ή Οκτωβρίου είναι η ημερομηνία δημοσίευσης της ανακοίνωσης.', url:POST+'seminario_ypopsifion_didaktoron_stin_istoria_kai_tin_archaiologia_cheimerino_examino_2026'},
  {id:'youth-forum', category:'events', label:'ΕΚΔΗΛΩΣΕΙΣ', date:'2026-10-14', title:'2ο Πανεπιστημιακό Φόρουμ του Ευρωπαϊκού Κοινοβουλίου Νέων', description:'Εγκύκλιος συμμετοχής στο πανεπιστημιακό φόρουμ.', detail:'Ανακοίνωση για τη συμμετοχή στο 2ο Πανεπιστημιακό Φόρουμ του Ευρωπαϊκού Κοινοβουλίου Νέων Ελλάδος. Δείτε την επίσημη εγκύκλιο για το πρόγραμμα και τις πληροφορίες συμμετοχής. Η 14η Οκτωβρίου είναι η ημερομηνία δημοσίευσης, όχι επιβεβαιωμένη ημερομηνία της εκδήλωσης.', url:OFFICIAL+'/anakoinoseis_kai_ekdiloseis/proboli_ekdilosis/egkyklios_symmetochis_sto_2o_panepistimiako_foroym_toy_eyropaikoy_koinoboylioy_neon_ellados_ekne_oydas_26'},
  {id:'athens-exhibition', category:'events', label:'ΕΚΘΕΣΕΙΣ', date:'2026-09-22', title:'«Όψεις της πόλης της Αθήνας, 1841–1941»', description:'Φοιτητική έκθεση · Μέγαρο Εϋνάρδου · 22/9–23/10/2026.', detail:'Η έκθεση «Όψεις της πόλης της Αθήνας, 1841–1941» παρουσιάζεται στο Μέγαρο Εϋνάρδου από τις 22 Σεπτεμβρίου έως τις 23 Οκτωβρίου 2026. Συνδέεται με το μεταπτυχιακό πρόγραμμα Διαχείρισης Μνημείων και τη συνεργασία με το Ιστορικό Αρχείο της Εθνικής Τράπεζας και το ΜΙΕΤ. Δείτε την επίσημη ανάρτηση για τις πληροφορίες επίσκεψης.', url:POST+'tmima_istorias_kai_archaiologias_dpms_diacheirisi_mnimeion_archaiologia_poli_kai_architektoniki_egkainia_ekthesis_opseis_tis_polis_tis_athinas_1841_1941_229_23102026'}
];

const paths = {
  students:[['Ωρολόγιο πρόγραμμα',OFFICIAL+'/spoydes/proptychiakes_spoydes/orologio_programma'],['e-Class','https://eclass.uoa.gr/'],['MyUni','https://my-uni.uoa.gr/'],['Γραμματεία',OFFICIAL+'/tmima/grammateia']],
  future:[['Προπτυχιακές σπουδές',OFFICIAL+'/spoydes/proptychiakes_spoydes'],['Μεταπτυχιακά',OFFICIAL+'/spoydes/metaptychiakes_spoydes'],['Το Τμήμα',OFFICIAL+'/tmima'],['Φοιτητική μέριμνα',OFFICIAL+'/foititiki_merimna']],
  visitors:[['Οι άνθρωποί μας',OFFICIAL+'/tmima/didaktiko_prosopiko/'],['Ερευνητικά προγράμματα',OFFICIAL+'/ereyna/ereynitika_programmata'],['Μουσείο','https://www.uoa.gr/to_panepistimio/moyseia/archaiologias_kai_istorias_tis_technis'],['Επικοινωνία',OFFICIAL+'/tmima/epikoinonia']]
};

const studyContent = {
 undergrad: {title:'Ένα πτυχίο. Δύο κατευθύνσεις.',text:'Η μελέτη των πηγών και των υλικών καταλοίπων συναντά τη θεωρία και την ερμηνεία. Επιλέξτε ειδίκευση στην Ιστορία ή στην Αρχαιολογία και Ιστορία της Τέχνης μετά την ολοκλήρωση του Δ΄ εξαμήνου.',facts:[['8','εξάμηνα ελάχιστης φοίτησης'],['2','κατευθύνσεις σπουδών']],links:[],button:'Εξερευνήστε το πρόγραμμα',url:OFFICIAL+'/spoydes/proptychiakes_spoydes'},
 postgrad: {title:'Εμβαθύνετε σε αυτό που σας κινεί.',text:'Προγράμματα που συνδέουν την εξειδίκευση με τη μεθοδολογία και την έρευνα. Εξερευνήστε ενδεικτικά τρία από τα προγράμματα του Τμήματος:',facts:[],links:[['Αρχαιολογία και Ιστορία του Αρχαίου Κόσμου','https://archaioskosmos.arch.uoa.gr/'],['Βυζαντινός Κόσμος: Ιστορία και Αρχαιολογία','https://byzcosmos.arch.uoa.gr/'],['Νεότερη και Σύγχρονη Ιστορία και Ιστορία της Τέχνης','https://nsiit.arch.uoa.gr/']],button:'Όλα τα μεταπτυχιακά προγράμματα',url:OFFICIAL+'/spoydes/metaptychiakes_spoydes'},
 doctoral: {title:'Η δική σας συμβολή στη γνώση.',text:'Οι διδακτορικές σπουδές προσφέρουν το πλαίσιο για πρωτότυπη επιστημονική έρευνα στην ιστορία, την αρχαιολογία και την ιστορία της τέχνης. Ενημερωθείτε για τις προσκλήσεις, τον κανονισμό και τη διαδικασία υποβολής.',facts:[],links:[['Διδακτικό προσωπικό και επιστημονικά ενδιαφέροντα',OFFICIAL+'/tmima/didaktiko_prosopiko/'],['Γνωστικά αντικείμενα',OFFICIAL+'/tmima/mitroo_gnostikon_antikeimenon']],button:'Πληροφορίες για διδακτορικές σπουδές',url:OFFICIAL+'/spoydes/didaktorikes_spoydes'}
};

const semesterEvents = {
 winter:[{title:'Διδασκαλία χειμερινού εξαμήνου',label:'28 Σεπ. 2026 – 8 Ιαν. 2027',start:'20260928',end:'20270109'},{title:'Εξεταστική Φεβρουαρίου',label:'18 Ιαν. – 12 Φεβ. 2027',start:'20270118',end:'20270213'}],
 spring:[{title:'Διδασκαλία εαρινού εξαμήνου',label:'22 Φεβ. – 4 Ιουν. 2027',start:'20270222',end:'20270605'},{title:'Εξεταστική Ιουνίου',label:'7 Ιουν. – 2 Ιουλ. 2027',start:'20270607',end:'20270703'}]
};
let currentSemester = 'winter';
let currentFilter = 'all';
let bookmarks = new Set();
try { const stored=JSON.parse(localStorage.getItem('arch-uoa-bookmarks-v1')||'[]'); if(Array.isArray(stored)) bookmarks = new Set(stored.filter(id=>notices.some(n=>n.id===id))); } catch (_) { /* Local preferences are optional. */ }
let toastTimer;
function toast(message){clearTimeout(toastTimer);el('toast').textContent=message;el('toast').classList.add('show');toastTimer=setTimeout(()=>el('toast').classList.remove('show'),3500);}
function persistBookmarks(){try {localStorage.setItem('arch-uoa-bookmarks-v1',JSON.stringify([...bookmarks]));return true;}catch(_){return false;}}

function renderNews(){
  const query=normalize(el('newsSearch').value.trim());
  const emptySaved=currentFilter==='saved'&&bookmarks.size===0;
  const matches=notices.filter(n=>(currentFilter==='all'||(currentFilter==='saved'?bookmarks.has(n.id):n.category===currentFilter))&&normalize(`${n.title} ${n.description} ${n.label}`).includes(query));
  el('newsCount').textContent=`${matches.length} ${matches.length===1?'ανακοίνωση':'ανακοινώσεις'}${currentFilter==='saved'?(matches.length===1?' αποθηκευμένη σε αυτόν τον περιηγητή':' αποθηκευμένες σε αυτόν τον περιηγητή'):''}`;
  el('savedCount').textContent=bookmarks.size;
  el('newsGrid').innerHTML=matches.length?matches.map(n=>`<article class="news-card"><div class="news-meta"><span class="category-label">${n.label}</span><time datetime="${n.date}">${dateLabel(n.date)}</time></div><h3><button class="news-title" data-notice="${n.id}">${n.title}</button></h3><p>${n.description}</p><div class="news-card-bottom">${externalLink(n.url,'Επίσημη ανάρτηση')}<button class="bookmark" data-bookmark="${n.id}" aria-pressed="${bookmarks.has(n.id)}" aria-label="${bookmarks.has(n.id)?'Αφαίρεση από αποθηκευμένα':'Αποθήκευση'}: ${escapeHtml(n.title)}" title="${bookmarks.has(n.id)?'Αφαίρεση':'Αποθήκευση στον περιηγητή σας'}">${svg('bookmark')}</button></div></article>`).join(''):`<div class="empty-state"><h3>${emptySaved?'Οι δικές σας ανακοινώσεις.':'Δεν βρέθηκε κάποια ανακοίνωση.'}</h3><p>${emptySaved?'Πατήστε το σύμβολο σελιδοδείκτη σε μια ανακοίνωση για να τη βρείτε ξανά εδώ.':'Δοκιμάστε έναν άλλο όρο ή μια διαφορετική κατηγορία.'}</p><button id="resetNews">Εμφάνιση όλων των ανακοινώσεων</button></div>`;
}
function setFilter(filter){currentFilter=filter;document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b.dataset.filter===filter;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});renderNews();}

function openDialog(dialog){dialog.showModal();document.body.classList.add('dialog-open');}
function openNotice(id){
 const n=notices.find(item=>item.id===id);if(!n)return;
 el('detailCategory').textContent=n.label;
 el('detailContent').innerHTML=`<h2 id="detailTitle">${n.title}</h2><p class="detail-date">Δημοσιεύτηκε στις ${dateLabel(n.date)} · Τμήμα Ιστορίας και Αρχαιολογίας</p><p class="detail-copy">${n.detail}</p><div class="detail-actions"><a class="button button-dark" href="${n.url}" target="_blank" rel="noopener">Πλήρης επίσημη ανακοίνωση ${svg('external')}</a>${n.id==='internship'?`<a class="text-link" href="assets/calendars/internship-deadline.ics" download>Αποθήκευση προθεσμίας ${svg('download')}</a>`:''}</div>`;
 openDialog(el('detailDialog'));
}

function setupTabs(selector,onChange){
 const tabs=[...document.querySelectorAll(selector)];
 tabs.forEach(tab=>{
   tab.addEventListener('click',()=>{tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});onChange(tab);});
   tab.addEventListener('keydown',event=>{let index=tabs.indexOf(tab);if(event.key==='ArrowRight')index=(index+1)%tabs.length;else if(event.key==='ArrowLeft')index=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else return;event.preventDefault();tabs[index].click();tabs[index].focus();});
 });
}
setupTabs('[data-audience]',tab=>{el('audiencePanel').innerHTML=paths[tab.dataset.audience].map(([title,url])=>externalLink(url,title)).join('');el('audiencePanel').setAttribute('aria-labelledby',tab.id);});
function renderStudy(key){const item=studyContent[key];el('studyPanel').innerHTML=`<h3>${item.title}</h3><p>${item.text}</p>${item.facts.length?`<div class="study-facts">${item.facts.map(([value,label])=>`<span><strong>${value}</strong>${label}</span>`).join('')}</div>`:''}${item.links.length?`<div class="study-related">${item.links.map(([title,url])=>externalLink(url,title)).join('')}</div>`:''}<a class="button button-dark" href="${item.url}" target="_blank" rel="noopener">${item.button} ${svg('external')}</a>`;el('studyPanel').setAttribute('aria-labelledby','study-'+key);}
setupTabs('[data-study]',tab=>renderStudy(tab.dataset.study));

function renderCalendar(){el('calendarDownload').href='assets/calendars/'+currentSemester+'-2026-2027.ics';el('calendarEvents').innerHTML=semesterEvents[currentSemester].map(e=>`<div class="calendar-event"><span class="event-marker" aria-hidden="true"></span><div><strong>${e.title}</strong><p>${e.label}</p></div></div>`).join('');}
document.querySelectorAll('[data-semester]').forEach(button=>button.addEventListener('click',()=>{currentSemester=button.dataset.semester;document.querySelectorAll('[data-semester]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderCalendar();}));

const searchPages=[
 ['Προπτυχιακές σπουδές','ΣΠΟΥΔΕΣ',OFFICIAL+'/spoydes/proptychiakes_spoydes','πτυχίο ιστορία αρχαιολογία πρόγραμμα'],
 ['Μεταπτυχιακές σπουδές','ΣΠΟΥΔΕΣ',OFFICIAL+'/spoydes/metaptychiakes_spoydes','ειδίκευση μεταπτυχιακό'],
 ['Διδακτορικές σπουδές','ΣΠΟΥΔΕΣ',OFFICIAL+'/spoydes/didaktorikes_spoydes','διδακτορικό έρευνα'],
 ['Ωρολόγιο πρόγραμμα','ΦΟΙΤΗΤΕΣ',OFFICIAL+'/spoydes/proptychiakes_spoydes/orologio_programma','μαθήματα αίθουσες ώρες'],
 ['Γραμματεία','ΕΠΙΚΟΙΝΩΝΙΑ',OFFICIAL+'/tmima/grammateia','επικοινωνία πιστοποιητικά γραμματεια'],
 ['Διδακτικό προσωπικό','ΤΟ ΤΜΗΜΑ',OFFICIAL+'/tmima/didaktiko_prosopiko/','καθηγητές διδάσκοντες άνθρωποι'],
 ['Φοιτητική μέριμνα','ΥΠΟΣΤΗΡΙΞΗ',OFFICIAL+'/foititiki_merimna','υποτροφίες σίτιση προσβασιμότητα υποστήριξη'],
 ['Ερευνητικά προγράμματα','ΕΡΕΥΝΑ',OFFICIAL+'/ereyna/ereynitika_programmata','ερευνητές προγράμματα'],
 ['Έρευνες πεδίου','ΕΡΕΥΝΑ',OFFICIAL+'/ereyna/ereynes_pedioy','ανασκαφές αρχαιολογία πεδίο'],
 ['Εργαστήριο Ιστορικής Έρευνας και Τεκμηρίωσης','ΕΡΕΥΝΑ','https://ergasthrioistorias.arch.uoa.gr/','πηγές αρχείο ιστορία εργαστήριο'],
 ['Μουσείο Αρχαιολογίας και Ιστορίας της Τέχνης','ΣΥΛΛΟΓΕΣ','https://www.uoa.gr/to_panepistimio/moyseia/archaiologias_kai_istorias_tis_technis','μουσείο τέχνη συλλογές'],
 ['Βιβλιοθήκη και Κέντρο Πληροφόρησης','ΥΠΗΡΕΣΙΕΣ','https://www.lib.uoa.gr/','βιβλία βιβλιοθήκη'],
 ['e-Class','ΥΠΗΡΕΣΙΕΣ','https://eclass.uoa.gr/','ηλεκτρονικά μαθήματα σημειώσεις eclass'],
 ['MyUni','ΥΠΗΡΕΣΙΕΣ','https://my-uni.uoa.gr/','δηλώσεις βαθμολογία my studies my-studies'],
 ['Πέργαμος','ΥΠΗΡΕΣΙΕΣ','https://pergamos.lib.uoa.gr/','ψηφιακό αποθετήριο διατριβές'],
 ['Επικοινωνία','ΤΟ ΤΜΗΜΑ',OFFICIAL+'/tmima/epikoinonia','τηλέφωνο διεύθυνση Ζωγράφου γραμματεία']
].map(([title,category,url,keywords])=>({title,category,url,keywords}));

const sectionLabels = {anakoinoseis_kai_ekdiloseis:'ΑΝΑΚΟΙΝΩΣΕΙΣ', tmima:'ΤΟ ΤΜΗΜΑ', spoydes:'ΣΠΟΥΔΕΣ', foititiki_merimna:'ΦΟΙΤΗΤΙΚΗ ΜΕΡΙΜΝΑ', ereyna:'ΕΡΕΥΝΑ', epimorfotika_programmata:'ΕΠΙΜΟΡΦΩΣΗ', ekdoseis:'ΕΚΔΟΣΕΙΣ'};
searchPages.push(...(window.ARCH_PAGES?.[document.documentElement.lang] || []).map(page => ({...page, category: sectionLabels[page.category] || page.category})));

function renderSearch(){
 const query=normalize(el('siteSearch').value.trim());
 const all=[...searchPages,...notices.map(n=>({title:n.title,category:'ΑΝΑΚΟΙΝΩΣΗ · '+n.label,url:'#news',keywords:n.description,id:n.id}))];
 const matches=query?all.filter(item=>normalize(item.title+' '+item.category+' '+item.keywords).includes(query)):searchPages.slice(0,5);
 el('searchResults').innerHTML=matches.length?matches.map(item=>`<a class="search-result" href="${item.url}" ${item.id?`data-search-notice="${item.id}"`:(item.url.startsWith('/')?'':'target="_blank" rel="noopener"')}><span><small>${item.category}</small><strong>${item.title}</strong></span>${svg(item.id?'arrow':'external')}</a>`).join(''):`<p class="search-empty">Δεν βρέθηκαν αποτελέσματα για «${escapeHtml(el('siteSearch').value)}». Δοκιμάστε έναν πιο σύντομο όρο.</p>`;
 el('searchStatus').textContent=query?`${matches.length} αποτελέσματα`:'Συχνές αναζητήσεις';
}
function openSearch(){openDialog(el('searchDialog'));el('siteSearch').value='';renderSearch();el('siteSearch').focus();}
document.querySelectorAll('.search-open').forEach(b=>b.addEventListener('click',openSearch));
el('siteSearch').addEventListener('input',renderSearch);
el('newsSearch').addEventListener('input',renderNews);
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));

el('menuButton').addEventListener('click',()=>{const open=el('mainNav').classList.toggle('open');el('menuButton').setAttribute('aria-expanded',String(open));el('menuButton').setAttribute('aria-label',open?'Κλείσιμο μενού':'Άνοιγμα μενού');el('menuButton').innerHTML=svg(open?'close':'menu');});
function closeMenu(){el('mainNav').classList.remove('open');el('menuButton').setAttribute('aria-expanded','false');el('menuButton').setAttribute('aria-label','Άνοιγμα μενού');el('menuButton').innerHTML=svg('menu');}
el('mainNav').querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{const isEditable=event.target.matches('input,textarea,[contenteditable="true"]');if(((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k')||(event.key==='/'&&!isEditable&&!document.querySelector('dialog[open]'))){event.preventDefault();if(!el('searchDialog').open){document.querySelectorAll('dialog[open]').forEach(d=>d.close());openSearch();}}if(event.key==='Escape'&&el('mainNav').classList.contains('open')){closeMenu();el('menuButton').focus();}});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');});});

document.addEventListener('click',event=>{
 const save=event.target.closest('[data-bookmark]');
 if(save){const id=save.dataset.bookmark;const willSave=!bookmarks.has(id);willSave?bookmarks.add(id):bookmarks.delete(id);const persistent=persistBookmarks();renderNews();const replacement=document.querySelector(`[data-bookmark="${id}"]`);if(replacement)replacement.focus();else document.querySelector('[data-filter="saved"]').focus();toast(willSave?(persistent?'Αποθηκεύτηκε σε αυτόν τον περιηγητή.':'Αποθηκεύτηκε για αυτή την προβολή.'):'Η ανακοίνωση αφαιρέθηκε από τα αποθηκευμένα.');return;}
 const searchNotice=event.target.closest('[data-search-notice]');if(searchNotice){event.preventDefault();el('searchDialog').close();openNotice(searchNotice.dataset.searchNotice);return;}
 const notice=event.target.closest('[data-notice]');if(notice){openNotice(notice.dataset.notice);return;}
 if(event.target.closest('#resetNews')){el('newsSearch').value='';setFilter('all');document.querySelector('[data-filter="all"]').focus();}
});

el('aboutPrototype').addEventListener('click',()=>{el('detailCategory').textContent='ΣΧΕΤΙΚΑ ΜΕ ΤΗΝ ΠΡΟΤΑΣΗ';el('detailContent').innerHTML=`<h2 id="detailTitle">Μια πιο ανοιχτή ψηφιακή εμπειρία.</h2><p class="detail-copy">Το παρόν αποτελεί πρόταση ανασχεδιασμού για συζήτηση στο Τμήμα. Χρησιμοποιεί επιλεγμένο δημόσιο περιεχόμενο της επίσημης ιστοσελίδας, με ημερομηνία αναφοράς την 22α Οκτωβρίου 2026.</p><h3 class="detail-subtitle">Δοκιμάστε στην πράξη</h3><ul class="prototype-features"><li>Αναζήτηση με ή χωρίς ελληνικούς τόνους.</li><li>Φίλτρα και τοπική αποθήκευση ανακοινώσεων.</li><li>Γρήγορες διαδρομές ανά κατηγορία επισκέπτη.</li><li>Σύγκριση επιπέδων σπουδών.</li><li>Λήψη ακαδημαϊκών ημερομηνιών ως αρχείου .ics.</li></ul><p class="detail-copy">Οι ανακοινώσεις δεν ενημερώνονται αυτόματα. Οι σύνδεσμοι οδηγούν στις επίσημες σελίδες για πλήρη, ισχύουσα ενημέρωση. Οι σελιδοδείκτες αποθηκεύονται μόνο σε αυτόν τον περιηγητή. Η επιλογή γλώσσας ανοίγει την αντίστοιχη έκδοση της παρούσας ιστοσελίδας.</p><h3 class="detail-subtitle">Πηγές & υλικό</h3><ul class="source-list"><li>${externalLink(OFFICIAL,'Επίσημη ιστοσελίδα του Τμήματος')}</li><li>${externalLink(OFFICIAL+'/spoydes/proptychiakes_spoydes','Πρόγραμμα σπουδών και ακαδημαϊκό ημερολόγιο')}</li><li>${externalLink('https://www.uoa.gr/','Φωτογραφία Προπυλαίων και πανεπιστημιακό σήμα: ΕΚΠΑ')}</li><li>${externalLink(OFFICIAL+'/ereyna/ereynes_pedioy/trechoyses_ereynes_pedioy/epidayros','Εικόνα έρευνας πεδίου: ανασκαφή Επιδαύρου, Τμήμα Ιστορίας και Αρχαιολογίας')}</li><li>${externalLink('https://estories.uoa.gr/el/politistikh_klhronomia/mouseia/moyseio-istorias-toy-panepistimioy-athinon','Χειρόγραφο Νικ. Ι. Σαρίπολου: Μουσείο Ιστορίας ΕΚΠΑ, © ΜΙΠΑ')}</li><li>${externalLink('https://www.uoa.gr/to_panepistimio/moyseia/archaiologias_kai_istorias_tis_technis','Φωτογραφία συλλογής εκμαγείων: Μουσείο Αρχαιολογίας και Ιστορίας της Τέχνης ΕΚΠΑ')}</li></ul><p class="detail-date">Γραμματοσειρές Noto Serif και Noto Sans, με άδεια SIL Open Font License.</p>`;openDialog(el('detailDialog'));});

renderNews();renderStudy('undergrad');renderCalendar();
