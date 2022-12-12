// import icons from '../img/icons.svg' parcel 1
import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';


import * as model from './model.js';
import { PaginationView } from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import SearchView from './views/searchView.js';
import View from './views/View.js';
import PaginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';


const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    if(!id) return;
    //loading image
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1) Loading recipe
    await model.loadRecipe(id);

    // renderRecipe(recipe);
    recipeView.render(model.state.recipe);
  } catch(err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();
    // 1) get search query
    const query = SearchView.getQuery();
    if(!query) return;

    // 2) load search results
    await model.searchRecipe(query);

    //3) render results
    resultsView.render(model.getSearchResultsPage(1));
    // console.log(model.state.search.results);
    //4 render initial pagination button 
    PaginationView.render(model.state.search);
  } catch(err) {
    resultsView.renderError(err);
  }
};

const controlPagination = function(goToPage) {
   //1) render new results
   resultsView.render(model.getSearchResultsPage(goToPage));
   // console.log(model.state.search.results);
   //2) render new pagination button 
   PaginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);


  // Update the recipe view
  recipeView.update(model.state.recipe);
};


const controlAddBookmark = function() {
  //1) add or remove bookmark
  if(!model.state.recipe.bookmarks) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe);
  console.log(model.state.recipe);
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
  
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
  
  //Show spinner
  addRecipeView.renderSpinner();
  console.log(newRecipe);
  await model.uploadRecipe(newRecipe)

  //render recipe
  recipeView.render(model.state.recipe);

  //Success message
  addRecipeView.renderSuccess();

  //render bookmark view
  bookmarksView.render(model.state.bookmarks);

  //Change ID in the URL
    window.history.pushState(null,'', `#${model.state.recipe.id}` );
    //window.history.back() going back to the previous page also the forward as the name says
    

  //Close form window
  setTimeout(function() {
    addRecipeView.toggleWindow();
  },MODAL_CLOSE_SEC);

  } catch(err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};


const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHadlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
