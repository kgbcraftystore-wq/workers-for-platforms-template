(function () {
  var STORAGE_KEY = "kgbPartnerEnquiries";
  var ADMIN_PASSWORD = "KGB@2026";

  function getEnquiries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveEnquiry(enquiry) {
    var enquiries = getEnquiries();
    enquiries.push(enquiry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
  }

  function openPartnerModal() {
    var modal = document.getElementById("partnerModal");
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closePartnerModal() {
    var modal = document.getElementById("partnerModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function setupPartnerForm() {
    var form = document.getElementById("partnerForm");
    var status = document.getElementById("partnerFormStatus");
    var closeButton = document.getElementById("closePartnerModal");
    var modal = document.getElementById("partnerModal");

    if (!form) return;

    window.setTimeout(openPartnerModal, 450);

    if (closeButton) {
      closeButton.addEventListener("click", closePartnerModal);
    }

    if (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) closePartnerModal();
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var formData = new FormData(form);
      var enquiry = {
        date: new Date().toLocaleString("en-IN"),
        fullName: String(formData.get("fullName") || "").trim(),
        contactNumber: String(formData.get("contactNumber") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        address: String(formData.get("address") || "").trim()
      };

      saveEnquiry(enquiry);
      form.reset();

      if (status) {
        status.textContent = "Thank you. Your enquiry has been recorded.";
      }

      window.setTimeout(closePartnerModal, 1200);
    });
  }

  function escapeCell(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderAdminTable() {
    var rows = document.getElementById("enquiryRows");
    var count = document.getElementById("enquiryCount");
    var enquiries = getEnquiries();

    if (count) {
      count.textContent = enquiries.length + (enquiries.length === 1 ? " enquiry" : " enquiries");
    }

    if (!rows) return;

    rows.innerHTML = enquiries.map(function (item) {
      return "<tr>" +
        "<td>" + escapeCell(item.date) + "</td>" +
        "<td>" + escapeCell(item.fullName) + "</td>" +
        "<td>" + escapeCell(item.contactNumber) + "</td>" +
        "<td>" + escapeCell(item.email) + "</td>" +
        "<td>" + escapeCell(item.address) + "</td>" +
      "</tr>";
    }).join("");
  }

  function csvValue(value) {
    return "\"" + String(value || "").replace(/"/g, "\"\"") + "\"";
  }

  function downloadCsv() {
    var enquiries = getEnquiries();
    var headers = ["Date", "Full Name", "Contact Number", "Email ID", "Address"];
    var lines = [headers.map(csvValue).join(",")];

    enquiries.forEach(function (item) {
      lines.push([
        item.date,
        item.fullName,
        item.contactNumber,
        item.email,
        item.address
      ].map(csvValue).join(","));
    });

    var blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "kgb-partner-enquiries.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function setupAdmin() {
    var login = document.getElementById("adminLogin");
    var password = document.getElementById("adminPassword");
    var status = document.getElementById("adminStatus");
    var content = document.getElementById("adminContent");
    var download = document.getElementById("downloadEnquiries");

    if (!login) return;

    login.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!password || password.value !== ADMIN_PASSWORD) {
        if (status) status.textContent = "Incorrect password.";
        return;
      }

      if (status) status.textContent = "";
      if (content) content.hidden = false;
      renderAdminTable();
    });

    if (download) {
      download.addEventListener("click", downloadCsv);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupPartnerForm();
    setupAdmin();
  });
}());
