
<script>
  // Toggle navbar on small screens
  function toggleNavbar() {
    var navbar = document.getElementById("myNavbar");
    if (navbar.className === "navbar") {
      navbar.className += " responsive";
    } else {
      navbar.className = "navbar";
      // Close all dropdowns when menu closes
      closeAllDropdowns();
    }
  }

  // Toggle dropdown on small screens
  function toggleDropdown(event) {
    event.stopPropagation(); // Prevent triggering navbar toggle
    var dropdown = event.currentTarget.parentElement;
    dropdown.classList.toggle("open");
  }

  // Close dropdowns if clicking outside
  window.onclick = function(event) {
    var navbar = document.getElementById("myNavbar");
    if (!navbar.contains(event.target)) {
      closeAllDropdowns();
    }
  };

  function closeAllDropdowns() {
    var dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(function(dropdown) {
      dropdown.classList.remove("open");
    });
  }
</script>