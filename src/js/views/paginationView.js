// Import the View class from View.js.  
import View from './View.js';

// Import the icons.svg image from the src/img folder.  
import icons from 'url:../../img/icons.svg';

// Create a class PaginationView, a subclass to View in View.js.  
class PaginationView extends View {

    // Set _parentElement to first element with class of "pagination".  
    _parentElement = document.querySelector('.pagination');

    // When click on elements inside the 'pagination' element, set btn equal to the target's closest parent with class of 'btn--inline'.  
    // If there's no button clicked, exit out of the function.  
    // goToPage contains the button's data-goto attribute, if I am current on page 1 and click on the next button, goToPage is 2.  
    // Invoke th handler function (controlPagination() in controller.js) with goToPage as the argument.
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if(!btn) {
                return;
            }
            const goToPage = Number(btn.dataset.goto);
            handler(goToPage);
        });
    }

    // Get the current page value from _data.page, save it in curPage variable.   
    // Calculate the number of pages we need by rounding up the result of results' size divided by 10.  
    // There are four scenarios.  
    // I am at page 1 and there are other pages.  Display the button to next page.  
    // I am on the last page.  Display the button to previous page.  
    // I am on a page that's not first or last page.  Display the button to previous page and next page.  
    // I am on page 1 and there are no other pages.  
    // Add data-goto attribute for each button in _generateMarkup method.  
    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        if(curPage === 1 && numPages > 1) {
            return `
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span> 
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>`;
        }
        if(curPage === numPages && numPages > 1) {
            return `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span> 
                </button>`;
        }
        if(curPage < numPages) {
            return `
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span> 
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span> 
                </button>`;
        }
        return ``;
    }

}

// Export the an unnamed object created with PaginationView class, export is default so I can name it anything I want in controller.js.  
export default new PaginationView();