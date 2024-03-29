import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks');
  _errorMessage = 'No Bookmarks found!';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load',handler);
  }
  _generateMarkup() {
    return this._data.map
    (bookmark => previewView.render(bookmark,false))
    .join('');
  }

}

export default new BookmarkView();