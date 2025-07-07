import axios from 'axios';

const API_KEY = '8a0658d1a6872272a1ed1ab9af543174';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// API configuration
const apiBaseUrl = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    api_key: API_KEY,
  },
});

const domElements = {
  weeklyMovieList: document.querySelector('.weekly-movie-list'),
  hero: document.querySelector('.hero'),
  defaultHero: document.querySelector('.default-hero'),
  movieHero: document.querySelector('.movie-hero'),
  prevButton: document.querySelector('.slider-button.prev'),
  nextButton: document.querySelector('.slider-button.next'),
  themeSwitch: document.getElementById('theme-switch'),
  modal: document.getElementById('movieDetailsModal'),
  modalCloseBtn: document.querySelector('.modal-close-btn'),
  videoModal: document.getElementById('videoModal'),
  videoFrame: document.getElementById('videoFrame'),
  videoModalCloseBtn: document.querySelector('#videoModal .modal-close-btn'),
  errorModal: document.getElementById('errorModal'),
  errorModalCloseBtn: document.querySelector('#errorModal .modal-close-btn'),
  errorMessage: document.querySelector('.error-message'),
  movieGrid: document.querySelector('.movie-grid'),
  catalogList: document.querySelector('.catalog-list'),
  genreSelect: document.querySelector('.genre-select'),
  loadMoreBtn: document.querySelector('.load-more-btn'),
  hamburgerMenu: document.querySelector('.hamburger-menu'),
  navLinks: document.querySelector('.nav-links'),
  searchInput: document.querySelector('.search-input'),
  yearSelect: document.querySelector('.year-select'),
  searchButton: document.querySelector('.search-button'),
  weeklyTrendsList: document.querySelector('.weekly-trends-list'),
  upcomingMoviesList: document.querySelector('.upcoming-movies-list'),
  movieDetailsModal: document.getElementById('movieDetailsModal'),
  movieDetailsModalCloseBtn: document.querySelector(
    '#movieDetailsModal .modal-close-btn'
  ),
};

// Utility functions
const fetchData = async (endpoint, params = {}) => {
  try {
    const response = await apiBaseUrl.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const createStarRating = rating => {
  return Array(5)
    .fill()
    .map(
      (_, index) => `
      <i class="fas fa-star ${
        index < Math.round(rating / 2) ? 'filled' : ''
      }"></i>
    `
    )
    .join('');
};

const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getGenreNames = (genres, limit = 2) => {
  return (genres || [])
    .slice(0, limit)
    .map(g => g.name)
    .join(', ');
};

// Theme handling
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    domElements.themeSwitch.checked = false;
  } else {
    document.documentElement.removeAttribute('data-theme');
    domElements.themeSwitch.checked = true;
  }

  domElements.themeSwitch.addEventListener('change', () => {
    if (domElements.themeSwitch.checked) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
};

// Slider functionality
const initSlider = data => {
  let currentSlide = 0;
  const slidesPerView = 4;
  const totalSlides = data.results.length;
  const movieItem =
    domElements.weeklyMovieList.querySelector('.weekly-movie-item');
  const itemWidth = movieItem.offsetWidth;
  const gap = 16;

  domElements.prevButton.style.display = 'none';

  const updateSliderPosition = () => {
    const offset = currentSlide * (itemWidth + gap);
    domElements.weeklyMovieList.style.transform = `translateX(-${offset}px)`;
    domElements.prevButton.style.display = currentSlide === 0 ? 'none' : 'flex';
    domElements.nextButton.style.display =
      currentSlide >= totalSlides - slidesPerView ? 'none' : 'flex';
  };

  domElements.prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateSliderPosition();
    }
  });

  domElements.nextButton.addEventListener('click', () => {
    if (currentSlide < totalSlides - slidesPerView) {
      currentSlide++;
      updateSliderPosition();
    }
  });
};

// Show video modal
const showVideoModal = videoId => {
  domElements.videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  domElements.videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Close video modal
const closeVideoModal = () => {
  domElements.videoFrame.src = '';
  domElements.videoModal.classList.remove('active');
  document.body.style.overflow = '';
};

// Event listeners for video modal
domElements.videoModalCloseBtn.addEventListener('click', closeVideoModal);
domElements.videoModal.addEventListener('click', e => {
  if (e.target === domElements.videoModal) {
    closeVideoModal();
  }
});

// Show error modal
const showErrorModal = message => {
  domElements.errorMessage.textContent = message;
  domElements.errorModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Close error modal
const closeErrorModal = () => {
  domElements.errorModal.classList.remove('active');
  document.body.style.overflow = '';
};

// Event listeners for error modal
domElements.errorModalCloseBtn.addEventListener('click', closeErrorModal);
domElements.errorModal.addEventListener('click', e => {
  if (e.target === domElements.errorModal) {
    closeErrorModal();
  }
});

// Movie click handler
const handleMovieClick = async (movieId, data) => {
  const movieDetails = await fetchData(`/movie/${movieId}`);

  domElements.hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`;

  const contentElements = [
    `<h1>${movieDetails.title}</h1>`,
    `<div class="movie-rating-stars">
      <div class="stars">${createStarRating(movieDetails.vote_average)}</div>
      <span class="rating-number">${movieDetails.vote_average.toFixed(1)}</span>
    </div>`,
    `<p>${movieDetails.overview.slice(0, 150)}...</p>`,
    `<div class="hero-buttons">
      <button class="watch-trailer-btn" data-movie-id="${movieId}">
        <span>Watch Trailer</span>
      </button>
      <button class="more-details-btn" data-movie-id="${movieId}">
        <span>More Details</span>
      </button>
    </div>`,
  ];

  domElements.movieHero.innerHTML = contentElements.join('');
  domElements.defaultHero.style.display = 'none';
  domElements.movieHero.style.display = 'block';
  domElements.hero.scrollIntoView({ behavior: 'smooth' });

  // Add click event listeners for buttons
  const watchTrailerBtn =
    domElements.movieHero.querySelector('.watch-trailer-btn');
  const moreDetailsBtn =
    domElements.movieHero.querySelector('.more-details-btn');

  watchTrailerBtn.addEventListener('click', async () => {
    try {
      const videos = await fetchData(`/movie/${movieId}/videos`);
      const trailer = videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );

      if (trailer) {
        showVideoModal(trailer.key);
      } else {
        showErrorModal(
          'Sorry, trailer is not available for this movie at the moment. Please check back later.'
        );
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      showErrorModal(
        'Sorry, we encountered an error while loading the trailer. Please try again later.'
      );
    }
  });

  moreDetailsBtn.addEventListener('click', () =>
    showMovieDetails(movieDetails)
  );
};

// Format currency
const formatCurrency = amount => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format runtime
const formatRuntime = minutes => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

// Show movie details in modal
const showMovieDetails = async movieId => {
  try {
    const [movieDetails, credits] = await Promise.all([
      fetchData(`/movie/${movieId}`),
      fetchData(`/movie/${movieId}/credits`),
    ]);

    // Update modal content
    domElements.modal.querySelector('.modal-title').textContent =
      movieDetails.title;
    domElements.modal.querySelector('.modal-rating').innerHTML = `
      <div class="stars">${createStarRating(movieDetails.vote_average)}</div>
      <span>${movieDetails.vote_average.toFixed(1)}</span>
    `;

    // Update movie info
    domElements.modal.querySelector('.modal-genres').innerHTML = `
      <h4>Genres</h4>
      <p>${movieDetails.genres.map(g => g.name).join(', ')}</p>
    `;
    domElements.modal.querySelector('.modal-release-date').innerHTML = `
      <h4>Release Date</h4>
      <p>${formatDate(movieDetails.release_date)}</p>
    `;
    domElements.modal.querySelector('.modal-runtime').innerHTML = `
      <h4>Runtime</h4>
      <p>${formatRuntime(movieDetails.runtime)}</p>
    `;
    domElements.modal.querySelector('.modal-budget').innerHTML = `
      <h4>Budget</h4>
      <p>${formatCurrency(movieDetails.budget)}</p>
    `;
    domElements.modal.querySelector('.modal-revenue').innerHTML = `
      <h4>Revenue</h4>
      <p>${formatCurrency(movieDetails.revenue)}</p>
    `;

    // Update overview
    domElements.modal.querySelector('.modal-overview p').textContent =
      movieDetails.overview;

    // Update cast
    const castList = domElements.modal.querySelector('.cast-list');
    castList.innerHTML = credits.cast
      .slice(0, 6)
      .map(
        actor => `
        <div class="cast-member">
          <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" alt="${actor.name}">
          <div class="name">${actor.name}</div>
          <div class="character">${actor.character}</div>
        </div>
      `
      )
      .join('');

    // Show modal
    domElements.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
};

// Close modal
const closeModal = () => {
  domElements.modal.classList.remove('active');
  document.body.style.overflow = '';
};

// Event listeners for modal
domElements.modalCloseBtn.addEventListener('click', closeModal);
domElements.modal.addEventListener('click', e => {
  if (e.target === domElements.modal) {
    closeModal();
  }
});

// Hero bölümünü film detaylarıyla güncelle
async function updateHeroWithMovie(movie) {
  const heroContent = document.querySelector('.hero-content.movie-hero');
  const hero = document.querySelector('.hero');

  // Hero background'ını güncelle
  hero.style.backgroundImage = `url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`;

  // Hero içeriğini güncelle
  heroContent.innerHTML = `
    <h1>${movie.title}</h1>
    <div class="movie-rating-stars">
      <div class="stars">${createStarRating(movie.vote_average)}</div>
      <span class="rating-number">${movie.vote_average.toFixed(1)}</span>
    </div>
    <p>${movie.overview.slice(0, 150)}...</p>
    <div class="hero-buttons">
      <button class="watch-trailer-btn" data-movie-id="${movie.id}">
        <span>Watch Trailer</span>
      </button>
      <button class="more-details-btn" data-movie-id="${movie.id}">
        <span>More Details</span>
      </button>
    </div>
  `;

  // Hero'yu göster
  heroContent.style.display = 'block';

  // Butonlara event listener'ları ekle
  const watchTrailerBtn = heroContent.querySelector('.watch-trailer-btn');
  const moreDetailsBtn = heroContent.querySelector('.more-details-btn');

  watchTrailerBtn.addEventListener('click', async () => {
    try {
      const videos = await fetchData(`/movie/${movie.id}/videos`);
      const trailer = videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );

      if (trailer) {
        showVideoModal(trailer.key);
      } else {
        showErrorModal(
          'Sorry, trailer is not available for this movie at the moment. Please check back later.'
        );
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      showErrorModal(
        'Sorry, we encountered an error while loading the trailer. Please try again later.'
      );
    }
  });

  moreDetailsBtn.addEventListener('click', () => showMovieDetails(movie.id));
}

// Otomatik hero değişimi için değişkenler
let currentMovieIndex = 0;
let trendingMovies = [];
let heroInterval;

// Hero'yu otomatik olarak güncelle
function startHeroAutoSlide(movies) {
  trendingMovies = movies;
  currentMovieIndex = Math.floor(Math.random() * movies.length);

  // İlk filmi göster
  updateHeroWithMovie(trendingMovies[currentMovieIndex]);

  // Navigasyon butonlarına event listener'ları ekle
  const prevBtn = document.querySelector('.hero-nav-btn.prev-movie');
  const nextBtn = document.querySelector('.hero-nav-btn.next-movie');

  prevBtn.addEventListener('click', () => {
    // Otomatik geçişi sıfırla
    clearInterval(heroInterval);

    // Önceki filme geç
    currentMovieIndex =
      (currentMovieIndex - 1 + trendingMovies.length) % trendingMovies.length;
    updateHeroWithMovie(trendingMovies[currentMovieIndex]);

    // Otomatik geçişi yeniden başlat
    heroInterval = setInterval(() => {
      currentMovieIndex = (currentMovieIndex + 1) % trendingMovies.length;
      updateHeroWithMovie(trendingMovies[currentMovieIndex]);
    }, 5000);
  });

  nextBtn.addEventListener('click', () => {
    // Otomatik geçişi sıfırla
    clearInterval(heroInterval);

    // Sonraki filme geç
    currentMovieIndex = (currentMovieIndex + 1) % trendingMovies.length;
    updateHeroWithMovie(trendingMovies[currentMovieIndex]);

    // Otomatik geçişi yeniden başlat
    heroInterval = setInterval(() => {
      currentMovieIndex = (currentMovieIndex + 1) % trendingMovies.length;
      updateHeroWithMovie(trendingMovies[currentMovieIndex]);
    }, 5000);
  });

  // Her 5 saniyede bir filmi değiştir
  heroInterval = setInterval(() => {
    currentMovieIndex = (currentMovieIndex + 1) % trendingMovies.length;
    updateHeroWithMovie(trendingMovies[currentMovieIndex]);
  }, 5000);
}

// Weekly trending filmleri göster
async function displayWeeklyTrendingMovies(movies) {
  const weeklyMovieList = document.querySelector('.weekly-movie-list');
  weeklyMovieList.innerHTML = '';

  for (const movie of movies) {
    try {
      // Get movie details to fetch genres
      const movieDetails = await fetchData(`/movie/${movie.id}`);
      const genreNames = movieDetails.genres.map(g => g.name).join(', ');

      // Check if movie is in library
      const library = JSON.parse(localStorage.getItem('library') || '[]');
      const isInLibrary = library.some(m => m.id === movie.id);

      const movieItem = document.createElement('li');
      movieItem.className = 'weekly-movie-item';
      movieItem.innerHTML = `
        <a href="#" class="weekly-movie-link" data-movie-id="${movie.id}">
          <img
            src="${IMAGE_BASE_URL}/w500${movie.poster_path}"
            alt="${movie.title}"
            class="weekly-movie-image"
          />
          <div class="movie-rating">
            <i class="fas fa-star"></i>
            <span>${movie.vote_average.toFixed(1)}</span>
          </div>
          <div class="movie-year">${movie.release_date.split('-')[0]}</div>
          <div class="weekly-movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
              <span>${genreNames}</span>
              <span class="movie-meta-divider">|</span>
              <span>${movie.release_date.split('-')[0]}</span>
            </div>
          </div>
        </a>
        <button class="add-to-library ${
          isInLibrary ? 'added' : ''
        }" data-movie-id="${movie.id}">
          <i class="fas ${isInLibrary ? 'fa-check' : 'fa-plus'}"></i>
          ${isInLibrary ? 'Added to library' : 'Add to library'}
        </button>
      `;

      // Add to Library butonuna tıklama olayı ekle
      const addToLibraryBtn = movieItem.querySelector('.add-to-library');
      addToLibraryBtn.addEventListener('click', async e => {
        e.preventDefault();
        e.stopPropagation();

        const movieId = parseInt(addToLibraryBtn.dataset.movieId);
        const movie = movies.find(m => m.id === movieId);
        if (!movie) return;

        // Get movie details for complete data
        const movieDetails = await fetchData(`/movie/${movieId}`);

        // Get movie data with consistent format
        const movieData = {
          id: movieId,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          genres: movieDetails.genres.map(g => g.name).join(', '),
          overview: movie.overview,
        };

        // Check if movie is in library
        let library = JSON.parse(localStorage.getItem('library') || '[]');
        const isInLibrary = library.some(m => m.id === movieId);

        if (isInLibrary) {
          // Remove from library
          library = library.filter(m => m.id !== movieId);
          localStorage.setItem('library', JSON.stringify(library));
          addToLibraryBtn.innerHTML =
            '<i class="fas fa-plus"></i> Add to library';
          addToLibraryBtn.style.background = '#ff6b01';
          addToLibraryBtn.disabled = false;
        } else {
          // Add to library
          library.push(movieData);
          localStorage.setItem('library', JSON.stringify(library));
          addToLibraryBtn.innerHTML =
            '<i class="fas fa-check"></i> Added to library';
          addToLibraryBtn.style.background = '#2ecc71';
          addToLibraryBtn.disabled = true;
        }
      });

      // Film kartına tıklama olayı ekle
      const movieLink = movieItem.querySelector('.weekly-movie-link');
      movieLink.addEventListener('click', async e => {
        e.preventDefault();

        // Otomatik geçişi durdur
        clearInterval(heroInterval);

        // Hero'yu güncelle
        updateHeroWithMovie(movie);

        // Sayfayı hero bölümüne kaydır
        document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });

        // Otomatik geçişi yeniden başlat
        heroInterval = setInterval(() => {
          currentMovieIndex = (currentMovieIndex + 1) % trendingMovies.length;
          updateHeroWithMovie(trendingMovies[currentMovieIndex]);
        }, 5000);
      });

      weeklyMovieList.appendChild(movieItem);
    } catch (error) {
      console.error(`Error fetching details for movie ${movie.id}:`, error);
    }
  }
}

// Fetch weekly trending movies
async function fetchWeeklyTrendingMovies() {
  try {
    const data = await fetchData('/trending/movie/week');
    if (!data?.results) return;

    // Weekly filmleri göster
    displayWeeklyTrendingMovies(data.results);

    // Otomatik hero değişimini başlat
    startHeroAutoSlide(data.results);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    showErrorModal('Failed to load trending movies. Please try again later.');
  }
}

// Pagination için değişkenler
let currentPage = 1;
let totalPages = 27;
let isLoading = false;

// Sayfa numarasına tıklandığında filmleri getir
async function handlePageClick(pageNumber) {
  if (isLoading || pageNumber === currentPage) return;

  try {
    isLoading = true;
    const data = await fetchData('/trending/movie/week', {
      page: pageNumber,
      language: 'en-US',
    });

    if (!data?.results) return;

    // Filmleri göster
    displayWeeklyTrendingMovies(data.results);

    // Aktif sayfayı güncelle
    currentPage = pageNumber;
    updatePaginationUI();

    // Sayfayı yukarı kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error fetching page:', error);
    showErrorModal('Failed to load movies. Please try again later.');
  } finally {
    isLoading = false;
  }
}

// Pagination UI'ı güncelle
function updatePaginationUI() {
  const pageNumbers = document.querySelector('.page-numbers');
  const prevBtn = document.querySelector('.pagination-btn.prev-page');
  const nextBtn = document.querySelector('.pagination-btn.next-page');

  // Önceki/Sonraki butonlarını güncelle
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Sayfa numaralarını güncelle
  let pageButtons = '';

  // İlk sayfa
  pageButtons += `
    <button class="pagination-btn ${
      currentPage === 1 ? 'active' : ''
    }" data-page="1">1</button>
  `;

  // Sol taraf noktaları
  if (currentPage > 4) {
    pageButtons += '<span class="page-dots">...</span>';
  }

  // Aktif sayfanın etrafındaki sayfalar
  for (
    let i = Math.max(2, currentPage - 2);
    i <= Math.min(totalPages - 1, currentPage + 2);
    i++
  ) {
    pageButtons += `
      <button class="pagination-btn ${
        currentPage === i ? 'active' : ''
      }" data-page="${i}">${i}</button>
    `;
  }

  // Sağ taraf noktaları
  if (currentPage < totalPages - 3) {
    pageButtons += '<span class="page-dots">...</span>';
  }

  // Son sayfa
  if (totalPages > 1) {
    pageButtons += `
      <button class="pagination-btn ${
        currentPage === totalPages ? 'active' : ''
      }" data-page="${totalPages}">${totalPages}</button>
    `;
  }

  pageNumbers.innerHTML = pageButtons;

  // Sayfa butonlarına tıklama olayı ekle
  pageNumbers.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      handlePageClick(page);
    });
  });
}

// Önceki/Sonraki butonlarına tıklama olayı ekle
document
  .querySelector('.pagination-btn.prev-page')
  .addEventListener('click', () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  });

document
  .querySelector('.pagination-btn.next-page')
  .addEventListener('click', () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  });

// Arama fonksiyonu
async function handleSearch(e) {
  e.preventDefault();
  const searchInput = document.querySelector('.search-input');
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    // Arama boşsa normal filmleri göster
    fetchWeeklyTrendingMovies();
    return;
  }

  try {
    const data = await fetchData('/search/movie', {
      query: searchTerm,
      language: 'en-US',
    });

    if (!data?.results) return;

    // Sadece weekly-movie-list'i güncelle
    const weeklyMovieList = document.querySelector('.weekly-movie-list');
    weeklyMovieList.innerHTML = '';

    for (const movie of data.results) {
      try {
        // Get movie details to fetch genres
        const movieDetails = await fetchData(`/movie/${movie.id}`);
        const genreNames = movieDetails.genres.map(g => g.name).join(', ');

        // Check if movie is in library
        const library = JSON.parse(localStorage.getItem('library') || '[]');
        const isInLibrary = library.some(m => m.id === movie.id);

        const movieItem = document.createElement('li');
        movieItem.className = 'weekly-movie-item';
        movieItem.innerHTML = `
          <a href="#" class="weekly-movie-link" data-movie-id="${movie.id}">
            <img
              src="${IMAGE_BASE_URL}/w500${movie.poster_path}"
              alt="${movie.title}"
              class="weekly-movie-image"
            />
            <div class="movie-rating">
              <i class="fas fa-star"></i>
              <span>${movie.vote_average.toFixed(1)}</span>
            </div>
            <div class="movie-year">${
              movie.release_date?.split('-')[0] || 'N/A'
            }</div>
            <div class="weekly-movie-info">
              <h3 class="movie-title">${movie.title}</h3>
              <div class="movie-meta">
                <span>${genreNames}</span>
                <span class="movie-meta-divider">|</span>
                <span>${movie.release_date?.split('-')[0] || 'N/A'}</span>
              </div>
            </div>
          </a>
          <button class="add-to-library ${
            isInLibrary ? 'added' : ''
          }" data-movie-id="${movie.id}">
            <i class="fas ${isInLibrary ? 'fa-check' : 'fa-plus'}"></i>
            ${isInLibrary ? 'Added to library' : 'Add to library'}
          </button>
        `;

        // Add to Library butonuna tıklama olayı ekle
        const addToLibraryBtn = movieItem.querySelector('.add-to-library');
        addToLibraryBtn.addEventListener('click', async e => {
          e.preventDefault();
          e.stopPropagation();

          const movieId = parseInt(addToLibraryBtn.dataset.movieId);
          const movie = data.results.find(m => m.id === movieId);
          if (!movie) return;

          // Get movie details for complete data
          const movieDetails = await fetchData(`/movie/${movieId}`);

          // Get movie data with consistent format
          const movieData = {
            id: movieId,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            genres: movieDetails.genres.map(g => g.name).join(', '),
            overview: movie.overview,
          };

          // Check if movie is in library
          let library = JSON.parse(localStorage.getItem('library') || '[]');
          const isInLibrary = library.some(m => m.id === movieId);

          if (isInLibrary) {
            // Remove from library
            library = library.filter(m => m.id !== movieId);
            localStorage.setItem('library', JSON.stringify(library));
            addToLibraryBtn.innerHTML =
              '<i class="fas fa-plus"></i> Add to library';
            addToLibraryBtn.style.background = '#ff6b01';
            addToLibraryBtn.disabled = false;
          } else {
            // Add to library
            library.push(movieData);
            localStorage.setItem('library', JSON.stringify(library));
            addToLibraryBtn.innerHTML =
              '<i class="fas fa-check"></i> Added to library';
            addToLibraryBtn.style.background = '#2ecc71';
            addToLibraryBtn.disabled = true;
          }
        });

        weeklyMovieList.appendChild(movieItem);
      } catch (error) {
        console.error(`Error fetching details for movie ${movie.id}:`, error);
      }
    }

    // Pagination'ı gizle
    document.querySelector('.pagination').style.display = 'none';
  } catch (error) {
    console.error('Error searching movies:', error);
    showErrorModal('Failed to search movies. Please try again later.');
  }
}

// Yıl filtresi için fonksiyon
async function handleYearFilter(year) {
  try {
    let data;
    if (!year) {
      // Yıl seçilmemişse normal filmleri getir
      data = await fetchData('/trending/movie/week');
    } else {
      // Seçilen yıla göre filmleri getir
      data = await fetchData('/discover/movie', {
        primary_release_year: year,
        sort_by: 'popularity.desc',
        language: 'en-US',
      });
    }

    if (!data?.results) return;

    // Filmleri göster
    displayWeeklyTrendingMovies(data.results);

    // Pagination'ı gizle
    document.querySelector('.pagination').style.display = 'none';
  } catch (error) {
    console.error('Error fetching movies by year:', error);
    showErrorModal('Failed to load movies. Please try again later.');
  }
}

// Update library buttons
const updateLibraryButtons = () => {
  const library = JSON.parse(localStorage.getItem('library') || '[]');
  document.querySelectorAll('.add-to-library').forEach(button => {
    const movieId = parseInt(button.dataset.movieId);
    if (library.some(movie => movie.id === movieId)) {
      button.innerHTML = '<i class="fas fa-check"></i> Added to library';
      button.style.background = '#2ecc71';
      button.disabled = true;
    }
  });
};

// Search and filter functionality
const initSearchAndFilter = () => {
  let searchTimeout;

  domElements.searchInput.addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      handleSearch(e.target.value);
    }, 500);
  });

  domElements.yearSelect.addEventListener('change', e => {
    handleYearFilter(e.target.value);
  });

  domElements.searchButton.addEventListener('click', () => {
    handleSearch(domElements.searchInput.value);
  });
};

// Hamburger Menu Functions
const initHamburgerMenu = () => {
  domElements.hamburgerMenu.addEventListener('click', () => {
    domElements.hamburgerMenu.classList.toggle('active');
    domElements.navLinks.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (
      !domElements.hamburgerMenu.contains(e.target) &&
      !domElements.navLinks.contains(e.target)
    ) {
      domElements.hamburgerMenu.classList.remove('active');
      domElements.navLinks.classList.remove('active');
    }
  });

  // Close menu when clicking on a link
  domElements.navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      domElements.hamburgerMenu.classList.remove('active');
      domElements.navLinks.classList.remove('active');
    });
  });
};

// Initialize
const initCatalog = () => {
  initTheme();
  initHamburgerMenu();
  initSearchAndFilter();
  renderMovies();
  fetchWeeklyTrendingMovies();
};

document.addEventListener('DOMContentLoaded', async () => {
  initCatalog();
  updateLibraryButtons();

  // Arama butonuna tıklama olayı ekle
  const searchButton = document.querySelector('.search-button');
  searchButton.addEventListener('click', handleSearch);

  // Enter tuşuna basıldığında arama yap
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  });
});

// Pagination functionality
function updatePagination(currentPage, totalPages) {
  const paginationContainer = document.querySelector('.pagination');
  if (!paginationContainer) return;

  let paginationHTML = '';

  // Previous button
  paginationHTML += `
    <button class="pagination-btn" data-page="${currentPage - 1}" ${
    currentPage === 1 ? 'disabled' : ''
  }>
      <i class="fas fa-chevron-left"></i>
    </button>
  `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationHTML += `
        <button class="pagination-btn ${
          i === currentPage ? 'active' : ''
        }" data-page="${i}">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML += '<span class="page-dots">...</span>';
    }
  }

  // Next button
  paginationHTML += `
    <button class="pagination-btn" data-page="${currentPage + 1}" ${
    currentPage === totalPages ? 'disabled' : ''
  }>
      <i class="fas fa-chevron-right"></i>
    </button>
  `;

  paginationContainer.innerHTML = paginationHTML;
}

// Event delegation for pagination
document.addEventListener('DOMContentLoaded', () => {
  const paginationContainer = document.querySelector('.pagination');
  if (paginationContainer) {
    paginationContainer.addEventListener('click', e => {
      const button = e.target.closest('.pagination-btn');
      if (!button || button.disabled) return;

      const page = parseInt(button.dataset.page);
      if (!isNaN(page)) {
        renderMovies(page);
      }
    });
  }
});

// Update renderMovies function to handle pagination
const renderMovies = async (page = 1) => {
  try {
    const year = document.getElementById('year-select').value;
    const searchQuery = document.getElementById('search-input').value;
    const data = await fetchData('/discover/movie', {
      page,
      year,
      query: searchQuery,
      language: 'en-US',
      include_adult: true,
    });

    if (!data?.results) {
      domElements.movieGrid.innerHTML = '<p>No movies found.</p>';
      return;
    }

    const moviesHTML = data.results
      .map(movie => {
        const posterPath = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Image';
        const releaseYear = movie.release_date
          ? movie.release_date.split('-')[0]
          : 'N/A';

        return `
          <div class="movie-item">
            <a href="#" class="movie-link" data-id="${movie.id}">
              <div class="movie-image-container">
                <img src="${posterPath}" alt="${
          movie.title
        }" class="movie-image" />
                <div class="movie-info">
                  <h3 class="movie-title">${movie.title}</h3>
                  <div class="movie-meta">
                    <span class="movie-year">${releaseYear}</span>
                    <span class="movie-meta-divider">•</span>
                    <span class="movie-rating">
                      <i class="fas fa-star"></i>
                      ${movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        `;
      })
      .join('');

    domElements.movieGrid.innerHTML = moviesHTML;

    // Update pagination
    updatePagination(page, Math.min(data.total_pages, 500));

    // Add event listeners to movie links
    const movieLinks = domElements.movieGrid.querySelectorAll('.movie-link');
    movieLinks.forEach(link => {
      link.addEventListener('click', async e => {
        e.preventDefault();
        const movieId = link.dataset.id;
        await showMovieDetails(movieId);
      });
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    domElements.movieGrid.innerHTML =
      '<p>Error loading movies. Please try again.</p>';
  }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  renderMovies();
});
