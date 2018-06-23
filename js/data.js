'use strict';

(function () {
  // Объявление переменных
  var ADVERT_COUNT = 8;
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var ADDRESS_X_MIN = 300;
  var ADDRESS_X_MAX = 900;
  var ADDRESS_Y_MIN = 130;
  var ADDRESS_Y_MAX = 630;
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var TYPES = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };

  var ROOM_MIN = 1;
  var ROOM_MAX = 5;
  var GUEST_MIN = 1;
  var GUEST_MAX = 5;
  var TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var arrayAdverts = []; // Пустой массив который будет заполняться объектами

  // Создаем массив объектов
  var generateAdvert = function (generate) {
    var addressX = window.calc.getRandomIndex(ADDRESS_X_MIN, ADDRESS_X_MAX);
    var addressY = window.calc.getRandomIndex(ADDRESS_Y_MIN, ADDRESS_Y_MAX);

    return {
      author: {
        avatar: 'img/avatars/user0' + generate + '.png'
      },
      offer: {
        title: window.calc.getTitle(TITLES),
        address: addressX + ', ' + addressY,
        price: window.calc.getRandomIndex(PRICE_MIN, PRICE_MAX),
        type: window.calc.getRandomElement(TYPES),
        rooms: window.calc.getRandomIndex(ROOM_MIN, ROOM_MAX),
        guests: window.calc.getRandomIndex(GUEST_MIN, GUEST_MAX),
        checkin: window.calc.getRandomElement(TIMES),
        checkout: window.calc.getRandomElement(TIMES),
        features: window.calc.getRandomLengthArray(FEATURES),
        description: '',
        photos: window.calc.getRandomSortElements(PHOTOS)
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

  window.data = {
    adverts: adverts,
    TYPES: TYPES
  };
})();

