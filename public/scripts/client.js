$(document).ready(function() {

  // if flash message exists, set timeout to fade out message after 5 seconds
  (function () {
    var checkForFlashMessage = $('.flashMessage').html();
    if (checkForFlashMessage) {
      setTimeout(function() {
        $('.flashMessage').fadeOut('slow');
      }, 5000);
    }
  })();
  // if dropdown div is clicked display links
  $('.dropdown').on('click', function() {

    var myDropDown = document.getElementById('myDropdown');

    if (myDropDown.classList.contains("show")) {
      $('#myDropdown').removeClass('show');
    } else {
      $('#myDropdown').addClass('show');
    }
  });
});
