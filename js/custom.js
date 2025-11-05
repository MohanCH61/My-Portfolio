(function ($) {
  "use strict";

  // PRE LOADER
  $(window).on("load", function () {
    $(".preloader").fadeOut(1000);
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
          sendButton.innerHTML = `
            <span class="text-success fw-bold">
              <i class="bi bi-check-circle-fill"></i> Sent!
            </span>
          `;
          contactForm.reset();

          const toastEl = document.getElementById('successToast');
          if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
          }

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

// ===============================
// SMART LOCAL CHATBOT (Enhanced Understanding v2)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const chatButton = document.getElementById("chatbot-button");
  const chatBox = document.getElementById("chatbot-box");
  const closeChat = document.getElementById("chatbot-close");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  if (!chatButton || !chatBox || !closeChat || !input || !messages) return;

  chatButton.addEventListener("click", () => {
    chatBox.classList.add("active");
    chatButton.style.display = "none";
  });

  closeChat.addEventListener("click", () => {
    chatBox.classList.remove("active");
    setTimeout(() => (chatButton.style.display = "flex"), 300);
  });

  // Expanded question library with synonyms and flexible phrasing
  const qaPairs = [
    {
      intent: "greeting",
      keywords: ["hi", "hello", "hey", "yo", "whatsup", "good morning", "good evening"],
      answer: "Hey there! 👋 I’m Mohan’s digital assistant. Ask me anything about him — skills, education, or projects!"
    },
    {
      intent: "about",
      keywords: ["who", "you", "introduce", "about", "yourself", "tell me"],
      answer: "I'm your friendly portfolio assistant 🤖. Mohan Cheekatla is a passionate Full Stack Developer skilled in React, Spring Boot, and MySQL — he loves creating innovative web apps."
    },
    {
      intent: "skills",
      keywords: ["skills", "technologies", "tools", "languages", "stack", "framework", "expertise", "proficient", "tech"],
      answer: "Mohan works with React.js, Spring Boot, Java, Python, MySQL, and REST APIs — plus strong front-end and debugging skills 🚀."
    },
    {
      intent: "projects",
      keywords: ["project", "portfolio", "work", "experience", "built", "developed", "github"],
      answer: "He’s built amazing projects like an Online Course Management System, Fake Instagram Account Detector, and Course Navigator. Check them on GitHub: 🔗 https://github.com/MohanCH61"
    },
    {
      intent: "linkedin",
      keywords: ["linkedin", "profile", "connect", "social", "network"],
      answer: "You can connect with Mohan on LinkedIn here 🔗 https://www.linkedin.com/in/mohancheekatla61."
    },
    {
      intent: "education",
      keywords: ["education", "college", "btech", "degree", "study", "university", "graduation"],
      answer: "He completed his B.Tech in Electronics and Communication Engineering (2025) 🎓 and loves combining creativity with logic in web development."
    },
    {
      intent: "contact",
      keywords: ["contact", "email", "mail", "message", "reach", "talk", "communicate"],
      answer: "You can reach Mohan anytime at 📧 cheekatlamohan61@gmail.com or through the contact form below 👇."
    },
    {
      intent: "hobby",
      keywords: ["hobby", "interest", "free time", "fun", "like", "passion"],
      answer: "When not coding, Mohan enjoys exploring new tech, designing UIs, and sharing knowledge through videos 🎥."
    },
    {
      intent: "goal",
      keywords: ["goal", "dream", "future", "aim", "vision", "mission", "target"],
      answer: "Mohan’s goal is to become a top-tier full-stack engineer and build impactful digital solutions 🌟."
    },
    {
      intent: "thanks",
      keywords: ["thanks", "thank you", "appreciate", "good", "nice", "great"],
      answer: "You’re very welcome! 😊 Feel free to ask more about Mohan’s work or background."
    }
  ];

  // Intelligent matching with partial + synonym detection
  function getSmartReply(userInput) {
    const input = userInput.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    qaPairs.forEach(pair => {
      let score = 0;
      pair.keywords.forEach(keyword => {
        if (input.includes(keyword)) score += 1;
        else if (keyword.split(" ").some(word => input.includes(word))) score += 0.5;
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = pair;
      }
    });

    if (bestMatch && highestScore > 0) {
      return bestMatch.answer;
    }

    const fallbackResponses = [
      "Hmm 🤔 I’m not sure about that — maybe ask me about Mohan’s education, skills, or projects?",
      "That’s a good question! Try rephrasing it — I might understand it better.",
      "I'm not sure, but Mohan might answer that better himself 😉"
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  // Message handling
  input.addEventListener("keypress", e => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const userMsg = input.value.trim();
      appendMessage(userMsg, "user");
      input.value = "";

      setTimeout(() => {
        const reply = getSmartReply(userMsg);
        appendMessage(reply, "bot");
      }, 600);
    }
  });

  // Message display
  function appendMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
});
