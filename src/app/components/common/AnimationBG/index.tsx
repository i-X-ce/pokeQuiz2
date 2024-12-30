"use client";
import { useEffect, useRef } from "react";
import styles from "./style.module.css";

// 消去時と出現時のアニメーションの定数時間
const APPEARING_TIME = 30;

const occupiedCells = new Set<string>();

export function AnimationBG() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rectanglesRef = useRef<Rectangle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    // デバイスのピクセル比を取得
    // const dpi = window.devicePixelRatio || 1;

    // キャンバスのスタイルサイズを設定
    // canvas.style.width = `${window.innerWidth}px`;
    // canvas.style.height = `${window.innerHeight}px`;

    // キャンバスの実際のサイズを設定
    canvas.width = 1920;
    canvas.height = 1080;

    // コンテキストをスケーリング
    // context.scale(dpi, dpi);

    let animationFrameId: number;

    // 色をCSSの変数から取得
    const colorRed = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--bc-red"),
      colorGreen = getComputedStyle(document.documentElement).getPropertyValue(
        "--bc-green"
      ),
      colorBlue = getComputedStyle(document.documentElement).getPropertyValue(
        "--bc-blue"
      ),
      colorYellow = getComputedStyle(document.documentElement).getPropertyValue(
        "--bc-yellow"
      );
    const colors = [colorRed, colorGreen, colorBlue, colorYellow];

    // 四角形の固定サイズを設定
    const RECTANGLE_SIZE = 100; // 任意のピクセル値
    Rectangle.dw = RECTANGLE_SIZE;
    Rectangle.dh = RECTANGLE_SIZE;

    const render = () => {
      if (!context) return;

      // キャンバスをクリア
      context.clearRect(0, 0, canvas.width, canvas.height);

      const deadList: number[] = [];

      // 四角形の描画処理
      rectanglesRef.current.forEach((rectangle, index) => {
        rectangle.draw();
        if (rectangle.isDead()) deadList.push(index);
      });

      // 死んだ四角形を削除
      deadList.reverse().forEach((index) => {
        const rectangle = rectanglesRef.current[index];
        rectangle.releaseCells(occupiedCells);
        rectanglesRef.current.splice(index, 1);
      });

      // 四角形を追加
      if (rectanglesRef.current.length < 20) {
        const xMax = Math.floor(canvas.width / RECTANGLE_SIZE);
        const yMax = Math.floor(canvas.height / RECTANGLE_SIZE);
        const width = Math.floor(Math.random() * 5) + 2;
        const height = Math.floor(Math.random() * 5) + 2;
        let x = Math.floor(Math.random() * (xMax - width));
        let y = Math.floor(Math.random() * (yMax - height));
        // マスの占有状況を確認
        let canPlace = true;

        let cnt = 0;
        while (occupiedCells.has(`${x},${y}`)) {
          if (cnt > 10) {
            canPlace = false;
            break;
          }
          x = (x + 1) % xMax;
          y = (y + 1) % yMax;
          cnt++;
        }

        let hMin = height;
        // canPlace = !occupiedCells.has(`${x},${y}`);
        let rectMax = { width: 0, height: 0 };

        for (let i = 0; i < width; i++) {
          for (let j = 0; j < hMin; j++) {
            if (occupiedCells.has(`${i + x},${j + y}`)) {
              hMin = Math.min(hMin, j);
              // if (hMin - y <= 0) {
              //   canPlace = false;
              //   break;
              // }
            } else {
              const w = i + 1,
                h = j + 1;
              if (rectMax.width * rectMax.height < w * h) {
                rectMax = { width: w, height: h };
              }
            }
          }
          if (!canPlace) break;
        }

        let wMin = width;

        for (let i = 0; i < height; i++) {
          for (let j = 0; j < wMin; j++) {
            if (occupiedCells.has(`${j + x},${i + y}`)) {
              wMin = Math.min(wMin, j);
              // if (wMin - x <= 0) {
              //   canPlace = false;
              //   break;
              // }
            } else {
              const w = j + 1,
                h = i + 1;
              if (rectMax.width * rectMax.height < w * h) {
                rectMax = { width: w, height: h };
              } else if (
                rectMax.width * rectMax.height == w * h &&
                Math.random() < 0.5
              ) {
                rectMax = { ...rectMax, width: w, height: h };
              }
            }
          }
          if (!canPlace) break;
        }
        if (canPlace) {
          const life = Math.random() * 60 * 10 + 60 * 10;
          const rectangle = new Rectangle(
            x,
            y,
            rectMax.width,
            rectMax.height,
            colors[Math.floor(Math.random() * colors.length)],
            life,
            context
          );
          rectangle.registerCells(occupiedCells);
          rectanglesRef.current.push(rectangle);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

class Rectangle {
  x: number;
  y: number;
  width: number; // マス分の幅
  height: number; // マス分の高さ
  static dw: number;
  static dh: number;
  color: string;
  life: number;
  appearing: boolean = true;
  disappearing: boolean = false;
  context: CanvasRenderingContext2D;
  appearingTime: number = APPEARING_TIME;
  isVertical: boolean = Math.random() < 0.5;
  padding: number = 10; // パディングの追加

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    life: number,
    context: CanvasRenderingContext2D
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.life = life;
    this.context = context;
  }

  draw() {
    const ratio = this.calcRatio(this.appearingTime, this.disappearing);

    if (this.appearing) {
      this.drawRect(ratio);
      this.appearingTime--;
      if (this.appearingTime <= 0) {
        this.appearing = false;
        this.appearingTime = APPEARING_TIME;
        this.isVertical = Math.random() < 0.5;
      }
      return;
    } else if (this.disappearing) {
      this.drawRect(ratio);
      this.appearingTime--;
      if (this.appearingTime < 0) {
        this.disappearing = false;
      }
      return;
    }
    this.life -= 1;
    this.drawRect(1);
    if (this.life <= 0) {
      this.disappearing = true;
    }
  }

  drawRect(ratio: number) {
    const width = this.width * Rectangle.dw;
    const height = this.height * Rectangle.dh;
    const wRatio = this.isVertical ? 1 : ratio;
    const hRatio = this.isVertical ? ratio : 1;
    const xPos = this.x * Rectangle.dw + this.padding;
    const yPos = this.y * Rectangle.dh + this.padding;
    const adjustedWidth = (width - this.padding * 2) * wRatio;
    const adjustedHeight = (height - this.padding * 2) * hRatio;
    const maxRadius = Math.min(adjustedWidth, adjustedHeight) / 2;
    const radius = Math.min(20, maxRadius); // 角の半径を調整
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.roundRect(xPos, yPos, adjustedWidth, adjustedHeight, radius);
    this.context.fill();
  }

  roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    const ctx = this.context;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  calcRatio(appearingTime: number, reverse: boolean) {
    return (
      ((reverse ? -1 : 1) *
        Math.cos(Math.PI * (appearingTime / APPEARING_TIME))) /
        2 +
      0.5
    );
  }

  isDead() {
    return this.life <= 0 && !this.disappearing;
  }

  // マスを登録
  registerCells(occupiedCells: Set<string>) {
    for (let i = this.x; i < this.x + this.width; i++) {
      for (let j = this.y; j < this.y + this.height; j++) {
        occupiedCells.add(`${i},${j}`);
      }
    }
  }

  // マスを解放
  releaseCells(occupiedCells: Set<string>) {
    for (let i = this.x; i < this.x + this.width; i++) {
      for (let j = this.y; j < this.y + this.height; j++) {
        occupiedCells.delete(`${i},${j}`);
      }
    }
  }
}
