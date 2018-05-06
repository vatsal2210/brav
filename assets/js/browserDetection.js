var get_browser = function() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}
var curr_browser = get_browser();
if (curr_browser.name && curr_browser.version && curr_browser.name == "Chrome" && !isNaN(curr_browser.version) && (Number(curr_browser.version) >= 56)) {
    // continue
    delete curr_browser;
    delete get_browser;
} else {
    if (confirm("This browser is not the Best for using our services. \nWe recommend using Chrome's latest version (above Chrome 56), \n\n We suggest you open https://one.brav.org in Chrome browser. \n\nDo you want to get Chrome for this device now? ( Clicking OK will take you to this link https://www.google.com/chrome/)")) { // Save it!
        window.location = "https://www.google.com/chrome/";
    } else {
        // Do nothing!
    }
}