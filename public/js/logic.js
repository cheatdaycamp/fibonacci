class CalculateFibonacci {
  constructor(
    button,
    input,
    cardBody,
    useServer,
    sortBy,
    spinner,
    serverCards
  ) {
    this.button = button;
    this.input = input;
    this.useServer = useServer;
    this.sortBy = sortBy;
    this.cardBody = cardBody;
    this.spinner = spinner;
    this.serverCards = serverCards;
    this.cardText = this.cardBody.firstElementChild.firstElementChild;
    this.fiboResponse;
    this.serverData,
      this.button.addEventListener("click", this.calculateNumber);
    this.input.addEventListener("change", this.checkString);
    this.input.addEventListener("keyup", this.checkString);
    this.sortBy.addEventListener("change", this.sortDB.bind(this));
    this.showDBTable();
  }

  showDBTable() {
    this.toggleVisible(this.serverCards.querySelector("#server-items"), false);
    this.toggleVisible(this.serverCards.querySelector("#spinner-2"), true);
    (async () => this.fetchResults)();
    this.sortDB();
    this.createList();
    this.toggleVisible(this.serverCards.querySelector("#spinner-2"), false);
    this.toggleVisible(this.serverCards.querySelector("#server-items"), true);
  }

  async fetchResults() {
    let url = `http://localhost:5050/getFibonacciResults`;
    let response = await fetch(url)
      .then(async (response) => {
        if (response.ok) return response.json();
      })
      .catch((error) => error);
    this.serverData = response;
  }

  sortDB() {
    let sortBy = this.sortBy.options[this.sortBy.selectedIndex].text;
    if (!this.serverData) {
      this.toggleVisible(this.spinner, false);
      return;
    }
    switch (sortBy) {
      case "Asc date":
        this.serverData.sort((a, b) => {
          return a.createdDate - b.createdDate;
        });
        break;
      case "Desc date":
        this.serverData.sort((a, b) => {
          return b.createdDate - a.createdDate;
        });
        break;
      case "Higher Value":
        this.serverData.sort((a, b) => {
          return b.number - a.number;
        });
        break;
      case "Lower Value":
        this.serverData.sort((a, b) => {
          return a.number - b.number;
        });
        break;
    }
  }

  createList = () => {
    this.serverCards.querySelector("#server-items").innerHTML = "";
    if (this.serverData.length) {
      for (let number of this.serverData) {
        let date = new Date(number.createdDate).toISOString();
        let formated =
          date.split("T")[0] + " - " + date.split("T")[1].slice(0, 8);
        let newLi = document.createElement("li");
        newLi.className = "list-group-item";
        newLi.innerHTML = `${formated} The Fibonacci Number of <b>${number.number}</b> is <b>${number.result}</b>`;
        this.serverCards.querySelector("#server-items").append(newLi);
      }
    }
  };

  checkString = () => {
    this.input.value
      ? (this.button.disabled = false)
      : (this.button.disabled = true);
  };

  calculateNumber = async () => {
    const {
      cardBody,
      spinner,
      input,
      toggleVisible,
      shouldUseServer,
      checkInputLessThan50,
      callServer,
      showDBTable,
      uselocal,
      raiseMax50Error,
      checkCardBodyStatus,
      fillText,
    } = this;
    toggleVisible(cardBody, false);
    toggleVisible(sinner, true);
    const shouldUseServer = shouldUseServer();
    const isInputLessthan50 = checkInputLessThan50();

    if (isInputLessthan50) {
      if (shouldUseServer) {
        await callServer(input.value);
        showDBTable();
      } else {
        uselocal();
      }
    } else {
      raiseMax50Error();
    }

    toggleVisible(spinner, false); //turn on
    fillText();
    checkCardBodyStatus();
  };

  fillText() {
    const { fiboResponse, cardText } = this;
    if (typeof fiboResponse === "string") {
      this.cardText.innerText = fiboResponse;
    } else if (fiboResponse.result) {
      this.cardText.innerText = `The Fibonacci number of <strong>${fiboResponse.number}</strong> is:
      <strong>${fiboResponse.result}</strong>`;
    } else {
      cardText.innerText = "Please insert an integer number";
    }
  }

  checkCardBodyStatus = () => {
    this.cardBody.classList.contains("d-none") &&
      this.cardBody.classList.remove("d-none");
  };

  checkInputLessThan50 = () => {
    return this.input.value <= 50;
  };

  raiseMax50Error = () => {
    this.fiboResponse = "Max allowed number is: 50";
  };

  toggleVisible = (element, bool) => {
    if (bool) element.classList.remove("d-none");
    else element.classList.add("d-none");
  };

  shouldUseServer = () => {
    return this.useServer.checked;
  };

  uselocal = async () => {
    const {input, calculateFibonacci, fiboResponse}
    if (input.value > 0) {
      let results = calculateFibonacci(input.value);
      fiboResponse = {
        number: parseInt(input.value),
        result: results,
        createdDate: Date.now(),
      };
    } else {
      fiboResponse = "Number must be equal or higher than 0";
    }
  };

  calculateFibonacci(n, memo) {
    memo = memo || {};
    if (n in memo) return memo[n];
    if (n === 0) return 0;
    if (n <= 1) return 1;
    return (memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo));
  }

  callServer = async (number) => {
    let url = `http://localhost:5050/fibonacci/${number}`;
    this.fiboResponse = await fetch(url)
      .then(async (response) => {
        if (response.ok) return response.json();
        else if (response.status === 400) return response.text()
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
  const sortBy = document.getElementById("sort-by");
  const spinner = document.getElementById("spinner");
  const serverCards = document.getElementById("server-cards");
  new CalculateFibonacci(
    button,
    input,
    cardBody,
    useServer,
    sortBy,
    spinner,
    serverCards
  );
})();
