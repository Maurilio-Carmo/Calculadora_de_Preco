// calcSaida.js
import { percent } from "./utils.js";

export function calcPisCofinsVenda(precoVenda, percPisCofinsVenda, valorICMSVenda) {
    return percent(percPisCofinsVenda) * (precoVenda - valorICMSVenda);
}

export function calcICMSVenda(precoVenda, percICMS, percReducao) {
    return precoVenda * (percent(percICMS) * (1 - percent(percReducao)));
}
