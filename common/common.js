var multer = require("multer");
const path = require("path");

exports.uploadImageFunction = _uploadImageFunction;

function _uploadImageFunction(folder, req, res, callback) {
    var files = [];
    var file_name;
    var fileType = "";
    var storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, folder);
      },
      filename: (req, file, cb) => {
        fileType = path.extname(file.originalname);
        var date = new Date().getTime();
        file_name = date + path.extname(file.originalname);
        cb(null, file_name);
        files.push({
          filename: file_name,
          timestamp: date,
          extension: path.extname(file.originalname),
          originalname: file.originalname,
        });
      },
    });
    var upload = multer({ storage: storage }).fields([
      { name: "image" },
    ]);
  
    
    upload(req, res, (err, i) => {
      if (err) {
        callback(err, []);
      } else {
        var res_files = [];
        res_files.push(files);
        callback(null, files);
      }
    });
  }