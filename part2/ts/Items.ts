/// <reference path="../../def/phaser.d.ts"/>
/// <reference path="../../def/require.d.ts" />

import TypeState = require("lib/TypeState");

export enum StarStates {
	SpinningCW,
	SpinningCCW
}

export class Star extends Phaser.Sprite {
	public static key:string = "Star";

	public fsm : TypeState.FiniteStateMachine<StarStates> =
		new TypeState.FiniteStateMachine<StarStates>(StarStates.SpinningCW);

	static preload(game: Phaser.Game, path: string){
		game.load.image(Star.key, path);
	}

	constructor (game: Phaser.Game,x:number,y:number){
		super(game,x,y,Star.key);
		this.anchor.set(.5,.5);
		this.inputEnabled = true;

		this.fsm.from(StarStates.SpinningCW).to(StarStates.SpinningCCW);
		this.fsm.from(StarStates.SpinningCCW).to(StarStates.SpinningCW);

		this.fsm.on(StarStates.SpinningCW, (from: StarStates)=>{
			this.events.onInputDown.addOnce(()=>{
				this.fsm.go(StarStates.SpinningCCW);
			},this);
			this.update = () => {this.angle += 180 * this.game.time.elapsed / 1000;}
		});

		this.fsm.on(StarStates.SpinningCCW, (from: StarStates)=>{
			this.events.onInputDown.addOnce(()=>{
				this.fsm.go(StarStates.SpinningCW);
			},this);
			this.update = () => { this.angle -= 180 * this.game.time.elapsed / 1000;}
		});
		game.add.existing(this);
		this.fsm.go(StarStates.SpinningCW);
	}
}

export enum ChestStates {
	Locked,
	Closed,
	Opening,
	Open,
	Closing,
}

export class Chest extends Phaser.Sprite {
	public static key :string = "Chest";

	public fsm: TypeState.FiniteStateMachine<ChestStates>
		= new TypeState.FiniteStateMachine<ChestStates>(ChestStates.Locked);

	static preload(game:Phaser.Game,imagePath:string,xmlPath:string){
		game.load.atlasXML(Chest.key, imagePath, xmlPath);
	}

	constructor (game: Phaser.Game,x:number,y:number){
		super(game,x,y,Chest.key);
		this.inputEnabled = true;
		this.animations.add("open", Phaser.Animation.generateFrameNames('chestcropped', 1, 6, '.png',4), 20, false);
		this.animations.add("close", Phaser.Animation.generateFrameNames('chestcropped', 6, 1, '.png',4), 20, false);
		this.fixPivot();

		this.fsm.from(ChestStates.Locked).to(ChestStates.Closed);
		this.fsm.from(ChestStates.Closed).to(ChestStates.Locked);
		this.fsm.from(ChestStates.Closed).to(ChestStates.Opening);
		this.fsm.from(ChestStates.Opening).to(ChestStates.Open);
		this.fsm.from(ChestStates.Open).to(ChestStates.Closing);
		this.fsm.from(ChestStates.Closing).to(ChestStates.Closed);

		var unlockKey = game.input.keyboard.addKey(Phaser.Keyboard.U);
		this.fsm.on(ChestStates.Locked,(from: ChestStates) =>{
			this.play("open").stop();
			this.tint = 0x999999;
			unlockKey.onDown.addOnce(()=>{
				this.fsm.go(ChestStates.Closed);
			},this);
		}).onExit(ChestStates.Locked,(to:ChestStates) =>{
			unlockKey.onDown.removeAll();
			this.tint = 0xFFFFFF;
			return true;
		});

		var openKey = game.input.keyboard.addKey(Phaser.Keyboard.O);
		var lockKey = game.input.keyboard.addKey(Phaser.Keyboard.L);
		this.fsm.on(ChestStates.Closed, (from: ChestStates)=>{
			this.play("open").stop();
			openKey.onDown.addOnce(()=>{
				this.fsm.go(ChestStates.Opening);
			},this);
			lockKey.onDown.addOnce(()=>{
				this.fsm.go(ChestStates.Locked);
			},this);
		}).onExit(ChestStates.Closed,(to:ChestStates) =>{
			openKey.onDown.removeAll();
			lockKey.onDown.removeAll();
			return true;
		});

		this.fsm.on(ChestStates.Opening, (from: ChestStates)=>{
			this.play("open").onComplete.addOnce(()=>{
				this.fsm.go(ChestStates.Open);
			},this);
		});

		var closeKey = game.input.keyboard.addKey(Phaser.Keyboard.C);
		this.fsm.on(ChestStates.Open,(from:ChestStates) =>{
			this.play("close").stop();
			closeKey.onDown.addOnce(()=>{
				this.fsm.go(ChestStates.Closing);
			},this);
		}).onExit(ChestStates.Open,(to:ChestStates) =>{
			closeKey.onDown.removeAll();
			return true;
		});

		this.fsm.on(ChestStates.Closing,(from:ChestStates) =>{
			this.play("close").onComplete.addOnce(()=>{
				this.fsm.go(ChestStates.Closed);
			},this);
		});

		game.add.existing(this);

		this.fsm.go(ChestStates.Locked);
	}

	private fixPivot(){
		if(this.animations.currentAnim) {
			this.pivot.x = this.animations.currentAnim.currentFrame.spriteSourceSizeW / 2;
			this.pivot.y = this.animations.currentAnim.currentFrame.spriteSourceSizeH / 2;
		}
	}
}
