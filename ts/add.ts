interface Address {
  street: string;
  locality: string;
  country: string;
  state: string;
  city: string;
  zip: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: Address;
}

document.addEventListener("DOMContentLoaded", () => {
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

  var countrySelect = document.getElementById("emp-country") as HTMLSelectElement;
  if (countrySelect) {
    countrySelect.innerHTML = countryOptions.map(function(c) {
      return '<option value="' + c + '">' + c + '</option>';
    }).join("");
  }

  var stateSelect = document.getElementById("emp-state") as HTMLSelectElement;
  var citySelect = document.getElementById("emp-city") as HTMLSelectElement;

  function updateStateOptions() {
    var selectedCountry = countrySelect.value;
    var states = stateOptions[selectedCountry] || [];
    stateSelect.innerHTML = states.map(function(s) {
      return '<option value="' + s + '">' + s + '</option>';
    }).join("");
    updateCityOptions();
  }

  function updateCityOptions() {
    var selectedState = stateSelect.value;
    var cities = cityOptions[selectedState] || [];
    citySelect.innerHTML = cities.map(function(ci) {
      return '<option value="' + ci + '">' + ci + '</option>';
    }).join("");
  }

  if (countrySelect && stateSelect && citySelect) {
    countrySelect.addEventListener("change", updateStateOptions);
    stateSelect.addEventListener("change", updateCityOptions);
    updateStateOptions();
  }

  var form = document.getElementById("employeeForm") as HTMLFormElement | null;
  if (form) {
    form.addEventListener("submit", addEmployee);
  } else {
    console.error("employeeForm not found.");
  }
});

function addEmployee(e: Event): void {
  e.preventDefault();

  var employees: Employee[] = JSON.parse(localStorage.getItem("employees") || "[]");
  var newId = employees.length > 0 ? Math.max.apply(null, employees.map(function(emp) { return emp.id; })) + 1 : 1;

  var newEmp: Employee = {
    id: newId,
    name: (document.getElementById("emp-name") as HTMLInputElement).value.trim(),
    email: (document.getElementById("emp-email") as HTMLInputElement).value.trim(),
    phone: (document.getElementById("emp-phone") as HTMLInputElement).value.trim(),
    role: (document.getElementById("emp-role") as HTMLSelectElement).value,
    address: {
      street: (document.getElementById("emp-street") as HTMLInputElement).value.trim(),
      locality: (document.getElementById("emp-locality") as HTMLInputElement).value.trim(),
      country: (document.getElementById("emp-country") as HTMLSelectElement).value,
      state: (document.getElementById("emp-state") as HTMLSelectElement).value,
      city: (document.getElementById("emp-city") as HTMLSelectElement).value,
      zip: (document.getElementById("emp-zipcode") as HTMLInputElement).value.trim(),
    }
  };

  employees.push(newEmp);
  localStorage.setItem("employees", JSON.stringify(employees));
  alert("Employee added successfully!");
  window.location.href = "index.html";
}