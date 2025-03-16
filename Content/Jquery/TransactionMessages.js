function TransactionMessage(id, message, type) {
    if (!message) {
        switch (id) {
            case 1:
                message = "İşlem başarılı!";
                break;
            case 2:
                message = "İşlem başarısız. Lütfen tekrar deneyin.";
                break;
            case 3:
                message = "Veritabanı hatası oluştu. Destekle iletişime geçin.";
                break;
            case 4:
                message = "Yetersiz bakiye!";
                break;
            case 5:
                message = "Kimlik doğrulama hatası.";
                break;
            default:
                message = "Bilinmeyen bir hata oluştu.";
                break;
        }
    }

    if (!type) {
        type = 'info';
    }

    Swal.fire({
        icon: type, // 'success', 'error', 'warning', 'info', 'question'
        title: 'Mesaj',
        text: message
    });
}

