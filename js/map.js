'use strict';

(function () {
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var addressPointer = map.querySelector('.map__pin--main');

  // Функция изменения состояния при первом нажатии
  var pointerFirstClickHandler = function () {
    map.classList.remove('map--faded');

    // Активация формы
    adForm.classList.remove('ad-form--disabled');
    window.form.toggleFieldsetDisabled(false);

    // Отрисовываем маркеры на карте
    window.filters.updatePins();

    // Передаем координаты в форму
    window.form.getCoordinations();

    // Устанавливаем соответствие цены в зависимости от типа жилья
    window.form.setPrice();

    window.form.setRoomsToGuests();
  };

  // Инициализация первого нажатия
  addressPointer.addEventListener('mouseup', pointerFirstClickHandler);
  addressPointer.addEventListener('keydown', pointerFirstClickHandler);

  window.backend.download(window.filters.loadOffers, window.backend.createErrorPopup);
})();
