class App {
  constructor() {
    // 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048
    //  숫자 객체 색 ,폰트 색
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

    //게임 4 x 4 판 
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

    // keydown이벤트 key
    this.keys = {
      down: "ArrowDown",
      up: "ArrowUp",
      left: 'ArrowLeft',
      right: 'ArrowRight'
    }

    //게임 시작 div
    this.$root = document.querySelector('#root');
    //게임 점수 div
    this.$score = document.querySelector('.score');
    //게임 보드 높이
    this.H = 600;
    //게임 보드 너비
    this.W = 600;
    //게임 초기화
    this.init();
  }

  // init : function(){} es5
  // 이거랑 동일하다.
  init() {
    this.$root.style.height = `${this.H}px`;
    this.$root.style.width = `${this.W}px`;
    this.cell_w = (this.W / this.array.length) - 10;
    this.cell_h = (this.H / this.array.length) - 10;
    this.eventHandler();
    this.draw();
  }

  //이벤트 등록
  eventHandler() {
    window.addEventListener('keydown', this.keyEvent);
  }
  // keyEvent(e){} 이렇게 쓸꺼면 bind를 해줘야한다.
  // window.addEventListener('keydown', this.keyEvent.bind(this));
  // bind를 안해준다면 this는 window를 바라보게된다.
  keyEvent = (e) => {
    switch (e.key) {
      case this.keys.down:
        this.downMove();
        break;
      case this.keys.up:
        this.upMove();
        break;
      case this.keys.left:
        this.leftMove();
        break;
      case this.keys.right:
        this.rightMove();
        break;
    }
  }

  // 왼쪽키 눌렀을때 
  leftMove() {
    this.calculation(this.removeZero(this.array, true));
    this.draw();
  }

  // 위쪽키 눌렀을때 
  upMove() {
    let rotate = this.makeArray();
    this.rotate(rotate, this.array);
    this.calculation(this.removeZero(rotate, true));
    this.array = this.rotate(this.makeArray(), rotate);
    this.draw();
  }

  // 오른쪽키 눌렀을때
  rightMove() {
    this.removeZero(this.array, false).forEach(rows => rows.reverse());
    this.calculation(this.array).forEach(rows => rows.reverse());
    this.draw();
  }

  // 다운키 눌렀을때
  downMove() {
    let rotate = this.makeArray();
    this.rotate(rotate, this.array);
    this.removeZero(rotate, false).forEach(rows => rows.reverse());
    this.calculation(rotate).forEach(rows => rows.reverse());
    this.array = this.rotate(this.makeArray(), rotate);
    this.draw();
  }

  // 값을 계산 하는 로직
  // rows에 0번째 요소는 앞에 값이없어서 검사를 안한다(바로 return)
  // 앞에 요소와 현재 요소가 같다면 합친 후 현재 요소 0으로 변경 
  // 블록이 합쳐졌다면 점수 계산
  // 앞에 요소가 0이라면 현재 요소로 변경 후 현재 요소 0으로 변경
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

  // [2,0,4,0] ==> [2,4] ==> [2,4,0,0]
  // 0이 아닌 요소 검색 후 나머지 자리 0 요소로 채워넣음 
  removeZero(array, value) {
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

  // 배열 360 회전 로직
  rotate(target, source) {
    source.forEach((rows, y) => {
      rows.forEach((values, x) => {
        target[x][y] = values;
      });
    });
    return target;
  }

  // 4 x 4 배열에 0값이 있는지 검색
  validation() {
    let isfalse = false;
    this.array.forEach((rows) => {
      rows.forEach((values) => {
        if (values === 0) isfalse = true;
      })
    });
    return isfalse;
  }

  // 4 x 4 배열 생성
  makeArray() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  // 게임 승리,패배 후 이벤트 제거
  removeEvent() {
    window.removeEventListener('keydown', this.keyEvent);
  }

  // 4x4 배열에 랜덤으로  0 요소 찾아서 2로 변경
  // key 이벤트 발생하면 실행 
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

  // 4x4 배열에 그리는 로직
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

  // 그리기 전에 root div html 지우기
  clear() {
    this.$root.innerHTML = "";
  }

  // 승리조건인지 확인
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

  // 로우 방향 검색 후 
  // 컬럼 방향으로 검색 
  gameOver() {
    if (!this.validation()) {
      let obj = { gameOver: true };
      // 1. 로우 방향
      this.gameOverValidation(this.array, obj);
      // 2. 컬럼 방향
      // 360 회전 후 검사
      let rotate = this.rotate(this.makeArray(), this.array);
      this.gameOverValidation(rotate, obj);
      if (obj.gameOver) this.setMesaage("GAMVEOVER");
    }
  }

  //패배 조건인지 확인
  gameOverValidation(array, obj) {
    array.forEach((rows, y) => {
      rows.forEach((values, x) => {
        if (x - 1 < 0) return;
        console.log(rows[x - 1], values);
        if (rows[x - 1] === values) { obj.gameOver = false }
      });
    });
  }

  // 패배했다면 메세지 div 출력
  setMesaage(text) {
    const $div = document.createElement("div");
    $div.id = "mesaage";
    $div.textContent = text;
    this.$root.appendChild($div);
    window.removeEventListener('keydown', this.keyEvent);
  }
}

//시작
new App();

