const selects = document.querySelectorAll(".experiencia-select select");
const textAreasContainer = document.querySelectorAll(".texto");
const textAreas = document.querySelectorAll(".texto textarea");
const submitButton = document.querySelector("form");
const darkModeButton = document.querySelector(".dark-mode-button");
const darkItems = document.querySelectorAll(
  ".change-dark, input, select, textarea, #botao, label"
);

const changeColorMode = () => {
  darkItems.forEach((e) => {
    e.classList.toggle("dark");
  });
};

window.matchMedia("(prefers-color-scheme: dark)").matches && changeColorMode();

darkModeButton.addEventListener("click", changeColorMode);

if (localStorage.getItem("hasSubmited")) {
  document.querySelector(".overlay").style.display = "flex";
  document.querySelector("main").classList.add("submited");
}

selects.forEach((select, index) => {
  select.addEventListener("input", () => {
    textAreasContainer[index].style.display = +select.value ? "flex" : "none";
    +select.value
      ? textAreas[index].setAttribute("required", "")
      : textAreas[index].removeAttribute("required");
    console.log(textAreas);
  });
});

// Objeto com todas as informações que serão pegas
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

submitButton.addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem("hasSubmited", true);

  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      informacao.ip = data.ip;
    })
    .catch(() => {
      informacao.ip = "00.00.00.00";
    });

  navigator.userAgentData.getHighEntropyValues(["model"]).then((values) => {
    if (values.mobile) {
      informacao.modeloCelular = values.model;
    } else {
      informacao.modeloCelular = "Não é um celular";
    }
  });
});

const postarDados = () => {
  const request = new Request("http://localhost:3333/users", {
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
  });

  // Função para mandar os dados
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
  };

  enviar();
};
