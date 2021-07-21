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

  // Adds the event handler for the search button
  document.getElementById("searchButton").addEventListener("click", searchBarHandler);

  // Listens to an 'Enter' key for the form to accept input on the keyup
  document.getElementById("searchInput").addEventListener("keyup", enterKeyHandler);

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

// Handle a search request 
function searchBarHandler() {

  // Get the current value of the search text-input
  var searchTerm = document.getElementById("searchInput").value;

  // Save the search term to local storage
  saveSearchTerm(searchTerm);

  // redirect the user to the new page with a parameter of the search term
  window.location = `./search.html?q=${searchTerm}`;

};

// This handler will check if the key pressed was an enter key to accept the input
function enterKeyHandler(event) {
  if (event.key === "Enter") {
    searchBarHandler();
  }
};

// Single function call to set up webpage
init();
