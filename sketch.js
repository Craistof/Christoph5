let bitcoinPrice = 0;
let lastUpdateTime = 0;
const updateInterval = 600000; // Actualizar cada 10 minutos (600000 ms)
let calaveraImage;

function preload() {
  // Cargar la imagen de la calavera desde un archivo local
  calaveraImage = loadImage('calavera2.png'); // Ruta de la imagen de la calavera
}

function setup() {
    textFont('Times New Roman');
  textStyle(BOLD);
  textSize(60);
  fill(0);
  // Centrar el canvas en la página
  const canvas = createCanvas(1500, 1701);
  canvas.parent(document.body);
  // Obtener el precio de Bitcoin al inicio
  getBitcoinPrice();
}

function draw() {
  background('#faf7e6'); // Fondo color #faf7e6

  // Actualizar el precio cada 10 minutos
  if (millis() - lastUpdateTime > updateInterval) {
    getBitcoinPrice();
    lastUpdateTime = millis();
  }

  // Dibujar la imagen de la calavera centrada en el canvas
  if (calaveraImage) {
    image(calaveraImage, (width - 1500) / 2, (height - 1701) / 2, 1500, 1701);
  }

  // Usar el precio para determinar algo visual, como el tamaño de un círculo
  let circleSize = map(bitcoinPrice || 20000, 20000, 150000, 50, 500);
  fill(255, 200, 0);
  ellipse(width / 2, height / 4, circleSize, circleSize); // Dibujar el círculo en el centro arriba de la imagen

  // Mostrar el precio de Bitcoin en el centro del círculo
  fill(0); // Color negro
  textAlign(CENTER, CENTER);
  text(`$ ${bitcoinPrice || 'Cargando...'}`, width / 2, height / 4);
}

function getBitcoinPrice() {
  const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
  const backupApiUrl = 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta de CoinGecko: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.bitcoin && data.bitcoin.usd) {
        bitcoinPrice = data.bitcoin.usd;
      } else {
        console.error('Error: El precio en USD no se encuentra en la respuesta. Intentando con el respaldo.');
        getBackupPrice();
      }
    })
    .catch(err => {
      console.error('Error obteniendo el precio de Bitcoin:', err);
      getBackupPrice();
    });
}

function getBackupPrice() {
  fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta de CryptoCompare: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.USD) {
        bitcoinPrice = data.USD;
      } else {
        console.error('Error: El precio en el respaldo no se encuentra en la respuesta. Utilizando el precio de respaldo guardado.');
        bitcoinPrice = 20000; // Valor por defecto si no se puede obtener el precio
      }
    })
    .catch(err => {
      console.error('Error obteniendo el precio de Bitcoin del respaldo:', err);
      bitcoinPrice = 20000; // Valor por defecto si no se puede obtener el precio
    });
}

// HTML para centrar el canvas
// <div id="canvasContainer" style="display: flex; justify-content: center; align-items: center; height: 100vh;"></div>

// Nota: Este enfoque obtiene el precio de Bitcoin de una API y lo actualiza cada 10 minutos.
// Si CoinGecko se cae, intenta obtener el precio de CryptoCompare como respaldo.
// Para llevar esto a la blockchain, puedes considerar usar oráculos de datos como Chainlink
// para obtener precios reales de manera más descentralizada.
