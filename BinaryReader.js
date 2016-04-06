var SmartBuffer = require('smart-buffer')

var BinaryReader = function(data) {
	if (data instanceof Buffer) {
		this.data = new SmartBuffer(data)
	} else {
		throw new Exception()
	}
}

BinaryReader.prototype.readInt8 = function() {
	if(this.data._readOffset + 1 > this.data.length) {
		return 0
	}

	return this.data.readInt8()
}

BinaryReader.prototype.readUInt8 = function() {
	if(this.data._readOffset + 1 > this.data.length) {
		return 0
	}

	return this.data.readUInt8()
}

BinaryReader.prototype.readInt16LE = function() {
	if(this.data._readOffset + 2 > this.data.length) {
		return 0
	}

	return this.data.readInt16LE()
}

BinaryReader.prototype.readUInt16LE = function() {
	if(this.data._readOffset + 2 > this.data.length) {
		return 0
	}

	return this.data.readUInt16LE()
}

BinaryReader.prototype.readInt32LE = function() {
	if(this.data._readOffset + 4 > this.data.length) {
		return 0
	}

	return this.data.readInt32LE()
}

BinaryReader.prototype.readUInt32LE = function() {
	if(this.data._readOffset + 4 > this.data.length) {
		return 0
	}

	return this.data.readUInt32LE()
}

BinaryReader.prototype.readFloatLE = function() {
	if(this.data._readOffset + 4 > this.data.length) {
		return 0
	}

	return this.data.readFloatLE()
}

BinaryReader.prototype.readString = function(length) {
	return this.data.readString(length)
}

BinaryReader.prototype.readStringNT = function(encoding, encoding2) {
	if(typeof encoding === 'number') {
		var previous_length = this.data._readOffset

		var data = this.data.readStringNT(encoding2)

		var current_length = this.data._readOffset

		var amount = encoding - (current_length - previous_length)

		if(amount != 0) {
			this.data.skip(amount)
		}

		return data
	}

	return this.data.readStringNT(encoding)
}

BinaryReader.prototype.readBuffer = function(length) {
	return this.data.readBuffer(length)
}

BinaryReader.prototype.readRemaining = function() {
	return this.data.readBuffer(this.data.remaining())
}

BinaryReader.prototype.rewind = function(value) {
	if(this.data._readOffset - value < 0) {
		return
	}

	this.data.rewind(value)
}

BinaryReader.prototype.skip = function(value) {
	if(this.data._readOffset + value > this.data.length) {
		return
	}

	this.data.skip(value)
}


module.exports = BinaryReader