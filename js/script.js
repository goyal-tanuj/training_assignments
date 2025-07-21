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

  const paginated = employees.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
  paginated.forEach(emp => tbody.appendChild(createRow(emp)));

  renderPagination();
}

function createRow(emp) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${emp.id}</td>
    <td>${emp.name}</td>
    <td>${emp.email}</td>
    <td>${emp.phone}</td>
    <td>${emp.role}</td>
    <td>
      <button onclick="editEmployee(${employees.findIndex(e => e.id === emp.id)})">Edit</button>
      <button onclick="deleteEmployee(${employees.findIndex(e => e.id === emp.id)})">Delete</button>
    </td>`;
  return row;
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const pageCount = Math.ceil(employees.length / recordsPerPage);
  if (pageCount <= 1) return;

  const navBtn = (label, disabled, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    btn.onclick = onClick;
    return btn;
  };

  pagination.appendChild(navBtn("Previous", currentPage === 1, () => { currentPage--; renderTable(); }));

  for (let i = 1; i <= pageCount; i++) {
    pagination.appendChild(navBtn(i, i === currentPage, () => { currentPage = i; renderTable(); }));
  }

  pagination.appendChild(navBtn("Next", currentPage === pageCount, () => { currentPage++; renderTable(); }));
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
    updateOptions(stateSelect, Object.keys(countryData[countrySelect.value] || {}), "Select State");
    updateOptions(citySelect, [], "Select City");
  });

  stateSelect.addEventListener("change", () => {
    const cities = countryData[countrySelect.value]?.[stateSelect.value] || [];
    updateOptions(citySelect, cities, "Select City");
  });

  form.addEventListener("submit", saveEmployee);
  document.getElementById("addBtn").onclick = () => showForm();
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
  index > -1 ? employees.splice(index, 1, emp) : employees.push(emp);

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

  document.getElementById("emp-country").dispatchEvent(new Event('change'));
  setTimeout(() => {
    set("emp-state", emp.address.state);
    document.getElementById("emp-state").dispatchEvent(new Event('change'));
    setTimeout(() => set("emp-city", emp.address.city), 100);
  }, 100);

  set("emp-zipcode", emp.address.zip);
}

function getVal(id) {
  return document.getElementById(id).value.trim();
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
  const fields = ["id", "name", "email", "phone", "role"];
  fields.forEach(field => {
    document.getElementById(`filter-${field}`).addEventListener("input", () => {
      const values = fields.map(f => document.getElementById(`filter-${f}`).value.toLowerCase());
      document.querySelectorAll("#tableBody tr").forEach(row => {
        const cells = [...row.children];
        const visible = fields.every((_, i) => cells[i].innerText.toLowerCase().includes(values[i]));
        row.style.display = visible ? "" : "none";
      });
    });
  });
}
