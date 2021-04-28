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

shoppie.Render = function Render(searchInput, resultsList) {
  this.selectors = {
    searchInput: document.querySelector(searchInput),
    resultsList: document.querySelector(resultsList)
  }

  // listen for interaction with input and get movies
  this.selectors.searchInput.addEventListener('input', e => {
    this._onSearch(e.target.value);
  });
};

shoppie.Render.prototype = Object.assign({}, shoppie.Render.prototype, {
  _onSearch: function(query) {
    ajax.searchMovies("s", query);
  }
});

const render = new shoppie.Render(".search__input", ".results__list");
