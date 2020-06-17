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
    this.sortBy.addEventListener("change", this.sortDB);
    this.showDBTable();
  }

  showDBTable = () => {
    this.toggleVisible(this.serverCards.querySelector("#server-items"), false);
    this.toggleVisible(this.serverCards.querySelector("#spinner-2"), true);
    const fetchIt = async () => {
      let url = `http://localhost:5050/getFibonacciResults `;
      let response = await fetch(url)
        .then(async (response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .catch((error) => {
          return error;
        });
      this.serverData = response.results;
      this.sortDB();
      this.toggleVisible(this.serverCards.querySelector("#spinner-2"), false);
      this.toggleVisible(this.serverCards.querySelector("#server-items"), true);
    };
    fetchIt();
  };

  sortDB = () => {
    let sortBy = this.sortBy.options[this.sortBy.selectedIndex].text;
    if (!this.serverData) {
      console.log('here')
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
    this.createList();
  };

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
    this.toggleVisible(this.cardBody, false);
    this.toggleVisible(this.spinner, true);
    const shouldUseServer = this.shouldUseServer();
    const isInputLessthan50 = this.checkInputLessThan50();

    if (isInputLessthan50) {
      if (shouldUseServer) {
        await this.callServer(this.input.value);
        this.showDBTable();
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
      this.cardText.innerHTML = "Please insert an integer number";
    }
  }

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
    if (this.input.value > 0) {
      let results = this.calculateFibonacci(this.input.value);
      this.fiboResponse = {
        number: parseInt(this.input.value),
        result: results,
        createdDate: Date.now(),
      };
    } else {
      this.fiboResponse = "Number must be equal or higher than 0";
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
