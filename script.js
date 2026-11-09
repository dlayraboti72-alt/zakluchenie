// Навигация между практическими работами
const navButtons = document.querySelectorAll(".nav-btn");
const panels = document.querySelectorAll(".panel");
navButtons.forEach(btn => btn.addEventListener("click", () => {
  navButtons.forEach(b => b.classList.remove("active"));
  panels.forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(btn.dataset.target).classList.add("active");
}));

// Практическая №1. Регистрация студента
document.getElementById("studentForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const age = Number(document.getElementById("studentAge").value);
  const group = document.getElementById("studentGroup").value.trim();
  const phone = document.getElementById("studentPhone").value.trim();
  const phoneOk = /^\+?[0-9\s()-]{10,18}$/.test(phone);
  const result = document.getElementById("studentResult");
  if (!name || !email || age < 14 || age > 100 || !group || !phoneOk) {
    result.textContent = "Проверьте данные. Возраст должен быть от 14 до 100 лет, телефон — корректным.";
    return;
  }
  result.textContent = `Студент ${name} зарегистрирован! Группа: ${group}. Возраст: ${age}. Email: ${email}.`;
});

// Практическая №2. Калькулятор заказа
function calculateTotal(price, quantity) {
  const subtotal = price * quantity;
  const discount = subtotal >= 50000 ? subtotal * 0.10 : 0;
  return { subtotal, discount, total: subtotal - discount };
}
document.getElementById("calculateBtn").addEventListener("click", () => {
  const price = Number(document.getElementById("price").value);
  const quantity = Number(document.getElementById("quantity").value);
  const output = document.getElementById("totalResult");
  if (!Number.isFinite(price) || !Number.isInteger(quantity) || price < 0 || quantity < 1) {
    output.textContent = "Введите цену не меньше 0 и целое количество от 1.";
    return;
  }
  const result = calculateTotal(price, quantity);
  output.innerHTML = `Сумма: <b>${result.subtotal.toLocaleString("ru-RU")} ₸</b><br>Скидка: ${result.discount.toLocaleString("ru-RU")} ₸<br><b>Итого: ${result.total.toLocaleString("ru-RU")} ₸</b>`;
});

// Практическая №3. Проверка пароля
const passwordInput = document.getElementById("password");
passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  const lengthOk = value.length >= 8;
  const lettersOk = /[A-Za-zА-Яа-я]/.test(value) && /\d/.test(value);
  const specialOk = /[^A-Za-zА-Яа-я0-9]/.test(value);
  [["ruleLength", lengthOk], ["ruleLetters", lettersOk], ["ruleSpecial", specialOk]].forEach(([id, ok]) => {
    document.getElementById(id).classList.toggle("ok", ok);
  });
  const score = [lengthOk, lettersOk, specialOk].filter(Boolean).length;
  const meter = document.getElementById("passwordMeter");
  meter.style.width = `${score / 3 * 100}%`;
  meter.style.background = ["#d64d5f", "#e0a12d", "#16845b"][Math.max(0, score - 1)];
  document.getElementById("passwordStrength").textContent = value ? ["Слабый пароль", "Средний пароль", "Надёжный пароль"][score - 1] || "Слабый пароль" : "Введите пароль для проверки.";
});
document.getElementById("togglePassword").addEventListener("click", () => {
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  document.getElementById("togglePassword").textContent = show ? "Скрыть" : "Показать";
});

// Практическая №4. Выбор курса
const courses = {
  js: { name: "JavaScript", hours: 72, price: 35000, description: "Основы языка, DOM, события и интерактивные приложения." },
  python: { name: "Python", hours: 96, price: 42000, description: "Синтаксис Python, функции, коллекции и основы разработки." },
  html: { name: "HTML и CSS", hours: 48, price: 25000, description: "Структура веб-страниц, стили, адаптивная вёрстка." },
  node: { name: "Node.js", hours: 60, price: 39000, description: "Серверный JavaScript, npm и создание API." }
};
let selectedCourse = "";
document.getElementById("course").addEventListener("change", event => {
  selectedCourse = event.target.value;
  const c = courses[selectedCourse];
  document.getElementById("courseInfo").textContent = c ? `${c.name} — ${c.hours} часов. Стоимость: ${c.price.toLocaleString("ru-RU")} ₸. ${c.description}` : "";
  document.getElementById("enrollCourse").disabled = !c;
  document.getElementById("courseMessage").textContent = "";
});
document.getElementById("enrollCourse").addEventListener("click", () => {
  if (selectedCourse) document.getElementById("courseMessage").textContent = `Вы выбрали курс «${courses[selectedCourse].name}». Заявка на обучение подготовлена.`;
});

// Практическая №5. Зависимые списки
const groupData = {
  software: { "РПО-24-2": ["Алихан", "Данияр", "Аружан"], "РПО-25-1": ["Алина", "Мирас", "Ержан"], "РПО-25-2": ["Айдана", "Нурлан", "Диас"] },
  design: { "ДИЗ-24-1": ["Мадина", "Асем"], "ДИЗ-25-1": ["София", "Камилла"] },
  network: { "СЕТ-24-1": ["Арман", "Тимур"], "СЕТ-25-1": ["Руслан", "Ильяс"] }
};
const specialty = document.getElementById("specialty");
const groupSelect = document.getElementById("groupSelect");
const studentSelect = document.getElementById("studentSelect");
specialty.addEventListener("change", () => {
  groupSelect.innerHTML = '<option value="">Выберите группу</option>';
  studentSelect.innerHTML = '<option value="">Сначала выберите группу</option>';
  studentSelect.disabled = true;
  const groups = groupData[specialty.value] || {};
  Object.keys(groups).forEach(group => groupSelect.add(new Option(group, group)));
  groupSelect.disabled = !Object.keys(groups).length;
  document.getElementById("groupInfo").textContent = "";
});
groupSelect.addEventListener("change", () => {
  const students = groupData[specialty.value]?.[groupSelect.value] || [];
  studentSelect.innerHTML = '<option value="">Выберите студента</option>';
  students.forEach(student => studentSelect.add(new Option(student, student)));
  studentSelect.disabled = !students.length;
  document.getElementById("groupInfo").textContent = groupSelect.value ? `Выбрана группа: ${groupSelect.value}. Специальность: ${specialty.options[specialty.selectedIndex].text}.` : "";
});
studentSelect.addEventListener("change", () => {
  if (studentSelect.value) document.getElementById("groupInfo").textContent += ` Студент: ${studentSelect.value}.`;
});

// Практическая №6. Каталог товаров: 15 позиций, filter() и сортировка
const products = [
  {name:"Acer Aspire 5",category:"Ноутбуки",price:280000,icon:"💻"},
  {name:"Lenovo IdeaPad",category:"Ноутбуки",price:245000,icon:"💻"},
  {name:"ASUS VivoBook",category:"Ноутбуки",price:310000,icon:"💻"},
  {name:"HP Pavilion",category:"Ноутбуки",price:355000,icon:"💻"},
  {name:"MacBook Air",category:"Ноутбуки",price:620000,icon:"💻"},
  {name:"Samsung Galaxy A55",category:"Телефоны",price:185000,icon:"📱"},
  {name:"iPhone 15",category:"Телефоны",price:390000,icon:"📱"},
  {name:"Xiaomi Redmi Note",category:"Телефоны",price:125000,icon:"📱"},
  {name:"Google Pixel",category:"Телефоны",price:320000,icon:"📱"},
  {name:"Samsung Galaxy S24",category:"Телефоны",price:450000,icon:"📱"},
  {name:"iPad 10",category:"Планшеты",price:220000,icon:"📲"},
  {name:"Galaxy Tab S9",category:"Планшеты",price:340000,icon:"📲"},
  {name:"Lenovo Tab M11",category:"Планшеты",price:115000,icon:"📲"},
  {name:"Xiaomi Pad 6",category:"Планшеты",price:190000,icon:"📲"},
  {name:"iPad Pro",category:"Планшеты",price:590000,icon:"📲"}
];
function renderProducts() {
  const category = document.getElementById("category").value;
  const range = document.getElementById("priceRange").value;
  const direction = document.getElementById("sortPrice").value;
  let shown = products.filter(p => category === "all" || p.category === category);
  shown = shown.filter(p => range === "all" || (range === "low" && p.price < 100000) || (range === "mid" && p.price >= 100000 && p.price <= 300000) || (range === "high" && p.price > 300000));
  shown.sort((a,b) => direction === "asc" ? a.price-b.price : b.price-a.price);
  document.getElementById("productList").innerHTML = shown.length ? shown.map(p => `<article class="product"><div class="emoji">${p.icon}</div><h4>${p.name}</h4><p>${p.category}</p><strong>${p.price.toLocaleString("ru-RU")} ₸</strong></article>`).join("") : '<p class="muted">Товары не найдены.</p>';
}
["category","sortPrice","priceRange"].forEach(id => document.getElementById(id).addEventListener("change", renderProducts));
renderProducts();

// Практическая №7. Секундомер
let watchSeconds = 0, watchInterval = null;
function formatTime(seconds) { return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`; }
function updateWatch() { document.getElementById("stopwatchDisplay").textContent = formatTime(watchSeconds); }
document.getElementById("watchStart").addEventListener("click", () => {
  if (watchInterval !== null) return;
  watchInterval = setInterval(() => { watchSeconds++; updateWatch(); }, 1000);
});
document.getElementById("watchStop").addEventListener("click", () => { clearInterval(watchInterval); watchInterval = null; });
document.getElementById("watchReset").addEventListener("click", () => { clearInterval(watchInterval); watchInterval = null; watchSeconds = 0; updateWatch(); });

// Практическая №8. Обратный отсчёт
const durationSelect = document.getElementById("countdownDuration");
let countdownRemaining = Number(durationSelect.value), countdownInterval = null;
function renderCountdown() { document.getElementById("countdownDisplay").textContent = formatTime(countdownRemaining); }
function resetCountdown() {
  clearInterval(countdownInterval); countdownInterval = null;
  countdownRemaining = Number(durationSelect.value); renderCountdown();
  document.getElementById("countdownMessage").textContent = "";
}
durationSelect.addEventListener("change", resetCountdown);
document.getElementById("countStart").addEventListener("click", () => {
  if (countdownInterval !== null || countdownRemaining <= 0) return;
  document.getElementById("countdownMessage").textContent = "";
  countdownInterval = setInterval(() => {
    countdownRemaining--; renderCountdown();
    if (countdownRemaining <= 0) {
      clearInterval(countdownInterval); countdownInterval = null;
      document.getElementById("countdownMessage").textContent = "Время вышло!";
      try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); osc.connect(ctx.destination); osc.frequency.value=660; osc.start(); osc.stop(ctx.currentTime+.35); } catch(e) {}
    }
  }, 1000);
});
document.getElementById("countPause").addEventListener("click", () => { clearInterval(countdownInterval); countdownInterval = null; });
document.getElementById("countReset").addEventListener("click", resetCountdown);
renderCountdown();

// Практическая №9. Слайдер с автопереключением
const slides = [
  ["JavaScript","Создавайте интерактивные сайты","#272b5d","#7778ed"],
  ["HTML и CSS","Структура и стиль веб-страниц","#164b56","#3ba7a1"],
  ["Node.js","JavaScript на стороне сервера","#46295d","#9b66bd"],
  ["Практика","Учитесь на реальных задачах","#6b3b2b","#d18a55"],
  ["Ваш проект","Объедините знания в приложении","#244b36","#4ca77a"]
];
let slideIndex = 0, sliderInterval = null;
function showSlide(index) {
  slideIndex = (index + slides.length) % slides.length;
  const slide = slides[slideIndex], visual = document.getElementById("slideVisual");
  visual.style.background = `linear-gradient(135deg,${slide[2]},${slide[3]})`;
  visual.innerHTML = `<span>${String(slideIndex+1).padStart(2,"0")}</span><strong>${slide[0]}</strong><small>${slide[1]}</small>`;
  document.getElementById("slideCounter").textContent = `${slideIndex+1} / ${slides.length}`;
}
function startSlider() { if (sliderInterval === null) sliderInterval = setInterval(() => showSlide(slideIndex+1), 3000); }
function stopSlider() { clearInterval(sliderInterval); sliderInterval = null; }
document.getElementById("nextSlide").addEventListener("click", () => showSlide(slideIndex+1));
document.getElementById("prevSlide").addEventListener("click", () => showSlide(slideIndex-1));
document.getElementById("sliderToggle").addEventListener("click", event => {
  if (sliderInterval === null) { startSlider(); event.target.textContent = "Остановить автопрокрутку"; }
  else { stopSlider(); event.target.textContent = "Запустить автопрокрутку"; }
});
showSlide(0); startSlider();

// Практическая №10. Тест из 10 вопросов, 5 минут и localStorage
const questions = [
  {q:"Как объявить переменную, значение которой нельзя переназначить?",a:["var","let","const","static"],c:2},
  {q:"Какой метод выбирает элемент по ID?",a:["getElementById()","queryAll()","getClass()","selectId()"],c:0},
  {q:"Какой оператор сравнивает значение и тип?",a:["=","==","===","!="],c:2},
  {q:"Как добавить обработчик события?",a:["addEvent()","addEventListener()","onListener()","listen()"],c:1},
  {q:"Что делает setInterval()?",a:["Запускает код один раз","Повторяет код через интервал","Останавливает код","Удаляет элемент"],c:1},
  {q:"Как преобразовать строку в число?",a:["String()","Boolean()","Number()","Array()"],c:2},
  {q:"Какой метод фильтрует массив?",a:["map()","filter()","push()","join()"],c:1},
  {q:"Как получить значение поля ввода?",a:["element.text","element.value","element.name","element.input"],c:1},
  {q:"Как остановить setInterval()?",a:["stopInterval()","clearInterval()","breakInterval()","endTimer()"],c:1},
  {q:"Где можно хранить данные в браузере между перезагрузками?",a:["localStorage","console","prompt","alert"],c:0}
];
let questionIndex = 0, userAnswers = Array(questions.length).fill(null), quizSeconds = 300, quizInterval = null, quizFinished = false;
function renderQuestion() {
  const q = questions[questionIndex];
  document.getElementById("questionCounter").textContent = `Вопрос ${questionIndex+1} из ${questions.length}`;
  document.getElementById("questionText").textContent = q.q;
  document.getElementById("quizProgress").style.width = `${(questionIndex+1)/questions.length*100}%`;
  document.getElementById("answers").innerHTML = q.a.map((answer,i) => `<label class="answer-option"><input type="radio" name="answer" value="${i}" ${userAnswers[questionIndex]===i?"checked":""}>${answer}</label>`).join("");
  document.getElementById("answers").querySelectorAll("input").forEach(input => input.addEventListener("change", () => userAnswers[questionIndex] = Number(input.value)));
  document.getElementById("quizPrev").disabled = questionIndex === 0;
  document.getElementById("quizNext").textContent = questionIndex === questions.length-1 ? "Завершить тест" : "Далее";
}
function updateQuizClock() { document.getElementById("quizTimer").textContent = formatTime(quizSeconds); }
function finishQuiz() {
  if (quizFinished) return;
  quizFinished = true; clearInterval(quizInterval); quizInterval = null;
  const correct = userAnswers.reduce((sum,answer,i) => sum + (answer === questions[i].c ? 1 : 0),0);
  const percent = Math.round(correct/questions.length*100);
  document.getElementById("quizArea").classList.add("hidden");
  document.getElementById("quizResult").classList.remove("hidden");
  document.getElementById("quizResult").innerHTML = `<b>Тест завершён!</b><br>Правильных ответов: ${correct} из ${questions.length}<br>Результат: ${percent}%`;
  document.getElementById("quizRestart").classList.remove("hidden");
  localStorage.setItem("lastQuizScore", JSON.stringify({correct,percent,date:new Date().toLocaleString("ru-RU")}));
  document.getElementById("lastQuizScore").textContent = `Последний сохранённый результат: ${correct}/10 (${percent}%).`;
}
function startQuizClock() {
  if (quizInterval !== null || quizFinished) return;
  quizInterval = setInterval(() => { quizSeconds--; updateQuizClock(); if (quizSeconds <= 0) finishQuiz(); },1000);
}
document.getElementById("quizNext").addEventListener("click", () => {
  if (questionIndex < questions.length-1) { questionIndex++; renderQuestion(); }
  else finishQuiz();
});
document.getElementById("quizPrev").addEventListener("click", () => { if (questionIndex>0) { questionIndex--; renderQuestion(); } });
document.getElementById("quizRestart").addEventListener("click", () => {
  questionIndex=0; userAnswers=Array(questions.length).fill(null); quizSeconds=300; quizFinished=false;
  document.getElementById("quizArea").classList.remove("hidden"); document.getElementById("quizResult").classList.add("hidden"); document.getElementById("quizRestart").classList.add("hidden");
  updateQuizClock(); renderQuestion(); startQuizClock();
});
const savedQuiz = localStorage.getItem("lastQuizScore");
if (savedQuiz) { const score=JSON.parse(savedQuiz); document.getElementById("lastQuizScore").textContent=`Предыдущий результат: ${score.correct}/10 (${score.percent}%) — ${score.date}`; }
renderQuestion(); updateQuizClock(); startQuizClock();

// Итоговый проект. Онлайн-запись на консультацию
const teachers = [
  {id:"sara",name:"Сара Ахметова",slots:["09:00","10:00","11:30","14:00"]},
  {id:"ermek",name:"Ермек Нуртаев",slots:["09:30","12:00","13:30","15:00"]},
  {id:"dana",name:"Дана Садыкова",slots:["10:30","11:00","14:30","16:00"]}
];
const teacherSelect = document.getElementById("teacher");
teachers.forEach(t => teacherSelect.add(new Option(t.name,t.id)));
const dateInput = document.getElementById("bookingDate");
dateInput.min = new Date().toISOString().slice(0,10);
let bookings = [], activeBooking = null, confirmationInterval = null, confirmationSeconds = 120;
function loadTimeSlots() {
  const slotSelect = document.getElementById("timeSlot");
  const teacher = teachers.find(t=>t.id===teacherSelect.value);
  slotSelect.innerHTML = '<option value="">Выберите время</option>';
  if (!teacher || !dateInput.value) { slotSelect.disabled=true; return; }
  const occupied = bookings.filter(b=>b.teacherId===teacher.id && b.date===dateInput.value && b.status==="Подтверждена").map(b=>b.time);
  teacher.slots.filter(slot=>!occupied.includes(slot)).forEach(slot=>slotSelect.add(new Option(slot,slot)));
  slotSelect.disabled = slotSelect.options.length <= 1;
  if (slotSelect.disabled) slotSelect.innerHTML = '<option value="">Нет свободного времени</option>';
}
teacherSelect.addEventListener("change",loadTimeSlots);
dateInput.addEventListener("change",loadTimeSlots);
function checkAvailability(teacherId,date,time) {
  return !bookings.some(b=>b.teacherId===teacherId && b.date===date && b.time===time && b.status==="Подтверждена");
}
function validateForm() {
  const name=document.getElementById("bookingName").value.trim();
  const email=document.getElementById("bookingEmail").value.trim();
  const group=document.getElementById("bookingGroup").value.trim();
  const topic=document.getElementById("bookingTopic").value.trim();
  return name.length>=2 && email.includes("@") && group.length>0 && topic.length>=3 && teacherSelect.value && dateInput.value && document.getElementById("timeSlot").value;
}
function createBooking() {
  const teacher=teachers.find(t=>t.id===teacherSelect.value);
  const booking={id:Date.now(),name:document.getElementById("bookingName").value.trim(),email:document.getElementById("bookingEmail").value.trim(),group:document.getElementById("bookingGroup").value.trim(),teacherId:teacher.id,teacher:teacher.name,date:dateInput.value,time:document.getElementById("timeSlot").value,topic:document.getElementById("bookingTopic").value.trim(),status:"Подтверждена"};
  bookings.push(booking); activeBooking=booking; return booking;
}
function startConfirmationTimer() {
  clearInterval(confirmationInterval); confirmationSeconds=120;
  document.getElementById("confirmationBox").classList.remove("hidden");
  document.getElementById("confirmationTimer").textContent=formatTime(confirmationSeconds);
  confirmationInterval=setInterval(()=>{
    confirmationSeconds--;
    document.getElementById("confirmationTimer").textContent=formatTime(confirmationSeconds);
    if(confirmationSeconds<=0){clearInterval(confirmationInterval);confirmationInterval=null;cancelBooking("Время подтверждения истекло.");}
  },1000);
}
function showBookings() {
  const list=document.getElementById("bookingList");
  list.innerHTML=bookings.length ? bookings.slice().reverse().map(b=>`<article class="booking-item"><strong>${b.name}</strong><br>${b.date} в ${b.time} · ${b.teacher}<br>Группа: ${b.group} · Статус: <b>${b.status}</b><br><span class="muted">${b.topic}</span></article>`).join("") : '<p class="muted">Пока заявок нет.</p>';
}
function cancelBooking(message="Запись отменена.") {
  if(!activeBooking)return;
  clearInterval(confirmationInterval);confirmationInterval=null;
  activeBooking.status="Отменена";activeBooking=null;
  document.getElementById("confirmationBox").classList.add("hidden");
  document.getElementById("bookingStatus").textContent=message;
  showBookings();loadTimeSlots();
}
document.getElementById("bookingForm").addEventListener("submit",event=>{
  event.preventDefault();
  const status=document.getElementById("bookingStatus");
  if(!validateForm()){status.textContent="Заполните все поля корректно.";return;}
  if(!checkAvailability(teacherSelect.value,dateInput.value,document.getElementById("timeSlot").value)){status.textContent="Это время уже занято. Выберите другой интервал.";loadTimeSlots();return;}
  if(activeBooking)cancelBooking("Предыдущая заявка заменена новой.");
  const booking=createBooking();
  status.textContent=`Заявка создана: ${booking.teacher}, ${booking.date} в ${booking.time}. Подтвердите её в течение 2 минут (учебный таймер).`;
  showBookings();startConfirmationTimer();
});
document.getElementById("cancelBooking").addEventListener("click",()=>cancelBooking());
showBookings();
