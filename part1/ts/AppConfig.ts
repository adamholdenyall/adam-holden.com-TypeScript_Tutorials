/// <reference path="../../def/require.d.ts" />

require.config({
	paths: {
		"AppMain": "ts/AppMain"
	}
});

require(
	["AppMain"],
	(AppMain) => {
		var appMain = new AppMain();
		appMain.run();
	}
);
