const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ ((c >> 1) & 0x7FFFFFFF);
    } else {
      c = (c >> 1) & 0x7FFFFFFF;
    }
  }
  crcTable[n] = c;
}

const initialCrc = 0xffffffff;
function updateCrc(currentCrc, data, offset, length) {
  let c = currentCrc;
  for (let n = 0; n < length; n++) {
    c = crcTable[(c ^ data[offset+n]) & 0xff] ^ (c >>> 8);
  }
  return c ^ initialCrc;
}

function crc(data, offset, length) {
  return updateCrc(initialCrc, data, offset, length);
}

function adler32(data) {
    //console.log("adler len = " + data)
    let s1 = 1;
    let s2 = 0;
    for(let i = 0; i < data.length; i++) {
        s1 = (s1 + data[i]) % 65521;
        s2 = (s1 + s2) % 65521;
    }
    console.log("adler s1 = " + s1)
    console.log("adler s2 = " + s2)
    return (s2 << 16) + s1
}

export class PngEncoder {
    constructor(canvas) {
        this.data = [];
        this.canvas = canvas
    }

    BLOCK_SIZE = 30000

    _encodeSignature() {
        this.data.push(...[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    }

    _encode32(data) {
        this.data.push(...[(data >> 24) & 0xFF, (data >> 16) & 0xFF, (data >> 8) & 0xFF, data & 0xFF])
    }

    _encode16(data) {
        this.data.push(...[(data >> 8) & 0xFF, data & 0xFF])
    }

    _encodeChars(data) {
        for(let i = 0; i < data.length; i++) {
            this.data.push(data.charCodeAt(i))
        }
    }

    _encodeIHDR() {
        this._encode32(13)
        this._encodeChars("IHDR")
        this._encode32(this.canvas.width)
        this._encode32(this.canvas.height)
        this.data.push(this.canvas.depth)
        this.data.push(0) // grayscale
        this.data.push(0) // deflate
        this.data.push(0) // adaptive
        this.data.push(0) // no interlance

        let chk = crc(this.data, this.data.length - 17, 17)
        this._encode32(chk)
    }

    _compress(data) {
        let raw = [];
        let blocks = Math.trunc(data.length / this.BLOCK_SIZE) + 1;
        console.log("full size " + data.length)
        console.log("blocks " + blocks)
        raw.push(...[0x78, 0x01]);
        for(let i = 0; i < blocks; i++) {
            let data_slice = data.slice(i * this.BLOCK_SIZE,(i+1)*this.BLOCK_SIZE);
            let data_length = data_slice.length;
            console.log("> slice " + i + " data len " + data_length)

            if(i + 1 === blocks) {
                raw.push(0b0000_0001); // last block
            } else {
                raw.push(0b0000_0000)
            }
            raw.push(...[data_length & 0xFF, (data_length >> 8) & 0xFF]) // LEN
            let nlen = 0x10000 - data_length - 1;
            raw.push(...[nlen & 0xFF, (nlen >> 8) & 0xFF])
            raw.push(...data_slice)
        }
        let chk = adler32(data);
        console.log("adler = " + chk.toString(16))
        raw.push(...[(chk >> 24) & 0xFF, (chk >> 16) & 0xFF, (chk >> 8) & 0xFF, chk & 0xFF])
        return raw
    }
    _prepare_image() {
        let raw = [];
        for(let i = 0; i < this.canvas.height; i++) {
            raw.push(0)
            for(let j = 0; j < this.canvas.width; j++) {
                raw.push(this.canvas.data[i * this.canvas.width + j])
            }
        }
        return this._compress(raw)
    }
    _encodeIDAT() {
        let payload = this._prepare_image()

        console.log("payload len " + payload.length.toString(16))
        this._encode32(payload.length)
        this._encodeChars("IDAT")
        for(let i = 0; i < payload.length; i++) {
            this.data.push(payload[i])
        }
        let chk = crc(this.data, this.data.length - payload.length - 4, payload.length + 4)
        this._encode32(chk)
    }

    _encodeIEND() {
        this._encode32(0)
        this._encodeChars("IEND")

        let chk = crc(this.data, this.data.length - 4, 4)
        this._encode32(chk)
    }

    encode() {
        this._encodeSignature()
        this._encodeIHDR()
        this._encodeIDAT()
        this._encodeIEND()
        return Uint8Array.from(this.data)
    }
}