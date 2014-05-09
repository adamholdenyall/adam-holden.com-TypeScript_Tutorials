/// <reference path="../../def/phaser.d.ts"/>
/// <reference path="../../def/require.d.ts" />

import TypeState = require("lib/TypeState");//Include TypeState with RequireJS

//The star can spin either clockwise or counter-clockwise.
//The direction will be toggled with a click event.
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

		//Set up all valid transitions. If you attempt to perform an
		//invalid transition, TypeState will show an error.
		this.fsm.from(StarStates.SpinningCW).to(StarStates.SpinningCCW);
		this.fsm.from(StarStates.SpinningCCW).to(StarStates.SpinningCW);

		//".on" is used to define code that will be performed when the FSM is
		//switched to a particular state. You can use the "from" variable
		//to perform a switch to do different actions based on the state that
		//you are transitioning from.
		this.fsm.on(StarStates.SpinningCW, (from: StarStates)=>{
			//Only add the event handler once so that it doesn't trigger when we
			//leave the state.
			this.events.onInputDown.addOnce(()=>{
				this.fsm.go(StarStates.SpinningCCW);//Change states
			},this);
			//Refine the update function to rotate clockwise
			this.update = () => {this.angle += 180 * this.game.time.elapsed / 1000;}
		});

		this.fsm.on(StarStates.SpinningCCW, (from: StarStates)=>{
			this.events.onInputDown.addOnce(()=>{
				this.fsm.go(StarStates.SpinningCW);
			},this);
			//Refine the update function to rotate counter-clockwise
			this.update = () => { this.angle -= 180 * this.game.time.elapsed / 1000;}
		});
		game.add.existing(this);

		//Though the constructor takes in a state at which to start the FSM, the ".on"
		//handler won't trigger upon initialization. All states are allowed to
		//transition to themselves.
		this.fsm.go(StarStates.SpinningCW);

	}
}

//The treasure chest has a more complicated FSM with 5 states. Locked, Closed, and
//Open will allow for interaction, and it will be in Opening and Closing as it
//animates.
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

		//List valid transitions
		this.fsm.from(ChestStates.Locked).to(ChestStates.Closed);
		this.fsm.from(ChestStates.Closed).to(ChestStates.Locked);
		this.fsm.from(ChestStates.Closed).to(ChestStates.Opening);
		this.fsm.from(ChestStates.Opening).to(ChestStates.Open);
		this.fsm.from(ChestStates.Open).to(ChestStates.Closing);
		this.fsm.from(ChestStates.Closing).to(ChestStates.Closed);

		//Unlock state
		//Will listen for the 'U' button and transition when it is pressed
		var unlockKey = game.input.keyboard.addKey(Phaser.Keyboard.U);
		this.fsm.on(ChestStates.Locked,(from: ChestStates) =>{
			this.play("open").stop();//Start at a closed animation frame.
			this.tint = 0x999999;
			unlockKey.onDown.addOnce(()=>{
				this.fsm.go(ChestStates.Closed);
			},this);
		}).onExit(ChestStates.Locked,(to:ChestStates) =>{
			//onExit and onEnter are powerful methods on the FSM.
			//Firstly, you can use them to prepare or clean up code
			//when the state changes. Secondly, they must return a
			//boolean value. If it is true, the transition will occur.
			//If it is false, the FSM will stay in the current state!
			//Remember to unregister key listeners when you change states!
			unlockKey.onDown.removeAll();
			this.tint = 0xFFFFFF;
			return true;
		});

		//Closed State
		//Similar to the previous state, but you can either open or re-lock
		var openKey = game.input.keyboard.addKey(Phaser.Keyboard.O);
		var lockKey = game.input.keyboard.addKey(Phaser.Keyboard.L);
		this.fsm.on(ChestStates.Closed, (from: ChestStates)=>{
			this.play("open").stop();//Start at a closed animation frame.
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

		//Opening State
		//This simply blocks interaction while the opening animation plays.
		//When the animation finishes, it will transition to the Open state
		//and allow interactivity again.
		this.fsm.on(ChestStates.Opening, (from: ChestStates)=>{
			this.play("open").onComplete.addOnce(()=>{
				this.fsm.go(ChestStates.Open);
			},this);
		});

		//Open state
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

		//Closing State
		//Same as the Opening state, but with the opposite animation
		this.fsm.on(ChestStates.Closing,(from:ChestStates) =>{
			this.play("close").onComplete.addOnce(()=>{
				this.fsm.go(ChestStates.Closed);
			},this);
		});

		game.add.existing(this);

		//Though the constructor takes in a state at which to start the FSM, the ".on"
		//handler won't trigger upon initialization. All states are allowed to
		//transition to themselves.
		this.fsm.go(ChestStates.Locked);
	}

	//Code that is necessary when using trimmed, pivoted sprites.
	private fixPivot(){
		if(this.animations.currentAnim) {
			this.pivot.x = this.animations.currentAnim.currentFrame.spriteSourceSizeW / 2;
			this.pivot.y = this.animations.currentAnim.currentFrame.spriteSourceSizeH / 2;
		}
	}
}
