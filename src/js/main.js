import axios from 'axios';

const API_KEY = '8a0658d1a6872272a1ed1ab9af543174';
const API_BASE_URL = 'https://api.themoviedb.org/3';

const apiBaseUrl = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    api_key: API_KEY,
  },
});

// Cache DOM elements
const domElements = {
  heroContentBtn: document.querySelector('.hero-content-btn'),
  upcomingMovieLink: document.querySelector('.upcoming-movie-link'),
  weeklyMovieList: document.querySelector('.weekly-movie-list'),
  hero: document.querySelector('.hero'),
  defaultHero: document.querySelector('.default-hero'),
  movieHero: document.querySelector('.movie-hero'),
  prevButton: document.querySelector('.slider-button.prev'),
  nextButton: document.querySelector('.slider-button.next'),
  themeSwitch: document.getElementById('theme-switch'),
  upcomingMovieList: document.querySelector('.upcoming-movies-list'),
  modal: document.getElementById('movieDetailsModal'),
  modalCloseBtn: document.querySelector('.modal-close-btn'),
  videoModal: document.getElementById('videoModal'),
  videoFrame: document.getElementById('videoFrame'),
  videoModalCloseBtn: document.querySelector('#videoModal .modal-close-btn'),
  errorModal: document.getElementById('errorModal'),
  errorModalCloseBtn: document.querySelector('#errorModal .modal-close-btn'),
  errorMessage: document.querySelector('.error-message'),
};

domElements.heroContentBtn.addEventListener('click', () => {
  window.location.href = '/cinemania/catalog.html';
});

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

  if (watchTrailerBtn) {
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
  }

  if (moreDetailsBtn) {
    moreDetailsBtn.addEventListener('click', () => showMovieDetails(movieId));
  }
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
    const movieDetails = await fetchData(`/movie/${movieId}`);
    const credits = await fetchData(`/movie/${movieId}/credits`);
    const cast = credits.cast.slice(0, 6);

    const modalContent = `
      <div class="modal-header">
        <h2 class="modal-title">${movieDetails.title}</h2>
        <div class="modal-rating">
          <div class="stars">${createStarRating(
            movieDetails.vote_average
          )}</div>
          <span>${movieDetails.vote_average.toFixed(1)}</span>
        </div>
      </div>
      <div class="modal-info">
        <div>
          <h4>Genre</h4>
          <p>${getGenreNames(movieDetails.genres)}</p>
        </div>
        <div>
          <h4>Release Date</h4>
          <p>${formatDate(movieDetails.release_date)}</p>
        </div>
        <div>
          <h4>Runtime</h4>
          <p>${movieDetails.runtime} min</p>
        </div>
        <div>
          <h4>Budget</h4>
          <p>${formatCurrency(movieDetails.budget)}</p>
        </div>
        <div>
          <h4>Revenue</h4>
          <p>${formatCurrency(movieDetails.revenue)}</p>
        </div>
      </div>
      <div class="modal-overview">
        <h3>Overview</h3>
        <p>${movieDetails.overview}</p>
      </div>
      <div class="modal-cast">
        <h3>Cast</h3>
        <div class="cast-list">
          ${cast
            .map(
              actor => `
            <div class="cast-member">
              <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" alt="${actor.name}" onerror="this.src='https://via.placeholder.com/185x185?text=No+Image'">
              <div class="name">${actor.name}</div>
              <div class="character">${actor.character}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    domElements.modal.querySelector('.modal-content').innerHTML = modalContent;
    domElements.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Add event listener for close button
    const closeBtn = domElements.modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        domElements.modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close modal when clicking outside
    domElements.modal.addEventListener('click', e => {
      if (e.target === domElements.modal) {
        domElements.modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  } catch (error) {
    console.error('Error showing movie details:', error);
    showErrorModal('Failed to load movie details. Please try again later.');
  }
};

// Render functions
const renderWeeklyMovies = async () => {
  try {
    const data = await fetchData('/trending/movie/week');
    if (!data?.results) return;

    const moviePromises = data.results.map(async movie => {
      const movieDetails = await fetchData(`/movie/${movie.id}`);
      const genreNames = getGenreNames(movieDetails?.genres);
      const year = new Date(movie.release_date).getFullYear();

      // Check if movie is in library
      const library = JSON.parse(localStorage.getItem('library') || '[]');
      const isInLibrary = library.some(m => m.id === movie.id);

      return `
          <li class="weekly-movie-item" data-movie-id="${movie.id}">
            <a class="weekly-movie-link" href="#">
              <img class="weekly-movie-image" src="https://image.tmdb.org/t/p/w500${
                movie.poster_path
              }" alt="${movie.title}">
              <div class="movie-rating">
                <i class="fas fa-star"></i>
                <span>${movie.vote_average.toFixed(1)}</span>
              </div>
              <div class="weekly-movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                  ${genreNames} <span class="movie-meta-divider">|</span> ${year}
                </div>
              </div>
            </a>
            <button class="add-to-library ${
              isInLibrary ? 'added' : ''
            }" data-movie-id="${movie.id}">
              <i class="fas ${isInLibrary ? 'fa-check' : 'fa-plus'}"></i>
              ${isInLibrary ? 'Added to library' : 'Add to library'}
            </button>
          </li>
        `;
    });

    const movieItems = await Promise.all(moviePromises);
    domElements.weeklyMovieList.innerHTML = movieItems.join('');

    initSlider(data);

    // Add click event listeners using event delegation
    domElements.weeklyMovieList.addEventListener('click', async e => {
      const addToLibraryBtn = e.target.closest('.add-to-library');
      if (addToLibraryBtn) {
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
        return;
      }

      const movieItem = e.target.closest('.weekly-movie-item');
      if (movieItem) {
        e.preventDefault();
        const movieId = parseInt(movieItem.dataset.movieId);
        const movie = data.results.find(m => m.id === movieId);
        if (!movie) return;
        await handleMovieClick(movieId, data);
      }
    });
  } catch (error) {
    console.error('Error rendering weekly movies:', error);
  }
};

const renderUpcomingMovies = async () => {
  try {
    const data = await fetchData('/movie/upcoming');

    if (!data?.results) {
      domElements.upcomingMovieList.innerHTML =
        '<p>No upcoming movies available.</p>';
      return;
    }

    // Sort movies by popularity and filter out movies without images
    const topMovies = data.results
      .filter(movie => movie.backdrop_path && movie.poster_path)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);

    if (topMovies.length === 0) {
      domElements.upcomingMovieList.innerHTML =
        '<p>No upcoming movies with images available.</p>';
      return;
    }

    const moviePromises = topMovies.map(async movie => {
      const movieDetails = await fetchData(`/movie/${movie.id}`);
      const genreNames = getGenreNames(movieDetails?.genres, 3);
      const library = JSON.parse(localStorage.getItem('library') || '[]');
      const isInLibrary = library.some(m => m.id === movie.id);

      return `
        <li class="upcoming-movie-item">
          <a class="upcoming-movie-link" href="#">
            <div class="upcoming-movie-image-container">
              <img class="upcoming-movie-image" src="https://image.tmdb.org/t/p/w1280${
                movie.backdrop_path
              }" alt="${movie.title}">
            </div>
            <div class="upcoming-movie-info">
              <h3 class="movie-title">${movie.title}</h3>
              <div class="info-section">
                <div class="info-row">
                  <span class="info-label">Release Date</span>
                  <span class="info-value-date">${formatDate(
                    movie.release_date
                  )}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Rating</span>
                  <span class="info-value-rating">
                    ${movie.vote_average.toFixed(
                      1
                    )} / ${movie.vote_count.toLocaleString()} votes
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">Popularity</span>
                  <span class="info-value-popularity">${Math.round(
                    movie.popularity
                  ).toLocaleString()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Genre</span>
                  <span class="info-value-genre">${genreNames}</span>
                </div>
              </div>
              <div class="movie-about">
                <h4 class="about-label">ABOUT</h4>
                <p class="about-text">${movie.overview}</p>
              </div>
              <button class="add-to-library ${
                isInLibrary ? 'added' : ''
              }" data-movie-id="${movie.id}">
                <i class="fas ${isInLibrary ? 'fa-check' : 'fa-plus'}"></i>
                ${isInLibrary ? 'Added to library' : 'Add to my library'}
              </button>
            </div>
          </a>
        </li>
      `;
    });

    const movieItems = await Promise.all(moviePromises);
    domElements.upcomingMovieList.innerHTML = movieItems.join('');

    // Add click event listeners using event delegation
    domElements.upcomingMovieList.addEventListener('click', async e => {
      const button = e.target.closest('.add-to-library');
      if (button) {
        e.preventDefault();
        const movieId = parseInt(button.dataset.movieId);
        const movie = topMovies.find(m => m.id === movieId);

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

        // Update button state
        button.innerHTML = '<i class="fas fa-check"></i> Added to library';
        button.style.background = '#2ecc71';
        button.disabled = true;

        // Store in localStorage
        let library = JSON.parse(localStorage.getItem('library') || '[]');
        if (!library.some(m => m.id === movieId)) {
          library.push(movieData);
          localStorage.setItem('library', JSON.stringify(library));
        }
        return;
      }

      const movieItem = e.target.closest('.upcoming-movie-item');
      if (movieItem) {
        e.preventDefault();
        const movieId = parseInt(
          movieItem.querySelector('.add-to-library').dataset.movieId
        );
        handleMovieClick(movieId, data);
      }
    });
  } catch (error) {
    console.error('Error rendering upcoming movies:', error);
    domElements.upcomingMovieList.innerHTML =
      '<p>Error loading upcoming movies. Please try again later.</p>';
  }
};

// Listen for messages from other pages
window.addEventListener('message', event => {
  if (event.data.type === 'removeFromLibrary') {
    // Update button state in weekly trends
    const weeklyButton = document.querySelector(
      `.weekly-movie-item [data-movie-id="${event.data.movieId}"]`
    );
    if (weeklyButton) {
      weeklyButton.innerHTML = '<i class="fas fa-plus"></i> Add to library';
      weeklyButton.style.background = '#ff6b01';
      weeklyButton.disabled = false;
    }

    // Update button state in movie details modal
    const modalButton = document.querySelector(
      `#movieDetailsModal [data-movie-id="${event.data.movieId}"]`
    );
    if (modalButton) {
      modalButton.innerHTML = '<i class="fas fa-plus"></i> Add to library';
      modalButton.style.background = '#ff6b01';
      modalButton.disabled = false;
    }
  }
});
// Hamburger Menu Functionality
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburgerMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!hamburgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
    hamburgerMenu.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// Close menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburgerMenu.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderWeeklyMovies();
  renderUpcomingMovies();
});

function slideWeeklyMovies(direction) {
  const container = document.querySelector('.weekly-movie-list');
  const itemWidth = container.children[0].offsetWidth + 16;
  const slideAmount = itemWidth * 8;
  const currentTransform = getComputedStyle(container).transform;
  const matrix = new DOMMatrix(currentTransform);
  const currentTranslate = matrix.m41;
  const newTranslate = currentTranslate + direction * slideAmount;
  const maxTranslate = -(
    container.scrollWidth - container.parentElement.offsetWidth
  );

  // Limit the translation to prevent sliding beyond the content
  const limitedTranslate = Math.max(maxTranslate, Math.min(0, newTranslate));
  container.style.transform = `translateX(${limitedTranslate}px)`;

  // Update button visibility
  updateWeeklySliderButtons(limitedTranslate, maxTranslate);
}
