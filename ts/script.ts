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

const PAGE_SIZE = 5;
let currentPage = 1;
let employees: Employee[] = [];
let filteredEmployees: Employee[] = [];
let sortColumn: keyof Employee | null = null;
let sortAsc = true;

document.addEventListener("DOMContentLoaded", function() {
  try {
    employees = JSON.parse(localStorage.getItem("employees") || "[]");
  } catch {
    employees = [];
  }
  filteredEmployees = employees.slice();

  // Filter inputs
  var filterInputs = {
    id: document.getElementById("filter-id") as HTMLInputElement,
    name: document.getElementById("filter-name") as HTMLInputElement,
    email: document.getElementById("filter-email") as HTMLInputElement,
    phone: document.getElementById("filter-phone") as HTMLInputElement,
    role: document.getElementById("filter-role") as HTMLSelectElement,
  };

  for (var key in filterInputs) {
    if (filterInputs.hasOwnProperty(key)) {
      var input = filterInputs[key];
      if (input) {
        input.addEventListener("input", applyFilters);
        input.addEventListener("change", applyFilters);
      }
    }
  }

  (window as any).sortTable = sortTable;
  (window as any).clearFilters = clearFilters;
  (window as any).addQuickEmployee = addQuickEmployee;

  renderTable();
  renderPagination();
  updateQuickAddId();
});

function applyFilters() {
  var idVal = (document.getElementById("filter-id") as HTMLInputElement)?.value.trim().toLowerCase() || "";
  var nameVal = (document.getElementById("filter-name") as HTMLInputElement)?.value.trim().toLowerCase() || "";
  var emailVal = (document.getElementById("filter-email") as HTMLInputElement)?.value.trim().toLowerCase() || "";
  var phoneVal = (document.getElementById("filter-phone") as HTMLInputElement)?.value.trim().toLowerCase() || "";
  var roleVal = (document.getElementById("filter-role") as HTMLSelectElement)?.value || "";

  filteredEmployees = employees.filter(function(emp) {
    return (
      (!idVal || emp.id.toString().toLowerCase().indexOf(idVal) !== -1) &&
      (!nameVal || emp.name.toLowerCase().indexOf(nameVal) !== -1) &&
      (!emailVal || emp.email.toLowerCase().indexOf(emailVal) !== -1) &&
      (!phoneVal || emp.phone.toLowerCase().indexOf(phoneVal) !== -1) &&
      (!roleVal || emp.role === roleVal || roleVal === "")
    );
  });

  currentPage = 1;
  renderTable();
  renderPagination();
  updateQuickAddId();
}

function clearFilters() {
  (document.getElementById("filter-id") as HTMLInputElement).value = "";
  (document.getElementById("filter-name") as HTMLInputElement).value = "";
  (document.getElementById("filter-email") as HTMLInputElement).value = "";
  (document.getElementById("filter-phone") as HTMLInputElement).value = "";
  (document.getElementById("filter-role") as HTMLSelectElement).value = "";
  applyFilters();
}

function sortTable(column: keyof Employee) {
  if (sortColumn === column) {
    sortAsc = !sortAsc;
  } else {
    sortColumn = column;
    sortAsc = true;
  }
  filteredEmployees.sort(function(a, b) {
    var valA = a[column];
    var valB = b[column];
    if (typeof valA === "string" && typeof valB === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });
  renderTable();
  renderPagination();
}

function renderTable() {
  var tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
  tableBody.innerHTML = "";

  var start = (currentPage - 1) * PAGE_SIZE;
  var end = start + PAGE_SIZE;
  var pageEmployees = filteredEmployees.slice(start, end);

  pageEmployees.forEach(function(emp) {
    var row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.name}</td>
      <td>${emp.email}</td>
      <td>${emp.phone}</td>
      <td>${emp.role}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-btn">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn">Delete</button>
      </td>
    `;
    row.querySelector(".edit-btn")?.addEventListener("click", function() { editEmployee(emp); });
    row.querySelector(".delete-btn")?.addEventListener("click", function() { deleteEmployee(emp.id); });
    tableBody.appendChild(row);
  });
}

function renderPagination() {
  var paginationDiv = document.getElementById("pagination") as HTMLDivElement;
  paginationDiv.innerHTML = "";
  var totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);

  for (var i = 1; i <= totalPages; i++) {
    var btn = document.createElement("button");
    btn.textContent = i.toString();
    btn.className = "btn btn-sm mx-1" + (i === currentPage ? " btn-primary" : " btn-outline-primary");
    btn.onclick = (function(page) {
      return function() {
        currentPage = page;
        renderTable();
        renderPagination();
        updateQuickAddId();
      };
    })(i);
    paginationDiv.appendChild(btn);
  }
}

function editEmployee(emp: Employee): void {
  sessionStorage.setItem("editEmployee", JSON.stringify(emp));
  window.open("edit.html", "_blank");
}

function deleteEmployee(id: number): void {
  if (!confirm("Are you sure you want to delete this employee?")) return;
  employees = employees.filter(function(emp) { return emp.id !== id; });
  localStorage.setItem("employees", JSON.stringify(employees));
  applyFilters();
}

function addQuickEmployee(): void {
  var name = (document.getElementById("quick-name") as HTMLInputElement).value.trim();
  var email = (document.getElementById("quick-email") as HTMLInputElement).value.trim();
  var phone = (document.getElementById("quick-phone") as HTMLInputElement).value.trim();
  var role = (document.getElementById("quick-role") as HTMLSelectElement).value;

  if (!name || !email || !phone || !role) {
    alert("Please fill all fields.");
    return;
  }

  var newId = employees.length > 0 ? Math.max.apply(null, employees.map(function(emp) { return emp.id; })) + 1 : 1;
  var newEmp: Employee = {
    id: newId,
    name: name,
    email: email,
    phone: phone,
    role: role,
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
  applyFilters();

  // Clear quick add fields
  (document.getElementById("quick-name") as HTMLInputElement).value = "";
  (document.getElementById("quick-email") as HTMLInputElement).value = "";
  (document.getElementById("quick-phone") as HTMLInputElement).value = "";
  (document.getElementById("quick-role") as HTMLSelectElement).value = "";
  updateQuickAddId();
}

function updateQuickAddId() {
  var quickIdInput = document.getElementById("quick-id") as HTMLInputElement;
  if (quickIdInput) {
    var nextId = employees.length > 0 ? Math.max.apply(null, employees.map(function(emp) { return emp.id; })) + 1 : 1;
    quickIdInput.value = nextId.toString();
  }
}