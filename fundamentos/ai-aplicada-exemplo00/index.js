import * as tf from '@tensorflow/tfjs';

async function trainModel(xs, ys) {
    const model = tf.sequential();
    //primeira camada
    //entrada de 7 posição (idade normalizada, 3 cores e 3 localizações)
    //80 neurônios = tudo isso porque tem pouca quantidade de dados
    //quanto mais neurônios, mais complexa a rede

    //ativação relu age como filtro, deixando passar apenas os valores positivos
    model.add(tf.layers.dense({ inputShape: [7], units: 80, activation: 'relu' }));

    //sainda 3 neurônios, pois queremos classificar em 3 categorias (premium, medium, basic)
    //ativação softmax é usada para classificação, pois transforma os valores de saída em probabilidades
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

    //otimizador adam é um algoritmo de otimização que ajusta os pesos da rede para minimizar a função de perda
    //loss categoricalCrossentropy é usada para problemas de classificação multiclasse, pois mede a diferença entre as distribuições de probabilidade previstas e reais
    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

    //treinamento do modelo
    //verbose: 0 para não mostrar o progresso do treinamento
    //epochs: 100 para treinar por 100 iterações
    //shuffle: true para embaralhar os dados a cada época, evitando que o modelo aprenda padrões específicos da ordem dos dados
    await model.fit(xs, ys, {
        verbose: 0, epochs: 100, shuffle: true, callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.acc}`);
            }
        }
    });

    return model;
}

async function predict(model, pessoa) {
    //transformar array js em tensor
    const inputTensor = tf.tensor2d(pessoa);

    //fazer a previsão usando o modelo treinado
    const pred = model.predict(inputTensor);
    const predArray = await pred.array();
    return predArray[0].map((prod, index) => ({ prod, index }));
}

//Exemplo de pessoas
// const pessoas = [
//     { nome: 'João', idade: 30, cor: "verde", localizacao: "São Paulo" },
//     { nome: 'Maria', idade: 25, cor: "azul", localizacao: "Rio de Janeiro" },
//     { nome: 'Pedro', idade: 40, cor: "vermelho", localizacao: "Belo Horizonte" }
// ];

//Vetores de entrada com valores normalizados
//Ordem: [idade, cor_verde, cor_azul, cor_vermelho, localizacao_São_Paulo, localizacao_Rio_de_Janeiro, localizacao_Belo_Horizonte]
// const tensorPessoas = [
//     [0.33, 1, 0, 0, 1, 0, 0], // João
//     [0, 0, 1, 0, 0, 1, 0], // Maria
//     [1, 0, 0, 1, 0, 0, 1]  // Pedro
// ]

const tensorPessoasNormalizado = [
    [0.33, 1, 0, 0, 1, 0, 0], // João
    [0.25, 0, 1, 0, 0, 1, 0], // Maria
    [0.40, 0, 0, 1, 0, 0, 1]  // Pedro  
]

//Labels de catecoria a serem previstas
// [premium, medium, basic]

const labelsNomes = ['premium', 'medium', 'basic']
const tensorLabels = [
    [1, 0, 0], // João é premium
    [0, 1, 0], // Maria é medium
    [0, 0, 1]  // Pedro é basic
]

//criando tensor de entrada e tensor de saída
const xs = tf.tensor2d(tensorPessoasNormalizado);
const ys = tf.tensor2d(tensorLabels);

const model = await trainModel(xs, ys);

const pessoa = {
    nome: 'Ana',
    idade: 28,
    cor: "verde",
    localizacao: "São Paulo"
}

//normalizando idade de Ana
//exemplo idade minima = 25 ideade máxima = 40 resuldado = 0.2
const idadeMin = 25;
const idadeMax = 40;
const idadeNormalizada = (pessoa.idade - idadeMin) / (idadeMax - idadeMin);

const pessoaTensorNormalizada = [
    [0.2, 0, 1, 0, 0, 1, 0] // Ana
]

const predicao = await predict(model, pessoaTensorNormalizada);
const resultado = predicao.sort((a, b) => b.prod - a.prod).map(p => `${labelsNomes[p.index]} (${(p.prod * 100).toFixed(2)}%)`).join('\n');

console.log(resultado)