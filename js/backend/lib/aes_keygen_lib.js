const { writeFile } = require('fs');

const crypto = require('crypto');

module.exports = {
    // Returns false for any error, or true otherwise
    gen: function(location = null) {
        if (!location) return false;
        writeFile(location, crypto.randomBytes(32).toString('base64'), function(err) {
            if (err) console.error(err);
            return !!err;
        })
    }
};