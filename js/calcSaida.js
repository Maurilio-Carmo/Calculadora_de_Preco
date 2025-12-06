// calcSaida.js

import { percent } from "./utils.js";

export function calcPisCofinsVenda(precoVenda, percVendaPisCofins, vICMSVenda) {
    return percent(percVendaPisCofins) * (precoVenda - vICMSVenda);
}

export function calcICMSVenda(precoVenda, percVendaICMS, percReducaoICMSSaida) {
    return precoVenda * (percent(percVendaICMS) * (1 - percent(percReducaoICMSSaida)));
}

export function calcCBSVenda(precoVenda, percCBS, percReducaoCBS) {
    return precoVenda * (percent(percCBS) * (1 - percent(percReducaoCBS)));
}

export function calcIBSUFVenda(precoVenda, percIBSUF, percReducaoIBSUF) {
    return precoVenda * (percent(percIBSUF) * (1 - percent(percReducaoIBSUF)));
}

export function calcIBSMunVenda(precoVenda, percIBSMun) {
    return precoVenda * percent(percIBSMun);
}
