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
  @ViewChild('square') square: ElementRef;
  @ViewChildren('tail') tail: QueryList<any>;
  anim: Animation;
  isPlaying = false;
  private x = 0;
  private y = 0;
  private direction = new BehaviorSubject('RIGHT');
  private movingDirection = '';

  constructor(
    private animationCtrl: AnimationController,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.move();
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

          this.renderer.setStyle(
            this.square.nativeElement,
            'transform',
            `translate(${this.x}px,${this.y}px)`
          );
        })
      )
      .subscribe();
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
