// calcSaida.js
import { percent } from "./utils.js";

export function calcPisCofinsVenda(precoVenda, percVendaPisCofins, vVendaICMS) {
    return percent(percVendaPisCofins) * (precoVenda - vVendaICMS);
}

export function calcICMSVenda(precoVenda, percVendaICMS, percReducaoSaida) {
    return precoVenda * (percent(percVendaICMS) * (1 - percent(percReducaoSaida)));
}
