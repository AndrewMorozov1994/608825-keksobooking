'use strict';

(function () {
  var URL_DOWNLOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var timeout = 30000;


  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания ' + xhr.timeout + 'мс');
    });

    xhr.timeout = timeout;

    return xhr;
  };

  var upload = function (data, onLoad, onError) {
    var xhr = setup(onLoad, onError);
    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  };

  var download = function (onLoad, onError) {
    var xhr = setup(onLoad, onError);

    xhr.open('GET', URL_DOWNLOAD);
    xhr.send();
  };

  var createErrorPopup = function (errorMessage) {

    var node = document.createElement('div');
    node.classList.add('error__popup');

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    var escPressHandler = function (evt) {
      window.utils.closePopupHelper(evt, errorCloseHandler);
    };

    var errorCloseHandler = function () {
      document.body.removeChild(node);
      document.removeEventListener('keydown', escPressHandler);
      document.removeEventListener('click', errorCloseHandler);
    };

    document.addEventListener('keydown', escPressHandler);
    document.addEventListener('click', errorCloseHandler);
  };

  window.backend = {
    upload: upload,
    download: download,
    createErrorPopup: createErrorPopup
  };
})();
