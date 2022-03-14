function getExtension(filename) {
  let parts = filename.split('.');
  return parts[parts.length - 1];
}

function IsImage(filename) {
  let ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
    case 'jpeg':
      //etc
      return true;
  }
  return false;
}

function IsVideo(filename) {
  let ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      // etc
      return true;
  }
  return false;
}

function IsPdf(filename) {
  let ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'pdf':
      return true;
  }
  return false;
}


export {IsImage, IsVideo, IsPdf}
