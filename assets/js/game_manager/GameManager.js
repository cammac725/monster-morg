class GameManager {
  constructor(scene, mapData) {
    this.scene = scene;
    this.mapData = mapData;

    this.spawners = {};
    this.chests = {};
    this.monsters = {};
    this.players = {};

    this.playerLocations = [];
    this.chestLocations = {};
    this.monsterLocations = {};
  }

  setup() {
    this.parseMapData();
    this.setupEventListeners();
    this.setupSpawners();
    this.spawnPlayer();
  }

  parseMapData() {
    this.mapData.forEach((layer) => {
      if (layer.name === 'player_locations') {
        layer.objects.forEach(obj => {
          this.playerLocations.push([obj.x, obj.y]);
        });
      } else if (layer.name === 'chest_locations') {
        layer.objects.forEach(obj => {
          let spawner = getTiledProperty(obj, 'spawner');
          if (this.chestLocations[spawner]) {
            this.chestLocations[spawner].push([obj.x, obj.y]);
          } else {
            this.chestLocations[spawner] = [[obj.x, obj.y]]
          }
        });
      } else if (layer.name === 'monster_locations') {
        layer.objects.forEach(obj => {
          let spawner = getTiledProperty(obj, 'spawner');
          if (this.monsterLocations[spawner]) {
            this.monsterLocations[spawner].push([obj.x, obj.y]);
          } else {
            this.monsterLocations[spawner] = [[obj.x, obj.y]]
          }
        });
      }
    });

  }

  setupEventListeners() {

  }

  setupSpawners() {
    const config = {
      spawnInterval: 3000,
      limit: 3,
      spawnerType: 'CHEST',
      id: ''
    };
    let spawner;

    // create chest spawners
    Object.keys(this.chestLocations).forEach(key => {
      config.id = `chest-${key}`;

      spawner = new Spawner(
        config,
        this.chestLocations[key],
        this.addChest.bind(this),
        this.deleteChest.bind(this)
      );

      this.spawners[spawner.id] = spawner;
    });
  }

  spawnPlayer() {
    const location = this.playerLocations[Math.floor(Math.random()
      * this.playerLocations.length)];
    this.scene.events.emit('spawnPlayer', location);
  }

  addChest() {

  }

  deleteChest() {
    
  }
}