import"./assets/modulepreload-polyfill-B5Qt9EMX.js";import{a as L}from"./assets/vendor-Cv0FVZ7t.js";const S="8a0658d1a6872272a1ed1ab9af543174",w="https://api.themoviedb.org/3",k=L.create({baseURL:w,headers:{"Content-Type":"application/json"},params:{api_key:S}}),e={emptyLibrary:document.querySelector(".empty-library"),themeSwitch:document.getElementById("theme-switch"),libraryList:document.querySelector(".added-library-list"),hero:document.querySelector(".hero"),defaultHero:document.querySelector(".default-hero"),movieHero:document.querySelector(".movie-hero"),videoModal:document.getElementById("videoModal"),videoFrame:document.getElementById("videoFrame"),videoModalCloseBtn:document.querySelector("#videoModal .modal-close-btn"),errorModal:document.getElementById("errorModal"),errorModalCloseBtn:document.querySelector("#errorModal .modal-close-btn"),errorMessage:document.querySelector(".error-message"),movieDetailsModal:document.getElementById("movieDetailsModal"),movieDetailsModalCloseBtn:document.querySelector("#movieDetailsModal .modal-close-btn"),genreSelect:document.querySelector(".genre-select"),loadMoreBtn:document.querySelector(".load-more-btn"),hamburgerMenu:document.querySelector(".hamburger-menu"),navLinks:document.querySelector(".nav-links")},m=async(t,r={})=>{try{return(await k.get(t,{params:r})).data}catch(a){return console.error("Error fetching data:",a),null}},E=t=>{const r=Math.floor(t/2),a=t%2>=1;return Array(5).fill().map((o,s)=>s<r?'<i class="fas fa-star"></i>':s===r&&a?'<i class="fas fa-star-half-alt"></i>':'<i class="fas fa-star empty"></i>').join("")},$=t=>'<i class="fas fa-star"></i>',I=()=>{try{localStorage.getItem("theme")==="light"?(document.documentElement.setAttribute("data-theme","light"),e.themeSwitch.checked=!1):(document.documentElement.removeAttribute("data-theme"),e.themeSwitch.checked=!0),e.themeSwitch.addEventListener("change",()=>{e.themeSwitch.checked?(document.documentElement.removeAttribute("data-theme"),localStorage.setItem("theme","dark")):(document.documentElement.setAttribute("data-theme","light"),localStorage.setItem("theme","light"))})}catch(t){console.error("Error initializing theme:",t)}};let c=1;const h=15;let f=[],y=[];const u=(t="")=>{const r=JSON.parse(localStorage.getItem("library")||"[]");if(r.length===0){e.libraryList.innerHTML="",e.loadMoreBtn.style.display="none",e.emptyLibrary.style.display="flex";return}if(t!==e.genreSelect.dataset.currentGenre&&(c=1,e.genreSelect.dataset.currentGenre=t,e.libraryList.innerHTML=""),y=t?r.filter(i=>i.genres&&i.genres.includes(t)):r,y.length===0){e.libraryList.innerHTML="",e.loadMoreBtn.style.display="none",e.emptyLibrary.style.display="flex";return}e.emptyLibrary.style.display="none";const a=(c-1)*h,o=a+h;f=y.slice(a,o),e.loadMoreBtn.style.display=o>=y.length?"none":"block";const s=f.map(i=>{var n,d;return`
    <li class="weekly-movie-item">
      <a href="#" class="weekly-movie-link" data-movie-id="${i.id}">
        <img
          src="https://image.tmdb.org/t/p/w500${i.poster_path}"
          alt="${i.title}"
          class="weekly-movie-image"
          onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'"
        />
        <div class="movie-rating">
          ${$(i.vote_average)}
          <span>${i.vote_average.toFixed(1)}</span>
        </div>
        <div class="movie-year">${((n=i.release_date)==null?void 0:n.split("-")[0])||"N/A"}</div>
        <div class="weekly-movie-info">
          <h3 class="movie-title">${i.title}</h3>
          <div class="movie-meta">
            <span>${((d=i.release_date)==null?void 0:d.split("-")[0])||"N/A"}</span>
            <span class="movie-meta-divider">•</span>
            <span>${i.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </a>
      <button class="remove-from-library" data-movie-id="${i.id}">
        <i class="fas fa-trash"></i>
      </button>
    </li>
  `}).join("");c===1?e.libraryList.innerHTML=s:e.libraryList.insertAdjacentHTML("beforeend",s),D()},D=()=>{document.querySelectorAll(".weekly-movie-link").forEach(t=>{t.addEventListener("click",async r=>{r.preventDefault();const a=t.dataset.movieId,o=await m(`/movie/${a}`);e.hero.style.backgroundImage=`url(https://image.tmdb.org/t/p/original${o.backdrop_path})`;const s=[`<h1>${o.title}</h1>`,`<div class="movie-rating-stars">
          <div class="stars">${E(o.vote_average)}</div>
          <span class="rating-number">${o.vote_average.toFixed(1)}</span>
        </div>`,`<p>${o.overview.slice(0,150)}...</p>`,`<div class="hero-buttons">
          <button class="watch-trailer-btn" data-movie-id="${a}">
            <span>Watch Trailer</span>
          </button>
          <button class="more-details-btn" data-movie-id="${a}">
            <span>More Details</span>
          </button>
        </div>`];e.movieHero.innerHTML=s.join(""),e.defaultHero.style.display="none",e.movieHero.style.display="block",e.hero.scrollIntoView({behavior:"smooth"});const i=e.movieHero.querySelector(".watch-trailer-btn"),n=e.movieHero.querySelector(".more-details-btn");i&&i.addEventListener("click",async()=>{try{const v=(await m(`/movie/${a}/videos`)).results.find(l=>l.type==="Trailer"&&l.site==="YouTube");v?T(v.key):g("Sorry, trailer is not available for this movie at the moment. Please check back later.")}catch(d){console.error("Error fetching video:",d),g("Sorry, we encountered an error while loading the trailer. Please try again later.")}}),n&&n.addEventListener("click",()=>A(a))})}),document.querySelectorAll(".remove-from-library").forEach(t=>{t.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation();const a=t.dataset.movieId;B(a)})})},q=()=>{c++;const t=e.genreSelect.value;u(t)},B=t=>{let r=JSON.parse(localStorage.getItem("library")||"[]");r=r.filter(s=>s.id!==parseInt(t)),localStorage.setItem("library",JSON.stringify(r));const a=document.querySelector(`.weekly-movie-item:has([data-movie-id="${t}"])`);a&&a.remove(),r.length===0&&(e.libraryList.innerHTML="",e.loadMoreBtn.style.display="none",e.emptyLibrary.style.display="flex"),window.postMessage({type:"removeFromLibrary",movieId:parseInt(t)},"*");const o=document.querySelector(`[data-movie-id="${t}"]`);o&&(o.innerHTML='<i class="fas fa-plus"></i> Add to library',o.style.background="#ff6b01",o.disabled=!1)},H=async()=>{const t=JSON.parse(localStorage.getItem("library")||"[]");let r=!1;for(let a of t)if(!a.genres){const o=await m(`/movie/${a.id}`);o&&o.genres&&(a.genres=o.genres.map(s=>s.name),r=!0)}r&&localStorage.setItem("library",JSON.stringify(t))},T=t=>{e.videoFrame.src=`https://www.youtube.com/embed/${t}?autoplay=1`,e.videoModal.classList.add("active"),document.body.style.overflow="hidden"},p=()=>{e.videoFrame.src="",e.videoModal.classList.remove("active"),document.body.style.overflow=""},g=t=>{e.errorMessage.textContent=t,e.errorModal.classList.add("active"),document.body.style.overflow="hidden"},b=()=>{e.errorModal.classList.remove("active"),document.body.style.overflow=""},A=async t=>{var r,a;try{const o=await m(`/movie/${t}`),s=await m(`/movie/${t}/credits`),i=o.genres.map(l=>l.name).join(", "),n=((r=s.crew.find(l=>l.job==="Director"))==null?void 0:r.name)||"N/A",d=s.cast.slice(0,5).map(l=>l.name).join(", "),v=`
      <div class="movie-details-content">
        <div class="movie-details-header">
          <img src="https://image.tmdb.org/t/p/w500${o.poster_path}" alt="${o.title}" class="movie-details-poster">
          <div class="movie-details-info">
            <h2>${o.title}</h2>
            <div class="movie-details-meta">
              <span>${((a=o.release_date)==null?void 0:a.split("-")[0])||"N/A"}</span>
              <span class="movie-meta-divider">•</span>
              <span>${o.vote_average.toFixed(1)}</span>
            </div>
            <div class="movie-details-genres">${i}</div>
            <div class="movie-details-overview">${o.overview}</div>
            <div class="movie-details-cast">
              <strong>Director:</strong> ${n}
              <br>
              <strong>Cast:</strong> ${d}
            </div>
          </div>
        </div>
      </div>
    `;e.movieDetailsModal.querySelector(".modal-content").innerHTML=v,e.movieDetailsModal.classList.add("active"),document.body.style.overflow="hidden"}catch(o){console.error("Error fetching movie details:",o),g("Sorry, we encountered an error while loading the movie details. Please try again later.")}},M=()=>{e.movieDetailsModal.classList.remove("active"),document.body.style.overflow=""},_=()=>{e.hamburgerMenu.addEventListener("click",()=>{e.hamburgerMenu.classList.toggle("active"),e.navLinks.classList.toggle("active")}),document.addEventListener("click",t=>{!e.hamburgerMenu.contains(t.target)&&!e.navLinks.contains(t.target)&&(e.hamburgerMenu.classList.remove("active"),e.navLinks.classList.remove("active"))}),e.navLinks.querySelectorAll("a").forEach(t=>{t.addEventListener("click",()=>{e.hamburgerMenu.classList.remove("active"),e.navLinks.classList.remove("active")})})};_();document.addEventListener("DOMContentLoaded",async()=>{I(),await H(),u(),e.genreSelect.addEventListener("change",t=>{c=1,u(t.target.value)}),e.loadMoreBtn.addEventListener("click",q),e.videoModalCloseBtn.addEventListener("click",p),e.videoModal.addEventListener("click",t=>{t.target===e.videoModal&&p()}),e.errorModalCloseBtn.addEventListener("click",b),e.errorModal.addEventListener("click",t=>{t.target===e.errorModal&&b()}),e.movieDetailsModalCloseBtn.addEventListener("click",M),e.movieDetailsModal.addEventListener("click",t=>{t.target===e.movieDetailsModal&&M()})});window.addEventListener("message",t=>{if(t.data.type==="removeFromLibrary"){const r=document.querySelector(`.weekly-movie-item [data-movie-id="${t.data.movieId}"]`);r&&(r.innerHTML='<i class="fas fa-plus"></i> Add to library',r.style.background="#ff6b01",r.disabled=!1);const a=document.querySelector(`#movieDetailsModal [data-movie-id="${t.data.movieId}"]`);a&&(a.innerHTML='<i class="fas fa-plus"></i> Add to library',a.style.background="#ff6b01",a.disabled=!1)}});
//# sourceMappingURL=library.js.map
