var gm = require('gm');
// var fs = require('fs');
var outfile = "output.gif";
// var infile = fs.createReadStream('1.jpg');

function ModifyAndUpload (imgPath, img, savePath, callback) {
	console.log('\nModifyAndUpload', imgPath, img, savePath)
	var newFilename = img.slice(0, -4) + '.gif'

	modifyImage(process.cwd() + imgPath + img, process.cwd() + savePath + newFilename, function() {
		//TODO move out
		callback('/img/' + newFilename);
	});
}

function modifyImage (originalImagePath, newThumbPath, callback) {
	console.log('\nmodifyImage', originalImagePath, newThumbPath)
	gm(originalImagePath)
		.filter('Box')
		.resize(96)
		.bitdepth(2)
		.colors(8)
		.resize(480, 480, '!')
		.write(newThumbPath, function(err) {
			console.log('modifyImage', err)
			if (callback && typeof(callback) === 'function') {
				callback(err);
			}
		});
}

module.exports = ModifyAndUpload;