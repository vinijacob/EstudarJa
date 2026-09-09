import "../styles/style.scss";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Elemento #app não encontrado.");
}

app.innerHTML = `
  <h1>EstudarJá</h1>
  <p>Seu aplicativo de flashcards.</p>
  <h2>Vamos começar?</h2>
`;
