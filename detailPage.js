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
               <img src= "${musical.thumbnailUrl}" class="card-img-top" alt="...">
               <p>뮤지컬 이름 : ${musical.title}</p>
               <p>뮤지컬 장소 : ${musical.stadiumName}</p>
               <p>뮤지컬 공연시간 : ${musical.runningTime}</p>
               <p>뮤지컬 등급 : ${musical.rating}</p>
               <p>뮤지컬 상영기간 : ${musical.startDate} ~ ${musical.endDate}</p>
            </div>
       `
        })
}