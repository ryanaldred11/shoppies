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
ajax.searchMovies('s', 'fight');
// ajax.searchMovies('s', 'fightjfkdsjf');
