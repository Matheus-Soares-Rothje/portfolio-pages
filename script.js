const GITHUB_USER = 'Matheus-Soares-Rothje';
const CHAPTERS = [
  {roman:'I',  label:'Sobre Mim'},
  {roman:'II', label:'Projetos'},
  {roman:'III',label:'Experiências'},
  {roman:'IV', label:'Certificados'},
  {roman:'V',  label:'Contato'},
];
const LAST_CHAPTER = CHAPTERS.length-1;
const LANG_COLOR = {TypeScript:'#3178c6',JavaScript:'#f1e05a',Python:'#3572a5',Go:'#00add8',Rust:'#dea584',HTML:'#e34c26',CSS:'#563d7c',Java:'#b07219',Shell:'#89e051',Vue:'#41b883',PHP:'#777bb3',C:'#555555'};

// ── logos via GitHub raw (real user, uploaded files) ──
// We'll use the uploaded images embedded in a data URI if possible, else placeholder
// Since we can't directly serve the binary, use a CSS-only placeholder + try fetching
// Actually, images are uploaded by the user – let's use a placeholder SVG for the mark
// and inline the circle logo concept as SVG if images unavailable

// Logo Mark SVG (placeholder matching design)
const LOGO_MARK_SVG = 'assets/logo2.png';

const LOGO_CIRCLE_SVG = 'assets/logo1.png';

// Try to load the user's actual logos via object URLs (uploaded)
document.getElementById('logo-mark-cover').src = LOGO_MARK_SVG;
document.getElementById('logo-circle-cover').src = LOGO_CIRCLE_SVG;
document.getElementById('logo-circle-toc').src = LOGO_MARK_SVG;

// ── state ──
let currentChapter = 0;
let repos = [];
let repoDetails = {}; // { name: {readme, thumb, viewmes:[]} }
let phase = 'cover';

// ── blink ──
let blinkOn = true;
setInterval(()=>{
  blinkOn=!blinkOn;
  const el=document.getElementById('blink-text');
  if(el) el.style.opacity=blinkOn?'1':'0';
},550);

// ── page edge lines ──
(()=>{
  const el=document.getElementById('page-edge');
  if(!el) return;
  for(let i=0;i<28;i++){
    const d=document.createElement('div');
    d.style.cssText=`position:absolute;right:0;height:1px;top:${(i/28)*100}%;width:${6+Math.abs(Math.sin(i*1.7))*3}px;background:rgba(34,255,85,${0.06+Math.abs(Math.sin(i*0.8))*0.06})`;
    el.appendChild(d);
  }
})();

// ── open / close ──
function openBook(){
  phase='open';
  const cover=document.getElementById('cover');
  const bookOpen=document.getElementById('book-open');
  cover.classList.add('fade-exit');
  document.getElementById('hud-status').textContent=`CAP. ${CHAPTERS[0].roman} · ${CHAPTERS[0].label.toUpperCase()}`;
  setTimeout(()=>{
    cover.style.display='none';
    bookOpen.style.display='flex';
    bookOpen.classList.add('fade-enter');
    renderChapter(0);
    if(repos.length===0) fetchRepos();
  },400);
}
function closeBook(){
  phase='cover';
  const cover=document.getElementById('cover');
  const bookOpen=document.getElementById('book-open');
  bookOpen.style.display='none';
  cover.style.display='flex';
  cover.classList.remove('fade-exit');
  void cover.offsetWidth;
  cover.classList.add('fade-enter');
  document.getElementById('hud-status').textContent='BIBLIOTECA DIGITAL';
}

document.getElementById('enter-btn').addEventListener('click',openBook);
document.getElementById('book-3d').addEventListener('click',openBook);
document.getElementById('close-book-btn').addEventListener('click',closeBook);

// ── nav ──
document.getElementById('nav-prev').addEventListener('click',()=>{ if(currentChapter>0) goToChapter(currentChapter-1); });
document.getElementById('nav-next').addEventListener('click',()=>{ if(currentChapter<LAST_CHAPTER) goToChapter(currentChapter+1); });
document.getElementById('toc-nav').addEventListener('click',e=>{
  const btn=e.target.closest('.toc-btn');
  if(btn) goToChapter(+btn.dataset.ch);
});
document.addEventListener('keydown',e=>{
  if(phase==='cover'&&(e.key==='Enter'||e.key===' ')) openBook();
  if(phase==='open'){
    if(e.key==='ArrowRight'&&currentChapter<LAST_CHAPTER) goToChapter(currentChapter+1);
    if(e.key==='ArrowLeft'&&currentChapter>0) goToChapter(currentChapter-1);
    if(e.key==='Escape') closeBook();
  }
});

function goToChapter(idx){
  currentChapter=idx;
  document.querySelectorAll('.toc-btn').forEach((b,i)=>b.classList.toggle('active',i===idx));
  document.getElementById('running-head').textContent=`Cap. ${CHAPTERS[idx].roman} · ${CHAPTERS[idx].label.toUpperCase()}`;
  document.getElementById('page-num').textContent=`— ${idx+1} —`;
  document.getElementById('hud-status').textContent=`CAP. ${CHAPTERS[idx].roman} · ${CHAPTERS[idx].label.toUpperCase()}`;
  const prevBtn=document.getElementById('nav-prev');
  const nextBtn=document.getElementById('nav-next');
  prevBtn.disabled=idx===0;
  nextBtn.disabled=idx===LAST_CHAPTER;
  document.getElementById('nav-prev-label').textContent=idx>0?CHAPTERS[idx-1].label:'';
  document.getElementById('nav-next-label').textContent=idx<LAST_CHAPTER?CHAPTERS[idx+1].label:'';
  renderChapter(idx);
}
// init nav labels
document.getElementById('nav-next-label').textContent='Projetos';

// ── render ──
function renderChapter(idx){
  const el=document.getElementById('page-content');
  el.scrollTop=0;
  if(idx===0) el.innerHTML=renderAbout();
  else if(idx===1) el.innerHTML=renderProjects();
  else if(idx===2){ el.innerHTML=renderExperiences(); }
  else if(idx===3){ el.innerHTML=renderCerts(); bindCertEvents(); }
  else if(idx===4) el.innerHTML=renderContact();
  bindProjectEvents();
  bindExperienceEvents();
}

function ornament(op=0.28){
  return `<svg width="100%" height="14" viewBox="0 0 240 14" fill="none"><line x1="0" y1="7" x2="96" y2="7" stroke="rgba(34,255,85,${op})" stroke-width="0.6"/><polygon points="100,7 104,3 108,7 104,11" stroke="rgba(34,255,85,${op*1.4})" stroke-width="0.7" fill="none"/><circle cx="120" cy="7" r="2.5" fill="rgba(34,255,85,${op*1.5})"/><polygon points="132,7 136,3 140,7 136,11" stroke="rgba(34,255,85,${op*1.4})" stroke-width="0.7" fill="none"/><line x1="144" y1="7" x2="240" y2="7" stroke="rgba(34,255,85,${op})" stroke-width="0.6"/></svg>`;
}
function chHeading(title){
  return `<div class="ch-heading"><h2>${title.toUpperCase()}</h2><div style="margin-top:10px;">${ornament()}</div></div>`;
}

// ── Site Data (JSONs separados) ──
// Troque pelas URLs reais dos seus arquivos (ex: raw.githubusercontent.com/SEU_USUARIO/SEU_REPO/main/about.json)
const ABOUT_URL          = 'https://raw.githubusercontent.com/Matheus-Soares-Rothje/portfolio-data/main/about.json';
const CERTS_DESTAQUE_URL = 'https://raw.githubusercontent.com/Matheus-Soares-Rothje/portfolio-data/main/certs-destaque.json';
const CERTS_OUTROS_URL   = 'https://raw.githubusercontent.com/Matheus-Soares-Rothje/portfolio-data/main/certs-outros.json';
const SKILLS_URL         = 'https://raw.githubusercontent.com/Matheus-Soares-Rothje/portfolio-data/main/skills.json';

// ── Experiências (repo separado: cada pasta = uma experiência) ──
const EXPERIENCES_REPO    = 'portfolio-experiencias';
const EXPERIENCES_BRANCH  = 'main';
const EXPERIENCES_API_URL = `https://api.github.com/repos/${GITHUB_USER}/${EXPERIENCES_REPO}/contents/?ref=${EXPERIENCES_BRANCH}`;
const EXPERIENCES_RAW_BASE= `https://raw.githubusercontent.com/${GITHUB_USER}/${EXPERIENCES_REPO}/${EXPERIENCES_BRANCH}`;
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg)$/i;

let experiences=null;        // null = carregando | [] vazio | array de experiências prontas
let experiencesPromise=null;

let aboutData=null;      // null = carregando | false = falhou/não existe ainda | objeto = ok
let aboutPromise=null;
let certsData=null;      // { featured:[...], others:[...] }
let skillsData=null;     // { hard:[...], soft:[...] }
let certsPromise=null;

function normCert(c){
  return {
    title:c.title||c.nome_curso||'',
    issuer:c.issuer||c.instituicao||'',
    year:c.year||c.ano||'',
    image:c.image||c.imagem_url||'',
    pdf:c.pdf||c.pdf_url||''
  };
}

function fetchAbout(){
  if(aboutPromise) return aboutPromise;
  aboutPromise=fetch(ABOUT_URL)
    .then(r=>r.ok?r.json():Promise.reject())
    .then(data=>{ aboutData={paragraphs:(data.paragraphs||data.about&&data.about.paragraphs)||[], anos:data.anos||(data.about&&data.about.anos)}; })
    .catch(e=>{
      console.warn('about.json ainda não disponível',e);
      aboutData=false; // mantém estado de "carregando" na tela
      aboutPromise=null; // permite tentar novamente na próxima visita ao capítulo
    })
    .then(()=>{ if(currentChapter===0) document.getElementById('page-content').innerHTML=renderAbout(); });
  return aboutPromise;
}

let skillsPromise=null;

function fetchSkills(){
  if(skillsPromise) return skillsPromise;
  skillsPromise=fetch(SKILLS_URL)
    .then(r=>r.ok?r.json():{})
    .catch(()=>({}))
    .then(skills=>{
      skillsData={hard:(skills&&skills.hard)||[], soft:(skills&&skills.soft)||[]};
    })
    .then(()=>{
      if(currentChapter===0) document.getElementById('page-content').innerHTML=renderAbout();
      if(currentChapter===3){ document.getElementById('page-content').innerHTML=renderCerts(); bindCertEvents(); }
    });
  return skillsPromise;
}

function fetchCerts(){
  if(certsPromise) return certsPromise;
  certsPromise=Promise.all([
    fetch(CERTS_DESTAQUE_URL).then(r=>r.ok?r.json():[]).catch(()=>[]),
    fetch(CERTS_OUTROS_URL).then(r=>r.ok?r.json():[]).catch(()=>[])
  ]).then(([destaque,outros])=>{
    certsData={
      featured:(destaque||[]).map(normCert).filter(c=>c.title),
      others:(outros||[]).map(normCert).filter(c=>c.title)
    };
    if(skillsData===null) fetchSkills();
  }).then(()=>{
    if(currentChapter===3){ document.getElementById('page-content').innerHTML=renderCerts(); bindCertEvents(); }
    if(currentChapter===0){ document.getElementById('page-content').innerHTML=renderAbout(); }
  });
  return certsPromise;
}

// ── About ──
function renderAbout(){
  if(aboutData===null||aboutData===false){
    fetchAbout();
    return `<div class="ch-wrap">
      ${chHeading('Sobre Mim')}
      <p class="proj-loading">Carregando...</p>
    </div>`;
  }
  if(skillsData===null) fetchSkills();
  if(repos.length===0) fetchRepos();
  if(certsData===null) fetchCerts();
  const skillTags=(arr)=>arr.map(s=>`<span class="skill-tag">${s}</span>`).join('');
  const totalCerts=certsData?(certsData.featured.length+certsData.others.length):null;
  const stats=[
    {v:aboutData.anos?`${aboutData.anos}+`:'...', l:'Anos'},
    {v:repos.length?`${repos.length}+`:'...', l:'Projetos'},
    {v:totalCerts!==null?`${totalCerts}+`:'...', l:'Certificados'}
  ];
  return `<div class="ch-wrap">
    ${chHeading('Sobre Mim')}
    <div class="about-bio-row">
      <img class="about-logo" src="${LOGO_MARK_SVG}" alt="mark"/>
      <div class="about-bio-box">
        ${aboutData.paragraphs.map(p=>`<p style="margin-bottom:10px;">${p}</p>`).join('')}
      </div>
    </div>
    <p class="skills-label">// Habilidades</p>
    <div class="skills-grid">
      ${skillsData?`
        ${skillsData.hard.length?`<div class="skill-cat"><p>Hard Skills</p><div class="skill-tags">${skillTags(skillsData.hard)}</div></div>`:''}
        ${skillsData.soft.length?`<div class="skill-cat"><p>Soft Skills</p><div class="skill-tags">${skillTags(skillsData.soft)}</div></div>`:''}
      `:'<p class="proj-loading">Carregando habilidades...</p>'}
    </div>
    <div style="margin-bottom:14px;">${ornament(0.15)}</div>
    <div class="stats-row">
      ${stats.map(s=>`<div class="stat-box"><div class="stat-val">${s.v}</div><div class="stat-lbl">${s.l}</div></div>`).join('')}
    </div>
  </div>`;
}

// ── Projects ──
function renderProjects(){
  if(repos.length===0){
    return `<div class="ch-wrap">
      ${chHeading('Projetos')}
      <p class="proj-loading" id="proj-loading">Carregando projetos do GitHub...</p>
    </div>`;
  }
  return buildProjectsHTML();
}

function buildProjectsHTML(){
  const cards=repos.map(r=>{
    const details=repoDetails[r.name]||{};
    const langColor=LANG_COLOR[r.language]||'#22ff55';
    const hasThumb=details.thumb;
    const hasReadme=details.readme;
    const hasViewme=details.viewmes&&details.viewmes.length>0;
    return `<div class="proj-card" data-name="${r.name}">
      <div class="proj-card-header">
        <span class="proj-name">${r.name}</span>
        <button class="expand-toggle" data-name="${r.name}">▸ ver mais</button>
      </div>
      ${r.description?`<p class="proj-desc">${r.description}</p>`:''}
      <div class="proj-meta">
        ${r.language?`<span><span class="lang-dot" style="background:${langColor}"></span>${r.language}</span>`:''}
        <span>★ ${r.stargazers_count}</span>
        <span>⑂ ${r.forks_count}</span>
      </div>
      <div class="proj-expand" id="expand-${r.name}">
        ${hasThumb?`<img class="proj-thumb" src="${details.thumb}" alt="thumb" onerror="this.style.display='none'"/>`:''}
        ${hasReadme?`<div class="proj-readme">${escHtml(details.readme.slice(0,800))}${details.readme.length>800?'\n\n[...]':''}</div>`:''}
        ${hasViewme?`<div class="proj-viewme-row">${details.viewmes.map(url=>`<img class="proj-viewme-img" src="${url}" alt="viewme" onerror="this.style.display='none'" data-full="${url}"/>`).join('')}</div>`:''}
        <a class="proj-link" href="${r.html_url}" target="_blank" rel="noreferrer">↗ Ver no GitHub</a>
      </div>
    </div>`;
  }).join('');
  return `<div class="ch-wrap">
    ${chHeading('Projetos')}
    <div class="proj-grid">${cards}</div>
    <a class="proj-all-link" href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noreferrer">↗ Ver todos os repositórios no GitHub</a>
  </div>`;
}

function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function bindProjectEvents(){
  document.querySelectorAll('.proj-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const name=card.dataset.name;
      const exp=document.getElementById('expand-'+name);
      const btn=card.querySelector('.expand-toggle');
      const open=exp.classList.toggle('open');
      btn.textContent=open?'▾ fechar':'▸ ver mais';
      if(open && !repoDetails[name]){
        loadRepoDetails(name);
      }
    });
  });
  document.querySelectorAll('.proj-viewme-img').forEach(img=>{
    img.addEventListener('click',e=>{
      e.stopPropagation();
      document.getElementById('img-modal-src').src=img.dataset.full;
      document.getElementById('img-modal').classList.add('open');
    });
  });
  document.querySelectorAll('.proj-link').forEach(a=>{
    a.addEventListener('click',e=>e.stopPropagation());
  });
}

document.getElementById('img-modal').addEventListener('click',e=>{
  if(e.target===document.getElementById('img-modal')||e.target===document.getElementById('img-modal-close')){
    document.getElementById('img-modal').classList.remove('open');
  }
});

// ── Experiências ──
// Cada pasta dentro do repo EXPERIENCES_REPO é uma experiência.
// Dentro da pasta, espera-se:
//   info.json   -> { "titulo": "...", "descricao": "..." }  (aceita também "title"/"description")
//   links.json  -> [ { "label": "Ver site", "url": "https://..." }, ... ]  (opcional)
//   quaisquer imagens (.png/.jpg/.jpeg/.gif/.webp/.svg) na pasta são exibidas em galeria
function fetchExperiences(){
  if(experiencesPromise) return experiencesPromise;
  experiencesPromise=fetch(EXPERIENCES_API_URL)
    .then(r=>r.ok?r.json():Promise.reject())
    .then(items=>{
      const folders=(Array.isArray(items)?items:[]).filter(it=>it.type==='dir');
      return Promise.all(folders.map(folder=>fetchExperienceFolder(folder.name)));
    })
    .then(list=>{
      experiences=list.filter(Boolean);
    })
    .catch(e=>{
      console.warn('Experiências ainda não disponíveis',e);
      experiences=[];
    })
    .then(()=>{
      if(currentChapter===2) document.getElementById('page-content').innerHTML=renderExperiences();
      bindExperienceEvents();
    });
  return experiencesPromise;
}

function fetchExperienceFolder(folderName){
  const folderApiUrl=`https://api.github.com/repos/${GITHUB_USER}/${EXPERIENCES_REPO}/contents/${encodeURIComponent(folderName)}?ref=${EXPERIENCES_BRANCH}`;
  const rawBase=`${EXPERIENCES_RAW_BASE}/${folderName}`;
  return fetch(folderApiUrl)
    .then(r=>r.ok?r.json():[])
    .then(files=>{
      files=Array.isArray(files)?files:[];
      const images=files
        .filter(f=>f.type==='file'&&IMAGE_EXT_RE.test(f.name))
        .map(f=>`${rawBase}/${f.name}`);
      const hasInfo=files.some(f=>f.name.toLowerCase()==='info.json');
      const hasLinks=files.some(f=>f.name.toLowerCase()==='links.json');
      const infoP=hasInfo
        ? fetch(`${rawBase}/info.json`).then(r=>r.ok?r.json():{}).catch(()=>({}))
        : Promise.resolve({});
      const linksP=hasLinks
        ? fetch(`${rawBase}/links.json`).then(r=>r.ok?r.json():[]).catch(()=>[])
        : Promise.resolve([]);
      return Promise.all([infoP,linksP]).then(([info,links])=>({
        slug:folderName,
        titulo:info.titulo||info.title||folderName,
        descricao:info.descricao||info.description||'',
        imagens:images,
        links:(Array.isArray(links)?links:[]).filter(l=>l&&l.url).map(l=>({
          label:l.label||l.titulo||l.title||'↗ Link',
          url:l.url||l.link||''
        }))
      }));
    })
    .catch(()=>null);
}

function renderExperiences(){
  if(experiences===null){
    fetchExperiences();
    return `<div class="ch-wrap">
      ${chHeading('Experiências')}
      <p class="proj-loading">Carregando experiências...</p>
    </div>`;
  }
  if(experiences.length===0){
    return `<div class="ch-wrap">
      ${chHeading('Experiências')}
      <p class="exp-empty">Nenhuma experiência publicada ainda.</p>
    </div>`;
  }
  const cards=experiences.map(exp=>`
    <div class="exp-card" data-slug="${exp.slug}">
      <div class="exp-card-header">
        <span class="exp-name">${escHtml(exp.titulo)}</span>
      </div>
      ${exp.descricao?`<p class="exp-desc">${escHtml(exp.descricao)}</p>`:''}
      ${exp.imagens.length?`<div class="exp-img-row">${exp.imagens.map(url=>`<img class="exp-img" src="${url}" alt="${escHtml(exp.titulo)}" onerror="this.style.display='none'" data-full="${url}"/>`).join('')}</div>`:''}
      ${exp.links.length?`<div class="exp-links-row">${exp.links.map(l=>`<a class="exp-link" href="${l.url}" target="_blank" rel="noreferrer">${escHtml(l.label)} ↗</a>`).join('')}</div>`:''}
    </div>
  `).join('');
  return `<div class="ch-wrap">
    ${chHeading('Experiências')}
    <div class="proj-grid">${cards}</div>
  </div>`;
}

function bindExperienceEvents(){
  document.querySelectorAll('.exp-img').forEach(img=>{
    img.addEventListener('click',e=>{
      e.stopPropagation();
      document.getElementById('img-modal-src').src=img.dataset.full;
      document.getElementById('img-modal').classList.add('open');
    });
  });
  document.querySelectorAll('.exp-link').forEach(a=>{
    a.addEventListener('click',e=>e.stopPropagation());
  });
}

// ── GitHub fetching ──
async function fetchRepos(){
  try{
    const r=await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=20`);
    const data=await r.json();
    if(Array.isArray(data)){
      repos=data.filter(r=>!r.fork);
      if(currentChapter===1){
        document.getElementById('page-content').innerHTML=buildProjectsHTML();
        bindProjectEvents();
      }
      if(currentChapter===0){
        document.getElementById('page-content').innerHTML=renderAbout();
      }
    }
  }catch(e){console.warn('GitHub fetch failed',e);}
}

async function loadRepoDetails(name){
  const base=`https://raw.githubusercontent.com/${GITHUB_USER}/${name}/main`;
  const details={readme:'',thumb:null,viewmes:[]};

  // README
  try{
    const r=await fetch(`${base}/README.md`);
    if(r.ok) details.readme=await r.text();
  }catch(e){}

  // thumb.png
  details.thumb=`${base}/thumb.png`;

  // viewme1..10
  const viewmeChecks=[];
  for(let i=1;i<=10;i++){
    viewmeChecks.push(`${base}/viewme${i}.png`);
  }
  // We'll set them all and let onerror hide them
  details.viewmes=viewmeChecks;

  repoDetails[name]=details;

  // Re-render expand section
  const exp=document.getElementById('expand-'+name);
  if(exp&&exp.classList.contains('open')){
    const repo=repos.find(r=>r.name===name)||{};
    const langColor=LANG_COLOR[repo.language]||'#22ff55';
    const hasThumb=true; // will hide via onerror
    exp.innerHTML=`
      <img class="proj-thumb" src="${details.thumb}" alt="thumb" onerror="this.style.display='none'"/>
      ${details.readme?`<div class="proj-readme">${escHtml(details.readme.slice(0,800))}${details.readme.length>800?'\n\n[...]':''}</div>`:''}
      <div class="proj-viewme-row">${details.viewmes.map(url=>`<img class="proj-viewme-img" src="${url}" alt="viewme" onerror="this.style.display='none'" data-full="${url}"/>`).join('')}</div>
      <a class="proj-link" href="https://github.com/${GITHUB_USER}/${name}" target="_blank" rel="noreferrer">↗ Ver no GitHub</a>
    `;
    exp.querySelectorAll('.proj-viewme-img').forEach(img=>{
      img.addEventListener('click',e=>{
        e.stopPropagation();
        document.getElementById('img-modal-src').src=img.dataset.full;
        document.getElementById('img-modal').classList.add('open');
      });
    });
    const link=exp.querySelector('.proj-link');
    if(link) link.addEventListener('click',e=>e.stopPropagation());
  }
}

// ── Certs ──
const ROMANS=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
const CERT_COLORS=['#8b5cf6','#06b6d4','#f59e0b','#22ff55','#f97316','#ec4899'];

function openCertLink(c){
  const url=c.pdf||c.image;
  if(url) window.open(url,'_blank','noopener,noreferrer');
}

function bindCertEvents(){
  document.querySelectorAll('[data-cert-idx]').forEach(el=>{
    el.addEventListener('click',()=>{
      const group=el.dataset.certGroup;
      const c=certsData[group][+el.dataset.certIdx];
      openCertLink(c);
    });
  });
}

function renderCerts(){
  if(certsData===null){
    fetchCerts();
    return `<div class="ch-wrap">
      ${chHeading('Certificados')}
      <p class="proj-loading">Carregando certificados...</p>
    </div>`;
  }

  const featured=certsData.featured;
  const others=certsData.others;

  const featuredHTML=featured.map((c,i)=>{
    const color=CERT_COLORS[i%CERT_COLORS.length];
    const hasLink=c.pdf||c.image;
    return `<div class="cert-card${hasLink?' has-link':''}" data-cert-group="featured" data-cert-idx="${i}" style="border:1px solid ${color}26;background:${color}09;">
      <div class="cert-medal" style="border:1px solid ${color}50;background:${color}15;">
        <span style="color:${color}">${ROMANS[i%ROMANS.length]}</span>
      </div>
      <div>
        <div class="cert-title">${c.title}</div>
        <div class="cert-meta">${c.issuer}${c.issuer&&c.year?' · ':''}${c.year}</div>
      </div>
    </div>`;
  }).join('');

  const othersHTML=others.map((c,i)=>{
    return `<div class="cert-row" data-cert-group="others" data-cert-idx="${i}">
      <span class="cert-row-title">${c.title}</span>
      <span class="cert-row-meta">${c.issuer}${c.issuer&&c.year?' · ':''}${c.year}</span>
    </div>`;
  }).join('');

  const skillTags=(arr)=>arr.map(s=>`<span class="skill-tag">${s}</span>`).join('');

  return `<div class="ch-wrap">
    ${chHeading('Certificados')}
    ${featured.length?`<div class="certs-grid">${featuredHTML}</div>`:''}
    ${others.length?`<p class="certs-subhead">// Outros certificados</p><div class="certs-list">${othersHTML}</div>`:''}
    ${(skillsData&&(skillsData.hard.length||skillsData.soft.length))?`
      <p class="certs-subhead">// Skills</p>
      <div class="skills-block">
        ${skillsData.hard.length?`<div class="skill-cat"><p>Hard Skills</p><div class="skill-tags">${skillTags(skillsData.hard)}</div></div>`:''}
        ${skillsData.soft.length?`<div class="skill-cat"><p>Soft Skills</p><div class="skill-tags">${skillTags(skillsData.soft)}</div></div>`:''}
      </div>`:''}
    <div style="margin-top:18px;">${ornament(0.12)}</div>
    <p style="font-size:9px;color:rgba(168,255,196,.3);letter-spacing:.4em;text-align:center;margin-top:10px;">// APRENDIZADO CONTÍNUO</p>
  </div>`;
}

// ── Contact ──
function renderContact(){
  const links=[
    {label:'GitHub',   value:`github.com/${GITHUB_USER}`,   href:`https://github.com/${GITHUB_USER}`,   icon:'⌥', color:'#a8ffc4'},
    {label:'LinkedIn', value:'linkedin.com/in/matheus-rothje', href:'https://www.linkedin.com/in/matheus-rothje-484a8036b/', icon:'in', color:'#0ea5e9'},
    {label:'E-mail',   value:'contato@mattz.dev',            href:'mailto:contato@mattz.dev',             icon:'@',  color:'#22ff55'},
  ];
  return `<div class="ch-wrap">
    ${chHeading('Contato')}
    <p style="font-size:8px;letter-spacing:.5em;color:rgba(168,255,196,.35);margin-bottom:18px;text-transform:uppercase;">// Canais de comunicação</p>
    <div class="contact-links">
      ${links.map(l=>`<a class="contact-link" href="${l.href}" target="_blank" rel="noreferrer">
        <span class="contact-link-icon" style="color:${l.color}">${l.icon}</span>
        <div>
          <div class="contact-link-label">${l.label}</div>
          <div class="contact-link-value">${l.value}</div>
        </div>
        <span style="margin-left:auto;font-size:10px;color:rgba(168,255,196,.25);">↗</span>
      </a>`).join('')}
    </div>
    ${ornament(0.18)}
    <div class="contact-sign">
      <img src="${LOGO_MARK_SVG}" alt="mark" style="width:52px;height:52px;object-fit:contain;opacity:.3;margin:0 auto;"/>
      <p>MATT'Z · MMXXV</p>
    </div>
  </div>`;
}

// initial render
goToChapter(0);
