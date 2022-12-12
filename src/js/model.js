import { async } from "regenerator-runtime";
import {API_URL, KEY, RES_PER_PAGE} from './config.js';
import { AJAX } from "./helpers.js";
import renderError from './views/recipeView';
export const state = {
  recipe: {},
  search: {
    query: '',
    results:[],
    page: 1,
    resultsPerPage: 10,
  },
  bookmarks: [],
};

const createRecipeObject = function(data) {
  const {recipe} = data.data;
  return { 
    id: recipe.id,
    title:recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key:recipe.key})
  };
};

export const loadRecipe = async function(id) {
  try {

  const data = await AJAX(`
  ${API_URL}/${id}?key=${KEY}`);
  state.recipe = createRecipeObject(data);

  if(state.bookmarks.some(bookmark => bookmark.id === id))
  state.recipe.bookmarks = true; else state.recipe.bookmarks = false;
} catch(err) {
  throw new Error(err);
}
};

export const searchRecipe = async function(query) {
  try {
    state.search.results = query;
    
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results =  data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title:rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key}),
      };
    });
    state.search.page = 1;
  } catch(err) {
    renderError(err);
  }
};


export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE ;  //0;
  const end = page * RES_PER_PAGE; //9;
  return state.search.results.slice(start , end);
};

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
    // newQuantity = oldQuantity * newServings / oldServings
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  //Mark Current recipe as bookmark
  if(recipe.id === state.recipe.id) state.recipe.bookmarks = true;
  persistBookmarks();
};

export const deleteBookmark = function(id) {
  //Delete recipe
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index,1);
  //Mark current recipe as not bookmark
  if(id.id === state.recipe.id) state.recipe.bookmarks = false;
  persistBookmarks();
};

const init = function() {
  const storage = localStorage.getItem('bookmarks')
  if(storage) state.bookmarks = JSON.parse(storage);
}

init();

const clearBookmarks = function() {
  localStorage.clear('bookmarks');
}

export const uploadRecipe = async function(newRecipe) {
  try {
  const ingredients = Object.entries(newRecipe).filter(entry => entry[0]
    .startsWith("ingredient") && entry[1] !== '')
  .map(ing => { 
    const ingArr = ing[1].split(',').map(el => el.trim);
    if (ingArr.length !==3) throw new Error('wrong ingredient format, Please use the correct format');
    const [quantiny, unit , description] = ingArr;

    return {quantiny: quantiny ? +quantiny : null  ,  unit   ,   description}});
    console.log(ingredients);
    const recipe = {
      title:newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }
    const data = await AJAX(`${API_URL}?key=${KEY}`,recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);

  } catch (err) {
    throw err;
  }

  
}