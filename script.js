'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-06-26T17:01:17.194Z',
    '2021-06-29T23:36:17.929Z',
    '2021-07-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 24 * 60 * 60));
  const daysPssed = calcDaysPassed(new Date(), date);
  console.log(daysPssed);
  if (daysPssed === 0) return 'Today';
  if (daysPssed === 1) return 'Yesterday';
  if (daysPssed <= 7) return `${daysPssed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, '0');
    // const month = `${date.getMonth() + 1}`.padStart(2, '0');
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }

  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);
    const formatedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formatedBalance = formatCur(acc.balance, acc.locale, acc.currency);
  // labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  labelBalance.textContent = `${formatedBalance}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formatedIncome = formatCur(incomes, acc.locale, acc.currency);
  labelSumIn.textContent = `${formatedIncome}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formatedOut = formatCur(out, acc.locale, acc.currency);
  labelSumOut.textContent = `${formatedOut}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  const formatedIntrest = formatCur(interest, acc.locale, acc.currency);
  labelSumInterest.textContent = `${formatedIntrest}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = `${Math.floor(time / 60)}`.padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    //In eacg call, print the remaining call to UI
    labelTimer.textContent = `${min}: ${sec}`;

    //When 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    //decrease the time
    time--;
  };
  //Set time to 5 minutes
  let time = 30;

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Create current DATE AND TIME
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const local = navigator.language;
    // console.log(local);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, '0');
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}: ${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
    //Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      //Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//Base 10 0-10
//Base 2 0 and 1
console.log(0.1 + 0.2);
console.log(0.2 + 0.1 === 0.3);
//covert strings to numbers
console.log(Number('23'));
console.log(+'23');
//Parsing
console.log(Number.parseInt('23px'));
console.log(Number.parseInt('e23'));
console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseInt('2.5rem'));
//chech if a value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20x'));
console.log(Number.isNaN(23 / 0));
//check if a value is a number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20x'));
console.log(Number.isFinite(20 / 0));
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));

////////////////////////////////////////////////
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));
console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));
console.log(Math.max(5, 18, '23px', 11, 2));
console.log(Math.min(5, 18, 23, 11, 2));
console.log(Math.PI * Number.parseFloat('10px') ** 2);
console.log(Math.trunc(Math.random() * 6) + 1);
const randomInt = (max, min) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));
// Rounding Integers

console.log(Math.trunc(23.3));
console.log(Math.round(23.3));
console.log(Math.round(23.9));
console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor(23.9));
console.log(Math.floor(-23.3));
console.log(Math.ceil(-23.3));
//floating decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));

//Remainder Operatiojn
console.log(5 % 2);
console.log(5 / 2); //5=2*2+1
console.log(8 % 3);
console.log(8 / 3); //8=3*2+2
console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    //0 2 4 6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    //0 3 6 9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});
console.log(2 ** 53 - 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 5);
console.log(2 ** 53 + 6);
console.log(734768340980278236623518209128039877826472n);
console.log(BigInt(734768340980278236623518209128039877826472));
//OPERATIONS
console.log(10000n + 10000n);
console.log(2816876324698721639487629n * 83746854n);
const huge = 79659786765654564757654n;
const num = 23;
console.log(BigInt(num) * huge);
console.log(20n > 15);
console.log(20n === 20);
console.log(20n == 20);

console.log(huge + 'is REALLY big!!! ');
//Divisions
console.log(10n / 3n);
console.log(11n / 3n);
console.log(12n / 3n);

//Create a date
// const now = new Date();
// console.log(now);
// console.log(new Date('Thu Jul 01 2021 10:07:37 '));
// console.log(new Date('24 Decemebr 2015'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2012, 11, 5, 12, 4, 30));
// console.log(new Date(2012, 11, 33));
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
//Working with Dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());
// console.log(new Date(2142244380000));
// console.log(Date.now());
// console.log(new Date(1625120145464));

//operation with date
const future = new Date(2037, 10, 19, 15, 23);
console.log(typeof future);
const calcDaysPassed = (date1, date2) =>
  Math.abs(date1 - date2) / (1000 * 24 * 60 * 60);

const day1 = calcDaysPassed(new Date(2037, 10, 19), new Date(2037, 10, 29));
console.log(day1);
//Internationalizing numebrs
const options = {
  style: 'curremcy',
  unit: 'mile-per-hour',
  currency: 'EUR',
  // usegrouping: false,
};

// const num1 = 76327642.2873;
// // console.log('US:', new Intl.NumberFormat('en-US', options).format(num1));
// console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num1));
// console.log('Iran:', new Intl.NumberFormat('fa-IR', options).format(num1));
// console.log(
//   'Browser:',
//   new Intl.NumberFormat(navigator.language, options).format(num1)
// );
//setTimeout
const ingredients = ['olives', 'Spinach'];
console.log(account2);
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza🍕 with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('wating...');
if (ingredients.includes('Spinach')) clearTimeout(pizzaTimer);
//setInterval
// setInterval(function () {
//   const now = new Date();
//   const hour = now.getHours();
//   const mins = now.getMinutes();
//   const sec = now.getSeconds();
//   console.log(`${hour}:${mins}:${sec}`);
//   // console.log(
//   //   new Intl.DateTimeFormat(navigator.language, {
//   //     hour: 'numeric',
//   //     minute: 'numeric',
//   //     second: 'numeric',
//   //   }).format(now)
//   // );
// }, 1000);
