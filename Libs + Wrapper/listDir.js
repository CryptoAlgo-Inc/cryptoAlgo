var glob = require("glob")

module.exports = {
    auto: function(decryption = true) {
        const file_list = glob.sync('*.*');
        for(var index = 0; index < file_list.length; index ++) {
            const filename = file_list[index]
            if(filename.includes('encrypted')) {  // Most likely a encrypted file
                if(decryption) {
                    console.log('\x1b[35m ' + (index + 1) + '. ' + filename + '\x1b[0m');  // Make the colour red to attract attention
                }
                else {
                    console.log('\x1b[1;30m ' + (index + 1) + '. ' + filename + '\x1b[0m'); // Make encrypted files grey if operating in encryption mode
                }
            }
            else {
                if(decryption) {
                    console.log('\x1b[1;30m ' + (index + 1) + '. ' + filename + '\x1b[0m'); // Make text grey
                }
                else {
                    console.log('\x1b[35m ' + (index + 1) + '. ' + filename + '\x1b[0m');   // Make text purple if operating in encryption mode
                }
            }
        }
        return file_list;
    }
}