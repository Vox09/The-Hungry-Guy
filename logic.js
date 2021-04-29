import { GameObject } from './object';
import { loadLevelAudios, playLevelMusic } from './audio';

let levels, level, iLevel;
let iter;
let objects;
let startTime;

const scoreElement = document.getElementById('score'); 
let score;

export function loadGameLevels() {
  loadLevelAudios();
  levels = [];
  levels.push( require('./levels/lvl1.json') );
  levels.push( require('./levels/lvl2.json') );
}

export function gameChooseLevel(lvl) {
  iLevel = lvl;
  console.log('choose level: ', lvl);
  // pause the game
  startTime = null;
}

export function gameReset(scene) {
  level = levels[iLevel - 1];
  playLevelMusic(iLevel - 1);
  // clean up remainning objs
  if (objects) objects.forEach(obj => { scene.remove(obj) });
  objects = [];
  iter = 0;
  score = 0;
  startTime = new Date().getTime();
}

export function gameLogic(scene, mouth, state) {
  if (!startTime) return;
  let timeElasped = new Date().getTime() - startTime;
  if (state.debug) console.log('time gone: ', timeElasped);
  // for each obj
  for (let i = 0; i < objects.length; ++i) {
    const obj = objects[i];
    // judge eaten
    if (obj.canBeEaten(mouth)) {
      obj.lifetime = timeElasped - obj.spawnTime + obj.deadTime;
        score += obj.eaten();
      console.log('score: ', score);
    }
    // delte dead objects
    if (timeElasped - obj.spawnTime > obj.lifetime) {
      scene.remove(obj);
      objects.splice(i, 1);
    }
  }
  // spawn objs
  for (let levelObj = level[iter]; iter < level.length && timeElasped > levelObj.spawnTime; levelObj = level[++iter]) {
    console.log('spawn ', timeElasped - levelObj.spawnTime);
    console.log('iter ', iter);
    const obj = new GameObject(levelObj);
    scene.add(obj);
    objects.push(obj);
  }
  scoreElement.innerHTML = 'Score: ' + score;
  return score;
}