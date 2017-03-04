require.config({
    baseUrl: '/' + location.pathname.split('/')[1],
    paths: {
        "ecp": "src",
        //严重缺陷：requirejs限定一个文件(目录)只能对应一个ID，导致项目中必须使用base加载依赖资源
        "base": "demo/libs",
        "text": "demo/libs/requirejs/text",
        "i18n": "demo/libs/requirejs/i18n",
        "dojo": "demo/libs/dojo"
    },
    shim: {

    },
    packages: [
        /**
         * {name: "module-name", location: 'path', main: 'file name'}
         */
    ]
});