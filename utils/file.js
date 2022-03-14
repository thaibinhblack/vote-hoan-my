export function SaveBlob(blob, fileName) {
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";

  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}
