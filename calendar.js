function getRoundInfo(scheduleId) {
 
     fetch("http://localhost:8080/api/musicals/round/" + scheduleId)
         .then(Response => {
             return Response.json();
         })
         .then(Data => {
             const info = Data.data;
             
             document.querySelector('.cal-info').innerHTML = `
             <div>
                <p>남은 좌석</p>
                <p>VIP : ${info.sumVIP}, R : ${info.sumR}, S : ${info.sumS}, A : ${info.sumA}, B : ${info.sumB}, C : ${info.sumC}</p>
                <p>배우 : ${info.actors}</p>
            </div>`
         })
 }