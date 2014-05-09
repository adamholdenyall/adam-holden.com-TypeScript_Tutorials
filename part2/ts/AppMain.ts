/// <reference path="../../def/phaser.d.ts"/>
/// <reference path="../../def/require.d.ts"/>

import Items = require("Items");
	class AppMain {
		run() {
			var game:Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
				preload: preload,
				create: create,
				update: update,
				render: render
			});
			var star:Items.Star = null;
			var chest:Items.Chest = null;
			var chestText:Phaser.Text = null;
			var instructionText:Phaser.Text = null;

			function preload() {
				var root = "../assets/";
				game.load.image('sky', root+"sky.png");
				Items.Star.preload(this.game, root+"star.png");
				Items.Chest.preload(this.game,root+"chest.png",root+"chest.xml");
			}

			function create() {
				game.physics.startSystem(Phaser.Physics.ARCADE);
				game.camera.y = 600;
				game.add.sprite(0, 0, 'sky');
				chestText = game.add.text(500,250,"",{});
				chestText.anchor.set(.5,.5);
				instructionText = game.add.text(500,400,"",{});
				instructionText.anchor.set(.5,.5);
				star = new Items.Star(game, 400, 300);
				chest = new Items.Chest(game,500,300);
				instructionText.text = "U - Unlock\nO - Open\nC - Close\nL - Lock"
			}

			function update() {
				chestText.text = Items.ChestStates[chest.fsm.currentState];
			}

			function render() {

			}
		}
	}

export = AppMain;