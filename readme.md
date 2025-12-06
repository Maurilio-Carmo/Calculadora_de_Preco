Segue em formato bruto, pronto para copiar e colar:

---

# 🧮 Calculadora de Margem e Preço — Documentação do Projeto

## 📜 Visão Geral

Aplicação web estruturada para cálculo de preço de venda, margem, lucro bruto e tributação incidente. O objetivo é garantir assertividade operacional, aderência tributária e padronização do fluxo de formação de preço. Projeto orientado a boas práticas, mantendo simplicidade, previsibilidade e controle.

---

## ✔️ Acesso Imediato

A solução está publicada no GitHub Pages.
Não há instalação, dependências ou processo de clonagem.

**[https://maurilio-carmo.github.io/Calculadora_de_Impostos/](https://maurilio-carmo.github.io/Calculadora_de_Impostos/)**

Toda a operação é executada no front-end.

---

## ⚙️ Requisitos Operacionais

* Navegadores suportados: Chrome, Edge e Firefox
* Arquitetura client-side em HTML, CSS e ES Modules
* Sem backend e sem dependências externas críticas

---

## 🧱 Estrutura do Sistema

### 1. Entrada de Parâmetros

Inputs conectados ao `controller.js` via IDs padronizados:

* Preço de compra
* Margem desejada
* Créditos tributários (PIS/COFINS, ICMS)
* Redução de base
* ICMS ST
* IPI
* Tributos de saída (ICMS, PIS/COFINS, CBS, IBS UF/Mun)

### 2. Processamento e Outputs

Consolidação executada pelos módulos:

* `calcEntrada.js`
* `calcSaida.js`
* `calcResultado.js`
* `utils.js`

Outputs gerados:

* Preço final
* Markup
* CMV
* Tributos individualizados
* Lucro bruto
* Resumo consolidado no painel de resultados

---

## 🚀 Como Utilizar

1. Acesse o link público.
2. Preencha os parâmetros fiscais e comerciais.
3. O sistema calcula automaticamente em tempo real.
4. O painel exibe preço, margem, tributos e indicadores.

---

## 📌 Observações Técnicas

* Fluxo determinístico e segregado por responsabilidade
* Inputs validados e normalizados
* Renderização orientada por IDs padronizados
* Layout otimizado para uso corporativo
