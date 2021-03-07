export default function cu() {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return Math.random() > 0.5 ?
      (c === 'x' ?
        r :
        (r & 0x3 | 0x8))
        .toString(16) :
      (c === 'x' ?
        r :
        (r & 0x3 | 0x8))
        .toString(16)
        .toUpperCase();
  });
}