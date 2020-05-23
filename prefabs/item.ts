import * as Phaser from "phaser";

export class Item extends Phaser.GameObjects.Container {
  image: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.setScale(0.2);

    this.zone = addZone.bind(this)();
    this.add(this.zone);

    this.image = addImage.bind(this)();
    this.add(this.image);
  }
}

function addZone(this: Item): Phaser.GameObjects.Zone {
  return this.scene.add.zone(0, 0, 512, 512).setRectangleDropZone(512, 512);
}

function addImage(this: Item): Phaser.GameObjects.Image {
  return this.scene.add
      .image(0, 0, "gear")
      .setInteractive({ draggable: true })
      .on("dragstart", pointer => {
        this.zone.disableInteractive();
        this.scene.children.bringToTop(this);
      })
      .on("drag", pointer => {
        this.setPosition(pointer.x, pointer.y);
      })
      .on("dragenter", (pointer, zone) => {
        console.log('consume item', zone);
        consumeItem.bind(this)(zone);
      })
      .on("dragend", () => {
        this.zone.setInteractive();
      });
}

function consumeItem(this: Item, target: Phaser.GameObjects.Zone) {
  const updateEvent = (timer, delta: number) => {
    const { x: x1, y: y1 } = this;
    const { x: x2, y: y2 } = target.parentContainer as Item;
    const v = 0.1;

  }
  this.scene.events.on('update', updateEvent);
}

