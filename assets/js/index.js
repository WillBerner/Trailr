// TheMovieDataBase key
const TMDB_API_KEY = '35bedaf996a0d463f1f8fa5911ed61f8'

// Single function call to set up webpage
init();

// Call all set up functions inside here - event handlers, element creation, other page setup
function init() {

  // Check if user was redirected after no search results were found
  checkForNoResults();

  // Adds a random "movie" background
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?movie')`;

  // Get and display new, top rated movies
  getTopRated();

  // Set up event handlers for the page
  setupEventHandlers();

}

// This function checks if a user just searched for a movie that returned no results
function checkForNoResults() {

  // Get not found key-word from the URL 
  var url = new URL(window.location.href);
  var notFound = url.searchParams.get("q")

  // Checks if the URL ends with not found key word
  if (notFound === 'not-found') {

    // Replaces the input placeholder with this warning and prompts for entering another title 
    document.getElementById("searchInput").placeholder = "We couldn't find a movie with that title - please try again!"
  }
}

// This function saves a search term to localstorage
function saveSearchTerm(newSearchTerm) {

  // Save the search term array back to local storage
  localStorage.setItem("prevSearchTerm", newSearchTerm);

}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////// API QUERY FUNCTIONS /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// This function makes an API call to the TMDb API to get a list of top rated movies
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

/////////////////////////////////////////////////////////////////////////////////////
/////////////////// EVENT HANDLER FUNCTIONS /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// This function sets up event handlers for the page
function setupEventHandlers() {

  // Adds event handler for the search button
  document.getElementById("searchButton").addEventListener("click", searchBarHandler);

  // Adds event handler for an 'Enter' key on the search bar
  document.getElementById("searchInput").addEventListener("keyup", enterKeyHandler);

  // Adds event handler for clicking on a movie card "view" button
  document.getElementById("top-rated").addEventListener('click', handleTrailerLink);

}

// Event handler for entering a search request 
function searchBarHandler() {

  // Get the current value of the search text-input
  var searchTerm = document.getElementById("searchInput").value;

  // If the user didn't type in a value, display an error and don't redirect
  if (!searchTerm) {
    document.getElementById("searchInput").placeholder = "Error! Please enter a movie to search for.";
    return;
  }

  // Save the search term to local storage if it isn't blank
  saveSearchTerm(searchTerm);

  // redirect the user to the new page with a parameter of the search term
  window.location = `./search.html?q=${searchTerm}`;

};

// Event handler for when a user clicks "view" on a movie card
function handleTrailerLink(event) {

  // Get title of movie from its html data-attribute
  var movieTitle = event.target.getAttribute('data-title');

  // If the user actually clicked on a the view button, redirect to it.
  if (movieTitle) {
    window.location = `./trailer.html?q=${movieTitle}`
  }
}

// Event handler for entering a search request on the enter key
function enterKeyHandler(event) {
  if (event.key === "Enter") {
    searchBarHandler();
  }
};

/////////////////////////////////////////////////////////////////////////////////////
/////////////////// RENDERING FUNCTIONS /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// The renderTopRated function renders a card for each of the topRated movies
function renderTopRated(data) {
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
