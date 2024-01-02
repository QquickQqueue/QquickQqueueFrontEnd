window.onload = function () {
    fetch("http://localhost:8080/api/musicals")
        .then(Response => {
            return Response.json();
        })
        .then(Data => {
            const musicals = Data.data.content;
            const musicalListContainer = document.getElementById("musicalList");
            let rowDiv = document.createElement("div");
            rowDiv.className = "row row-cols-1 row-cols-md-4 g-4";

            musicals.forEach((musical, index) => {
                const cardDiv = document.createElement("div");
                cardDiv.className = "col";
                cardDiv.innerHTML = `
                    <button type="button" class="card" onclick="redirectToDetailPage(${musical.id})">
                        <img src= "${musical.thumbnailUrl}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${musical.title}</h5>
                            <p class="card-startDate">${musical.startDate} ~ ${musical.endDate}</p>
                            <p class="card-rating">${musical.rating}</p>
                        </div>
                    </button>
                `

                rowDiv.appendChild(cardDiv);

                if ((index + 1) % 4 === 0) {
                    musicalListContainer.appendChild(rowDiv);
                    rowDiv = document.createElement("div");
                    rowDiv.className = "row row-cols-1 row-cols-md-4 g-4";
                }
            });
            musicalListContainer.appendChild(rowDiv);
        })
}

function redirectToDetailPage(musicalId) {
   window.location.href = `detailPage.html?musicalId=${musicalId}`;
}
