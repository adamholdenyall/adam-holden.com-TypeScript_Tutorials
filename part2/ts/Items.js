/// <reference path="../../def/phaser.d.ts"/>
/// <reference path="../../def/require.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "lib/TypeState"], function(require, exports, TypeState) {
    (function (StarStates) {
        StarStates[StarStates["SpinningCW"] = 0] = "SpinningCW";
        StarStates[StarStates["SpinningCCW"] = 1] = "SpinningCCW";
    })(exports.StarStates || (exports.StarStates = {}));
    var StarStates = exports.StarStates;

    var Star = (function (_super) {
        __extends(Star, _super);
        function Star(game, x, y) {
            var _this = this;
            _super.call(this, game, x, y, Star.key);
            this.fsm = new TypeState.FiniteStateMachine(0 /* SpinningCW */);
            this.anchor.set(.5, .5);
            this.inputEnabled = true;

            this.fsm.from(0 /* SpinningCW */).to(1 /* SpinningCCW */);
            this.fsm.from(1 /* SpinningCCW */).to(0 /* SpinningCW */);

            this.fsm.on(0 /* SpinningCW */, function (from) {
                _this.events.onInputDown.addOnce(function () {
                    _this.fsm.go(1 /* SpinningCCW */);
                }, _this);
                _this.update = function () {
                    _this.angle += 180 * _this.game.time.elapsed / 1000;
                };
            });

            this.fsm.on(1 /* SpinningCCW */, function (from) {
                _this.events.onInputDown.addOnce(function () {
                    _this.fsm.go(0 /* SpinningCW */);
                }, _this);
                _this.update = function () {
                    _this.angle -= 180 * _this.game.time.elapsed / 1000;
                };
            });
            game.add.existing(this);
            this.fsm.go(0 /* SpinningCW */);
        }
        Star.preload = function (game, path) {
            game.load.image(Star.key, path);
        };
        Star.key = "Star";
        return Star;
    })(Phaser.Sprite);
    exports.Star = Star;

    (function (ChestStates) {
        ChestStates[ChestStates["Locked"] = 0] = "Locked";
        ChestStates[ChestStates["Closed"] = 1] = "Closed";
        ChestStates[ChestStates["Opening"] = 2] = "Opening";
        ChestStates[ChestStates["Open"] = 3] = "Open";
        ChestStates[ChestStates["Closing"] = 4] = "Closing";
    })(exports.ChestStates || (exports.ChestStates = {}));
    var ChestStates = exports.ChestStates;

    var Chest = (function (_super) {
        __extends(Chest, _super);
        function Chest(game, x, y) {
            var _this = this;
            _super.call(this, game, x, y, Chest.key);
            this.fsm = new TypeState.FiniteStateMachine(0 /* Locked */);
            this.inputEnabled = true;
            this.animations.add("open", Phaser.Animation.generateFrameNames('chestcropped', 1, 6, '.png', 4), 20, false);
            this.animations.add("close", Phaser.Animation.generateFrameNames('chestcropped', 6, 1, '.png', 4), 20, false);
            this.fixPivot();

            this.fsm.from(0 /* Locked */).to(1 /* Closed */);
            this.fsm.from(1 /* Closed */).to(0 /* Locked */);
            this.fsm.from(1 /* Closed */).to(2 /* Opening */);
            this.fsm.from(2 /* Opening */).to(3 /* Open */);
            this.fsm.from(3 /* Open */).to(4 /* Closing */);
            this.fsm.from(4 /* Closing */).to(1 /* Closed */);

            var unlockKey = game.input.keyboard.addKey(Phaser.Keyboard.U);
            this.fsm.on(0 /* Locked */, function (from) {
                _this.play("open").stop();
                _this.tint = 0x999999;
                unlockKey.onDown.addOnce(function () {
                    _this.fsm.go(1 /* Closed */);
                }, _this);
            }).onExit(0 /* Locked */, function (to) {
                unlockKey.onDown.removeAll();
                _this.tint = 0xFFFFFF;
                return true;
            });

            var openKey = game.input.keyboard.addKey(Phaser.Keyboard.O);
            var lockKey = game.input.keyboard.addKey(Phaser.Keyboard.L);
            this.fsm.on(1 /* Closed */, function (from) {
                _this.play("open").stop();
                openKey.onDown.addOnce(function () {
                    _this.fsm.go(2 /* Opening */);
                }, _this);
                lockKey.onDown.addOnce(function () {
                    _this.fsm.go(0 /* Locked */);
                }, _this);
            }).onExit(1 /* Closed */, function (to) {
                openKey.onDown.removeAll();
                lockKey.onDown.removeAll();
                return true;
            });

            this.fsm.on(2 /* Opening */, function (from) {
                _this.play("open").onComplete.addOnce(function () {
                    _this.fsm.go(3 /* Open */);
                }, _this);
            });

            var closeKey = game.input.keyboard.addKey(Phaser.Keyboard.C);
            this.fsm.on(3 /* Open */, function (from) {
                _this.play("close").stop();
                closeKey.onDown.addOnce(function () {
                    _this.fsm.go(4 /* Closing */);
                }, _this);
            }).onExit(3 /* Open */, function (to) {
                closeKey.onDown.removeAll();
                return true;
            });

            this.fsm.on(4 /* Closing */, function (from) {
                _this.play("close").onComplete.addOnce(function () {
                    _this.fsm.go(1 /* Closed */);
                }, _this);
            });

            game.add.existing(this);

            this.fsm.go(0 /* Locked */);
        }
        Chest.preload = function (game, imagePath, xmlPath) {
            game.load.atlasXML(Chest.key, imagePath, xmlPath);
        };

        Chest.prototype.fixPivot = function () {
            if (this.animations.currentAnim) {
                this.pivot.x = this.animations.currentAnim.currentFrame.spriteSourceSizeW / 2;
                this.pivot.y = this.animations.currentAnim.currentFrame.spriteSourceSizeH / 2;
            }
        };
        Chest.key = "Chest";
        return Chest;
    })(Phaser.Sprite);
    exports.Chest = Chest;
});
//# sourceMappingURL=Items.js.map
