import { Router } from 'express';
import {
  createString,
  getStringByValue,
  getAllStringsWithFiltering,
  filterByNaturalLanguage,
  deleteStringByValue,
  getAllSavedStrings,
} from '../controller/string.controller.ts';

const router = Router();

// Create/Analyze String
router.post('/', createString);

// Get All Strings
router.get('/get', getAllSavedStrings);

// Get All Strings with Filtering
router.get('/', getAllStringsWithFiltering);

//  Natural Language Filtering
router.get('/filter-by-natural-language', filterByNaturalLanguage);

//  Get Specific String
//  Delete String
router.route('/:stringValue').get(getStringByValue).delete(deleteStringByValue);

export default router;
