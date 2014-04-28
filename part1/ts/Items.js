/// <reference path="../../def/phaser.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Star = (function (_super) {
        __extends(Star, _super);
        function Star(game, x, y) {
            _super.call(this, game, x, y, "star");
            this.anchor.set(.5, .5);
            game.add.existing(this);
        }
        Star.preload = function (game, path) {
            game.load.image("star", path);
        };

        Star.prototype.update = function () {
            this.angle += 180 * this.game.time.elapsed / 1000;
        };
        return Star;
    })(Phaser.Sprite);
    exports.Star = Star;
});
//# sourceMappingURL=Items.js.map
