import"./assets/modulepreload-polyfill-B5Qt9EMX.js";import{a as $}from"./assets/vendor-Cv0FVZ7t.js";const E="8a0658d1a6872272a1ed1ab9af543174",I="https://api.themoviedb.org/3",_=$.create({baseURL:I,headers:{"Content-Type":"application/json"},params:{api_key:E}}),t={heroContentBtn:document.querySelector(".hero-content-btn"),upcomingMovieLink:document.querySelector(".upcoming-movie-link"),weeklyMovieList:document.querySelector(".weekly-movie-list"),hero:document.querySelector(".hero"),defaultHero:document.querySelector(".default-hero"),movieHero:document.querySelector(".movie-hero"),prevButton:document.querySelector(".slider-button.prev"),nextButton:document.querySelector(".slider-button.next"),themeSwitch:document.getElementById("theme-switch"),upcomingMovieList:document.querySelector(".upcoming-movies-list"),modal:document.getElementById("movieDetailsModal"),modalCloseBtn:document.querySelector(".modal-close-btn"),videoModal:document.getElementById("videoModal"),videoFrame:document.getElementById("videoFrame"),videoModalCloseBtn:document.querySelector("#videoModal .modal-close-btn"),errorModal:document.getElementById("errorModal"),errorModalCloseBtn:document.querySelector("#errorModal .modal-close-btn"),errorMessage:document.querySelector(".error-message")};t.heroContentBtn.addEventListener("click",()=>{window.location.href="/cinemania/catalog.html"});const m=async(e,o={})=>{try{return(await _.get(e,{params:o})).data}catch(r){return console.error("Error fetching data:",r),null}},w=e=>Array(5).fill().map((o,r)=>`
      <i class="fas fa-star ${r<Math.round(e/2)?"filled":""}"></i>
    `).join(""),L=e=>new Date(e).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}),f=(e,o=2)=>(e||[]).slice(0,o).map(r=>r.name).join(", "),B=()=>{localStorage.getItem("theme")==="light"?(document.documentElement.setAttribute("data-theme","light"),t.themeSwitch.checked=!1):(document.documentElement.removeAttribute("data-theme"),t.themeSwitch.checked=!0),t.themeSwitch.addEventListener("change",()=>{t.themeSwitch.checked?(document.documentElement.removeAttribute("data-theme"),localStorage.setItem("theme","dark")):(document.documentElement.setAttribute("data-theme","light"),localStorage.setItem("theme","light"))})},q=e=>{let o=0;const r=4,s=e.results.length,n=t.weeklyMovieList.querySelector(".weekly-movie-item").offsetWidth,i=16;t.prevButton.style.display="none";const c=()=>{const l=o*(n+i);t.weeklyMovieList.style.transform=`translateX(-${l}px)`,t.prevButton.style.display=o===0?"none":"flex",t.nextButton.style.display=o>=s-r?"none":"flex"};t.prevButton.addEventListener("click",()=>{o>0&&(o--,c())}),t.nextButton.addEventListener("click",()=>{o<s-r&&(o++,c())})},D=e=>{t.videoFrame.src=`https://www.youtube.com/embed/${e}?autoplay=1`,t.videoModal.classList.add("active"),document.body.style.overflow="hidden"},k=()=>{t.videoFrame.src="",t.videoModal.classList.remove("active"),document.body.style.overflow=""};t.videoModalCloseBtn.addEventListener("click",k);t.videoModal.addEventListener("click",e=>{e.target===t.videoModal&&k()});const h=e=>{t.errorMessage.textContent=e,t.errorModal.classList.add("active"),document.body.style.overflow="hidden"},M=()=>{t.errorModal.classList.remove("active"),document.body.style.overflow=""};t.errorModalCloseBtn.addEventListener("click",M);t.errorModal.addEventListener("click",e=>{e.target===t.errorModal&&M()});const S=async(e,o)=>{const r=await m(`/movie/${e}`);t.hero.style.backgroundImage=`url(https://image.tmdb.org/t/p/original${r.backdrop_path})`;const s=[`<h1>${r.title}</h1>`,`<div class="movie-rating-stars">
      <div class="stars">${w(r.vote_average)}</div>
      <span class="rating-number">${r.vote_average.toFixed(1)}</span>
    </div>`,`<p>${r.overview.slice(0,150)}...</p>`,`<div class="hero-buttons">
      <button class="watch-trailer-btn" data-movie-id="${e}">
        <span>Watch Trailer</span>
      </button>
      <button class="more-details-btn" data-movie-id="${e}">
        <span>More Details</span>
      </button>
    </div>`];t.movieHero.innerHTML=s.join(""),t.defaultHero.style.display="none",t.movieHero.style.display="block",t.hero.scrollIntoView({behavior:"smooth"});const a=t.movieHero.querySelector(".watch-trailer-btn"),n=t.movieHero.querySelector(".more-details-btn");a&&a.addEventListener("click",async()=>{try{const c=(await m(`/movie/${e}/videos`)).results.find(l=>l.type==="Trailer"&&l.site==="YouTube");c?D(c.key):h("Sorry, trailer is not available for this movie at the moment. Please check back later.")}catch(i){console.error("Error fetching video:",i),h("Sorry, we encountered an error while loading the trailer. Please try again later.")}}),n&&n.addEventListener("click",()=>T(e))},b=e=>e?new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e):"N/A",T=async e=>{try{const o=await m(`/movie/${e}`),s=(await m(`/movie/${e}/credits`)).cast.slice(0,6),a=`
      <div class="modal-header">
        <h2 class="modal-title">${o.title}</h2>
        <div class="modal-rating">
          <div class="stars">${w(o.vote_average)}</div>
          <span>${o.vote_average.toFixed(1)}</span>
        </div>
      </div>
      <div class="modal-info">
        <div>
          <h4>Genre</h4>
          <p>${f(o.genres)}</p>
        </div>
        <div>
          <h4>Release Date</h4>
          <p>${L(o.release_date)}</p>
        </div>
        <div>
          <h4>Runtime</h4>
          <p>${o.runtime} min</p>
        </div>
        <div>
          <h4>Budget</h4>
          <p>${b(o.budget)}</p>
        </div>
        <div>
          <h4>Revenue</h4>
          <p>${b(o.revenue)}</p>
        </div>
      </div>
      <div class="modal-overview">
        <h3>Overview</h3>
        <p>${o.overview}</p>
      </div>
      <div class="modal-cast">
        <h3>Cast</h3>
        <div class="cast-list">
          ${s.map(i=>`
            <div class="cast-member">
              <img src="https://image.tmdb.org/t/p/w185${i.profile_path}" alt="${i.name}" onerror="this.src='https://via.placeholder.com/185x185?text=No+Image'">
              <div class="name">${i.name}</div>
              <div class="character">${i.character}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;t.modal.querySelector(".modal-content").innerHTML=a,t.modal.classList.add("active"),document.body.style.overflow="hidden";const n=t.modal.querySelector(".modal-close-btn");n&&n.addEventListener("click",()=>{t.modal.classList.remove("active"),document.body.style.overflow=""}),t.modal.addEventListener("click",i=>{i.target===t.modal&&(t.modal.classList.remove("active"),document.body.style.overflow="")})}catch(o){console.error("Error showing movie details:",o),h("Failed to load movie details. Please try again later.")}},A=async()=>{try{const e=await m("/trending/movie/week");if(!(e!=null&&e.results))return;const o=e.results.map(async s=>{const a=await m(`/movie/${s.id}`),n=f(a==null?void 0:a.genres),i=new Date(s.release_date).getFullYear(),l=JSON.parse(localStorage.getItem("library")||"[]").some(u=>u.id===s.id);return`
          <li class="weekly-movie-item" data-movie-id="${s.id}">
            <a class="weekly-movie-link" href="#">
              <img class="weekly-movie-image" src="https://image.tmdb.org/t/p/w500${s.poster_path}" alt="${s.title}">
              <div class="movie-rating">
                <i class="fas fa-star"></i>
                <span>${s.vote_average.toFixed(1)}</span>
              </div>
              <div class="weekly-movie-info">
                <h3 class="movie-title">${s.title}</h3>
                <div class="movie-meta">
                  ${n} <span class="movie-meta-divider">|</span> ${i}
                </div>
              </div>
            </a>
            <button class="add-to-library ${l?"added":""}" data-movie-id="${s.id}">
              <i class="fas ${l?"fa-check":"fa-plus"}"></i>
              ${l?"Added to library":"Add to library"}
            </button>
          </li>
        `}),r=await Promise.all(o);t.weeklyMovieList.innerHTML=r.join(""),q(e),t.weeklyMovieList.addEventListener("click",async s=>{const a=s.target.closest(".add-to-library");if(a){s.preventDefault(),s.stopPropagation();const i=parseInt(a.dataset.movieId),c=e.results.find(d=>d.id===i);if(!c)return;const l=await m(`/movie/${i}`),u={id:i,title:c.title,poster_path:c.poster_path,release_date:c.release_date,vote_average:c.vote_average,genres:l.genres.map(d=>d.name).join(", "),overview:c.overview};let v=JSON.parse(localStorage.getItem("library")||"[]");v.some(d=>d.id===i)?(v=v.filter(d=>d.id!==i),localStorage.setItem("library",JSON.stringify(v)),a.innerHTML='<i class="fas fa-plus"></i> Add to library',a.style.background="#ff6b01",a.disabled=!1):(v.push(u),localStorage.setItem("library",JSON.stringify(v)),a.innerHTML='<i class="fas fa-check"></i> Added to library',a.style.background="#2ecc71",a.disabled=!0);return}const n=s.target.closest(".weekly-movie-item");if(n){s.preventDefault();const i=parseInt(n.dataset.movieId);if(!e.results.find(l=>l.id===i))return;await S(i,e)}})}catch(e){console.error("Error rendering weekly movies:",e)}},H=async()=>{try{const e=await m("/movie/upcoming");if(!(e!=null&&e.results)){t.upcomingMovieList.innerHTML="<p>No upcoming movies available.</p>";return}const o=e.results.filter(a=>a.backdrop_path&&a.poster_path).sort((a,n)=>n.popularity-a.popularity).slice(0,5);if(o.length===0){t.upcomingMovieList.innerHTML="<p>No upcoming movies with images available.</p>";return}const r=o.map(async a=>{const n=await m(`/movie/${a.id}`),i=f(n==null?void 0:n.genres,3),l=JSON.parse(localStorage.getItem("library")||"[]").some(u=>u.id===a.id);return`
        <li class="upcoming-movie-item">
          <a class="upcoming-movie-link" href="#">
            <div class="upcoming-movie-image-container">
              <img class="upcoming-movie-image" src="https://image.tmdb.org/t/p/w1280${a.backdrop_path}" alt="${a.title}">
            </div>
            <div class="upcoming-movie-info">
              <h3 class="movie-title">${a.title}</h3>
              <div class="info-section">
                <div class="info-row">
                  <span class="info-label">Release Date</span>
                  <span class="info-value-date">${L(a.release_date)}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Rating</span>
                  <span class="info-value-rating">
                    ${a.vote_average.toFixed(1)} / ${a.vote_count.toLocaleString()} votes
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Popularity</span>
                  <span class="info-value-popularity">${Math.round(a.popularity).toLocaleString()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Genre</span>
                  <span class="info-value-genre">${i}</span>
                </div>
              </div>
              <div class="movie-about">
                <h4 class="about-label">ABOUT</h4>
                <p class="about-text">${a.overview}</p>
              </div>
              <button class="add-to-library ${l?"added":""}" data-movie-id="${a.id}">
                <i class="fas ${l?"fa-check":"fa-plus"}"></i>
                ${l?"Added to library":"Add to my library"}
              </button>
            </div>
          </a>
        </li>
      `}),s=await Promise.all(r);t.upcomingMovieList.innerHTML=s.join(""),t.upcomingMovieList.addEventListener("click",async a=>{const n=a.target.closest(".add-to-library");if(n){a.preventDefault();const c=parseInt(n.dataset.movieId),l=o.find(d=>d.id===c);if(!l)return;const u=await m(`/movie/${c}`),v={id:c,title:l.title,poster_path:l.poster_path,release_date:l.release_date,vote_average:l.vote_average,genres:u.genres.map(d=>d.name).join(", "),overview:l.overview};n.innerHTML='<i class="fas fa-check"></i> Added to library',n.style.background="#2ecc71",n.disabled=!0;let g=JSON.parse(localStorage.getItem("library")||"[]");g.some(d=>d.id===c)||(g.push(v),localStorage.setItem("library",JSON.stringify(g)));return}const i=a.target.closest(".upcoming-movie-item");if(i){a.preventDefault();const c=parseInt(i.querySelector(".add-to-library").dataset.movieId);S(c,e)}})}catch(e){console.error("Error rendering upcoming movies:",e),t.upcomingMovieList.innerHTML="<p>Error loading upcoming movies. Please try again later.</p>"}};window.addEventListener("message",e=>{if(e.data.type==="removeFromLibrary"){const o=document.querySelector(`.weekly-movie-item [data-movie-id="${e.data.movieId}"]`);o&&(o.innerHTML='<i class="fas fa-plus"></i> Add to library',o.style.background="#ff6b01",o.disabled=!1);const r=document.querySelector(`#movieDetailsModal [data-movie-id="${e.data.movieId}"]`);r&&(r.innerHTML='<i class="fas fa-plus"></i> Add to library',r.style.background="#ff6b01",r.disabled=!1)}});const p=document.querySelector(".hamburger-menu"),y=document.querySelector(".nav-links");p.addEventListener("click",()=>{p.classList.toggle("active"),y.classList.toggle("active")});document.addEventListener("click",e=>{!p.contains(e.target)&&!y.contains(e.target)&&(p.classList.remove("active"),y.classList.remove("active"))});y.querySelectorAll("a").forEach(e=>{e.addEventListener("click",()=>{p.classList.remove("active"),y.classList.remove("active")})});document.addEventListener("DOMContentLoaded",()=>{B(),A(),H()});
//# sourceMappingURL=index.js.map
