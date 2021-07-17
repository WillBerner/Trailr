// JS FOR RESULTS PAGE

// During production and testing, replace with your own key please :)
// Keep it global so it can be accessed by all functions using API calls
const OMBD_API_KEY = "57046b00";

// Call OMDb API to get movie data for a search term
async function searchMovie(searchTerm) {
    
  // Create a search request URI with a given search term
  const QUERY_URI = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${OMBD_API_KEY}`;

  // Attempt to fetch data asynchronously ("await") for the searchTerm
  var result = await fetch(QUERY_URI)
    // Standard getting json from response
    .then((response) => response.json())

    // Return the actual data we care about (stored in result variable)
    .then((data) => {
      return data;
    })

    // Log any errors that occur
    .catch((error) => console.log(error));

  // Return final result array
  return result.Search;
}

// This function gets the search parameters from the URI and searches them
async function getSearchedMovie() {

  // Get search term from URL parameters
  var url = new URL(window.location.href);
  var searchTerm = url.searchParams.get("q");

  // Return the result of calling the searchMovie function with the searchTerm
  return await searchMovie(searchTerm);
}

// Call all set up functions inside here - event handlers, element creation, other page setup
// Must be asynchronous in order to use await keyword for awaiting API response
async function init() {
  
  // Get results for the searched term
  var results = await getSearchedMovie();

  // Adds a random movie as the background using jQuery
  $(`body`).css(`backgroundImage`, `url('https://source.unsplash.com/1600x900/?movie')`);
  
  // Get more info for each individual result from the search
  getPostersInfo(results);
}

// This function makes an api call for each title returned in the original search
var getPostersInfo = function (results) {

  // Loops through the results and returns more information about each returned title with a max of 8
  for (let i = 0; i < results.length && i < 8; i++) {

    // Create a search request URI for each returned title
    var requestUrl = `https://www.omdbapi.com/?t=${results[i].Title}&apikey=${OMBD_API_KEY}`;

    // Makes an api call for the given title
    fetch(requestUrl)

      // Gets a JSON object containing the data needed
      .then((response) => response.json())

      // Calls a function to render each movie object to the page as a card
      .then((data) => renderPosterCards(data))

      // Log any errors that occur
      .catch((error) => console.log(error));
  }
};

// This function renders a card for each movie title returned
var renderPosterCards = function (data) {

  // Checks if there is an error with any of the movie objects returned and if so, skips rendering that movie
  if (!data.Error) {

    // Injects a card for each movie title with it's title, poster, year, actors etc
    $(`#results`).append(`
       <div class="col s12 m3">
        <div class="card large">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="${data.Poster}">
        </div>

        <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">${data.Title}<br/>
           ${data.Year}
           <i class="material-icons tiny">fiber_manual_record</i>
           ${data.Runtime}
            <i class="material-icons right">arrow_upward</i></span>
        </div>

        <div class="card-reveal">
          <span class="card-title grey-text text-darken-4">${data.Title}  <i class="material-icons right">close</i></span>
          <p>Genre: ${data.Genre}</p><br />
          <p>${data.Plot}</p><br />
          <p>Actors: ${data.Actors}</p><br />
          <p>IMDB Rating: ${data.imdbRating}</p>
        </div>
      </div>
      </div>`);
  }
};

// Single function call to set up webpage
init();
