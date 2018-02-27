// next refactoring, event delegation on document.
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
    </div>
    `;
}



function clickHandler(e) {
    // console.log(e.target);

    if (e.target.hasAttribute("data-functionality")) {
        if (e.target.getAttribute("data-functionality") === "productButton") {
            addToCart(e);
        } else if ( e.target.getAttribute("data-functionality") === "cart" ) {
            modCart(e);
        }
    }
}
function modCart(e) {
    let productID = e.target.parentElement.parentElement.getAttribute("data-value");
    if (e.target.classList.contains("add")) {
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

function createPage(products) {
    let productDiv = document.getElementById("products");
    productDiv.innerHTML = products.map(element => createProduct(element))
        .join("");

    document.addEventListener("click", clickHandler);
}
function buildCartHTML(cart, products) {
    let items = Object.keys(cart).map(key =>
        products.find(product => product.id === key)
    );
    return items.map(item => { 
        return `<div data-value="${item.id}">
            <span>${item.name}</span>
            <span>
                <a href="#" data-functionality="cart" class="cartMod add">+</a> ${cart[item.id]} <a href="#" data-functionality="cart" class="cartMod remove">-</a>
            </span>
        </div>    
        `;
    }).join("");
}

function addToCart(e) {
    if (e.target.parentElement.id in cart) {
        cart[e.target.parentElement.id] += 1;
    } else {
        cart[e.target.parentElement.id] = 1;
    }
    update(cart, products);
}

function update(cart, products) {
    document.getElementById("cartlist").innerHTML = buildCartHTML(cart, products);
    let cartSpan = document.getElementById("cartTotal");

    cartSpan.innerText = Object.keys(cart).
        reduce(function (sum, key) {
            return sum + cart[key];
        }, 0);
}

// BEYOND THIS POINT LIVES MONSTERS
// ----------------------------
// THIS IS NOT PRETTY BUT IT WORKS OKAY?
// I DEAL WITH THIS LATER
function displayProduct() { // eslint-disable-line no-unused-vars
    let checkout = document.getElementById("checkout");
    let products = document.getElementById("products");
    let cartlist = document.getElementById("cartlist");
    checkout.style.display = "none";
    products.style.display = "grid";

    cartlist.style.display = "none";
    cartlist.parentElement.style.justifySelf = "end";
}
function displayCheckout() { // eslint-disable-line no-unused-vars
    let checkout = document.getElementById("checkout");
    let products = document.getElementById("products");
    let cartlist = document.getElementById("cartlist");
    products.style.display = "none"; 
    checkout.style.display = "flex";
    
    cartlist.style.display = "block";
    cartlist.parentElement.style.justifySelf = "start";
}
// ----------------------------
// SUBMIT VALIDATION
const requireds = ["firstname", "lastname", "email", "street", "zip", "city"];
let inputs = Array.from(document.getElementsByTagName("input"));

document.getElementById("checkoutForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
        inputs.filter(x => requireds.indexOf(x.name) >= 0)
            .forEach(x => inputValidation(x));
    } else {
        // submit
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
function validate() {
    return inputs.filter(x => requireds.indexOf(x.name) >= 0)
        .every(x => inputValidation(x));
}
createPage(products);