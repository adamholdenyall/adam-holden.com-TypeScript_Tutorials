/// <reference path="../../def/require.d.ts" />

require(
	['ts/AppMain'],
	(AppMain) => {
		var appMain = new AppMain();
		appMain.run();
	}
);
