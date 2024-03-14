let currentPage = 0;

window.onload = function () {
    fetchMypageInfo();
    fetchMyTicketsInfo();
}

function fetchMypageInfo() {
    fetch('https://qquickqqueue.store/api/members', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "ACCESS-TOKEN": getAccessTokenFromCookie()
        }
    })
        .then(Response => Response.json())
        .then(Data => {
            const { email, name, gender, birth, phoneNumber, createAt } = Data.data;
            displayMypageInfo(email, name, gender, birth, phoneNumber, createAt);
        })
        .catch(error => {
            console.error('마이페이지 정보를 가져오는 중 에러 발생 :', error);
        });
}

function fetchMyTicketsInfo(pageNumber) {
    fetch(`https://qquickqqueue.store/api/tickets?page=${pageNumber}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "ACCESS-TOKEN": getAccessTokenFromCookie()
        }
    })
        .then(response => response.json())
        .then(data => {
            const tickets = data.data.content;

            const ticketListElement = document.getElementById('ticketList');

            ticketListElement.innerHTML = '';

            tickets.forEach(ticket => {
                let ticketStatus = '';

                const ticketInfo = `
                 <div>
                     <div>ticketId : ${ticket.ticketId}</div>
                     <div>musicalTitle : ${ticket.musicalTitle}</div>
                     <div>scheduleId : ${ticket.scheduleId}</div>
                     <div>stadiumName : ${ticket.stadiumName}</div>
                     <div>seatGrade : ${ticket.seatGrade}</div>
                     <div>rowNum : ${ticket.rowNum}</div>
                     <div>columnNum : ${ticket.columnNum}</div>
                     <div>status : ${ticket.status}</div>
               `

                if (ticket.status) {
                    ticketStatus += `<button onclick="cancelTicket(${ticket.ticketId})">예매 취소</button>`;
                }

                ticketListElement.innerHTML += ticketInfo + ticketStatus + `</div>`;
            });
            updatePaginationButtons(Data.data);
        })
        .catch(error => console.error("Error fetching tickets:", error));
}

function cancelTicket(ticketId) {
    fetch('https://qquickqqueue.store/api/tickets/cancel/' + ticketId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ACCESS-TOKEN": getAccessTokenFromCookie()
        }
    })
        .then(response => response.json())
        .then(data => {
            location.reload();
        })
        .catch(error => console.error("Error fetching tickets:", error));
}

function displayMypageInfo(email, name, gender, birth, phoneNumber, createAt) {
    document.getElementById('email').textContent = `이메일: ${email}`;
    document.getElementById('name').textContent = `이름: ${name}`;
    document.getElementById('gender').textContent = `성별: ${gender}`;
    document.getElementById('birth').textContent = `생년월일: ${birth}`;
    document.getElementById('phoneNumber').textContent = `전화번호: ${phoneNumber}`;
    document.getElementById('createAt').textContent = `가입일: ${createAt}`;
}

function redirectToDetailPage(musicalId) {
    window.location.href = `detailPage.html?musicalId=${musicalId}`;
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

function updatePaginationButtons(data) {
    const nextPageButton = document.getElementById("nextPageButton");
    const prevPageButton = document.getElementById("prevPageButton");

    nextPageButton.disabled = data.last;
    prevPageButton.disabled = data.first;
}

function changePage(pageDifference) {
    currentPage += pageDifference;
    fetchMyTicketsInfo(currentPage);
}

function updateSearchPage(pageDifference) {
    currentSearchPage += pageDifference;
    fetchMyTicketsInfo(currentSearchPage);
}