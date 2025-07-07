import"./assets/modulepreload-polyfill-B5Qt9EMX.js";import{a as P}from"./assets/vendor-Cv0FVZ7t.js";const R="8a0658d1a6872272a1ed1ab9af543174",G="https://api.themoviedb.org/3",T="https://image.tmdb.org/t/p",W=P.create({baseURL:G,headers:{"Content-Type":"application/json"},params:{api_key:R}}),a={weeklyMovieList:document.querySelector(".weekly-movie-list"),hero:document.querySelector(".hero"),defaultHero:document.querySelector(".default-hero"),movieHero:document.querySelector(".movie-hero"),prevButton:document.querySelector(".slider-button.prev"),nextButton:document.querySelector(".slider-button.next"),themeSwitch:document.getElementById("theme-switch"),modal:document.getElementById("movieDetailsModal"),modalCloseBtn:document.querySelector(".modal-close-btn"),videoModal:document.getElementById("videoModal"),videoFrame:document.getElementById("videoFrame"),videoModalCloseBtn:document.querySelector("#videoModal .modal-close-btn"),errorModal:document.getElementById("errorModal"),errorModalCloseBtn:document.querySelector("#errorModal .modal-close-btn"),errorMessage:document.querySelector(".error-message"),movieGrid:document.querySelector(".movie-grid"),catalogList:document.querySelector(".catalog-list"),genreSelect:document.querySelector(".genre-select"),loadMoreBtn:document.querySelector(".load-more-btn"),hamburgerMenu:document.querySelector(".hamburger-menu"),navLinks:document.querySelector(".nav-links"),searchInput:document.querySelector(".search-input"),yearSelect:document.querySelector(".year-select"),searchButton:document.querySelector(".search-button"),weeklyTrendsList:document.querySelector(".weekly-trends-list"),upcomingMoviesList:document.querySelector(".upcoming-movies-list"),movieDetailsModal:document.getElementById("movieDetailsModal"),movieDetailsModalCloseBtn:document.querySelector("#movieDetailsModal .modal-close-btn")},u=async(e,t={})=>{try{return(await W.get(e,{params:t})).data}catch(r){return console.error("Error fetching data:",r),null}},N=e=>Array(5).fill().map((t,r)=>`
      <i class="fas fa-star ${r<Math.round(e/2)?"filled":""}"></i>
    `).join(""),Y=e=>new Date(e).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}),V=()=>{localStorage.getItem("theme")==="light"?(document.documentElement.setAttribute("data-theme","light"),a.themeSwitch.checked=!1):(document.documentElement.removeAttribute("data-theme"),a.themeSwitch.checked=!0),a.themeSwitch.addEventListener("change",()=>{a.themeSwitch.checked?(document.documentElement.removeAttribute("data-theme"),localStorage.setItem("theme","dark")):(document.documentElement.setAttribute("data-theme","light"),localStorage.setItem("theme","light"))})},K=e=>{a.videoFrame.src=`https://www.youtube.com/embed/${e}?autoplay=1`,a.videoModal.classList.add("active"),document.body.style.overflow="hidden"},x=()=>{a.videoFrame.src="",a.videoModal.classList.remove("active"),document.body.style.overflow=""};a.videoModalCloseBtn.addEventListener("click",x);a.videoModal.addEventListener("click",e=>{e.target===a.videoModal&&x()});const I=e=>{a.errorMessage.textContent=e,a.errorModal.classList.add("active"),document.body.style.overflow="hidden"},F=()=>{a.errorModal.classList.remove("active"),document.body.style.overflow=""};a.errorModalCloseBtn.addEventListener("click",F);a.errorModal.addEventListener("click",e=>{e.target===a.errorModal&&F()});const C=e=>e?new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e):"N/A",Q=e=>{if(!e)return"N/A";const t=Math.floor(e/60),r=e%60;return`${t}h ${r}m`},O=async e=>{try{const[t,r]=await Promise.all([u(`/movie/${e}`),u(`/movie/${e}/credits`)]);a.modal.querySelector(".modal-title").textContent=t.title,a.modal.querySelector(".modal-rating").innerHTML=`
      <div class="stars">${N(t.vote_average)}</div>
      <span>${t.vote_average.toFixed(1)}</span>
    `,a.modal.querySelector(".modal-genres").innerHTML=`
      <h4>Genres</h4>
      <p>${t.genres.map(o=>o.name).join(", ")}</p>
    `,a.modal.querySelector(".modal-release-date").innerHTML=`
      <h4>Release Date</h4>
      <p>${Y(t.release_date)}</p>
    `,a.modal.querySelector(".modal-runtime").innerHTML=`
      <h4>Runtime</h4>
      <p>${Q(t.runtime)}</p>
    `,a.modal.querySelector(".modal-budget").innerHTML=`
      <h4>Budget</h4>
      <p>${C(t.budget)}</p>
    `,a.modal.querySelector(".modal-revenue").innerHTML=`
      <h4>Revenue</h4>
      <p>${C(t.revenue)}</p>
    `,a.modal.querySelector(".modal-overview p").textContent=t.overview;const i=a.modal.querySelector(".cast-list");i.innerHTML=r.cast.slice(0,6).map(o=>`
        <div class="cast-member">
          <img src="https://image.tmdb.org/t/p/w185${o.profile_path}" alt="${o.name}">
          <div class="name">${o.name}</div>
          <div class="character">${o.character}</div>
        </div>
      `).join(""),a.modal.classList.add("active"),document.body.style.overflow="hidden"}catch(t){console.error("Error fetching movie details:",t)}},U=()=>{a.modal.classList.remove("active"),document.body.style.overflow=""};a.modalCloseBtn.addEventListener("click",U);a.modal.addEventListener("click",e=>{e.target===a.modal&&U()});async function L(e){const t=document.querySelector(".hero-content.movie-hero"),r=document.querySelector(".hero");r.style.backgroundImage=`url(${T}/original${e.backdrop_path})`,t.innerHTML=`
    <h1>${e.title}</h1>
    <div class="movie-rating-stars">
      <div class="stars">${N(e.vote_average)}</div>
      <span class="rating-number">${e.vote_average.toFixed(1)}</span>
    </div>
    <p>${e.overview.slice(0,150)}...</p>
    <div class="hero-buttons">
      <button class="watch-trailer-btn" data-movie-id="${e.id}">
        <span>Watch Trailer</span>
      </button>
      <button class="more-details-btn" data-movie-id="${e.id}">
        <span>More Details</span>
      </button>
    </div>
  `,t.style.display="block";const i=t.querySelector(".watch-trailer-btn"),o=t.querySelector(".more-details-btn");i.addEventListener("click",async()=>{try{const s=(await u(`/movie/${e.id}/videos`)).results.find(n=>n.type==="Trailer"&&n.site==="YouTube");s?K(s.key):I("Sorry, trailer is not available for this movie at the moment. Please check back later.")}catch(v){console.error("Error fetching video:",v),I("Sorry, we encountered an error while loading the trailer. Please try again later.")}}),o.addEventListener("click",()=>O(e.id))}let l=0,d=[],w;function z(e){d=e,l=Math.floor(Math.random()*e.length),L(d[l]);const t=document.querySelector(".hero-nav-btn.prev-movie"),r=document.querySelector(".hero-nav-btn.next-movie");t.addEventListener("click",()=>{clearInterval(w),l=(l-1+d.length)%d.length,L(d[l]),w=setInterval(()=>{l=(l+1)%d.length,L(d[l])},5e3)}),r.addEventListener("click",()=>{clearInterval(w),l=(l+1)%d.length,L(d[l]),w=setInterval(()=>{l=(l+1)%d.length,L(d[l])},5e3)}),w=setInterval(()=>{l=(l+1)%d.length,L(d[l])},5e3)}async function B(e){const t=document.querySelector(".weekly-movie-list");t.innerHTML="";for(const r of e)try{const o=(await u(`/movie/${r.id}`)).genres.map(h=>h.name).join(", "),s=JSON.parse(localStorage.getItem("library")||"[]").some(h=>h.id===r.id),n=document.createElement("li");n.className="weekly-movie-item",n.innerHTML=`
        <a href="#" class="weekly-movie-link" data-movie-id="${r.id}">
          <img
            src="${T}/w500${r.poster_path}"
            alt="${r.title}"
            class="weekly-movie-image"
          />
          <div class="movie-rating">
            <i class="fas fa-star"></i>
            <span>${r.vote_average.toFixed(1)}</span>
          </div>
          <div class="movie-year">${r.release_date.split("-")[0]}</div>
          <div class="weekly-movie-info">
            <h3 class="movie-title">${r.title}</h3>
            <div class="movie-meta">
              <span>${o}</span>
              <span class="movie-meta-divider">|</span>
              <span>${r.release_date.split("-")[0]}</span>
            </div>
          </div>
        </a>
        <button class="add-to-library ${s?"added":""}" data-movie-id="${r.id}">
          <i class="fas ${s?"fa-check":"fa-plus"}"></i>
          ${s?"Added to library":"Add to library"}
        </button>
      `;const c=n.querySelector(".add-to-library");c.addEventListener("click",async h=>{h.preventDefault(),h.stopPropagation();const f=parseInt(c.dataset.movieId),p=e.find(b=>b.id===f);if(!p)return;const g=await u(`/movie/${f}`),S={id:f,title:p.title,poster_path:p.poster_path,release_date:p.release_date,vote_average:p.vote_average,genres:g.genres.map(b=>b.name).join(", "),overview:p.overview};let y=JSON.parse(localStorage.getItem("library")||"[]");y.some(b=>b.id===f)?(y=y.filter(b=>b.id!==f),localStorage.setItem("library",JSON.stringify(y)),c.innerHTML='<i class="fas fa-plus"></i> Add to library',c.style.background="#ff6b01",c.disabled=!1):(y.push(S),localStorage.setItem("library",JSON.stringify(y)),c.innerHTML='<i class="fas fa-check"></i> Added to library',c.style.background="#2ecc71",c.disabled=!0)}),n.querySelector(".weekly-movie-link").addEventListener("click",async h=>{h.preventDefault(),clearInterval(w),L(r),document.querySelector(".hero").scrollIntoView({behavior:"smooth"}),w=setInterval(()=>{l=(l+1)%d.length,L(d[l])},5e3)}),t.appendChild(n)}catch(i){console.error(`Error fetching details for movie ${r.id}:`,i)}}async function j(){try{const e=await u("/trending/movie/week");if(!(e!=null&&e.results))return;B(e.results),z(e.results)}catch(e){console.error("Error fetching trending movies:",e),I("Failed to load trending movies. Please try again later.")}}let m=1,$=27,_=!1;async function D(e){if(!(_||e===m))try{_=!0;const t=await u("/trending/movie/week",{page:e,language:"en-US"});if(!(t!=null&&t.results))return;B(t.results),m=e,X(),window.scrollTo({top:0,behavior:"smooth"})}catch(t){console.error("Error fetching page:",t),I("Failed to load movies. Please try again later.")}finally{_=!1}}function X(){const e=document.querySelector(".page-numbers"),t=document.querySelector(".pagination-btn.prev-page"),r=document.querySelector(".pagination-btn.next-page");t.disabled=m===1,r.disabled=m===$;let i="";i+=`
    <button class="pagination-btn ${m===1?"active":""}" data-page="1">1</button>
  `,m>4&&(i+='<span class="page-dots">...</span>');for(let o=Math.max(2,m-2);o<=Math.min($-1,m+2);o++)i+=`
      <button class="pagination-btn ${m===o?"active":""}" data-page="${o}">${o}</button>
    `;m<$-3&&(i+='<span class="page-dots">...</span>'),i+=`
      <button class="pagination-btn ${m===$?"active":""}" data-page="${$}">${$}</button>
    `,e.innerHTML=i,e.querySelectorAll(".pagination-btn").forEach(o=>{o.addEventListener("click",()=>{const v=parseInt(o.dataset.page);D(v)})})}document.querySelector(".pagination-btn.prev-page").addEventListener("click",()=>{m>1&&D(m-1)});document.querySelector(".pagination-btn.next-page").addEventListener("click",()=>{m<$&&D(m+1)});async function q(e){var i,o;e.preventDefault();const r=document.querySelector(".search-input").value.trim();if(!r){j();return}try{const v=await u("/search/movie",{query:r,language:"en-US"});if(!(v!=null&&v.results))return;const s=document.querySelector(".weekly-movie-list");s.innerHTML="";for(const n of v.results)try{const H=(await u(`/movie/${n.id}`)).genres.map(S=>S.name).join(", "),f=JSON.parse(localStorage.getItem("library")||"[]").some(S=>S.id===n.id),p=document.createElement("li");p.className="weekly-movie-item",p.innerHTML=`
          <a href="#" class="weekly-movie-link" data-movie-id="${n.id}">
            <img
              src="${T}/w500${n.poster_path}"
              alt="${n.title}"
              class="weekly-movie-image"
            />
            <div class="movie-rating">
              <i class="fas fa-star"></i>
              <span>${n.vote_average.toFixed(1)}</span>
            </div>
            <div class="movie-year">${((i=n.release_date)==null?void 0:i.split("-")[0])||"N/A"}</div>
            <div class="weekly-movie-info">
              <h3 class="movie-title">${n.title}</h3>
              <div class="movie-meta">
                <span>${H}</span>
                <span class="movie-meta-divider">|</span>
                <span>${((o=n.release_date)==null?void 0:o.split("-")[0])||"N/A"}</span>
              </div>
            </div>
          </a>
          <button class="add-to-library ${f?"added":""}" data-movie-id="${n.id}">
            <i class="fas ${f?"fa-check":"fa-plus"}"></i>
            ${f?"Added to library":"Add to library"}
          </button>
        `;const g=p.querySelector(".add-to-library");g.addEventListener("click",async S=>{S.preventDefault(),S.stopPropagation();const y=parseInt(g.dataset.movieId),M=v.results.find(k=>k.id===y);if(!M)return;const b=await u(`/movie/${y}`),J={id:y,title:M.title,poster_path:M.poster_path,release_date:M.release_date,vote_average:M.vote_average,genres:b.genres.map(k=>k.name).join(", "),overview:M.overview};let E=JSON.parse(localStorage.getItem("library")||"[]");E.some(k=>k.id===y)?(E=E.filter(k=>k.id!==y),localStorage.setItem("library",JSON.stringify(E)),g.innerHTML='<i class="fas fa-plus"></i> Add to library',g.style.background="#ff6b01",g.disabled=!1):(E.push(J),localStorage.setItem("library",JSON.stringify(E)),g.innerHTML='<i class="fas fa-check"></i> Added to library',g.style.background="#2ecc71",g.disabled=!0)}),s.appendChild(p)}catch(c){console.error(`Error fetching details for movie ${n.id}:`,c)}document.querySelector(".pagination").style.display="none"}catch(v){console.error("Error searching movies:",v),I("Failed to search movies. Please try again later.")}}async function Z(e){try{let t;if(e?t=await u("/discover/movie",{primary_release_year:e,sort_by:"popularity.desc",language:"en-US"}):t=await u("/trending/movie/week"),!(t!=null&&t.results))return;B(t.results),document.querySelector(".pagination").style.display="none"}catch(t){console.error("Error fetching movies by year:",t),I("Failed to load movies. Please try again later.")}}const ee=()=>{const e=JSON.parse(localStorage.getItem("library")||"[]");document.querySelectorAll(".add-to-library").forEach(t=>{const r=parseInt(t.dataset.movieId);e.some(i=>i.id===r)&&(t.innerHTML='<i class="fas fa-check"></i> Added to library',t.style.background="#2ecc71",t.disabled=!0)})},te=()=>{let e;a.searchInput.addEventListener("input",t=>{clearTimeout(e),e=setTimeout(()=>{q(t.target.value)},500)}),a.yearSelect.addEventListener("change",t=>{Z(t.target.value)}),a.searchButton.addEventListener("click",()=>{q(a.searchInput.value)})},ae=()=>{a.hamburgerMenu.addEventListener("click",()=>{a.hamburgerMenu.classList.toggle("active"),a.navLinks.classList.toggle("active")}),document.addEventListener("click",e=>{!a.hamburgerMenu.contains(e.target)&&!a.navLinks.contains(e.target)&&(a.hamburgerMenu.classList.remove("active"),a.navLinks.classList.remove("active"))}),a.navLinks.querySelectorAll("a").forEach(e=>{e.addEventListener("click",()=>{a.hamburgerMenu.classList.remove("active"),a.navLinks.classList.remove("active")})})},re=()=>{V(),ae(),te(),A(),j()};document.addEventListener("DOMContentLoaded",async()=>{re(),ee(),document.querySelector(".search-button").addEventListener("click",q),document.querySelector(".search-input").addEventListener("keypress",r=>{r.key==="Enter"&&q(r)})});function oe(e,t){const r=document.querySelector(".pagination");if(!r)return;let i="";i+=`
    <button class="pagination-btn" data-page="${e-1}" ${e===1?"disabled":""}>
      <i class="fas fa-chevron-left"></i>
    </button>
  `;for(let o=1;o<=t;o++)o===1||o===t||o>=e-1&&o<=e+1?i+=`
        <button class="pagination-btn ${o===e?"active":""}" data-page="${o}">
          ${o}
        </button>
      `:(o===e-2||o===e+2)&&(i+='<span class="page-dots">...</span>');i+=`
    <button class="pagination-btn" data-page="${e+1}" ${e===t?"disabled":""}>
      <i class="fas fa-chevron-right"></i>
    </button>
  `,r.innerHTML=i}document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".pagination");e&&e.addEventListener("click",t=>{const r=t.target.closest(".pagination-btn");if(!r||r.disabled)return;const i=parseInt(r.dataset.page);isNaN(i)||A(i)})});const A=async(e=1)=>{try{const t=document.getElementById("year-select").value,r=document.getElementById("search-input").value,i=await u("/discover/movie",{page:e,year:t,query:r,language:"en-US",include_adult:!0});if(!(i!=null&&i.results)){a.movieGrid.innerHTML="<p>No movies found.</p>";return}const o=i.results.map(s=>{const n=s.poster_path?`https://image.tmdb.org/t/p/w500${s.poster_path}`:"https://via.placeholder.com/500x750?text=No+Image",c=s.release_date?s.release_date.split("-")[0]:"N/A";return`
          <div class="movie-item">
            <a href="#" class="movie-link" data-id="${s.id}">
              <div class="movie-image-container">
                <img src="${n}" alt="${s.title}" class="movie-image" />
                <div class="movie-info">
                  <h3 class="movie-title">${s.title}</h3>
                  <div class="movie-meta">
                    <span class="movie-year">${c}</span>
                    <span class="movie-meta-divider">•</span>
                    <span class="movie-rating">
                      <i class="fas fa-star"></i>
                      ${s.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        `}).join("");a.movieGrid.innerHTML=o,oe(e,Math.min(i.total_pages,500)),a.movieGrid.querySelectorAll(".movie-link").forEach(s=>{s.addEventListener("click",async n=>{n.preventDefault();const c=s.dataset.id;await O(c)})})}catch(t){console.error("Error fetching movies:",t),a.movieGrid.innerHTML="<p>Error loading movies. Please try again.</p>"}};document.addEventListener("DOMContentLoaded",()=>{A()});
//# sourceMappingURL=catalog.js.map
