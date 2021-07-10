import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AnimationController, Animation } from '@ionic/angular';

import { BehaviorSubject, timer } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.page.html',
  styleUrls: ['./snake.page.scss'],
})
export class SnakePage implements AfterViewInit {
  @ViewChild('gameBoard') gameBoard: ElementRef;
  @ViewChild('snake') snake: ElementRef;
  @ViewChild('head') head: ElementRef;
  // @ViewChildren('tail') tail: QueryList<any>;

  private x = 0;
  private y = 0;
  private direction = new BehaviorSubject('RIGHT');
  private movingDirection = '';
  private foodX: number;
  private foodY: number;
  private tailX: number;
  private tailY: number;
  private tail: ElementRef[] = [];

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.food();
    this.move();
    //  console.log(this.getRandomInt(0, 500));
    // const fullSnake = this.snake.nativeElement.children;
    console.log(this.snake.nativeElement.children);
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
            this.x = 499;
          }

          if (this.y < 0) {
            this.y = 499;
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
            this.renderer.setStyle(
              newTail,
              'transform',
              `translate(${this.tailX}px,${this.tailY}px)`
            );
            this.renderer.appendChild(this.snake.nativeElement, newTail);
            this.tail.push(newTail);

            this.foodX = this.getRandom10();
            this.foodY = this.getRandom10();

            this.renderer.setStyle(
              foodBoard,
              'transform',
              `translate(${this.foodX}px,${this.foodY}px)`
            );
          }

          if (this.tail.length > 0) {
            this.tail.unshift(this.tail.pop());

            this.renderer.setStyle(
              this.tail[this.tail.length - 1],

              'transform',
              `translate(${this.tailX}px,${this.tailY}px)`
            );
          }
        })
      )
      .subscribe();
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
