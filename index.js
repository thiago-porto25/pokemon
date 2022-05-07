const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const img = new Image();
img.src = './img/pokemon_map.png';

img.onload = () => ctx.drawImage(img, 150, 130);
