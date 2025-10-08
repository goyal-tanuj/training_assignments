var PAGE_SIZE = 5;
var currentPage = 1;
var employees = [];
var filteredEmployees = [];
var sortColumn = null;
var sortAsc = true;
document.addEventListener("DOMContentLoaded", function () {
    try {
        employees = JSON.parse(localStorage.getItem("employees") || "[]");
    }
    catch (_a) {
        employees = [];
    }
    filteredEmployees = employees.slice();
    var filterInputs = {
        id: document.getElementById("filter-id"),
        name: document.getElementById("filter-name"),
        email: document.getElementById("filter-email"),
        phone: document.getElementById("filter-phone"),
        role: document.getElementById("filter-role"),
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
    window.sortTable = sortTable;
    window.clearFilters = clearFilters;
    window.addQuickEmployee = addQuickEmployee;
    renderTable();
    renderPagination();
    updateQuickAddId();
});
function applyFilters() {
    var _a, _b, _c, _d, _e;
    var idVal = ((_a = document.getElementById("filter-id")) === null || _a === void 0 ? void 0 : _a.value.trim().toLowerCase()) || "";
    var nameVal = ((_b = document.getElementById("filter-name")) === null || _b === void 0 ? void 0 : _b.value.trim().toLowerCase()) || "";
    var emailVal = ((_c = document.getElementById("filter-email")) === null || _c === void 0 ? void 0 : _c.value.trim().toLowerCase()) || "";
    var phoneVal = ((_d = document.getElementById("filter-phone")) === null || _d === void 0 ? void 0 : _d.value.trim().toLowerCase()) || "";
    var roleVal = ((_e = document.getElementById("filter-role")) === null || _e === void 0 ? void 0 : _e.value) || "";
    filteredEmployees = employees.filter(function (emp) {
        return ((!idVal || emp.id.toString().toLowerCase().indexOf(idVal) !== -1) &&
            (!nameVal || emp.name.toLowerCase().indexOf(nameVal) !== -1) &&
            (!emailVal || emp.email.toLowerCase().indexOf(emailVal) !== -1) &&
            (!phoneVal || emp.phone.toLowerCase().indexOf(phoneVal) !== -1) &&
            (!roleVal || emp.role === roleVal || roleVal === ""));
    });
    currentPage = 1;
    renderTable();
    renderPagination();
    updateQuickAddId();
}
function clearFilters() {
    document.getElementById("filter-id").value = "";
    document.getElementById("filter-name").value = "";
    document.getElementById("filter-email").value = "";
    document.getElementById("filter-phone").value = "";
    document.getElementById("filter-role").value = "";
    applyFilters();
}
function sortTable(column) {
    if (sortColumn === column) {
        sortAsc = !sortAsc;
    }
    else {
        sortColumn = column;
        sortAsc = true;
    }
    filteredEmployees.sort(function (a, b) {
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
    var tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    var start = (currentPage - 1) * PAGE_SIZE;
    var end = start + PAGE_SIZE;
    var pageEmployees = filteredEmployees.slice(start, end);
    pageEmployees.forEach(function (emp) {
        var _a, _b;
        var row = document.createElement("tr");
        row.innerHTML = "\n      <td>".concat(emp.id, "</td>\n      <td>").concat(emp.name, "</td>\n      <td>").concat(emp.email, "</td>\n      <td>").concat(emp.phone, "</td>\n      <td>").concat(emp.role, "</td>\n      <td>\n        <button class=\"btn btn-sm btn-primary edit-btn\">Edit</button>\n        <button class=\"btn btn-sm btn-danger delete-btn\">Delete</button>\n      </td>\n    ");
        (_a = row.querySelector(".edit-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { editEmployee(emp); });
        (_b = row.querySelector(".delete-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () { deleteEmployee(emp.id); });
        tableBody.appendChild(row);
    });
}
function renderPagination() {
    var paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";
    var totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
    for (var i = 1; i <= totalPages; i++) {
        var btn = document.createElement("button");
        btn.textContent = i.toString();
        btn.className = "btn btn-sm mx-1" + (i === currentPage ? " btn-primary" : " btn-outline-primary");
        btn.onclick = (function (page) {
            return function () {
                currentPage = page;
                renderTable();
                renderPagination();
                updateQuickAddId();
            };
        })(i);
        paginationDiv.appendChild(btn);
    }
}
function editEmployee(emp) {
    sessionStorage.setItem("editEmployee", JSON.stringify(emp));
    window.open("edit.html", "_blank");
}
function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?"))
        return;
    employees = employees.filter(function (emp) { return emp.id !== id; });
    localStorage.setItem("employees", JSON.stringify(employees));
    applyFilters();
}
function addQuickEmployee() {
    var name = document.getElementById("quick-name").value.trim();
    var email = document.getElementById("quick-email").value.trim();
    var phone = document.getElementById("quick-phone").value.trim();
    var role = document.getElementById("quick-role").value;
    if (!name || !email || !phone || !role) {
        alert("Please fill all fields.");
        return;
    }
    var newId = employees.length > 0 ? Math.max.apply(null, employees.map(function (emp) { return emp.id; })) + 1 : 1;
    var newEmp = {
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
    document.getElementById("quick-name").value = "";
    document.getElementById("quick-email").value = "";
    document.getElementById("quick-phone").value = "";
    document.getElementById("quick-role").value = "";
    updateQuickAddId();
}
function updateQuickAddId() {
    var quickIdInput = document.getElementById("quick-id");
    if (quickIdInput) {
        var nextId = employees.length > 0 ? Math.max.apply(null, employees.map(function (emp) { return emp.id; })) + 1 : 1;
        quickIdInput.value = nextId.toString();
    }
}
