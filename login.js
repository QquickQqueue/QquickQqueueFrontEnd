document.addEventListener("DOMContentLoaded", function () {
   const loginForm = document.querySelector("form");

   loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.querySelector(".emailInput").value;
      const password = document.querySelector(".passwordInput").value;

      const loginData = {
         email: email,
         password: password
      };

      fetch("http://localhost:8080/api/login", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(loginData)
      })
         .then(response => {
            if (response.ok) {
               const accessToken = response.headers.get("Access-Token");
               const refreshToken = response.headers.get("Refresh-Token");
               const accessTokenTime = response.headers.get("Date");
               const refreshTokenTime = response.headers.get("Date");

               setCookie("access_token", accessToken, accessTokenTime);
               setCookie("refresh_token", refreshToken, refreshTokenTime);

               return response.json();
            } else {
               return response.json().then(errorData => {
                  alert(errorData.message);
                  throw new Error(errorData.message);
               });
            }
         })
         .then(data => {
            alert(data.message);
            window.location.href = "main.html";
         })
   });
});

function setCookie(name, value, expiresInSeconds) {
   const expires = new Date();
   expires.setTime(expires.getTime() + expiresInSeconds * 1000);
   document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}
