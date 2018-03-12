(async () => {
    const res = await fetch("http://demo.edument.se/api/products");
    const data = await res.json();
    appState.set("products", data);

    // populate HTML
    $("#products").append(data.map(element => {
        const { Id, Name, Image, Price, Description } = element;
        return appState.get("templates")["productTemplate"]({ id: Id, name: Name, url: Image, price: Price, desc: Description });
    }).join(""));
    App(appState);
})()


function App(appState) {
    initListeners();
    fetchReviews()
}
function initListeners() {
    $(document).on("click", ".product", openProduct);

    // Add to Cart button
    $(document).on("click", ".product button", addToCart);
    $(document).on("click", "a[data-functionality]", addToCart);

    //Adds view switching.
    $("#showProducts").on("click", function () {
        $("#products").show();
        $("#checkout").hide();
        $("#cartlist").hide();
    });
    $("#showCheckout").on("click", function () {
        $("#products").hide();
        $("#checkout").show();
        $("#cartlist").show().css("display", "flex");
    });
}

function fetchReviews() {
    (async () => {
        const res = await fetch("http://demo.edument.se/api/reviews");
        const data = await res.json();
        appState.set("reviews", data);
    })()
};

// CART FUNCTIONS
function updateCart(cart) {
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

function addToCart(e) {
    e.stopPropagation()
    cart = appState.get("cart");
    const productID = $(this).closest("div").attr("data-value") || $(this).closest(".product").attr("data-value");
    if ($(this).hasClass("add")) {
        cart[productID] += 1;
    } else if ($(this).hasClass("remove")) {
        if (cart[productID] > 1) {
            cart[productID] -= 1;
        } else {
            delete cart[productID];
        }
    } else {
        const productName = $(this).closest(".product").attr("data-value-name");
        if (productID in cart) {
            cart[productID] += 1;
        } else {
            cart[productID] = 1;
        }
    }
    updateCart(cart);
}

// OPEN PRODUCT VIEW
function openProduct(e) {
    const productID = $(this).closest(".product").attr("data-value");
    const productDiv = $(this).closest(".product");
    // show overlay
    $("#overlay").show("slow").css("display", "grid");
    buildOverlayHTML(productID, productDiv);
    // hook up event listeners
    $("#closeOverlay").on("click", function () {
        $("#overlay").empty().hide("slow");
    });
    $("#review").submit(postReview);
}

function buildOverlayHTML(productID, productDiv) {
    $(productDiv).clone().appendTo($("#overlay")).on("click", function (e) {
        e.stopPropagation();
    });
    $("#overlay .product button").on("click", addToCart);
    $("#overlay")
        .append('<div id="reviewContainer">')
        .append(
            appState.get("templates")["reviewTemplate"]()
        )
        .append(`<button id="closeOverlay">Leave product view</button>`);
    buildReviews(productID);
}

function buildReviews(productID) {
    const reviews = appState.get("reviews").filter(item => item["ProductID"] === Number(productID));
    $("#reviewContainer").empty().append(
        reviews.map(rev => buildReviewEntry(rev)).join("")
    );
}

function buildReviewEntry(review) {
    const star = ["<div>"];
    for (let i = 0; i < review["Rating"]; i++) {
        star.push("<span>&#9733</span>");
    }
    star.push("</div>");

    return `<div class="review">
    <div>${review["Comment"]}
        <p><span class="author">${review["Name"]}</span></p>
    </div>
    ${star.join("")}
    </div>`;
}

function postReview(e) {
    e.preventDefault();
    //get the review
    const $review = {};
    $("#review :input, #review select, #review textarea").each(function () {
        if ($(this).val() !== "") {
            $review[this.name] = $(this).val();
            $(this).val("");
        }
    });
    $review["Rating"] = Number($review["Rating"]);
    $review["ProductID"] = Number($("#overlay .product").attr("data-value"));

    fetch("http://demo.edument.se/api/reviews", {
        method: "POST",
        body: JSON.stringify($review),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    }).then(() => {
        $("#reviewContainer").append(buildReviewEntry($review));
    }).then(() => {
        // update local reviews
        fetchReviews()
    });
}

function submitOrder() {
    const $order = {};
    $("#checkoutForm :input, #checkoutForm textarea").each(function () {
        if ($(this).val() !== "Submit") {
            $order[this.name] = $(this).val();
        }
    });
    let OrderItems = Object.keys(cart).map(item => {
        let productId = Number(item);
        let product = appState.get("products").find(item => item.Id === productId);
        let orders = [];
        for (let i = 0; i < cart[item]; i++) {
            orders.push(product);
        }
        return orders;
    }).reduce((a, b) => a.concat(b));
    $order["OrderItems"] = OrderItems;
    
    fetch("http://demo.edument.se/api/orders", {
        method: "POST",
        body: JSON.stringify($order),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    });
}