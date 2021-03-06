'use strict'


function submitTweetInput() {     // =========== SUBMIT TWEET FORM
  $('.new-tweet form').on('submit', function(event) {
    let text = $(this).find('textarea').val()

    if (text.length > 140) {
      $('.notice').html('Nuh uh uh! Too many letters!')
    } else if (!text) {
      $('.notice').html('Did you plan on writing something?')
    } else {
      $.ajax('/tweets/', {
        method: 'POST',
        data: { text },     // text.text can be referred like this apparently
      }).then((res) => {  // post submitted text info and reset/clear conditional data
        $('textarea').val('')
        $('.notice').html('')
        $('.counter').html('140')
        loadTweets()
      }, () => {   // need an error handler of sorts here?
        console.log('The call failed')
      });
    }
    event.preventDefault() // prevents page from reloading after submission
  })
}

function toText(input) {    // ================ CONVERT INPUT TO 'SAFE' TEXT
  let escape = document.createElement('escape');
  escape.appendChild(document.createTextNode(input));
  return escape.innerHTML;
}

function createTweetElement(data) {       // =============== TAKE DATA AND HTMLIFY
  // Define variables to necessary elements for readability
  const inIcon = toText(data.user.avatars.small)
  const inName = toText(data.user.name)
  const inHandle = toText(data.user.handle)
  const inContent = toText(data.content.text)
  // Date & Time Capture & Conversion
  const fullTime = new Date(data.created_at)      // Convert "created_at" to a date field
  const inDate = fullTime.toDateString()          // Capture DDD MMM YYYY
  const inTime = fullTime.toLocaleTimeString()    // Capture HH:MM:SS AM/PM

  // full tweet w/ necessary HTML formatting
  let output =
    `<article>
      <header>
        <img class="icon" src="${inIcon}">
        <h2 class="name">${inName}</h2>
        <h5 class="handle">${inHandle}</h5>
      </header>
      <p class="content">${inContent}</p>
      <footer>
        ${inDate} @ ${inTime}
        <span class="reactions">
          <i class="fa fa-flag"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </span>
      </footer>
    </article>`

  return output
}

function renderTweets(data) {       // ================ GO THROUGH TWEET DB AND APPEND
  let output = sortTweets(data)
  output.forEach(function(key) {
    $('.old-tweet').append(createTweetElement(key))
  })
}

function sortTweets(data) {     // =========== SORT TWEETS BY created_at FIELD
  let history = data
  history.sort(function(current, next) {
    if (current.created_at < next.created_at) {     // in order to have sort be desceding (newest first)
      return 1;
    }
    if (current.created_at > next.created_at) {
      return -1;
    }
  })

  return history
}

function loadTweets() {       // ========== FETCH TWEETS FROM DB
  $.getJSON('/tweets/', function(data) {
    $(".old-tweet").empty();  // CLEAR MAIN PAGE BEFORE REWRITING
    renderTweets(data)
  })
}

function composeToggle() {        // ========== TOGGLE COMPOSE/NEW TWEET SECTION
  $('#compose-box').on('click', function() {
    $('.container .new-tweet').slideToggle('fast', function(){
      $('.new-tweet textarea').focus()
    })
  })
}

$(document).ready(function() {
  loadTweets()    //  LOAD TWEETS FROM DB & ONCE LOADED RENDER THEM TO PAGE
  submitTweetInput()
  composeToggle()
})