const products = [
    { name: "Caltrops", price: "5 sp", desc: "Hurts to walk on", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Drevnosti_RG_v3_ill130c_-_Caltrop.jpg/250px-Drevnosti_RG_v3_ill130c_-_Caltrop.jpg", id: "1" }, 
    { name: "Bedroll", price: "1 gp", desc: "To sleep in.", url: "https://images-na.ssl-images-amazon.com/images/I/41inhK8vL5L._SY355_.jpg", id: "2" }, 
    { name: "Block and tackle", price: "1 gp", desc: "To lift heavy things with.", url: "https://i.ebayimg.com/images/g/p64AAOSwBLlU8XG1/s-l300.jpg", id: "3" },
    { name: "Book, blank", price: "5 gp", desc: "To write or draw in, for the aspiring mage.", url: "https://cdn.instructables.com/FZQ/Y2M0/I9FGT1YD/FZQY2M0I9FGT1YD.LARGE.jpg", id: "4" },
    { name: "Book, reading", price: "10 gp", desc: "A steamy novel, for those lonely nights.", url: "http://www.worldoflongmire.com/features/romance_novels/love_bum.jpg", id: "5" } ];
const reviews = {
    "1": [
        {author: "Bob", title: "Very good.", content: "I thought this was a delightful item.", rating: "3"},
        {author: "John", title: "Disappointed", content: "This did not satisfy my sexual urges.", rating: "2"}],
    "2": []
};
const cart = {};

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
//updates cart HTML
function update(cart, products) {
    $("#cartlist").html(buildCartHTML(cart, products));
    $("#cartTotal").text(Object.keys(cart).
        reduce(function (sum, key) {
            return sum + cart[key];
        }, 0));
}
function createProduct(product) {
    return `<div class="product" id="${product.id}">
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


function productClick(e) {
    let id = $(e.target).closest(".product")[0].id;
    let productDiv = $(e.target).closest(".product")[0];

    //we show products like dis
    $("#overlay").show("slow").css("display", "grid");
    $(productDiv).clone().removeAttr("id").appendTo($("#overlay")).on("click", function(e){
        e.stopPropagation();
    });

    $("#overlay").append('<div id="reviewContainer">').append(inputTemplate()); //eslint-disable-line
    updateReviews(id);

    $(".leaveReview").on("click", function(e){
        e.stopPropagation();
        e.preventDefault();

        if (e.target.innerText === "Submit") { //this isn't amazing
            let name;
            let title;
            let review;
            let rating;

            $("#review").children("input, select, textarea").each(function() {
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
            reviews[id].unshift({ author: name, title: title, content: review, rating: rating });
            updateReviews(id);
            $("#review").trigger("reset"); //empty form
        }
    });
}


function updateReviews(id) {
    $("#reviewContainer").empty().append(
        reviews[id].map(rev => buildReviewEntry(rev)).join("")
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
    return `<div class="review">
    <h4>${review.title}</h4>
    <div>${review.content}
        <p><span class="author">${review.author}</span></p>
    </div>
    <div>Rating: ${review.rating}/5</div>
    </div>`;
}

function closeOverlay() {
    $("#overlay").empty().hide("slow");
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