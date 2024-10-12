export class CanvasLite {
	constructor(width, height){
		this._width = width;
        this._height = height;
        this.depth = 8;
        this.channels = 1;

		this.cur_x = 0;
		this.cur_y = 0;
		this._reinit()
	}

	_reinit() {
		this.data = new Uint8Array(this._width*this._height);
        for(let i = 0; i < this._width*this._height; i++) {
            this.data[i] = 255;
        }
		console.log("WARN reinit")
	}

	static rotate90(source) {
		const dest = new CanvasLite(source.height, source.width);

		for(let x = 0; x < source.width; x++) {
			for(let y = 0; y < source.height; y++) {
				const v = source._getPixel(x, y);
				dest._putPixel(y, x, v);
			}
		}

		return dest;
	}

	static scale(source) {
		const newCanvas = new CanvasLite(source.width * 2, source.height * 2);
        
        for(let x = 0; x < source.width; x++) {
          for(let y = 0; y < source.height; y++) {
            const val = source._getPixel(x, y);
            newCanvas.fillStyle = val == 0 ? "#000000" : "#ffffff";
            newCanvas.fillRect(x * 2, y * 2, 2, 2);
          }
        }

        return newCanvas;
	}

	_getPixel(x, y) {
		return this.data[y * this._width + x]
	}

	_putPixel(x, y, v) {
		this.data[y * this._width + x] = v
	}

	getContext() {
		return this; // JS canvas compatibility
	}

	save() {}
	clearRect(x, y, w, h) {
		// console.log(`clearRect ${x} ${y} ${w} ${h}`)
		for(let i = this.cur_x + x; i < this.cur_x + x + w; i++) {
			for(let j = this.cur_y + y; j < this.cur_y + y + h; j++) {
				this.data[j * this._width + i] = 0;
			}
		}
	}

	fillRect(x, y, w, h) {
		// console.log(`fillRect ${x} ${y} ${w} ${h} ${this.fillStyle}`)
		for(let i = this.cur_x + x; i < this.cur_x + x + w; i++) {
			for(let j = this.cur_y + y; j < this.cur_y + y + h; j++) {
				this.data[j * this.width + i] = this.fillStyle === "#000000" ? 0 : 255;
			}
		}
	}

	translate(x, y) {
		// console.log(`translate ${x} ${y}`)
		this.cur_x = x;
		this.cur_y = y;
	}
	restore() {
		// console.log("restore")
		this.cur_x = 0;
		this.cur_y = 0;
	}

	get width() {
		return this._width;
	}

	set width(v) {
		this._width = v;
		this._reinit();
	}

	get height() {
		return this._height;
	}

	set height(v) {
		this._height = v;
		this._reinit();
	}
}