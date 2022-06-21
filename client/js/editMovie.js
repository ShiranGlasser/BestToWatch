/*
   The implemitation page of the user's editing a movie
   when the user presses on the 'edit movie' button, the edit page is shown-/editMovie 
*/

//global variables for the program
var movieDetails;//saves the data on movies recieved from the server 
var isSeries_val = false;//saves the boolean valus of the last movie's isSeries cell
var series_details_val = []; //saves the last series's details 

/*
 help method.
 saves the inputs new detals of the series  
*/
function handleEpisodes() {
  series_details_val = [];
  for (let i = 0; i < $('#seasons').val(); i++) {
    let s = "#episode_" + i;
    series_details_val[i] = parseInt($(s).val());
  }
};
/*
     calleds when the isSeries button on the details form is changed.
     saves the inputs new detals of the series 
    */
function handleSeasons() {
  let str = "</p><b>Enter for each season its number of episodes:</b></p>";
  for (let i = 0; i < parseInt(document.getElementById('seasons').value); i++) {
    str += "<label for='episode_" + i + "'>Season " + (i + 1) + ":</label><input id='episode_" + i + "' type='number' min='1' required ></p>";
  }
  document.getElementById('episodesDiv').innerHTML = str;
};


/* when the edit movie form page is done loading*/
$(document).ready(function () {
  //gets the parameters the sent with the page calling
  const urlParams = new URLSearchParams(window.location.search);
  const movieID = urlParams.get('id');
  //calls the server to get the movies details and saves them localy
  $.ajax({
    type: 'GET',
    async: false,
    url: 'movie/' + movieID,
    success: function (result) {
      movieDetails = result;
    },
    error: function (error) {
      alert(error.responseText, false);
      window.location.href = '/';
    },
  });


  //prepper the form with the movies current details
  if (movieDetails.isSeries) {
    $('#seasonsDiv').show();
    $("#isSeries_").prop("checked", true);
    isSeries_val = true;
    document.getElementById('seasons').value = movieDetails.series_details.length;
    let str = "</p><b>Enter for each season its number of episodes:</b></p>";
    for (let i = 0; i < movieDetails.series_details.length; i++) {
      str += "<label for='episode_" + i + "'>Season " + (i + 1) + ":</label><input id='episode_" + i + "' type='number' min='1' value='" + movieDetails.series_details[i] + "'></p>";
    }
    document.getElementById('episodesDiv').innerHTML = str;
  }
  else {
    $('#seasonsDiv').hide();
    $("#isMovie_").prop("checked", true);
    isSeries_val = false;

  }

  //defines the radio buttons action when changing from movie/series
  $('#isSeries_').change(function () {
    $('#seasonsDiv').show();
    isSeries_val = true;
  });
  $('#isMovie_').change(function () {
    $('#seasonsDiv').hide();
    isSeries_val = false;
  });

  //place the form with the current movie's details and presents it to the user
  putForm();

  //when the user is finished filling the new details and submitting the form
  $("#movie_form").submit(function (event) {
    //saves the new details and updated the movie
    let updateM = {};
    if ($("#moviename").val()) {
      updateM.name = $("#moviename").val();
    }
    if ($("#picture").val()) {
      updateM.picture = $("#picture").val();
    }
    if ($("#director").val()) {
      updateM.director = $("#director").val();
    }
    if ($("#date").val()) {
      updateM.date = $("#date").val();
    }
    if ($("#rating").val()) {
      updateM.rating = $("#rating").val();
    }
    if (!(movieDetails.isSeries && isSeries_val)) {
      if (!isSeries_val)
        updateM.isSeries = false;
      else {
        updateM.isSeries = true;
        handleEpisodes();
        updateM.series_details = series_details_val;
      }
    }
    else {
      //the isSeries cell didnt change
      if (isSeries_val) {
        handleEpisodes(); //if it is still a series the episodes could change
        updateM.series_details = series_details_val;
      }
    }

    //calls the server to update the movies with the new details given
    if (!jQuery.isEmptyObject(updateM)) {
      $.ajax({
        type: 'PUT',
        url: 'http://localhost:3001/movie/' + movieID,
        contentType: 'application/json',
        data: JSON.stringify(updateM),
        processData: false,
        encode: true,
        success: function (data, textStatus, jQxhr) {
          alert(data);
          location.href = "/list";
        },
        error: function (data, jqXhr, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      })
      event.preventDefault();
    }
  });
})

//help method to prepper the form for the user with the current movie's details 
function putForm() {
  $("#formTitle").html("<h1>Edit " + movieDetails.name + "</h1>");

  document.getElementById('moviename').placeholder = movieDetails.name;
  document.getElementById('picture').placeholder = movieDetails.picture;
  document.getElementById('director').placeholder = movieDetails.director;
  document.getElementById('date').value = movieDetails.date.split('-').reverse().join('-');
  document.getElementById('rating').placeholder = movieDetails.rating;

}