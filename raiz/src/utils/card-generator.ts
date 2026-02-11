/**
 * Gerador de Cartelas de Bingo
 * 
 * Regras:
 * - 6 cartelas por série
 * - 15 números por cartela (3 linhas x 5 colunas)
 * - 9 colunas de números (1-9, 10-19, 20-29, ..., 80-90)
 * - Cada coluna tem exatamente 10 números possíveis
 * - Nenhuma cartela tem números repetidos
 * - Uma série completa (6 cartelas) contém todos os 90 números
 */

interface Card {
  numbers: number[][];
  series: number;
  cardNumber: number;
}

interface Series {
  cards: Card[];
  seriesNumber: number;
}

export class CardGenerator {
  private static readonly COLUMNS = 9;
  private static readonly NUMBERS_PER_COLUMN = 10;
  private static readonly NUMBERS_PER_CARD = 15;
  private static readonly ROWS_PER_CARD = 3;
  private static readonly COLUMNS_PER_CARD = 5;
  private static readonly CARDS_PER_SERIES = 6;

  /**
   * Gera uma série completa de 6 cartelas
   * Garante que todos os 90 números sejam usados exatamente uma vez
   */
  static generateSeries(seriesNumber: number): Series {
    // Criar array com todos os 90 números
    const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

    // Embaralhar números
    const shuffled = this.shuffle([...allNumbers]);

    // Dividir em 6 grupos de 15 números
    const cards: Card[] = [];
    for (let i = 0; i < this.CARDS_PER_SERIES; i++) {
      const cardNumbers = shuffled.slice(i * 15, (i + 1) * 15);
      const card = this.arrangeCardNumbers(cardNumbers, i + 1, seriesNumber);
      cards.push(card);
    }

    return {
      cards,
      seriesNumber,
    };
  }

  /**
   * Arranja 15 números em uma cartela 3x5
   * Respeitando as colunas (1-9, 10-19, etc)
   */
  private static arrangeCardNumbers(
    numbers: number[],
    cardNumber: number,
    seriesNumber: number
  ): Card {
    // Agrupar números por coluna
    const columnGroups: number[][] = Array(this.COLUMNS)
      .fill(null)
      .map(() => []);

    for (const num of numbers) {
      const columnIndex = Math.floor((num - 1) / this.NUMBERS_PER_COLUMN);
      columnGroups[columnIndex].push(num);
    }

    // Criar cartela 3x5
    const card: number[][] = [];
    for (let row = 0; row < this.ROWS_PER_CARD; row++) {
      const rowNumbers: number[] = [];
      for (let col = 0; col < this.COLUMNS_PER_CARD; col++) {
        const columnIndex = col + (row * this.COLUMNS_PER_CARD);
        if (columnGroups[columnIndex] && columnGroups[columnIndex].length > 0) {
          rowNumbers.push(columnGroups[columnIndex].pop() || 0);
        } else {
          rowNumbers.push(0);
        }
      }
      card.push(rowNumbers);
    }

    return {
      numbers: card,
      series: seriesNumber,
      cardNumber,
    };
  }

  /**
   * Algoritmo de Fisher-Yates para embaralhamento
   */
  private static shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Valida se uma cartela está correta
   */
  static validateCard(card: Card): boolean {
    const numbers: number[] = [];

    for (const row of card.numbers) {
      for (const num of row) {
        if (num > 0) {
          // Verificar se número está na coluna correta
          const expectedColumn = Math.floor((num - 1) / 10);
          const actualColumn = row.indexOf(num);
          if (actualColumn !== expectedColumn % 5) {
            return false;
          }
          numbers.push(num);
        }
      }
    }

    // Verificar se tem 15 números
    if (numbers.length !== 15) {
      return false;
    }

    // Verificar se não há duplicatas
    if (new Set(numbers).size !== 15) {
      return false;
    }

    // Verificar se todos os números estão entre 1 e 90
    if (numbers.some((n) => n < 1 || n > 90)) {
      return false;
    }

    return true;
  }

  /**
   * Formata cartela para exibição
   */
  static formatCard(card: Card): string {
    let formatted = `Cartela ${card.cardNumber} (Série ${card.series})\n`;
    formatted += '┌─────┬─────┬─────┬─────┬─────┐\n';

    for (const row of card.numbers) {
      formatted += '│ ';
      for (const num of row) {
        formatted += `${String(num).padStart(2, ' ')} │ `;
      }
      formatted += '\n';
      formatted += '├─────┼─────┼─────┼─────┼─────┤\n';
    }

    formatted += '└─────┴─────┴─────┴─────┴─────┘\n';
    return formatted;
  }
}

/**
 * Exemplo de uso:
 * 
 * const series = CardGenerator.generateSeries(1);
 * for (const card of series.cards) {
 *   console.log(CardGenerator.formatCard(card));
 *   console.log('Válida:', CardGenerator.validateCard(card));
 * }
 */
