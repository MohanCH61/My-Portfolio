(function ($) {
  "use strict";

  // PRE LOADER
  $(window).on("load", function () {
    $(".preloader").fadeOut(1000); // set duration in brackets    
  });

  // CUSTOM LINK SCROLL
  $(".custom-link").click(function () {
    var el = $(this).attr("href");
    var elWrapped = $(el);
    var header_height = $(".navbar").height() + 10;

    scrollToDiv(elWrapped, header_height);
    return false;

    function scrollToDiv(element, navheight) {
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop - navheight;

      $("body,html").animate(
        {
          scrollTop: totalScroll,
        },
        300
      );
    }
  });
})(window.jQuery);

// ===============================
// CONTACT FORM - EMAILJS + UI ENHANCEMENTS
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Collect form data
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // Collect services
      const services = [];
      if (document.getElementById("inlineCheckbox1").checked) services.push("Websites");
      if (document.getElementById("inlineCheckbox2").checked) services.push("API Development");
      if (document.getElementById("inlineCheckbox3").checked) services.push("Ecommerce");
      if (document.getElementById("inlineCheckbox4").checked) services.push("SEO & Performance");

      // Prepare EmailJS params
      const params = {
        name: name,
        email: email,
        message: message || "No message provided.",
        services: services.join(", ") || "Not specified",
        time: new Date().toLocaleString(),
      };

      const serviceID = "service_kfvucy4";
      const templateID = "template_96dzcqw";

      // Handle Send button UI
      const sendButton = contactForm.querySelector("button[type='submit']");
      const originalText = sendButton.textContent;

      // Spinner while sending
      sendButton.disabled = true;
      sendButton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending...
      `;

      // Send email via EmailJS
      emailjs.send(serviceID, templateID, params)
        .then(function () {
          // ✅ Success - Green checkmark animation
          sendButton.innerHTML = `
            <span class="text-success fw-bold">
              <i class="bi bi-check-circle-fill"></i> Sent!
            </span>
          `;

          // Reset form
          contactForm.reset();

          // ✅ Show Bootstrap Toast
          const toastEl = document.getElementById('successToast');
          const toast = new bootstrap.Toast(toastEl);
          toast.show();

          // Reset button after 3 seconds
          setTimeout(() => {
            sendButton.disabled = false;
            sendButton.textContent = originalText;
          }, 3000);
        })
        .catch(function (error) {
          console.error("EmailJS Error:", error);
          alert("❌ Failed to send message. Please try again later.");

          sendButton.disabled = false;
          sendButton.textContent = originalText;
        });
    });
  }
});
