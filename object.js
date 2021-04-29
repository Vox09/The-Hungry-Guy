const mouthOpenThreshold = 5;
const objDefaultDeadTime = 500;

const geo_dict = {
    'box': [new THREE.BoxGeometry(10, 10, 10),
            new THREE.SphereGeometry(5)]
}

const mtr_dict = {
    'box': [new THREE.MeshBasicMaterial( {color: 0x00ff00} ),
            new THREE.MeshBasicMaterial( {color: 0xff0000} )]
}

const score_dict = {
    'box': 10
}

export class GameObject extends Physijs.BoxMesh{
    constructor(levelObj){
        const name = levelObj.name;
        super(geo_dict[name][0], mtr_dict[name][0]);
        if (Object.keys(geo_dict).indexOf(name) === -1){
            console.error('invalid object name:', name, 'at GameObject constructor');
        }
        this.name = levelObj.name;
        this.isFood = levelObj.isFood;
        this.lifetime = levelObj.lifetime;
        this.spawnTime = levelObj.spawnTime;
        this.position.x = levelObj.spawnPos[0];
        this.position.y = levelObj.spawnPos[1];
        this.position.z = levelObj.spawnPos[2];
        this.score = score_dict[name];
        this.eatenGeometry = geo_dict[name][1];
        this.eatenMaterial = mtr_dict[name][1];
        // fixed
        this.isEaten = false;
        // optional
        this.initVel = levelObj.initVel || [0,0,0];
        this.deadTime = levelObj.deadTime || objDefaultDeadTime;
    }

    setInitVel(){
        this.setLinearVelocity( new THREE.Vector3(
            this.initVel[0] * myMeter,
            this.initVel[1] * myMeter,
            this.initVel[2] * myMeter
        ));
        this.setAngularVelocity( new THREE.Vector3(Math.random(), Math.random(), Math.random()) );
    }

    canBeEaten(mouth){
        if (!mouth || this.isEaten)
            return false;
        const ymax = mouth.up[1];
        const ymin = mouth.low[1];
        const xmax = mouth.right[0];
        const xmin = mouth.left[0];
        if (ymax - ymin > mouthOpenThreshold &&
            ymax > this.position.y && ymin < this.position.y &&
            xmax > this.position.x && xmin < this.position.x ){
            return true;
        }
        return false;
    }
    
    eaten(){
        this.geometry = this.eatenGeometry;
        this.material = this.eatenMaterial;
        this.isEaten = true;
        let zero = new THREE.Vector3(0, 0, 0);
        this.setAngularFactor(zero);
        this.setAngularVelocity(zero);
        this.setLinearFactor(zero);
        this.setLinearVelocity(zero);
        return this.score;
    }
}

