/// <reference path="../../def/require.d.ts" />

require.config({
	baseUrl: "./ts",
	paths: {
		lib: "../../lib"
	}
});

require(
	["AppMain"],
	(AppMain) => {
		var appMain = new AppMain();
		appMain.run();
	}
);