document.addEventListener('DOMContentLoaded', async () => {
    const url = new URL(window.location.href);
    if(localStorage.getItem('in-page-editor-token') && url.searchParams.has('edit')) {
        // user has the token and the edit param
        alert('welcome to edit mode!');
        var NoURLException = {};
        var NoHEntryException = {};
        // make content editable
        try {
            let fetching = await fetch(`https://able-hawk-60.deno.dev/categories`, { method: "GET", headers: { "access-control-allow-origin": "*", "Authorization": "Bearer " + localStorage.getItem('in-page-editor-token') } } );
            const results = await fetching.json();

            let contents = document.querySelectorAll('.e-content');
            contents = [...contents];
            contents.forEach((content,i) => {
                let hentry = content.closest('.h-entry');
                if(!hentry) {
                    throw NoHEntryException;
                }
                let url = hentry.querySelector('.u-url');
                if(!url || !url.getAttribute('href')) {
                    throw NoURLException;
                } else {
                    let name = hentry.querySelector('.p-name');

                    if(name) {
                        name.setAttribute('contenteditable','plaintext-only');
                        name.setAttribute('data-mpe-id',i);
                    }

                    content.setAttribute('contenteditable','plaintext-only');
                    content.setAttribute('data-mpe-id',i);
                    content.addEventListener("focusout", (event) => {
                        event.target.innerHTML = event.target.innerText;
                    });
                    content.addEventListener("focusin", (event) => {
                        event.target.innerHTML = event.target.innerHTML.replaceAll('<','&lt;').trim();
                    });
                    hentry.insertAdjacentHTML('beforebegin',`<form>
                        ${results.categories && results.categories.length > 0 ? 
                            `<fieldset>
                                <legend>Post Categories</legend>
                                ${results.categories.map(item => {
                                    return `<label>
                                            <input type="checkbox" name="category[]" value="${item}"> ${item}
                                            </label>`;
                                }).join('')}
                            </fieldset>` : '' }
                            <button type="button">save</button>
                        </form>`);
                }
            });
        } catch(e) {
            if(e === NoURLException) {
                alert('No u-url found for content.');
            } else if(e === NoHEntryException) {
                alert('No h-entry found for content.');
            } else { 
                throw e; 
            }
        }
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