
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

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

  if (carregando) {
    return <p>Carregando produtos...</p>
  }

  if (erro) {
    return <p>Erro ao carregar produtos: {erro}</p>
  }

  return (
    <main>
      <h1>Hortifruti</h1>

      <h2>Nossos produtos</h2>

      {produtos.length === 0 ? (
        <p>Nenhum produto disponível.</p>
      ) : (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>
              {produto.image && (
                <img
                  src={
                    produto.image.startsWith('http')
                      ? produto.image
                      : `http://127.0.0.1:8000${produto.image}`
                  }
                  alt={produto.name}
                  width="120"
                />
              )}

              <br />

              <strong>{produto.name}</strong>
              {' — '}
              R$ {Number(produto.price).toFixed(2).replace('.', ',')}
              {' / '}
              {produto.unit}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
