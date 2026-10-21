
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [carrinho, setCarrinho] = useState([])
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false)
  const [etapaPedido, setEtapaPedido] = useState('carrinho')
  const [nomeCliente, setNomeCliente] = useState('')
  const [tipoEntrega, setTipoEntrega] = useState('entrega')
  const [enderecoEntrega, setEnderecoEntrega] = useState('')


  
function enviarPedidoWhatsApp() {
  if (carrinho.length === 0) {
    alert('Adicione pelo menos um produto ao carrinho.')
    return
  }

  if (!nomeCliente.trim()) {
    alert('Informe seu nome para continuar.')
    return
  }

  if (tipoEntrega === 'entrega' && !enderecoEntrega.trim()) {
    alert('Informe o endereço de entrega.')
    return
  }


  const numeroWhatsApp = '5577991201800'

  const itensPedido = carrinho.map((item) => {
    const preco = Number(item.price)
    const quantidade = Number(item.quantidade)
    const subtotal = preco * quantidade

    return (
      `• ${item.name}\n` +
      `  Quantidade: ${quantidade} ${item.unit}\n` +
      `  Preço unitário: R$ ${preco.toFixed(2).replace('.', ',')}\n` +
      `  Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}`
    )
  })

    const mensagem = [
    '🛒 *PEDIDO — HORTIFRUTI*',
    '',
    'Olá! Gostaria de fazer um pedido.',
    '',
    '👤 *DADOS DO CLIENTE*',
    `Nome: ${nomeCliente.trim()}`,
    `Modalidade: ${tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada na loja'}`,
    ...(tipoEntrega === 'entrega'
      ? [`Endereço: ${enderecoEntrega.trim()}`]
      : []),
    '',
    '🥬 *ITENS DO PEDIDO*',
    '',
    ...itensPedido.flatMap((item, index) => [
      item,
      '',
      ...(index < itensPedido.length - 1 ? ['━━━━━━━━━━━━━━'] : []),
      ...(index < itensPedido.length - 1 ? [''] : [])
    ]),
    '',
    '━━━━━━━━━━━━━━━━',
    `💰 *TOTAL ESTIMADO: R$ ${totalPedido.toFixed(2).replace('.', ',')}*`,
    '━━━━━━━━━━━━━━━━'
  ].join('\n')

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`

  window.open(url, '_blank', 'noopener,noreferrer')
}


  // Calcula a quantidade total de unidades no carrinho
  const totalItens = carrinho.reduce(
    (total, item) => total + Number(item.quantidade),
    0
  )

  // Calcula o valor total do pedido
  const totalPedido = carrinho.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantidade),
    0
  )

  // Adiciona um produto ou aumenta sua quantidade
  function adicionarAoCarrinho(produto) {
    setCarrinho((carrinhoAtual) => {
      const produtoExistente = carrinhoAtual.find(
        (item) => item.id === produto.id
      )

      if (produtoExistente) {
        return carrinhoAtual.map((item) =>
          item.id === produto.id
            ? {
                ...item,
                quantidade: Number(item.quantidade) + 1,
              }
            : item
        )
      }

      return [
        ...carrinhoAtual,
        {
          ...produto,
          quantidade: 1,
        },
      ]
    })
  }

  // Aumenta ou diminui a quantidade de um produto
  function alterarQuantidade(id, alteracao) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual
        .map((item) => {
          if (item.id !== id) {
            return item
          }

          return {
            ...item,
            quantidade: Number(item.quantidade) + alteracao,
          }
        })
        .filter((item) => item.quantidade > 0)
    )
  }

  // Remove um produto do carrinho
  function removerDoCarrinho(id) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.filter((item) => item.id !== id)
    )
  }

  // Busca os produtos na API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error('Não foi possível buscar os produtos.')
        }

        return resposta.json()
      })
      .then((dados) => {
        setProdutos(dados)
      })
      .catch((erro) => {
        setErro(erro.message)
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  // Estados de carregamento e erro
  if (carregando) {
    return <p>Carregando produtos...</p>
  }

  if (erro) {
    return <p>Erro ao carregar produtos: {erro}</p>
  }

  return (
    <main className="loja">
      <header className="cabecalho">
        <h1>Hortifruti</h1>
        <p>Fresquinho para você!</p>
        <p>Itens no carrinho: {totalItens}</p>
      </header>

      <section className="catalogo">
        <h2>Nossos produtos</h2>

        {produtos.length === 0 ? (
          <p>Nenhum produto disponível.</p>
        ) : (
          <div className="grade-produtos">
            {produtos.map((produto) => (
              <article className="card-produto" key={produto.id}>
                {produto.image && (
                  <img
                    className="imagem-produto"
                    src={
                      produto.image.startsWith('http')
                        ? produto.image
                        : `http://127.0.0.1:8000${produto.image}`
                    }
                    alt={produto.name}
                  />
                )}

                <div className="informacoes-produto">
                  <h3>{produto.name}</h3>

                  {produto.description && (
                    <p>{produto.description}</p>
                  )}

                  <p className="preco-produto">
                    R${' '}
                    {Number(produto.price)
                      .toFixed(2)
                      .replace('.', ',')}
                    <span> / {produto.unit}</span>
                  </p>
                </div>

                <button
                  className="botao-adicionar"
                  type="button"
                  onClick={() => adicionarAoCarrinho(produto)}
                >
                  Adicionar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      
        {/* Botão para conferir o pedido */}
        {totalItens > 0 && (
          <button
            type="button"
            className="botao-conferir-pedido"
            onClick={() => setMostrarCarrinho(true)}
          >
            <span className="icone-carrinho">🛒</span>

            <span className="texto-conferir">
              <strong>Conferir pedido</strong>
              <small>
                {totalItens} {totalItens === 1 ? 'item' : 'itens'}
              </small>
            </span>

            <strong className="valor-conferir">
              R$ {totalPedido.toFixed(2).replace('.', ',')}
            </strong>
          </button>
        )}
        
        {/* Painel deslizante do carrinho */}
        {mostrarCarrinho && (
          <div
            className="fundo-carrinho"
            onClick={() => {
              setMostrarCarrinho(false)
              setEtapaPedido('carrinho')
            }}
          >
            <aside
              className="painel-carrinho"
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-carrinho"
              onClick={(evento) => evento.stopPropagation()}
            >
              <header className="cabecalho-carrinho">
                <div>
                  <h2 id="titulo-carrinho">
                    {etapaPedido === 'carrinho'
                      ? 'Seu pedido'
                      : 'Finalizar pedido'}
                  </h2>

                  <p>
                    {etapaPedido === 'carrinho'
                      ? `${totalItens} ${totalItens === 1 ? 'item' : 'itens'} no carrinho`
                      : 'Informe os dados para continuar'}
                  </p>
                </div>

                <button
                  type="button"
                  className="botao-fechar-carrinho"
                  onClick={() => {
                    setMostrarCarrinho(false)
                    setEtapaPedido('carrinho')
                  }}
                  aria-label="Fechar carrinho"
                >
                  ×
                </button>
              </header>

              {etapaPedido === 'carrinho' ? (
                <>
                  <div className="conteudo-carrinho">
                    {carrinho.length === 0 ? (
                      <p>Seu carrinho está vazio.</p>
                    ) : (
                      carrinho.map((item) => (
                        <article className="item-carrinho" key={item.id}>
                          <div className="detalhes-carrinho">
                            <h3>{item.name}</h3>

                            <p>
                              R${' '}
                              {Number(item.price)
                                .toFixed(2)
                                .replace('.', ',')}{' '}
                              / {item.unit}
                            </p>

                            <div className="controles-quantidade">
                              <button
                                type="button"
                                onClick={() =>
                                  alterarQuantidade(item.id, -.5)
                                }
                                aria-label={`Diminuir quantidade de ${item.name}`}
                              >
                                −
                              </button>

                              <span>{item.quantidade}</span>

                              <button
                                type="button"
                                onClick={() =>
                                  alterarQuantidade(item.id, .5)
                                }
                                aria-label={`Aumentar quantidade de ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="acoes-carrinho">
                            <p className="subtotal-carrinho">
                              R${' '}
                              {(Number(item.price) *
                                Number(item.quantidade))
                                .toFixed(2)
                                .replace('.', ',')}
                            </p>

                            <button
                              type="button"
                              className="botao-remover"
                              onClick={() => removerDoCarrinho(item.id)}
                            >
                              Remover
                            </button>
                          </div>
                        </article>
                      ))
                    )}
                  </div>

                  {carrinho.length > 0 && (
                    <footer className="rodape-carrinho">
                      <div className="total-carrinho">
                        <h3>Total do pedido</h3>

                        <p>
                          R$ {totalPedido.toFixed(2).replace('.', ',')}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="botao-finalizar-pedido"
                        onClick={() => setEtapaPedido('dados')}
                      >
                        Finalizar pedido
                      </button>

                      <button
                        type="button"
                        className="botao-continuar-comprando"
                        onClick={() => setMostrarCarrinho(false)}
                      >
                        Continuar comprando
                      </button>
                    </footer>
                  )}
                </>
              ) : (
                <>
                  <div className="conteudo-carrinho formulario-finalizacao">
                    <label htmlFor="nome-cliente">
                      Seu nome
                    </label>

                    <input
                      id="nome-cliente"
                      type="text"
                      value={nomeCliente}
                      onChange={(evento) =>
                        setNomeCliente(evento.target.value)
                      }
                      placeholder="Digite seu nome"
                      autoComplete="name"
                    />

                    <label htmlFor="tipo-entrega">
                      Como deseja receber o pedido?
                    </label>

                    <select
                      id="tipo-entrega"
                      value={tipoEntrega}
                      onChange={(evento) =>
                        setTipoEntrega(evento.target.value)
                      }
                    >
                      <option value="entrega">
                        Entrega em domicílio
                      </option>

                      <option value="retirada">
                        Retirada na loja
                      </option>
                    </select>

                    {tipoEntrega === 'entrega' && (
                      <>
                        <label htmlFor="endereco-entrega">
                          Endereço de entrega
                        </label>

                        <textarea
                          id="endereco-entrega"
                          value={enderecoEntrega}
                          onChange={(evento) =>
                            setEnderecoEntrega(evento.target.value)
                          }
                          placeholder="Rua, número, bairro e ponto de referência"
                          rows={4}
                        />
                      </>
                    )}

                    <div className="resumo-finalizacao">
                      <span>Total do pedido</span>

                      <strong>
                        R$ {totalPedido.toFixed(2).replace('.', ',')}
                      </strong>
                    </div>

                    <p className="aviso-finalizacao">
                      Confira seus dados. O WhatsApp abrirá com a mensagem
                      pronta para você revisar e enviar. <br/> <br />
                      ⚠️ <strong>IMPORTANTE SOBRE OS VALORES</strong>, <br/>
                      Os valores são estimados. Como alguns produtos são vendidos por peso,
                       o valor final poderá sofrer pequenas alterações conforme o peso real dos produtos. <br /> <br />
                      <b>Aguardo a confirmação do pedido. Obrigado pela preferência! 😊</b>
                    </p>
                  </div>

                  <footer className="rodape-carrinho">
                    <button
                      type="button"
                      className="botao-finalizar-pedido"
                      onClick={enviarPedidoWhatsApp}
                    >
                      Enviar pedido pelo WhatsApp
                    </button>

                    <button
                      type="button"
                      className="botao-continuar-comprando"
                      onClick={() => setEtapaPedido('carrinho')}
                    >
                      Voltar ao carrinho
                    </button>
                  </footer>
                </>
              )}
            </aside>
          </div>
        )}


    </main>
  )
}

export default App
