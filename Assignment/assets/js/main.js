"use strict";

$(window).on("load", function () {
  const gameData = $("#gameData");
  let links = $(".nav-item");

  $("#all").on("click", function () {
    $(".active").removeClass("active");
    showDataOnLoad();
    $("#all").addClass("active");
  });

  async function showDataOnLoad() {
    let api = new Api();

    let data = await api.getGameList();

    let ui = new UI(data);
    ui.showData();
  }
  links.each(function () {
    $(this).on("click", async function () {
      load();
      $(".active").removeClass("active");

      $(this).children().addClass("active");

      let catName = $(this).children().text();
      let api = new Api(catName);
      let data = await api.gamesByTag();
      let ui = new UI(data);
      ui.showData();
    });
  });
  $("#gameData").on("click", ".card", async function () {
    let id = $(this).children(".d-none").text();
    let api = new Api(id);
    let gameData = await api.gameDetails();
    let ui = new UI(gameData);
    ui.showDataDeatails();
  });

  function load() {
    $("body").addClass("loading");
  }

  function notLoad() {
    $("body").removeClass("loading");
  }

  class Api {
    constructor(param) {
      this.param = param;
    }

    async getGameList() {
      let response = await fetch(
        "https://free-to-play-games-database.p.rapidapi.com/api/games",
        {
          headers: {
            "x-rapidapi-key":
              "1799730017mshae6580783214c26p16c5cejsn2871a6be76c9",
            "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
          },
        }
      );
      let data = await response.json();

      return data;
    }
    async gamesByTag() {
      let response = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${this.param}`,
        {
          headers: {
            "x-rapidapi-key":
              "1799730017mshae6580783214c26p16c5cejsn2871a6be76c9",
            "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
          },
        }
      );
      let data = await response.json();

      return data;
    }

    async gameDetails() {
      let response = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${this.param}`,
        {
          headers: {
            "x-rapidapi-key":
              "1799730017mshae6580783214c26p16c5cejsn2871a6be76c9",
            "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
          },
        }
      );
      let data = await response.json();

      return data;
    }
  }

  class UI {
    constructor(data) {
      this.data = data;
    }
    showData() {
      load();
      let dataContainer = "";
      for (let i = 0; i < this.data.length; i++) {
        dataContainer += `<div class="col-12 col-md-6 col-lg-4">
            <div class="card bg-dark text-white ">
            <div class="d-none">${this.data[i].id}</div>
              <img src="${this.data[i].thumbnail}" class="card-img-top cardImg" alt="...">
              <div class="card-body text-center  ">
                <h5 class="card-title">${this.data[i].title}</h5>
                <p class="card-text">${this.data[i].short_description}</p>
                <h6>${this.data[i].publisher}</h6>
                <div class="card-footer d-flex justify-content-between py-1 align-align-items-center bg-danger ">
                  <p class="m-0" >${this.data[i].genre}</p>
                  <p class="m-0" >${this.data[i].platform}</p>
                </div>
              </div>
            </div>
          </div>`;
      }
      gameData.html(dataContainer);
      notLoad();
    }
    showDataDeatails() {
      load();
      let dataContainer = `  <div class="modal-header">
    <h5 class="modal-title">${this.data.title}</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="modal-body">
    <div class="row">
      <div class="col-12 col-md-4 ">
  <img class="w-100" src="${this.data.thumbnail}" alt="photo">
      </div>
      <div class="col-12 col-md-8 ">
        <p>${this.data.description}</p>
      </div>
    </div>
    
  </div>
  <div class="modal-footer">
    <a target="_blank"  class="btn btn-primary" href="${this.data.game_url}" >Game WebSite</a>
  </div>`;

      $("#modalContent").html(dataContainer);
      $("#Modal").modal("show");

      notLoad();
    }
  }

  showDataOnLoad();
});
