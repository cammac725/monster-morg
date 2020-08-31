class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.scene.launch('Ui');
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

  createPlayer(playerObject) {
    this.player = new PlayerContainer(
      this,
      playerObject.x * 2,
      playerObject.y * 2,
      'characters',
      0,
      playerObject.health,
      playerObject.maxHealth,
      playerObject.id,
    );
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

  enemyOverlap(weapon, enemy) {
    if (this.player.playerAttacking && !this.player.swordHit) {
      this.player.swordHit = true;
      this.events.emit('monsterAttacked', enemy.id, this.player.id)
    }
  }

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();

    this.events.emit('pickupChest', chest.id, player.id)
  }

  createMap() {
    //create map
    this.map = new Map(this, 'map', 'background', 'background', 'blocked');
  }

  createGameManager() {
    this.events.on('spawnPlayer', (playerObject) => {
      this.createPlayer(playerObject);
      this.addCollisions();
    });

    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    });

    this.events.on('monsterSpawned', (monster) => {
      this.spawnMonster(monster);
    });

    this.events.on('chestRemoved', (chestId) => {
      this.chests.getChildren().forEach(chest => {
        if (chest.id === chestId) {
          chest.makeInactive();
        }
      });
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