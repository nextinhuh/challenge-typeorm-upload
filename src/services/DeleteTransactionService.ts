import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const findTransaction = await transactionRepository.findOne(id);

    if (!findTransaction) {
      throw new AppError('Transaction not found.');
    }

    const deletedTransaction = await transactionRepository.delete(id);

    if (!deletedTransaction) {
      throw new AppError('An error happened, please try again.');
    }
  }
}

export default DeleteTransactionService;
