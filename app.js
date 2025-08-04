let tryCount = 0;
    const maxTries = 3;

    async function checkSpelling() {
      tryCount++;

      const resultDiv = document.getElementById("result");

    

      // POST request 
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
        resultDiv.innerHTML = "✅";
      } else {

        if (tryCount < maxTries && data.matches.length > 0) 
            {
            const triesLeft = maxTries - tryCount;
            resultDiv.innerHTML = `🕒 Таньд ${triesLeft} оролт үлдлээ.`;
            return;
            }
        else {
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
