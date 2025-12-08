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
                <p><strong>Date:</strong> Rs. ${currentTime()}</p>
                <p><strong>Date:</strong>Processing</p>
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
                    unitPrice: price,
                    date: currentTime(),
                    status: "Processing"
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
                orderId: orderId,
                name: itemName,
                itemQty: qty,
                unitPrice: price,
                date: currentTime(),
                status: "Processing"
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

    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let maxNum = 0;
    for (let i = 0; i < customers.length; i++) {
        let orders = customers[i].orders || [];
        for (let j = 0; j < orders.length; j++) {
            let id = orders[j].orderId || '';
            let num = parseInt(id.replace("OR", '')) || 0;
            if (num > maxNum) maxNum = num;
        }
    }
    let next = maxNum + 1;
    return 'OR' + String(next).padStart(4, '0');
}

function addProduct() {
    let productName = document.getElementById("productName").value;
    let productCategory = document.getElementById("productCategory").value;
    let productPrice = document.getElementById("productPrice").value;
    let productDesc = document.getElementById("productDesc").value;
    let imagePicker = document.getElementById("imagePicker");

    if (productName === "" || productCategory === "" || productPrice === "" || productDesc === "") {
        Swal.fire("Missing Fields", "Please fill all the fields", "warning");
        return;
    }

    if (!imagePicker.files || imagePicker.files.length === 0) {
        Swal.fire("Missing Image", "Please select an image", "warning");
        return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
        var productImg = e.target.result;
        storeProduct(productName, productCategory, productPrice, productDesc, productImg);
    };
    reader.readAsDataURL(imagePicker.files[0]);
}

function storeProduct(productName, productCategory, productPrice, productDesc, productImg) {
    var tempProductArray = JSON.parse(localStorage.getItem("products")) || [];

    for (var i = 0; i < tempProductArray.length; i++) {
        if (tempProductArray[i].productName === productName) {
            Swal.fire("Update Product", "Product Updated Successfully", "success");
            tempProductArray[i].productPrice = productPrice;
            tempProductArray[i].productDesc = productDesc;
            tempProductArray[i].productImg = productImg;
            localStorage.setItem("products", JSON.stringify(tempProductArray));
            clearProductForm();
            loadProductCards();
            return;
        }
    }

    Swal.fire("Add Product", "Product Added Successfully", "success");

    tempProductArray.push({
        productName: productName,
        productCategory: productCategory,
        productPrice: productPrice,
        productDesc: productDesc,
        productImg: productImg
    });

    localStorage.setItem("products", JSON.stringify(tempProductArray));
    clearProductForm();
    loadProductCards();
}

function clearProductForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productDesc").value = "";
    document.getElementById("imagePicker").value = "";
}
function loadProductCards() {
    var tempProductArray = JSON.parse(localStorage.getItem("products")) || [];
    var html = '';
    for (var i = 0; i < tempProductArray.length; i++) {
        html += `
            <div class="col-md-4">
                <div class="card burger-card shadow-sm">
                    <img src="${tempProductArray[i].productImg}" class="card-img-top" alt="${tempProductArray[i].productName}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${tempProductArray[i].productName}</h5>
                        <p class="card-text">${tempProductArray[i].productDesc}</p>
                        <p class="fw-bolder">Rs. ${tempProductArray[i].productPrice}</p>
                    </div>
                </div>
            </div>`;
    }
    document.getElementById("productList").innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
    let input1 = document.getElementById("customerTable");
    if (input1) loadCustomer();
    let input2 = document.getElementById("orderTable");
    if (input2) loadOrder();
    let input3 = document.getElementById("totalCustomers");
    if (input3) loadDashboard();
    let input4 = document.getElementById("productList");
    if (input4) loadProductCards();
    let input5 = document.getElementById("productList");
    if(input5) loadProduct();
    let input6 = document.getElementById('orderId');
    if (input6) input.value = generateOrderId();
});
function loadCustomer() {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let num = 0;
    for (let i = 0; i < customers.length; i++) {
        document.getElementById("customerTable").innerHTML = `
                                        <tr>
                                            <td>${num + 1}</td>
                                            <td>${customers[i].name}</td>
                                            <td>${customers[i].phone}</td>
                                            <td class="table-actions">
                                                <button class="btn btn-sm btn-warning btn-action"><i
                                                        class="fas fa-edit"></i> Edit</button>
                                                <button class="btn btn-sm btn-danger btn-action"><i
                                                        class="fas fa-trash"></i> Delete</button>
                                            </td>
                                        </tr>`
    }
}


function loadOrder() {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    for (let i = 0; i < customers.length; i++) {
        let orders = customers[i].orders || [];
        for (let j = 0; j < orders.length; j++) {

            document.getElementById("orderTable").innerHTML = `
                                        <tr>
                                            <td>${orders[j].orderId}</td>
                                            <td>${customers[i].name}</td>
                                            <td>${orders[j].name}</td>
                                            <td>${orders[j].itemQty}</td>
                                            <td>${orders[j].unitPrice * orders[j].itemQty}</td>
                                            <td><span class="badge bg-info">${orders[j].status}</span></td>
                                            <td>${orders[i].date}</td>
                                            <td class="table-actions">
                                                <button class="btn btn-sm btn-warning btn-action"><i
                                                        class="fas fa-edit"></i> Edit</button>
                                                <button class="btn btn-sm btn-danger btn-action"><i
                                                        class="fas fa-trash"></i> Delete</button>
                                            </td>
                                        </tr>`
        }
    }
}

function currentTime() {
    const now = new Date();
    return now.toLocaleString();
}

function loadDashboard() {
    let customerCount = 0;
    let productCount = 0;
    let orderCount = 0;
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];
    for (let i = 0; i < customers.length; i++) {
        let orders = customers[i].orders || [];
        customerCount++;
        for (let j = 0; j < orders.length; j++) {
            orderCount++;
        }
    }
    for (let i = 0; i < products.length; i++) {
        productCount++;
    }
    document.getElementById("totalCustomers").innerText = customerCount;
    document.getElementById("totalProducts").innerText = productCount;
    document.getElementById("totalOrders").innerText = orderCount;
}

function loadProduct() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let count=1;
    for (let i = 0; i < products.length; i++) {
        document.getElementById("productList").innerHTML = ` 
                                      <td>${count}</td>
                                            <td>${products[i].productName}</td>
                                            <td>${products[i].productCategory}</td>
                                            <td>${products[i].productPrice}</td>
                                            <td class="table-actions">
                                                <button class="btn btn-sm btn-warning btn-action"><i
                                                        class="fas fa-edit"></i> Edit</button>
                                                <button class="btn btn-sm btn-danger btn-action"><i
                                                        class="fas fa-trash"></i> Delete</button>
                                         </td>`
    }
    count++;
}