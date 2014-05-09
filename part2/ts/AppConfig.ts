/// <reference path="../../def/require.d.ts" />

require.config({
	baseUrl: "./ts",
	paths: {
		lib: "../../lib"
	}
});

require(
	["AppMain","lib/phaser.min"],
	(AppMain,Phaser) => {
		var appMain = new AppMain();
		appMain.run();
	}
);