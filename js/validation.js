// SUBMIT VALIDATION
$("#checkoutForm").on("submit", function (e) {
    const required = ["FirstName", "LastName", "Email", "StreetAddress", "zip", "City"];
    e.preventDefault();
    //These are the required fields
    const requiredInputs = Array.from($("input"))
        .filter(x => required.indexOf(x.name) >= 0);
    if (!validate()) {
        requiredInputs.forEach(x => inputValidation(x));
    } else {
        submitOrder();
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