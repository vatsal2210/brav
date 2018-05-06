
var prod = function () {
    let stripeTest = {
        key: 'pk_test_jvHFK1rRq0u4Bj2BejCL7ngi'
    };
    let stripeProd = {
        key: 'pk_live_QfCvZ1EvtEeqWc0hvNitUEwb'
    };
    this.config = {
        signallingPort: 1339, // 1339 is open for prod communication
        stripe: false ? stripeTest : stripeProd,
    }
    this.getPortForSignallingServer = function () {
        return this.config.signallingPort;
    }
    this.getStripeKey = function () {
        return this.config.stripe.key;
    }
    this.PLATFORM_USAGE_FEES = 0;
}

var dev = function () {
    let stripeTest = {
        key: 'pk_test_jvHFK1rRq0u4Bj2BejCL7ngi'
    };
    let stripeProd = {
        key: 'pk_live_QfCvZ1EvtEeqWc0hvNitUEwb'
    };
    this.config = {
        signallingPort: 1338,
        stripe: true ? stripeTest : stripeProd,
    }
    this.getPortForSignallingServer = function () {
        return this.config.signallingPort;
    }
    this.getStripeKey = function () {
        return this.config.stripe.key;
    }
    this.PLATFORM_USAGE_FEES = 0;
}

bravAuthModule.service('bravConfig', dev);
