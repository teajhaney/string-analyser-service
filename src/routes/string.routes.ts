import { Router } from 'express';
import {
  createString,
  getStringByValue,
  getAllStrings,
  filterByNaturalLanguage,
  deleteStringByValue,
} from '@/controller/string.controller';

const router = Router();

// Create/Analyze String
router.post('/', createString);

// Get All Strings with Filtering
router.get('/', getAllStrings);

//  Natural Language Filtering
router.get('/filter-by-natural-language', filterByNaturalLanguage);

//  Get Specific String
//  Delete String
router.route('/:stringValue').get(getStringByValue).delete(deleteStringByValue);

export default router;
