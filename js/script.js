let employees = JSON.parse(localStorage.getItem("employees")) || [];
const recordsPerPage = 5;
let currentPage = 1;

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
  renderTable();
  setupForm();
  setupFilters();
});

function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedEmployees = employees.slice(startIndex, endIndex);

  paginatedEmployees.forEach((emp, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.name}</td>
      <td>${emp.email}</td>
      <td>${emp.phone}</td>
      <td>${emp.role}</td>
      <td>
        <button onclick="editEmployee(${employees.indexOf(emp)})">Edit</button>
        <button onclick="deleteEmployee(${employees.indexOf(emp)})">Delete</button>
      </td>`;
    tbody.appendChild(row);
  });

  renderPagination();
}
function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const pageCount = Math.ceil(employees.length / recordsPerPage);

  if (pageCount <= 1) return;

  const prev = document.createElement("button");
  prev.innerText = "Previous";
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    currentPage--;
    renderTable();
  };
  pagination.appendChild(prev);

  for (let i = 1; i <= pageCount; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.innerText = i;
    if (i === currentPage) pageBtn.disabled = true;
    pageBtn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    pagination.appendChild(pageBtn);
  }

  const next = document.createElement("button");
  next.innerText = "Next";
  next.disabled = currentPage === pageCount;
  next.onclick = () => {
    currentPage++;
    renderTable();
  };
  pagination.appendChild(next);
}


function setupForm() {
  const countrySelect = document.getElementById("emp-country");
  const stateSelect = document.getElementById("emp-state");
  const citySelect = document.getElementById("emp-city");

  // Populate country
  Object.keys(countryData).forEach(country => {
    const opt = new Option(country, country);
    countrySelect.add(opt);
  });

  countrySelect.addEventListener("change", () => {
    stateSelect.innerHTML = "<option value=''>Select State</option>";
    citySelect.innerHTML = "<option value=''>Select City</option>";
    if (countrySelect.value) {
      Object.keys(countryData[countrySelect.value]).forEach(state => {
        stateSelect.add(new Option(state, state));
      });
    }
  });

  stateSelect.addEventListener("change", () => {
    citySelect.innerHTML = "<option value=''>Select City</option>";
    const cities = countryData[countrySelect.value][stateSelect.value] || [];
    cities.forEach(city => {
      citySelect.add(new Option(city, city));
    });
  });

  document.getElementById("employeeForm").addEventListener("submit", saveEmployee);
  document.getElementById("addBtn").addEventListener("click", () => showForm());
  document.getElementById("cancelBtn").addEventListener("click", () => hideForm());
}

function saveEmployee(e) {
  e.preventDefault();
  const emp = {
    id: document.getElementById("emp-id").value || Date.now(),
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
      zip: document.getElementById("emp-zipcode").value.trim()
    }
  };

  const index = employees.findIndex(e => e.id == emp.id);
  if (index > -1) employees[index] = emp;
  else employees.push(emp);

  localStorage.setItem("employees", JSON.stringify(employees));
  hideForm();
  renderTable();
}

function deleteEmployee(index) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    renderTable();
  }
}

function editEmployee(index) {
  const emp = employees[index];
  showForm(true);
  document.getElementById("formTitle").innerText = "Edit Employee";
  document.getElementById("emp-id").value = emp.id;
  document.getElementById("emp-name").value = emp.name;
  document.getElementById("emp-email").value = emp.email;
  document.getElementById("emp-phone").value = emp.phone;
  document.getElementById("emp-role").value = emp.role;
  document.getElementById("emp-street").value = emp.address.street;
  document.getElementById("emp-locality").value = emp.address.locality;
  document.getElementById("emp-country").value = emp.address.country;
  document.getElementById("emp-country").dispatchEvent(new Event('change'));
  setTimeout(() => {
    document.getElementById("emp-state").value = emp.address.state;
    document.getElementById("emp-state").dispatchEvent(new Event('change'));
    setTimeout(() => {
      document.getElementById("emp-city").value = emp.address.city;
    }, 100);
  }, 100);
  document.getElementById("emp-zipcode").value = emp.address.zip;
}

function showForm(edit = false) {
  document.getElementById("formContainer").classList.remove("hidden");
  document.getElementById("formTitle").innerText = edit ? "Edit Employee" : "Add Employee";
  if (!edit) document.getElementById("employeeForm").reset();
}

function hideForm() {
  document.getElementById("formContainer").classList.add("hidden");
  document.getElementById("employeeForm").reset();
}

function setupFilters() {
  const filters = ["id", "name", "email", "phone", "role"];
  filters.forEach(field => {
    document.getElementById(`filter-${field}`).addEventListener("input", () => {
      const values = filters.map(f => document.getElementById(`filter-${f}`).value.toLowerCase());
      const rows = document.querySelectorAll("#tableBody tr");
      rows.forEach((row, index) => {
        const cells = Array.from(row.children);
        const show = filters.every((f, i) => {
          return cells[i].innerText.toLowerCase().includes(values[i]);
        });
        row.style.display = show ? "" : "none";
      });
    });
  });
}
