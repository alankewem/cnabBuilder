# Leitor de arquivos CNAB

Utilizei o node.js na versão:

```bash
v16.11.1
```

Comando para visualizar as opções de execução disponíveis:

```bash
node src/cnabRows.js --help
```

temos o seguinte output:

```bash
Uso: cnabRows.js [options]

Options:
      --help                  Show help                                [boolean]
      --version               Show version number                      [boolean]
  -f, --from                  posição inicial de pesquisa da linha do Cnab
                                                                        [number]
  -t, --to                    posição final de pesquisa da linha do Cnab[number]
  -s, --segmento              tipo de segmento                          [string]
      --file, --arquivo       caminho do arquivo CNAB a ser lido        [string]
  -d, --devedor               nome do devedor                           [string]
      --export, --exportação  irá coletar as principais informações do arquivo CNAB e exportar para um novo arquivo com extensão .json

Examples:
  cnabRows.js -f 21 -t 34 -s p --file /path/cnab.rem
  cnabRows.js -d CAIXA ECONOMICA --file /path/cnab.rem
  cnabRows.js --export
```

**Novas funcionalidades implementadas**

**1. Leitura de Arquivo CNAB:**

- Permitir que o usuário forneça o caminho do arquivo CNAB pela linha de comando (CLI).
- O campo do arquivo é opcional; caso não seja especificado, o programa deve informar ao usuário que será utilizado um arquivo padrão.

**2. Busca por Segmentos:**

- Implementar a capacidade de buscar por segmentos específicos no arquivo CNAB.
- Exibir o nome completo das empresas associadas ao segmento informado.

**3. Pesquisa por Nome da Empresa:**

- Desenvolver uma funcionalidade que permita a busca por nome de empresa no arquivo CNAB.
- Mostrar o nome completo da empresa, não apenas o fragmento usado na pesquisa.
- Indicar a posição exata onde a empresa foi encontrada e informar a qual segmento ela pertence.

**4. Exportação para JSON:**

- Criar um novo arquivo em formato JSON contendo as informações essenciais:
  - Precisa ser uma nova opção no CLI.
  - Nome da empresa.
  - Endereço completo (incluindo avenida, rua e CEP).
  - Posições no arquivo CNAB onde as informações foram localizadas.
