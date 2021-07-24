// During production and testing, replace with your own key please :)
const STREAMING_INFO_KEY = "daa11a7f40msh6e1ece24c7b095dp1df636jsn01c0d63b2684";
const YOUTUBE_API_KEY = "AIzaSyDfqFtp0qlTg8E5PQqIj7nGkMOupJ5ZyD0";
const OMBD_API_KEY = "f3ecd794";

// Start her up!
init();

// Starts up the page - sets up event handlers and renders movie info
async function init() {

  // Get results for the movie title
  await getSearchedTrailer();

  // Set up event handlers for the page
  setupEventHandlers();
}

// Attempt to get data from the URI and call APIs based on info
async function getSearchedTrailer() {

  // Get movie title from URL parameters
  var url = new URL(window.location.href);
  var movieTitle = url.searchParams.get("q");

  // If a user tries to search without a query string, return them to the home page.
  if (!movieTitle) {
    window.location = "./index.html";
  }

  // Calls the getPostersInfo and searchTrailer functions and pass in the movieTitle as parameter
  getPosterInfo(movieTitle);
  return await searchTrailer(movieTitle);
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////// API QUERY FUNCTIONS /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// This function makes an API call to YouTube to get the movie trailer ID for a movie title
async function searchTrailer(movieTitle) {

  // Create a search request URI with a given movie title
  const requestUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movieTitle}%20trailer&key=${YOUTUBE_API_KEY}`;

  // Attempt to fetch data asynchronously ("await") for the movieTitle
  var result = await fetch(requestUrl)

    // Standard getting json from response
    .then((response) => response.json())

    // Return the actual data we care about (stored in result variable)
    .then((data) => {
      return data;
    })
    // Log any errors that occur
    .catch((error) => console.log(error));

  // Calls the renderVideoPlayer function and pass in the video id
  renderVideoPlayer(result.items[0].id.videoId);
}

// This function makes an API call to detemine the streaming availability of the movie
// using it's IMDB ID and renders an IMDB link and possibly a netflix link to the page
function servicesLinkGetter(data) {

  // Create a search request URI for the given imdbID
  var requestUrl = `https://streaming-availability.p.rapidapi.com/get/basic?country=us&imdb_id=${data.imdbID}`;

  // Make an api call with given URL
  fetch(requestUrl, {
    method: "GET",
    headers: {
      "x-rapidapi-key": STREAMING_INFO_KEY,
      "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
    },
  })
    // Gets a JSON object containing the data needed
    .then((response) => response.json())

    // Once gets the data calls makeLinks function and passing in the data
    .then((data) => renderLinks(data))

    //  Log any errors that occur
    .catch((error) => {
      console.error(error);
    });
}

// This function makes an API call to fetch the movie info and then calls functions to render it
function getPosterInfo(movieTitle) {

  // Create a search request URI for the given movieTitle
  var requestUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${OMBD_API_KEY}`;

  // Makes an api call for the given title
  fetch(requestUrl)
    // Gets a JSON object containing the data needed
    .then((response) => response.json())

    // Once gets the data calls renderPosterCards then call servicesLinkGetter
    .then((data) => {
      renderMovie(data);
      servicesLinkGetter(data);
    })

    // Log any errors that occur
    .catch((error) => console.log(error));
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////// RENDERING FUNCTIONS /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// Function to create links to the IMDB page of the searched movie as well as to netflix.
function renderLinks(data) {

  // Sets imdb button to be visible
  document.getElementById("imdb").style.display = "inline-block";

  // Sets the data-set attribute to be the imdb link for the given movie
  document.getElementById("imdb").setAttribute(
    "data-service",
    `https://www.imdb.com/title/${data.imdbID}`
  );

  // Checks if this path exist that means the movie is available in the netflix database
  if (data.streamingInfo.netflix) {

    // if exists set netflix button to be visible
    document.getElementById("netflix").style.display = "inline-block";

    // Sets the data-set attribute to be the netflix link for the given movie
    document.getElementById("netflix").setAttribute(
      "data-service",
      data.streamingInfo.netflix.us.link
    );
  }
}

// Function for rendering extra, less important info
function renderMovieExtraInfo(data) {
  document.getElementById("info-rating").textContent = `Rating: ${data.imdbRating}`;
  document.getElementById("info-genre").textContent = `Genre: ${data.Genre}`;
  document.getElementById("info-director").textContent = `Director(s): ${data.Director}`;
  document.getElementById("info-writer").textContent = `Writer(s): ${data.Writer}`;
  document.getElementById("info-language").textContent = `Language: ${data.Language}`;
  document.getElementById("info-released").textContent = `Release Date: ${data.Released}`;
}

// The renderMovieInfo will dynamically add the gathered data from the Api call in the appropriate divs
function renderMovie(data) {

  // Display a color on the IMDB rating based on the score
  renderRatingColor(data.imdbRating);

  // Render extra, less important movie info
  renderMovieExtraInfo(data);

  // Populate html elements with movie data
  document.getElementById("poster").src = data.Poster;
  document.getElementById("title").textContent = data.Title;
  document.getElementById("rating").textContent = `${data.imdbRating}`
  document.getElementById("movie-info").textContent = `${data.Year} / ${data.Runtime} / ${data.Rated} / ${data.Genre}`;
  document.getElementById("movie-actors").innerHTML = `${data.Actors}`;
  document.getElementById("movie-summary").innerHTML = data.Plot;
}

// Embeds the trailer video to the page
function renderVideoPlayer(videoId) {
  document.getElementById("player").innerHTML = `

  <iframe class="hoverable" type="text/html" width="100%" height="420px"
     src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=https://example.com"
     frameborder="0" allowfullscreen>
  </iframe>

`;
}

// Set the color of the score of the movie based on its value
function renderRatingColor(score) {

  // If an IMDB score doesn't exist (yet to be released movies, or movies with no rating)
  if (score == "N/A") {
    document.getElementById("rating").style.color = "Black";
    return;
  } else if (score == undefined) {
    document.getElementById("rating").style.color = "Black";
    document.getElementById("rating").innerText = "N/A";
  }

  if (score >= 8) {
    document.getElementById("rating").style.color = "Lime";
  } else if (score >= 6) {
    document.getElementById("rating").style.color = "OliveDrab";
  } else if (score >= 4) {
    document.getElementById("rating").style.color = "Gold";
  } else if (score >= 2) {
    document.getElementById("rating").style.color = "Peru";
  } else {
    document.getElementById("rating").style.color = "Red";
  }
}

/////////////////////////////////////////////////////////////////////////////////////
/////////////////// EVENT HANDLER FUNCTIONS /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// This function sets up event handlers for the page
function setupEventHandlers() {

  // initiate an event listener for the buttons in the streaming services div
  document.getElementById("streaming-services").addEventListener("click", handleServices);

  // Add event listener to redirect to previous page
  document.getElementById("backToResultsButton").addEventListener("click", handleBackButton);
}

// Event handler for clicking on the imdb or netflix links
function handleServices(event) {

  // Gets the link from the clicked button
  var service = event.target.getAttribute("data-service");

  // Checks if the service has the link or not
  if (service !== null) {

    // Checks if the link contains the key word imdb
    if (service.includes("imdb")) {

      // Opens the imdb movie link in a new tab
      window.open(service, "_blank");
    }

    // Checks if the link contains the key word netflix
    if (service.includes("netflix")) {

      // Opens the netflix movie link in a new tab
      window.open(service, "_blank");
    }
  }
}

// Event listener to redirect the user to the previous search page
function handleBackButton() {

  // Get the most recently searched term
  var lastSearchedTerm = localStorage.getItem("prevSearchTerm");

  // Reload the search page with that term
  window.location = `search.html?q=${lastSearchedTerm}`;

}