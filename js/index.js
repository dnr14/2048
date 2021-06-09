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
      64: { color: "puple" },
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
      [0, 0, 0, 0],
    ];

    this.prevArray;

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
    this.setRandom();
    this.draw();
    this.eventHandler();

    let array = [];

    this.array.forEach(rows => {
      array.push([...rows]);
    });

    this.prevArray = array;
  }

  eventHandler() {
    window.addEventListener('keydown', this.keyEvent);
  }
  // keyEvent(e){} 이렇게 쓸꺼면 bind를 해줘야한다.
  // window.addEventListener('keydown', this.keyEvent.bind(this));
  keyEvent = (e) => {
    switch (e.keyCode) {
      case this.keyNumbers.down:
        console.log("down");
        break;
      case this.keyNumbers.up:
        console.log("up");
        break;
      case this.keyNumbers.left:

        this.array.forEach((rows, y) => {
          // [2,0,4,0]
          // [2,4] ==> [2,4,0,0]
          // let array = rows.filter(x => x !== 0).concat(rows.filter(x => x === 0))
          this.array[y] = [...rows.filter(x => x !== 0), ...rows.filter(x => x === 0)];
        });


        this.array.forEach((rows, y) => {
          rows.forEach((values, x) => {
            if (x === 0) return;
            if (rows[x - 1] === rows[x]) {
              rows[x - 1] += rows[x];
              rows[x] = 0;
            }
          });
        });

        this.draw();
        break;
      case this.keyNumbers.right:
        console.log(1);
        this.array.forEach((rows, y) => {
          // [2,0,4,0]
          // [2,4] ==> [2,4,0,0]
          // let array = rows.filter(x => x !== 0).concat(rows.filter(x => x === 0))
          this.array[y] = [...rows.filter(x => x === 0), ...rows.filter(x => x !== 0)];
        });

        console.table(this.array);

        this.array.forEach((rows, y) => {
          rows.forEach((values, x) => {
            if (x === 0) return;
            if (rows[x + 1] === rows[x]) {
              rows[x + 1] += rows[x];
              rows[x] = 0;
            }
          });
        });
        this.draw();

        break;
    }
  }
  removeEvent() {
    window.removeEventListener('keydown', this.keyEvent);
  }

  setRandom() {
    while (true) {
      let randomX = Math.floor(Math.random() * 4);
      let randomY = Math.floor(Math.random() * 4);
      if (this.array[randomY][randomX] === 0) {
        this.array[randomY][randomX] = 2
        break;
      }
    }
  }


  validation() {
    let isTrue = false;
    this.array.forEach((rows) => {
      rows.forEach((values) => {
        if (values === 0) isTrue = true;
      })
    });
    return isTrue;
  }

  draw() {

    if (this.validation()) this.setRandom();

    this.clear();
    this.array.forEach((rows, y) => {
      rows.forEach((values, x) => {
        const $div = document.createElement("div");
        $div.style.width = `${this.cell_w}px`;
        $div.style.height = `${this.cell_h}px`;
        $div.style.backgroundColor = this.numbers[`${values}`].color;
        $div.textContent = values;
        $div.classList.add("inner");
        this.$root.appendChild($div);
      });
    });
    // console.table(this.array);
  }

  clear() {
    this.$root.innerHTML = "";
  }

}

new App();
