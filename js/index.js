
let products = [
    {
        name: "Caltrops",
        price: "5 sp",
        desc: "Hurts to walk on",
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Drevnosti_RG_v3_ill130c_-_Caltrop.jpg/250px-Drevnosti_RG_v3_ill130c_-_Caltrop.jpg"
    },
    {
        name: "Bedroll",
        price: "1 gp",
        desc: "To sleep in.",
        url: "https://images-na.ssl-images-amazon.com/images/I/41inhK8vL5L._SY355_.jpg"
    },
    {
        name: "Block and tackle",
        price: "1 gp",
        desc: "To lift heavy things with.",
        url: "https://i.ebayimg.com/images/g/p64AAOSwBLlU8XG1/s-l300.jpg"
    },
    {
        name: "Book, blank",
        price: "5 gp",
        desc: "To write or draw in, for the aspiring mage.",
        url: "https://cdn.instructables.com/FZQ/Y2M0/I9FGT1YD/FZQY2M0I9FGT1YD.LARGE.jpg"
    },
    {
        name: "Book, reading",
        price: "10 gp",
        desc: "A steamy novel, for those lonely nights.",
        url: "http://www.worldoflongmire.com/features/romance_novels/love_bum.jpg"
    }
];

/*
better to write a generic function, like so:
function tagWriter(type, cls, content) {
    let x = document.createElement(type);
    x.setAttribute("class", cls);
    x.innerText = content;
}
perhaps
*/

function title(name) {
    let title = document.createElement("h3");
    title.innerText = name;
    return title;
}
function createDiv(cls, content) {
    let div = document.createElement("div");
    div.setAttribute("class", cls);
    div.innerText = content; // egentligen create <p>, assign innertext to p
    return div;
}
function createProduct(product) {
    /* OUTPUT EXAMPLE
    <div class="product">
        <h3>produktnamn</h3>
        <img src="" alt="" class="productImage">
        <div class="price">price</div>
        <div class="description">description</div>
    </div>
    */
    let div = createDiv("product", null);
    let img = document.createElement("img");
    img.setAttribute("src", product.url);

    div.appendChild(title(product.name));
    div.appendChild(img);

    div.appendChild(createDiv("price", product.price));
    div.appendChild(createDiv("description", product.desc));

    return div;
}
function createPage(products) {
    let productDiv = document.getElementById("products");
    products.forEach(element => {
        productDiv.appendChild(
            createProduct(element)
        );
    });
}

// ----------------------------
// THIS IS NOT PRETTY BUT IT WORKS OKAY?
// I DEAL WITH THIS LATER
function displayProduct() {
    let y = document.getElementById("checkout");
    let x = document.getElementById("products");
    y.style.display = "none";
    x.style.display = "grid";
}

function displayCheckout() {
    let checkout = document.getElementById("checkout");
    let products = document.getElementById("products");
    products.style.display = "none";
    checkout.style.display = "grid";
}


// ----------------------------
// SUBMIT VALIDATION




const requireds = ["firstname", "lastname", "email", "street", "zip", "city"];
let inputs = Array.from(document.getElementsByTagName("input"));


document.getElementById("checkoutForm").addEventListener("submit", function(e){
    e.preventDefault();
    console.log(validate());
    if (!validate()) {
        inputs.filter(x => requireds.indexOf(x.name) >= 0 ? true : false)
            .forEach(x => inputValidation(x));
    } else {
        // submit
        console.log("Everything validated!");
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
    return inputs.filter(x => requireds.indexOf(x.name) >= 0 ? true : false )
        // .forEach(x => inputValidation(x))
        .every(x => inputValidation(x));
}



// inputs.forEach(x => x.addEventListener("keyup", e => {
//     if (requireds.indexOf(e.target.name) >= 0 && e.target.value.length < 2) {
//         e.target.setAttribute("class", "invalid");
//     } else if (e.target.name === "zip") {
//         if (e.target.value.length <= 4 || isNaN(e.target.value)) {
//             e.target.setAttribute("class", "invalid");
//         } else {
//             e.target.removeAttribute("class", "invalid");
//         }
//     } else {
//         e.target.removeAttribute("class", "invalid");
//     }
// }));

// document.getElementById("checkoutForm").addEventListener("submit", function(e){
//     e.preventDefault();
//     if (inputs.some(x => x.classList.contains("invalid") || )) {
//         console.log("not valid!");
//     }
// });


// document.getElementById("checkoutForm").addEventListener("submit", function(e) {
//     e.preventDefault();
//     if (validate()) {
//         // submit form?
//     }
// });

// function validate() {
//     let form = document.submitForm;
    
//     if (form.firstname.value == "") {
//         form.firstname.focus();
//         form.firstname.setAttribute("class", "invalid");
//         console.log("Hello World!");
//         return false;
//     }
//     if (form.lastname.value == "") {
//         form.lastname.focus();
//         form.lastname.setAttribute("class", "invalid");
//         return false;
//     }
//     if (form.email.value == "") {
//         form.email.focus();
//         form.email.setAttribute("class", "invalid");
//         return false;
//     }
//     if (form.street.value == "") {
//         form.street.focus();
//         form.street.setAttribute("class", "invalid");
//         return false;
//     }
//     if (form.zip.value == "") {
//         form.zip.focus();
//         form.zip.setAttribute("class", "invalid");
//         return false;
//     }
//     if (form.city.value == "") {
//         form.city.focus();
//         form.city.setAttribute("class", "invalid");
//         return false;
//     }
//     else {
//         return true;
//     }
// }

createPage(products);