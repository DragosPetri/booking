import express from 'express';
import multer from 'multer';
import moment from 'moment';

import {
  booleanSchema,
  dateSchema,
  emailSchema,
  idSchema,
  longTextSchema,
  positiveNumberSchema,
  shortTextSchema,
} from '../../middlewares/validate.js';
import {
  findAllCentres,
  findCentreById,
  findAllBookingsByCentreId,
  findAllBookingDates,
  findAllBookingsWithCentreDetails,
  findAllRecurrentBookingsWithCentreDetails,
  insertCentre,
  insertBooking,
  insertRecurrentBooking,
  insertImage,
  updateCentreType,
  updateCentreLocation,
  updateCentrePrice,
  updateCentreDescription,
  updateCentreName,
  deleteCentre,
} from '../../db/db.js';

const router = express.Router();

// Get all centres
router.get('/', async (req, res) => {
  const result = await findAllCentres();
  return res.json(result);
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  const result = await findAllBookingsWithCentreDetails();
  return res.json(result);
});

// Get all recurrent bookings
router.get('/recurrent', async (req, res) => {
  const result = await findAllRecurrentBookingsWithCentreDetails();
  return res.json(result);
});

// Get centre data
router.get('/:centreId', async (req, res) => {
  const { centreId } = req.params;

  try {
    await idSchema.validateAsync(centreId);
  } catch (e) {
    return res.status(400).end();
  }

  try {
    const result = await findCentreById(centreId);

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).end();
  }
});

// Get bookings of centre
router.get('/:centreId/bookings', async (req, res) => {
  const { centreId } = req.params;

  try {
    await idSchema.validateAsync(centreId);
  } catch (e) {
    return res.status(400).end();
  }

  try {
    const result = await findAllBookingsByCentreId(centreId);

    if (!result.length) return res.status(204).end();

    return res.status(200).send(result);
  } catch (e) {
    return res.status(500).end();
  }
});

// Get dates on a day of a centre
router.post('/:centreId/bookings/dates', async (req, res) => {
  const { centreId } = req.params;
  const { date } = req.body;

  try {
    await idSchema.validateAsync(centreId);
    await dateSchema.validateAsync(date);
  } catch (e) {
    return res.status(400).end();
  }

  try {
    const result = await findAllBookingDates({ centreId, date });

    if (!result.length) return res.status(204).end();
    return res.status(200).send(result);
  } catch (e) {
    return res.status(500).end();
  }
});

// Add new centre
router.put('/', async (req, res) => {
  const {
    name, type, price, location, description,
  } = req.body;

  try {
    await shortTextSchema.validateAsync(name);
    await shortTextSchema.validateAsync(type);
    await positiveNumberSchema.validateAsync(price);
    await shortTextSchema.validateAsync(location);
    await longTextSchema.validateAsync(description);
  } catch (e) {
    return res.status(400).end();
  }

  const data = {
    name,
    type,
    price,
    location,
    description,
  };

  const result = await insertCentre(data);
  if (result !== null) return res.status(200).end();
  return res.status(400).end();
});

// Add new booking at the specified centre
router.put('/:centreId/bookings', async (req, res) => {
  const { centreId } = req.params;
  const { email, date, recurrent } = req.body;

  try {
    await emailSchema.validateAsync(email);
    await idSchema.validateAsync(centreId);
    await dateSchema.validateAsync(date);
    await booleanSchema.validateAsync(recurrent);
  } catch (e) {
    return res.status(400).end();
  }

  const recurrentString = recurrent ? 'True' : 'False';

  const result = await insertBooking({
    email, centreId, date, recurrent: recurrentString,
  });
  if (result !== null) {
    if (recurrent) {
      const nextDate = moment.utc(date).add(7, 'd').format();

      await insertBooking({
        email, centreId, date: nextDate, recurrent: recurrentString,
      });
      await insertRecurrentBooking({
        email, centreId, date, nextDate,
      });
    }
    return res.status(200).end();
  }
  return res.status(400).end();
});

// Delete centre
router.delete('/', async (req, res) => {
  const { id } = req.body;

  try {
    await idSchema.validateAsync(id);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findCentreById(id);
  if (result) {
    await deleteCentre(id);
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Update centre's name
router.patch('/name', async (req, res) => {
  const { id, name } = req.body;

  try {
    await idSchema.validateAsync(id);
    await shortTextSchema.validateAsync(name);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findCentreById(id);
  if (result) {
    await updateCentreName({ name, id });
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Update centre's type
router.patch('/type', async (req, res) => {
  const { id, type } = req.body;

  try {
    await idSchema.validateAsync(id);
    await shortTextSchema.validateAsync(type);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findCentreById(id);
  if (result) {
    await updateCentreType({ type, id });
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Update centre's location
router.patch('/location', async (req, res) => {
  const { id, location } = req.body;

  try {
    await idSchema.validateAsync(id);
    await shortTextSchema.validateAsync(location);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findCentreById(id);
  if (result) {
    await updateCentreLocation({ location, id });
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Update centre's price
router.patch('/price', async (req, res) => {
  const { id, price } = req.body;

  try {
    await idSchema.validateAsync(id);
    await positiveNumberSchema.validateAsync(price);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findCentreById(id);
  if (result) {
    await updateCentrePrice({ price, id });
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Update centre's description
router.patch('/description', async (req, res) => {
  const { id, description } = req.body;

  try {
    await idSchema.validateAsync(id);
    await longTextSchema.validateAsync(description);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findCentreById(id);
  if (result) {
    await updateCentreDescription({ description, id });
    return res.status(200).end();
  }
  return res.status(404).end();
});

// FORM DATA
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'uploads');
  },
  filename: (req, file, callBack) => {
    callBack(null, file.originalname);
  },
});

// Update image of centre
const upload = multer({ storage }).single('file');
router.patch('/:id/image', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).end();
    }
    if (req.file) {
      const { filename } = req.file;
      const { id } = req.params;

      try {
        await idSchema.validateAsync(id);
      } catch (e) {
        return res.status(400).end();
      }

      await insertImage({ id, filename });
      return res.status(200).end();
    }
    return res.status(400).end();
  });
});

export default router;
