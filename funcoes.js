function parse(v) {
    return Number(v) || 0;
}

function calcularCmv() {
    const precoCompra     = parse(document.getElementById("precoCompra").value);
    const pisCof          = parse(document.getElementById("creditoPisCofins").value) / 100;
    const creditoIcms     = parse(document.getElementById("creditoIcms").value) / 100;
    const reducaoBcIcms   = parse(document.getElementById("reducaoBcIcms").value) / 100;
    const icmsSt          = parse(document.getElementById("icmsSt").value) / 100;
    const reducaoBcSt     = parse(document.getElementById("reducaoBcSt").value) / 100;
    const ipi             = parse(document.getElementById("ipi").value) / 100;

    const valorCreditoPisCof = pisCof * precoCompra;

    const valorCreditoIcms = (icmsSt === 0)
        ? precoCompra * (creditoIcms * (1 - reducaoBcIcms))
        : 0;

    const valorIcmsSt = precoCompra * (icmsSt * (1 - reducaoBcSt));
    const valorIpi    = precoCompra * ipi;

    const cmv = precoCompra
                - (valorCreditoPisCof + valorCreditoIcms)
                + (valorIcmsSt + valorIpi);

    document.getElementById("cmv").value = cmv.toFixed(2);
    return cmv;
}

function calcularPrecoVenda() {
    const cmv              = calcularCmv();
    const margem           = parse(document.getElementById("margemDesejada").value) / 100;
    const pisVenda         = parse(document.getElementById("pisCofinsVenda").value) / 100;
    const icmsVenda        = parse(document.getElementById("icmsVenda").value) / 100;
    const reducaoBcSaida   = parse(document.getElementById("reducaoBcSaida").value) / 100;

    const cargaIcmsVenda   = icmsVenda * (1 - reducaoBcSaida);

    const divisor          = 1 - (margem + pisVenda + cargaIcmsVenda);
    const precoVenda       = cmv / divisor;

    document.getElementById("precoVenda").value = precoVenda.toFixed(2);
    return precoVenda;
}

function calcularEncargosVenda() {
    const precoVenda       = calcularPrecoVenda();
    const precoCompra      = parse(document.getElementById("precoCompra").value);

    const pisVenda         = parse(document.getElementById("pisCofinsVenda").value) / 100;
    const icmsVenda        = parse(document.getElementById("icmsVenda").value) / 100;
    const reducaoBcSaida   = parse(document.getElementById("reducaoBcSaida").value) / 100;

    const creditoPis       = parse(document.getElementById("creditoPisCofins").value) / 100;
    const creditoIcms      = parse(document.getElementById("creditoIcms").value) / 100;
    const reducaoBcIcms    = parse(document.getElementById("reducaoBcIcms").value) / 100;

    const valorPisVenda    = pisVenda * precoVenda;
    const valorIcmsVenda   = precoVenda * (icmsVenda * (1 - reducaoBcSaida));

    const valorCreditoPis  = creditoPis * precoCompra;
    const valorCreditoIcms = precoCompra * (creditoIcms * (1 - reducaoBcIcms));

    const pisApagar        = valorPisVenda - valorCreditoPis;
    const icmsApagar       = valorIcmsVenda - valorCreditoIcms;

    document.getElementById("pisCofinsApagar").value = pisApagar.toFixed(2);
    document.getElementById("icmsApagar").value      = icmsApagar.toFixed(2);
    document.getElementById("fornecedorApagar").value = precoCompra.toFixed(2);
}

function calcularResultado() {
    calcularEncargosVenda();

    const precoVenda  = parse(document.getElementById("precoVenda").value);
    const cmv         = parse(document.getElementById("cmv").value);
    const pisVenda    = (parse(document.getElementById("pisCofinsVenda").value) / 100) * precoVenda;
    const icmsVenda   = (parse(document.getElementById("icmsVenda").value) / 100) * precoVenda;
    const precoCompra = parse(document.getElementById("precoCompra").value);

    const lucroBruto  = precoVenda - (cmv + pisVenda + icmsVenda);
    const margemFinal = lucroBruto / precoVenda;
    const markUp      = (precoVenda - precoCompra) / precoCompra;

    document.getElementById("lucroBruto").value   = lucroBruto.toFixed(2);
    document.getElementById("margemFinal").value  = (margemFinal * 100).toFixed(2);
    document.getElementById("markUp").value       = (markUp * 100).toFixed(2);
}
