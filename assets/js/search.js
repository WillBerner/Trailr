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

// Try to get data for the movie the user searched for
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
  document.getElementById("results").addEventListener('click', trailerLinkClickHandler);

  // Calls the getPostersInfo function and pass the results
  getPostersInfo(results);
}

// Sort date by ascending year
function sortByDate(movieDataArray) {

  // Higher Order Sort function implementation
  var result = movieDataArray.sort((firstMovie, secondMovie) => {

    // Sort based on year released
    return firstMovie.Year - secondMovie.Year;

  });

  // Return the sorted array - perhaps in-place anyways, but working currently so...
  return result;

}

// This function will make an api call for each title resulted in the original search
async function getPostersInfo(results) {

  // Save all fetched data in a movie array to render movies from
  var movieDataArray = [];

  // Loops through the results and return more information about each returned title with a max of 8
  for (let i = 0; i < results.length && i < 8; i++) {

    // Create a search request URI for each returned title
    var requestUrl = `https://www.omdbapi.com/?t=${results[i].Title}&apikey=${OMBD_API_KEY}`;

    // Makes an api call for the given title
    await fetch(requestUrl)

      // Gets a JSON object containing the data needed
      .then((response) => response.json())

      // Once gets the data calls renderPosterCards
      .then((data) => {

        // If there's an error response, don't add the movie to the array
        if (!data.Error) {

          // If the movie has already been added, don't add it
          if (!movieDataArray.find(movie => movie.Title == data.Title)) {
            
            // Add movie data to results array
            movieDataArray.push(data)
          }
          
        }

        // Sort the movie data array each time - perhaps inefficient, but working for now.
        return sortByDate(movieDataArray);
      })

      // Log any errors that occur
      .catch((error) => console.log(error));
  }

  // After the results have been stored in an array and sorted
  // Render them to the screen in order
  movieDataArray.forEach(movie => {
    renderPosterCards(movie);
  })

};

// This function will render a card for each movie title returned
function renderPosterCards(data) {


  // Checks if there is an error with any of the movie objects returned then skip that movie from the render
  if (!data.Error && data.Poster !== "N/A") {

    // Injects a card for each movie title with it's title, poster, year, actors etc
    document.getElementById("results").innerHTML += `
       <div class="col s12 m3">
        <div class="card large">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="${data.Poster}">
        </div>

        <div class="card-content">
          <h6 class="grey-text text-darken-4">${data.Title}: ${data.Year}</h6>
          <h6 > ${data.Runtime} </h6>
        </div>
        <div class="card-action trailerLink center-align">
              <a data-title="${data.Title}" class="blue-text" href="#">View</a>
        </div>
      </div>
      </div>`;
  }
};

// This function directs the user to a new page with a trailer for the movie
function trailerLinkClickHandler(event) {

  // Get title of movie from its html data-attribute
  var movieTitle = event.target.getAttribute('data-title');

  // If the user actually clicked on a trailer, redirect to it.
  if (movieTitle) {
    window.location = `./trailer.html?q=${movieTitle}`
  }
}

// Single function call to set up webpage
init();
