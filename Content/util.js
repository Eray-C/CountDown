$('#save').on('click', function () {
   
    var formData = {
        Enddate: $("#countdownDate").val(),
        Title: $("#countdownTitle").val()
    };

    $.ajax({
        type: "POST",
        url: "/Countdowns/Save",
        data: formData,
        success: function (response) {
            if (response.success) {
                alert(response.message);
            } else {
                alert(response.message);
                console.log("Inner Exception:", response.innerException.message);
                if (response.errors) {
                    console.log("Hatalar:", response.errors);
                }
            }
        },
        error: function (xhr, status, error) {
            alert("Sunucu hatası! Countdown kaydedilemedi. Hata: " + error);
            console.log("Detaylı Hata:", xhr.responseText);
        }
    });
}); 