function startCountdown() {
    
    var dateValue = $('#countdownDate').val();
    var titleValue = $('#countdownTitle').val();

    if (dateValue === "" || titleValue === "") {
        alert("Please enter both a date and a title.");
        return;
    }


    var countdownDate = new Date(dateValue);
    var countdownTitle = titleValue;


    var titleDisplayElement = document.getElementById('countdownTitleDisplay');
    if (titleDisplayElement) {
        titleDisplayElement.innerText = countdownTitle;
    }

    var countdownElement = $('<div class="col-md-12 countdown-item mt-3"></div>');
    var titleElement = $('<h4></h4>').text(countdownTitle);
    var countdownDisplayElement = $('<div class="countdown-display"></div>');


    countdownElement.append(titleElement);
    countdownElement.append(countdownDisplayElement);
    $('#countdowns').append(countdownElement);

  
    countdownDisplayElement.countdown(countdownDate, function (event) {
        $(this).html(event.strftime('%D days %H hours %M minutes %S seconds'));
    });


    //$('#countdownTitle').val('');
    //$('#countdownDate').val('');
}

function Login() {
    $('#loginModal').modal('show');
    var username = $('#username').val();
    var password = $('#password').val();

   

    // Modalı kapat
    $('#loginModal').modal('hide');
}
function Close() {
    // Modalı kapat
    $('#loginModal').modal('hide');
}
