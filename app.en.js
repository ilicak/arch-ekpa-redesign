'use strict';

const OFFICIAL = 'https://www.arch.uoa.gr';
const POST = OFFICIAL + '/anakoinoseis_kai_ekdiloseis/proboli_anakoinosis/';
const svg = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'\''}[c]));
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('el').replace(/ς/g, 'σ');
const el = id => document.getElementById(id);
const externalLink = (url, title) => `<a href="${url}" target="_blank" rel="noopener">${title} ${svg('external')}</a>`;
const dateLabel = iso => new Intl.DateTimeFormat('en-GB', {day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Europe/Athens'}).format(new Date(iso+'T12:00:00Z'));

const notices = [
  {id:'first-years', category:'undergrad', label:'UNDERGRADUATE', date:'2026-10-22', title:'Digital services: a guide for first-year students', description:'Your first steps in the University\'s digital services.', detail:'An introduction to the digital services available to first-year students. The full guide is available in the official departmental announcement.', url:POST+'syntomos_odigos_psifiakon_ypiresion_gia_protoeteis_foitites'},
  {id:'internship', category:'undergrad', label:'UNDERGRADUATE', date:'2026-10-22', title:'Internships 2026–2027: call for applications', description:'Applications from 23 October to 8 November 2026.', detail:'The call concerns internships between January and August 2027. Applications are open from 23 October until Sunday 8 November 2026, at 23:59. Consult the full official call for eligibility, required documents and submission instructions.', url:POST+'anartisi_prosklisis_aitiseon_gia_praktiki_askisi_2026_2027'},
  {id:'museum-studies', category:'postgrad', label:'POSTGRADUATE', date:'2026-10-20', title:'Applications for the Museum Studies programme', description:'Call for applications for the 2026–2027 academic year.', detail:'A call for admission to the Museum Studies postgraduate programme for 2026–2027 has been published. Consult the official announcement for eligibility, deadlines and supporting documents.', url:POST+'prosklisi_ekdilosis_endiaferontos_gia_tin_eisagogi_sto_dpms_moyseiakes_spoydes_akadimaikoy_etoys_2026_2027'},
  {id:'doctoral-seminar', category:'doctoral', label:'DOCTORAL', date:'2026-10-20', title:'Doctoral candidates\' seminar', description:'History and archaeology · Winter semester 2026.', detail:'The Department announces its doctoral seminar in history and archaeology for winter 2026. See the poster in the official announcement for the full programme. 20 October is the publication date of the announcement.', url:POST+'seminario_ypopsifion_didaktoron_stin_istoria_kai_tin_archaiologia_cheimerino_examino_2026'},
  {id:'youth-forum', category:'events', label:'EVENTS', date:'2026-10-14', title:'2nd University Forum of the European Youth Parliament', description:'Participation circular for the university forum.', detail:'Announcement of participation in the 2nd University Forum of the European Youth Parliament Greece. Consult the official circular for the programme and participation details. 14 October is the publication date, not a confirmed event date.', url:OFFICIAL+'/anakoinoseis_kai_ekdiloseis/proboli_ekdilosis/egkyklios_symmetochis_sto_2o_panepistimiako_foroym_toy_eyropaikoy_koinoboylioy_neon_ellados_ekne_oydas_26'},
  {id:'athens-exhibition', category:'events', label:'EXHIBITIONS', date:'2026-09-22', title:'“Views of the City of Athens, 1841–1941”', description:'Student exhibition · Eynard Mansion · 22 Sep–23 Oct 2026.', detail:'The exhibition “Views of the City of Athens, 1841–1941” runs at the Eynard Mansion from 22 September to 23 October 2026. It is connected to the Monument Management postgraduate programme and collaboration with the National Bank Historical Archive and MIET. See the official announcement for visiting information.', url:POST+'tmima_istorias_kai_archaiologias_dpms_diacheirisi_mnimeion_archaiologia_poli_kai_architektoniki_egkainia_ekthesis_opseis_tis_polis_tis_athinas_1841_1941_229_23102026'}
];

const paths = {
  students:[['Timetable',OFFICIAL+'/spoydes/proptychiakes_spoydes/orologio_programma'],['e-Class','https://eclass.uoa.gr/'],['MyUni','https://my-uni.uoa.gr/'],['Secretariat',OFFICIAL+'/tmima/grammateia']],
  future:[['Undergraduate studies',OFFICIAL+'/spoydes/proptychiakes_spoydes'],['Postgraduate studies',OFFICIAL+'/spoydes/metaptychiakes_spoydes'],['The Department',OFFICIAL+'/tmima'],['Student support',OFFICIAL+'/foititiki_merimna']],
  visitors:[['Our people',OFFICIAL+'/tmima/didaktiko_prosopiko/'],['Research programmes',OFFICIAL+'/ereyna/ereynitika_programmata'],['Museum','https://www.uoa.gr/to_panepistimio/moyseia/archaiologias_kai_istorias_tis_technis'],['Contact',OFFICIAL+'/tmima/epikoinonia']]
};

const studyContent = {
 undergrad: {title:'One degree. Two pathways.',text:'Study historical sources and material remains through theory and interpretation. Choose a specialisation in History or Archaeology and Art History after completing the fourth semester.',facts:[['8','semesters of minimum study'],['2','study pathways']],links:[],button:'Explore the programme',url:OFFICIAL+'/spoydes/proptychiakes_spoydes'},
 postgrad: {title:'Follow your research interests.',text:'Programmes connecting specialist knowledge with research methods. Discover three of the Department\'s programmes:',facts:[],links:[['Archaeology and History of the Ancient World','https://archaioskosmos.arch.uoa.gr/'],['Byzantine World: History and Archaeology','https://byzcosmos.arch.uoa.gr/'],['Modern and Contemporary History and Art History','https://nsiit.arch.uoa.gr/']],button:'All postgraduate programmes',url:OFFICIAL+'/spoydes/metaptychiakes_spoydes'},
 doctoral: {title:'Your contribution to knowledge.',text:'Doctoral studies provide a framework for original research in history, archaeology and art history. Explore calls for applications, regulations and submission procedures.',facts:[],links:[['Academic staff and research interests',OFFICIAL+'/tmima/didaktiko_prosopiko/'],['Fields of expertise',OFFICIAL+'/tmima/mitroo_gnostikon_antikeimenon']],button:'About doctoral studies',url:OFFICIAL+'/spoydes/didaktorikes_spoydes'}
};

const semesterEvents = {
 winter:[{title:'Winter semester teaching',label:'28 Sep 2026 – 8 Jan 2027',start:'20260928',end:'20270109'},{title:'February examinations',label:'18 Jan – 12 Feb 2027',start:'20270118',end:'20270213'}],
 spring:[{title:'Spring semester teaching',label:'22 Feb – 4 Jun 2027',start:'20270222',end:'20270605'},{title:'June examinations',label:'7 Jun – 2 Jul 2027',start:'20270607',end:'20270703'}]
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
  el('newsCount').textContent=`${matches.length} ${matches.length===1?'announcement':'announcements'}${currentFilter==='saved'?(matches.length===1?'  saved in this browser':'  saved in this browser'):''}`;
  el('savedCount').textContent=bookmarks.size;
  el('newsGrid').innerHTML=matches.length?matches.map(n=>`<article class="news-card"><div class="news-meta"><span class="category-label">${n.label}</span><time datetime="${n.date}">${dateLabel(n.date)}</time></div><h3><button class="news-title" data-notice="${n.id}">${n.title}</button></h3><p>${n.description}</p><div class="news-card-bottom">${externalLink(n.url,'Official announcement')}<button class="bookmark" data-bookmark="${n.id}" aria-pressed="${bookmarks.has(n.id)}" aria-label="${bookmarks.has(n.id)?'Remove from saved':'Save'}: ${escapeHtml(n.title)}" title="${bookmarks.has(n.id)?'Remove':'Save in your browser'}">${svg('bookmark')}</button></div></article>`).join(''):`<div class="empty-state"><h3>${emptySaved?'Your saved announcements.':'No announcements found.'}</h3><p>${emptySaved?'Select the bookmark icon on an announcement to find it here again.':'Try another search term or category.'}</p><button id="resetNews">Show all announcements</button></div>`;
}
function setFilter(filter){currentFilter=filter;document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b.dataset.filter===filter;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});renderNews();}

function openDialog(dialog){dialog.showModal();document.body.classList.add('dialog-open');}
function openNotice(id){
 const n=notices.find(item=>item.id===id);if(!n)return;
 el('detailCategory').textContent=n.label;
 el('detailContent').innerHTML=`<h2 id="detailTitle">${n.title}</h2><p class="detail-date">Published on ${dateLabel(n.date)} · Department of History and Archaeology</p><p class="detail-copy">${n.detail}</p><div class="detail-actions"><a class="button button-dark" href="${n.url}" target="_blank" rel="noopener">Full official announcement ${svg('external')}</a>${n.id==='internship'?`<a class="text-link" href="/arch-ekpa-redesign/assets/calendars/internship-deadline-en.ics" download>Save deadline ${svg('download')}</a>`:''}</div>`;
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

function renderCalendar(){el('calendarDownload').href='/arch-ekpa-redesign/assets/calendars/'+currentSemester+'-2026-2027-en.ics';el('calendarEvents').innerHTML=semesterEvents[currentSemester].map(e=>`<div class="calendar-event"><span class="event-marker" aria-hidden="true"></span><div><strong>${e.title}</strong><p>${e.label}</p></div></div>`).join('');}
document.querySelectorAll('[data-semester]').forEach(button=>button.addEventListener('click',()=>{currentSemester=button.dataset.semester;document.querySelectorAll('[data-semester]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderCalendar();}));

const searchPages=[
 ['Undergraduate studies','STUDIES',OFFICIAL+'/spoydes/proptychiakes_spoydes','degree history archaeology programme'],
 ['Postgraduate studies','STUDIES',OFFICIAL+'/spoydes/metaptychiakes_spoydes','specialisation postgraduate'],
 ['Doctoral studies','STUDIES',OFFICIAL+'/spoydes/didaktorikes_spoydes','doctorate research'],
 ['Timetable','STUDENTS',OFFICIAL+'/spoydes/proptychiakes_spoydes/orologio_programma','courses classrooms timetable'],
 ['Secretariat','CONTACT',OFFICIAL+'/tmima/grammateia','contact certificates secretariat'],
 ['Academic staff','THE DEPARTMENT',OFFICIAL+'/tmima/didaktiko_prosopiko/','professors lecturers people'],
 ['Student support','SUPPORT',OFFICIAL+'/foititiki_merimna','scholarships meals accessibility support'],
 ['Research programmes','RESEARCH',OFFICIAL+'/ereyna/ereynitika_programmata','researchers programmes'],
 ['Field research','RESEARCH',OFFICIAL+'/ereyna/ereynes_pedioy','excavations archaeology fieldwork'],
 ['Historical Research and Documentation Laboratory','RESEARCH','https://ergasthrioistorias.arch.uoa.gr/','sources archive history laboratory'],
 ['Museum of Archaeology and Art History','COLLECTIONS','https://www.uoa.gr/to_panepistimio/moyseia/archaiologias_kai_istorias_tis_technis','museum art collections'],
 ['Library and Information Centre','SERVICES','https://www.lib.uoa.gr/','books library'],
 ['e-Class','SERVICES','https://eclass.uoa.gr/','electronic courses notes eclass'],
 ['MyUni','SERVICES','https://my-uni.uoa.gr/','registration grades my studies my-studies'],
 ['Pergamos','SERVICES','https://pergamos.lib.uoa.gr/','digital repository theses'],
 ['Contact','THE DEPARTMENT',OFFICIAL+'/tmima/epikoinonia','telephone address Zografou secretariat']
].map(([title,category,url,keywords])=>({title,category,url,keywords}));

const sectionLabels = {news_and_events:'NEWS', the_department:'THE DEPARTMENT', studies:'STUDIES', student_care:'STUDENT CARE', research:'RESEARCH', editions:'PUBLICATIONS', proclamations:'CALLS', calendar_of_events:'EVENTS', library_and_information_center:'LIBRARY', all_links:'ALL SECTIONS'};
searchPages.push(...(window.ARCH_PAGES?.[document.documentElement.lang] || []).map(page => ({...page, category: sectionLabels[page.category] || page.category})));

function renderSearch(){
 const query=normalize(el('siteSearch').value.trim());
 const all=[...searchPages,...notices.map(n=>({title:n.title,category:'ANNOUNCEMENT · '+n.label,url:'#news',keywords:n.description,id:n.id}))];
 const matches=query?all.filter(item=>normalize(item.title+' '+item.category+' '+item.keywords).includes(query)):searchPages.slice(0,5);
 el('searchResults').innerHTML=matches.length?matches.map(item=>`<a class="search-result" href="${item.url}" ${item.id?`data-search-notice="${item.id}"`:(item.url.startsWith('/')?'':'target="_blank" rel="noopener"')}><span><small>${item.category}</small><strong>${item.title}</strong></span>${svg(item.id?'arrow':'external')}</a>`).join(''):`<p class="search-empty">No results found for “${escapeHtml(el('siteSearch').value)}”. Try a shorter search term.</p>`;
 el('searchStatus').textContent=query?`${matches.length} results`:'Popular searches';
}
function openSearch(){openDialog(el('searchDialog'));el('siteSearch').value='';renderSearch();el('siteSearch').focus();}
document.querySelectorAll('.search-open').forEach(b=>b.addEventListener('click',openSearch));
el('siteSearch').addEventListener('input',renderSearch);
el('newsSearch').addEventListener('input',renderNews);
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));

el('menuButton').addEventListener('click',()=>{const open=el('mainNav').classList.toggle('open');el('menuButton').setAttribute('aria-expanded',String(open));el('menuButton').setAttribute('aria-label',open?'Close menu':'Open menu');el('menuButton').innerHTML=svg(open?'close':'menu');});
function closeMenu(){el('mainNav').classList.remove('open');el('menuButton').setAttribute('aria-expanded','false');el('menuButton').setAttribute('aria-label','Open menu');el('menuButton').innerHTML=svg('menu');}
el('mainNav').querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{const isEditable=event.target.matches('input,textarea,[contenteditable="true"]');if(((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k')||(event.key==='/'&&!isEditable&&!document.querySelector('dialog[open]'))){event.preventDefault();if(!el('searchDialog').open){document.querySelectorAll('dialog[open]').forEach(d=>d.close());openSearch();}}if(event.key==='Escape'&&el('mainNav').classList.contains('open')){closeMenu();el('menuButton').focus();}});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');});});

document.addEventListener('click',event=>{
 const save=event.target.closest('[data-bookmark]');
 if(save){const id=save.dataset.bookmark;const willSave=!bookmarks.has(id);willSave?bookmarks.add(id):bookmarks.delete(id);const persistent=persistBookmarks();renderNews();const replacement=document.querySelector(`[data-bookmark="${id}"]`);if(replacement)replacement.focus();else document.querySelector('[data-filter="saved"]').focus();toast(willSave?(persistent?'Saved in this browser.':'Saved for this visit.'):'Announcement removed from saved items.');return;}
 const searchNotice=event.target.closest('[data-search-notice]');if(searchNotice){event.preventDefault();el('searchDialog').close();openNotice(searchNotice.dataset.searchNotice);return;}
 const notice=event.target.closest('[data-notice]');if(notice){openNotice(notice.dataset.notice);return;}
 if(event.target.closest('#resetNews')){el('newsSearch').value='';setFilter('all');document.querySelector('[data-filter="all"]').focus();}
});

el('aboutPrototype').addEventListener('click',()=>{el('detailCategory').textContent='ABOUT THIS PROPOSAL';el('detailContent').innerHTML=`<h2 id="detailTitle">A more open digital experience.</h2><p class="detail-copy">This redesign proposal uses selected public content from the official Department website, with a reference date of 22 October 2026.</p><h3 class="detail-subtitle">Explore the features</h3><ul class="prototype-features"><li>Search with or without Greek accents.</li><li>Filter and save announcements in your browser.</li><li>Quick access for each audience.</li><li>Compare study levels.</li><li>Download academic dates as .ics files.</li></ul><p class="detail-copy">Announcements are a snapshot and do not update automatically. Official sources provide the current authoritative information. Bookmarks are stored in this browser. The language selector opens the corresponding local version of this site.</p><h3 class="detail-subtitle">Sources and assets</h3><ul class="source-list"><li>${externalLink(OFFICIAL,'Official Department website')}</li><li>${externalLink(OFFICIAL+'/spoydes/proptychiakes_spoydes','Study programme and academic calendar')}</li><li>${externalLink('https://www.uoa.gr/','Propylaea photograph and university emblem: NKUA')}</li><li>${externalLink(OFFICIAL+'/ereyna/ereynes_pedioy/trechoyses_ereynes_pedioy/epidayros','Field research image: Epidaurus excavation, Department of History and Archaeology')}</li><li>${externalLink('https://estories.uoa.gr/el/politistikh_klhronomia/mouseia/moyseio-istorias-toy-panepistimioy-athinon','Nikolaos I. Saripolos manuscript: University History Museum, © MIPA')}</li><li>${externalLink('https://www.uoa.gr/to_panepistimio/moyseia/archaiologias_kai_istorias_tis_technis','Cast collection photograph: NKUA Museum of Archaeology and Art History')}</li></ul><p class="detail-date">Noto Serif and Noto Sans fonts, licensed under the SIL Open Font License.</p>`;openDialog(el('detailDialog'));});

renderNews();renderStudy('undergrad');renderCalendar();
