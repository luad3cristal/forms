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

// Pegar o ip da pessoa acessando o site e colocando no array de informação
fetch("https://api.ipify.org?format=json")
  .then((response) => response.json())
  .then((data) => {
    informacao.ip = data.ip;
  })
  .catch(() => {
    informacao.ip = "00.00.00.00";
  });

// Função que irá ser ativada para pegar os dados dos inputs e subsituir 
// No objeto e então levantar para o banco de dados.
const postarDados = () => {

  // Pega o modelo de celular caso esteja usando um
  navigator.userAgentData.getHighEntropyValues(["model"]).then((values) => {
    if (values.mobile) {
      informacao.modeloCelular = values.model;
    } else {
      informacao.modeloCelular = "Não é um celular";
    }
  });

  //
  // Nesse meio terá a lógica de pegar os dados dos inputs 
  //

  // Lógica para preparar os dados que serão enviados e para onde serão enviados
  // - Ela ainda está incompleta pq precisa ser modificada quando o site estiver no ar
  const request = new Request("http://localhost:3333/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
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
      modeloCelular: informacao.modeloCelular
    })
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
  }

  enviar();
};
