let employees = [];
let filteredEmployees = [];
const recordsPerPage = 5;
let currentPage = 1;
let sortKey = null;
let sortAsc = true;

document.addEventListener("DOMContentLoaded", async () => {
  const stored = JSON.parse(localStorage.getItem("employees")) || [];
  try {
    const resp = await fetch("employee.json");
    const dummy = await resp.json();
    const unique = [
      ...stored,
      ...dummy.filter(emp => !stored.some(se => se.id == emp.id))
    ];
    employees = unique;
    localStorage.setItem("employees", JSON.stringify(employees));
  } catch {
    employees = stored;
  }
  filteredEmployees = [...employees];

  setupFilters();
  renderTable();
});

function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  const start = (currentPage - 1) * recordsPerPage;
  const paginated = filteredEmployees.slice(start, start + recordsPerPage);
  paginated.forEach(emp => {
    const index = employees.findIndex(e => e.id === emp.id);
    tbody.appendChild(createRow(emp, index));
  });
  renderPagination();
}

function createRow(emp, index) {
  return Object.assign(
    document.createElement("tr"),
    {
      innerHTML: `
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.phone}</td>
        <td>${emp.role}</td>
        <td>
          <button onclick="editEmployee(${index})">Edit</button>
          <button onclick="deleteEmployee(${index})">Delete</button>
        </td>`
    }
  );
}

function renderPagination() {
  const pag = document.getElementById("pagination");
  pag.innerHTML = "";
  const pageCount = Math.ceil(filteredEmployees.length / recordsPerPage);
  if (pageCount <= 1) return;

  const btn = (l, d, fn) => {
    const b = document.createElement("button");
    b.textContent = l;
    b.disabled = d;
    b.onclick = fn;
    return b;
  };

  pag.appendChild(btn("Previous", currentPage === 1, () => {
    currentPage--;
    renderTable();
  }));

  for (let i = 1; i <= pageCount; i++) {
    pag.appendChild(btn(i, i === currentPage, () => {
      currentPage = i;
      renderTable();
    }));
  }

  pag.appendChild(btn("Next", currentPage === pageCount, () => {
    currentPage++;
    renderTable();
  }));
}

function deleteEmployee(idx) {
  if (!confirm("Delete this employee?")) return;
  employees.splice(idx, 1);
  localStorage.setItem("employees", JSON.stringify(employees));
  filteredEmployees = [...employees];
  renderTable();
}

function editEmployee(idx) {
  const emp = employees[idx];
  sessionStorage.setItem("editEmployee", JSON.stringify(emp));
  window.open("edit.html", );
}
function setupFilters() {
  const fields = ["id", "name", "email", "phone"];

fields.forEach(field => {
  const input = document.getElementById(`filter-${field}`);
  if (!input) return;

  input.addEventListener("input", applyFilters);
});

const roleFilter = document.getElementById("filter-role");
roleFilter.addEventListener("change", applyFilters);

function applyFilters() {
  const filterValues = {
    id: document.getElementById("filter-id").value.toLowerCase(),
    name: document.getElementById("filter-name").value.toLowerCase(),
    email: document.getElementById("filter-email").value.toLowerCase(),
    phone: document.getElementById("filter-phone").value.toLowerCase(),
    role: document.getElementById("filter-role").value.toLowerCase(),
  };

  filteredEmployees = employees.filter(emp => {
    return (
      emp.id.toString().includes(filterValues.id) &&
      emp.name.toLowerCase().includes(filterValues.name) &&
      emp.email.toLowerCase().includes(filterValues.email) &&
      emp.phone.toLowerCase().includes(filterValues.phone) &&
      (filterValues.role === "" || emp.role.toLowerCase() === filterValues.role)
    );
  });

  currentPage = 1;
  renderTable();
}

}

function sortTable(key) {
  sortAsc = (sortKey === key) ? !sortAsc : true;
  sortKey = key;
  filteredEmployees.sort((a, b) => {
    const va = a[key], vb = b[key];
    if (!isNaN(va) && !isNaN(vb)) return sortAsc ? va - vb : vb - va;
    return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });
  currentPage = 1;
  renderTable();
}
function addQuickEmployee() {
  const name = document.getElementById("quick-name").value.trim();
  const email = document.getElementById("quick-email").value.trim();
  const phone = document.getElementById("quick-phone").value.trim();
  const role = document.getElementById("quick-role").value;

  if (!name || !email || !phone || !role) {
    alert("Please fill all fields before adding.");
    return;
  }

  const newEmp = {
    id: Date.now(),
    name,
    email,
    phone,
    role,
    address: {
      street: "",
      locality: "",
      country: "",
      state: "",
      city: "",
      zip: ""
    }
  };

  employees.push(newEmp);
  localStorage.setItem("employees", JSON.stringify(employees));
  filteredEmployees = [...employees];
  currentPage = 1;

  document.getElementById("quick-name").value = "";
  document.getElementById("quick-email").value = "";
  document.getElementById("quick-phone").value = "";
  document.getElementById("quick-role").value = "";

  renderTable();
}

function clearFilters() {
  const filterFields = ["filter-id", "filter-name", "filter-email", "filter-phone", "filter-role"];
  filterFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  filteredEmployees = [...employees];
  currentPage = 1;
  renderTable();
}
