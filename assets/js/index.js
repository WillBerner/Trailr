// the movie data base key
const TMDB_API_KEY = '35bedaf996a0d463f1f8fa5911ed61f8'

// Calls TMDb API to get top rated movies list
function getTopRated() {

  // Fetch request gets top rated movies
  var topMoviesRequest = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false&page=1`

  // Makes an api call to the TMDB database
  fetch(topMoviesRequest)
    // Standard getting json from response
    .then((response) => response.json())

    // Return the actual data we care about (stored in result variable)
    .then((data) => {
      // Calls the renderTopRated and passing in the data retrieved 
      renderTopRated(data)
    })
}

// Get any previous movie search terms the user has already used
// Nonfunctional currently, for future use.
function loadPreviousSearches() {

  // Try to get previous search terms from local storage
  var previousSearchTerms = JSON.parse(localStorage.getItem("prevSearches"));

  // If there exists no terms yet (new user), create new array
  if (!previousSearchTerms) {
    // Create empty array
    previousSearchTerms = [];

    // Save empty array to local storage
    localStorage.setItem("prevSearches", JSON.stringify(previousSearchTerms));
  }

  // Return array of search terms (possibly empty)
  return previousSearchTerms;
}

// Call all set up functions inside here - event handlers, element creation, other page setup
function init() {

  // Get not found key-word from the URL 
  var url = new URL(window.location.href);
  var notFound = url.searchParams.get("q")

  // Checks if the URL ends with not found key word
  if (notFound === 'not-found') {
    
    // Replaces the input placeholder with this warning and prompts for entering another title 
    document.getElementById("searchInput").placeholder = 'There was no movie with this title - please try again!'
  }

  // Get previous search terms (nonfunctional currently, for future use)
  var prevSearches = loadPreviousSearches();

  // Adds a random "movies" background
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?movie')`;

  getTopRated();

  // Adds the event handler for the search button
  document.getElementById("searchButton").addEventListener("click", searchBarHandler);

  // Listens to an 'Enter' key for the form to accept input on the keyup
  document.getElementById("searchInput").addEventListener("keyup", enterKeyHandler);

   // Adds event listener for clicking on a movie card view button
  document.getElementById("top-rated").addEventListener('click', viewButtonClickHandler);

}

// Save a search term to localstorage
function saveSearchTerm(newSearchTerm) {

  // Get previous search terms array
  var previousSearchTerms = JSON.parse(localStorage.getItem("prevSearches"));

  // Append the new search term to be saved to the array
  previousSearchTerms.push(newSearchTerm);

  // Save the search term array back to local storage
  localStorage.setItem("prevSearches", JSON.stringify(previousSearchTerms));

}


// The renderTopRated function renders a card for each of the topRated movies
function renderTopRated(data){
  // Gets the results array from the data and store it in a variable
  var topMovies = data.results;
  
  for (var i = 0; i < topMovies.length; i++) {
    // Injects a card for each movie title with it's title, poster, release date etc
    document.getElementById("top-rated").innerHTML += `
    <div class="col s12 m6 l3">
      <div class="card large">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="http://image.tmdb.org/t/p/w300${topMovies[i].poster_path}">
        </div>

        <div class="card-content">
          <h6 class="grey-text text-darken-4">${topMovies[i].title}</h6>
          <h6>Release Date: ${topMovies[i].release_date}</h6>
        </div>
        <div class="card-action trailerLink center-align">
          <a data-title="${topMovies[i].title}" class="blue-text" href="#">View</a>
        </div>
      </div>
    </div>`;
    
  }
}

// Handle a search request 
function searchBarHandler() {

  // Get the current value of the search text-input
  var searchTerm = document.getElementById("searchInput").value;

  // Save the search term to local storage
  saveSearchTerm(searchTerm);

  // If the user didn't type in a value, display an error and don't redirect
  if (!searchTerm) {
    document.getElementById("searchInput").placeholder = "Error! Please enter a movie to search for.";
    return;
  }

  // redirect the user to the new page with a parameter of the search term
  window.location = `./search.html?q=${searchTerm}`;

};

// This function directs the user to a new page with a trailer for the movie
function viewButtonClickHandler(event){
  // Get title of movie from its html data-attribute
  var movieTitle = event.target.getAttribute('data-title');

  // If the user actually clicked on a the view button, redirect to it.
  if (movieTitle) {
    window.location = `./trailer.html?q=${movieTitle}`
  }
}

// This handler will check if the key pressed was an enter key to accept the input
function enterKeyHandler(event) {
  if (event.key === "Enter") {
    searchBarHandler();
  }
};

// Single function call to set up webpage
init();










