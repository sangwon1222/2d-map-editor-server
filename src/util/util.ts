import * as pathfinder from 'pathfinding';

// 오늘 날짜 반환
export function getToday() {
    const year = new Date().getUTCFullYear()
    const month = `0${new Date().getUTCMonth()+1}`.slice(-2)
    const day = `0${new Date().getUTCDate()}`.slice(-2)
    
    return `${ year }-${ month }-${( day )}`
  }


export async function pathfind(mapData: [][], startPos:number[],endPos:number[]){
  const grid = new pathfinder.Grid(mapData);
  const finder = new pathfinder.AStarFinder({
    allowDiagonal: false,
    dontCrossCorners: false,
  });
  const path = await finder.findPath(startPos[0], startPos[1], endPos[0], endPos[1], grid);
  return path;
}