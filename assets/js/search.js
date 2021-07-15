
// Call OMDb API to get movie data for a search term
async function searchMovie(searchTerm) {
    
    // During production and testing, replace with your own key please :)
    const API_KEY = "f3ecd794";

    // Create a search request URI with a given search term
    const QUERY_URI = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`;

    // Attempt to fetch data asynchronously ("await") for the searchTerm
    var result = await fetch(QUERY_URI)

    // Standard getting json from response
    .then(response => response.json())

    // Return the actual data we care about (stored in result variable)
    .then(data => {
        return data;
    })

    // Log any errors that occur
    .catch(error => console.log(error));

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

    // Just to show that the results do appear successfully
    console.log(results);

    // Loop over each result to render them
    results.forEach(result => {

        // Create a new elemt with jQuery and set its text using ES6 String Templates
        var resultEl = $("<h6/>").text(`Title: ${result.Title}, year: ${result.Year}`);
        
        // Append each resulting element to a div in the html
        $("#results").append(resultEl);
    });

}

// Single function call to set up webpage
init();