import { $, loader, toogleScroll, change as set, getProduct, randomImg, getImageGalery, searchProduct, showProduct } from "./utils/Function.js";

const URL = window.location.href;

if (URL.includes("galery")) {
	/* ~~~~~~~~~~ Get Image for GaleryPage ~~~~~~~~~~ */
	getImageGalery(5, $("section.list-photo .img-content"));
} else if (URL.includes("product")) {
	/* ~~~~~~~~~~ Get Product Recomendations for ProductPage ~~~~~~~~~~ */
	getProduct($("#product-recommendations"), 5);
} else if (URL.includes("index")) {
	/* ~~~~~~~~~~ Get Data Product for HomePage ~~~~~~~~~~ */
	getProduct($(".product-content"), showProduct());
}

/* ~~~~~~~~~~ Event HashChange ~~~~~~~~~~ */
window.addEventListener("hashchange", (event) => {
	const newURL = event.newURL;
	const oldURL = event.oldURL;
	if (newURL.endsWith("daftar")) return set(".form-login", "none", ".form-register", "flex");
	if (newURL.endsWith("masuk")) return set(".form-register", "none", ".form-login", "flex");
});

/* ~~~~~~~~~~ (Search Product) ~~~~~~~~~~ */
$("#search-data").addEventListener("input", (event) => {
	searchProduct(event.target.value);
});

/* ~~~~~~~~~~ Show Filter ~~~~~~~~~~ */
document.addEventListener("change", (e) => {
	const target = e.target;
	if (target === $("#btn-filter")) {
		$("#btn-filter").checked ? set(".background-filter", "flex", toogleScroll) : set(".background-filter", "none", toogleScroll);
		if ($("#compare").checked) $("#compare").click();
	} else if (target === $("#compare")) {
		$("#compare").checked ? set(".background-compare", "flex") : set(".background-compare", "none");
	}
});

/* ~~~~~~~~~~ Event Scroll ~~~~~~~~~~ */
document.addEventListener("scroll", () => {
	/* ~~~~~~~~~~ Added shadow in the header ~~~~~~~~~~ */
	if (window.scrollY >= 60) {
		$("header").classList.add("shadow-on-scroll");
	} else {
		$("header").classList.remove("shadow-on-scroll");
	}
});

/* ~~~~~~~~~~ Event Click ~~~~~~~~~~ */
document.addEventListener("click", (event) => {
	let target = event.target;
	/* ~~~~~~~~~~ Enlarge the image when clicked ~~~~~~~~~~ */
	if (target.classList.contains("photo-item")) {
		$("#bg-large-img").style.backgroundImage = `url(${target.children[0].getAttribute("src")})`;
		set("#bg-large-img", "flex", toogleScroll);
	} else if (target == $("#close-img")) {
		return set("#bg-large-img", "none", toogleScroll);
	} else if (target.classList.contains("accept-filter")) {
		getProduct($(".product-content"), showProduct());
		set(".background-filter", "none", toogleScroll);
	}
});
