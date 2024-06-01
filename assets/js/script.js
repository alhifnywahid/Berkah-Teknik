import { loader, toogleScroll, change, getProduct, randomImg, getImageGalery } from "./utils/Function.js";

const productContent = document.querySelectorAll(".product-content");
const toogleMobile = document.querySelector("input.toogle-show-menu");
// menjalankan semua fungsi ketika browser sedang load
// window.addEventListener("load", () => {
// 	// mengambil data provinsi
// 	fetch("https://alamat.thecloudalert.com/api/provinsi/get/")
// 		.then((response) => response.json())
// 		.then(({ result }) => {
// 			let inner = '<option value="default" selected style="display: none;">pilih provinsi</option>\n';
// 			result.forEach(({ id, text }) => {
// 				inner += `<option value="${id}">${text}</option>\n`;
// 			});
// 			document.querySelector("#provinsi").innerHTML = inner;
// 		});
// });

document.addEventListener("scroll", () => {
	if (window.scrollY >= 60) {
		document.querySelector("header").classList.add("shadow-on-scroll");
	} else {
		document.querySelector("header").classList.remove("shadow-on-scroll");
	}
});

document.addEventListener("change", (e) => {
	const provinsi = document.querySelector("#provinsi");
	const kota = document.querySelector("#kota");
	const kecamatan = document.querySelector("#kecamatan");
	const kelurahan = document.querySelector("#kelurahan");
	if (e.target === provinsi) {
		fetch(`https://alamat.thecloudalert.com/api/kabkota/get/?d_provinsi_id=` + provinsi.value)
			.then((response) => response.json())
			.then(({ result }) => {
				let inner = '<option value="default" selected style="display: none;">pilih Kabupate/kota</option>\n';
				result.forEach(({ id, text }) => {
					inner += `<option value="${id}">${text}</option>\n`;
				});
				document.querySelector("#kota").innerHTML = inner;
			});
	} else if (e.target === kota) {
		fetch(`https://alamat.thecloudalert.com/api/kecamatan/get/?d_kabkota_id=` + kota.value)
			.then((response) => response.json())
			.then(({ result }) => {
				let inner = '<option value="default" selected style="display: none;">pilih kecamatan</option>\n';
				result.forEach(({ id, text }) => {
					inner += `<option value="${id}">${text}</option>\n`;
				});
				document.querySelector("#kecamatan").innerHTML = inner;
			});
	} else if (e.target === kecamatan) {
		fetch(`https://alamat.thecloudalert.com/api/kelurahan/get/?d_kecamatan_id=` + kecamatan.value)
			.then((response) => response.json())
			.then(({ result }) => {
				let inner = '<option value="default" selected style="display: none;">pilih desa/kelurahan</option>\n';
				result.forEach(({ id, text }) => {
					inner += `<option value="${id}">${text}</option>\n`;
				});
				document.querySelector("#kelurahan").innerHTML = inner;
			});
	} else if (e.target === kelurahan) {
		fetch(`https://alamat.thecloudalert.com/api/kodepos/get/?d_kabkota_id=${kota.value}&d_kecamatan_id=${kecamatan.value}`)
			.then((response) => response.json())
			.then(({ result }) => {
				let inner = '<option value="default" selected style="display: none;">pilih kodepos</option>\n';
				result.forEach(({ id, text }) => {
					inner += `<option value="${id}">${text}</option>\n`;
				});
				document.querySelector("#kodepos").innerHTML = inner;
			});
	}
});

document.addEventListener("click", function (e) {
	const target = e.target;

	if (e.target.classList.contains("photo-item")) {
		const image = document.querySelector("#galery .thumbnail-view");
		const target = e.target.children[0].getAttribute("src");
		image.style.backgroundImage = `url(${target})`;
		change("#galery .thumbnail-view", "flex", toogleScroll);
	} else if (e.target.getAttribute("id") === "#image-item") {
		const allImage = document.querySelector(".list-view-img").children;
		const detailProduct = document.querySelector("section.view-product .sub-container");
		const imgPriview = detailProduct.querySelector(".view-img img");
		imgPriview.setAttribute("src", e.target.getAttribute("src"));
		for (let child of allImage) {
			const atributParent = imgPriview.getAttribute("src");
			const atributChild = child.getAttribute("src");
			if (atributParent.includes(atributChild)) {
				child.classList.add("checked-img");
			} else {
				child.classList.remove("checked-img");
			}
		}
	} else if (e.target.attributes["href"]) {
		const targetHref = e.target.attributes.href.value.slice(1);
		const targetClass = e.target.attributes.class.value;
		document.querySelectorAll(".page").forEach((element) => {
			const includeIdWithHref = targetHref.includes(element.getAttribute("id"));
			if (includeIdWithHref) {
				// element.style.display = 'block';
				if (targetHref.includes("detail-product")) {
					const detailProduct = document.querySelector("section.view-product .sub-container");
					const imgPriview = detailProduct.querySelector(".view-img img");
					const listImg = detailProduct.querySelectorAll(".list-view-img img");
					const description = detailProduct.querySelector(".detail-description").children;
					const titleProduct = e.target.textContent;
					const priceProduct = e.target.parentElement.nextElementSibling.nextElementSibling.textContent;
					const imgSrc = e.target.parentElement.parentElement.previousElementSibling.children[0].getAttribute("src");

					imgPriview.setAttribute("src", imgSrc);
					listImg.forEach((data, index) => (index > 0 ? randomImg(data) : listImg[0].setAttribute("src", imgSrc)));
					description[0].textContent = titleProduct;
					description[1].textContent = priceProduct;
				}
			} else {
				if (targetClass.includes(element.classList[0])) {
					// element.style.display = 'none';
				}
			}
		});
		document.querySelectorAll(".show-menu-user").forEach((element) => {
			const hrefTarget = e.target.getAttribute("href").slice(1);
			if (element.classList.contains(hrefTarget)) {
				element.style.display = "flex";
			} else if (e.target.classList.contains("to-exit")) {
				change(".exit-container", "flex", toogleScroll);
			} else {
				element.style.display = "none";
			}
		});
	} else if (target.attributes["data-btn"]) {
		const attr = target.getAttribute("data-btn");
		if (attr.includes("exit-no")) return change(".exit-container", "none", toogleScroll);
		if (attr.includes("exit-yes")) return window.location.reload();
		if (attr.includes("btn-login")) change("div.login-page", "none", ".container", "block");
		if (attr.includes("change-data")) change(".table-account", "none", ".change-data-account", "block");
		if (attr.includes("close-img")) change("./galery.html .thumbnail-view", "none", toogleScroll);
		if (attr.includes("sv-change-data")) return change(".change-data-account", "none", ".table-account", "block");
		if (attr.includes("cc-change-data")) return change(".change-data-account", "none", ".table-account", "block");
		if (attr.includes("add-address")) return change(".bg-address", "none", ".add-address", "block");
		if (attr.includes("change-address")) return change(".bg-address", "none", ".add-address", "block");
		if (attr.includes("sv-address")) return change(".bg-address", "block", ".add-address", "none");
		if (attr.includes("cc-address")) return change(".bg-address", "block", ".add-address", "none");
		if (attr.includes("cotinue-pay")) return change(".bg-payment", "flex", toogleScroll);
		if (attr.includes("cc-pay")) return alert("Pesanan Berhasil di batalkan");
		if (attr.includes("cancel-payment")) return change(".bg-payment", "none", toogleScroll);
		if (attr.includes("checkout-page")) return change(".checkout-page", "block", ".home-page", "none");
		// if (attr.includes("btn-filter")) return change(".background-filter", "flex", toogleScroll);
		
		if (attr.includes("reset-filter")) {
			document.querySelectorAll('input[data-cx="cx-filter"').forEach((e) => {
				e.checked = false;
			});
		}
	}

	// if (e.target !== get("label.pointer") && e.target !== get("input.toogle-show-menu")) {
	// 	toogleMobile.checked = false;
	// }
});

// document.querySelector('#up-pp').addEventListener('change', function (event) {
// 	const file = event.target.files[0];
// 	console.log(file);
// 	if (file && file.type.startsWith('image/')) {
// 		const reader = new FileReader();
// 		reader.onload = function (e) {
// 			const previewImg = document.querySelector('#pp-user');
// 			previewImg.src = e.target.result;
// 		};
// 		reader.readAsDataURL(file);
// 	} else {
// 		alert('Upload Foto!!!');
// 	}
// });
