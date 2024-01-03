
let startDate, endDate, scheduleList;

window.onload = function () {
    const musicalId = new URLSearchParams(window.location.search).get('musicalId');

    fetch("http://localhost:8080/api/musicals/" + musicalId)
        .then(Response => {
            return Response.json();
        })
        .then(Data => {
            const musical = Data.data;

            document.getElementById('musical').innerHTML = `
            <div id="musicalInfo">
               <img src="${musical.thumbnailUrl}" class="img-fluid" alt="...">
               <p>뮤지컬 이름 : ${musical.title}</p>
               <p>뮤지컬 장소 : ${musical.stadiumName}</p>
               <p>뮤지컬 공연시간 : ${musical.runningTime}</p>
               <p>뮤지컬 등급 : ${musical.rating}</p>
               <p>뮤지컬 상영기간 : ${musical.startDate} ~ ${musical.endDate}</p>
            </div>`

            startDate = musical.startDate;
            endDate = musical.endDate;
            scheduleList = musical.scheduleList
            loadYYMM(init.today, scheduleList);

        })
}

const init = {
    monList: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    today: new Date(),
    monForChange: new Date().getMonth(),
    activeDate: new Date(),
    getFirstDay: (yy, mm) => new Date(yy, mm, 1),
    getLastDay: (yy, mm) => new Date(yy, mm + 1, 0),
    nextMonth: function () {
        let d = new Date();
        d.setDate(1);
        d.setMonth(++this.monForChange);
        this.activeDate = d;
        return d;
    },
    prevMonth: function () {
        let d = new Date();
        d.setDate(1);
        d.setMonth(--this.monForChange);
        this.activeDate = d;
        return d;
    },
    addZero: (num) => (num < 10) ? '0' + num : num,
    activeDTag: null,
    getIndex: function (node) {
        let index = 0;
        while (node = node.previousElementSibling) {
            index++;
        }
        return index;
    }
};

/**
* @param {String} date
* @param {String} start
* @param {String} end
*/
function checkDate(date, start, end) {
    return !(date >= start && date <= end);
}

const $calBody = document.querySelector('.cal-body');
const $btnNext = document.querySelector('.btn-cal.next');
const $btnPrev = document.querySelector('.btn-cal.prev');

/**
 * @param {date} fullDate
 * @param {List} scheduleList
 */
function loadYYMM(fullDate, scheduleList) {
    let yy = fullDate.getFullYear();
    let mm = fullDate.getMonth();
    let firstDay = init.getFirstDay(yy, mm);
    let lastDay = init.getLastDay(yy, mm);
    let markToday;

    if (mm === init.today.getMonth() && yy === init.today.getFullYear()) {
        markToday = init.today.getDate();
    }

    document.querySelector('.cal-year').textContent = yy + '년';
    document.querySelector('.cal-month').textContent = init.monList[mm];


    let trtd = '';
    let startCount;
    let countDay = 0;
    for (let i = 0; i < 6; i++) {
        trtd += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && !startCount && j === firstDay.getDay()) {
                startCount = 1;
            }
            if (!startCount) {
                trtd += '<td>'
            } else {
                let fullDate = yy + '-' + init.addZero(mm + 1) + '-' + init.addZero(countDay + 1);

                let schedule = scheduleList.find(sch => sch.startTime.split("T")[0] === fullDate);
                trtd += '<td';
                if (schedule) {
                    trtd += ' onclick="getRoundInfo(' + schedule.id + ')"';
                }

                if (checkDate(fullDate, startDate, endDate)) trtd += ' class="disabled';
                else trtd += ' class="day';

                trtd += (markToday && markToday === countDay + 1) ? ' today" ' : '"';
                trtd += ` data-date="${countDay + 1}" data-fdate="${fullDate}">`;
            }
            trtd += (startCount) ? ++countDay : '';
            if (countDay === lastDay.getDate()) {
                startCount = 0;
            }
            trtd += '</td>';
        }
        trtd += '</tr>';
    }
    $calBody.innerHTML = trtd;
}

/**
 * @param {string} val
 */
function createNewList(val) {
    let id = new Date().getTime() + '';
    let yy = init.activeDate.getFullYear();
    let mm = init.activeDate.getMonth() + 1;
    let dd = init.activeDate.getDate();
    const $target = $calBody.querySelector(`.day[data-date="${dd}"]`);

    let date = yy + '.' + init.addZero(mm) + '.' + init.addZero(dd);

    let eventData = {};
    eventData['date'] = date;
    eventData['memo'] = val;
    eventData['complete'] = false;
    eventData['id'] = id;
    init.event.push(eventData);
    $todoList.appendChild(createLi(id, val, date));
}



$btnNext.addEventListener('click', () => loadYYMM(init.nextMonth(), scheduleList));
$btnPrev.addEventListener('click', () => loadYYMM(init.prevMonth(), scheduleList));
