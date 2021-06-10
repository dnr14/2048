class App {
  constructor() {
    // 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048
    this.numbers = {
      0: { color: "rgb(93, 168, 74)" },
      2: { color: "red" },
      4: { color: "blue" },
      8: { color: "yello" },
      16: { color: "royalblue" },
      32: { color: "orange" },
      64: { color: "purple" },
      128: { color: "green" },
      256: { color: "gray" },
      512: { color: "rgb(93, 0, 0)" },
      1024: { color: "rgb(93, 168, 0)" },
      2048: { color: "rgb(93, 168, 214)" },
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
    this.draw();
    this.eventHandler();
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
        $div.style.backgroundColor = this.numbers[`${values}`].color;
        $div.textContent = values;
        $div.classList.add("inner");
        this.$root.appendChild($div);
      });
    });
    this.rule();
  }

  clear() {
    this.$root.innerHTML = "";
  }

  rule() {
    if (!this.validation()) {
      let gameOver = true;
      this.array.forEach((rows, y) => {
        rows.forEach((values, x) => {
          if (x - 1 < 0) return;
          console.log(rows[x - 1], values);
          if (rows[x - 1] === values) { gameOver = false }
        });
      });

      let rotate = this.rotate(this.makeArray(), this.array);

      rotate.forEach((rows, y) => {
        rows.forEach((values, x) => {
          if (x - 1 < 0) return;
          console.log(rows[x - 1], values);
          if (rows[x - 1] === values) { gameOver = false }
        });
      });

      if(gameOver) alert("GAME OVER");
    }
  }

}

new App();
