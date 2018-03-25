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

    if (myDropDown.classList.contains('show')) {
      $('#myDropdown').removeClass('show');
    } else {
      $('#myDropdown').addClass('show');
    }
  });

  $('#newPollButton').on('click',function() {

    $('.newPollDiv').addClass('show');
    $('.myPollsDiv').removeClass('show');
  });

  $('#myPollsButton').on('click',function() {

    $('.myPollsDiv').addClass('show');
    $('.newPollDiv').removeClass('show');
  });

  // button to add input field in poll options
  $('.options-button').on('click', function() {

    var html = '<input type="text" class="form-control" name="options[]" placeholder="" required>';
    var last = $('.optionsDiv').children().last().val();
    console.log(last);

    if(last !== "") {
      $('.optionsDiv').append(html);
    } else {
      alert('Fill options completely before adding more input');
    }
  });


});
