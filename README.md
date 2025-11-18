# Grafogram

Uma aplicação web interativa que demonstra o uso prático de grafos em situações reais. O Grafogram é uma rede social onde os relacionamentos entre usuários são representados como um grafo, permitindo visualizar e analisar conexões sociais de forma intuitiva.

## 🎯 Sobre o Projeto

O **Grafogram** é uma ferramenta educacional que mostra como a teoria dos grafos pode ser aplicada em situações reais. Através de uma rede social simples, você pode:

- Criar uma conta e se conectar com outros usuários
- Visualizar o grafo de relacionamentos em tempo real
- Ver como as conexões sociais formam uma estrutura de grafo
- Calcular o caminho mais curto entre dois usuários usando o algoritmo de Dijkstra

## 📊 Representações Reais de Grafos

### 1. **Rede Social de Relacionamentos**

Na página principal, você visualiza um grafo onde:
- **Nós (vértices)** = Usuários da plataforma
- **Arestas (conexões)** = Relacionamentos de "seguir"

Cada vez que um usuário segue outro, uma nova aresta é criada no grafo, mostrando visualmente como as pessoas estão conectadas. Isso é exatamente como funcionam redes sociais reais como Twitter, Instagram e LinkedIn, onde os relacionamentos formam grafos complexos.

### 2. **Feed de Atividades**

O feed mostra a linha do tempo de ações (quem seguiu quem), demonstrando como eventos em um grafo podem ser registrados e visualizados cronologicamente. Isso representa como sistemas reais registram mudanças em estruturas de grafo.

### 3. **Algoritmo de Caminho Mais Curto (Dijkstra)**

A página "Caminho Mais Curto" permite:
- Criar grafos personalizados com nós e arestas ponderadas
- Calcular o caminho mais curto entre dois pontos
- Visualizar o resultado destacado no grafo

Este algoritmo tem aplicações práticas em:
- **Sistemas de navegação** (GPS, Google Maps) - encontrar a rota mais rápida
- **Redes de computadores** - roteamento de pacotes
- **Logística** - otimização de rotas de entrega
- **Redes sociais** - encontrar conexões entre pessoas (grau de separação)

## ✨ Funcionalidades

### Visualização de Grafo em Tempo Real
- Veja o grafo de relacionamentos sendo atualizado instantaneamente
- Cada usuário é um nó, cada relacionamento é uma aresta
- O layout se ajusta automaticamente conforme novos relacionamentos são criados

### Rede Social Interativa
- Crie sua conta e faça login
- Siga outros usuários e veja o grafo se atualizar
- Visualize quem está conectado a quem

### Calculadora de Caminho Mais Curto
- Crie seus próprios grafos com nós e arestas
- Defina pesos (distâncias) nas conexões
- Calcule o caminho mais curto entre dois pontos
- Veja o resultado visualmente destacado no grafo

## 🚀 Como Usar

### 1. Criar uma Conta
- Acesse a aplicação e clique em "Criar conta"
- Preencha seus dados e faça login

### 2. Explorar o Grafo
- Na página inicial, você verá o grafo de relacionamentos
- Siga outros usuários para criar novas conexões
- Observe como o grafo se atualiza em tempo real

### 3. Calcular Caminhos
- Acesse "Caminho Mais Curto" no menu
- Carregue o exemplo inicial ou crie seu próprio grafo
- Selecione origem e destino para calcular o caminho mais curto
- Veja o resultado destacado em verde no grafo

## 💡 Aplicações Práticas de Grafos

Esta ferramenta demonstra como grafos são usados em:

- **Redes Sociais**: Conexões entre pessoas (Facebook, LinkedIn)
- **Navegação**: Rotas entre locais (Google Maps, Waze)
- **Recomendações**: Sistemas que sugerem produtos ou pessoas baseados em conexões
- **Análise de Redes**: Estudo de como informações se propagam
- **Logística**: Otimização de rotas e distribuição
- **Redes de Computadores**: Roteamento de dados na internet

## 📋 Pré-requisitos

Para executar a aplicação localmente, você precisa de:
- Node.js instalado
- Banco de dados PostgreSQL
- pnpm (gerenciador de pacotes)

## 🔧 Instalação Rápida

1. Clone o repositório
2. Instale as dependências: `pnpm install`
3. Configure o banco de dados no arquivo `.env`
4. Execute as migrations: `pnpm prisma migrate dev`
5. Inicie a aplicação: `pnpm dev`

A aplicação estará disponível em `http://localhost:3000`

## 🐳 Usando Docker

Consulte o arquivo `README-DOCKER.md` para instruções detalhadas sobre como executar com Docker.

## 📚 Conceitos Demonstrados

- **Grafos Direcionados**: Relacionamentos que têm direção (A segue B)
- **Grafos Não Direcionados**: Conexões bidirecionais (usado no algoritmo de Dijkstra)
- **Grafos Ponderados**: Arestas com pesos (distâncias, custos)
- **Algoritmo de Dijkstra**: Encontrar o caminho mais curto em grafos ponderados
- **Visualização de Grafos**: Layout automático e interativo
- **Tempo Real**: Atualizações instantâneas via WebSocket

## 🎓 Propósito Educacional

O Grafogram foi criado para:
- Demonstrar aplicações práticas da teoria dos grafos
- Mostrar como estruturas de dados abstratas se manifestam em sistemas reais
- Facilitar o aprendizado através de visualização interativa
- Proporcionar uma experiência prática com algoritmos de grafos

## 👤 Autor

**Pedro Giroldo**

---

Uma ferramenta educacional para explorar o mundo dos grafos através de exemplos práticos e visuais.
