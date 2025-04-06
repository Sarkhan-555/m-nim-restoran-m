// Səhifə yükləndikdə işləyəcək kod
document.addEventListener('DOMContentLoaded', function() {
    console.log('Salam! Səhifə yükləndi.');
    
    // Başlığa klik edildikdə mesaj göstərmək
    const bashliq = document.querySelector('h1');
    bashliq.addEventListener('click', function() {
        alert('Xoş gəlmisiniz!');
    });
});