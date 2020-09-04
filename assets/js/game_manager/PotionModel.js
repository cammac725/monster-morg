class PotionModel {
    constructor(x, y, health, spawnerId) {
        this.id = `${spawnerId}-${uuid.v4}`;
        this.spawnerId = spawnerId;
        this.x = x;
        this.y = y;
        this.health = health;
    }
}