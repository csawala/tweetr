$(document).ready(function() {
  let overCount;
  $(".new-tweet textarea").on("keyup change", function() {
    overCount = 140 - this.value.length
    $(this).siblings(".counter").text(overCount)

    if (overCount < 0) {
      $("span.counter").addClass("excess")
    } else {
      $("span.counter").removeClass("excess")
    }
  })
})