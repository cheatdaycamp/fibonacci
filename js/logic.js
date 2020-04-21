class CalculateFibonacci {
  constructor(button, input, span, result, cardBody, useServer, spinner) {
    this.button = button;
    this.input = input;
    this.span = span;
    this.result = result;
    this.useServer = useServer;
    this.cardBody = cardBody;
    this.spinner = spinner;
    this.fiboResponse;
    this.button.addEventListener("click", this.launchSearch);
  }

  launchSearch = async () => {
    this.checkCardBodyStatus();
    let caca = this.checkInputLessThan50();
    this.toggleVisible(this.spinner); //turn on
    caca ? await this.checkServer() : this.raiseError();
    this.toggleVisible(this.spinner); //turn off
    console.log(this.fiboResponse);
    if (typeof this.fiboResponse === "string") {
      this.result.innerText = this.fiboResponse;
    } else if (this.fiboResponse.result) {
      this.result.innerText = this.fiboResponse.result
    } else {
      this.result.innerText = 'COCA'
    }
    this.updateSpanText();
  };

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

  raiseError = () => {
    console.log("error");
    this.fiboResponse = { result: "En error Ocurred" };
  };

  toggleVisible = (element) => {
    element.classList.toggle("invisible");
  };

  checkServer = async () => {
    if (this.useServer.checked) {
      return await this.callServer(this.input.value);
    } else {
      this.fiboResponse = {
        number: parseInt(this.input.value),
        result: this.calculateFibonacci(this.input.value),
        createdDate: Date.now(),
      };
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
    this.fiboResponse = await fetch(url).then(async (response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        return response.text();
      }
    });

    return this.fiboResponse;
  };
}

window.onload = (() => {
  const button = document.getElementById("calculate-button");
  const result = document.getElementById("fibonacci-results");
  const input = document.getElementById("calculate-input");
  const fibonacciInput = document.getElementById("fibonacci-input");
  const cardBody = document.querySelector(".card-holder");
  const useServer = document.getElementById("use-server");
  const spinner = document.getElementById("spinner");
  const fibonacci = new CalculateFibonacci(
    button,
    input,
    fibonacciInput,
    result,
    cardBody,
    useServer,
    spinner
  );
})();
