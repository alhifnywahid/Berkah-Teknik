import { $, loader, toogleScroll, change as set, getProduct, randomImg, getImageGalery, searchProduct, showProduct, dbsProduct, showNotification, formatIDR, create, createThumb, LocalDB as ldb, updateCart, Notification } from "./utils/Function.js";

const LocalDB = new ldb();

const URL = window.location.href;
const hash = window.location.hash;

if (URL.includes("galery")) {
	/* ~~~~~~~~~~ Get Image for GaleryPage ~~~~~~~~~~ */
	getImageGalery(200, $("section.list-photo .img-content"));
} else if (URL.includes("product")) {
	/* ~~~~~~~~~~ Get Product Recomendations for ProductPage ~~~~~~~~~~ */
	getProduct($("#product-recommendations"), 5);
	(async () => {
		const data = await dbsProduct(hash.slice(1));
		const { specification: spec } = data;
		$(".bg-full-img").innerHTML = `<img class="full-img" src="${data.image[0]}"/>`;
		$("h2.title-product").textContent = data.title;
		$("h3.price").textContent = formatIDR(data.price);
		$("a.get-co").setAttribute("href", `checkout.html#${data.id}`);
		let img = "";
		data.image.forEach((e, i) => {
			img += `<img class="img-item ${i === 0 ? "active" : ""}" src="${e}">`;
		});
		$("[data-dp] td").forEach((item) => {
			item.remove();
		});
		$(".add-to-cart").setAttribute("id", data.id);
		$("div.list-view-img").innerHTML = img;
		create($('[data-dp="brand"]'), data.brand);
		create($('[data-dp="pk"]'), spec.besaran_pk);
		create($('[data-dp="teknologi"]'), spec.teknologi_ac);
		create($('[data-dp="daya"]'), spec.konsumsi_daya);
		create($('[data-dp="dimensi"]'), spec.dimensi_produk);
		create($('[data-dp="berat"]'), spec.berat);
		create($('[data-dp="kelengkapan"]'), spec.kelengkapan_paket);
		create($('[data-dp="lainnya"]'), spec.lain_lain);
		create($('[data-dp="sni"]'), spec.nomor_sertifikat_sni);
		create($('[data-dp="nodaftar"]'), spec.nomor_pendaftaran_barang);
	})();
} else if (URL.includes("index") || hash.includes("home")) {
	/* ~~~~~~~~~~ ========= ~~~~~~~~~~ */
	$("#compare").addEventListener("change", () => {
		if ($("#compare").checked) {
			set(".background-compare", "flex");
			$(".product-content .list-product").forEach((item) => {
				item.addEventListener("click", setClickProduct);
			});
		} else {
			set(".background-compare", "none");
			$(".product-content .list-product").forEach((item) => {
				item.removeEventListener("click", setClickProduct);
			});
		}
	});
	/* ~~~~~~~~~~ Set Filter ~~~~~~~~~~ */
	$("#btn-filter").addEventListener("change", (e) => {
		$("#btn-filter").checked ? set(".background-filter", "flex", toogleScroll) : set(".background-filter", "none", toogleScroll);
		if ($("#compare").checked) $("#compare").click();
	});
	/* ~~~~~~~~~~ set search ~~~~~~~~~~ */
	$("#search-data").addEventListener("input", (event) => {
		searchProduct(event.target.value);
	});
	/* ~~~~~~~~~~ Get Data Product for HomePage ~~~~~~~~~~ */
	getProduct($(".product-content"), showProduct());
} else if (URL.includes("checkout")) {
	(async () => {
		const data = await dbsProduct(hash.slice(1));
		$('[data-co="thumbnail"]').setAttribute("src", data.image[0]);
		$('[data-co="produk"]').textContent = data.title;
		$('[data-co="price"]').textContent = formatIDR(data.price);
	})();
}

/* ~~~~~~~~~~ Event HashChange ~~~~~~~~~~ */
window.addEventListener("hashchange", (event) => {
	const newURL = event.newURL;
	const oldURL = event.oldURL;
	if (newURL.endsWith("daftar")) return set(".form-login", "none", ".form-register", "flex");
	if (newURL.endsWith("masuk")) return set(".form-register", "none", ".form-login", "flex");
});

/* ~~~~~~~~~~ Set Compare ~~~~~~~~~~ */
const setClickProduct = async (event) => {
	event.preventDefault();
	const selectedProducts = $(".bg-list-img");
	const target = event.target;

	if (target.classList.contains("list-product")) {
		const productId = target.getAttribute("id");
		const data = await dbsProduct(productId);

		let alreadySelected = false;
		for (let item of selectedProducts) {
			if (item.getAttribute("data-product") === data.id) {
				alreadySelected = true;
				break;
			}
		}
		const isFull = Array.from(selectedProducts).some((e) => e.getAttribute("data-product") === "");
		!isFull && !alreadySelected ? showNotification("Maksimal 3 produk!, silahkan hapus salah satu.", false) : false;

		if (!alreadySelected) {
			for (let item of selectedProducts) {
				if (!item.getAttribute("data-product")) {
					item.setAttribute("data-product", data.id);
					item.innerHTML = `<img src="${data.image[0]}" class="list-product" />
            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" width="20" height="20" viewBox="0 0 24 24" class="del-compare" >
              <path
                d="M13.7672 12L17.632 8.13839C18.1227 7.64819 18.1227 6.85786 17.632 6.36765C17.1414 5.87745 16.3504 5.87745 15.8598 6.36765L11.995 10.2293L8.14018 6.37766C7.64956 5.88745 6.85857 5.88745 6.36796 6.37766C5.87735 6.86786 5.87735 7.65819 6.36796 8.1484L10.2228 12L6.36796 15.8616C5.87735 16.3518 5.87735 17.1421 6.36796 17.6323C6.85857 18.1226 7.64956 18.1226 8.14018 17.6323L12.005 13.7707L15.8598 17.6223C16.3504 18.1125 17.1414 18.1125 17.632 17.6223C18.1227 17.1321 18.1227 16.3418 17.632 15.8516L13.7772 12H13.7672Z"
              ></path>
            </svg>`;
					showNotification("Produk telah di tambahkan.");
					break;
				}
			}
		} else {
			showNotification("Produk ini sudah dipilih!", false);
		}
	}
};

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
	} else if (target.classList.contains("del-compare")) {
		const product = target.parentElement;
		product.setAttribute("data-product", "");
		product.innerHTML = null;
	} else if (target.classList.contains("start-compare")) {
		const product = Array.from($(".bg-list-img")).filter((item) => {
			return item.getAttribute("data-product") !== "";
		});
		if (product.length === 0 || product.length === 1) return showNotification("Minimal 2 produk untuk di bandingkan!", false);

		$(".bg-list-img").forEach(async (item, index) => {
			const getData = await dbsProduct(item.getAttribute("data-product"));
			const { id, image, specification: spec } = getData;
			createThumb($('[data-c="thumbnail"]'), `product.html#${id}`, image[0]);
			create($('[data-c="title"]'), getData.title);
			create($('[data-c="price"]'), formatIDR(getData.price));
			create($('[data-c="brand"]'), getData.brand);
			create($('[data-c="pk"]'), spec.besaran_pk);
			create($('[data-c="teknologi"]'), spec.teknologi_ac);
			create($('[data-c="daya"]'), spec.konsumsi_daya);
			create($('[data-c="dimensi"]'), spec.dimensi_produk);
			create($('[data-c="berat"]'), spec.berat);
			create($('[data-c="kelengkapan"]'), spec.kelengkapan_paket);
			create($('[data-c="lainnya"]'), spec.lain_lain);
			create($('[data-c="sni"]'), spec.nomor_sertifikat_sni);
			create($('[data-c="nodaftar"]'), spec.nomor_pendaftaran_barang);
		});
		set(".result-compare", "flex", toogleScroll);
	} else if (target.classList.contains("closed-result-compare")) {
		set(".result-compare", "none", toogleScroll);
		$("[data-c] td").forEach((item) => {
			item.remove();
		});
	} else if (target.classList.contains("photo-item")) {
		const image = $("#galery .thumbnail-view");
		const target = target.children[0].getAttribute("src");
		image.style.backgroundImage = `url(${target})`;
		change("#galery .thumbnail-view", "flex", toogleScroll);
	} else if (target.classList.contains("add-to-cart")) {
		const db = LocalDB.addCart($(".add-to-cart").getAttribute("id"));
		Notification(db.msg, db.status);
	} else if (target.classList.contains("cotinue-pay")) {
		Notification("Maaf, fitur ini belum tersedia.", false);
	} else if (target.classList.contains("img-item")) {
		const img = $(".img-item");
		const fullImg = $(".full-img");
		fullImg.setAttribute("src", target.getAttribute("src"));
		img.forEach((item) => {
			if (item.getAttribute("src") === fullImg.getAttribute("src")) {
				item.classList.add("active");
			} else {
				item.classList.remove("active");
			}
		});
	} else if (target.classList.contains("cart-container")) {
		event.preventDefault();
		Notification("Maaf, fitur ini belum tersedia.", false);
	} else if (target.getAttribute("data-ac")) {
		if (target.getAttribute("data-ac") === "m-exit") return set(".exit-container", "flex", toogleScroll);
		$("[data-layout]").forEach((layout) => {
			if (layout.getAttribute("data-layout") === target.getAttribute("data-ac")) {
				layout.style.display = "flex";
			} else {
				layout.style.display = "none";
			}
		});
	} else if (target.getAttribute("data-btn")) {
		if (target.getAttribute("data-btn") === "exit-yes") return (window.location.href = window.location.origin + "/auth.html");
		if (target.getAttribute("data-btn") === "exit-no") return set(".exit-container", "none", toogleScroll);
	}
});

updateCart();
