const appState = new Map();
appState.set("templates", {
    productTemplate: Handlebars.compile($("#product-template").html()),
    reviewTemplate: Handlebars.compile($("#review-template").html()),
    cartItemTemplate: Handlebars.compile($("#cart-item-template").html())
}).set(
    "cart", {}
); 