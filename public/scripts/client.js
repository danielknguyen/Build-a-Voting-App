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

    var authNav = document.getElementById('authNav');
    var notAuthNav = document.getElementById('notAuthNav')

    if (notAuthNav) {
      if (notAuthNav.classList.contains('show')) {
        $('#notAuthNav').removeClass('show');
      } else {
        $('#notAuthNav').addClass('show');
      }
    };

    if (authNav) {
      if (authNav.classList.contains('show')) {
        $('#authNav').removeClass('show');
      } else {
        $('#authNav').addClass('show');
      }
    };

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

    var html = '<input type="text" class="form-control" name="options[]" placeholder="" maxlength="50" required>';
    var last = $('.optionsDiv').children().last().val();
    console.log(last);

    if(last !== "") {
      $('.optionsDiv').append(html);
    } else {
      alert('Fill options completely before adding more input');
    }
  });

  // get poll id to request data in ajax
  // var pollId = document.getElementById("poll_name");
  var pollIdVal = $('#poll_name').attr('value');

  // send ajax request if retrieved pollIdVal is not undefined
  if (pollIdVal !== undefined) {

    $.ajax({
      url: "https://arcane-stream-17570.herokuapp.com/chartjs/polls/api/data/" + pollIdVal,
      type: "GET",
      success: function(data) {
        // console.log(data.poll_name);
        // console.log(data.data);
        var options = data.options;
        var optionsData = data.data;
        var data = [];

        for (var i = 0; i < optionsData.length; i++) {
          data.push(optionsData[i].totalVotes);
        };
        // console.log(data);

        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: options,
              datasets: [{
                  label: '# of Votes',
                  data: data,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                        display: false
                      },
                      gridLines: {
                        display:false,
                        drawBorder: false
                      }
                  }]
              }
          }
        });
      },
      error: function(data) {
        console.log('error data: ' + data);
      }
    });
  };

  // share fb
  $.ajaxSetup({ cache: true });
  $.getScript('https://connect.facebook.net/en_US/sdk.js', function() {

    FB.init({
      appId: '161499961229671',
      version: 'v2.7' // or v2.1, v2.2, v2.3, ...
    });

    $('#shareBtn').on('click', function() {

      var url = $('#shareBtn').attr('value');

      FB.ui({
        method: 'share',
        href: url,
      }, function(response) {

      });

    });

  });

});
