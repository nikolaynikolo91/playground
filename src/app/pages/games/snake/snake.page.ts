import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AnimationController, Animation } from '@ionic/angular';
import { Direction } from './direction';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.page.html',
  styleUrls: ['./snake.page.scss'],
})
export class SnakePage implements AfterViewInit {
  @ViewChild('gameBoard') gameBoard: ElementRef;
  @ViewChild('snake') snake: ElementRef;
  @ViewChild('head') head: ElementRef;

  private x = 0;
  private y = 0;
  private direction = new BehaviorSubject('RIGHT');
  private movingDirection: Direction;
  private foodX: number;
  private foodY: number;
  private tailX: number;
  private tailY: number;
  private tail: any[] = [];
  private destroy = new Subject();
  private keyCodes = {
    37: Direction.left,
    38: Direction.up,
    39: Direction.right,
    40: Direction.down,
  };

  // private directionToMove = {
  //   "UP": (): any => this.toggleAnimationUp(),
  //   "DOWN": (): any => this.toggleAnimationDown(),
  //   "LEFT": (): any => this.toggleAnimationLeft(),
  //   "RIGHT": (): any => this.toggleAnimationRight(),
  // };

  constructor(private renderer: Renderer2) {}
  @HostListener('document:keydown', ['$event'])
  onKeypress(e: KeyboardEvent) {
    const code = e.keyCode;
    this.direction.next(this.keyCodes[code]);
  }

  ngAfterViewInit() {
    this.food();
    this.move();
  }

  food() {
    this.foodX = this.getRandom10();
    this.foodY = this.getRandom10();
    const foods = this.renderer.createElement('div');
    foods.classList.add('food');
    this.renderer.setStyle(
      foods,
      'transform',
      `translate(${this.foodX}px,${this.foodY}px)`
    );
    this.renderer.appendChild(this.gameBoard.nativeElement, foods);
  }

  move() {
    const snakeHead = this.snake.nativeElement.firstChild;

    timer(0, 200)
      .pipe(
        takeUntil(this.destroy),
        withLatestFrom(this.direction),
        tap(([, direction]) => {
          this.tailX = this.x;
          this.tailY = this.y;

          switch (direction) {
            case 'UP':
              this.y -= 10;
              break;
            case 'DOWN':
              this.y += 10;
              break;
            case 'LEFT':
              this.x -= 10;
              break;
            case 'RIGHT':
              this.x += 10;
              break;
            default:
              break;
          }

          // check gameBoarder
          if (this.x > 499) {
            this.x = 0;
          }

          if (this.y > 499) {
            this.y = 0;
          }

          if (this.x < 0) {
            this.x = 500;
          }

          if (this.y < 0) {
            this.y = 500;
          }

          this.renderer.setStyle(
            snakeHead,
            'transform',
            `translate(${this.x}px,${this.y}px)`
          );

          const foodBoard = this.gameBoard.nativeElement.lastChild;

          // check take food and snake grow
          if (this.foodX === this.x && this.foodY === this.y) {
            const newTail = this.renderer.createElement('div');
            this.renderer.addClass(newTail, 'tail');
            this.renderer.appendChild(this.snake.nativeElement, newTail);
            this.tail.push(newTail);

            console.log(this.tail[0].getBoundingClientRect());

            this.foodX = this.getRandom10();
            this.foodY = this.getRandom10();
            this.renderer.setStyle(
              foodBoard,
              'transform',
              `translate(${this.foodX}px,${this.foodY}px)`
            );
          }

          if (this.tail.length > 0) {
            this.renderer.setStyle(
              this.tail[this.tail.length - 1],
              'transform',
              `translate(${this.tailX}px,${this.tailY}px)`
            );
            this.tail.unshift(this.tail.pop());
          }

          let counter = 0;
          for (const element of this.snake.nativeElement.children) {
            const text = element.attributes[2].value;
            const regex =
              /[a-z]+\:\s[a-z]+\((\d+)[a-z]{2}\,\s(\d+)[a-z]{2}\)\;/g;
            const arr = regex.exec(text);
            const x = +arr[1];
            const y = +arr[2];

            if (x === this.x && y === this.y) {
              counter++;
              console.log(counter);
              if (counter > 1) {
                this.reload();
              }
            }
          }
        })
      )
      .subscribe();
  }

  reload() {
    alert('game over');
    this.destroy.next();
    location.reload();
  }
  getRandom10() {
    return this.getRandomInt(1, 50) * 10;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  toggleAnimationDown() {
    if (this.movingDirection !== 'UP') {
      this.direction.next('DOWN');
    }
  }

  toggleAnimationLeft() {
    if (this.movingDirection !== 'RIGHT') {
      this.direction.next('LEFT');
    }
  }
  toggleAnimationRight() {
    if (this.movingDirection !== 'LEFT') {
      this.direction.next('RIGHT');
    }
  }
  toggleAnimationUp() {
    if (this.movingDirection !== 'DOWN') {
      this.direction.next('UP');
    }
  }
}
