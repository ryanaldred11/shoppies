window.shoppie = window.shoppie || {};

const ajax = (function() {
    const apiKey = "c23f3411";
    const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&`;

  const publicFunctions = {
    searchMovies: function(type, query){
      fetch(`${baseUrl}${type}=${query}`)
      .then(res => res.json())
      .then(data => {
        if(data.Response == "True") {
          console.log(data);
        } else {
          console.log('Invalid search: ' + data.Error);
        }
      })
      .catch(err => console.log('Something went wrong: ' + err));
    }
  }
  return publicFunctions;
})();


// example
// s is for search
// ajax.searchMovies('s', 'fight');
// ajax.searchMovies('s', 'fightjfkdsjf');

shoppie.Search = function Search(searchInput, /*resultsList*/) {
  this.selectors = {
    searchInput: document.querySelector(searchInput),
    // resultsList: document.querySelector(resultsList)
  }

  // listen for interaction with input and get movies
  // this.selectors.searchInput.addEventListener('input', e => {
  //   this._onSearch(e.target.value);
  // });
  this.selectors.searchInput.addEventListener('input', utilities._debounce(this._onSearch, 500));
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
        console.log(data);
        for (let movie of movies) {
          const item = document.createElement('li');
          item.classList = 'results__list-item';
          item.innerHTML = `
            ${movie.Title}
          `;
          // console.log(this);
          resultsList.appendChild(item);
        }
      } else {
        // search didn't return movies, explain why
        console.log('Invalid search: ' + data.Error);
      }
    })
    // search request failed
    .catch(err => console.log('Something went wrong: ' + err));
  },
  _renderMovies: function(movies) {
    for (let movie of movies) {
      console.log(movies);
    };
  }
});



shoppie.Utilities = function Render() {

}

shoppie.Utilities.prototype = Object.assign({}, shoppie.Utilities.prototype, {
  _debounce: function(func, delay = 1000) {
    console.log('debounce this:')
    console.log(this);
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
});

const utilities = new shoppie.Utilities();
const search = new shoppie.Search(".search__input"/*, ".results__list"*/);