var countupId;
var startDateTime;
var timerInterval;
var countupList = $('#countupList');

// Sayfa yüklendiğinde tüm countup'ları yükle
$(document).ready(function () {
    loadCountups();
});

// Yeni bir countup başlat
function startCountup() {
    var name = $('#countupName').val();

    if (name && name.trim() !== "") {
        $.ajax({
            url: '/Countups/SaveCountup',
            type: 'POST',
            data: { title: name },
            success: function (response) {
                if (response.success) {
                    countupId = response.id;
                    startCountupTimer(response.data, response.data.StartDate, countupList);
                } else {
                    alert(response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error: ' + error);
            }
        });
    } else {
        alert("Please enter a name for the countup.");
    }
}

// Tüm countup'ları backend'ten al ve listele
function loadCountups() {
    $.ajax({
        url: '/Countups/GetAllCountups',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                countupList.empty(); // Önceki countup'ları temizle

                $.each(response.data, function (index, countup) {
                    var startDateTime = new Date(countup.StartDate);
                    startCountupTimer(countup, startDateTime, countupList); // Her countup için zamanlayıcı başlat
                });
            } else {
                alert("No countups found.");
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + error);
        }
    });
}

// Countup zamanlayıcısını başlat
function startCountupTimer(countup, startDateTime, countupList) {
    var timerInterval = setInterval(function () {
        var now = new Date();
        var difference = now - startDateTime;

        // Gün, saat, dakika, saniye hesaplama
        var days = Math.floor(difference / (1000 * 60 * 60 * 24));
        var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Listeye eklemek ya da güncellemek için ID'ye göre kontrol et
        var listItem = $(`#countup_${countup.Id}`);
        if (listItem.length === 0) {
            countupList.append(`
                <li id="countup_${countup.Id}">
                    <strong>${countup.Title}</strong> - Start Date: ${new Date(countup.StartDate).toLocaleString()}<br>
                    Time Elapsed: ${days}d ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}
                </li>
            `);
        } else {
            listItem.html(`
                <strong>${countup.Title}</strong> - Start Date: ${new Date(countup.StartDate).toLocaleString()}<br>
                Time Elapsed: ${days}d ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}
            `);
        }
    }, 1000); // Her saniyede bir güncellenir
}
