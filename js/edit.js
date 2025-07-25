const countryData = {
  India: {
    UttarPradesh: ["Lucknow", "Kanpur", "Noida"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  },
  USA: {
    California: ["Los Angeles", "San Francisco"],
    Texas: ["Houston", "Dallas"],
  },
};

document.addEventListener("DOMContentLoaded", () => {
  setupForm();
});
const existingData = sessionStorage.getItem("editEmployee");
if (existingData) {
  const emp = JSON.parse(existingData);
  sessionStorage.removeItem("editEmployee"); // Clear after loading

  document.getElementById("formTitle").textContent = "Edit Employee";
  document.getElementById("emp-id").value = emp.id;
  document.getElementById("emp-name").value = emp.name;
  document.getElementById("emp-email").value = emp.email;
  document.getElementById("emp-phone").value = emp.phone;
  document.getElementById("emp-role").value = emp.role;
  document.getElementById("emp-street").value = emp.address.street;
  document.getElementById("emp-locality").value = emp.address.locality;

  // Set dropdowns after triggering change events
  document.getElementById("emp-country").value = emp.address.country;
  document.getElementById("emp-country").dispatchEvent(new Event("change"));

  setTimeout(() => {
    document.getElementById("emp-state").value = emp.address.state;
    document.getElementById("emp-state").dispatchEvent(new Event("change"));

    setTimeout(() => {
      document.getElementById("emp-city").value = emp.address.city;
    }, 50);
  }, 50);

  document.getElementById("emp-zipcode").value = emp.address.zip;
}

function setupForm() {
  const form = document.getElementById("employeeForm");
  const countrySelect = document.getElementById("emp-country");
  const stateSelect = document.getElementById("emp-state");
  const citySelect = document.getElementById("emp-city");

  Object.keys(countryData).forEach(country =>
    countrySelect.add(new Option(country, country))
  );

  countrySelect.addEventListener("change", () => {
    const states = Object.keys(countryData[countrySelect.value] || {});
    updateOptions(stateSelect, states, "Select State");
    updateOptions(citySelect, [], "Select City");
  });

  stateSelect.addEventListener("change", () => {
    const cities = countryData[countrySelect.value]?.[stateSelect.value] || [];
    updateOptions(citySelect, cities, "Select City");
  });

  form.addEventListener("submit", saveEmployee);
}

function updateOptions(select, options, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  options.forEach(opt => select.add(new Option(opt, opt)));
}

function saveEmployee(e) {
  e.preventDefault();

  const emp = {
    id: Date.now(),
    name: getVal("emp-name"),
    email: getVal("emp-email"),
    phone: getVal("emp-phone"),
    role: getVal("emp-role"),
    address: {
      street: getVal("emp-street"),
      locality: getVal("emp-locality"),
      country: getVal("emp-country"),
      state: getVal("emp-state"),
      city: getVal("emp-city"),
      zip: getVal("emp-zipcode"),
    }
  };

  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.push(emp);
  localStorage.setItem("employees", JSON.stringify(employees));

  alert("Employee added successfully!");
  window.close(); 
}

function getVal(id) {
  return document.getElementById(id).value.trim();
}
function saveEmployee(e) {
  e.preventDefault();

  const emp = {
    id: Date.now(),
    name: getVal("emp-name"),
    email: getVal("emp-email"),
    phone: getVal("emp-phone"),
    role: getVal("emp-role"),
    address: {
      street: getVal("emp-street"),
      locality: getVal("emp-locality"),
      country: getVal("emp-country"),
      state: getVal("emp-state"),
      city: getVal("emp-city"),
      zip: getVal("emp-zipcode"),
    }
  };

  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  employees.push(emp);
  localStorage.setItem("employees", JSON.stringify(employees));

  alert("Employee added successfully!");

  if (window.opener && !window.opener.closed) {
    window.opener.location.reload();
  }

  window.close();
}

