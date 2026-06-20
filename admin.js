(function () {
  var storageKey = "kgbPartnerEnquiries";
  var adminPassword = "kgbadmin";
  var isUnlocked = false;
  var adminLock = document.getElementById("adminLock");
  var adminContent = document.getElementById("adminContent");
  var loginForm = document.getElementById("adminLoginForm");
  var passwordInput = document.getElementById("adminPasswordInput");
  var loginStatus = document.getElementById("adminLoginStatus");
  var tableBody = document.getElementById("enquiryTableBody");
  var emptyState = document.getElementById("emptyState");
  var enquiryCount = document.getElementById("enquiryCount");
  var downloadButton = document.getElementById("downloadEnquiriesButton");
  var refreshButton = document.getElementById("refreshEnquiriesButton");
  var clearButton = document.getElementById("clearEnquiriesButton");

  function getEnquiries() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function csvCell(value) {
    return '"' + String(value || "").replace(/"/g, '""') + '"';
  }

  function renderEnquiries() {
    var enquiries = getEnquiries();
    tableBody.innerHTML = "";
    enquiryCount.textContent = enquiries.length === 1 ? "1 enquiry" : enquiries.length + " enquiries";
    emptyState.hidden = enquiries.length > 0;

    enquiries.forEach(function (item) {
      var row = document.createElement("tr");
      [
        item.submittedAt,
        item.fullName,
        item.companyName,
        item.designation,
        item.contactNumber,
        item.email,
        item.address
      ].forEach(function (value) {
        var cell = document.createElement("td");
        cell.textContent = value || "";
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
  }

  function downloadCsv() {
    var enquiries = getEnquiries();
    if (!enquiries.length) {
      alert("No partner enquiries are saved yet.");
      return;
    }

    var headers = [
      "Submitted At",
      "Full Name",
      "Company Name",
      "Designation",
      "Contact Number",
      "Email ID",
      "Address"
    ];

    var rows = enquiries.map(function (item) {
      return [
        item.submittedAt,
        item.fullName,
        item.companyName,
        item.designation,
        item.contactNumber,
        item.email,
        item.address
      ].map(csvCell).join(",");
    });

    var csv = headers.map(csvCell).join(",") + "\n" + rows.join("\n");
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "kgb-groups-partner-enquiries.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function clearEnquiries() {
    if (!confirm("Delete all saved partner enquiry details?")) {
      return;
    }

    localStorage.removeItem(storageKey);
    renderEnquiries();
    alert("All saved partner enquiry details have been deleted.");
  }

  function unlockAdmin() {
    isUnlocked = true;
    adminLock.hidden = true;
    adminContent.hidden = false;
    renderEnquiries();
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (passwordInput.value.trim().toLowerCase() === adminPassword) {
      unlockAdmin();
      return;
    }
    loginStatus.textContent = "Incorrect admin password.";
  });

  downloadButton.addEventListener("click", function () {
    if (!isUnlocked) {
      passwordInput.focus();
      loginStatus.textContent = "Unlock admin access before downloading.";
      return;
    }
    downloadCsv();
  });

  refreshButton.addEventListener("click", renderEnquiries);
  clearButton.addEventListener("click", clearEnquiries);
})();
