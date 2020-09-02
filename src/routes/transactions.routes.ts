import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import UploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(UploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    category,
    title,
    type,
    value,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ id });

  return response.send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionsService();

    const file = await importTransactionService.execute(request.file.filename);

    return response.json(file);
  },
);

export default transactionsRouter;
