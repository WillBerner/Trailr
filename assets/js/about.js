init()

function init() {

  // This function will add an event listener to the Dom content that is loaded 
  document.addEventListener('DOMContentLoaded', function () {

    // Will assign the elems to all div with the class of parallax
    var elems = document.querySelectorAll('.parallax');

    // Will initiate the parallax
    var instances = M.Parallax.init(elems, 0);
  });
}

