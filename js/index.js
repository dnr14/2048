class App {
  constructor() {
    // 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048
    this.numbers = {
      0: { color: "#CDC1B4", fontColor: "#776E65" },
      2: { color: "#eee4da", fontColor: "#776E65" },
      4: { color: "#eee1c9", fontColor: "#776E65" },
      8: { color: "#F3B27A", fontColor: "#FFF" },
      16: { color: "#F69664", fontColor: "#FFF" },
      32: { color: "#F77C5F", fontColor: "#FFF" },
      64: { color: "#F75F3B", fontColor: "#FFF" },
      128: { color: "#EDD073", fontColor: "#FFF" },
      256: { color: "#EDCC62", fontColor: "#FFF" },
      512: { color: "rgb(237, 200, 80)", fontColor: "#FFF" },
      1024: { color: "rgb(237, 197, 63)", fontColor: "#FFF" },
      2048: { color: "rgb(237, 194, 46)", fontColor: "#FFF" },
    }

    this.array = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    // up,down 눌럿을때 360회전 후 계산 하고 다시 360회전
    // up 은 왼쪽
    // dowun 오른쪽
    // [
    //   [0,0,0,0],
    //   [2,0,2,0],
    //   [0,0,2,0],
    //   [0,0,0,0],
    // ]

    this.keyNumbers = {
      down: 40,
      up: 38,
      left: 37,
      right: 39
    }

    this.$root = document.querySelector('#root');
    this.$score = document.querySelector('.score');
    this.H = 600;
    this.W = 600;
    this.init();
  }

  // const init = function(){}
  // 이거랑 동일하다.
  init() {
    this.$root.style.height = `${this.H}px`;
    this.$root.style.width = `${this.W}px`;
    this.cell_w = (this.W / this.array.length) - 10;
    this.cell_h = (this.H / this.array.length) - 10;
    this.eventHandler();
    this.draw();
  }

  eventHandler() {
    window.addEventListener('keydown', this.keyEvent);
  }
  // keyEvent(e){} 이렇게 쓸꺼면 bind를 해줘야한다.
  // window.addEventListener('keydown', this.keyEvent.bind(this));
  keyEvent = (e) => {
    switch (e.keyCode) {
      case this.keyNumbers.down:
        this.downMove();
        break;
      case this.keyNumbers.up:
        this.upMove();
        break;
      case this.keyNumbers.left:
        this.leftMove();
        break;
      case this.keyNumbers.right:
        this.rightMove();
        break;
    }
  }

  leftMove() {
    this.calculation(this.removeZero(this.array, true));
    this.draw();
  }

  upMove() {
    let rotate = this.makeArray();
    this.rotate(rotate, this.array);
    this.calculation(this.removeZero(rotate, true));
    this.array = this.rotate(this.makeArray(), rotate);
    this.draw();
  }

  rightMove() {
    this.removeZero(this.array, false).forEach(rows => rows.reverse());
    this.calculation(this.array).forEach(rows => rows.reverse());
    this.draw();
  }

  downMove() {
    let rotate = this.makeArray();
    this.rotate(rotate, this.array);
    this.removeZero(rotate, false).forEach(rows => rows.reverse());
    this.calculation(rotate).forEach(rows => rows.reverse());
    this.array = this.rotate(this.makeArray(), rotate);
    this.draw();
  }

  calculation(array) {
    array.forEach((rows) => {
      rows.forEach((values, x) => {
        if (x === 0) return;
        if (rows[x - 1] === rows[x]) {
          rows[x - 1] += rows[x];
          rows[x] = 0;
          let score = parseInt(this.$score.textContent);
          score += rows[x - 1];
          this.$score.textContent = score;
        } else if (rows[x - 1] === 0) {
          rows[x - 1] = rows[x];
          rows[x] = 0;
        }
      });
    });
    return array;
  }

  removeZero(array, value) {
    // [2,0,4,0] ==> [2,4] ==> [2,4,0,0]
    // let array = rows.filter(x => x !== 0).concat(rows.filter(x => x === 0))
    array.forEach((rows, y) => {
      if (value === true) {
        array[y] = [...rows.filter(x => x !== 0), ...rows.filter(x => x === 0)];
      } else if (value === false) {
        array[y] = [...rows.filter(x => x === 0), ...rows.filter(x => x !== 0)];
      }
    });
    return array;
  }

  rotate(target, source) {
    source.forEach((rows, y) => {
      rows.forEach((values, x) => {
        target[x][y] = values;
      });
    });
    return target;
  }

  validation() {
    let isfalse = false;
    this.array.forEach((rows) => {
      rows.forEach((values) => {
        if (values === 0) isfalse = true;
      })
    });
    return isfalse;
  }

  makeArray() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  removeEvent() {
    window.removeEventListener('keydown', this.keyEvent);
  }

  setRandom() {
    while (true) {
      let randomX = Math.floor(Math.random() * 4);
      let randomY = Math.floor(Math.random() * 4);
      if (this.array[randomY][randomX] === 0) {
        this.array[randomY][randomX] = 2;
        break;
      }
    }
  }

  draw() {
    if (this.validation()) this.setRandom();
    this.clear();
    this.array.forEach(rows => {
      rows.forEach(values => {
        const $div = document.createElement("div");
        $div.style.width = `${this.cell_w}px`;
        $div.style.height = `${this.cell_h}px`;
        if (values === 0) $div.style.fontSize = 0;
        $div.style.backgroundColor = this.numbers[`${values}`].color;
        $div.style.color = this.numbers[`${values}`].fontColor;
        $div.textContent = values;
        $div.classList.add("inner");
        this.$root.appendChild($div);
      });
    });
    if (this.win()) return;
    this.gameOver();
  }

  clear() {
    this.$root.innerHTML = "";
  }

  win() {
    let win = false;
    this.array.forEach(rows => {
      rows.forEach(values => {
        if (values === 2048) win = true;
      });
    })
    if (win) this.setMesaage("WIN");
    return win;
  }

  gameOver() {
    if (!this.validation()) {
      let obj = { gameOver: true };
      this.gameOverValidation(this.array, obj);
      let rotate = this.rotate(this.makeArray(), this.array);
      this.gameOverValidation(rotate, obj);
      if (obj.gameOver) this.setMesaage("GAMVEOVER");
    }
  }

  gameOverValidation(array, obj) {
    array.forEach((rows, y) => {
      rows.forEach((values, x) => {
        if (x - 1 < 0) return;
        console.log(rows[x - 1], values);
        if (rows[x - 1] === values) { obj.gameOver = false }
      });
    });
  }

  setMesaage(text) {
    const $div = document.createElement("div");
    $div.id = "mesaage";
    $div.textContent = text;
    this.$root.appendChild($div);
    window.removeEventListener('keydown', this.keyEvent);
  }
}

new App();
