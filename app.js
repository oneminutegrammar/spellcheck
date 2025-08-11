let tryCount = 0;
const maxTries = 3;

function playSuccessSound() {
  const sound = document.getElementById("ding");
  sound.currentTime = 0;  // rewind to start
  sound.play();
}

async function checkSpelling() {
  tryCount++;

  const resultDiv = document.getElementById("result");

  const text = document.getElementById("textInput").value;

  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      text: text,
      language: "en-US"
    })
  });

  const data = await response.json();

  if (data.matches.length === 0) {
    resultDiv.innerHTML = "✅ Correct!";
    launchConfetti(); // trigger confetti celebration here
    playSuccessSound();  // Play dopamine sound here
  } else {
    if (tryCount < maxTries && data.matches.length > 0) {
      const triesLeft = maxTries - tryCount;
      resultDiv.innerHTML = `🕒 Таньд ${triesLeft} оролт үлдлээ.`;
      return;
    } else {
      resultDiv.innerHTML = data.matches.map(match => {
        return `<p>⚠️ ${match.message}<br /><em>${match.context.text}</em></p>`;
      }).join("");
    }
  }

  const typesSeen = new Set();
  data.matches.forEach(match => typesSeen.add(match.rule.issueType));
  console.log([...typesSeen]);

  tryCount = 0;
}

// Confetti function
function launchConfetti() {
  const container = document.getElementById("confetti-container");
  const colors = ['#39FF14', '#0f9d0f', '#7cff4c', '#32cd32']; // neon green shades

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Random position within viewport width
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.top = Math.random() * 50 + "px"; // start near top

    // Random delay so confetti falls staggered
    confetti.style.animationDelay = (Math.random() * 0.7) + "s";

    container.appendChild(confetti);

    // Remove confetti after animation finishes (~1.5s)
    setTimeout(() => {
      confetti.remove();
    }, 1500);
  }
}
