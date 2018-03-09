// const fetch = require("node-fetch");
const templates = {
    productTemplate: Handlebars.compile($("#product-template").html()),
    reviewTemplate: Handlebars.compile($("#review-template").html()),
    cartItemTemplate: Handlebars.compile($("#cart-item-template").html())
};
const cart = {}

//appState.get("templates")["productTemplate"]

(async () => {
    const res = await fetch("http://demo.edument.se/api/products");
    const data = await res.json();
    appState.set("products", data);

    // populate HTML
    $("#products").append(data.map(element => {
        const { Id, Name, Image, Price, Description } = element;
        return templates.productTemplate({ id: Id, name: Name, url: Image, price: Price, desc: Description });
    }).join(""));


    App(appState);
})()

function updateCart(cart, productName) {
    // updates cart div
    const HTML = Object.keys(cart)
        .map(key => {
            let productID = key;
            let name = $("#products").find(`[data-value=${key}]`).attr("data-value-name")

            return `<div data-value="${productID}" class="cart-item">
            <span>${name}</span><span>
            <a href="#" data-functionality="cart" class="cartMod add">+</a> ${cart[key]} <a href="#" data-functionality="cart" class="cartMod remove">-</a>
            </span></div>`
        })
        .join("");
    $("#cartlist").html(HTML);

    // updates the total amount of items in cart value
    $("#cartTotal").text(Object.keys(cart).
        reduce(function (sum, key) {
            return sum + cart[key];
        }, 0));
}
function initListeners() {
    // $(document).on("click", ".product", productClick);
    // Add to Cart button
    $(document).on("click", ".product button", function (e) {
        e.stopPropagation()
        const productID = $(this).closest(".product").attr("data-value");
        const productName = $(this).closest(".product").attr("data-value-name");
        if (productID in cart) {
            cart[productID] += 1;
        } else {
            cart[productID] = 1;
        }
        updateCart(cart, productName);
    });
    
    // $(document).on("click", "a[data-functionality]", modCart);
    // $(document).on("click", "#overlay", closeOverlay);
}

// function addToCart(e) {
//     const productID = $(this).closest(".product").attr("data-value");
//     if (productID in cart) {
//         cart[productID] += 1;
//     } else {
//         cart[productID] = 1;
//     }
// }

(async () => {
    const res = await fetch("http://demo.edument.se/api/products");
    const data = await res.json();


    // populate HTML
    $("#products").append(data.map(element => {
        const { Id, Name, Image, Price, Description } = element;
        return templates.productTemplate({ id: Id, name: Name, url: Image, price: Price, desc: Description });
    }).join(""));
    initListeners()
})()
