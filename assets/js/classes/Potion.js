class Potion extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame, health, id) {
    super(scene, x, y, key, frame);
    this.scene = scene; // scene this will be added to
    this.health = health; // amount of health the potion has
    this.id = id;

    // enable physics
    this.scene.physics.world.enable(this);
    // add the potion to the existing scene
    this.scene.add.existing(this);
    //scale the potion game object
    this.setScale(2);
  }

  makeActive() {
    this.setActive(true);
    this.setVisible(true);
    this.body.checkCollision.none = false;
  }
  
  makeInactive() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  }

}