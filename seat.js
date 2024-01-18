let seatInfo;

window.onload = function () {
    const scheduleId = new URLSearchParams(window.location.search).get('scheduleId');

    fetch("http://localhost:8080/api/musicals/seat/" + scheduleId, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "ACCESS-TOKEN": getAccessTokenFromCookie()
        }
    })
        .then(Response => {
            return Response.json();
        })
        .then(Data => {
            const seatList = Data.data;
            let text = '';
            seatList.forEach(seat => {
                if (seat.columnNum === 1) {
                    text += '<br>';
                }
                const button = `<button id="seat${seat.id}" class="${seat.grade}" ${seat.reserved ? 'disabled' : ''} onclick="showSeatInfo(${seat.id}, ${seat.rowNum}, ${seat.columnNum}, '${seat.grade}', ${seat.price}, ${seat.reserved})"></button>`;
                text += button + ' ';
            });
            document.getElementById("seatList").innerHTML = text;
        })
}

function showSeatInfo(id, rowNum, columnNum, grade, price, reserved) {
    var result = confirm(`좌석 번호: ${id}, 행: ${rowNum}, 열: ${columnNum}, 등급: ${grade}, 가격: ${price}, 예약여부: ${reserved ? '예약됨' : '예약 가능'}` + "\n" + "결제 하시겠습니까?");
    if (result === true) {
        seatInfo = [id, rowNum, columnNum, grade, price];
        window.location.href = "payment.html?schedule-seat-id=" + id;
    }
}

function getAccessTokenFromCookie() {
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'access_token') {
            return value;
        }
    }
    return null;
}
