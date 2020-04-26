var util;
(function (util) {
    function generateUniqueId() {
        return random4HexChars() + random4HexChars() + random4HexChars() + random4HexChars();
    }
    util.generateUniqueId = generateUniqueId;
    function random4HexChars() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
})(util || (util = {}));
