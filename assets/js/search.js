// During production and testing, replace with your own key please :)
// Made it global so it can be accessed by different functions
const OMBD_API_KEY = "57046b00";

// Array to hold movies for filtering, sorting, etc.
// Don't alter during sorting/filtering - make copies, so filters/sorts 
// can be reapplied without overwritting the original results
let movieResults = [];

// Single function call to set up webpage
init();

// Call all set up functions inside here - event handlers, element creation, other page setup
// Must be asynchronous in order to use await keyword for awaiting API response
async function init() {

  // Get results for the searched term
  var results = await getSearchedMovie();

  // Set up event handlers for the page
  setupEventHandlers();

  // Checks if Api call returned results object - if results is null, it means that the movie was not found
  if (results) {

    // If results were returned, call getPostersInfo and pass the results array
    getPostersInfo(results);

  } else {

    // Else return to the home page and append not-found to its url  
    window.location = `./index.html?q=not-found`
  }
}

// Try to get data for the movie the user searched for
async function getSearchedMovie() {

  // Get search term from URL parameters
  var url = new URL(window.location.href);
  var searchTerm = url.searchParams.get("q");

  // Return the result of calling the searchMovie function with the searchTerm
  return await searchMovie(searchTerm);
}

// This function will render a card for each movie title returned
function renderPosterCards(data) {

  // Checks if there is an error with any of the movie objects returned then skip that movie from the render
  if (!data.Error && data.Poster !== "N/A") {

    // Injects a card for each movie title with it's title, poster, year, actors etc
    document.getElementById("results").innerHTML += `
       <div class="col s12 m6 l3 card-visibility" data-r-rate="${data.Rated}">
        <div class="card large">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="${data.Poster}">
        </div>

        <div class="card-content">
          <h6 class="grey-text text-darken-4 movieTitleEl">${data.Title}: ${data.Year}</h6>
          <h6 > ${data.Runtime} </h6>
        </div>
        <div class="card-action trailerLink center-align">
              <a data-title="${data.Title}" class="blue-text" href="#">View</a>
        </div>
      </div>
      </div>`;
  }
  // Calls the cardRRatedVisibility function so after every cards render  
  // So make the cards with the R rating either visible or invisible dependant on the checkbox
  cardRRatedVisibility();
};

/////////////////////////////////////////////////////////////////////////////////////
/////////////////// API QUERY FUNCTIONS /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// This function queries the OMDb API to get movie results for a particular search term
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

// This function makes an api call for each title resulted in the original search
async function getPostersInfo(results) {

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
          if (!movieResults.find(movie => movie.Title == data.Title)) {

            // Save results for filtering/sorting functions
            movieResults.push(data);
          }
        }
      })

      // Log any errors that occur
      .catch((error) => console.log(error));
  }

  // Default to sorting the page by year with default value older movies first
  handleSortByYear()
};

/////////////////////////////////////////////////////////////////////////////////////
/////////////////// EVENT HANDLER FUNCTIONS /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// This function sets up event handlers for the page
function setupEventHandlers() {

  // Adds event listener for clicking on a movie trailer
  document.getElementById("results").addEventListener('click', handleTrailerLink);

  // Adds event listener to handle sorting by year
  document.getElementById("sortByDateSelector").addEventListener('change', handleSortByYear);

  //Adds event listener to handle not showing R rated movies
  document.getElementById("filterByRRatedInput").addEventListener('change', cardRRatedVisibility)

}

// Event handler for selecting to sort by year
function handleSortByYear() {

  // Get sort option value: "new" or "old"
  var sortOption = document.getElementById("sortByDateSelector").value;

  // Assign results variable to function call returning a sorted array of movie data
  var results;
  if (sortOption == "new") {
    results = sortbyDateNewerFirst();
  } else {
    results = sortbyDateOlderFirst();
  }

  // Clear out the current result cards from the results div
  document.getElementById("results").innerHTML = "";

  // Re-render each movie card with the sorted movie array
  results.forEach(movie => {

    renderPosterCards(movie);
  })

}

// Event handler for when a user clicks "view" on a movie card
function handleTrailerLink(event) {

  // Get title of movie from its html data-attribute
  var movieTitle = event.target.getAttribute('data-title');

  // If the user actually clicked on a trailer...
  if (movieTitle) {

    // Then redirect the user to a new page with that movie's information
    window.location = `./trailer.html?q=${movieTitle}`
  }
}


/////////////////////////////////////////////////////////////////////////////////////
/////////////////// SORTING AND FILTERING FUNCTIONS /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// Get a sorted array of the movie data with newer movies first
function sortbyDateNewerFirst() {

  // Clone array to leave original results untouched
  var toSort = [...movieResults];

  // ES6 Sorting function to sort numbers in descending order
  var result = toSort.sort((firstMovie, secondMovie) => {
    return secondMovie.Year - firstMovie.Year;
  });

  // Return the sorted array
  return result;
}

// Get a sorted array of the movie data with older movies first
function sortbyDateOlderFirst() {

  // Clone array to leave original results untouched
  var toSort = [...movieResults];

  // ES6 Sorting function to sort numbers in ascending order
  var result = toSort.sort((firstMovie, secondMovie) => {
    return firstMovie.Year - secondMovie.Year;
  });

  // Return the sorted array
  return result;
}

// This function will hide or show movie card based on the checkbox marked by the user
function cardRRatedVisibility(){

  // This will return an array with all of the cards that share the same class name
  // and perform a function on each returned card(element)
  document.querySelectorAll('.card-visibility').forEach(card => {

      // Checks if the data attribute r-rate is equal to "R"
      if(card.getAttribute('data-r-rate') === "R" &&

      // AND the checkbox for the "R" rate has been checked by the user
       document.getElementById('filterByRRatedInput').checked){

         // Sets the cards display property to be invisible
        card.style.display = "none";
        
      } else {

        // Else it sets the display property to be visible 
        card.style.display = "block";
      }
 })
}