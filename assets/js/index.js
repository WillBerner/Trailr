

// Get any previous movie search terms the user has already used
// Nonfunctional currently, for future use.
function loadPreviousSearches() {

    // Try to get previous search terms from local storage
    var previousSearchTerms = JSON.parse(localStorage.getItem("prevSearches"));

    // If there exists no terms yet (new user), create new array
    if (!previousSearchTerms) {

        // Create empty arry
        previousSearchTerms = [];

        // Save empty array to local storage
        localStorage.setItem("prevSearches", JSON.stringify(previousSearchTerms));
    }

    // Return array of search terms (possibly empty)
    return previousSearchTerms;
}

// Set up the onclick handler for the search button
function setupSearchHandler() {
    
    // Set the button click handler
    $("#searchButton").on("click", () => {

        // Get the current value of the search text-input
        var searchTerm = $("#searchInput").val()

        // redirect the user to the new page with a parameter of the search term
        window.location = `./search.html?q=${searchTerm}`;

    })
}


// Call all set up functions inside here - event handlers, element creation, other page setup
function init() {

    // Get previous search terms (nonfunctional currently, for future use)
    var prevSearches = loadPreviousSearches();

    // Set up the event handler for the search button
    setupSearchHandler();

}

// Single function call to set up webpage
init();