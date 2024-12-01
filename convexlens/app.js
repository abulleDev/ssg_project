import convexLensEffect from './convexLensEffect.js';

/** @typedef {{x: number, y: number, radius: number}} lensConfigType */
/** @type {lensConfigType} */
let lensConfig = {
  x: 90,
  y: 90,
  radius: 100,
};

let imageSrc = './쌈구머리.png';

const canvas = document.getElementsByTagName('canvas')[0];

/**  @type {HTMLInputElement[]} */
const [x, y, radius] = document.querySelectorAll('label > input');

/** @param {lensConfigType} config */
function setLensConfig(config) {
  lensConfig = config;
  x.value = config.x
  y.value = config.y
  radius.value = config.radius

  const img = new Image();

  img.src = imageSrc;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    convexLensEffect(canvas, img, lensConfig);
  };
}
setLensConfig(lensConfig);

x.addEventListener('change', (e) =>
  setLensConfig({ ...lensConfig, x: +e.target.value })
);
y.addEventListener('change', (e) =>
  setLensConfig({ ...lensConfig, y: +e.target.value })
);
radius.addEventListener('change', (e) =>
  setLensConfig({ ...lensConfig, radius: +e.target.value })
);

canvas.addEventListener('click', (e) => {
  const { left, top, width, height } = canvas.getBoundingClientRect();
  const x = (e.clientX - left) * (canvas.width / width);
  const y = (e.clientY - top) * (canvas.height / height);
  setLensConfig({ x, y, radius: lensConfig.radius });
});

canvas.addEventListener('touchmove', (e) => {
  const { left, top, width, height } = canvas.getBoundingClientRect();
  const x = (e.touches[0].clientX - left) * (canvas.width / width);
  const y = (e.touches[0].clientY - top) * (canvas.height / height);
  setPosition({ x, y, radius: lensConfig.radius });
});

let fileName = 'canvas';
const fileElement = document.querySelector('input[type=file]');
fileElement.addEventListener('change', (event) => {
  const file = event.target.files[0];
  fileName = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    imageSrc = e.target.result; // Base64 이미지 데이터를 부모로 전달
    const img = new Image();

    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      convexLensEffect(canvas, img, lensConfig);
    };
  };
  reader.readAsDataURL(file);
});

document.querySelector('button').addEventListener('click', () => {
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName + '.png';
  link.click();
})