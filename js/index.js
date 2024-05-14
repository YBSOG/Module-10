const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания

const minWeightInput = document.querySelector('.minweight__input') // поле с минимальным весом
const maxWeightInput = document.querySelector('.maxweight__input') // поле с максимальным весом
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации

const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки

const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  const fruitsItems = document.querySelectorAll(".fruit__item");
  fruitsItems.forEach(item => fruitsList.removeChild(item))

  fruitItemColor = ["violet", "green", "carmazin", "yellow", "lightbrown",
    "black", "gray", "blue", "pink", "lightblue", "violet",
    "green", "carmazin", "yellow", "lightbrown", "black",
    "gray", "blue", "pink", "lightblue", "violet", "green"] // Для CSS 

  for (let i = 0; i < fruits.length; i++) {

    const newLi = document.createElement("li");
    newLi.className = `fruit__item fruit_${fruitItemColor[i]}`;

    newLi.innerHTML = `<div class="fruit__info">
                        <div>index: ${i}</div>
                        <div>kind: ${fruits[i].kind}</div>
                        <div>color: ${fruits[i].color}</div>
                        <div>weight (кг): ${fruits[i].weight}</div>
                      </div>`;

    fruitsList.appendChild(newLi);
  }


};

// первая отрисовка карточек
window.onload = display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  let compare = JSON.parse(JSON.stringify(fruits));

  while (fruits.length > 0) {
    let randomInt = getRandomInt(0, fruits.length - 1);
    splicedFruit = fruits.splice(randomInt, 1)[0];
    result.push(splicedFruit);
  }

  fruits = result;

  const areArraysEqual = (firstArr, secondArr) => {
    if (JSON.stringify(firstArr) == JSON.stringify(secondArr))
      return alert('Порядок не изменился, перемешайте еще раз')
  };

  areArraysEqual(result, compare);
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  let newArr = fruits.filter(item => {

    let minValue = parseInt(minWeightInput.value);
    minValue = parseInt(minValue.toFixed());
    !isNaN(minValue) || (minValue = 0);
    minValue = (minValue >= 0) ? minValue : 0;
    minWeightInput.value = minValue;

    let maxValue = parseInt(maxWeightInput.value);
    maxValue = parseInt(maxValue.toFixed());
    !isNaN(maxValue) || (maxValue = 99);
    maxValue = (maxValue <= 99) ? maxValue : 99;
    maxWeightInput.value = maxValue;

    if (item.weight >= minValue && item.weight <= maxValue) 
      return true
  });

  fruits = newArr;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

//Указать порядок цветов для сортировки
const priority = ['желтый', 'светло-коричневый', 'зеленый', 'розово-красный', 'фиолетовый'];

const comparationColor = (fruit1, fruit2) => {
  const priority1 = priority.indexOf(fruit1.color);
  const priority2 = priority.indexOf(fruit2.color);
  return priority1 > priority2;
};

//Функции сортировки
const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {

      for (let j = 0; j < n - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          let temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  },

  quickSort(arr) {
    return quickSortHelper(arr, 0, arr.length - 1);

    function quickSortHelper(arr, left, right) {
      if (arr.length < 2) {
        return arr;
      }
      const index = partition(arr, left, right);

      if (left < index - 1) {
        quickSortHelper(arr, left, index - 1);
      };
      if (index < right) {
        quickSortHelper(arr, index, right);
      };
      return arr;
    };

    // функция разделитель
    function partition(arr, left, right) {
      const pivot = arr[Math.floor((right + left) / 2)];

      while (left <= right) {
        while (comparationColor(pivot, arr[left],)) {
          left++;
        };
        while (comparationColor(arr[right], pivot)) {
          right--;
        };
        if (left <= right) {
          swap(arr, left, right);
          left++;
          right--;
        };
      };
      return left;
    };

    // функция обмена местами
    function swap(arr, i, j) {
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    };
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;


// изменить способ сортировки
sortChangeButton.addEventListener('click', () => {
  sortKind == 'bubbleSort' ? sortKind = `quickSort` : sortKind = 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

//запустить сортировку
sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = `sorting...`;
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  let newFruit = { kind: kindInput.value, color: colorInput.value, weight: weightInput.value };

  if (kindInput.value !== "" && colorInput.value !== "" && weightInput.value !== "") {

    fruits.push(newFruit)
    priority.push(colorInput.value)
    display();

  } else alert('Заполните все поля!')
});
