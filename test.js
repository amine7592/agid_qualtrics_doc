jQuery("#Page > div > div.PageErrorDialog.TOC > div.ErrorButtons > button:nth-child(2)").text('Messaggio Bottone Resta')
jQuery("#Page > div > div.PageErrorDialog.TOC > div.ErrorButtons > button:nth-child(1)").text('Messaggio Bottone Indietro')
jQuery("#ErrorTitle").text("Titolo Popup");
jQuery("#ErrorMessage > span").text('Corpo Testo Popup')


var observer = new MutationObserver(function() {
    
    const div = document.querySelector("#Page > div > div.PageErrorDialog.TOC");
    if (div) {
        console.log('testing start')
        jQuery("#ErrorMessage > span").text('Corpo Testo Popup')
        observer.disconnect();
        observer = null;
        console.log('testing end')
    }
});
observer.observe(document.querySelector("#Page"), {
    childList: true,
    subtree: true
});






var observer = new MutationObserver(function() {
    
    const div = document.querySelector("#Page > div > div.PageErrorDialog.TOC");
    if (div) {
        div.style.display = "none";
        if(window.confirm('custom message')) {jQuery("#Page > div > div.PageErrorDialog.TOC > div.ErrorButtons > button:nth-child(1)").trigger('click');}
        observer.disconnect();
        observer = null;
    }
});
observer.observe(document.querySelector("#Page"), {
    childList: true,
    subtree: true
});