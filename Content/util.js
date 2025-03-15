const now = new Date().toISOString().slice(0, 19);

$(document).ready(function () {
    GetCountdowns();

});

//Kayıt Ekleme İşlemi
function AddCountdown() {
    var date = $('#dateBox').dxDateBox("instance");
    var title = $('#textBoxContainer').dxTextBox("instance");
    var formData = {
        Enddate: $('#dateBox').dxDateBox("instance").option("value"),
        Title: $('#textBoxContainer').dxTextBox("instance").option("value")
    };

    $.ajax({
        type: "POST",
        url: "/Countdowns/Save",
        data: formData,
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Countdown is recorded',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
                GetCountdowns();

                date.option("value", now);
                title.option("value", null);
             console.log(formData.Title.option("value"))
            }
            else if (formData.Title.option("value") === '' || formData.Title.option("value") === null || formData.Enddate.option("value") === '' || formData.Title.option("value") === null) {
                Swal.fire({
                    title: 'Warning!',
                    text: 'Title or date cannot be empty',
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                });
            }
            else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Countdown is not recorded' + response.innerException,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                console.log("Inner Exception:", response.innerException ? response.innerException.message : 'No inner exception provided');
            }
            if (response.errors) {
                console.log("Errors:", response.errors);
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: 'Server Error!',
                text: 'Countdown could not be recorded. Error: ' + error,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            console.log("Detailed Error:", xhr.responseText);
        }
    });
}



//Kayıt Çekme İşlemi
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


            console.log(response);
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
                                    <div class="edit-form" id="update-form" style="display: none;">
                                     <div class="row">
                                        <div class="col-md-3">
                                        <div id="textBoxContainer-${item.Id}" class="mb-3"></div>
                                             </div>
                                             <div class="col-md-3">
                                        <div id="dateBox-${item.Id}" class="mb-3"></div>
                                        <button class="update-countdown btn btn-primary btn-sm">Update</button>
                                            </div>
                                            </div>
                                    </div>
                                </div >
                          </div>
                    </div>      `);
                container.append(countdownItemDiv);

                //dxTextBox oluşturma
                $(`#textBoxContainer-${item.Id}`).dxTextBox({
                    value: item.Title,
                    placeholder: "Yeni başlık",
                    showClearButton: true,
                    inputAttr: { 'aria-label': 'Text Box' }
                });

                //dxDateBox oluşturma
                $(`#dateBox-${item.Id}`).dxDateBox({
                    type: 'datetime',
                    value: new Date(formattedDate),
                    inputAttr: { 'aria-label': 'Date Time' }
                });
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
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/Countdowns/Delete",
                type: 'POST',
                data: { id: id },
                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        GetCountdowns();
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: response.message,
                            icon: "error"
                        });
                    }
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: "Server Error!",
                        text: "Countdown could not be deleted. Error: " + error,
                        icon: "error"
                    });
                    console.log("Detailed Error:", xhr.responseText);
                }
            });
        }
    });
}

//Kayıt Güncelleme İşlemi
function EditCountdown(itemDiv) {

    var id = itemDiv.data('id');
    var title = $(`#textBoxContainer-${id}`).dxTextBox("instance").option("value");
    var endDate = $(`#dateBox-${id}`).dxDateBox("instance").option("value").toISOString();

    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                url: "/Countdowns/UpdateCountdown",
                data: {
                    Id: id,
                    Title: title,
                    EndDate: endDate
                },
                success: function () {
                    Swal.fire("Saved!", "", "success");
                    GetCountdowns();
                },
                error: function (xhr, response, error) {
                    Swal.fire("Update error!", "Error: " + error, response.message, "error");
                    console.log("Detailed Error:", xhr.responseText);
                }
            });
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}

//Logout Event
$(document).ready(function () {
    $("#logoutBtn").click(function (event) {
        event.preventDefault(); // Butonun varsayılan davranışını engelle

        var logoutUrl = $(this).data('logout-url');

        Swal.fire({
            title: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = logoutUrl;
            }
        });
    });
});

$(document).ready(function () {

    $('#dateBox').dxDateBox({
        type: 'datetime',
        value: now,
        displayFormat: "yyyy-MM-dd HH:mm:ss",
        inputAttr: { 'aria-label': 'Date Time' },
    });
    $("#textBoxContainer").dxTextBox({
        value: "Countdown",
        placeholder: "Enter text here...",
        showClearButton: false,
        inputAttr: { 'aria-label': 'Text Box' }
    });

});
