document.addEventListener("DOMContentLoaded", function () {
   function generateOptions(selectElement, start, end) {
      for (let i = start; i <= end; i++) {
         var option = document.createElement("option");
         option.value = i;
         option.text = i;
         selectElement.appendChild(option);
      }
   }

   var birthYearSelect = document.getElementById("birthYear");
   generateOptions(birthYearSelect, 1950, 2024);

   var birthMonthSelect = document.getElementById("birthMonth");
   generateOptions(birthMonthSelect, 1, 12);

   var birthDaySelect = document.getElementById("birthDay");
   generateOptions(birthDaySelect, 1, 31);

   var signUpForm = document.querySelector("form");
   if (signUpForm) {
      signUpForm.addEventListener("submit", handleSignUp);
   }

   function handleSignUp(event) {
      event.preventDefault();

      var emailInput = document.querySelector(".emailInput");
      var passwordInput = document.querySelector(".passwordInput");
      var checkPasswordInput = document.querySelector(".checkPasswordInput");
      var nameInput = document.querySelector(".nameInput");
      var genderInput = document.querySelector(".genderInput");
      var birthYearInput = document.querySelector("#birthYear");
      var birthMonthInput = document.querySelector("#birthMonth");
      var birthDayInput = document.querySelector("#birthDay");
      var firstNumInput = document.querySelector("#firstNum");
      var middleNumInput = document.querySelector("#middleNum");
      var lastNumInput = document.querySelector("#lastNum");

      var monthValue = String(birthMonthInput.value).padStart(2, '0');
      var dayValue = String(birthDayInput.value).padStart(2, '0');

      if (passwordInput.value !== checkPasswordInput.value) {
         alert("비밀번호를 확인해주세요.");
         return;
      }

      var formData = {
         email: emailInput.value,
         password: passwordInput.value,
         name: nameInput.value,
         gender: genderInput.value,
         birth: `${birthYearInput.value}-${monthValue}-${dayValue}`,
         phoneNumber: `${firstNumInput.value}-${middleNumInput.value}-${lastNumInput.value}`,
      };

      fetch("https://qquickqqueue.store/api/signup", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(formData),
      })
         .then((response) => response.json())
         .then((data) => {
            alert(data.message);
            window.location.href = "login.html";
         });
   }
});
