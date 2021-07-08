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
  @ViewChild('square') square: ElementRef;
  @ViewChildren('tail') tail: QueryList<any>;
  anim: Animation;
  isPlaying = false;
  private x = 0;
  private y = 0;
  private direction = new BehaviorSubject('RIGHT');
  private movingDirection = '';
  private foodX: number;
  private foodY: number;

  constructor(
    private animationCtrl: AnimationController,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.food();
    this.move();
    //  console.log(this.getRandomInt(0, 500));
    console.log(this.gameBoard.nativeElement.children);
    console.log('da');
  }

  food() {
    this.foodX = this.getRandomInt(0, 499);
    this.foodY = this.getRandomInt(0, 499);
    const foods = this.renderer.createElement('div');
    foods.classList.add('square');
    this.renderer.setStyle(
      foods,
      'transform',
      `translate(${this.foodX}px,${this.foodY}px)`
    );
    this.renderer.appendChild(this.gameBoard.nativeElement, foods);
  }

  move() {
    timer(0, 100)
      .pipe(
        withLatestFrom(this.direction),
        tap(([, direction]) => {
          this.movingDirection = direction;
          this.renderer.setStyle(
            this.tail.last.nativeElement,
            'transform',
            `translate(${this.x}px,${this.y}px)`
          );

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

          if (this.foodX === this.x && this.y === this.foodY){
           const newTail = this.renderer.createElement('div');
           this.renderer.addClass(newTail, '')
          }

          

          this.renderer.setStyle(
            this.square.nativeElement,
            'transform',
            `translate(${this.x}px,${this.y}px)`
          );
        })
      )
      .subscribe();
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
