
fetch("nav.html")
    .then(res => res.text())
    .then(nav => {
        document.getElementById("navBar").innerHTML = nav;
    })
 
const ar = ["Lakshan", "123"]
localStorage.setItem("loginDetails", JSON.stringify(ar));

function login(){  
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

