// Generates build/icon.png and build/icon.ico with zero dependencies.
// Draws a Modrinth-green rounded tile with a white download arrow.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const SIZE = 256;
const SS = 4; // supersampling factor for anti-aliasing
const W = SIZE * SS;

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(rgba, w, h) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function makeICO(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // ICO
  header.writeUInt16LE(1, 4); // one image
  const entry = Buffer.alloc(16);
  entry[0] = 0; // width 256
  entry[1] = 0; // height 256
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(6 + 16, 12);
  return Buffer.concat([header, entry, png]);
}

// --- geometry: isometric cube + white download chevron -------------------
const TOP = [[128, 42], [218, 94], [128, 146], [38, 94]];
const LEFT = [[38, 94], [128, 146], [128, 242], [38, 190]];
const RIGHT = [[218, 94], [128, 146], [128, 242], [218, 190]];
const COL_TOP = [66, 230, 134];
const COL_LEFT = [27, 217, 106];
const COL_RIGHT = [15, 170, 79];

function pointInPoly(px, py, pts) {
  let inside = false;
  for (let a = 0, b = pts.length - 1; a < pts.length; b = a++) {
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    if ((ay > py) !== (by > py) && px < ((bx - ax) * (py - ay)) / (by - ay) + ax) inside = !inside;
  }
  return inside;
}

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function inChevron(x, y) {
  const w = 7;
  return (
    segDist(x, y, 102, 152, 128, 182) <= w ||
    segDist(x, y, 128, 182, 154, 152) <= w ||
    (y >= 196 && y <= 208 && x >= 98 && x <= 158)
  );
}

function render() {
  const hi = new Float64Array(W * W * 4);
  for (let j = 0; j < W; j++) {
    for (let i = 0; i < W; i++) {
      const x = (i + 0.5) / SS;
      const y = (j + 0.5) / SS;
      let r = 0, g = 0, b = 0, a = 0;
      let face = null;
      if (pointInPoly(x, y, TOP)) face = COL_TOP;
      else if (pointInPoly(x, y, LEFT)) face = COL_LEFT;
      else if (pointInPoly(x, y, RIGHT)) face = COL_RIGHT;
      if (face) {
        a = 255;
        if (inChevron(x, y)) {
          r = 255; g = 255; b = 255;
        } else {
          r = face[0]; g = face[1]; b = face[2];
        }
      }
      const o = (j * W + i) * 4;
      hi[o] = r; hi[o + 1] = g; hi[o + 2] = b; hi[o + 3] = a;
    }
  }
  const out = Buffer.alloc(SIZE * SIZE * 4);
  const n = SS * SS;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let j = 0; j < SS; j++) {
        for (let i = 0; i < SS; i++) {
          const o = ((y * SS + j) * W + (x * SS + i)) * 4;
          r += hi[o]; g += hi[o + 1]; b += hi[o + 2]; a += hi[o + 3];
        }
      }
      const o = (y * SIZE + x) * 4;
      out[o] = Math.round(r / n);
      out[o + 1] = Math.round(g / n);
      out[o + 2] = Math.round(b / n);
      out[o + 3] = Math.round(a / n);
    }
  }
  return out;
}

const buildDir = path.join(__dirname, '..', 'build');
fs.mkdirSync(buildDir, { recursive: true });
const png = encodePNG(render(), SIZE, SIZE);
fs.writeFileSync(path.join(buildDir, 'icon.png'), png);
fs.writeFileSync(path.join(buildDir, 'icon.ico'), makeICO(png));
console.log('Wrote build/icon.png (' + png.length + ' bytes) and build/icon.ico');
