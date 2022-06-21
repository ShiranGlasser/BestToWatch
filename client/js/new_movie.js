/*
   The implemitation page of the user's adding a new movie
   when the user presses on the 'add movie' button, the add form page is shown-/addMovie 
*/

//global variables for the program
var isSeries_val = false; //saves the boolean valus of the last movie's isSeries cell
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

/* when the add movie form page is done loading*/
$(document).ready(function () {

  //defines behaviors for the isSeries cells on the form bhen selecting series/movie
  $('#seasonsDiv').hide();
  $('#isSeries_').change(function () {
    $('#seasonsDiv').show();
    isSeries_val = true;
  });
  $('#isMovie_').change(function () {
    $('#seasonsDiv').hide();
    isSeries_val = false;
  });


  // Specify validation rules
  $("form[name='movie_form']").validate({
    rules: {
      "name": {
        required: true,
      },
      "id_field": {
        required: true,
      },
      "date": {
        required: true,
        date: true
      },
      "picture": {
        required: true,
        url: true,
      },
      "director": {
        required: true,
      },
      "rating": {
        required: true,
        digits: true,
      },
    },
    // Specify validation error messages
    messages: {
      name: "a name is required",
      id_field: "an ID is required",
      picture: "enter a valit picture url",
      director: "a director's name is required",
      rating: "enter rating between 1 to 5",
      isSeries: "enter if it is a series",
      date: "enter a valid date"
    }
  });

  //when the user is finished filling the new movie's details and submitting the form
  $("#movie_form").submit(function (event) {

    //checks the input details
    if (!$("#movie_form").valid()) {
      console.log("not valid details");
      return;
    }
    //saves the form details
    let movieData = {
      "id": $("#id_field").val(),
      "name": $("#moviename").val(),
      "picture": $("#picture").val(),
      "director": $("#director").val(),
      "date": String($('#date').val().split("-").reverse().join("-")),
      "rating": parseInt($("#rating").val()),
      "isSeries": isSeries_val
    };
    if (isSeries_val) {
      handleEpisodes();
      movieData["series_details"] = series_details_val;
    }

    //calls the server to add the movies with the new details given
    $.ajax({
      type: 'post', //  POST for our form
      url: 'http://localhost:3001/movie', // the url of the server's method
      contentType: 'application/json',
      data: JSON.stringify(movieData),
      processData: false,
      encode: true,
      success: function (data, textStatus, jQxhr) {
        alert(data);
        location.href = "/list";
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus);
        location.href = "/list";
      }
    })
    event.preventDefault();

  });
});