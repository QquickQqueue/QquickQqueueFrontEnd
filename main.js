let currentPage = 0;
let currentSearchPage = 0;
let isSearching = false;
let searchTerm = '';

window.onload = function () {
   fetchMusicals();

   const isLoggedIn = checkIfUserIsLoggedIn();

   const loginSignupDiv = document.querySelector(".member");

   const myPageP = document.createElement("p");
   myPageP.textContent = "마이페이지";

   const logoutP = document.createElement("p");
   logoutP.textContent = "로그아웃";
   
   console.log(isLoggedIn);

   if (isLoggedIn) {
      loginSignupDiv.innerHTML = "";
      loginSignupDiv.appendChild(myPageP);
      loginSignupDiv.appendChild(logoutP);

      myPageP.addEventListener("click", function () {
         window.location.href = "myPage.html";
      });
   } else {
      const loginP = createAndSetupLinkP("로그인", "login.html");
      const signupP = createAndSetupLinkP("회원가입", "signup.html");

      loginSignupDiv.innerHTML = "";
      loginSignupDiv.appendChild(loginP);
      loginSignupDiv.appendChild(signupP);
   }

   const searchInput = document.getElementById("searchInput");

   searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
         event.preventDefault();
         performSearch();
      }
   });
}

function fetchMusicals(pageNumber) {
   const apiUrl = isSearching ? `/search?title=${searchTerm}&page=${pageNumber}` : `?page=${pageNumber}`;
   fetch(`http://localhost:8080/api/musicals${apiUrl}`)
      .then(Response => Response.json())
      .then(Data => {
         displayMusicals(Data.data.content);
         updatePaginationButtons(Data.data);
      });
}

function createAndSetupLinkP(text, href) {
   const p = document.createElement("p");
   p.textContent = text;
   p.addEventListener("click", function () {
      window.location.href = href;
   });

   return p;
}

function displayMusicals(musicals) {
   const musicalListContainer = document.getElementById("musicalList");
   musicalListContainer.innerHTML = '';

   if (musicals.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "해당 뮤지컬이 존재하지 않습니다.";
      musicalListContainer.appendChild(noResultsMessage);
      return;
   }

   let rowDiv = document.createElement("div");
   rowDiv.className = "row row-cols-1 row-cols-md-4 g-4";

   musicals.forEach((musical, index) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "col";
      cardDiv.innerHTML = `
         <button type="button" class="card" onclick="redirectToDetailPage(${musical.id})">
            <img src="${musical.thumbnailUrl}" class="card-img-top" alt="...">
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
}

function performSearch() {
   const searchInput = document.getElementById("searchInput");
   searchTerm = searchInput.value.toLowerCase();

   if (searchTerm === "") {
      alert("뮤지컬 이름을 입력해주세요.");
      return;
   }

   isSearching = true;
   currentSearchPage = 0;
   fetchMusicals(currentSearchPage);
}

function redirectToDetailPage(musicalId) {
   window.location.href = `detailPage.html?musicalId=${musicalId}`;
}

function checkIfUserIsLoggedIn() {
   const accessToken = getAccessTokenFromCookie();
   if (accessToken !== null) {
      return true;
   } else {
      return false;
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

function updatePaginationButtons(data) {
   const nextPageButton = document.getElementById("nextPageButton");
   const prevPageButton = document.getElementById("prevPageButton");

   nextPageButton.disabled = data.last;
   prevPageButton.disabled = data.first;
}

function changePage(pageDifference) {
   currentPage += pageDifference;
   fetchMusicals(currentPage);
}

function updateSearchPage(pageDifference) {
   currentSearchPage += pageDifference;
   fetchMusicals(currentSearchPage);
}
