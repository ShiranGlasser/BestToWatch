/*
   The client's implementation of the main page- /list
   sends ajax requesets to the server and presents it to the user 
*/

// /glabal variables for the program/
var moviesList = [];  //saves the data on movies recieved from the server 
var isSeries_val = false; //saves the boolean valus of the last movie's isSeries cell
var series_details_val = [];  //saves the last series's details 


/* when the main page is done loading*/
$(document).ready(function () {

  //call the server to get the movie's list
  $.ajax({
    url: "/movies",
    // dataType: 'json',
    success: function (result) {
      moviesList = (result);
      sortList("date DOWN");
    },
    error: function (err) {
      console.log("err", err);
    }
  });
});


/*
  client's program methods: 
*/

/* called when firs loading the page and in each time the sort button changed
  sorts the global movie's list by the parameter 
  and presents it on the main page to the user */
function sortList(sort) {
  moviesList.sort(function (a, b) {
    let res1, res2;
    if (sort.includes("date")) {
      res1 = a[1].date.split('-').reverse().join();
      res2 = b[1].date.split('-').reverse().join();
    }
    else if (sort.includes("name")) {
      res1 = a[1].name;
      res2 = b[1].name;
    }
    else if (sort.includes("rating")) {
      res1 = a[1].rating;
      res2 = b[1].rating;
    }
    if (sort.includes("UP")) {
      var temp = res1;
      res1 = res2;
      res2 = temp;
    }
    return res1 < res2 ? 1 : (res1 > res2 ? -1 : 0);
  });

  let str = '';
  $.each(moviesList, function (index, value) {
    str += "<div class ='obj' id = 'obj_" + index + "'>"
    str += "<table>";
    str += "<tr>";
    str += "<td><img class='movieImg' src = '" + value[1].picture + "'/></td>"
    str += "<td class='text'><span class='name' id=\"name_" + index + "\"> " + value[1].name + "</span></br>";
    str += "</br><span id=\"id_" + index + "\"> " + value[1].id + " | </span>";
    str += "<span id=\"director_" + index + "\"> " + value[1].director + "</br></span>";
    str += " <span id=\"rate_" + index + "\" > rating is: " + value[1].rating + " |</span>";
    str += "<span> " + value[1].date + "</br></span>";
    if (value[1].isSeries) {
      str += "<span id=\"series_" + index + "\" >Series: </br></span>";
      for (let i = 0; i < value[1].series_details.length; i++) {
        str += "S" + (i + 1) + ": " + value[1].series_details[i] + "eps ";
        if (i + 1 < value[1].series_details.length)
          str += "| ";
      }
    }
    str += "</br></td><td class='buttons' id='bt_" + index + "'>";
    str += "<button class='editMovieB' id='editMovie_" + index + "' onclick=editPage(" + index + ")>Edit Details</button></p>"
    str += "<button class='addActorToMovie' id='addActorToMovie_" + index + "' onclick = 'addAnActor(" + index + ")'>Add an actor</button></p>"
    str += "<button class='deleteMovie' id='deleteMovie_" + index + "' onclick = 'deleteListener(" + index + ")'>Delete Movie</button></p>"
    if (!jQuery.isEmptyObject(value[1].actors)) {
      str += "<div class='actorsButton' id='actorsButton_" + index + "'><button class='watchActors' id='watchActors_" + index + "' onclick = 'watchActorsListener(" + index + ")'>Watch Actors</button></div>"
    }
    str += "</td></tr></table></div>"

  });
  $("#moviesTable").html(str);
};
// /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/


/*
   buttons: 
*/

/* connects the client to the edit page when pressing the "edit movie" button*/
const editPage = (movieID) => {
  location.href = 'editMovie?id=' + moviesList[movieID][0];
}
// /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/

/* calles when the "delete movie" button pressed
   recieves the index location of the wanted movie in the movie list,
   calles the server with the movie's id to the delete method */
function deleteListener(index) {
  $.ajax({
    type: 'DELETE',
    url: 'http://localhost:3001/movie/' + moviesList[index][1].id,
    contentType: 'application/json',
    success: function (data, textStatus, jQxhr) {
      alert(data);
      location.href = "/list";
    },
    error: function (data, jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  })
}
// /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/

/* calles when the "watch actors" button pressed
recieves the index location of the wanted movie in the movie list,
builds the actor's list and presents it to the user in a modal */
function watchActorsListener(i) {
  str = "<h1 class='actorsTitle'>" + moviesList[i][1].name + "'s actors</h1>";
  $.each(moviesList[i][1].actors, function (index, value) {
    str += "<div class='actor'>"
    str += "<div class='name' id='name_" + index + "'>" + value.name + "</div>"
    str += "<img class='actorpicture' src='" + value.picture + "'/>"
    str += "<a href='"+value.site+"'>Actor's website</a>"
    str += "<button class='deleteActorB' id='deleteActor_" + index + "' onclick = 'deleteActorListener(" + i + ", \"" + index + "\")'>- delete</button>"
    str += "</div>"
  })
  $("#actorsList").html(str);

  // /show the data on the modal/
  var modal = document.getElementById("actorsModal");

  //open the modal 
  modal.style.display = "block";

  // close the modal
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

}
// /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/

/* calles when the "delete" button of an actor pressed
   recieves the location of the wonted movie in the movie list-as i,
   and the wanted actor's name- as index
   calles the server with the parameters to the delete actor's method */
function deleteActorListener(i, index) {
  $.ajax({
    type: 'DELETE',
    url: 'http://localhost:3001/actor/' + moviesList[i][1].id + "/" + index,
    contentType: 'application/json',
    success: function (data, textStatus, jQxhr) {
      alert(data);
      location.href = "/list";
    },
    error: function (data, jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  })
}
// /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/

/* calles when the "add an actor" button pressed
   recieves the location of the wonted movie in the movie list-as i,
   pops the user a form to fill with the actor's details and sends them to the server
   to the add actor's method */
function addAnActor(i) {
  //pops the form
  document.getElementById("myForm").style.display = "block";
  $("#titleOfAddActor").html("<h1>Add An Actor To " + moviesList[i][1].name + "</h1>");
  $("#form-container").submit(function (event) { //when the user submits the popup form
    if (!$("#name").val() || !$("#picture").val() || !$("#site").val()) //validates the input
      alert("couldn't add the actor");
    else {
      //calls the server
      $.ajax({
        type: 'PUT', // define the type of HTTP verb we want to use (POST for our form)
        url: 'http://localhost:3001/actor/' + moviesList[i][0], // the url where we want to PUT
        contentType: 'application/json',
        data: JSON.stringify({
          "name": $("#name").val(),
          "picture": $("#picture").val(),
          "site": $("#site").val()
        }),
        processData: false,
        encode: true,

        success: function (data, textStatus, jQxhr) {
          alert(data);
          location.href = "/list";
        },
        error: function (jqXhr, textStatus, errorThrown) {
          alert("Couldn't add the actor");
          location.href = "/list";
        }
      })
      // stop the form from submitting the normal way and refreshing the page
      event.preventDefault();
    }
  });
}

/*closes the popup form that presents to the user when adding an actor, 
calleds when the close button in the form is pressed */
function closeForm() {
  document.getElementById('myForm').style.display = "none";
}