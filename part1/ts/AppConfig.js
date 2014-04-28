/// <reference path="../../def/require.d.ts" />
require.config({
    paths: {
        "AppMain": "ts/AppMain"
    }
});

require(["AppMain"], function (AppMain) {
    var appMain = new AppMain();
    appMain.run();
});
//# sourceMappingURL=AppConfig.js.map
