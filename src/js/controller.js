// Import core-js and regenerator-runtime.  
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Import everything from model.js.  
import * as model from './model.js';

// Import MODAL_CLOSE_SEC from config.js.  
import { MODAL_CLOSE_SEC } from './config.js';

// Import the unnamed object created with RecipeView class from recipeView.js.  
import recipeView from './views/recipeView.js';

// Import the unnamed object created with SearchView class from searchView.js.  
import searchView from './views/searchView.js';

// Import the unnamed object created with ResultsView class from resultsView.js.  
import resultsView from './views/resultsView.js';

// Import the unnamed object created with PaginationView class from paginationView.js.  
import paginationView from './views/paginationView.js';

// Import the unnamed object created with BookmarksView class from bookmarksView.js.  
import bookmarksView from './views/bookmarksView.js';

// Import the unnamed object created with addRecipeView class from addRecipeView.js.  
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

/*
if (module.hot) {
      module.hot.accept();
}
*/

// Retrieve the id from window.location.hash.  If there's no id, exit out of the function.  
// Call renderSpinner() on recipeContainer.  
// Update results view to mark selected search result.  
// Invoke the update() method on the bookmarks array with the bookmarksView object.  
// loadRecipe() is an async function, so I have to await it to retrieve the response value.  
// Retrieve the recipe property from state object in model.js.  
// Call the render() method inside the RecipeView class (inside model.js) to render the view.  
// If there's an error caught, use recipeView object to invoke renderError() method.  
const controlRecipes = async function() {
      try {
            const id = window.location.hash.slice(1);
            if(!id) {
                  return;
            }
            recipeView.renderSpinner();
            resultsView.update(model.getSearchResultsPage());
            bookmarksView.update(model.state.bookmarks);
            await model.loadRecipe(id);
            recipeView.render(model.state.recipe);
      }
      catch(err) {
            recipeView.renderError();
      }
};

// Invoke renderSpinner() to render the spinner with the _parentElement as first element with class name of "results".  
// Retrieve the query from the <input> text field via getQuery() method from searchView.js.  
// If there's no query, exit out of the function.  
// Invoke loadSearchResults() from model.js.  
// Invoke render() with resultsView object to set the data variable to a single page that contains 10 elements, 
// then insert markup in the _parentElement (.results). 
// Render the initial pagination button via render() method from PaginationView class, pass in model.state.search as argument.  
const controlSearchResults = async function() {
      try {
            resultsView.renderSpinner();
            const query = searchView.getQuery();
            if (!query) {
                  return;
            }
            await model.loadSearchResults(query);
            resultsView.render(model.getSearchResultsPage());
            paginationView.render(model.state.search);
      }
      catch(err) {
            console.log(err);
      }
}

// The parameter is goToPage, which is the page I want to go to.  
// Invoke render() with resultsView object to set the data variable to a single page that contains previous or next 10 elements, 
// then insert markup in the _parentElement (.results). 
// Render the new pagination button(s) via render() method from PaginationView class, pass in model.state.search as argument.  
const controlPagination = function(goToPage) {
      resultsView.render(model.getSearchResultsPage(goToPage));
      paginationView.render(model.state.search);
}

// Update the recipe servings.  
// Update the recipe view via update() method from RecipeView class.  
const controlServings = function(newServing) {
      model.updateServings(newServing);
      recipeView.update(model.state.recipe);
}


// Invoke addBookmark() function if bookmarked value is false.  
// Invoke deleteBookmark() function if bookmarked value is true.  
// Update the view with View class' update() method.  
// Render bookmarked recipes by calling the render() method on the recipes in bookmarks array.  
const controlAddBookmark = function() {
      if(!model.state.recipe.bookmarked) {
            model.addBookmark(model.state.recipe);
      }
      else {
            model.deleteBookmark(model.state.recipe.id);
      }
      recipeView.update(model.state.recipe);
      bookmarksView.render(model.state.bookmarks);
}

// Invoke render() with the bookmarks array as the argument.  
const controlBookmarks = function() {
      bookmarksView.render(model.state.bookmarks);
}

// Invoke renderSpinner() to render the spinner on first element with class name of 'upload' (AddRecipeView's _parentElement).    
// Invoke uploadRecipe from model.js with newRecipe as argument.  
// Invoke render() with recipeView object to add the render the recipe view.  
// Display the success message once the recipe is uploaded.  
// Invoke render() with bookmarksView object to add the render the bookmarks view, now the new recipe is added on the bookmarked dropdown list.  
// Change the URL without reloading the page.  
// Invoke toggleWindow() to close to window after 2.5 seconds once the recipe is uploaded.  
// If there's an error being caught, invoke renderError() with addRecipeView object.  
const controlAddRecipe = async function(newRecipe) {
      try {
            addRecipeView.renderSpinner();
            await model.uploadRecipe(newRecipe);
            recipeView.render(model.state.recipe);
            addRecipeView.renderMessage();
            bookmarksView.render(model.state.bookmarks);
            window.history.pushState(null, '', `#${model.state.recipe.id}`);
            setTimeout(function() {
                  addRecipeView.toggleWindow();
            }, MODAL_CLOSE_SEC * 1000);
      }
      catch(err) {
            console.error(err);
            addRecipeView.renderError(err.message);
      }
}

// Create an init() function that's called immediately, inside init():  
// Invoke BookmarkView class' addHandlerRender() function with controlBookmarks as handler function.  
// Invoke RecipeView class' addHandlerRender() function with controlRecipes as handler function.  
// Invoke RecipeView class' addHandlerUpdateServings() function with controlServings as handler function.  
// Invoke RecipeView class' addHandlerAddBookmark() function with controlAddBookmark as handler function.  
// Invoke SearchView class' addHandlerSearch() function with controlSearchResults as handler function.
// Invoke PaginationView class' addHandlerClick() function with controlPagination as handler function.  
// Invoke AddRecipeView class' addHandlerUpload() function with controlAddRecipe as handler function.  
const init = function() {
      bookmarksView.addHandlerRender(controlBookmarks);
      recipeView.addHandlerRender(controlRecipes);
      recipeView.addHandlerUpdateServings(controlServings);
      recipeView.addHandlerAddBookmark(controlAddBookmark);
      searchView.addHandlerSearch(controlSearchResults);
      paginationView.addHandlerClick(controlPagination);
      addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();