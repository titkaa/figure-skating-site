const questions = [
    {
        question: "А когда с человеком может произойти дрожемент?",
        answers:[
            "Когда он влюбляется",
            "Когда он идет шопиться",
            "Когда он слышит смешную шутку",
            "Когда он боится, пугается"
        ],
        corrAnsw: [3],
        explanation: "Правильно! Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»."
    },
    {
        question: "Говорят, Антон заовнил всех. Это еще как понимать?",
        answers: [
            "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?",
            "Антон очень надоедливый и въедливый человек, всех задолбал",
            "Молодец, Антон, всех победил!",
            "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей"
        ],
        corrAnsw: [2],
        explanation: "Правильно! Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»."
    },
    {
        question: "А фразу «заскамить мамонта» как понимать?",
        answers: [
            "Разозлить кого-то из родителей",
            "Увлекаться археологией",
            "Развести недотепу на деньги",
            "Оскорбить пожилого человека"
        ],
        corrAnsw: [2],
        explanation: "Правильно! Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца."
    },
    {
        question: "Кто такие бефефе?",
        answers: [
            "Вши?",
            "Милые котики, такие милые, что бефефе",
            "Лучшие друзья",
            "Люди, которые не держат слово"
        ],
        corrAnsw: [2],
        explanation: "Правильно! Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever."
    },
    {
        question: "Что из перечисленного можно назвать крашем, если ты чиллишь в компании и вдруг залипаешь на кого-то?",
        answers: [
            "Человек, который тебе очень нравится и вызывает симпатию",
            "Тот, на кого приятно смотреть и хочется общаться",
            "Твоя силльно накрашенная подруга, которая переоценила свой макияж",
            "Трэш в более мягкой интерпретации"
        ],
        corrAnsw: [0, 1],
        explanation: "Правильно! «Краш» — это объект симпатии; «чиллить» — расслабляться, отдыхать; «залипать» — засматриваться или задумываться."
    }
];


let test = document.getElementById('test');
let area = document.getElementById('area');

let current = null;
let answered = 0;
let score = 0;
let shown = null;

function shuffle(arr) {
    return arr.slice().sort(() => Math.random() - 0.5);
}

function addQuestion(q, num) {
    let box = document.createElement('div');
    box.className = 'q';

    let head = document.createElement('div');
    head.className = 'qhead';
    head.innerHTML = '<div>' + num + '. ' + q.question + '</div>';

    box.appendChild(head);
    area.appendChild(box);

    q.done = false;
    head.addEventListener('click', function () {
        clickQuestion(q, box, head);
    });
}

let order = shuffle(questions.slice());
console.log(order);
for (let i = 0; i < order.length; i++) {
    addQuestion(order[i], i + 1);
}


function clickQuestion(q, box, head) {
    if (answered === questions.length) {
        showRight(q, box);
        return;
    }
    if (current !== null || q.done) return;
    current = q;

    let list = [];
    for (let i = 0; i < q.answers.length; i++) {
        list.push({ text: q.answers[i], ok: q.corrAnsw.includes(i) });
    }
    list = shuffle(list);

    let row = document.createElement('div');
    row.className = 'answers';
    for (let i = 0; i < list.length; i++) {
        row.appendChild(makeAnswer(q, list[i], row, head));
    }
    box.appendChild(row);
}

function makeAnswer(q, a, row, head) {
    let el = document.createElement('div');
    el.className = 'answer';
    el.innerHTML = a.text + '<div class="explain">' + q.explanation + '</div>';
    el.addEventListener('click', function () {
        pick(q, a, el, row, head);
    });
    return el;
}


function pick(q, a, el, row, head) {
    if (q.done) return;
    q.done = true;

    let mark = document.createElement('div');
    mark.className = a.ok ? 'mark yes' : 'mark no';
    mark.innerHTML = a.ok ? '&#10004;' : '&#10008;';
    head.appendChild(mark);

    if (a.ok) {
        el.className = 'answer correct';
        score++;
    }
    else {
        el.className = 'answer wrong';
    }

    setTimeout(function () {
        moveAway(a.ok, row);
    }, 2000);
}

function moveAway(ok, row) {
    let blocks = row.children;
    let n = 0;

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].className.indexOf('correct') !== -1) continue;
        blocks[i].className += ' away';
        blocks[i].style.transitionDelay = (n * 0.3) + 's';
        n++;
    }

    let wait = n * 300 + 1000;

    if (ok) {
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].className.indexOf('correct') !== -1) {
                blocks[i].className += ' vanish';
                blocks[i].style.transitionDelay = (wait / 1000) + 's';
            }
        }
        wait += 800;
    }

    setTimeout(function () {
        row.parentNode.removeChild(row);
        current = null;
        answered++;
        if (answered === questions.length) finish();
    }, wait);
}

function finish() {
    let f = document.createElement('div');
    f.className = 'finish';
    f.innerHTML = '<p>Вопросы закончились</p>' +
                  '<p>Правильных ответов: ' + score + ' из ' + questions.length + '</p>';
    test.insertBefore(f, area);
}


function showRight(q, box) {
    let same = (shown !== null && shown.parentNode === box);
    if (shown !== null) {
        shown.parentNode.removeChild(shown);
        shown = null;
    }
    if (same) return;

    let texts = [];
    for (let i = 0; i < q.corrAnsw.length; i++) {
        texts.push(q.answers[q.corrAnsw[i]]);
    }

    let b = document.createElement('div');
    b.className = 'answer correct reveal';
    b.innerHTML = '<b>' + texts.join('<br>') + '</b><div class="explain">' + q.explanation + '</div>';
    box.appendChild(b);
    shown = b;
}