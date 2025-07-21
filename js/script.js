let employees = [];
let filteredEmployees = [];
const recordsPerPage = 5;
let currentPage = 1;
let sortKey = null;
let sortAsc = true;

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

document.addEventListener("DOMContentLoaded", async () => {
  const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];

  try {
    const response = await fetch("employee.json");
    const dummyEmployees = await response.json();

    const uniqueEmployees = [
      ...storedEmployees,
      ...dummyEmployees.filter(emp => !storedEmployees.some(se => se.id == emp.id))
    ];

    employees = uniqueEmployees;
    localStorage.setItem("employees", JSON.stringify(employees));
  } catch (error) {
    console.error("Failed to load employee.json:", error);
    employees = storedEmployees;
  }

  filteredEmployees = [...employees];

  setupForm();
  setupFilters();
  setupSorting();
  renderTable();
});

function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * recordsPerPage;
  const end = currentPage * recordsPerPage;
  const paginated = filteredEmployees.slice(start, end);

  paginated.forEach((emp, index) => {
    tbody.appendChild(createRow(emp, employees.indexOf(emp))); // use original index for editing/deleting
  });

  renderPagination();
}

function createRow(emp, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${emp.id}</td>
    <td>${emp.name}</td>
    <td>${emp.email}</td>
    <td>${emp.phone}</td>
    <td>${emp.role}</td>
    <td>
      <button onclick="editEmployee(${index})">Edit</button>
      <button onclick="deleteEmployee(${index})">Delete</button>
    </td>`;
  return row;
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const pageCount = Math.ceil(filteredEmployees.length / recordsPerPage);

  if (pageCount <= 1) return;

  const navBtn = (label, disabled, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    btn.onclick = onClick;
    return btn;
  };

  pagination.appendChild(navBtn("Previous", currentPage === 1, () => {
    currentPage--;
    renderTable();
  }));

  for (let i = 1; i <= pageCount; i++) {
    pagination.appendChild(navBtn(i, i === currentPage, () => {
      currentPage = i;
      renderTable();
    }));
  }

  pagination.appendChild(navBtn("Next", currentPage === pageCount, () => {
    currentPage++;
    renderTable();
  }));
}

function setupForm() {
  const form = document.getElementById("employeeForm");
  const countrySelect = document.getElementById("emp-country");
  const stateSelect = document.getElementById("emp-state");
  const citySelect = document.getElementById("emp-city");

  Object.keys(countryData).forEach(country => {
    countrySelect.add(new Option(country, country));
  });

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
  document.getElementById("cancelBtn").onclick = () => hideForm();
}

function updateOptions(select, options, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  options.forEach(opt => select.add(new Option(opt, opt)));
}

function saveEmployee(e) {
  e.preventDefault();

  const emp = {
    id: document.getElementById("emp-id").value || Date.now(),
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

  const index = employees.findIndex(e => e.id == emp.id);
  if (index >= 0) {
    employees.splice(index, 1, emp);
  } else {
    employees.push(emp);
  }

  localStorage.setItem("employees", JSON.stringify(employees));
  filteredEmployees = [...employees];
  currentPage = 1;
  hideForm();
  renderTable();
}

function deleteEmployee(index) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    filteredEmployees = [...employees];
    renderTable();
  }
}

function editEmployee(index) {
  const emp = employees[index];
  showForm(true);
  document.getElementById("formTitle").innerText = "Edit Employee";
  fillForm(emp);
}

function fillForm(emp) {
  const set = (id, val) => document.getElementById(id).value = val;

  set("emp-id", emp.id);
  set("emp-name", emp.name);
  set("emp-email", emp.email);
  set("emp-phone", emp.phone);
  set("emp-role", emp.role);
  set("emp-street", emp.address.street);
  set("emp-locality", emp.address.locality);
  set("emp-country", emp.address.country);
  document.getElementById("emp-country").dispatchEvent(new Event("change"));

  setTimeout(() => {
    set("emp-state", emp.address.state);
    document.getElementById("emp-state").dispatchEvent(new Event("change"));

    setTimeout(() => {
      set("emp-city", emp.address.city);
    }, 50);
  }, 50);

  set("emp-zipcode", emp.address.zip);
}

function getVal(id) {
  return document.getElementById(id).value.trim();
}

function showForm(editing = false) {
  document.getElementById("formContainer").classList.remove("hidden");
  document.getElementById("formTitle").innerText = editing ? "Edit Employee" : "Add Employee";
  if (!editing) document.getElementById("employeeForm").reset();
}

function hideForm() {
  document.getElementById("formContainer").classList.add("hidden");
  document.getElementById("employeeForm").reset();
}

function setupFilters() {
  const fields = ["id", "name", "email", "phone", "role"];

  fields.forEach((field, index) => {
    const input = document.getElementById(`filter-${field}`);
    if (!input) return;

    input.addEventListener("input", () => {
      const filterValues = fields.map(f =>
        document.getElementById(`filter-${f}`)?.value.toLowerCase().trim() || ""
      );

      filteredEmployees = employees.filter(emp => {
        const values = [
          emp.id.toString(),
          emp.name.toLowerCase(),
          emp.email.toLowerCase(),
          emp.phone.toLowerCase(),
          emp.role.toLowerCase()
        ];
        return filterValues.every((filter, i) => values[i].includes(filter));
      });

      currentPage = 1;
      renderTable();
    });
  });
}

function setupSorting() {
  const headers = document.querySelectorAll("thead th.sortable");
  headers.forEach(header => {
    header.addEventListener("click", () => {
      const key = header.dataset.key;
      sortTable(key);
    });
  });
}

function sortTable(key) {
  if (sortKey === key) {
    sortAsc = !sortAsc;
  } else {
    sortKey = key;
    sortAsc = true;
  }

  filteredEmployees.sort((a, b) => {
    let valA = key === "zip" ? a.address.zip : a[key];
    let valB = key === "zip" ? b.address.zip : b[key];

    if (!isNaN(valA) && !isNaN(valB)) {
      return sortAsc ? valA - valB : valB - valA;
    }

    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  currentPage = 1;
  renderTable();
}
function showForm(editing = false) {
  document.getElementById('formContainer').style.display = 'flex';
  document.getElementById("formContainer").classList.remove("hidden");
  document.getElementById("modalBackdrop").classList.remove("hidden");
  document.getElementById("formTitle").innerText = editing ? "Edit Employee" : "Add Employee";
  if (!editing) document.getElementById("employeeForm").reset();
}

function hideForm() {
  document.getElementById('formContainer').style.display = 'none';
  document.getElementById("formContainer").classList.add("hidden");
  document.getElementById("modalBackdrop").classList.add("hidden");
  document.getElementById("employeeForm").reset();
}
