// calcSaida.js

import { percent } from "./utils.js";

export function calcPisCofinsVenda(precoVenda, percVendaPisCofins, vICMSVenda) {
    return percent(percVendaPisCofins) * (precoVenda - vICMSVenda);
}

export function calcICMSVenda(precoVenda, percVendaICMS, percReducaoICMSSaida) {
    return precoVenda * (percent(percVendaICMS) * (1 - percent(percReducaoICMSSaida)));
}
