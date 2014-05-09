/// <reference path="../../def/require.d.ts" />
require.config({
    baseUrl: "./ts",
    paths: {
        lib: "../../lib"
    }
});

require(["AppMain"], function (AppMain) {
    var appMain = new AppMain();
    appMain.run();
});
//# sourceMappingURL=AppConfig.js.map
