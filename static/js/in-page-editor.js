document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    if(localStorage.getItem('in-page-editor-token') && url.searchParams.has('edit')) {
        // user has the token and the edit param
        // make content editable
        // add save button
        // add new button
    } else if(localStorage.getItem('in-page-editor-token') && url.searchParams.has('reset')) {
        // user has the token and wishes to reset it.
        promptSaveToken();
    } else if(localStorage.getItem('in-page-editor-token') && url.searchParams.has('logout')) {
        // user has the token and the edit param
        localStorage.setItem('in-page-editor-token', '');
        alert('Thank you for using my editor. Have a great day :-)');
        window.location.reload();
    } else if (url.searchParams.has('edit')) {
        // prompt the user to save a micro.blog token
        promptSaveToken();
    } else {
        // don't do anything....
    }
});

function promptSaveToken() {
    let token = prompt("Please enter a Micro.blog token");
    if (token != null) {
        localStorage.setItem('in-page-editor-token', token);
        window.location.reload();
    } else {
        alert('No token was saved.');
    }
}