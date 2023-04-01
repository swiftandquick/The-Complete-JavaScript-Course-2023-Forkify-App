// Import async from regenerator-runtime package.  
import { async } from 'regenerator-runtime';

// Import variables from config.js.  
import { API_URL, RES_PER_PAGE, KEY } from './config.js';

// Import AJAX() function from helpers.js.  
import { AJAX } from './helpers.js';

// Export the state object.  
// recipe is an empty object.  
// search is an empty object with query (as empty string), results (as empty array), and resultsPerPage (10).   
// bookmarks is an empty array.  
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [], 
        page: 1,
        resultsPerPage: RES_PER_PAGE
    },
    bookmarks: []
};

// Use destructuring to retrieve the data.data.recipe property.  Create a new object base on the recipe's properties.  
// Use short-circuiting to check if recipe.key exists, if it does, set key equal to recipe.key.  
const createRecipeObject = function(data) {
    const {recipe} = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients:  recipe.ingredients, 
        ...(recipe.key && { key : recipe.key })
    }
}

// Export the loadRecipe() async function that takes id as argument.  
// Invoke AJAX() to retrieve data from API's URL.  
// Invoke createRecipeObject() function with data.  
// Check if the bookmarked recipe's id is equal to id, if it is, set bookmarked to true, otherwise, set bookmarked to false.  
export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        state.recipe = createRecipeObject(data);
        if(state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        }
        else {
            state.recipe.bookmarked = false;
        }
    }
    catch(err) {
        throw err;
    }
};

// Invoke AJAX() to retrieve data from API's URL.  
// Set the search object's query equal to the parameter's query variable.  
// Use the map() method to return a new array of objects based on the recipes property from data.data.  
// Store the array of objects in the results array (inside search object).  
// Set state.search.page back to 1, page is reset to 1 after a new search is submitted.  
export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key : recipe.key })
            }
        });
        state.search.page = 1;
    }
    catch(err) {
        throw err;
    }
}

// If there's no page value from the argument, page by default is state.search.page, which is 1 initially.  
// Set the state.search.page's value to page's (in parameter) value.  
// Return an array only contain 10 elements of results array.  
// For example, for page 1, start is 0, end is 10, and slice() only returns an array with elements from index 0 to 9.  
export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
}

// For each ingredient, calculate the new quantity, which is the equal to old quantity * new servings (newServings) / old servings.  
// Update the serving to newServing.  
export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });
    state.recipe.servings = newServings;
}

// Use JSON.stringify() to convert the bookmarks array of objects into a string, then add it to localStorage.  
const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

// Add recipe to the bookmarks array.  
// If the recipe's (parameter variable) id is equal to state.recipe's id, add a bookmarked property to state.recipe and set it to true.  
// Invoke persistBookmarks() to update the bookmarks array in localStorage.  
export const addBookmark = function(recipe) {
    state.bookmarks.push(recipe);
    if(recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
    }
    persistBookmarks();
}

// Loop through the entire bookmarks array, find the element with the id equal to id value from parameter.  
// Use splice() method to remove the element from the bookmarks array.  
// Make the bookmarked value of the recipe to false.  
// Invoke persistBookmarks() to update the bookmarks array in localStorage.  
export const deleteBookmark = function(id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);
    if(id === state.recipe.id) {
        state.recipe.bookmarked = false;
    }
    persistBookmarks();
}

// Get the bookmarks item from localStorage.  
// If there's an item returned from the getItem() method, storage will be a truthy value.  
// If storage has a truthy value, use JSON.parse() to convert the string back to an array of objects, 
// then set state.bookmarkets to the retrieved array of objects from localStorage.  
const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) {
        state.bookmarks = JSON.parse(storage);
    }
}

// Invoke the init() method, since the entire model.js file is exported to controller.js, init() in model.js will be automatically invoked.  
init();

// Remove the bookmarks item, which contains the bookmarks array.  
const clearBookmarks = function() {
    localStorage.clear('bookmarks');
}

// Uncomment the following line and code and comment out init(); if I want to clear the bookmarks.  
// clearBookmarks();

// newRecipe is an object, use Object.entries to convert it into an array.  
// Use filter() method to retrieve only the ingredients, which include elements with key-name starts with ingredient and value isn't empty, from the new array.  
// Use map() to split each input value for ingredient (ing[1]) into an array called ingArr.  
// If ingArr's size is 3, throw an error and exit out of the function.  
// Use destructuring to retrieve quantity, unit, and description from ingArr.   
// If quantity exists, convert it to a number, otherwise, set it to null.  
// Create a recipe object using newRecipe's properties.  
// Use AJAX() function to submit the recipe object to the API.  
// Invoke createRecipeObject() function and create a recipe object, then store it in state.recipe.  
// Add the newly created recipe to the bookmarks array.  
export const uploadRecipe = async function(newRecipe) {
    const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim());
            if(ingArr.length !== 3) {
                throw new Error('Wrong ingredient format!  Please use the correct format.');
            }
            const [quantity, unit, description] = ingArr;
            return {quantity: quantity ? Number(quantity) : null, unit, description};
        });
    const recipe = {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl, 
        image_url: newRecipe.image, 
        publisher: newRecipe.publisher, 
        cooking_time: Number(newRecipe.cookingTime), 
        servings: Number(newRecipe.servings),
        ingredients
    }
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
}