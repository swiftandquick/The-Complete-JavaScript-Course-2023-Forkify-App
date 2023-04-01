// Import the View class from View.js.  
import View from './View.js';

// Import the icons.svg image from the src/img folder.  
import icons from 'url:../../img/icons.svg';

// Create a class ResultView, a subclass to View in View.js.  
class PreviewView extends View {

    // Set _parentElement to empty string.  
    _parentElement = '';

    // Generate HTML codes to be inserted in the parent element later.  
    // Retrieve the an id from window.  
    // Add the class 'preview__link--active' to li element if id and result.id are equal.  
    _generateMarkup() {
        const id = window.location.hash.slice(1);
        return `
            <li class="preview ${this._data.id === id ? 'preview__link--active' : ''}">
                <a class="preview__link" href="#${this._data.id}">
                    <figure class="preview__fig">
                        <img src="${this._data.image}" alt="${this._data.title}" />
                    </figure>
                    <div class="preview__data">
                        <h4 class="preview__title">${this._data.title}</h4>
                        <p class="preview__publisher">${this._data.publisher}</p>
                        <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
                            <svg>
                                <use href="${icons}#icon-user"></use>
                            </svg>
                        </div>
                    </div>
                </a>
            </li>`;
    }

}

// Export the an unnamed object created with BookmarksView class, export is default so I can name it anything I want in controller.js.  
export default new PreviewView();