// Import the icons.svg image from the src/img folder.  
import icons from 'url:../../img/icons.svg';

// Create and export (as default) the class View.  
export default class View {
    _data;
    
    // The render() method has a render parameter variable, by default, it's true.  
    // If data is a falsy value or an empty array, invoke renderError().  
    // In the render() method, set protected property _data to the data received.  
    // Invoke the _generateMarkup() protected method and store the result in markup. 
    // If render is false, return the markup variable.   
    // Invoke _clear() protected method.  
    // Insert the html codes in _parentElement as first child.  
    render(data, render = true) {
        if(!data || (Array.isArray(data) && data.length === 0)) {
            return this.renderError();
        }
        this._data = data;
        const markup = this._generateMarkup();
        if(!render) {
            return markup;
        }
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    // If data is a falsy value or an empty array, invoke renderError().  
    // In the render() method, set protected property _data to the data received.  
    // Invoke the _generateMarkup() protected method and store the result in markup.  
    // Convert the string newMarkup to real DOM Node objects.  newDOM lives in the memory but not on the web page.  
    // newElements is all elements inside the newDOM object.  
    // curElement is everything inside the _parentElement element.  
    // Compare each index of newElements and curElements using isEqualNode to check if the Nodes are the same.  
    // For example, if I click on the plus button next to servings, servings is now 5, the new Node that displays the serving will be different than before.  
    // First, the update change the text content of some of the current elements.  
    // In cases where new Node and old Node are different, and there is a nodeName (such as #text) for the first child of new element, 
    // update the current element's text content to new element's text content.  
    // Then we update the attributes for current nodes that are different than new nodes.  
    // Change some of the current node's attributes (name and value) equal to new node's attributes.  
    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }
            if(!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
        });
    }

    // renderSpinner() is a method that clears all inner HTML codes of an element, then inserts a spinner with html codes into the parent element as first child.  
    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}.svg#icon-loader"></use>
                </svg>
            </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    // renderError() renders an error message.  Invoke _clear() to remove all inner HTML codes of current element, then add markup as first child of _parentElement.  
    renderError(message = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    // renderMessage() renders a success message.  
    renderMessage(message = this._message) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    // Set _clear() protected method, in _clear(), set inner HTML of the #parentElement to nothing.  
    _clear() {
        this._parentElement.innerHTML = '';
    }

}