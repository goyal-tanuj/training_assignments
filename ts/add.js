document.addEventListener("DOMContentLoaded", function () {
    var countryOptions = ["India", "USA"];
    var stateOptions = {
        India: ["Delhi", "Maharashtra"],
        USA: ["California", "Texas"]
    };
    var cityOptions = {
        Delhi: ["New Delhi", "Dwarka"],
        Maharashtra: ["Mumbai", "Pune"],
        California: ["Los Angeles", "San Francisco"],
        Texas: ["Houston", "Dallas"]
    };
    var countrySelect = document.getElementById("emp-country");
    if (countrySelect) {
        countrySelect.innerHTML = countryOptions.map(function (c) {
            return '<option value="' + c + '">' + c + '</option>';
        }).join("");
    }
    var stateSelect = document.getElementById("emp-state");
    var citySelect = document.getElementById("emp-city");
    function updateStateOptions() {
        var selectedCountry = countrySelect.value;
        var states = stateOptions[selectedCountry] || [];
        stateSelect.innerHTML = states.map(function (s) {
            return '<option value="' + s + '">' + s + '</option>';
        }).join("");
        updateCityOptions();
    }
    function updateCityOptions() {
        var selectedState = stateSelect.value;
        var cities = cityOptions[selectedState] || [];
        citySelect.innerHTML = cities.map(function (ci) {
            return '<option value="' + ci + '">' + ci + '</option>';
        }).join("");
    }
    if (countrySelect && stateSelect && citySelect) {
        countrySelect.addEventListener("change", updateStateOptions);
        stateSelect.addEventListener("change", updateCityOptions);
        updateStateOptions();
    }
    var form = document.getElementById("employeeForm");
    if (form) {
        form.addEventListener("submit", addEmployee);
    }
    else {
        console.error("employeeForm not found.");
    }
});
function addEmployee(e) {
    e.preventDefault();
    var employees = JSON.parse(localStorage.getItem("employees") || "[]");
    var newId = employees.length > 0 ? Math.max.apply(null, employees.map(function (emp) { return emp.id; })) + 1 : 1;
    var newEmp = {
        id: newId,
        name: document.getElementById("emp-name").value.trim(),
        email: document.getElementById("emp-email").value.trim(),
        phone: document.getElementById("emp-phone").value.trim(),
        role: document.getElementById("emp-role").value,
        address: {
            street: document.getElementById("emp-street").value.trim(),
            locality: document.getElementById("emp-locality").value.trim(),
            country: document.getElementById("emp-country").value,
            state: document.getElementById("emp-state").value,
            city: document.getElementById("emp-city").value,
            zip: document.getElementById("emp-zipcode").value.trim(),
        }
    };
    employees.push(newEmp);
    localStorage.setItem("employees", JSON.stringify(employees));
    alert("Employee added successfully!");
    window.location.href = "index.html";
}
