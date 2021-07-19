// During production and testing, replace with your own key please :)
const YOUTUBE_API_KEY = "AIzaSyBGxVo7_RMKBhuuaFv46AYeAQbw1U7uquE";
const OMBD_API_KEY = "57046b00";

// Call YouTube API to get the movie trailer Id for a movie title
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

// -------------------------------------------------------------------------
function getPosterInfo(movieTitle) {
  // Create a search request URI for the given movieTitle
  var requestUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${OMBD_API_KEY}`;

  // Makes an api call for the given title
  fetch(requestUrl)
    // Gets a JSON object containing the data needed
    .then((response) => response.json())

    // Once gets the data calls renderPosterCards
    .then((data) => renderMovieInfo(data))

    // Log any errors that occur
    .catch((error) => console.log(error));
}

async function getSearchedTrailer() {
  // Get movie title from URL parameters
  var url = new URL(window.location.href);
  var movieTitle = url.searchParams.get("q");

  // Calls the getPostersInfo and searchTrailer functions and pass in the movieTitle as parameter
  getPosterInfo(movieTitle);
  return await searchTrailer(movieTitle);
}

async function init() {
  // Get results for the movie title
  var movieTitle = await getSearchedTrailer();
}

// Embeds the trailer video to the page
function renderVideoPlayer(videoId) {
  document.getElementById("player").innerHTML = `

  <iframe class="hoverable" type="text/html" width="640" height="360"
     src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=https://example.com"
     frameborder="0" allowfullscreen>
  </iframe>

`;
}

function renderMovieInfo(data) {
  document.getElementById("poster").src = data.Poster;
  document.getElementById("title").innerHTML = data.Title;
  document.getElementById("movie-info").innerHTML = `
    Date: ${data.Year}<br>
    IMBD Rating: ${data.imdbRating}<br>
    Actors: ${data.Actors}<br>
    Genre: ${data.Genre}<br>
    Awards: ${data.Awards}<br>
    Box Office: ${data.BoxOffice}<br>
    Runtime: ${data.Runtime}<br>
  `;
  document.getElementById("movie-summary").innerHTML = data.Plot;
}

init();
