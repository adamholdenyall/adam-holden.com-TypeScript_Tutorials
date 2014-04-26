/// <reference path="../../def/require.d.ts" />

require.config({
	paths: {
		"phaser": "../lib/phaser"
	}
});

require(
	["ts/AppMain","phaser"],
	(AppMain,Phaser) => {
		var appMain = new AppMain();
		appMain.run();
	}
);
