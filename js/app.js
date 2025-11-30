

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
        Swal.fire("No login details found in localStorage!", "warning");
        return;
    }

    if (adminDetails[0] === userName && adminDetails[1] === password) {
     
        window.location.replace("adminPanel.html");
    } else {
        Swal.fire("Invalid username or password", "warning");
    }
}

 

function placeOrder() {
    let orderId = document.getElementById("orderId").value;
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

        let tempCusArray = JSON.parse(localStorage.getItem("customers")) || [];

        for (let i = 0; i < tempCusArray.length; i++) {
            if (tempCusArray[i].phone === customerPhoneNumber) {

                tempCusArray[i].orders.push({
                    orderId: orderId,
                    name: itemName,
                    itemQty: qty,
                    unitPrice: price
                });

                localStorage.setItem("customers", JSON.stringify(tempCusArray));
                document.getElementById("orderId").value = generateOrderId();
                document.getElementById("orderBurgerName").value = "";
                document.getElementById("orderQty").value = "1";
                document.getElementById("customerName").value = "";
                document.getElementById("customerPhone").value = "";
                document.getElementById("orderBurgerPrice").value = "";
                return;
            }
        }

        tempCusArray.push({
            name: customerName,
            phone: customerPhoneNumber,
            orders: [{
                orderId:orderId,
                name: itemName,
                itemQty: qty,
                unitPrice: price
            }]
        });

        localStorage.setItem("customers", JSON.stringify(tempCusArray));
        document.getElementById("orderId").value = generateOrderId();
        document.getElementById("orderBurgerName").value = "";
        document.getElementById("orderQty").value = "1";
        document.getElementById("customerName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("orderBurgerPrice").value = "";
    }
}

function searchCustomer() {

    let customerPhone = document.getElementById("customerPhone").value.trim();

    let tempArray = JSON.parse(localStorage.getItem("customers")) || [];

    for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].phone === customerPhone) {
            document.getElementById("customerName").value = tempArray[i].name;
            return;
        }
    }
    document.getElementById("customerName").value = "";
}


function generateOrderId() {
    let customers = JSON.parse(localStorage.getItem("customers"));
    let orders = customers[customers.length-1].orders;

    if (!customers || customers.length === 0) {
        return "OR0001";
    }
    let lastOrderId = orders[orders.length-1].orderId;
    let lastNumber = parseInt(lastOrderId.replace("OR", ""));
    return "OR" + String(lastNumber+1).padStart(4, "0");
}


 
 