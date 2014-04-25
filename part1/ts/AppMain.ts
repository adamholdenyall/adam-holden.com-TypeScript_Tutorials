/// <reference path="../../def/phaser.d.ts"/>
/// <reference path="../../def/require.d.ts"/>

class AppMain {
	run() {
		var game:Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
			preload: preload,
			create: create,
			update: update,
			render: render
		});
		var star: Phaser.Sprite = null;

		function preload() {
			game.load.image('sky', '../assets/sky.png');
			game.load.image('star', '../assets/star.png');
		}

		function create() {
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.camera.y = 600;
			game.add.sprite(0, 0, 'sky');

			star = game.add.sprite(400,300,'star');
		}

		function update() {
			star.anchor.set(.5,.5);
			star.angle += 180 * game.time.elapsed / 1000;
		}

		function render() {

		}
	}
}

export = AppMain;