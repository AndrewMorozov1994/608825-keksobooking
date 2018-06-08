'use strict';

// Объявление переменных
var ADVERT_COUNT = 8;
var FILE_ROUTE = 'img/avatars/user';
var USER_INDEX = ['1', '2', '3', '4', '5', '6', '7', '8'];
var FILE_EXTENSION = '.png';
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var ADRESS_X_MIN = 300;
var ADRESS_X_MAX = 900;
var ADRESS_Y_MIN = 130;
var ADRESS_Y_MAX = 630;
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
var arrayAdverts = []; // Пустой массив который будет заполняться объектами
var object = {}; // Пустой объект который будет заполняться свойствами

// Для создания и отрисовки
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

map.classList.remove('map--faded');

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

// Функция получения значения от 01.. для ссылки на аватар
var getRoute = function (fileRoute, fileExtension, userIndex) {
  var routeIndex = getRandomIndex(0, userIndex.length - 1);
  var route = userIndex[routeIndex];

  userIndex.splice(routeIndex, 1); // Вырезаем индекс, который уже был использован

  return fileRoute + '0' + route + fileExtension;
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
var generateAdvert = function (totalAdvert) {
  for (var i = 0; i < totalAdvert; i++) {
    object.author = {
      'avatar': getRoute(FILE_ROUTE, FILE_EXTENSION, USER_INDEX)
    };
    object.offer = {
      'title': getTitle(TITLES),
      'address': getRandomIndex(ADRESS_X_MIN, ADRESS_X_MAX) + ', ' + getRandomIndex(ADRESS_Y_MIN, ADRESS_Y_MAX),
      'price': getRandomIndex(PRICE_MIN, PRICE_MAX),
      'type': getRandomElement(TYPES),
      'rooms': getRandomIndex(ROOM_MIN, ROOM_MAX),
      'guests': getRandomIndex(GUEST_MIN, GUEST_MAX),
      'checkin': getRandomElement(TIMES),
      'checkout': getRandomElement(TIMES),
      'features': getRandomLengthArray(FEATURES),
      'description': '',
      'photos': getRandomSortElements(PHOTOS)
    };
    object.location = {
      'x': getRandomIndex(ADRESS_X_MIN, ADRESS_X_MAX),
      'y': getRandomIndex(ADRESS_Y_MIN, ADRESS_Y_MAX)
    };
    // Пушим в массив
    arrayAdverts.push(object);
  }
  return arrayAdverts;
};

// Вызываем массив объектов
var adverts = generateAdvert(ADVERT_COUNT);

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

  return advert;
};

// Создаем пин
var renderPin = function (pinData) {
  var pin = mapPinTemplate.cloneNode(true);

  pin.style.left = pinData.location.x - pin.offsetWidth / 2 + 'px';
  pin.style.top = pinData.location.y - pin.offsetHeight + 'px';
  pin.querySelector('img').src = pinData.author.avatar;
  pin.querySelector('img').alt = pinData.offer.title;

  return pin;
};

// Вставка DOM
var showAdvert = function (parent, advert) {
  if (parent.querySelector('.map__card')) {
    parent.replaceChild(createAdvert(advert), parent.querySelector('.map__card'));
  }

  map.insertBefore(createAdvert(advert), mapFiltersContainer);
};

// Отрисовка
var fragment = document.createDocumentFragment();
for (var i = 0; i < adverts.length; i++) {
  fragment.appendChild(renderPin(adverts[i]));
}
mapPins.appendChild(fragment);

showAdvert(map, adverts[0]);
