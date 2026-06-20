(function () {
  var storageKey = "kgbPartnerEnquiries";
  var adminPassword = "kgbadmin";
  var modal = document.getElementById("partnerModal");
  var form = document.getElementById("partnerForm");
  var status = document.getElementById("formStatus");
  var closeButton = document.getElementById("modalCloseButton");

  function getEnquiries() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveEnquiry(enquiry) {
    var enquiries = getEnquiries();
    enquiries.push(enquiry);
    localStorage.setItem(storageKey, JSON.stringify(enquiries));
  }

  function openModal() {
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    var firstInput = form.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    saveEnquiry({
      submittedAt: new Date().toLocaleString(),
      fullName: data.get("fullName"),
      companyName: data.get("companyName"),
      designation: data.get("designation"),
      contactNumber: data.get("contactNumber"),
      email: data.get("email"),
      address: data.get("address")
    });

    form.reset();
    status.textContent = "Thank you. Your partner enquiry has been submitted.";
    setTimeout(closeModal, 1200);
  });

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  window.addEventListener("load", openModal);
})();
