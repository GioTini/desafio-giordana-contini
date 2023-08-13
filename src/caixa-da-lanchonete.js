const CARDAPIO = {
    cafe: 3.00,
    chantily: 1.50,
    suco: 6.20,
    sanduiche: 6.50,
    queijo: 2.00,
    salgado: 7.25,
    combo1: 9.50,
    combo2: 7.50,
};

class CaixaDaLanchonete {
    calcularValorDaCompra(metodoDePagamento, itens) {
        const itensMapeadosParaTipoEsperado = itens.map(this.converterStringItensParaTipoEsperado)

        if (!this.carrinhoComprasPossuiItens(itensMapeadosParaTipoEsperado)) {
            return "Não há itens no carrinho de compra!";
        }

        try {
            const calculoValorTotalPorItensCarrinho =
                this.calcularValorDosItens(itensMapeadosParaTipoEsperado);

            const valorTotalComDescontoOuTaxasAplicados =
                this.aplicaDescontoOuTaxa(calculoValorTotalPorItensCarrinho, metodoDePagamento)

            return this.formatarValorTotal(valorTotalComDescontoOuTaxasAplicados);
        } catch (e) {
            return e.message;
        }
    }

    converterStringItensParaTipoEsperado = (stringItens) => {
        const [codigo, quantidade] = stringItens.split(',');
        return {codigo: codigo, quantidade: parseInt(quantidade)};
    };

    carrinhoComprasPossuiItens(itens) {
        return itens && itens.length > 0;
    }

    calcularValorDosItens(itens) {
        let valorTotal = 0;

        for (let item of itens) {

            if (!CARDAPIO[item.codigo]) {
                throw new Error("Item inválido!");
            }

            if (item.quantidade <= 0) {
                throw new Error("Quantidade inválida!");
            }

            if (this.possuiItensExtraSemItemPrincipal(item, itens)) {
                throw new Error("Item extra não pode ser pedido sem o principal");
            }

            valorTotal += CARDAPIO[item.codigo] * item.quantidade;
        }

        return valorTotal;
    }

    possuiItensExtraSemItemPrincipal(item, itens) {
        return (item.codigo === 'chantily' && !itens.find(i => i.codigo === 'cafe'))
            || (item.codigo === 'queijo' && !itens.find(i => i.codigo === 'sanduiche'))
    }

    aplicaDescontoOuTaxa(valor, metodoDePagamento) {
        if (metodoDePagamento === 'dinheiro') {
            const DESCONTO_PAGAMENTO_DINHEIRO = 0.95;
            return valor * DESCONTO_PAGAMENTO_DINHEIRO;
        } else if (metodoDePagamento === 'credito') {
            const ACRESCIMO_PAGAMENTO_CREDITO = 1.03;
            return valor * ACRESCIMO_PAGAMENTO_CREDITO;
        } else if (metodoDePagamento !== 'debito') {
            throw new Error("Forma de pagamento inválida!");
        }
        return valor;
    }

    formatarValorTotal(valorTotal) {
        return `R$ ${valorTotal
            .toFixed(2)
            .replace('.', ',')}`;
    }
}

export {CaixaDaLanchonete};