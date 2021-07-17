// During production and testing, replace with your own key please :)
const YOUTUBE_API_KEY = "AIzaSyBGxVo7_RMKBhuuaFv46AYeAQbw1U7uquE";

// Call YouTube API to get trailer data for a movie title
async function searchTrailer(movieTitle) {
  // Create a search request URI with a given movie title
  const requestUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movieTitle}&key=${YOUTUBE_API_KEY}`;

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

async function getSearchedTrailer() {
  // Get movie title from URL parameters
  var url = new URL(window.location.href);
  var movieTitle = url.searchParams.get("q");

  // Return the result of calling the searchTrailer function with the movieTitle
  return await searchTrailer(movieTitle);
}



async function init() {
  // Get results for the searched term
  var movieTitle = await getSearchedTrailer();

  // Adds a random "movies" background
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?movie')`;

}

// Embeds the trailer video to the page
var renderVideoPlayer = function (videoId) {
  document.getElementById("player").innerHTML = `

  <iframe class="z-depth-5 hoverable valign-wrapper" type="text/html" width="1280" height="720"
     src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=https://example.com"
     frameborder="0" allowfullscreen>
  </iframe>

`;
};

init();
