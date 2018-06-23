'use strict';

(function () {
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var adFieldsets = adForm.querySelectorAll('fieldset');
  var addressPointer = map.querySelector('.map__pin--main');

  // Функция изменения состояния при первом нажатии
  var pointerFirstClickHandler = function () {
    map.classList.remove('map--faded');

    // Активация формы
    adForm.classList.remove('ad-form--disabled');
    adFieldsets.forEach(function (item) { // Наткнулся в учебнике на данный метод, решил опробовать
      item.disabled = false;
    });

    // Отрисовываем маркеры на карте
    window.pin.renderAllPins(window.data.adverts);

    // Передаем координаты в форму
    window.form.getCoordinations();

    // Устанавливаем соответствие цены в зависимости от типа жилья
    window.form.setPrice();
  };

  // Инициализация первого нажатия
  var initPage = function () {
    addressPointer.addEventListener('mouseup', pointerFirstClickHandler);
    addressPointer.addEventListener('keydown', pointerFirstClickHandler);
  };
  initPage();
})();
