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

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
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

  return fileRoute + route + fileExtension;
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
      'offer': {
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
      }
    };
    // Пушим в массив
    arrayAdverts.push(object);
  }
  return arrayAdverts;
};

// Вызываем массив объектов
var adverts = generateAdvert(ADVERT_COUNT);

