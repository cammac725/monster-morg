class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.scene.launch('Ui');
    this.score = 0;
  }

  create() {
    this.createMap();
    this.createAudio();
    this.createGroups();
    // this.createWalls();
    this.createInput();
    this.createGameManager();
  }

  update() {
    if (this.player) this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add(
      'goldSound',
      { loop: false, volume: 0.2 }
    );
  }

  createPlayer(location) {
    this.player = new PlayerContainer(
      this,
      location[0] * 2,
      location[1] * 2,
      'characters',
      0);
  }

  createGroups() {
    // create a chest group
    this.chests = this.physics.add.group();
   
    // create a monster group
    this.monsters = this.physics.add.group();
  }

  spawnChest(chestObject) {
    let chest = this.chests.getFirstDead();
    if (!chest) {
      chest = new Chest(
        this,
        chestObject.x * 2,
        chestObject.y * 2,
        'items',
        0,
        chestObject.gold,
        chestObject.id,
      );
      // add chest to chests group
      this.chests.add(chest);
    } else {
      chest.coins = chestObject.gold;
      chest.id = chestObject.id;
      chest.setPosition(chestObject.x * 2, chestObject.y * 2);
      chest.makeActive();
    }
  }

  spawnMonster(monsterObject) {
    let monster = this.monsters.getFirstDead();
    if (!monster) {
      monster = new Monster(
        this,
        monsterObject.x * 2,
        monsterObject.y * 2,
        'monsters',
        monsterObject.frame,
        monsterObject.id,
        monsterObject.health,
        monsterObject.maxHealth,
      );
      // add monster to monsters group
      this.monsters.add(monster);
    } else {
      monster.id = monsterObject.id;
      monster.health = monsterObject.health;
      monster.maxHealth = monsterObject.maxHealth;
      monster.setTexture('monsters', monsterObject.frame);
      monster.setPosition(monsterObject.x * 2, monsterObject.y * 2);
      monster.makeActive();
    }
  }

  // createWalls() {
  //   this.wall = this.physics.add.image(500, 100, 'button1');
  //   this.wall.setImmovable();
  // }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    // check for collisions between player and the tiled blocked layer
    this.physics.add.collider(this.player, this.map.blockedLayer);

    // check for collisions between monster group and the tiled blocked layer
    this.physics.add.collider(this.monsters, this.map.blockedLayer);

    // check for overlaps between player and chest game objects
    this.physics.add.overlap(
      this.player,
      this.chests,
      this.collectChest,
      null,
      this,
    );

    // check for overlaps between player's weapon and monster game objects
    this.physics.add.overlap(
      this.player.weapon,
      this.monsters,
      this.enemyOverlap,
      null,
      this,
    );
  }

  enemyOverlap(player, enemy) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.events.emit('monsterAttacked', enemy.id)
    }
  }

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();
    // update our score
    this.score += chest.coins;
    // update score in the ui
    this.events.emit('updateScore', this.score)
    // make chest game object inactive
    chest.makeInactive();

    this.events.emit('pickupChest', chest.id)
  }

  createMap() {
    //create map
    this.map = new Map(this, 'map', 'background', 'background', 'blocked');
  }

  createGameManager() {
    this.events.on('spawnPlayer', (location) => {
      this.createPlayer(location);
      this.addCollisions();
    });

    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    });

    this.events.on('monsterSpawned', (monster) => {
      this.spawnMonster(monster);
    });
    
    this.events.on('monsterRemoved', (monsterId) => {
      this.monsters.getChildren().forEach(monster => {
        if (monster.id === monsterId) {
          monster.makeInactive();
        }
      });
    });

    this.events.on('updateMonsterHealth', (monsterId, health) => {
      this.monsters.getChildren().forEach(monster => {
        if (monster.id === monsterId) {
          monster.updateHealth(health);
        }
      });
    });

    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();
  }

}