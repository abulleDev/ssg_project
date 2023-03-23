const ssamgoo = document.getElementById("ssamgoo_img")



// 이미지 요소 설정
ssamgoo.style.position = "fixed";
ssamgoo.style.top = "0px";
ssamgoo.style.left = "0px";
ssamgoo.style.width = "180px";
ssamgoo.style.height = "180px";


// 이미지가 움직이는 방향을 결정하는 변수
let dx = 1;
let dy = 1;

// 이미지를 움직이는 함수
function moveImage() {
  let x = parseInt(ssamgoo.style.left);
  let y = parseInt(ssamgoo.style.top);
  x += dx;
  y += dy;

  // 이미지가 화면 모서리에 닿으면 튕겨나오도록 함
  if (x + ssamgoo.width >= window.innerWidth || x <= 0) {
    dx = -dx;
    x += 2 * dx;
  }
  if (y + ssamgoo.height >= window.innerHeight || y <= 0) {
    dy = -dy;
    y += 2 * dy;
  }

  ssamgoo.style.top = y + "px";
  ssamgoo.style.left = x + "px";
}

// 일정 간격으로 이미지 위치 변경
setInterval(moveImage, 10);


// 화면 클릭 시 스크린세이버 종료
// document.addEventListener("click", function() {
//     ssamgoo.remove();
// });