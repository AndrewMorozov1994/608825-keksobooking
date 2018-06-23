'use strict';

(function () {
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

  window.calc = {
    getRandomIndex: getRandomIndex,
    getRandomElement: getRandomElement,
    getTitle: getTitle,
    getRandomLengthArray: getRandomLengthArray,
    getRandomSortElements: getRandomSortElements
  };
})();

