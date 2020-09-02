import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface ResquetDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: ResquetDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const categoryExists = await categoryRepository.findOne({
      title: category,
    });

    if (categoryExists) {
      if (type === 'income') {
        const newTransaction = transactionRepository.create({
          title,
          value,
          type,
          category_id: categoryExists.id,
        });

        const transaction = await transactionRepository.save(newTransaction);

        return transaction;
      }

      const balance = await transactionRepository.getBalance();

      if (value > balance.total) {
        throw new AppError('You do not have founds!');
      }

      const newTransaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: categoryExists.id,
      });

      const transaction = await transactionRepository.save(newTransaction);

      return transaction;
    }

    if (type === 'income') {
      const newCategory = categoryRepository.create({
        title: category,
      });

      const categoryCreated = await categoryRepository.save(newCategory);

      const newTransaction = transactionRepository.create({
        title,
        type,
        value,
        category_id: categoryCreated.id,
      });

      const transaction = await transactionRepository.save(newTransaction);

      return transaction;
    }

    const balance = await transactionRepository.getBalance();

    if (value > balance.total) {
      throw new AppError('You do not have founds!');
    }

    const newCategory = categoryRepository.create({
      title: category,
    });

    const categoryCreated = await categoryRepository.save(newCategory);

    const newTransaction = transactionRepository.create({
      title,
      type,
      value,
      category_id: categoryCreated.id,
    });

    const transaction = await transactionRepository.save(newTransaction);

    return transaction;
  }
}

export default CreateTransactionService;
