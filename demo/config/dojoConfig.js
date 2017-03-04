var package_path = location.origin + '/' + location.pathname.split('/')[1];
var dojoConfig = {
    parseOnLoad: true,
    packages: [{
        name: "ecp",
        location: package_path + '/src'
    }, {
        name: "base",
        location: package_path + 'demo/libs'
    }],
    map: {
        // Instead of having to type "dojo/text", we just want "text" instead
        "*": {
            text: "dojo/text",
            i18n: "dojo/i18n"
        }
    }
};