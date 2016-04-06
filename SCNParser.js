var Logger = require('./Utils/Logger')

var ScnID = require('./Constants/ScnID')
var ScnVersion = require('./Constants/ScnVersion')

var BinaryReader = require('./BinaryReader')

var log = new Logger('SCNParser', true)

function parseRoot(self) {
	log.debug('--- ROOT START ---')

	var header = parseObjectHeader(self)

	self.objectCount = self.data.readUInt32LE()
	log.debug('Object Count: ' + self.objectCount)

	if(header.version === 2) {
		self.data.readStringNT() // unk, but added in version 2...
	}

	log.debug('--- ROOT END ---')

	parseObjects(self)
}

function parseObjects(self) {
	for (var i = 0; i < self.objectCount; i++) {
		var id = self.data.readUInt32LE()
		//log.debug('Object ID: ' + id)

		if(id === ScnID.Bonesystem) {
			parseBonesystem(self)
		} else if(id === ScnID.Bone) {
			parseBone(self)
		} else if(id === ScnID.Mesh) {
			parseMesh(self)
		} else {
			log.warning('Unknown Object ID: ' + id)
			return
		}

		//if(i === 3) {
		//	return
		//}
	}
}

function parseBonesystem(self) {
	log.debug('--- BONESYSTEM START ---')

	parseObjectHeader(self)

	log.debug('--- BONESYSTEM END ---')
}

function parseBone(self) {
	log.debug('--- BONE START ---')

	var header = parseObjectHeader(self)

	var animationCount = self.data.readUInt32LE()
	log.debug('Animation Count: ' + animationCount)

	parseBoneAnimation(self, animationCount)

	log.debug('--- BONE END ---')
}

function parseBoneAnimation(self, animationCount) {
	for (var i = 0; i < animationCount; i++) {
		log.debug('--- ANIMATION START ---')

		var animationName = self.data.readStringNT()
		log.debug('Animation Name: ' + animationName)

		//var animationCopy = self.data.readStringNT()
		//log.debug('Animation Copy: ' + animationCopy)

		var animationTickTime = self.data.readUInt32LE()
		log.debug('Animation Tick Time: ' + animationTickTime)

		var flag = self.data.readUInt8() // unknown Flag
		log.debug('Flag: ' + flag)

		var initialTranslation1 = self.data.readFloatLE()
		var initialTranslation2 = self.data.readFloatLE()
		var initialTranslation3 = self.data.readFloatLE()

		log.debug('Initial Translation 1: ' + initialTranslation1)
		log.debug('Initial Translation 2: ' + initialTranslation2)
		log.debug('Initial Translation 3: ' + initialTranslation3)

		var initialRotation1 = self.data.readFloatLE()
		var initialRotation2 = self.data.readFloatLE()
		var initialRotation3 = self.data.readFloatLE()
		var initialRotation4 = self.data.readFloatLE()

		log.debug('Initial Rotation 1: ' + initialRotation1)
		log.debug('Initial Rotation 2: ' + initialRotation2)
		log.debug('Initial Rotation 3: ' + initialRotation3)
		log.debug('Initial Rotation 4: ' + initialRotation4)

		var initialScale1 = self.data.readFloatLE()
		var initialScale2 = self.data.readFloatLE()
		var initialScale3 = self.data.readFloatLE()

		log.debug('Initial Scale 1: ' + initialScale1)
		log.debug('Initial Scale 2: ' + initialScale2)
		log.debug('Initial Scale 3: ' + initialScale3)

		var transitionAnimationCount = self.data.readUInt32LE()
		log.debug('Transition Animation Count: ' + transitionAnimationCount)
		for (var iAnimationTransition = 0; iAnimationTransition < transitionAnimationCount; iAnimationTransition++) {
			// TODO
		}

		var rotateAnimationCount = self.data.readUInt32LE()
		log.debug('Rotate Animation Count: ' + rotateAnimationCount)
		for (var iAnimationRotate = 0; iAnimationRotate < rotateAnimationCount; iAnimationRotate++) {
			// TODO
		}

		var scaleAnimationCount = self.data.readUInt32LE()
		log.debug('Scale Animation Count: ' + scaleAnimationCount)
		for (var iAnimationScale = 0; iAnimationScale < scaleAnimationCount; iAnimationScale++) {
			// TODO
		}

		var visibilityAnimationCount = self.data.readUInt32LE()
		log.debug('Visibility Animation Count: ' + visibilityAnimationCount)
		for (var iAnimationVisibility = 0; iAnimationScale < visibilityAnimationCount; iAnimationVisibility++) {
			// TODO
		}

		log.debug('--- ANIMATION END ---')
	}
}

function parseMesh(self) {
	log.debug('--- MESH ---')

	//console.log(self.data.data._readOffset)
	var header = parseObjectHeader(self)

	var int1 = self.data.readUInt32LE()
	var float1 = self.data.readFloatLE()

	log.debug('Int1: ' + int1)
	log.debug('Float1: ' + float1)

	var extraUV = self.data.readUInt32LE()
	log.debug('Extra UV: ' + extraUV)

	// TEXTURE
	var textureCount = self.data.readUInt32LE()
	log.debug('Texture Count: ' + textureCount)
	for (var i = 0; i < textureCount; i++) {
		var textureName = self.data.readString(128)
		log.debug('Texture Name: ' + textureName)

		var faceStart = self.data.readUInt32LE()
		log.debug('Face Start: ' + faceStart)

		var faceCount = self.data.readUInt32LE()
		log.debug('Face Count: ' + faceCount)
	}

	// VERTEX
	var vertexCount = self.data.readUInt32LE()
	log.debug('Vertex Count: ' + vertexCount)
	for (var i = 0; i < vertexCount; i++) {
		var vertex_x = self.data.readFloatLE()
		var vertex_y = self.data.readFloatLE()
		var vertex_z = self.data.readFloatLE()

		log.debug('Vertex X: ' + vertex_x)
		log.debug('Vertex Y: ' + vertex_y)
		log.debug('Vertex Z: ' + vertex_z)
	}

	// FACE
	var faceCount = self.data.readUInt32LE()
	log.debug('Face Count: ' + faceCount)
	for (var i = 0; i < faceCount; i++) {
		// word[3]
		var face_x = self.data.readUInt16LE()
		var face_y = self.data.readUInt16LE()
		var face_z = self.data.readUInt16LE()

		log.debug('Face X: ' + face_x)
		log.debug('Face Y: ' + face_y)
		log.debug('Face Z: ' + face_z)
	}

	// NORMAL
	var normalCount = self.data.readUInt32LE()
	log.debug('Normal Count: ' + normalCount)
	for (var i = 0; i < normalCount; i++) {
		var normal_x = self.data.readFloatLE()
		var normal_y = self.data.readFloatLE()
		var normal_z = self.data.readFloatLE()

		log.debug('Normal X: ' + normal_x)
		log.debug('Normal Y: ' + normal_y)
		log.debug('Normal Z: ' + normal_z)
	}

	// UV
	var uvCount = self.data.readUInt32LE()
	log.debug('UV Count: ' + uvCount)
	for (var i = 0; i < uvCount; i++) {
		var uv_u = self.data.readFloatLE()
		var uv_v = self.data.readFloatLE()

		log.debug('UV U: ' + uv_u)
		log.debug('UV V: ' + uv_v)
	}

	// TANGENT
	var tangentCount = self.data.readUInt32LE()
	log.debug('Tangent Count: ' + tangentCount)
	for (var i = 0; i < tangentCount; i++) {
		var tangent_x = self.data.readFloatLE()
		var tangent_y = self.data.readFloatLE()
		var tangent_z = self.data.readFloatLE()

		log.debug('Tangent X: ' + tangent_x)
		log.debug('Tangent Y: ' + tangent_y)
		log.debug('Tangent Z: ' + tangent_z)
	}

	log.debug('--- SKIN START ---')

	var skinBoneCount = self.data.readUInt32LE()
	log.debug('Skin Bone Count: ' + skinBoneCount)
	for (var i = 0; i < skinBoneCount; i++) {
		//log.debug('--- SKIN BONE ---')

		var skinBoneName = self.data.readStringNT()
		log.debug('Skin Bone Name: ' + skinBoneName)

		self.data.skip(68) // or 16 x readFloatLE() ... But not needed ;o // Inverse Matrix

		var skinDataCount = self.data.readUInt32LE()
		log.debug('Skin Data Count: ' + skinDataCount)

		for (var iSkinData = 0; iSkinData < skinDataCount; iSkinData++) {
			//log.debug('--- SKIN DATA ---')

			var vertexIndex = self.data.readUInt32LE()
			//log.debug('Vertex Index: ' + vertexIndex)

			var weight = self.data.readFloatLE()
			//log.debug('Weight: ' + weight)
		}
	}

	log.debug('--- SKIN END ---')

	// ANIMATION
	var animationCount = self.data.readUInt32LE()
	log.debug('Animation Count: ' + animationCount)
	for (var i = 0; i < animationCount; i++) {
		log.debug('--- ANIMATION ---')

		var animationName = self.data.readStringNT()
		log.debug('Animation Name: ' + animationName)

		//var animationCopy = self.data.readUInt8() // ?
		//log.debug('Animation Copy: ' + animationCopy)

		var animationTickTime = self.data.readUInt32LE()
		log.debug('Animation Tick Time: ' + animationTickTime)

		self.data.readUInt8() // unknown Flag

		var initialTranslation1 = self.data.readFloatLE()
		var initialTranslation2 = self.data.readFloatLE()
		var initialTranslation3 = self.data.readFloatLE()

		log.debug('Initial Translation 1: ' + initialTranslation1)
		log.debug('Initial Translation 2: ' + initialTranslation2)
		log.debug('Initial Translation 3: ' + initialTranslation3)

		var initialRotation1 = self.data.readFloatLE()
		var initialRotation2 = self.data.readFloatLE()
		var initialRotation3 = self.data.readFloatLE()
		var initialRotation4 = self.data.readFloatLE()

		log.debug('Initial Rotation 1: ' + initialRotation1)
		log.debug('Initial Rotation 2: ' + initialRotation2)
		log.debug('Initial Rotation 3: ' + initialRotation3)
		log.debug('Initial Rotation 4: ' + initialRotation4)

		var initialScale1 = self.data.readFloatLE()
		var initialScale2 = self.data.readFloatLE()
		var initialScale3 = self.data.readFloatLE()

		log.debug('Initial Scale 1: ' + initialScale1)
		log.debug('Initial Scale 2: ' + initialScale2)
		log.debug('Initial Scale 3: ' + initialScale3)

		var transitionAnimationCount = self.data.readUInt32LE()
		log.debug('Transition Animation Count: ' + transitionAnimationCount)

		for (var iAnimationTransition = 0; iAnimationTransition < transitionAnimationCount; iAnimationTransition++) {

		}

		var rotateAnimationCount = self.data.readUInt32LE()
		log.debug('Rotate Animation Count: ' + rotateAnimationCount)

		for (var iAnimationRotate = 0; iAnimationRotate < rotateAnimationCount; iAnimationRotate++) {

		}

		var scaleAnimationCount = self.data.readUInt32LE()
		log.debug('Scale Animation Count: ' + scaleAnimationCount)

		for (var iAnimationScale = 0; iAnimationScale < scaleAnimationCount; iAnimationScale++) {

		}

		var visibilityAnimationCount = self.data.readUInt32LE()
		log.debug('Visibility Animation Count: ' + visibilityAnimationCount)

		for (var iAnimationVisibility = 0; iAnimationScale < visibilityAnimationCount; iAnimationVisibility++) {

		}

		var morphAnimationCount = self.data.readUInt32LE()
		log.debug('Morph Animation Count: ' + morphAnimationCount)

		for (var iAnimationMorph = 0; iAnimationMorph < morphAnimationCount; iAnimationMorph++) {

		}
	}

	console.log(self.data.readBuffer(2000).toString('hex'))

	log.debug('--- MESH END ---')
}

function parseObjectHeader(self) {
	log.debug('--- OBJECT HEADER START ---')

	var objectName = self.data.readStringNT()
	log.debug('Object Name: ' + objectName)

	var parentName = self.data.readStringNT()
	log.debug('Parent Name: ' + parentName)

	self.data.skip(68) // or 16 x readFloatLE() ... But not needed ;o

	var version = self.data.readUInt32LE() // ??

	if(version === ScnVersion.Version1) {
		version = 1
	} else if(version === ScnVersion.Version2) {
		version = 2
	} else {
		log.error('Unknown Object Version. ' + version)
		return
	}

	log.debug('Object Version: ' + version)

	log.debug('--- OBJECT HEADER END ---')

	return {
		version: version
	}
}

var SCNParser = function(data) {
	if (data instanceof Buffer) {
		this.data = new BinaryReader(data)
	} else {
		throw new Exception()
	}

	this.version = 0
	this.objectCount = 0
}

SCNParser.prototype.parse = function() {
	this.version = this.data.readUInt32LE()

	log.debug('SCN Version: ' + this.version)

	var id = this.data.readUInt32LE()
	if(id !== ScnID.Root) {
		log.error('This is no SCN File from S4 League.')
		return
	}

	parseRoot(this)
}

module.exports = SCNParser