var resultsEl = document.getElementById("results");
var backButton = document.getElementById("backButton");

// During production and testing, replace with your own key please :)
// Made it global so it can be accessed by the
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

  // Adds a random "movies" background
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?movie')`;

  // Adds event listener for clicking on a movie trailer
  resultsEl.addEventListener('click', trailerLinkClickHandler);

  // Checks if Api call returned results object otherwise this means that the movie was not found
  if(results){
    // If got results object call getPostersInfo and pass the results
  getPostersInfo(results);
  } else {
    // Else return to the home page and append not-found to its url  
    window.location = `./index.html?q=not-found`
  }
}

// This function will make an api call for each title resulted in the original search
var getPostersInfo = function (results) {
  // Loops through the results and return more information about each returned title with a max of 8
  for (let i = 0; i < results.length && i < 8; i++) {
    // Create a search request URI for each returned title
    var requestUrl = `https://www.omdbapi.com/?t=${results[i].Title}&apikey=${OMBD_API_KEY}`;

    // Makes an api call for the given title
    fetch(requestUrl)
      // Gets a JSON object containing the data needed
      .then((response) => response.json())

      // Once gets the data calls renderPosterCards
      .then((data) => renderPosterCards(data))
      // Log any errors that occur
      .catch((error) => console.log(error));
  }
};

// This function will render a card for each movie title returned
var renderPosterCards = function (data) {
  console.log(data);
  // Checks if there is an error with any of the movie objects returned then skip that movie from the render
  if (!data.Error && data.Poster !== "N/A") {
    // Injects a card for each movie title with it's title, poster, year, actors etc
    resultsEl.innerHTML += `
       <div class="col s12 m3">
        <div class="card large">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="${data.Poster}">
        </div>

        <div class="card-content">
          <h6 class="grey-text text-darken-4">${data.Title}: ${data.Year}</h6>
          <h6 > ${data.Runtime} </h6>
        </div>
        <div class="card-action trailerLink">
              <a data-title='${data.Title}' class="blue-text" href="#">Watch Trailer</a>
        </div>
      </div>
      </div>`;
  }
};

// This function directs the user to a new page with a trailer for the movie
var trailerLinkClickHandler = function(event){

  // Get title of movie from its html data-attribute
  var movieTitle = event.target.getAttribute('data-title');

  // If the user actually clicked on a trailer, redirect to it.
  if(movieTitle){
    window.location = `./trailer.html?q=${movieTitle}`
  }
}
// Function to return to search page on click of back button
var pageReturn = function () {
  window.location = "./index.html";
  console.log("click");
};

// Adds the event handler for the back button
backButton.onclick = ()=>{
  pageReturn();
  console.log("click");
}

// Single function call to set up webpage
init();
