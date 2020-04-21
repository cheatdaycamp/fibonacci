class CalculateFibonacci {
  constructor(button, input, cardBody, useServer, spinner) {
    this.button = button;
    this.input = input;
    this.useServer = useServer;
    this.cardBody = cardBody;
    this.spinner = spinner;
    this.fiboResponse;
    this.cardText = this.cardBody.firstElementChild.firstElementChild;
    this.button.addEventListener("click", this.launchSearch);
  }

  launchSearch = async () => {
    this.toggleVisible(this.cardBody, false);
    this.toggleVisible(this.spinner, true); //turn on
    const shouldUseServer = this.shouldUseServer();
    const isInputLessthan50 = this.checkInputLessThan50();

    if (isInputLessthan50) {
      if (shouldUseServer) {
        await this.callServer(this.input.value);
      } else {
        this.uselocal();
      }
    } else {
      this.raiseMax50Error();
    }
    this.toggleVisible(this.spinner, false); //turn on
    this.fillText();
    this.checkCardBodyStatus();
  };

  fillText() {
    if (typeof this.fiboResponse === "string") {
      this.cardText.innerHTML = this.fiboResponse;
    } else if (this.fiboResponse.result) {
      this.cardText.innerHTML = `The Fibonacci number of <strong>${this.fiboResponse.number}</strong> is:
      <strong>${this.fiboResponse.result}</strong>`;
    } else {
      this.cardText.innerHTML = "COCA";
    }
  }

  updateSpanText = () => {
    if (this.input.value) {
      this.span.innerText = this.input.value;
    } else {
      this.span.innerText = "0";
    }
  };

  checkCardBodyStatus = () => {
    this.cardBody.classList.contains("d-none") &&
      this.cardBody.classList.remove("d-none");
  };

  checkInputLessThan50 = () => {
    return this.input.value <= 50 ? true : false;
  };

  raiseMax50Error = () => {
    this.fiboResponse = "Max allowed number is: 50";
  };

  toggleVisible = (element, bool) => {
    if (bool) {
      element.classList.remove("d-none");
    } else {
      element.classList.add("d-none");
    }
  };

  shouldUseServer = () => {
    return this.useServer.checked ? true : false;
  };

  uselocal = async () => {
    if (this.input.value >= 0) {
      let results = this.calculateFibonacci(this.input.value);
      this.fiboResponse = {
        number: parseInt(this.input.value),
        result: results,
        createdDate: Date.now(),
      };
    } else {
      this.fiboResponse = 'Number must be equal or higher than 0'
    }
  };

  calculateFibonacci = (n) => {
    if (n < 2) {
      return n;
    }
    return this.calculateFibonacci(n - 1) + this.calculateFibonacci(n - 2);
  };

  callServer = async (number) => {
    let url = `http://localhost:5050/fibonacci/${number}`;
    this.fiboResponse = await fetch(url)
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
          return response.text();
        }
      })
      .catch((error) => {
        console.log(error);
        return "Server not in use";
      });
  };
}

window.onload = (() => {
  const button = document.getElementById("calculate-button");
  const input = document.getElementById("calculate-input");
  const cardBody = document.querySelector(".card-holder");
  const useServer = document.getElementById("use-server");
  const spinner = document.getElementById("spinner");
  new CalculateFibonacci(button, input, cardBody, useServer, spinner);
})();
