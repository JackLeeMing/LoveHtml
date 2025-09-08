// 假设的别名和常量定义
window.onload = function () {
  const b = document.body;
  const c = document.getElementsByTagName("canvas")[0];
  const a = c.getContext("2d");
  document.body.clientWidth;
  const m = Math;
  const C = Math.cos;
  const S = Math.sin;
  const P = Math.pow;
  const R = Math.random;
  const f = 600;
  c.width = 600;
  c.height = 600;

  h = -250;

  /**
   * 这是一个复杂的3D点计算函数，根据输入参数 c 的不同，返回不同形状的3D坐标和颜色值。
   *
   * @param {number} a 输入参数1，通常为 [0, 1] 范围内的随机数或迭代值
   * @param {number} b 输入参数2，通常为 [0, 1] 范围内的随机数或迭代值
   * @param {number} c 控制形状的参数，决定进入哪个计算分支
   * @returns {[number, number, number, number, number]} 包含 [x, y, z, color1, color2] 的数组
   */
  function p(a, b, c) {
    // 形状1: 螺旋星云或类似效果
    if (c > 60) {
      const spiralRadius = 13 + 5 / (0.2 + P(b * 4, 4));
      return [
        S(a * 7) * spiralRadius - S(b) * 50, // x
        b * f + 50, // y
        625 + C(a * 7) * spiralRadius + b * 400, // z
        a - b / 2, // color1
        a, // color2
      ];
    }

    // 映射 a 和 b 到 [-1, 1] 的坐标空间
    const A = a * 2 - 1;
    const B = b * 2 - 1;

    // 如果点在单位圆内，则继续计算
    if (A * A + B * B < 1) {
      // 形状2: 复杂的星状或分形
      if (c > 37) {
        const isOdd = c & 1;
        const n = isOdd ? 6 : 4;
        const o = 0.5 / (a + 0.01) + C(b * 125) * 3 - a * 300;
        const w = b * h;
        const xRotated = o * C(n) + w * S(n);
        const yRotated = o * S(n) - w * C(n);
        return [
          xRotated + isOdd * 610 - 390, // x
          yRotated + 550 - isOdd * 350, // y
          1180 + C(B + A) * 99 - isOdd * 300, // z
          0.4 -
            a * 0.1 +
            P(1 - B * B, -h * 6) * 0.15 -
            a * b * 0.4 +
            C(a + b) / 5 +
            P(C((o * (a + 1) + (B > 0 ? w : -w)) / 25), 30) * 0.1 * (1 - B * B), // color1
          o / 1e3 + 0.7 - o * w * 3e-6, // color2
        ];
      }

      // 形状3: 螺旋或波浪效果
      if (c > 32) {
        const angle = c * 1.16 - 0.15;
        const o = a * 45 - 20;
        const w = b * b * h;
        const z = o * S(angle) + w * C(angle) + 620;
        return [
          o * C(angle) - w * S(angle), // x
          28 + C(B * 0.5) * 99 - b * b * b * 60 - z / 2 - h, // y
          z, // z
          (b * b * 0.3 + P(1 - A * A, 7) * 0.15 + 0.3) * b, // color1
          b * 0.7, // color2
        ];
      }

      // 形状4: 默认或基础形状
      const o = A * (2 - b) * (80 - c * 2);
      const w =
        99 - C(A) * 120 - C(b) * (-h - c * 4.9) + C(P(1 - b, 7)) * 50 + c * 2;
      const z = o * S(c) + w * C(c) + 700;
      return [
        o * C(c) - w * S(c), // x
        B * 99 - C(P(b, 7)) * 50 - c / 3 - z / 1.35 + 450, // y
        z, // z
        (1 - b / 1.2) * 0.9 + a * 0.1, // color1
        P(1 - b, 20) / 4 + 0.05, // color2
      ];
    }
  }
  //
  function runLoop() {
    for (i = 0; i < 1e4; i++) {
      let s = p(R(), R(), (i % 46) / 0.74);
      if (s) {
        z = s[2];
        x = ~~((s[0] * f) / z - h);
        y = ~~((s[1] * f) / z - h);
        if (!m[(q = y * f + x)] | (m[q] > z)) {
          m[q] = z;
          a.fillStyle =
            "rgb(" +
            ~(s[3] * h) +
            "," +
            ~(s[4] * h) +
            "," +
            ~(s[3] * s[3] * -80) +
            ")";
          a.fillRect(x, y, 1, 1);
        }
      }
    }
    requestAnimationFrame(runLoop);
  }
  runLoop();
  // setInterval(runLoop, 0);
};
