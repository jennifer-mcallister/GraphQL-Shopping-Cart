const fsPromises = require('fs/promises')

exports.readFile = async (filePath) => await fsPromises.readFile(filePath)

exports.fileExists = async (filePath) => !!(await fsPromises.stat(filePath).catch((e) => false))

exports.deleteFile = async (filePath) => await fsPromises.unlink(filePath)

exports.getDirectoryFileNames = async (directoryPath) => await fsPromises.readdir(directoryPath)