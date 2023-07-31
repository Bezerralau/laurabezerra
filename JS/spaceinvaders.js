const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = './img/img-fundo.jpg';
backgroundImage.onload = function () {
  startGame();
};

const player = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 40,
  height: 20,
  speed: 5,
  moveLeft: false,
  moveRight: false,
};

const bullet = {
  x: 0,
  y: 0,
  width: 5,
  height: 10,
  speed: 8,
  active: false,
};

const enemies = [];
const enemyRows = 5;
const enemyCols = 10;
const enemyWidth = 40;
const enemyHeight = 20;
const enemySpeed = 2;
let score = 0;
let gameOver = false;
let youWin = false;

// Função para verificar se o dispositivo é móvel
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

function createEnemies() {
  for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyCols; col++) {
      const enemy = {
        x: col * (enemyWidth + 10) + 50,
        y: row * (enemyHeight + 10) + 30,
        width: enemyWidth,
        height: enemyHeight,
        speed: enemySpeed,
        direction: 1, // 1: move to the right, -1: move to the left
      };
      enemies.push(enemy);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = 'green';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw enemies
  ctx.fillStyle = 'red';
  enemies.forEach((enemy) =>
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height),
  );

  // Draw bullet if active
  if (bullet.active) {
    ctx.fillStyle = 'green';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }

  // Draw score
  ctx.fillStyle = 'White';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 10, 30);

  // Draw "Game Over" if the game is over
  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
  }

  // Draw "You Win" if all enemies are eliminated
  if (youWin) {
    ctx.fillStyle = 'green';
    ctx.font = '48px Arial';
    ctx.fillText('You Win', canvas.width / 2 - 80, canvas.height / 2);
  }
}

function update() {
  if (gameOver || youWin) return; // Stop updating if game over or you win

  // Move player
  if (player.moveLeft && player.x > 0) {
    player.x -= player.speed;
  } else if (player.moveRight && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }

  // Move bullet if active
  if (bullet.active) {
    bullet.y -= bullet.speed;
    if (bullet.y <= 0) {
      bullet.active = false;
    }
  }

  // Move enemies side to side
  let hasEnemies = false;
  enemies.forEach((enemy) => {
    hasEnemies = true;
    enemy.x += enemy.speed * enemy.direction;

    // Change direction when reaching the canvas edge
    if (enemy.x + enemy.width >= canvas.width || enemy.x <= 0) {
      enemy.direction *= -1;
      enemy.y += enemy.height; // Move enemies down
    }

    // Check if any enemy reaches the player
    if (enemy.y + enemy.height >= player.y) {
      gameOver = true;
    }
  });

  // Check if all enemies are eliminated
  if (!hasEnemies) {
    youWin = true;
  }

  // Check for bullet-enemy collisions
  if (bullet.active) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (
        bullet.x >= enemy.x &&
        bullet.x <= enemy.x + enemy.width &&
        bullet.y <= enemy.y + enemy.height
      ) {
        // Remove enemy and bullet, increase score
        enemies.splice(i, 1);
        bullet.active = false;
        score += 10;
        break;
      }
    }
  }
}

function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}

// Event listener para o botão "Jogar Space Invaders"
document.getElementById('startButton').addEventListener('click', () => {
  if (isMobileDevice()) {
    // Se for um dispositivo móvel, exibe a mensagem de aviso
    alert(
      'Desculpe, o jogo Space Invaders só pode ser jogado em computadores.',
    );
  } else {
    // Se não for um dispositivo móvel, inicia o jogo normalmente
    document.getElementById('startButton').style.display = 'none';
    createEnemies();
    gameLoop();
  }
});

// Event listeners to control player movement and shooting
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    player.moveLeft = true;
  } else if (event.key === 'ArrowRight') {
    player.moveRight = true;
  } else if (event.key === 'z') {
    // Shoot bullet when spacebar is pressed
    if (!bullet.active) {
      bullet.active = true;
      bullet.x = player.x + player.width / 2 - bullet.width / 2;
      bullet.y = player.y;
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') {
    player.moveLeft = false;
  } else if (event.key === 'ArrowRight') {
    player.moveRight = false;
  }
});
