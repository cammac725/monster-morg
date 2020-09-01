class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    // create title text
    this.titleText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 3.5,
      'Monster Morg',
      {
        fontSize: '64px',
        fill: '#fff',
      },
    );

    // create move text
    this.instructionText = this.add.text(
      this.scale.width / 2,
      this.scale.height * 0.75,
      'Find gold chests\n\nDefeat monsters\n\nMove: arrow keys\n\nAttack: space bar',
      {
        fontSize: '20px',
        fill: '#fff',
      },
    );
   
    this.titleText.setOrigin(0.5);
    this.instructionText.setOrigin(0.5);
    
    // create the Play Game button
    this.startGameButton = new UiButton(
      this,
      this.scale.width / 2,
      this.scale.height * 0.5,
      'button1',
      'button2',
      'Start',
      this.startScene.bind(this, 'Game'),
    )
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}