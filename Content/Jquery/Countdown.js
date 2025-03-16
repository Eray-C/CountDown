
$(document).ready(function () {
    GetCountdowns();

});

function AddCountdown() {
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
                GetCountdowns();
                TransactionMessage(1, response.message, "success")
            }
            else {
                TransactionMessage(2, response.message, "error")
            }
        },
        error: function (xhr, status, error) {
            TransactionMessage(2, response.message, "error")

        }
    });
}

function GetCountdowns() {
    $.ajax({
        type: "GET",
        url: "/Countdowns/GetCountdowns",
        cache: false,
        success: function (response) {
            function formatDateForDatetimeLocal(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            }


            var container = $('#countdowns');
            container.html('')
            response.forEach(item => {
                var endDate = new Date(item.EndDate.Date);
                var formattedDate = formatDateForDatetimeLocal(endDate);
                var countdownItemDiv = $(`
              
               
                      <div class="countdown-item mt-3" data-id="${item.Id}"> 
                      <div class="item-container">
                        <h4>${item.Title}</h4>
                        <span class="countdown-timer"></span> 
                        </div>
                        <div class="button-container">
              
                        <button class="delete-button btn btn-danger btn-sm" onclick="DeleteCountdown(${item.Id})">Delete</button>
                        <button class="edit-button btn btn-primary btn-sm">Edit</button>
                        <div class="edit-form " id="update-form" style="display: none;">
                            <input type="text" class="edit-title" value="${item.Title}" placeholder="Yeni başlık" />
                            <input type="datetime-local" class="edit-end-date" value="${formattedDate}" />
                            <button class="update-countdown btn btn-primary btn-sm">Update</button>
                        </div>
                          </div>
                    </div>      `);
                container.append(countdownItemDiv);

                // Edit button click event
                countdownItemDiv.find('.edit-button').on('click', function () {
                    $(this).siblings('.edit-form').toggle();
                });

                // Update button click event
                countdownItemDiv.find('.update-countdown').on('click', function () {
                    EditCountdown($(this).closest('.countdown-item'));
                });
                // Geri sayım başlat
                countdownItemDiv.find('.countdown-timer').countdown(endDate, function (event) {
                    $(this).html(event.strftime('%D days %H hours %M minutes %S seconds'));
                });
            });

            // HTML içeriğini 'countdowns' elementine ekleme işlemi kaldırıldı, çünkü zaten container'a ekleniyor
        },

    });
}

function DeleteCountdown(id) {
    var countdownItem = $('.countdown-item[data-id="' + id + '"]');
    Swal.fire({
        title: 'Bu geri sayımı silmek istediğinizden emin misiniz?',
        text: "Bu işlem geri alınamaz!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'Hayır, iptal et'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/Countdowns/Delete",
                type: 'POST',
                data: { id: id },
                success: function (response) {
                    if (response.success) {
                        GetCountdowns();
                        TransactionMessage(1, response.message, "success");
                    } else {
                        TransactionMessage(2, response.message, "error");
                    }
                },
                error: function (xhr, status, error) {
                    TransactionMessage(2, "Bir hata oluştu. Lütfen tekrar deneyin.", "error");
                }
            });
        }
    });

}

function EditCountdown(itemDiv) {

    var id = itemDiv.data('id');
    var title = itemDiv.find('.edit-title').val();
    var endDate = itemDiv.find('.edit-end-date').val();

    $.ajax({
        type: "POST",
        url: "/Countdowns/UpdateCountdown",
        data: {
            Id: id,
            Title: title,
            EndDate: endDate
        },
        success: function () {

            GetCountdowns();
            TransactionMessage(1)
        },
        error: function (xhr, status, error) {
            TransactionMessage(3)
        }
    });
}