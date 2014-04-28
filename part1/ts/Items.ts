/// <reference path="../../def/phaser.d.ts"/>

export class Star extends Phaser.Sprite {
	static preload(game: Phaser.Game, path: string){
		game.load.image("star", path);
	}

	constructor (game: Phaser.Game,x:number,y:number){
		super(game,x,y,"star");
		this.anchor.set(.5,.5);
		game.add.existing(this);
	}

	update(){
		this.angle += 180 * this.game.time.elapsed / 1000;
	}
}