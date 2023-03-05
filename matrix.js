// https://scifi.stackexchange.com/a/182823
const matrixCharacters = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:・.\"=*+-<>¦｜╌ ｸ";

class Matrix {
	// #region canvas
	/**
	 * @type {HTMLCanvasElement}
	 */
	#canvas = null;
	/**
	* @type {CanvasRenderingContext2D}
	*/
	#ctx = null;
	/**
	 * @type {HTMLImageElement}
	 */
	#image = null;
	/**
	 * @type {ImageData}
	 */
	#imageData = null;
	// #endregion

	// #region update variables
	/**
	 * @type {number}
	 */
	#cols = 0;
	/**
	 * @param {number[]}
	 */
	#ypos = [];
	// #endregion

	// #region matrix properties
	/**
	 * @type {number}
	 */
	#width = 800;
	/**
	 * @type {number}
	 */
	#height = 600;
	/**
	 * @type {boolean}
	 */
	#fullscreen = false;
	// #endregion

	reset() {
		if (this.#fullscreen) {
			this.#width = this.#canvas.width = window.innerWidth;
			this.#height = this.#canvas.height = window.innerHeight;
		} else {
			this.#canvas.width = this.#canvas.width;
		}
		this.#cols = Math.floor(this.#width / 20) + 1;
		this.#ypos = Array(this.#cols).fill(0);
		this.#width = this.#canvas.width;
		this.#height = this.#canvas.height;
		this.processImage();
	}

	/**
	 * Make image green
	 */
	processImage() {
		let image = this.#image;
		if (image == null) {
			return;
		}
		const canvas = document.createElement('canvas');
		canvas.width = this.#width;
		canvas.height = this.#height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(this.#image, 0, 0, canvas.width, canvas.height);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			imageData.data[i] = 0;
			imageData.data[i + 1] = imageData.data[i + 1];
			imageData.data[i + 2] = 0;
			if (imageData.data[i + 1] == 0) {
				imageData.data[i + 3] = 0;
			}
		}
		this.#imageData = imageData;
	}

	/**
	 * Load the image as Image and set to #image
	 * @param {string} imageUrl 
	 */
	loadImage(imageUrl) {
		// load image
		const image = new Image();
		image.src = imageUrl;
		image.onload = () => {
			this.#image = image;
			this.processImage();
		};
	}

	draw() {
		let ctx = this.#ctx;

		ctx.fillStyle = '#0001';
		ctx.fillRect(0, 0, this.#width, this.#height);

		ctx.fillStyle = '#0f0';
		ctx.font = '15pt monospace';

		this.#ypos.forEach((y, ind) => {
			const text = matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)];
			const x = ind * 20;
			ctx.fillText(text, x, y);
			if (y > 100 + Math.random() * 10000) {
				this.#ypos[ind] = 0;
			} else {
				this.#ypos[ind] = y + 20;
			}
		});

		if (this.#imageData) {
			let matrixImageData = ctx.getImageData(0, 0, this.#width, this.#height);
			for (let i = 0; i < matrixImageData.data.length; i += 4) {
				let mGreen = matrixImageData.data[i + 1];
				let iGreen = this.#imageData.data[i + 1];
				if (mGreen > 0 && iGreen > 0) {
					matrixImageData.data[i + 1] = iGreen;
				}
			}
			ctx.putImageData(matrixImageData, 0, 0);
		}
	}

	/**
	 * @param {HTMLCanvasElement} canvas 
	 * @param {string} imageUrl 
	 */
	constructor(options) {
		this.#fullscreen = options.fullscreen;
		this.#canvas = options.canvas;
		this.#ctx = canvas.getContext('2d');
		if (this.#fullscreen) {
			window.addEventListener('resize', this.reset.bind(this));
		}
		this.loadImage(options.imageUrl);
		this.reset();
		setInterval(this.draw.bind(this), 50);
	}
}

export default Matrix;
