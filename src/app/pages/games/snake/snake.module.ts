import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Direction } from './direction';
import { IonicModule } from '@ionic/angular';

import { SnakePageRoutingModule } from './snake-routing.module';

import { SnakePage } from './snake.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SnakePageRoutingModule
  ],
  declarations: [SnakePage]
})
export class SnakePageModule {}
