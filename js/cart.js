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

function buildCartHTML(cart, products) {
    let items = Object.keys(cart).map(key =>
        products.find(product => product.id === key)
    );

    return htmlItems = items.map(item => { // eslint-disable-line no-undef
        return `
        <div data-value="${item.id}">
            <span>${item.name}</span>
            <span>
                <a href="#" class="cartMod add">+</a> AMT: ${cart[item.id]} <a href="#" class="cartMod remove">-</a>
            </span>
        </div>    
        `;
    }).join("");
}

function modCart(e) {
    let operation = e.target.classList.value.split(" ")[1];
    let productID = e.target.parentElement.parentElement.getAttribute("data-value");

    if (operation === "add") {
        cart[productID] += 1;
    } else {
        if (cart[productID] > 1) {
            cart[productID] -= 1;
        } else {
            delete cart[productID];
        }
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

    Array.from(document.getElementsByClassName("cartMod"))
        .forEach(elem => elem.addEventListener("click", modCart));   
}

update();
