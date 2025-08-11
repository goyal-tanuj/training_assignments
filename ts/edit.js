var originalEmpId = null;
document.addEventListener("DOMContentLoaded", function () {
    // Sample data for dropdowns
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
    // Populate country dropdown
    var countrySelect = document.getElementById("emp-country");
    if (countrySelect) {
        countrySelect.innerHTML = countryOptions.map(function (c) {
            return '<option value="' + c + '">' + c + '</option>';
        }).join("");
    }
    // Populate state and city dropdowns
    var stateSelect = document.getElementById("emp-state");
    var citySelect = document.getElementById("emp-city");
    function updateStateOptions(selectedState) {
        var selectedCountry = countrySelect.value;
        var states = stateOptions[selectedCountry] || [];
        stateSelect.innerHTML = states.map(function (s) {
            return '<option value="' + s + '">' + s + '</option>';
        }).join("");
        if (selectedState && states.indexOf(selectedState) !== -1) {
            stateSelect.value = selectedState;
        }
        updateCityOptions();
    }
    function updateCityOptions(selectedCity) {
        var selectedState = stateSelect.value;
        var cities = cityOptions[selectedState] || [];
        citySelect.innerHTML = cities.map(function (ci) {
            return '<option value="' + ci + '">' + ci + '</option>';
        }).join("");
        if (selectedCity && cities.indexOf(selectedCity) !== -1) {
            citySelect.value = selectedCity;
        }
    }
    if (countrySelect && stateSelect && citySelect) {
        countrySelect.addEventListener("change", function () { updateStateOptions(); });
        stateSelect.addEventListener("change", function () { updateCityOptions(); });
    }
    var empData = JSON.parse(sessionStorage.getItem("editEmployee") || "null");
    if (empData) {
        originalEmpId = empData.id;
        // Set country first, then state, then city to ensure dropdowns are populated
        if (countrySelect)
            countrySelect.value = empData.address.country;
        updateStateOptions(empData.address.state);
        updateCityOptions(empData.address.city);
        fillForm(empData);
    }
    var form = document.getElementById("employeeForm");
    if (form) {
        form.addEventListener("submit", updateEmployee);
    }
    else {
        console.error("employeeForm not found.");
    }
});
function fillForm(emp) {
    document.getElementById("emp-id").value = emp.id.toString();
    document.getElementById("emp-name").value = emp.name;
    document.getElementById("emp-email").value = emp.email;
    document.getElementById("emp-phone").value = emp.phone;
    document.getElementById("emp-role").value = emp.role;
    document.getElementById("emp-street").value = emp.address.street;
    document.getElementById("emp-locality").value = emp.address.locality;
    document.getElementById("emp-country").value = emp.address.country;
    document.getElementById("emp-state").value = emp.address.state;
    document.getElementById("emp-city").value = emp.address.city;
    document.getElementById("emp-zipcode").value = emp.address.zip;
}
function updateEmployee(e) {
    e.preventDefault();
    if (originalEmpId === null) {
        alert("Employee ID not found.");
        return;
    }
    var updatedEmp = {
        id: originalEmpId,
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
    var employees = JSON.parse(localStorage.getItem("employees") || "[]");
    var index = -1;
    for (var i = 0; i < employees.length; i++) {
        if (employees[i].id === updatedEmp.id) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        employees[index] = updatedEmp;
        localStorage.setItem("employees", JSON.stringify(employees));
        alert("Employee updated successfully!");
        window.close();
    }
    else {
        alert("Employee not found.");
    }
}
