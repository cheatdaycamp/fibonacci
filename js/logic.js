class CalculateFibonacci {
  constructor(button, input, span, result, cardBody, useServer, spinner) {
    this.button = button;
    this.input = input;
    this.span = span;
    this.result = result;
    this.useServer = useServer;
    this.cardBody = cardBody;
    this.spinner = spinner;
    this.response;
    this.button.addEventListener("click", this.launchSearch);
  }

  launchSearch = async () => {
    this.cardBody.classList.contains("d-none") &&
      this.cardBody.classList.remove("d-none");
    let check = await this.checkServer();
	this.togglehide(this.spinner)
	console.log(check);
    this.result.innerText = check.result;
    if (this.input.value) {
      this.span.innerText = this.input.value;
    } else {
      this.span.innerText = "0";
    }
  };

  togglehide = (element) => {
    element.classList.toggle('invisible');
  };
  checkServer = async () => {
    this.togglehide(this.spinner);
    if (this.useServer.checked) {
      return await this.callServer(this.input.value);
    } else {
      return {
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
    this.response = await fetch(url).then((response) => response.json());
    return this.response;
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
