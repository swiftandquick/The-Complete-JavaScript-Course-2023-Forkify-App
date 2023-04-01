// Import the View class from View.js.  
import View from './View.js';

// Import the PreviewView class from previewView.js.  
import previewView from './previewView.js';

// Create a class ResultView, a subclass to View in View.js.  
class BookmarksView extends View {

    // Set _parentElement to first element with class of "bookmarks__list".  
    _parentElement = document.querySelector('.bookmarks__list');

    _errorMessage = 'No bookmarks yet.  Find a nice recipe and bookmark it.';
    _message = '';

    // Call the handler function on load.  
    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    // this._data is an array of elements returned as search results.  
    // Generate HTML codes for each element via _generateMarkup() method from PreviewView class by invoking render() from View class, 
    // then join all HTML codes together as a string.  
    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }

}

// Export the an unnamed object created with BookmarksView class, export is default so I can name it anything I want in controller.js.  
export default new BookmarksView();