'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // Создаем пин
  var renderPin = function (pinData) {
    var pin = mapPinTemplate.cloneNode(true);

    // Отрисовка карточки при нажатии на пин
    pin.addEventListener('click', function () {
      window.card.showAdvert(map, pinData);
    });

    pin.style.left = pinData.location.x - pin.offsetWidth / 2 + 'px';
    pin.style.top = pinData.location.y - pin.offsetHeight + 'px';
    pin.querySelector('img').src = pinData.author.avatar;
    pin.querySelector('img').alt = pinData.offer.title;

    return pin;
  };

  // Отрисовка
  var renderAllPins = function (elements) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < elements.length; i++) {
      fragment.appendChild(renderPin(elements[i]));
    }
    mapPins.appendChild(fragment);
  };

  window.pin = {
    renderAllPins: renderAllPins
  };
})();
