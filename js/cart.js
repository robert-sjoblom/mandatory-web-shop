let products = [
    {
        name: "Simon",
        id: "1"
    },
    {
        name: "Robert",
        id: "2"
    },
    {
        name: "Koof",
        id: "3"
    }
];

let cart = {
    "1": 2,
    "3": 1
};

function removeFromCart(cart) {
    //what happens when # of items is 0?
}
function buildCartHTML(cart, products) {
    let items = Object.keys(cart).map(key =>
        products.find(product => product.id === key)
    );

    return htmlItems = items.map(item => {
        return `
        <div  data-value="${item.id}">
            <span>${item.name}</span>
            <span>
                <a href="#" class="add">+</a> AMT: ${cart[item.id]} <a href="#" class="remove">-</a>
            </span>
        </div>    
        `;
    }).join("");
}


// refactor to generic function
// later
function increaseProduct(e) {
    let id = e.target.parentElement.parentElement.getAttribute("data-value");
    cart[id] += 1;
    update();
}
function decreaseProduct(e) {
    console.log("Goodbye World!");
    let id = e.target.parentElement.parentElement.getAttribute("data-value");
    if (cart[id] > 1) {
        cart[id] -= 1;
    } else {
        delete cart[id];
    }
    
    update();
}

function update() {
    document.getElementById("cartlist").innerHTML = buildCartHTML(cart, products);
    let cartSpan = document.getElementById("cartTotal");

    cartSpan.innerText = Object.keys(cart).
        reduce(function (sum, key) {
            return sum + cart[key];
        }, 0);

    addListeners();
}

function addListeners() {
    Array.from(document.getElementsByClassName("add"))
        .forEach(elem => elem.addEventListener("click", increaseProduct));
    Array.from(document.getElementsByClassName("remove"))
        .forEach(elem => elem.addEventListener("click", decreaseProduct));       
}

update();
