/// <reference path="../../def/require.d.ts" />
require.config({
    paths: {
        "phaser": "../lib/phaser"
    }
});

require(["ts/AppMain", "phaser"], function (AppMain, Phaser) {
    var appMain = new AppMain();
    appMain.run();
});
//# sourceMappingURL=AppConfig.js.map
