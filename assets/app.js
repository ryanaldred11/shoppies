window.shoppie = window.shoppie || {};

// const ajax = (function() {
//     const apiKey = "c23f3411";
//     const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&`;

//   const publicFunctions = {
//     searchMovies: function(type, query){
//       fetch(`${baseUrl}${type}=${query}`)
//       .then(res => res.json())
//       .then(data => {
//         if(data.Response == "True") {
//           console.log(data);
//         } else {
//           console.log('Invalid search: ' + data.Error);
//         }
//       })
//       .catch(err => console.log('Something went wrong: ' + err));
//     }
//   }
//   return publicFunctions;
// })();

shoppie.Search = function Search(searchInput, resultsList, nominationsList) {
  this.selectors = {
    searchInput: document.querySelector(searchInput),
    resultsList: document.querySelector(resultsList),
    nominationsList: document.querySelector(nominationsList)
  }

  // set nominations array or get nominations from local storage
  if(localStorage.getItem('nominations') === null) {
    this.nominations = [];
  } else {
    this.nominations = JSON.parse(localStorage.getItem('nominations'));
    this._renderNominations(this.nominations);
  };

  // listen for interaction with input and get movies
  this.selectors.searchInput.addEventListener('input', debounce(this._onSearch.bind(this)));

  // listen for nominations
  this.selectors.resultsList.addEventListener('click', (e) => {
    if(e.target.id === 'nominate-btn') {
      this._onNominate(e.target.dataset.id);
    }
  })

  // listen for un-nominations
  this.selectors.nominationsList.addEventListener('click', (e) => {
    if(e.target.id === 'remove-btn') {
      this._onUnNominate(e);
    }
  })
};


shoppie.Search.prototype = Object.assign({}, shoppie.Search.prototype, {
  _onSearch: function(e) {
    
    const apiKey = "c23f3411";
    const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&`;

    fetch(`${baseUrl}s=${e.target.value}`)
    .then(res => res.json())
    .then(data => {
      if(data.Response == "True") {
        // search returned movies, now render them
        const movies = data.Search;
        const resultsList = document.querySelector('.results__list');
        for (let movie of movies) {
          this.selectors.resultsList.appendChild(this._renderMovie(movie, 'search'));
        }
      } else {
        // search didn't return movies, explain why
        console.log('Invalid search: ' + data.Error);
      }
    })
    // search request failed
    .catch(err => console.log('Something went wrong: ' + err));
  },
  _renderMovie: function(movie, type = 'nomination') {    
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    let cta, btnId;

    if(type === 'search') {
      cta = 'Nominate';
      btnId = 'nominate-btn';
    } else {
      cta = 'Remove';
      btnId = 'remove-btn';
    }

    const movieItem = document.createElement('li');
    movieItem.classList = 'movie';
    
    movieItem.innerHTML =  `
      <img src="${imgSrc}" class="movie__poster">
      <div class="movie__details">
        <h4 class="movie__title">${movie.Title}</h4>
        <small class="movie__year">${movie.Year}</small>
      </div>
      <button class="btn btn--primary" id="${btnId}" data-id=${movie.imdbID}>
        ${cta}
      </button>
    `;

    return movieItem;
  },
  _onNominate: function(nominee) {
    if(this.nominations.includes(nominee)) {
      console.log('this movie has already been nominated')
    } else {
      this.nominations.push(nominee);

      this._updateNominationsInLocalStorage();
      this._doSomething();
    }
  },
  _updateNominationsInLocalStorage: function() {
    localStorage.setItem('nominations', JSON.stringify(this.nominations));
  },
  _renderNominations: function(nominations) {
    if(nominations.length > 0) {
      for(let id of nominations) {
        // this.getNomination(nominee);
        const apiKey = "c23f3411";
        const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&`;

        fetch(`${baseUrl}i=${id}`)
        .then(res => res.json())
        .then(movie => {
          this.selectors.nominationsList.appendChild(this._renderMovie(movie, 'nominations'));
        })
        .catch(err => console.log(err));
    
      }
    }
  },
  _onUnNominate: function(e) {
    const id = e.target.dataset.id
    const movieElement = e.target.parentElement;
    console.log(e);
    if (this.nominations.includes(id)) {
      movieElement.remove();
      this.nominations.pop(id);
      this._updateNominationsInLocalStorage();
    }
  },
  _doSomething: function(where) {
    console.log('doing a thing ' + where);
  }
});

debounce = function(func, delay = 1000) {
  let timeoutId;
  return function(...args) {
    if(timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(function() {
      func.apply(null, args);
    }, delay);
  };
}

const app = new shoppie.Search(".search__input", ".results__list", ".nominations__list");