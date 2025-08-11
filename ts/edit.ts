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

let originalEmpId: number | null = null;

document.addEventListener("DOMContentLoaded", () => {
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
  var countrySelect = document.getElementById("emp-country") as HTMLSelectElement;
  if (countrySelect) {
    countrySelect.innerHTML = countryOptions.map(function(c) {
      return '<option value="' + c + '">' + c + '</option>';
    }).join("");
  }

  // Populate state and city dropdowns
  var stateSelect = document.getElementById("emp-state") as HTMLSelectElement;
  var citySelect = document.getElementById("emp-city") as HTMLSelectElement;

  function updateStateOptions(selectedState?: string) {
    var selectedCountry = countrySelect.value;
    var states = stateOptions[selectedCountry] || [];
    stateSelect.innerHTML = states.map(function(s) {
      return '<option value="' + s + '">' + s + '</option>';
    }).join("");
    if (selectedState && states.indexOf(selectedState) !== -1) {
      stateSelect.value = selectedState;
    }
    updateCityOptions();
  }

  function updateCityOptions(selectedCity?: string) {
    var selectedState = stateSelect.value;
    var cities = cityOptions[selectedState] || [];
    citySelect.innerHTML = cities.map(function(ci) {
      return '<option value="' + ci + '">' + ci + '</option>';
    }).join("");
    if (selectedCity && cities.indexOf(selectedCity) !== -1) {
      citySelect.value = selectedCity;
    }
  }

  if (countrySelect && stateSelect && citySelect) {
    countrySelect.addEventListener("change", function() { updateStateOptions(); });
    stateSelect.addEventListener("change", function() { updateCityOptions(); });
  }

  const empData: Employee | null = JSON.parse(sessionStorage.getItem("editEmployee") || "null");
  if (empData) {
    originalEmpId = empData.id;
    // Set country first, then state, then city to ensure dropdowns are populated
    if (countrySelect) countrySelect.value = empData.address.country;
    updateStateOptions(empData.address.state);
    updateCityOptions(empData.address.city);
    fillForm(empData);
  }

  const form = document.getElementById("employeeForm") as HTMLFormElement | null;
  if (form) {
    form.addEventListener("submit", updateEmployee);
  } else {
    console.error("employeeForm not found.");
  }
});

function fillForm(emp: Employee): void {
  (document.getElementById("emp-id") as HTMLInputElement).value = emp.id.toString();
  (document.getElementById("emp-name") as HTMLInputElement).value = emp.name;
  (document.getElementById("emp-email") as HTMLInputElement).value = emp.email;
  (document.getElementById("emp-phone") as HTMLInputElement).value = emp.phone;
  (document.getElementById("emp-role") as HTMLSelectElement).value = emp.role;
  (document.getElementById("emp-street") as HTMLInputElement).value = emp.address.street;
  (document.getElementById("emp-locality") as HTMLInputElement).value = emp.address.locality;
  (document.getElementById("emp-country") as HTMLSelectElement).value = emp.address.country;
  (document.getElementById("emp-state") as HTMLSelectElement).value = emp.address.state;
  (document.getElementById("emp-city") as HTMLSelectElement).value = emp.address.city;
  (document.getElementById("emp-zipcode") as HTMLInputElement).value = emp.address.zip;
}

function updateEmployee(e: Event): void {
  e.preventDefault();

  if (originalEmpId === null) {
    alert("Employee ID not found.");
    return;
  }

  const updatedEmp: Employee = {
    id: originalEmpId,
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

  const employees: Employee[] = JSON.parse(localStorage.getItem("employees") || "[]");
  let index = -1;
  for (let i = 0; i < employees.length; i++) {
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
  } else {
    alert("Employee not found.");
  }
}