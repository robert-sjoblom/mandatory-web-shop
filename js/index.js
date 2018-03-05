const products = [
    { name: "Caltrops", price: "5 sp", desc: "Hurts to walk on", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Drevnosti_RG_v3_ill130c_-_Caltrop.jpg/250px-Drevnosti_RG_v3_ill130c_-_Caltrop.jpg", id: "1" },
    { name: "Bedroll", price: "1 gp", desc: "To sleep in.", url: "https://images-na.ssl-images-amazon.com/images/I/41inhK8vL5L._SY355_.jpg", id: "2" },
    { name: "Block and tackle", price: "1 gp", desc: "To lift heavy things with.", url: "https://i.ebayimg.com/images/g/p64AAOSwBLlU8XG1/s-l300.jpg", id: "3" },
    { name: "Book, blank", price: "5 gp", desc: "To write or draw in, for the aspiring mage.", url: "https://cdn.instructables.com/FZQ/Y2M0/I9FGT1YD/FZQY2M0I9FGT1YD.LARGE.jpg", id: "4" },
    { name: "Book, reading", price: "10 gp", desc: "A steamy novel, for those lonely nights.", url: "https://nicolarwhite.files.wordpress.com/2017/02/harlequin001.jpg", id: "5" }];
const reviews = {
    "1": [
        { author: "Bob", title: "Very good.", content: "I thought this was a delightful item.", rating: "3" },
        { author: "Dick", title: "Disappointed", content: "This did not satisfy my urges.", rating: "2" }],
    "2": [
        { author: "Harry", title: "Good.", content: "I thought this was a delightful item.", rating: "3" },
        { author: "Bart", title: "Very good.", content: "This is a text", rating: "3" },
        { author: "Lisa", title: "Very good.", content: "Another text.", rating: "3" },
        { author: "Maggie", title: "Very good.", content: "I thought this was a delightful item.", rating: "3" }
    ],
    "3": [
        { author: "Bob", title: "No hamburgers", content: "Did not feature any hamburgers", rating: "1" },
        { author: "Linda", title: "Very good.", content: "I thought this was a delightful item.", rating: "3" },
        { author: "Tina", title: "Very good.", content: "I thought this was a delightful item.", rating: "3" }
    ],
    "4": [
        { author: "Bob", title: "No hamburgers", content: "Did not feature any hamburgers", rating: "1" },
        { author: "Linda", title: "Very good.", content: "I thought this was a delightful item.", rating: "3" },
        { author: "Tina", title: "Very good.", content: "I thought this was a delightful item.", rating: "3" }
    ],
    "5": [
        { author: "Bob", title: "No hamburgers", content: "Did not feature any hamburgers", rating: "1" },
        { author: "Linda", title: "Very good.", content: "I thought this was a delightful item.", rating: "3" },
        { author: "Tina", title: "Very good.", content: "I thought this was a delightful item.", rating: "3" }
    ]
};
const cart = {};

function buildCartHTML(cart, products) {
    const items = Object.keys(cart).map(key =>
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
    e.stopPropagation(); //prevent event from bubbling up
    const productID = $(this).closest(".product").attr("data-value");
    if (productID in cart) {
        cart[productID] += 1;
    } else {
        cart[productID] = 1;
    }
    update(cart, products);
}
function modCart() {
    const productID = $(this).closest("div").attr("data-value");
    if ($(this).hasClass("add")) {
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
    // this builds the div html for the checkout page
    $("#cartlist").html(buildCartHTML(cart, products));

    // updates the total amount of items in cart value
    $("#cartTotal").text(Object.keys(cart).
        reduce(function (sum, key) {
            return sum + cart[key];
        }, 0));
}
function createProduct(product) {
    return `<div class="product" data-value="${product.id}">
        <h3>${product.name}</h3>
        <img src="${product.url}" alt="image of ${product.name}" class="productImage">
        <div class="price">${product.price}</div>
        <div class="description">${product.desc}</div>
        <button data-functionality="productButton">Add to cart</button>
    </div>`;
}
function createPage(products) {
    $("#products").append(products.map(element => createProduct(element))
        .join(""));
    $(document).on("click", ".product", productClick);
    $(document).on("click", 'button[data-functionality="productButton"]', addToCart); //eslint-disable-line
    $(document).on("click", "a[data-functionality]", modCart);
    $(document).on("click", "#overlay", closeOverlay);
}

function leaveReview(e, productID) {
    if (e.target.innerText === "Submit") { //this isn't amazing
        let name;
        let title;
        let review;
        let rating;

        $("#review").children("input, select, textarea").each(function () {
            if (this.name === "name") {
                name = this.value;
            } else if (this.name === "title") {
                title = this.value;
            } else if (this.name === "userReview") {
                review = this.value;
            } else if (this.name === "rating") {
                rating = this.value;
            }
        });
        reviews[productID].unshift({ author: name, title: title, content: review, rating: rating });
        updateReviews(productID);
        $("#review").trigger("reset"); //empty form
    }
}

function productClick(e) {
    const productID = $(this).closest(".product").attr("data-value");
    const productDiv = $(this).closest(".product");

    //we show products like dis
    $("#overlay").show("slow").css("display", "grid");
    $(productDiv).clone().appendTo($("#overlay")).on("click", function (e) {
        e.stopPropagation();
    });

    //new button, so hook up a new handler for that.
    //In retrospect, event delegation could have been handled better.
    $("#overlay .product button").on("click", addToCart);
    $("#overlay").append('<div id="reviewContainer">').append(inputTemplate()); //eslint-disable-line
    $(".leaveReview").on("click", function(e) {
        //I can't figure out how to stop the propagation if I don't do this.
        //Not good.
        e.stopPropagation();
        e.preventDefault();
        leaveReview(e, productID);
    });
    //we update the view
    updateReviews(productID);
}

function updateReviews(productID) {
    $("#reviewContainer").empty().append(
        reviews[productID].map(rev => buildReviewEntry(rev)).join("")
    );
}

function inputTemplate() {
    return `<div class="leaveReview">
    <fieldset>
        <legend>Leave a review</legend>
        <form id="review" name="reviewForm">

            Name: <input type="text" name="name" placeholder="Name" style="display: inline-block">
            Title: <input type="text" name="title" placeholder="Title" style="display: inline-block">
            <br>
            Rating: 
            <select name="rating">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <br>
            Review: <textarea name="userReview" cols="20" rows="4" placeholder="Please leave a review."></textarea>
            <button>Submit</button>
        </form>
    </fieldset>
</div>`;
}

function buildReviewEntry(review) {
    const star = ["<div>"];
    for (let i = 0; i < review.rating; i++) {
        star.push("<span>&#9733</span>");
    }
    star.push("</div>");

    return `<div class="review">
    <h4>${review.title}</h4>
    <div>${review.content}
        <p><span class="author">${review.author}</span></p>
    </div>
    ${star.join("")}
    </div>`;
}

function closeOverlay() {
    $("#overlay").empty().hide("slow");
}
// BEYOND THIS POINT LIVES MONSTERS
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

// SUBMIT VALIDATION
$("#checkoutForm").on("submit", function (e) {
    const required = ["firstname", "lastname", "email", "street", "zip", "city"];
    e.preventDefault();
    //These are the required fields
    const requiredInputs = Array.from($("input"))
        .filter(x => required.indexOf(x.name) >= 0);
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