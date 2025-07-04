import express from 'express';
import { CountryController } from '../controllers/countryController';

const router = express.Router();
const countryController = new CountryController();

router.get('/', countryController.getAllCountries);
router.get('/:id', countryController.getCountryById);
router.post('/', countryController.createCountry);
router.put('/:id', countryController.updateCountry);
router.delete('/:id', countryController.deleteCountry);

export default router;