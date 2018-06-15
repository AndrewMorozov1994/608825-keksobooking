'use strict';

// Объявление переменных
var ADVERT_COUNT = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var ADDRESS_X_MIN = 300;
var ADDRESS_X_MAX = 900;
var ADDRESS_Y_MIN = 130;
var ADDRESS_Y_MAX = 630;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ROOM_MIN = 1;
var ROOM_MAX = 5;
var GUEST_MIN = 1;
var GUEST_MAX = 5;
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var ESC_KEYCODE = 27;
// var ENTER_KEYCODE = 13;

var arrayAdverts = []; // Пустой массив который будет заполняться объектами

// Для создания и отрисовки
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var addressPointer = map.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFieldsets = adForm.querySelectorAll('.ad-form__element');
var adressInput = adForm.querySelector('#address');

// Объявление функций для работы

// Функция получения случайного элемента
var getRandomElement = function (element) {
  var index = Math.floor(Math.random() * element.length);
  return element[index];
};

// Получаем случайное число
var getRandomIndex = function (min, max) {
  return Math.round(Math.random() * (min - max) + max);
};

// Получаем рандомное название, которое не повторяется
var getTitle = function (words) {
  var index = getRandomIndex(0, words.length - 1);
  var title = words[index];

  words.splice(index, 1); // Вырезаем индекс, который уже был использован

  return title;
};

// Функция определяет новую длину массива
var getRandomLengthArray = function (elements) {
  var count = getRandomIndex(1, elements.length);

  return elements.slice(0, count);
};

// Сортировка массива
var getRandomSortElements = function (elements) {
  var sortedElements = elements.slice();
  var newSorted = sortedElements.sort(function () {
    return Math.random() > 0.5 ? 1 : -1; // Параметр compareFunction для изменения порядка сортировки
  });

  return newSorted;
};

// Создаем массив объектов
var generateAdvert = function (generate) {
  var addressX = getRandomIndex(ADDRESS_X_MIN, ADDRESS_X_MAX);
  var addressY = getRandomIndex(ADDRESS_Y_MIN, ADDRESS_Y_MAX);

  return {
    author: {
      avatar: 'img/avatars/user0' + generate + '.png'
    },
    offer: {
      title: getTitle(TITLES),
      address: addressX + ', ' + addressY,
      price: getRandomIndex(PRICE_MIN, PRICE_MAX),
      type: getRandomElement(TYPES),
      rooms: getRandomIndex(ROOM_MIN, ROOM_MAX),
      guests: getRandomIndex(GUEST_MIN, GUEST_MAX),
      checkin: getRandomElement(TIMES),
      checkout: getRandomElement(TIMES),
      features: getRandomLengthArray(FEATURES),
      description: '',
      photos: getRandomSortElements(PHOTOS)
    },
    location: {
      x: addressX,
      y: addressY
    }
  };
};

var fillArray = function (advertsLength) {
  for (var i = 0; i < advertsLength; i++) {
    arrayAdverts.push(generateAdvert(i + 1));
  }

  return arrayAdverts;
};

// Вызываем массив объектов
var adverts = fillArray(ADVERT_COUNT);

var createAdvert = function (advertParametr) {
  var advert = mapCardTemplate.cloneNode(true);
  var featureHtml = '';
  var photosHtml = '';

  // В html документ добавляем список удобств с модификатором
  for (var i = 0; i < advertParametr.offer.features.length; i++) {
    featureHtml += '<li class="popup__feature popup__feature--' + advertParametr.offer.features[i] + '"></li>';
  }

  // В html добавляем адрес изображения жилища
  for (var j = 0; j < advertParametr.offer.photos.length; j++) {
    photosHtml += '<img src="' + advertParametr.offer.photos[j] + '" class="popup__photo" width="45" height="40" alt="Жилье">';
  }

  advert.querySelector('.popup__title').textContent = advertParametr.offer.title;
  advert.querySelector('.popup__text--address').textContent = advertParametr.offer.address;
  advert.querySelector('.popup__text--price').innerHTML = advertParametr.offer.price + '&#8381;/ночь';
  advert.querySelector('.popup__type').textContent = TYPES[advertParametr.offer.type];
  advert.querySelector('.popup__text--capacity').textContent = advertParametr.offer.rooms + ' комнаты для ' + advertParametr.offer.guests + ' гостей';
  advert.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertParametr.offer.checkin + ', выезд до ' + advertParametr.offer.checkout;
  advert.querySelector('.popup__features').innerHTML = featureHtml;
  advert.querySelector('.popup__description').textContent = advertParametr.offer.description;
  advert.querySelector('.popup__photos').innerHTML = photosHtml;
  advert.querySelector('.popup__avatar').src = advertParametr.author.avatar;

  // Закрытие карточки
  var popupClose = advert.querySelector('.popup__close');
  popupClose.addEventListener('click', closeAdvert);
  document.addEventListener('keydown', escPressHandler);

  return advert;
};

// Создаем пин
var renderPin = function (pinData, index) {
  var pin = mapPinTemplate.cloneNode(true);

  // Отрисовка карточки при нажатии на пин
  pin.addEventListener('click', function () {
    showAdvert(map, adverts[index]);
  });

  pin.style.left = pinData.location.x - pin.offsetWidth / 2 + 'px';
  pin.style.top = pinData.location.y - pin.offsetHeight + 'px';
  pin.querySelector('img').src = pinData.author.avatar;
  pin.querySelector('img').alt = pinData.offer.title;

  return pin;
};

// Получаем координаты ползунка
var getCoordinations = function () {
  var left = addressPointer.offsetLeft - Math.round(addressPointer.offsetWidth / 2);
  var top = addressPointer.offsetTop;

  adressInput.value = left + ', ' + top;
};

// Вставка DOM карточки
var showAdvert = function (parent, advert) {
  var mapCard = parent.querySelector('.map__card');
  if (parent.querySelector('.map__card')) {
    parent.replaceChild(createAdvert(advert), parent.querySelector('.map__card'));
  }
  if (mapCard) {
    closeAdvert();
  }

  map.insertBefore(createAdvert(advert), mapFiltersContainer);
};

// Отрисовка
var renderAllPins = function (elements) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < elements.length; i++) {
    fragment.appendChild(renderPin(elements[i], i));
  }
  mapPins.appendChild(fragment);
};

// Закрытие при нажатии на Escape
var escPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeAdvert();
  }
};

// Функция закрытия карточки
var closeAdvert = function () {
  var popup = map.querySelector('.map__card');
  var popupClose = popup.querySelector('.popup__close');

  map.removeChild(popup);
  document.removeEventListener('keydown', escPressHandler);
  popupClose.removeEventListener('click', closeAdvert);
  popupClose.removeEventListener('keydown', closeAdvert);
};

// Функция изменения состояния при первом нажатии
var pointerFirstClickHandler = function () {
  map.classList.remove('map--faded');

  // Активация формы
  adForm.classList.remove('ad-form--disabled');
  adFieldsets.forEach(function (item) { // Наткнулся в учебнике на данный метод, решил опробовать
    item.disabled = false;
  });

  // Отрисовываем маркеры на карте
  renderAllPins(adverts);

  // Передаем координаты в форму
  getCoordinations();

  // Удаляем обработчик
  addressPointer.removeEventListener('mouseup', pointerFirstClickHandler);
};

// Инициализация первого нажатия
var initPage = function () {
  addressPointer.addEventListener('mouseup', pointerFirstClickHandler);
  addressPointer.addEventListener('keydown', pointerFirstClickHandler);
};
initPage();
