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
									<a class="list-product" href="product.html#${item.id}" id="${item.id}" target="_blank">
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
									<a class="list-product" href="product.html#${item.id}" id="${item.id}" target="_blank">
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

const showNotification = (message, isSuccess = true) => {
	const notification = $(".notification");
	const notSuccess = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="50" height="50" viewBox="0 0 256 256" xml:space="preserve" class="svg-notsuccess"> <defs></defs> <g class="group" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z" class="red-circle" transform="matrix(1 0 0 1 0 0)" stroke-linecap="round"/><path d="M 28.902 66.098 c -1.28 0 -2.559 -0.488 -3.536 -1.465 c -1.953 -1.952 -1.953 -5.118 0 -7.07 l 32.196 -32.196 c 1.951 -1.952 5.119 -1.952 7.07 0 c 1.953 1.953 1.953 5.119 0 7.071 L 32.438 64.633 C 31.461 65.609 30.182 66.098 28.902 66.098 z" class="white-path" transform="matrix(1 0 0 1 0 0)" stroke-linecap="round"/><path d="M 61.098 66.098 c -1.279 0 -2.56 -0.488 -3.535 -1.465 L 25.367 32.438 c -1.953 -1.953 -1.953 -5.119 0 -7.071 c 1.953 -1.952 5.118 -1.952 7.071 0 l 32.195 32.196 c 1.953 1.952 1.953 5.118 0 7.07 C 63.657 65.609 62.377 66.098 61.098 66.098 z" class="white-path" transform="matrix(1 0 0 1 0 0)" stroke-linecap="round"/></g></svg>`;
	const success = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50" height="50" viewBox="0 0 256 256" xml:space="preserve" class="svg-success" > <defs></defs> <g class="group" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" > <circle cx="45" cy="45" r="45" class="circle" transform="matrix(1 0 0 1 0 0)" /> <path d="M 38.478 64.5 c -0.01 0 -0.02 0 -0.029 0 c -1.3 -0.009 -2.533 -0.579 -3.381 -1.563 L 21.59 47.284 c -1.622 -1.883 -1.41 -4.725 0.474 -6.347 c 1.884 -1.621 4.725 -1.409 6.347 0.474 l 10.112 11.744 L 61.629 27.02 c 1.645 -1.862 4.489 -2.037 6.352 -0.391 c 1.862 1.646 2.037 4.49 0.391 6.352 l -26.521 30 C 40.995 63.947 39.767 64.5 38.478 64.5 z" class="path" transform="matrix(1 0 0 1 0 0)" stroke-linecap="round" /> </g> </svg>`;
	notification.innerHTML += `
	<div class="list-notification">
		<div class="item-notification">
		${isSuccess ? success : notSuccess}
			<p>${message}</p>
		</div>
	</div>`;
	setTimeout(() => {
		notification.firstElementChild.remove();
	}, 2000);
};

const dbsProduct = async (query) => {
	const res = await fetch("../assets/products/products.json");
	const data = await res.json();
	const done = data.find((e) => e.id === query);
	return done;
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
	});
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

const create = (element, textNode, type = "td") => {
	const td = document.createElement("td");
	const text = document.createTextNode(textNode);
	td.appendChild(text);
	element.appendChild(td);
};
const createThumb = (element, href, src) => {
	const td = document.createElement("td");
	td.innerHTML = `<a href="${href}"><img src="${src}"/></a>`;
	element.appendChild(td);
};

export { $, loader, getURL, getProduct, randomImg, getImageGalery, randomNumber, change, toogleScroll, searchProduct, showProduct, dbsProduct, showNotification, formatIDR, create, createThumb };
