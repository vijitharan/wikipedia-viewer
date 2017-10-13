$(document).ready(function() {
  var search = $(".search");
  var searchInput = $("#search-input");
  var form = $("#form-container");

  // //modal window
  search.click(function() {
    $("#modal, .form-container").fadeIn(200);
  });

  $("#modal").click(function(event) {
    if (event.target == $("#modal").get(0)) {
      closeModal();
    }
  });

  $(".close-btn").click(closeModal);

  function closeModal() {
    $("#modal, .form-container").fadeOut(200);
  }

  //random article
  $(".random-btn").attr("href", "https://en.wikipedia.org/wiki/Special:Random");

  //search functions
  searchInput.keypress(function(event) {
    if (event.which === 13) {
      searchData();
    }
  });

  $(".search-btn").click(searchData);

  function searchData() {
    if (searchInput.val() !== "") {
      loadData(searchInput.val());
    }
  }

  function loadData(searchValue) {
    $.ajax({
      type: "GET",
      jsonp: "callback",
      dataType: "jsonp",
      url: "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + searchValue + "&callback=?",
      success: function(data) {
        renderHtml(data);
      },
      error: function() {
        $("h5").remove();
        $(".navbar").prepend("<h5> Failed to Load Wikipedia Articles, Please Try Again.</h5>");
        $("h5").fadeIn(500);
      }
    });
    searchInput.val("");
    closeModal();
    $(".container").fadeIn(1000);
    $(".navbar").css("height", "auto");
    $(".center").removeClass("center");
    $(".navbar h1").css("float", "left");
    $(".navbar h1").addClass("hide");
    $("#btn-wrapper").css({
      float: "right",
      padding: "15px 0"
    })
    $("#btn-wrapper").addClass("nav-center");
  }

  function renderHtml(data) {
    $(".article a, hr, h5").remove();
    for (var i = 0; i < data[1].length; i++) {
      $(".article").append("<a href='" + data[3][i] + "' target='_blank'>" + "<h4>" + data[1][i] + "</h4>" + "<p>" + data[2][i] + "</p>" + "</a> <hr>");
    }
  }

  //Autocomplete
  searchInput.keyup(function(event) {
    $.ajax({
      type: "GET",
      jsonp: "callback",
      dataType: "jsonp",
      url: "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + searchInput.val() + "&callback=?",
      success: function(data) {
        $(".dropdown li").remove();
        $.each(data[1], function(index, value) {
          $(".dropdown").append("<li>" + value + "</li>");
        });
        $(".dropdown li").click(function() {
          loadData($(this).text());
          $(".dropdown li").remove();
        });
      },
      error: function() {
        $(".dropdown li").remove();
        $(".dropdown").append("<li>" + "No Connection" + "</li>");
      }
    });
  });
});
