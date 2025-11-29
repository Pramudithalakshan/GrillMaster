
fetch("nav.html")
    .then(res => res.text())
    .then(nav => {
        document.getElementById("navBar").innerHTML = nav;
    })

const ar = ["Lakshan", "123"]
localStorage.setItem("loginDetails", JSON.stringify(ar));

function login() {
    let userName = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    const adminDetails = JSON.parse(localStorage.getItem("loginDetails"));

    if (!adminDetails) {
        console.log("No login details found in localStorage!");
        return;
    }

    if (adminDetails[0] === userName && adminDetails[1] === password) {
        console.log("Nice"); // Login success
    } else {
        console.log("Invalid username or password");
    }
}

function placeOrder() {
    let itemName = document.getElementById("orderBurgerName").value.trim();
    let qty = document.getElementById("orderQty").value.trim();
    let customerName = document.getElementById("customerName").value.trim();
    let customerPhoneNumber = document.getElementById("customerPhone").value.trim();
    let price = document.getElementById("orderBurgerPrice").value.trim();
    if (itemName === "" || qty === "" || customerName === "" || customerPhoneNumber === "" || price === "") {
        Swal.fire("Missing Fields", "Please fill all the fields", "warning");
        return;
    } else { 
        let total = qty * price;

        Swal.fire({
            title: "Invoice",
            html: `
            <div style="text-align: left; font-size: 16px;">
                <p><strong>Customer Name:</strong> ${customerName}</p>
                <p><strong>Customer Phone:</strong> ${customerPhoneNumber}</p>
                <p><strong>Item Name:</strong> ${itemName}</p>
                <p><strong>Quantity:</strong> ${qty}</p>
                <p><strong>Price (each):</strong> Rs. ${price}</p>
                <hr>
                <p><strong>Total:</strong> <span style="font-size: 20px; color: #28a745;">Rs. ${total}</span></p>
            </div>
        `,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#28a745",
            width: "350px"
        });

        document.getElementById("orderBurgerName").value = "";
        document.getElementById("orderQty").value = "1";
        document.getElementById("customerName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("orderBurgerPrice").value = "";
    }
}



