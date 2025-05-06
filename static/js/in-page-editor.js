document.body.insertAdjacentHTML('beforeend', '<button onclick="edit()">🗝️</button>');
async function edit() {
    if(localStorage.getItem('in-page-editor-token')) {
        // user has the token and the edit param
        await makeEditable();
    } else {
        promptSaveToken();
    }
}

async function makeEditable() {
    const url = new URL(window.location.href);
    alert('welcome to edit mode!');
    var NoURLException = {};
    var NoHEntryException = {};
    // make content editable
    try {
        let fetching = await fetch(`https://able-hawk-60.deno.dev/categories`, { method: "GET", headers: { "Authorization": "Bearer " + localStorage.getItem('in-page-editor-token') } } );
        const results = await fetching.json();

        let contents = document.querySelectorAll('.e-content');
        contents = [...contents];
        for(var i = 0; i < contents.length; i++)
        {
            let content = contents[i];
            let hentry = content.closest('.h-entry');
            if(!hentry) {
                throw NoHEntryException;
            }
            let url = hentry.querySelector('.u-url');
            if(!url || !url.getAttribute('href')) {
                throw NoURLException;
            } else {
                fetching = await fetch(`https://able-hawk-60.deno.dev/info?url=${window.location}`, { method: "GET", headers: { "Authorization": "Bearer " + localStorage.getItem('in-page-editor-token') } } );
                const info = await fetching.json();
                
                let name = hentry.querySelector('.p-name');

                if(name) {
                    name.setAttribute('contenteditable','plaintext-only');
                    name.setAttribute('data-mpe-id',i);
                }

                content.setAttribute('contenteditable','plaintext-only');
                content.setAttribute('data-mpe-id',i);
                url.setAttribute('data-mpe-id',i);
                content.addEventListener("focusout", (event) => {
                    event.target.innerHTML = event.target.innerText;
                });
                content.addEventListener("focusin", (event) => {
                    event.target.innerHTML = event.target.innerHTML.replaceAll('<','&lt;').trim();
                });
                hentry.insertAdjacentHTML('afterend',`<form id="mpe-form-${i}" class="mpe-form">
                    ${results.categories && results.categories.length > 0 ? 
                        `<fieldset class="mpe-fieldset">
                            <legend class="mpe-legend">Post Categories</legend>
                            ${results.categories.map(item => {
                                return `
                                <input id="checkbox-${i}-${item}" class="mpe-checkbox" type="checkbox" ${info.properties.category.map(function (c) { return c == item ? 'checked="checked"' : '' }).join('')} name="category[]" value="${item}"> ${item}
                                <label for="checkbox-${i}-${item}" class="mpe-label"></label>`;
                            }).join('')}
                        </fieldset>` : '' }
                        <textarea style="display:none;" class="mpe-textarea">${info.properties.summary.map(function (s) { return s }).join('')}</textarea>
                        <select style="display:none;" name="status" class="mpe-select"><option selected="selected" value="published" class="mpe-option">Published</option><option value="draft" class="mpe-option">Draft</option></select>
                        <input name="url" type="hidden" />
                        <input name="name" type="hidden" />
                        <input name="content" type="hidden" />
                        <button onclick="updatePost('${i}')" class="mpe-button" type="button">Save Changes</button>
                    </form>`);
            }
        }
    } catch(e) {
        if(e === NoURLException) {
            alert('No u-url found for content.');
        } else if(e === NoHEntryException) {
            alert('No h-entry found for content.');
        } else { 
            throw e; 
        }
    }
}

async function promptSaveToken() {
    console.log('promptSaveToken()');
    let token = prompt("Please enter a Micro.blog token");
    if (token != null) {
        localStorage.setItem('in-page-editor-token', token);
        makeEditable();
    } else {
        alert('No token was saved.');
        //window.location = window.location.href.split("?")[0];
    }
}

async function updatePost(id) {
    const form = document.getElementById(`mpe-form-${id}`);
    form.elements["url"].value = document.querySelector(`[data-mpe-id="${id}"].u-url`);
    form.elements["name"].value = document.querySelector(`[data-mpe-id="${id}"].p-name`) ? document.querySelector(`[data-mpe-id="${id}"].p-name`).innerHTML : '';
    form.elements["content"].value = document.querySelector(`[data-mpe-id="${id}"].e-content`).innerHTML;

    let posting = await fetch('https://able-hawk-60.deno.dev/update', {
        method:'post', 
        body: new FormData(form),
        headers: { "Authorization": "Bearer " + localStorage.getItem('in-page-editor-token') }})
    let response = await posting.text();
    alert(response);
}