// Import the View class from View.js.  
import View from './View.js';

// Create a class AddRecipeView, a subclass to View in View.js.  
class AddRecipeView extends View {
    // Set _parentElement to first element with class of "upload".  
    _parentElement = document.querySelector('.upload');

    // Success message that will be displayed when recipe is successfully uploaded.  
    _message = 'Recipe was successfully uploaded.';

    // Set _window to the first element with class of "add-recipe-window".  
    _window = document.querySelector('.add-recipe-window');

    // Set _overlay to first element with class of "overlay".  
    _overlay = document.querySelector('.overlay');

    // Set _btnOpen to first element with class of "nav__btn--add-recipe".  
    _btnOpen = document.querySelector(".nav__btn--add-recipe");

    // Set _btnClose to first element with class of "btn--close-modal".  
    _btnClose = document.querySelector('.btn--close-modal');

    // Invoke addHandlerShowWindow() and addHandlerHideWindow() with the current object immediately after an object is created with AddRecipeView as the template.  
    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    // Add (if 'hidden' is not a class) or remove (if 'hidden' is already a class) the 'hidden' class 
    // from _overlay and _window, effectively hiding or revealing _overlay and _window.
    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    // Click on the _btnOpen will invoke toggleWindow() method.  
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    // Click on the _btnClose will invoke toggleWindow() method.  
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    }

    // When the form is submitted, prevent default behavior that redirects the page to somewhere else.  
    // Gets key-value pairs from the submitted form, store it in data variable as an array.  
    // Convert the array into an object with key-value pairs.  
    // Invoke the handler function with data as the argument.  
    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }

    _generateMarkup() {

    }
}

// Export the an unnamed object created with AddRecipeView class, export is default so I can name it anything I want in controller.js.  
export default new AddRecipeView();