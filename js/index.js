let products = [
    { name: "Caltrops", price: "5 sp", desc: "Hurts to walk on", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Drevnosti_RG_v3_ill130c_-_Caltrop.jpg/250px-Drevnosti_RG_v3_ill130c_-_Caltrop.jpg", id: "1" }, 
    { name: "Bedroll", price: "1 gp", desc: "To sleep in.", url: "https://images-na.ssl-images-amazon.com/images/I/41inhK8vL5L._SY355_.jpg", id: "2" }, 
    { name: "Block and tackle", price: "1 gp", desc: "To lift heavy things with.", url: "https://i.ebayimg.com/images/g/p64AAOSwBLlU8XG1/s-l300.jpg", id: "3" },
    { name: "Book, blank", price: "5 gp", desc: "To write or draw in, for the aspiring mage.", url: "https://cdn.instructables.com/FZQ/Y2M0/I9FGT1YD/FZQY2M0I9FGT1YD.LARGE.jpg", id: "4" },
    { name: "Book, reading", price: "10 gp", desc: "A steamy novel, for those lonely nights.", url: "http://www.worldoflongmire.com/features/romance_novels/love_bum.jpg", id: "5" } ];
const cart = {};

function createProduct(product) {
    return `<div class="product" id="${product.id}">
        <h3>${product.name}</h3>
        <img src="${product.url}" alt="image of ${product.name}" class="productImage">
        <div class="price">${product.price}</div>
        <div class="description">${product.desc}</div>
        <button data-functionality="productButton">Add to cart</button>
    </div>`;
}

function buildCartHTML(cart, products) {
    let items = Object.keys(cart).map(key =>
        products.find(product => product.id === key)
    );
    return items.map(item => { 
        return `<div data-value="${item.id}" class="cart-item">
            <span>${item.name}</span>
            <span>
                <a href="#" data-functionality="cart" class="cartMod add">+</a> ${cart[item.id]} <a href="#" data-functionality="cart" class="cartMod remove">-</a>
            </span>
        </div>`;
    }).join("");
}

function addToCart(e) {
    e.stopPropagation();
    if (e.target.parentElement.id in cart) {
        cart[e.target.parentElement.id] += 1;
    } else {
        cart[e.target.parentElement.id] = 1;
    }
    update(cart, products);
}

function modCart(e) {
    let productID = $(e.target).closest("div").attr("data-value");
    if ($(e.target).hasClass("add")) {
        cart[productID] += 1;
    } else {
        if (cart[productID] > 1) {
            cart[productID] -= 1;
        } else {
            delete cart[productID];
        }
    }
    update(cart, products);
}

function update(cart, products) {
    $("#cartlist").html(buildCartHTML(cart, products));
    $("#cartTotal").text(Object.keys(cart).
        reduce(function (sum, key) {
            return sum + cart[key];
        }, 0));
}

function clickHandler(e) {
    if (e.target.hasAttribute("data-functionality")) {
        if (e.target.getAttribute("data-functionality") === "productButton") {
            addToCart(e);
        } else if ( e.target.getAttribute("data-functionality") === "cart" ) {
            modCart(e);
        }
    }
}

function createPage(products) {
    $("#products").append(products.map(element => createProduct(element))
        .join(""));
    $(document).on("click", ".product", productClick);
    $(document).on("click", 'button[data-functionality="productButton"]', addToCart); //eslint-disable-line
    $(document).on("click", "a[data-functionality]", modCart);
}

// BEYOND THIS POINT LIVES MONSTERS
$("#showProducts").on("click", function() {
    $("#products").show();
    $("#checkout").hide();
    $("#cartlist").hide();
});
$("#showCheckout").on("click", function() {
    $("#products").hide();
    $("#checkout").show();
    $("#cartlist").show().css("display", "flex");
});

// SUBMIT VALIDATION
$("#checkoutForm").on("submit", function(e) {
    e.preventDefault();

    //These are the required fields
    let requiredInputs = Array.from($("input"))
        .filter(x => ["firstname", "lastname", "email", "street", "zip", "city"]
            .indexOf(x.name) >= 0);
    if (!validate()) {
        requiredInputs.forEach(x => inputValidation(x));
    } else {
        //submit
    }

    function validate() {
        return requiredInputs.every(x => inputValidation(x));
    }
});

function inputValidation(field) {
    if (field.value === "") {
        field.setAttribute("class", "invalid");
        return false;
    } else {
        field.removeAttribute("class", "invalid");
        return true;
    }
}

createPage(products);