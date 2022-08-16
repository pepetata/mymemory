import { IncomingForm } from "formidable";
import sharp from "sharp";
import fs from "fs";
import MyMemory from "../../../models/mymemory";
// const { dirname } = require('path');
const path = require("path");


export default async function handler(req, res) {
  console.log("/api/mymemory/file  req.body=", req.body);
  // await validateBody(req, res);
  // console.log("/api/mymemory/hide  2 ");

  // const errors = validationResult(req);
  // console.log("/api/mymemory/save  errors=", errors);
  // if (!errors.isEmpty()) {
  //   res.status(200).json({ errors: errors.array() });
  //   return;
  // }
  // await new MyMemory().hide(req.body.id, req.body.user);
  const result = await asyncParse(req);
  console.log('------- result from asyncParse = ', result)
  res.status(200).json({ result });
}

function read(filePath) {
  const readableStream = fs.createReadStream(filePath);

  readableStream.on("error", function (error) {
    console.log(`error: ${error.message}`);
  });

  readableStream.on("data", (chunk) => {
    console.log(chunk);
  });
}

function formatDateYYYYMMDD(date) {
  var h = "00"
    .concat(date.getHours())
    .substr("00".concat(date.getHours()).length - 2, 2);
  var mm = "00"
    .concat(date.getMinutes())
    .substr("00".concat(date.getMinutes()).length - 2, 2);
  var s = "00"
    .concat(date.getSeconds())
    .substr("00".concat(date.getSeconds()).length - 2, 2);
  var d = "00"
    .concat(date.getDate())
    .substr("00".concat(date.getDate()).length - 2, 2);
  var m = "00"
    .concat(date.getMonth() + 1)
    .substr("00".concat(date.getMonth()).length - 2, 2);
  var y = date.getFullYear();
  return y + m + d + h + mm + s;
}

const asyncParse = (req) =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);
      // const appDir = dirname(require.main.filename);
      console.log("asyncParse ", fields, files);

      const fileOK = 'myFile' in files

      if (! fileOK) {
        console.log(' =============================================== file nao ok', files)
        resolve({ error: -1 });
        return;
      }

      // resize the image only if higher than 300px
      const metadata = await sharp(files.myFile.filepath).metadata();
      console.log("metadata", metadata);
      let iWidth = null;
      let iHeight = null;
      if (metadata.height > 300) iHeight = 300;
      else {
        iWidth = metadata.width;
        iHeight = metadata.height;
      }

      // save the file in the tempFiles, it will be deleted when saved
      // there can be no files in the tempFiles if nobody is uploading pictures

      // new name = image format_user id_YYYYMMDDHHMMSS_1 to 3 dig ramdon.image format
      const random = Math.trunc(Math.random() * 1000);
      const returnFileName = `/tempFiles/${metadata.format}_${
        fields.user
      }_${formatDateYYYYMMDD(new Date())}_${random}.${metadata.format}`
      const newFile = `public${path.sep}tempFiles${path.sep}${metadata.format}_${
        fields.user
      }_${formatDateYYYYMMDD(new Date())}_${random}.${metadata.format}`;

      sharp(files.myFile.filepath)
        .resize({ width: iWidth, height: iHeight })
        .toFile(newFile, function (err) {
          console.log("sharp error = ", err);
          fs.unlink(files.myFile.filepath, (err) => {
            if (err) throw err;
            console.log("Rename complete! ======= new file=", returnFileName);
          });
          resolve({ file: returnFileName });
        });
      console.log("fim do sharp");

    });
  });

export const config = {
  api: {
    bodyParser: false,
  },
};
