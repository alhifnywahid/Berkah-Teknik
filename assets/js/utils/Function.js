const $ = (selector) => {
	const elemen = document.querySelectorAll(selector);
	if (elemen.length > 1) {
		return elemen;
	} else {
		return elemen[0];
	}
};

const getURL = (index, params) => {
	const url = [`https://gist.githubusercontent.com/alhifnywahid/9e3f6619f9daf775a9c6ba12144034d4/raw/e307bde340c9593692730b32d2738126c3c4edbf/data.json`, `https://source.unsplash.com/random/${params}`, "https://alamat.thecloudalert.com/api/"];
	return url[index];
};

const getImageGalery = (max, domElement) => {
	const random = ["600x600", "600x800", "800x600", "800x800"];
	let data = "";
	for (let i = 1; i <= max; i++) {
		const x = randomNumber(-1, 3);
		let className = "";
		const url = getURL(1, `${random[x]}/?sig=${randomNumber(1, 100)}&air-conditioner`);
		if (x == 1) {
			className = "photo-item vertical";
		} else if (x == 2) {
			className = "photo-item horizontal";
		} else if (x == 3) {
			className = "photo-item super-big";
		} else {
			className = "photo-item";
		}
		data += `
		<a href="#thumbnail-view" class="${className}">
      <img src="${url}"/>
    </a>
		`;
	}
	domElement.innerHTML = data;
};

const getProduct = (dom, number) => {
	let listProduct = "";
	fetch("../assets/products/products.json")
		.then((e) => e.json())
		.then((e) => {
			e.forEach((item, index) => {
				if (index <= (typeof number == "number" ? number - 1 : e.length)) {
					listProduct += `
									<a class="list-product" href="product.html" >
										<div class="image-content">
											<img src="${item.image[0]}"/>
										</div>
										<div class="description-product">
											<span class="product-title">${item.title}</span>
											<div class="deskripsi-label">
												<span class="list-label">${item.brand.toLowerCase()}</span>
												<span class="list-label">bekas</span>
											</div>
											<span class="price">${formatIDR(item.price)}</span>
										</div>
									</a>\n`;
				}
			});
			dom.innerHTML = listProduct;
		});
};
const searchProduct = (query) => {
	let listProduct = "";
	fetch("../assets/products/products.json")
		.then((e) => e.json())
		.then((e) => {
			e.forEach((item) => {
				if (item.title.toLowerCase().includes(query.toLowerCase())) {
					console.log(item.title);
					listProduct += `
									<a class="list-product" href="product.html" >
										<div class="image-content">
											<img src="${item.image[0]}"/>
										</div>
										<div class="description-product">
											<span class="product-title">${item.title}</span>
											<div class="deskripsi-label">
												<span class="list-label">${item.brand.toLowerCase()}</span>
												<span class="list-label">bekas</span>
											</div>
											<span class="price">${formatIDR(item.price)}</span>
										</div>
									</a>\n`;
				}
			});
			$(".product-content").innerHTML = listProduct;
		});
};

const formatIDR = (nominal) => {
	return nominal.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const randomImg = async (element) => {
	const get = await fetch(getURL(0));
	const data = await get.json();
	element.setAttribute("src", data[randomNumber()].image);
};

const randomNumber = (min = 1, max = 200) => {
	return Math.floor(Math.random() * (min - max + 1)) + max;
};

const toogleScroll = () => {
	document.querySelector("body").classList.toggle("scroll");
};

const showProduct = () => {
	let result = null;
	const selectedElement = $('[name="show-product"]');
	selectedElement.forEach((e) => {
		if (e.checked) {
			e.value == "all" ? (result = null) : (result = parseInt(e.value));
		}
	})
	return result;
};

const change = function (...args) {
	let elemen = [];
	let view = [];
	args.forEach((e, i) => {
		if (typeof e == "function") {
			e();
		} else {
			if (i % 2 == 1) {
				view.push(e);
			} else {
				elemen.push(e);
			}
		}
	});
	elemen.forEach((e, i) => {
		document.querySelector(e).style.display = view[i];
	});
};

const loader = function (...args) {
	const loader = document.querySelector(".bg-loader");
	loader.style.display = "flex";
	setTimeout(() => {
		loader.style.display = "none";
		args();
	}, 2000);
};

export { $, loader, getURL, getProduct, randomImg, getImageGalery, randomNumber, change, toogleScroll, searchProduct, showProduct };
