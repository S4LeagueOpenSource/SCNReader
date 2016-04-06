var fs = require('fs')

var async = require('async')

var Logger = require('./Utils/Logger')

var Config = require('./Config')
var SCNParser = require('./SCNParser')

var log = new Logger('SCNReader', true)

var files

log.info('SCNReader started')

async.series({
	loadDirFromSourcePath: function(callback) {
		log.debug('Check if the Source Path "' + Config.sourceFolder + '" exists.')

		fs.readdir(Config.sourceFolder, function(err, result) {
			if(err) {
				if(err.code === 'ENOENT') {
					return callback('Please create the folder "' + Config.sourceFolder + '".', null)
				} else {
					return callback(err, null)
				}
			}

			files = result

			log.info(files.length + ' files found.')

			callback(null, null)
		})
	},
	loadFilesFromSourcePath: function(callback) {
		if(files.length === 0) {
			return callback()
		}

		log.debug('Starting to load files...')

		async.mapSeries(files, function(file, callback) {
			fs.readFile(Config.sourceFolder + '/' + file, function (err, data) {
				if(err) {

				}

				log.debug('File Name: ' + file)

				var scnParser = new SCNParser(data)
				scnParser.parse()
			})

			callback()
		},
		function() {
			callback(null, null)
		})
	}
}, function(err) {
	if(err) {
		log.error(err)
		process.exit()
	}
})