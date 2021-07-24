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
function getTopRated(sortBy) {

  // Starts a topMoviesRequest 
  var topMoviesRequest;

  // Checks if the storBy passes in parameter has a value of undefined
  if (sortBy !== undefined) {
    if(sortBy === "release_date.desc") {
      sortBy = "popularity.desc&primary_release_date.gte=2021-12-31";
    } 

    // if the storBy passes in parameter will inject it in the request url
    topMoviesRequest = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&include_adult=false&language=en-US&sort_by=${sortBy}&include_video=false&page=1`

  } else {

    // else it will use the default request url
    topMoviesRequest = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&include_adult=false&language=en-US&sort_by=popularity.desc&include_video=false&page=1`
  }

  // Makes an api call to the TMDB database
  fetch(topMoviesRequest)

    // Standard getting json from response
    .then((response) => response.json())

    // Return the actual data we care about
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
  document.getElementById("searchButton").addEventListener("click", handleSearchBar);

  // Adds event handler for an 'Enter' key on the search bar
  document.getElementById("searchInput").addEventListener("keyup", enterKeyHandler);

  // Adds event handler for clicking on a movie card "view" button
  document.getElementById("top-rated").addEventListener('click', handleTrailerLink);

  // Addes event handler for sorting by a menu item
  document.getElementById("sort-menu").addEventListener("change", handleSortMenu);
}

// Event handler for entering a search request 
function handleSearchBar() {

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

// Event handler for sorting based on user's input
function handleSortMenu() {

  // Get value of the user's input
  var sortBy = document.getElementById('sort-menu').value;

  // If the user actually clicked on one of the choices in the select menu, call function
  if (sortBy) {

    // Call the getTopRated and pass in the sortBy value 
    getTopRated(sortBy)
  }
}

// This function will add an event listener to the Dom content that is loaded 
document.addEventListener('DOMContentLoaded', function () {

  // Will assign the elems to all div with the class of select
  var elems = document.querySelectorAll('select');

  // Will initiate the drop down select menu
  var instances = M.FormSelect.init(elems);
});

// Event handler for entering a search request on the enter key
function enterKeyHandler(event) {
  if (event.key === "Enter") {
    handleSearchBar();
  }
};

/////////////////////////////////////////////////////////////////////////////////////
/////////////////// RENDERING FUNCTIONS /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// The renderTopRated function renders a card for each of the topRated movies
function renderTopRated(data) {

  // Gets the results array from the data and store it in a variable
  var topMovies = data.results;

  // Starts the value of posterArt as an empty string
  var posterArt = ""

  // Emptys the top-rated div from early shown content
  document.getElementById("top-rated").innerHTML = "";

  for (var i = 0; i < topMovies.length; i++) {

    // Checks if the data of each car has a path to a poster
    if (topMovies[i].poster_path !== null) {

      // If it has a path appends that poster to the TMDB url 
      posterArt = `https://image.tmdb.org/t/p/w300${topMovies[i].poster_path}`;
    } else {

      // Else it will set it to a coming soon photo stored   
      posterArt = `./assets/images/coming-soon.jpg`
    }

    // Format date nicely to display
    var date = moment(topMovies[i].release_date).format("MMMM Do, YYYY");

    // Injects a card for each movie title with it's title, poster, release date etc
    document.getElementById("top-rated").innerHTML += `
    <div class="col s12 m6 l3">
      <div class="card large">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="${posterArt}">
        </div>

        <div class="card-content">
          <h6 class="grey-text text-darken-4 movieTitleEl">${topMovies[i].title}</h6>
          <h6>${date}</h6>
        </div>
        <div class="card-action trailerLink center-align">
          <a data-title="${topMovies[i].title}" class="blue-text" href="#">View</a>
        </div>
      </div>
    </div>`;

  }
}
