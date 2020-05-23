import * as Phaser from 'phaser';
import { Item } from './prefabs/item';

new Phaser.Game({
  scene: {
    preload,
    create,
  },
});

function preload(this: Phaser.Scene) {
  this.load.image('gear', 'https://cdn.jsdelivr.net/gh/hscheuerle/typescript-c2azrr@master/assets/settings.png');
}

function create(this: Phaser.Scene) {
  const item = new Item(this);
  this.add.existing(item);
  const item2 = new Item(this);
  this.add.existing(item2);
}