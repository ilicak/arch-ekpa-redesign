'use strict';
const isEnglish = document.documentElement.lang === 'en';
const contentDialog = document.getElementById('searchDialog');
const contentInput = document.getElementById('siteSearch');
const contentResults = document.getElementById('searchResults');
const contentStatus = document.getElementById('searchStatus');
const contentNormalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ς/g, 'σ');
function searchContent() {
 const query = contentNormalize(contentInput.value.trim());
 const pages = window.ARCH_PAGES[isEnglish ? 'en' : 'el'];
 const matches = query ? pages.filter(p => contentNormalize(p.title + ' ' + p.keywords).includes(query)) : pages.filter(p => p.url.split('/pages/')[1].split('/').filter(Boolean).length === 1);
 contentResults.replaceChildren();
 matches.slice(0, 60).forEach(page => {
  const link = document.createElement('a'); link.className = 'search-result'; link.href = page.url;
  const title = document.createElement('strong'); title.textContent = page.title; link.append(title);
  contentResults.append(link);
 });
 if (!matches.length) { const message = document.createElement('p'); message.className='search-empty'; message.textContent=isEnglish?'No results. Try a different search term.':'Δεν βρέθηκαν αποτελέσματα. Δοκιμάστε διαφορετικό όρο.'; contentResults.append(message); }
 contentStatus.textContent = matches.length + (isEnglish ? ' results' : ' αποτελέσματα');
}
function showContentSearch() { searchContent(); contentDialog.showModal(); document.body.classList.add('dialog-open'); contentInput.focus(); }
document.querySelectorAll('.search-open').forEach(button => button.addEventListener('click', showContentSearch));
contentInput.addEventListener('input', searchContent);
contentDialog.querySelector('.dialog-close').addEventListener('click', () => contentDialog.close());
contentDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
contentDialog.addEventListener('click', event => { if(event.target===contentDialog){const box=contentDialog.getBoundingClientRect(); if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)contentDialog.close();} });
const contentMenu = document.getElementById('menuButton');
const contentNav = document.getElementById('mainNav');
function setContentMenu(open) { contentNav.classList.toggle('open',open); contentMenu.setAttribute('aria-expanded',String(open));contentMenu.setAttribute('aria-label',isEnglish?(open?'Close menu':'Open menu'):(open?'Κλείσιμο μενού':'Άνοιγμα μενού')); }
contentMenu.addEventListener('click', () => setContentMenu(!contentNav.classList.contains('open')));
document.addEventListener('keydown', event => {
 if(event.key==='Escape')setContentMenu(false);
 const editable=event.target.matches('input,textarea,[contenteditable="true"]');
 if(((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k')||(event.key==='/'&&!editable)) {event.preventDefault(); if(!contentDialog.open)showContentSearch();}
});
// Highlight the main-menu section that contains the current page (longest matching path wins).
(() => {
 let current = null;
 let currentLength = 0;
 document.querySelectorAll('.nav-links a').forEach(link => {
  const path = new URL(link.getAttribute('href'), location.href).pathname;
  if (path.includes('/pages/') && location.pathname.startsWith(path) && path.length > currentLength) { current = link; currentLength = path.length; }
 });
 if (current) current.setAttribute('aria-current', 'true');
})();
