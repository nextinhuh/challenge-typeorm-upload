import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactions = await this.find({
      type: 'income',
    });

    const income = incomeTransactions.reduce((accumulator, transaction) => {
      return accumulator + transaction.value;
    }, 0);

    const outcomeTransactions = await this.find({
      type: 'outcome',
    });

    const outcome = outcomeTransactions.reduce((accumulator, transaction) => {
      return accumulator + transaction.value;
    }, 0);

    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }
}

export default TransactionsRepository;
