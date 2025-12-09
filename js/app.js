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

    let reader = new FileReader();
    reader.onload = function (e) {
        let productImg = e.target.result;
        storeProduct(productName, productCategory, productPrice, productDesc, productImg);
    };
    reader.readAsDataURL(imagePicker.files[0]);
}

function storeProduct(productName, productCategory, productPrice, productDesc, productImg) {
    let tempProductArray = JSON.parse(localStorage.getItem("products")) || [];

    for (let i = 0; i < tempProductArray.length; i++) {
        if (tempProductArray[i].productName === productName) {
            Swal.fire("Update Product", "Product Updated Successfully", "success");
            tempProductArray[i].productPrice = productPrice;
            tempProductArray[i].productDesc = productDesc;
            tempProductArray[i].productImg = productImg;
            localStorage.setItem("products", JSON.stringify(tempProductArray));
            clearProductForm();
            loadProductCards();
            loadProduct();
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
    loadProduct();
}

function loadProductCards() {
    let tempProductArray = JSON.parse(localStorage.getItem("products")) || [];
    let html = '';
    let count = 1;
    for (let i = 0; i < tempProductArray.length; i++) {
        html += `
            <div class="col-md-4">
                <div class="card burger-card shadow-sm">
                    <img id="img${count}" src="${tempProductArray[i].productImg}" class="card-img-top" alt="${tempProductArray[i].productName}" style="height: 200px; object-fit: cover;">
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
    let input5 = document.getElementById("avaiableProducts");
    if (input5) loadProduct();
    let input6 = document.getElementById('orderId');
    if (input6) input6.value = generateOrderId();
});
function loadCustomer() {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let html = '';
    for (let i = 0; i < customers.length; i++) {
        html += `
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td>${customers[i].name}</td>
                                            <td>${customers[i].phone}</td>
                                            <td class="table-actions">
                                                <button class="btn btn-sm btn-warning btn-action" onclick="loadUpdateCustomerForm('${customers[i].name}', '${customers[i].phone}')"><i
                                                        class="fas fa-edit"></i> Edit</button>
                                                <button class="btn btn-sm btn-danger btn-action" onclick="deleteCustomer('${customers[i].phone}');"><i
                                                        class="fas fa-trash"></i> Delete</button>
                                            </td>
                                        </tr>`;
    }
    document.getElementById("customerTable").innerHTML = html;
}
function loadUpdateCustomerForm(cName, cPhone) {
    document.getElementById("customerUpdateForm").innerHTML = ` 
                 <div class="card">
                        <div class="card-header">
                            <i class="fas fa-user-plus me-2"></i>Update Customer
                        </div>
                        <div class="card-body">
                            <form>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Cutomer Name</label>
                                        <input type="text" id="updateCustomerName" class="form-control" placeholder="Enter first name" value="${cName}">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Phone</label>
                                        <input type="tel" id="updateCustomerPhone" class="form-control" placeholder="Enter phone number" value="${cPhone}">
                                    </div>
                                </div>
                                <button type="button" class="btn btn-primary" onclick="updateCustomer('${cPhone}');"><i class="fas fa-save me-2"></i>Update Customer</button>
                                <button type="reset" class="btn btn-secondary"><i class="fas fa-undo me-2"></i>Reset</button>
                            </form>
                        </div>
                    </div>`
}
function updateCustomer(cPhone) {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let newCustomerName = document.getElementById("updateCustomerName").value.trim();
    let newCustomerPhone = document.getElementById("updateCustomerPhone").value.trim();

    if (newCustomerName === "" || newCustomerPhone === "") {
        Swal.fire("Missing Fields", "Please fill name and phone", "warning");
        return;
    }

    for (let i = 0; i < customers.length; i++) {
        if (customers[i].phone === cPhone) {
            if (customers[i].name === newCustomerName && customers[i].phone === newCustomerPhone) {
                Swal.fire("No changes", "Name and phone are unchanged", "info");
                return;
            }

            customers[i].name = newCustomerName;
            customers[i].phone = newCustomerPhone;
            localStorage.setItem("customers", JSON.stringify(customers));
            document.getElementById("customerUpdateForm").innerHTML = "";
            loadCustomer();
            Swal.fire("Updated", "Customer updated successfully", "success");
            return;
        }
    }
    Swal.fire("Not found", "Customer not found", "error");
}

function deleteCustomer(cPhone) {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let index = -1;

    for (let i = 0; i < customers.length; i++) {
        if (customers[i].phone === cPhone) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        Swal.fire("Not found", "Customer not found", "error");
        return;
    }

    customers.splice(index, 1);
    localStorage.setItem("customers", JSON.stringify(customers));
    Swal.fire("Deleted", "Customer removed successfully", "success");
    loadCustomer();
}

function loadOrder() {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    for (let i = 0; i < customers.length; i++) {
        let orders = customers[i].orders || [];
        let html = '';
        for (let j = 0; j < orders.length; j++) {

            html += `
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
        document.getElementById("orderTable").innerHTML = html;
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
    let count = 1;
    let html = '';
    for (let i = 0; i < products.length; i++) {
        html += `                     
                                      <td>${count}</td>
                                            <td>${products[i].productName}</td>
                                            <td>${products[i].productCategory}</td>
                                            <td>${products[i].productPrice}</td>
                                            <td class="table-actions">
                                                <button class="btn btn-sm btn-warning btn-action" onclick="loadProductDetailsForm('${products[i].productName}','${i}');"><i
                                                        class="fas fa-edit"></i> Edit</button>
                                                <button class="btn btn-sm btn-danger btn-action" onclick="deleteProduct('${products[i].productName}');"><i
                                                        class="fas fa-trash"></i> Delete</button>
                                         </td>`
    }
    document.getElementById("avaiableProducts").innerHTML = html;
    count++;
}
function loadProductDetailsForm(pName, productId) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    for (let i = 0; i < products.length; i++) {
        if (products[i].productName === pName) {
            document.getElementById("productName").value = products[i].productName;
            document.getElementById("productCategory").value = products[i].productCategory;
            document.getElementById("productPrice").value = products[i].productPrice;
            document.getElementById("productDesc").value = products[i].productDesc;
            document.getElementById("productId").value = productId;
        }
    }
}
function updateProduct() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let productId = Number(document.getElementById("productId").value);

    let productNewName = document.getElementById("productName").value;
    let productNewCategory = document.getElementById("productCategory").value;
    let productNewPrice = document.getElementById("productPrice").value;
    let productNewDesc = document.getElementById("productDesc").value;
    let imageInput = document.getElementById("imagePicker");

    if (productNewName === "" || productNewCategory === "" || productNewPrice === "" || productNewDesc === "") {
        Swal.fire("Missing Fields", "Please fill all fields", "warning");
        return;
    }

    let reader = new FileReader();

    reader.onload = function (e) {
        let newImg = e.target.result;
        if (products[productId]) {

            if (
                products[productId].productName === productNewName &&
                products[productId].productCategory === productNewCategory &&
                products[productId].productPrice === productNewPrice &&
                products[productId].productDesc === productNewDesc &&
                products[productId].productImg === newImg
            ) {
                Swal.fire("No changes", "Product details are unchanged", "info");
                return;
            }
            products[productId].productName = productNewName;
            products[productId].productCategory = productNewCategory;
            products[productId].productPrice = productNewPrice;
            products[productId].productDesc = productNewDesc;
            products[productId].productImg = newImg;

            localStorage.setItem("products", JSON.stringify(products));
            Swal.fire("Updated", "Product updated successfully ok", "success");

            clearProductForm();
            loadProduct();
        } else {
            Swal.fire("Not found", "Product not found", "error");
        }
    };

    if (imageInput.files.length > 0) {
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        reader.onload({ target: { result: products[productId].productImg } });
    }
}


function clearProductForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productDesc").value = "";
    document.getElementById("imagePicker").value = "";
}

function deleteProduct(product) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let index = -1;

    for (let i = 0; i < products.length; i++) {
        if (products[i].productName === product) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        Swal.fire("Not found", "Customer not found", "error");
        return;
    }

    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    Swal.fire("Deleted", "Product removed successfully", "success");
    loadProduct();
}