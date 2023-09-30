const azure = require('azure-storage');
const dotenv = require("dotenv")
const CONSTANT = require("../common/constant");
const COMMON = require("../common/common");
const fs = require("fs");
const path = require("path");
dotenv.config()
const storageAccount = process.env.AZURE_STORAGE_ACCOUNT;
const storageAccessKey = process.env.AZURE_STORAGE_ACCESS_KEY;
const containerName = process.env.CONTAINER_NAME;
const blobService = azure.createBlobService(storageAccount, storageAccessKey);

exports.uploadImage = _uploadImage;
exports.getAllImageList = _getAllImageList;

function _uploadImage(req, res) {
    try {
        const folder = CONSTANT.UPLOAD_IMAGE_PATH;
        COMMON.uploadImageFunction(folder, req, res, async (err, files) => {
            if (err && files && files.length <= 0) {
                return res.status(400).send({
                    message: err.message || CONSTANT.MESSAGE.IMAGE_NOT_UPLOAD,
                });
            } else {
              let imageFilePath = CONSTANT.UPLOAD_IMAGE_PATH + "/" + files[0]['filename'];
              blobService.createBlockBlobFromLocalFile(containerName, files[0]['filename'], imageFilePath, (error, result, response) => {
                  if (error) {
                    fs.unlink(path.resolve(CONSTANT.UPLOAD_IMAGE_PATH) + "/" + files[0]['filename'], (err) => {
                      return res.status(400).send({
                        message: CONSTANT.MESSAGE.IMAGE_NOT_UPLOAD,
                 
                        error: error
                      });
                  });
              } else {
















             
                        const imageUrl = blobService.getUrl(containerName, files[0]['filename']);

                        console.log(path.resolve(CONSTANT.UPLOAD_IMAGE_PATH) + "/" + files[0]['filename'])
                        fs.unlink(path.resolve(CONSTANT.UPLOAD_IMAGE_PATH) + "/" + files[0]['filename'], (err) => {
                            return res.status(200).send({
                                message: CONSTANT.MESSAGE.IMAGE_UPLOADED,
                                imageUrl: imageUrl
                            });




                            
                        });
                    }
                });
            }
          }
        );
      } catch (err) {
        return res.status(404).send({
          message: err.message || CONSTANT.MESSAGE.ERROR_OCCURRED,
        });
      }
}

function _getAllImageList(req, res) {
    try {
        blobService.listBlobsSegmented(containerName, null, (error, result, response) => {
          if (error) {
            return res.status(400).send({
                message: CONSTANT.MESSAGE.IMAGES_NOT_FOUND,
                error: error
            });
          } else {
            const images = result.entries.map(entry => {
              return {
                name: entry.name,
                url: blobService.getUrl(containerName, entry.name),
              };
            });
            return res.status(200).send({
                message: CONSTANT.MESSAGE.IMAGES_FOUND,
                images: images
            });
          }
        });
    } catch (err) {
        return res.status(404).send({
          message: err.message || CONSTANT.MESSAGE.ERROR_OCCURRED,
        });
    }
}


