var searchButton = document.getElementById("searchButton");
var searchInputEl = document.getElementById("searchInput");


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

  // Adds a random "movies" background
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?movie')`;

}

var searchBarHandler = function () {
  // Get the current value of the search text-input
  var searchTerm = searchInputEl.value;

  // redirect the user to the new page with a parameter of the search term
  window.location = `./search.html?q=${searchTerm}`;
};

// This handler will check  if the key pressed was an enter key to accept the input
var enterKeyHandler = function (event) {
  if (event.key === "Enter") {
    searchBarHandler();
  }
};

// Adds the event handler for the search button
searchButton.addEventListener("click", searchBarHandler);

// Listens to an 'Enter' key for the form to accept input on the keyup
searchInputEl.addEventListener("keyup", enterKeyHandler);

// Single function call to set up webpage
init();
