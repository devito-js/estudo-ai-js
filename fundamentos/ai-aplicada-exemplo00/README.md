# Rede Neural com TensorFlow.js (Node.js)

Este projeto é um exemplo simples de classificação multiclasse usando `@tensorflow/tfjs` em Node.js.

A ideia é treinar uma rede neural para classificar um perfil de pessoa em uma das categorias:

- `premium`
- `medium`
- `basic`

## Objetivo

Demonstrar, de forma didática:

- como montar uma rede neural densa (`tf.sequential`)
- como preparar dados de entrada em formato numérico
- como treinar o modelo com `categoricalCrossentropy`
- como fazer predição e exibir probabilidades por classe

## Tecnologias

- Node.js
- TensorFlow.js (`@tensorflow/tfjs`)

## Estrutura do Projeto

- `index.js`: código principal (definição da rede, treino e predição)
- `package.json`: scripts e dependências

## Como os dados são representados

A entrada do modelo tem **7 features** nesta ordem:

1. idade normalizada
2. cor verde
3. cor azul
4. cor vermelho
5. localização São Paulo
6. localização Rio de Janeiro
7. localização Belo Horizonte

Exemplo de vetor:

```js
[0.33, 1, 0, 0, 1, 0, 0]
```

As saídas são one-hot com 3 classes:

- `[1, 0, 0]` => `premium`
- `[0, 1, 0]` => `medium`
- `[0, 0, 1]` => `basic`

## Arquitetura da rede

No `index.js`, o modelo usa:

- camada densa de entrada: `inputShape: [7]`, `units: 80`, `activation: 'relu'`
- camada de saída: `units: 3`, `activation: 'softmax'`
- compilação: `optimizer: 'adam'`, `loss: 'categoricalCrossentropy'`, `metrics: ['accuracy']`
- treino: `epochs: 100`, `shuffle: true`

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Rode o projeto:

```bash
npm start
```

## Saída esperada

Ao final do treino, o terminal exibe as probabilidades de cada plano para a pessoa avaliada, por exemplo:

```text
premium (78.12%)
medium (15.44%)
basic (6.44%)
```

Os valores mudam a cada execução por causa da inicialização aleatória dos pesos e do conjunto muito pequeno de treino.

## Script disponível

- `npm start`: executa `node index.js`
