let products = [
    { name: "Caltrops", price: "5 sp", desc: "Hurts to walk on", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Drevnosti_RG_v3_ill130c_-_Caltrop.jpg/250px-Drevnosti_RG_v3_ill130c_-_Caltrop.jpg", id: "1" } ];

let reviews = {
    "1": [
        {author: "Bob", title: "Very good.", content: "I thought this was a delightful item.", rating: "3"},
        {author: "John", title: "Disappointed", content: "This did not satisfy my sexual urges.", rating: "2"}],
    "2": []
};

function createPage(products) {
    $("#products").append(products.map(element => createProduct(element))
        .join(""));
    $(document).on("click", ".product", productClick);
    $(document).on("click", 'button[data-functionality="productButton"]', addToCart); //eslint-disable-line
    $(document).on("click", "a[data-functionality]", modCart);
    $(document).on("click", "#overlay", closeOverlay);
}

function modCart(e) {
    null;
}

function closeOverlay() {
    $("#overlay").empty().hide("slow");
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

function addToCart(e) {
    e.stopPropagation(); //stop event from bubbling up
}

function createProduct(product) {
    return `<div class="product" id="${product.id}">
        <h3>${product.name}</h3>
        <img src="${product.url}" alt="image of ${product.name}" class="productImage">
        <div class="meta">
            <div class="price">${product.price}</div>
            <div class="description">${product.desc}</div>
        </div>
        <button data-functionality="productButton">Add to cart</button>
    </div>`;
}

createPage(products);