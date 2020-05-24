import * as Phaser from "phaser";

export class Item extends Phaser.GameObjects.Container {
  image: Phaser.GameObjects.Image;
  zone: Phaser.GameObjects.Zone;
  consuming;
  constructor(scene: Phaser.Scene) {
    super(scene, Phaser.Math.Between(0, 400), 200);
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
      console.log("consume item", zone);
      this.consuming = consumeItem.bind(this)(zone);
    })
    .on(Phaser.Input.Events.DRAG_LEAVE, () => {
      this.consuming();
    })
    .on(Phaser.Input.Events.GAMEOBJECT_DRAG_END, () => {
      this.zone.setInteractive();
    });
}

function consumeItem(this: Item, target: Phaser.GameObjects.Zone) {
  const updateEvent = (timer, delta: number) => {
    const { x: x1, y: y1 } = this;
    const { x: x2, y: y2 } = target.parentContainer as Item;
    const v = 0.2;
    const dy = y2 - y1;
    const dx = x2 - x1;

    const isClose = Math.abs(dy) < 1 && Math.abs(dx) < 1;

    if (isClose) {
      this.scene.events.off("update", updateEvent);
      this.scene.events.once("update", () => {
        if (target && target.parentContainer && target.parentContainer.destroy) {
          target.parentContainer.destroy();
        }
      });
      return;
    }

    if (Math.abs(dy) < 1) {
      console.log('trigger dy');
      const l = (Math.sign(x1 - x2) * v * delta);
      target.parentContainer.setPosition(x2 + l, y2);
      return;
    }
    if (Math.abs(dx) < 1) {
      console.log('trigger dx');
      const l = (Math.sign(y1 - y2) * v * delta);
      target.parentContainer.setPosition(x2, y2 + l);
      return;
    }

    const m = dy / dx;
    const l = v * delta;
    const a = (1 / (1 + m ** 2)) ** (1 / 2);
    const xd = x2 + Math.sign(x1 - x2) * (l * a);
    const yd = y2 + Math.sign(y2 - y1) * l * m * a;
    target.parentContainer.setPosition(xd, yd);
  };
  this.scene.events.on("update", updateEvent, this);
  return () => {
    this.scene.events.off("udpate", updateEvent);
  };
}
