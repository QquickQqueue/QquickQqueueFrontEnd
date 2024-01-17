IMP.init('imp73337601');

let orderNumber = 1;
let currentDate = new Date().getDate();

const scheduleSeatId = new URLSearchParams(window.location.search).get('schedule-seat-id');
let musicalName;
let musicalPrice;

window.onload = function () {
    fetch("http://localhost:8080/api/schedule-seat/" + scheduleSeatId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "ACCESS-TOKEN": getAccessTokenFromCookie()
        }
    }).then(Response => {
        return Response.json();
    })
        .then(Data => {
            const data = Data.data;
            musicalName = data.name;
            musicalPrice = data.price;
        })
}

function requestPay() {
    const tokenInfo = parseJwt(getAccessTokenFromCookie());

    let merchant_uid = generateMerchantUID();

    IMP.request_pay({
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: merchant_uid,   // 주문번호
        name: musicalName,
        amount: 100,                         // 숫자 타입
        buyer_email: tokenInfo.email,
        buyer_name: tokenInfo.name,
        buyer_tel: tokenInfo.phoneNumber,
        buyer_addr: $("#address").val() + " " + $("#detailAddress").val(),
        buyer_postcode: $("#postcode").val()
    }, function (rsp) {
        requestCreateTicket()
    });
}

function requestCreateTicket() {
    const requestScheduleSeatId = {
        scheduleSeatId: scheduleSeatId
    }

    fetch("http://localhost:8080/api/tickets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ACCESS-TOKEN": getAccessTokenFromCookie()
        },
        body: JSON.stringify(requestScheduleSeatId)
    }).then(Response => {
        return Response.json();
    })
        .then(Data => {
            if (Data.success) {
                var msg = '결제가 완료되었습니다.';
                alert(msg);
                window.close();
                location.href = "mypage.html";
            } else {
                var msg = '결제에 실패하였습니다.';
                msg += '에러내용 : ' + rsp.error_msg;
                alert(msg);
            }
        })
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function generateMerchantUID() {
    const formattedTimestamp = getFormattedTimestamp();
    const paddedOrderNumber = orderNumber.toString().padStart(6, '0');
    const merchantUID = currentDate + formattedTimestamp + paddedOrderNumber;

    const newDate = new Date().getDate();
    if (newDate !== currentDate) {
        currentDate = newDate;
        orderNumber = 1;
    } else {
        orderNumber++;
    }

    return merchantUID;
}

function getFormattedTimestamp() {
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');

    return hours + minutes + seconds;
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

function postcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            var addr = '';
            var extraAddr = '';

            if (data.userSelectedType === 'R') {
                addr = data.roadAddress;
            } else {
                addr = data.jibunAddress;
            }

            if (data.userSelectedType === 'R') {
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                document.getElementById("extraAddress").value = extraAddr;

            } else {
                document.getElementById("extraAddress").value = '';
            }

            document.getElementById('postcode').value = data.zonecode;
            document.getElementById("address").value = addr;

            document.getElementById("detailAddress").focus();
        }
    }).open();
}