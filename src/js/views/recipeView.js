// Import the View class from View.js.  
import View from './View.js';

// Import the icons.svg image from the src/img folder.  
import icons from 'url:../../img/icons.svg';

// Import Fraction from fractional package.  
import {Fraction} from 'fractional';

// Create a class RecipeView, a subclass to View in View.js.  
// Set the protected property _parentElement to the first element with class of 'recipe'.  
class RecipeView extends View {
    _parentElement = document.querySelector('.recipe');
    _errorMessage = 'We could not find that recipe.  Please try another one!';
    _message = '';

    // handler (in this case, showRecipe()) is invoked when the fragment identifier of the URL has changed.  
    // Invoke handler (in this case, showRecipe()) on load.  
    addHandlerRender(handler) {
        ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
    }

    // If I click on the element with class of "recipe", I will trigger an event.  
    // Look for the target's closest parent with the class name of 'btn--update-servings', save it in btn element.  
    // If I don't click on elements inside elements with 'btn-tiny' class, I will get null, if that's the case, exit out of the function.  
    // Get the button's data-update-to value.  
    // Invoke the handler() function with updateTo's value if updateTo is greater than 0.  
    addHandlerUpdateServings(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--update-servings');
            if (!btn) {
                return;
            }
            const updateTo = Number(btn.dataset.updateTo);
            if (updateTo > 0) {
                handler(updateTo);
            }
        });
    }

    // If I click on the element with class of "recipe", I will trigger an event.  
    // Look for the target's closest parent with the class name of 'btn--bookmark', save it in btn element.  
    // If I don't click on elements inside elements with 'btn-tiny' class, I will get null, if that's the case, exit out of the function.  
    // Invoke the handler() function.  
    addHandlerAddBookmark(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--bookmark');
            if(!btn) {
                return;
            }
            handler();
        });
    }

    // Create a private method _generateMarkup() which renders the recipe view.  
    // Use the new recipe (this._data) object's properties as part of html markup.  Render each ingredient of the recipe with map() method.  
    // Call _generateMarkupIngredient() to return the HTML string that renders each ingredient.  
    _generateMarkup() {
            return `
                    <figure class="recipe__fig">
                        <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
                        <h1 class="recipe__title">
                              <span>${this._data.title}</span>
                        </h1>
                    </figure>
                    <div class="recipe__details">
                        <div class="recipe__info">
                            <svg class="recipe__info-icon">
                                <use href="${icons}#icon-clock"></use>
                            </svg>
                            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
                            <span class="recipe__info-text">minutes</span>
                        </div>
                        <div class="recipe__info">
                            <svg class="recipe__info-icon">
                                <use href="${icons}#icon-users"></use>
                            </svg>
                            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
                            <span class="recipe__info-text">servings</span>
                            <div class="recipe__info-buttons">
                                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
                                    <svg>
                                        <use href="${icons}#icon-minus-circle"></use>
                                    </svg>
                                </button>
                                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
                                    <svg>
                                        <use href="${icons}#icon-plus-circle"></use>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
                            <svg>
                                <use href="${icons}#icon-user"></use>
                            </svg>
                        </div>
                        <button class="btn--round btn--bookmark">
                            <svg class="">
                                <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
                            </svg>
                        </button>
                    </div>
                    <div class="recipe__ingredients">
                        <h2 class="heading--2">Recipe ingredients</h2>
                        <ul class="recipe__ingredient-list">
                            ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
                        </ul>
                    </div>
                    <div class="recipe__directions">
                        <h2 class="heading--2">How to cook it</h2>
                        <p class="recipe__directions-text">
                            This recipe was carefully designed and tested by
                            <span class="recipe__publisher">${this._data.pubisher}</span>. Please check out
                            directions at their website.
                        </p>
                        <a class="btn--small recipe__btn" href="${this._data.sourceUrl}" target="_blank">
                            <span>Directions</span>
                            <svg class="search__icon">
                                <use href="${icons}#icon-arrow-right"></use>
                            </svg>
                        </a>
                    </div>`
    }

    
    // Convert ing.quantity to fraction using fractional.  
    _generateMarkupIngredient(ing) {
        return `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity ? new Fraction(ing.quantity).toString() : ''}</div>
                <div class="recipe__description">
                    <span class="recipe__unit">${ing.unit}</span>
                    ${ing.description}
                </div>
            </li>`
    }
}


// Export the an unnamed object created with RecipeView class, export is default so I can name it anything I want in controller.js.  
export default new RecipeView();