// Import the View class from View.js.  
import View from './View.js';

// Create a class SearchView, a subclass to View in View.js.  
class SearchView extends View {

    // Set the _parentElement to the first element with class of 'search'.  
    _parentElement = document.querySelector('.search');

    // Get the value of the text field from <input> element with class name of 'search__field' and return it.  
    // Invoke the _clearInput() protected method to empty the <input> element.  
    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    // Empty the <input> element with 'search__field' class.  
    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    // When the form is submitted, invoke preventDefault() to prevent the page to be reloaded and call the handler function.  
    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        });
    }
}

// Export the an unnamed object created with SearchView class, export is default so I can name it anything I want in controller.js.  
export default new SearchView();