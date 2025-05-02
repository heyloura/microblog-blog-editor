document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    if(localStorage.getItem('in-page-editor-token') && url.searchParams.has('edit')) {
        // user has the token and the edit param
        alert('welcome to edit mode!');
        // make content editable
        let contents = document.querySelectorAll('.e-content');
        contents = [...contents];
        contents.forEach((content) => {
            content.setAttribute('contenteditable','plaintext-only');
            content.addEventListener("focusout", (event) => {
                event.target.innerHTML = event.target.innerText;
            });
            content.addEventListener("focusin", (event) => {
                event.target.innerHTML = event.target.innerHTML.replaceAll('<','&lt;');
            });
        });

        // add save button
        // add new button
    } else if(localStorage.getItem('in-page-editor-token') && url.searchParams.has('reset')) {
        // user has the token and wishes to reset it.
        promptSaveToken();
        window.location = window.location.href.split("?")[0];
    } else if(localStorage.getItem('in-page-editor-token') && url.searchParams.has('logout')) {
        // user has the token and the edit param
        localStorage.setItem('in-page-editor-token', '');
        alert('Thank you for using my editor. Have a great day :-)');
        window.location = window.location.href.split("?")[0];
    } else if (url.searchParams.has('edit')) {
        // prompt the user to save a micro.blog token
        promptSaveToken();
        window.location.reload();
    } else {
        // don't do anything....
    }
});

function promptSaveToken() {
    let token = prompt("Please enter a Micro.blog token");
    if (token != null) {
        localStorage.setItem('in-page-editor-token', token);
    } else {
        alert('No token was saved.');
    }
}