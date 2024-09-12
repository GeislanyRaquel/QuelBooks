class Navbar extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const nav = document.createElement("nav");
      nav.innerHTML = `

        <style>
            nav {
                display: flex;
                justify-content: space-around;
                background-color: #eee;
                padding: 1em;
                align-items: baseline;
            }

        </style>


        <nav>
            <a href="romance.html">Romance</a>
            <a href="ficção.html">Ficção Científica</a>
            <a href="literaturaN.html">Literatura Nacional</a>
            <a href="mangá.html">Mangás</a>
            <a href="drama.html">Drama</a>
            <a href="corpocarrinho.html"><svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16" >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/> 
            </svg></i></a>
            <a href="corpoconta.html"><svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg></a>
        </nav>
      `;
      this.appendChild(nav);
    }
}
customElements.define("nav-bar", Navbar);

class Card extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      const div = document.createElement("div");
      div.innerHTML = `

        <div class="card" style="width: 18rem;">
          <img src="${this.getAttribute("src")}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${this.getAttribute("title")}</h5>
            <p class="card-text">
              <p>R$ ${this.getAttribute("price")}</p>
              <p class="descricao-livro">${this.getAttribute("description")}</p>
            <a href="./produto.html?id=${this.getAttribute("id")}" class="btn btn-primary">Saiba mais</a>
          </div>
        </div>
    `;
      this.appendChild(div);
    }
  }

customElements.define("card-item", Card);

async function exibirTodosProdutos() {
  const response = await fetch("http://localhost:3000/produts");
  const products = await response.json();
  const container = document.getElementById("product-container");
  console.log(container);

  products.forEach((produtos) => {
      const productCard = document.createElement("card-item");
      productCard.setAttribute("id", produtos.id);
      productCard.setAttribute("title", produtos.title);
      productCard.setAttribute("price", produtos.price);
      productCard.setAttribute("description", produtos.description);
      productCard.setAttribute("src", produtos.src);

      productCard.addEventListener("click", () => {
          window.location.href = `produto.html?id=${produtos.id}`;
      });
      container.appendChild(productCard);
  });
}

exibirTodosProdutos();

function getProductIdFromUrl(){
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function exibirPaginaProduto() {
  const id = getProductIdFromUrl();
  const response = await fetch(`http://localhost:3000/produts?id=${id}`);
  const dados = await response.json();

  const produtos = Array.isArray(dados) ? dados[0] : dados;

  const container = document.getElementById("product-details");

  container.innerHTML = `
      <div class="book">
            <img id="image" src="${produtos.src}" alt="Duna">
            <h3 id="product-title">${produtos.title}</h3>
            <p><strong>Autor:</strong>  ${produtos.author}</p>
            <p><strong>Gêneros:</strong> Ficção Científica</p>
            <p><strong>Data da primeira publicação:</strong> 2017</p>
            <p><strong>Ano de Lançamento da versão em português:</strong>2017</p>
            <p><strong>Descrição:</strong>${produtos.description}</p>
            <p id="price"><strong>preço:</strong>${produtos.price}</p>

            <button id="add-to-cart">Adicionar ao Carrinho</button>
        </div>
  `;

  document.getElementById('product-title').innerHTML = produtos.title;
  document.getElementById('price').innerHTML = `Valor: R$ ${produtos.price}`;
  document.getElementById('image').src = produtos.src;

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  console.log('Carrinho atual:', carrinho);

  document.getElementById('add-to-cart').addEventListener('click', () => {

      const produtoExistente = carrinho.find(item => item.id === id);

      if (!produtoExistente) {
          carrinho.push({ id: id, quantidade: 1 });
          localStorage.setItem('carrinho', JSON.stringify(carrinho));
      }

      document.location.href = 'corpocarrinho.html?id=' + id;
  });

}

exibirPaginaProduto();

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function renderCarrinho() {
    const produtosElement = document.getElementById('produtos');
    if (!produtosElement) {
        console.error('Elemento de produtos não encontrado.');
        return;
    }
    produtosElement.innerHTML = "";

    carrinho.forEach(item => {
        fetch(`http://localhost:3000/produts?id=${item.id}`) // Corrigido 'produts' para 'products'
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    item.preco = data[0].price; // Armazena o preço do produto no item do carrinho
                    renderizar(data[0], item.quantidade);
                } else {
                    console.error('Produto não encontrado:', data);
                }
            })
            .catch(error => console.error('Erro ao buscar produto:', error));
    });
}

function renderizar(produto, quantidade) {
    const produtosElement = document.getElementById('produtos');
    if (!produtosElement) {
        console.error('Elemento de produtos não encontrado.');
        return;
    }

    produtosElement.innerHTML += `
      <div class="product-details" id="produto-${produto.id}">
        <div class="product-content">
            <img src="${produto.src}" style="height: auto; width: auto;">
            <h2>${produto.title}</h2>
            <p><strong>Descrição:</strong> ${produto.description}</p>
            <p><strong>Preço:</strong> R$ ${produto.price}</p>
            <input type="number" value="${quantidade}" min="1" onchange="atualizarQuantidade(this, ${produto.id}, ${produto.price})">
            <p id="preco-total-${produto.id}"><strong>Total:</strong> R$ ${(produto.price * quantidade).toFixed(2)}</p>
            <button onclick="remover(${produto.id})">Remover</button>
        </div>
      </div>
    `;

    atualizarSubtotal();
    calcularTotalCarrinho();
}

function atualizarQuantidade(el, id, precoUnitario) {
    const novaQuantidade = Number(el.value);

    if (isNaN(novaQuantidade) || novaQuantidade < 1) {
        console.error('Quantidade inválida:', novaQuantidade);
        return;
    }

    carrinho = carrinho.map(item => {
        if (item.id === id) {
            item.quantidade = novaQuantidade;
            item.preco = precoUnitario;
        }
        return item;
    });

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    const precoTotalElement = document.getElementById(`preco-total-${id}`);
    if (precoTotalElement) {
        precoTotalElement.textContent = `R$ ${(novaQuantidade * precoUnitario).toFixed(2)}`;
    }

    atualizarSubtotal();
    calcularTotalCarrinho();
}

function atualizarSubtotal() {
    let subtotal = 0;
    carrinho.forEach(item => {
        const precoUnitario = item.preco ? item.preco : 0;
        subtotal += precoUnitario * item.quantidade;
    });

    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
    }
}

function calcularTotalCarrinho() {
    let totalCarrinho = 0;
    carrinho.forEach(item => {
        const precoUnitario = item.preco ? item.preco : 0;
        totalCarrinho += precoUnitario * item.quantidade;
    });

    const totalCarrinhoElement = document.getElementById('total-carrinho');
    if (totalCarrinhoElement) {
        totalCarrinhoElement.textContent = `Total do Carrinho: R$ ${totalCarrinho.toFixed(2)}`;
    }
}

function remover(id) {
  carrinho.splice(carrinho.indexOf(String(id)), 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    location.href = "corpocarrinho.html";

  atualizarSubtotal();
  calcularTotalCarrinho();
}



document.addEventListener('DOMContentLoaded', function() {
  renderCarrinho();
});
