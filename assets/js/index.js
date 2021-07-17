// JS FOR HOME PAGE 

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
  // Get previous search terms (nonfunctional currently, for future use)
  var prevSearches = loadPreviousSearches();

  // Adds a random movie as the background using jQuery
  $(`body`).css(`backgroundImage`, `url('https://source.unsplash.com/1600x900/?movie')`);

  // Adds the event handler for the search button using jQuery
  $(`#searchButton`).on("click", searchBarHandler);

  // Listens for the 'Enter' key being pressed rather than a button click
  $(`#searchInput`).on("keyup", enterKeyHandler);

}

// Redirect the user to the results page w/ current search term
var searchBarHandler = function () {

  // Get the current value of the search text-input using jQuery
  var searchTerm = $(`#searchInput`).val();

  // redirect the user to the new page with a parameter of the search term
  window.location = `./search.html?q=${searchTerm}`;
};

// This handler will check  if the key pressed was an enter key to accept the input
var enterKeyHandler = function (event) {
  if (event.key === "Enter") {
    searchBarHandler();
  }
};

// Single function call to set up webpage
init();
