/* tslint:disable */
/**
*/
export class PathFinder {
  free(): void;
/**
* @returns {PathFinder} 
*/
  static new(): PathFinder;
/**
* @param {string} weight 
* @returns {boolean} 
*/
  hasNode(weight: string): boolean;
/**
* @param {string} from 
* @param {string} to 
* @param {number} distance 
*/
  addLink(from: string, to: string, distance: number): void;
/**
* @param {string} from_weight 
* @param {string} to_weight 
* @param {boolean} only_count_hops 
* @returns {any} 
*/
  findPath(from_weight: string, to_weight: string, only_count_hops: boolean): any;
/**
*/
  show(): void;
}
