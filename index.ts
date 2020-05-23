import * as Phaser from 'phaser';
import { gearData } from './data';

new Phaser.Game({
  scene: {
    preload,
    create,
  },
});

function preload(this: Phaser.Scene) {
  this.load.image('gear', gearData);
}

function create(this: Phaser.Scene) {
  this.add.image(200, 200, 'gear');
}