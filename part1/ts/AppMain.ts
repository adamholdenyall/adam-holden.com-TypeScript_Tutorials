/// <reference path="../../def/phaser.d.ts"/>
/// <reference path="../../def/require.d.ts"/>
import Items = require("ts/Items");

class AppMain {
	run() {
		var game:Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
			preload: preload,
			create: create,
			update: update,
			render: render
		});
		//var star: Items.Star = null;

		function preload() {
			game.load.image('sky', '../assets/sky.png');
			Items.Star.preload(this.game,'../assets/star.png');
		}

		function create() {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.camera.y = 600;
			game.add.sprite(0, 0, 'sky');
			star = new Items.Star(game,400,300);
		}

		function update() {

		}

		function render() {

		}
	}
}

export = AppMain;