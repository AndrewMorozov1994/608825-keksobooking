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

  var error = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; background-color: red; color: white';
    node.style.display = 'flex';
    node.style.justifyContent = 'center';
    node.style.alignItems = 'center';
    node.style.position = 'fixed';
    node.style.width = '400px';
    node.style.minHeight = '200px';
    node.style.border = '3px solid black';
    node.style.borderRadius = '10px';
    node.style.left = 'calc(50% - 200px)';
    node.style.top = 'calc(50% - 100px)';
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend = {
    upload: upload,
    download: download,
    error: error
  };
})();