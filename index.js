let logs = [];

// Função para capturar o log
function customLog(message) {
    console.log(message);
    logs.push(message); // Armazena o log no array
}

// Função para gerar o arquivo .txt com os logs
function downloadLogs() {
    const blob = new Blob([logs.join("\n")], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ERROS.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const validStatusCodes = [
    100, 101, 102, 200, 201, 202, 203, 204, 206, 207, 300, 301, 302, 303, 
    304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 
    410, 411, 412, 413, 414, 415, 416, 417, 418, 420, 421, 422, 423, 424, 
    425, 426, 429, 431, 444, 450, 451, 497, 498, 499, 500, 501, 502, 503, 
    504, 505, 506, 507, 508, 509, 510, 511, 521, 523, 525, 599
];

const statusDescriptions = {
    100: { code: 100, description: "Continue", resolution: "Aguarde a próxima parte da solicitação do cliente." },
    101: { code: 101, description: "Switching Protocols", resolution: "O servidor está mudando os protocolos conforme solicitado." },
    102: { code: 102, description: "Processing", resolution: "A solicitação está sendo processada, aguarde." },
    200: { code: 200, description: "OK", resolution: "Nenhuma ação é necessária, a solicitação foi bem-sucedida." },
    201: { code: 201, description: "Created", resolution: "O recurso foi criado com sucesso." },
    202: { code: 202, description: "Accepted", resolution: "A solicitação foi aceita, mas ainda está em processamento." },
    203: { code: 203, description: "Non-Authoritative Information", resolution: "Informações retornadas podem não ser do servidor original." },
    204: { code: 204, description: "No Content", resolution: "Nenhum conteúdo a ser enviado na resposta." },
    206: { code: 206, description: "Partial Content", resolution: "Parte do recurso foi retornada." },
    207: { code: 207, description: "Multi-Status", resolution: "Resposta com vários status para múltiplas operações." },
    300: { code: 300, description: "Multiple Choices", resolution: "Várias opções disponíveis, escolha uma." },
    301: { code: 301, description: "Moved Permanently", resolution: "O recurso foi movido permanentemente para outra URL." },
    302: { code: 302, description: "Found", resolution: "O recurso foi encontrado em outra URL temporariamente." },
    303: { code: 303, description: "See Other", resolution: "O recurso pode ser encontrado em outra URL." },
    304: { code: 304, description: "Not Modified", resolution: "O recurso não foi modificado desde a última solicitação." },
    305: { code: 305, description: "Use Proxy", resolution: "O recurso só está disponível através de um proxy." },
    307: { code: 307, description: "Temporary Redirect", resolution: "Redirecionamento temporário para outra URL." },
    308: { code: 308, description: "Permanent Redirect", resolution: "Redirecionamento permanente para outra URL." },
    400: { code: 400, description: "Bad Request", resolution: "Corrija a solicitação e tente novamente." },
    401: { code: 401, description: "Unauthorized", resolution: "Autenticação necessária para acessar o recurso." },
    402: { code: 402, description: "Payment Required", resolution: "Pagamento necessário para acessar o recurso." },
    403: { code: 403, description: "Forbidden", resolution: "Permissão negada para acessar o recurso." },
    404: { code: 404, description: "Not Found", resolution: "Verifique se o URL está correto." },
    405: { code: 405, description: "Method Not Allowed", resolution: "Método HTTP não permitido para este recurso." },
    406: { code: 406, description: "Not Acceptable", resolution: "O recurso não é compatível com os cabeçalhos da solicitação." },
    407: { code: 407, description: "Proxy Authentication Required", resolution: "Autenticação no proxy necessária." },
    408: { code: 408, description: "Request Timeout", resolution: "A solicitação demorou muito para ser processada." },
    409: { code: 409, description: "Conflict", resolution: "Conflito com o estado atual do recurso." },
    410: { code: 410, description: "Gone", resolution: "O recurso não está mais disponível." },
    411: { code: 411, description: "Length Required", resolution: "Cabeçalho Content-Length é obrigatório." },
    412: { code: 412, description: "Precondition Failed", resolution: "Uma pré-condição falhou." },
    413: { code: 413, description: "Payload Too Large", resolution: "O corpo da solicitação é muito grande." },
    414: { code: 414, description: "URI Too Long", resolution: "O URI da solicitação é muito longo." },
    415: { code: 415, description: "Unsupported Media Type", resolution: "O tipo de mídia não é suportado." },
    416: { code: 416, description: "Range Not Satisfiable", resolution: "O intervalo solicitado não pode ser atendido." },
    417: { code: 417, description: "Expectation Failed", resolution: "A expectativa dada no cabeçalho Expect não pode ser atendida." },
    418: { code: 418, description: "I'm a teapot", resolution: "O servidor é um bule de chá, não pode preparar café." },
    420: { code: 420, description: "Enhance Your Calm", resolution: "Reduza a velocidade das solicitações." },
    421: { code: 421, description: "Misdirected Request", resolution: "A solicitação foi direcionada para um servidor errado." },
    422: { code: 422, description: "Unprocessable Entity", resolution: "A solicitação está bem formada, mas não pode ser processada." },
    423: { code: 423, description: "Locked", resolution: "O recurso está bloqueado." },
    424: { code: 424, description: "Failed Dependency", resolution: "Falha na dependência de outra solicitação." },
    425: { code: 425, description: "Too Early", resolution: "A solicitação foi enviada muito cedo." },
    426: { code: 426, description: "Upgrade Required", resolution: "O cliente deve atualizar para um protocolo diferente." },
    429: { code: 429, description: "Too Many Requests", resolution: "Muitas solicitações enviadas em um curto período." },
    431: { code: 431, description: "Request Header Fields Too Large", resolution: "Os campos do cabeçalho são muito grandes." },
    444: { code: 444, description: "Connection Closed Without Response", resolution: "A conexão foi fechada sem uma resposta." },
    450: { code: 450, description: "Blocked by Windows Parental Controls", resolution: "Bloqueado pelos controles parentais do Windows." },
    451: { code: 451, description: "Unavailable For Legal Reasons", resolution: "Indisponível por razões legais." },
    497: { code: 497, description: "HTTP Request Sent to HTTPS Port", resolution: "Envie a solicitação para a porta HTTPS correta." },
    498: { code: 498, description: "Invalid Token", resolution: "O token fornecido é inválido ou expirou." },
    499: { code: 499, description: "Client Closed Request", resolution: "O cliente fechou a solicitação antes de uma resposta." },
    500: { code: 500, description: "Internal Server Error", resolution: "Corrija erros no servidor." },
    501: { code: 501, description: "Not Implemented", resolution: "O servidor não suporta a funcionalidade necessária." },
    502: { code: 502, description: "Bad Gateway", resolution: "Problema com o servidor de gateway ou proxy." },
    503: { code: 503, description: "Service Unavailable", resolution: "O servidor está temporariamente indisponível." },
    504: { code: 504, description: "Gateway Timeout", resolution: "O servidor de gateway não respondeu a tempo." },
    505: { code: 505, description: "HTTP Version Not Supported", resolution: "A versão HTTP usada não é suportada." },
    506: { code: 506, description: "Variant Also Negotiates", resolution: "Erro de negociação de conteúdo no servidor." },
    507: { code: 507, description: "Insufficient Storage", resolution: "O servidor não tem espaço suficiente para armazenar a solicitação." },
    508: { code: 508, description: "Loop Detected", resolution: "Um loop infinito foi detectado no processamento da solicitação." },
    509: { code: 509, description: "Bandwidth Limit Exceeded", resolution: "O limite de banda foi excedido." },
    510: { code: 510, description: "Not Extended", resolution: "Extensões adicionais são necessárias para o recurso." },
    511: { code: 511, description: "Network Authentication Required", resolution: "A autenticação de rede é necessária." },
    521: { code: 521, description: "Web Server Is Down", resolution: "O servidor web está indisponível." },
    523: { code: 523, description: "Origin Is Unreachable", resolution: "O servidor de origem não pode ser alcançado." },
    525: { code: 525, description: "SSL Handshake Failed", resolution: "Erro no handshake SSL." },
    599: { code: 599, description: "Network Connect Timeout Error", resolution: "Erro de timeout na conexão com a rede." }
};

let randomNumbers = []; // Lista dinâmica para os números a serem usados

// Função para embaralhar a lista de status válidos e gerar novos números
function generateRandomNumbers() {
    return validStatusCodes.sort(() => Math.random() - 0.5); // Embaralha os status
}

document.getElementById('yellow-button').addEventListener('click', function () {
    const container = document.getElementById('container');
    const descricaoDiv = document.querySelector('.descricao');

    // Se a lista estiver vazia, regenerar números aleatórios válidos
    if (randomNumbers.length === 0) {
        randomNumbers = generateRandomNumbers();
        customLog('Nova lista de status gerada: ' + randomNumbers);
    }




    // Pega o próximo número da lista
    const randomNum = randomNumbers.shift(); // Remove e retorna o primeiro número da lista
    //customLog('Número selecionado: ' + randomNum );
    


    const resolutions = Object.values(statusDescriptions).map(status => status.resolution);
    if (statusDescriptions[randomNum]) {
    const { code, resolution } = statusDescriptions[randomNum];
    customLog(`Número selecionado: ${randomNum}, resolução: ${resolution}`);
    } else {
    customLog(`Número selecionado: ${randomNum}`);
    }

    //console.log(resolutions);
   

    // Atualiza a descrição e resolução do status
    if (statusDescriptions[randomNum]) {
        const { description, resolution } = statusDescriptions[randomNum];
        descricaoDiv.innerHTML = `<strong>${description}</strong><br>${resolution}`;
    } else {
        descricaoDiv.innerHTML = "Descrição não disponível.";
    }

    // Faz a requisição e insere a imagem correspondente
    const image = new Image();
    image.src = `https://http.cat/${randomNum}`;
    image.alt = `Status ${randomNum}`;
    image.style.width = '100%';
    image.style.height = '100%';

    container.innerHTML = ''; // Limpa o conteúdo anterior
    container.appendChild(image); // Adiciona a nova imagem
});

// Evento para o botão verde salvar os logs
document.getElementById('green-button').addEventListener('click', function() {
    downloadLogs(); // Chama a função para baixar o arquivo de logs
});

// Evento para o botão vermelho resetar a lista e limpar os logs
document.getElementById('red-button').addEventListener('click', function() {
    randomNumbers = []; // Limpa a lista de números aleatórios
    logs = []; // Limpa os logs
    console.log("Lista de números e logs foram resetados.");
});
