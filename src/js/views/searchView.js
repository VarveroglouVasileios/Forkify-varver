import View from './View';

class SearchView extends View{
  _parentElement = document.querySelector('.search');
  _errorMessage = 'We could not find that recipe. Please try again with some other!'
  _successMessage = '';

  _clearView() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearView();
    return query;
    };
  
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function(e) {
      e.preventDefault();
      handler();
    });
  }
};

export default new SearchView;