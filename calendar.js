function getRoundInfo(scheduleId) {

    fetch("https://qquickqqueue.store/api/musicals/round/" + scheduleId)
        .then(Response => {
            return Response.json();
        })
        .then(Data => {
            const info = Data.data;

            let actorNames = "";
            info.actors.forEach(e => {
                actorNames += e.actorName + ", ";
            });

            actorNames = actorNames.slice(0, -2);

            document.querySelector('.cal-info').innerHTML = `
             <div>
                <p>남은 좌석</p>
                <p>VIP : ${info.sumVIP}, R : ${info.sumR}, S : ${info.sumS}, A : ${info.sumA}</p>
                <p>배우 : ${actorNames}</p>
                <button onclick="openWindow(${scheduleId})">좌석 선택</button>
            </div>`
        })
}

function openWindow(scheduleId) {
    const options = 'width=1200, height=900, top=50, left=50, scrollbars=yes'
    window.open(`seat.html?scheduleId=${scheduleId}`, '_blank', options)
}