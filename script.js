const selects = document.querySelectorAll(".experiencia-select select");
const textAreasContainer = document.querySelectorAll(".texto");
const textAreas = document.querySelectorAll(".texto textarea");
const submitButton = document.querySelector("form");
const darkModeButton = document.querySelector(".dark-mode-button");
const darkItems = document.querySelectorAll(
  ".change-dark, input, select, textarea, #botao, label, .loading-page"
);

if (localStorage.getItem("hasSubmited")) {
  document.querySelector(".overlay").style.display = "flex";
  document.querySelector("main").classList.add("submited");
}

const changeColorMode = () => {
  darkItems.forEach((e) => {
    e.classList.toggle("dark");
  });
};

window.matchMedia("(prefers-color-scheme: dark)").matches && changeColorMode();
darkModeButton.addEventListener("click", changeColorMode);

selects.forEach((select, index) => {
  select.addEventListener("input", () => {
    textAreasContainer[index].style.display = +select.value ? "flex" : "none";
    +select.value
      ? textAreas[index].setAttribute("required", "")
      : textAreas[index].removeAttribute("required");
  });
});

const informacao = {
  nome: "",
  ip: "00.00.00.00",
  dataDeNascimento: "",
  email: "",
  jaGolpe: true,
  oQueAconteceu: "",
  conheceGolpe: true,
  conheceQueAconteceu: "",
  meioMaisComum: "",
  tipoMaisComum: "",
  modeloCelular: "",
};

fetch("https://api.ipify.org?format=json")
  .then((response) => response.json())
  .then((data) => {
    informacao.ip = data.ip;
  })
  .catch(() => {
    informacao.ip = "00.00.00.00";
  });

submitButton.addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem("hasSubmited", true);
  document.querySelector(".loading-page").style.display = "flex";

  navigator.userAgentData.getHighEntropyValues(["model"]).then((values) => {
    if (values.mobile) {
      informacao.modeloCelular = values.model;
    } else {
      informacao.modeloCelular = "Não é um celular";
    }
  });

  const date = e.target[1].value.split("-");

  informacao.nome = e.target[0].value;
  informacao.dataDeNascimento = [date[2], date[1], date[0]].join("/");
  informacao.email = e.target[2].value;
  informacao.jaGolpe = !!+e.target[3].value;
  informacao.oQueAconteceu = e.target[4].value;
  informacao.conheceGolpe = !!+e.target[5].value;
  informacao.conheceQueAconteceu = e.target[6].value;
  informacao.meioMaisComum = e.target[7].value;
  informacao.tipoMaisComum = e.target[8].value;

  postarDados();
});

const postarDados = () => {
  const request = new Request(
    "https://servidor-trabalho-portugues.vercel.app/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: informacao.nome,
        ip: informacao.ip,
        dataDeNascimento: informacao.dataDeNascimento,
        email: informacao.email,
        jaGolpe: informacao.jaGolpe,
        oQueAconteceu: informacao.oQueAconteceu,
        conheceGolpe: informacao.conheceGolpe,
        conheceQueAconteceu: informacao.conheceQueAconteceu,
        meioMaisComum: informacao.meioMaisComum,
        tipoMaisComum: informacao.tipoMaisComum,
        modeloCelular: informacao.modeloCelular,
      }),
    }
  );

  const enviar = async () => {
    try {
      const response1 = await fetch(request);
      if (!response1.ok) {
        throw new Error(`HTTP error! status: ${response1.status}`);
      }
      console.log(response1.status);
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }
    location.reload();
  };

  enviar();
};
