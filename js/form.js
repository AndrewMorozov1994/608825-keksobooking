'use strict';

(function () {
  // Исходные координаты ползунка
  var INITIAL_ADDRESS_X = 537;
  var INITIAL_ADDRESS_Y = 375;

  var map = document.querySelector('.map');
  var addressPointer = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var filterField = document.querySelector('.map__filters');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  // Находим Инпуты в форме
  var titleAd = adForm.querySelector('#title');
  var homesType = adForm.querySelector('#type');
  var price = adForm.querySelector('#price');
  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');
  var roomNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');
  var adressInput = adForm.querySelector('#address');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var successSendForm = document.querySelector('.success');

  // Валидация заголовка
  var setTitleInvalid = function () {
    if (titleAd.validity.tooShort) {
      titleAd.setCustomValidity('Минимальное число символов: ' + titleAd.minLength);
    } else if (titleAd.validity.tooLong) {
      titleAd.setCustomValidity('Максимальное число символов: ' + titleAd.maxLength);
    } else if (titleAd.validity.valueMissing) {
      titleAd.setCustomValidity('Обязательное поле');
    } else {
      titleAd.setCustomValidity('');
    }
  };

  titleAd.addEventListener('invalid', setTitleInvalid);
  titleAd.addEventListener('change', function (evt) {
    evt.target.checkValidity();
  });

  // Минимальная цена в зависимости от типа жилья
  var setPrice = function () {
    price.min = window.advert.TYPES[homesType.value].minPrice;
    price.placeholder = window.advert.TYPES[homesType.value].minPrice;
  };

  homesType.addEventListener('change', setPrice);

  var toggleFieldsetDisabled = function (isDisabled) {
    for (var j = 1; j < adFormFieldsets.length; j++) {
      adFormFieldsets[j].disabled = isDisabled;
    }
  };
  toggleFieldsetDisabled(true);

  // Валидация цены
  var setPriceInvalid = function () {
    if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Минимальная цена: ' + price.min);
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity('Максимальная цена: ' + price.max);
    } else if (price.validity.valueMissing) {
      price.setCustomValidity('Обязательное поле');
    } else {
      price.setCustomValidity('');
    }
  };

  price.addEventListener('invalid', setPriceInvalid);
  price.addEventListener('change', function (evt) {
    evt.target.checkValidity();
  });

  // Синхронизация времени въезда и выезда
  timeIn.addEventListener('change', function () {
    timeOut.value = timeIn.value;
  });

  timeOut.addEventListener('change', function () {
    timeIn.value = timeOut.value;
  });

  // Синхронизация количества гостей и количества комнат
  var setRoomsToGuests = function () {
    if (+roomNumber.value < roomNumber.length) {
      capacity.value = roomNumber.value;
    } else {
      capacity.value = 0;
    }

    for (var i = 0; i < capacity.length; i++) {
      var option = capacity.options[i];
      var notForGuests = +option.value === 0;

      if (+roomNumber.value === 100) {
        option.disabled = !notForGuests;
      } else {
        option.disabled = notForGuests || +option.value > +roomNumber.value;
      }
    }
  };
  roomNumber.addEventListener('change', setRoomsToGuests);

  // Получаем координаты ползунка
  var getCoordinations = function () {
    var left = addressPointer.offsetLeft + Math.round(addressPointer.offsetWidth / 2);
    var top = addressPointer.offsetTop;

    adressInput.value = left + ', ' + top;
  };

  // Кнопка сброса
  var resetClickHandler = function () {
    adForm.reset();
    filterField.reset();

    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');

    window.pins.removePins();
    addressPointer.style.left = INITIAL_ADDRESS_X + 'px';
    addressPointer.style.top = INITIAL_ADDRESS_Y + 'px';

    getCoordinations();
    window.advert.closeAdvert();
    setPrice();
    toggleFieldsetDisabled(true);

    window.previewPhotos.resetAvatarLoad();
    window.previewPhotos.resetPhotoContainer();
  };

  resetButton.addEventListener('click', resetClickHandler);

  // Отправка формы
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    document.addEventListener('keydown', escPressHandler);
    document.addEventListener('click', successCloseHandler);

    window.backend.upload(new FormData(adForm), function () {
      successSendForm.classList.remove('hidden');

      resetClickHandler();
    }, window.backend.createErrorPopup);
  });

  var escPressHandler = function (evt) {
    window.utils.closePopupHelper(evt, successCloseHandler);
  };

  var successCloseHandler = function () {
    successSendForm.classList.add('hidden');
    document.removeEventListener('keydown', escPressHandler);
    document.removeEventListener('click', successCloseHandler);
  };

  window.form = {
    getCoordinations: getCoordinations,
    setPrice: setPrice,
    setRoomsToGuests: setRoomsToGuests,
    toggleFieldsetDisabled: toggleFieldsetDisabled
  };
})();
