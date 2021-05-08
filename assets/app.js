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
    nominationsList: document.querySelector(nominationsList),
    banner: document.querySelector('.banner')
  }

  // set nominations array or get nominations from local storage
  if(localStorage.getItem('nominations') === null) {
    this.nominations = [];
  } else {
    this.nominations = JSON.parse(localStorage.getItem('nominations'));
    this._renderNominations(this.nominations);
  };

  // do some stuff on load
  document.addEventListener('DOMContentLoaded', this._onLoad());

  // listen for interaction with input and get movies
  this.selectors.searchInput.addEventListener('keydown', debounce(this._onSearch.bind(this)));

  // listen for nominations
  this.selectors.resultsList.addEventListener('click', (e) => {
    if(e.target.id === 'nominate-btn') {
      this._onNominate(e);
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
  _onLoad: function() {
    // check to see if theyve already voted for 5 movies
    if (this.nominations.length >= 5) {
      this.selectors.banner.classList.remove('hide');
      this.selectors.banner.innerText = 'Voting complete! You will need to remove a nomination before you can add another one'
    }
  },
  _onSearch: function(e) {    
    const apiKey = "c23f3411";
    const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&`;

    this.selectors.resultsList.innerHTML = '';

    fetch(`${baseUrl}s=${e.target.value}`)
    .then(res => res.json())
    .then(data => {
      if(data.Response == "True") {
        // search returned movies, now render them
        const movies = data.Search;

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
    let cta, btnId, isDisabled;

    isDisabled = '';

    if(type === 'search') {
      cta = 'Nominate';
      btnId = 'nominate-btn';
      classList = 'btn btn--primary';

      if(this.nominations.length >= 5 || type === 'search' && this.nominations.includes(movie.imdbID)) {
        isDisabled = 'disabled';
      }
    } else {
      cta = 'Remove';
      btnId = 'remove-btn';
      classList = 'btn btn--destroy';
    }

    const movieItem = document.createElement('li');
    movieItem.classList = 'movie';
    
    movieItem.innerHTML =  `
      <img src="${imgSrc}" class="movie__poster">
      <div class="movie__details">
        <h4 class="movie__title">${movie.Title}</h4>
        <small class="movie__year">${movie.Year}</small>
      </div>
      <button class="${classList}" id="${btnId}" data-id=${movie.imdbID} ${isDisabled}>
        ${cta}
      </button>
    `;

    return movieItem;
  },
  _onNominate: function(e) {
    const nominee = e.target.dataset.id;
    
    if(this.nominations.includes(nominee)) {
      console.log('this movie has already been nominated')
    } else {
      // push the nomination
      e.target.innerText = 'Remove';
      e.target.id = 'remove-btn';
      e.target.classList.remove('btn--primary');
      e.target.classList.add('btn--destroy');
      this.selectors.nominationsList.appendChild((e.target.parentElement));
      this.nominations.push(nominee);
      this._updateNominationsInLocalStorage();
      
      

      // if they've voted for 5 movies, they are done
      // show a banner and disable the voting buttons
      if(this.nominations.length >= 5) {
        const nominateBtns = document.querySelectorAll('#nominate-btn');
        for(let btn of nominateBtns) {
          btn.disabled = true;
        }
        this.selectors.banner.innerText = 'Voting complete! You will need to remove a nomination before you can add another one';
        this.selectors.banner.classList.remove('hide');
      }
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
          this.selectors.nominationsList.appendChild(this._renderMovie(movie));
        })
        .catch(err => console.log(err));
    
      }
    }
  },
  _onUnNominate: function(e) {
    const id = e.target.dataset.id
    const movieElement = e.target.parentElement;

    if (this.nominations.includes(id)) {
      movieElement.remove();

      // get the index of the movie and then remove it from the list and update local storage
      const idx = this.nominations.indexOf(id);
      this.nominations.splice(idx, 1);    
      this._updateNominationsInLocalStorage();

      // if they removed the 5th nomination, hide the banner
      if (this.nominations.length < 5 && !this.selectors.banner.classList.contains('hide')) {
        this.selectors.banner.classList.add('hide');
        this.selectors.banner.innerText = '';

        // re-enable the nomination buttons, except for already nominated buttons
        const nominateBtns = document.querySelectorAll('#nominate-btn');
        for(let btn of nominateBtns) {
          if(!this.nominations.includes(btn.dataset.id)) {
            btn.disabled = false;
          }
        }
      }

      // re-enable the nominate btn if the movie is in the list
      const searchResults = document.querySelectorAll('.results__list .movie');
      searchResults.forEach(movie => {
        if(id == movie.lastElementChild.dataset.id) {
          movie.lastElementChild.disabled = false;
        }
      });
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