'use strict';

(function () {
  var ADDRESS_Y_MIN = 130;
  var ADDRESS_Y_MAX = 630;

  var map = document.querySelector('.map');
  var addressPointer = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adressInput = adForm.querySelector('#address');

  // Перемещение
  addressPointer.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: moveEvt.clientX - startCoords.x,
        y: moveEvt.clientY - startCoords.y
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newX = addressPointer.offsetLeft + shift.x;
      var newY = addressPointer.offsetTop + shift.y;

      if (newX < 0 - addressPointer.offsetWidth / 2) { // Удаляем addressPointer чтобы пин не вылезал за границу
        newX = 0 - Math.round(addressPointer.offsetWidth / 2);
      }

      if (newX > addressPointer.parentElement.offsetWidth - addressPointer.offsetWidth / 2) { // Удаляем /2 чтобы пин не вылезал за границу
        newX = addressPointer.parentElement.offsetWidth - Math.round(addressPointer.offsetWidth / 2);
      }

      if (newY < ADDRESS_Y_MIN) {
        newY = ADDRESS_Y_MIN;
      }
      if (newY > ADDRESS_Y_MAX) {
        newY = ADDRESS_Y_MAX;
      }

      addressPointer.style.left = newX + 'px';
      addressPointer.style.top = newY + 'px';

      var locationX = newX + Math.round(addressPointer.offsetWidth / 2);
      var locationY = newY;

      adressInput.value = locationX + ', ' + locationY;
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
