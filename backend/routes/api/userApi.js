import express from 'express';
import {
  emailSchema, idSchema, shortAlphaNumSchema, shortTextSchema,
} from '../../middlewares/validate.js';
import {
  findAllBookingsWithCentreDetailsByUserEmail,
  updateUserName,
  updateUserRole,
  updateUserStatus,
  findUserByEmail,
  findAllUsers,
  deleteUser,
  findAllRecurrentBookingsWithCentreDetailsByUserEmail,
  findBookingById,
  deleteBooking,
  deleteRecurrentBooking,
  findRecurrentBookingById,
} from '../../db/db.js';
import insertUserIfNotExists from '../../middlewares/user.js';

const router = express.Router();

// Send list of users
router.get('/', async (req, res) => {
  const result = await findAllUsers();
  if (result) res.status(200).json(result);
  else res.status(404).end();
});

// Send user metadata
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    await emailSchema.validateAsync(email);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findUserByEmail(email);
  if (result) {
    return res.status(200).json({
      name: result.name,
      role: result.role,
      status: result.status,
    });
  }
  return res.status(404).end();
});

// Send role of an user
router.post('/role', async (req, res) => {
  const { email } = req.body;

  try {
    await emailSchema.validateAsync(email);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findUserByEmail(email);
  if (result) return res.status(200).json({ role: result.role });
  return res.status(404).end();
});

// Send status of an user
router.post('/status', async (req, res) => {
  const { email } = req.body;

  try {
    await emailSchema.validateAsync(email);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findUserByEmail(email);
  if (result) return res.status(200).json({ status: result.status });
  return res.status(404).end();
});

// Send bookings of an user
router.post('/bookings', async (req, res) => {
  const { email } = req.body;

  try {
    await emailSchema.validateAsync(email);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findAllBookingsWithCentreDetailsByUserEmail(email);
  if (result) return res.status(200).json(result);
  return res.status(404).end();
});

// Send recurrent bookings of an user
router.post('/recurrent', async (req, res) => {
  const { email } = req.body;

  try {
    await emailSchema.validateAsync(email);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findAllRecurrentBookingsWithCentreDetailsByUserEmail(email);
  if (result) return res.status(200).json(result);
  return  res.status(404).end();
});

// Update user's name
router.patch('/name', async (req, res) => {
  const { email, name } = req.body;

  try {
    await emailSchema.validateAsync(email);
    await shortTextSchema.validateAsync(name);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findUserByEmail(email);
  if (result) {
    await updateUserName({ name, email });
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Update user's role
router.patch('/role', async (req, res) => {
  const { email, role } = req.body;

  try {
    await emailSchema.validateAsync(email);
    await shortAlphaNumSchema.validateAsync(role);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findUserByEmail(email);
  if (result) {
    await updateUserRole({ role, email });
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Update user's status
router.patch('/status', async (req, res) => {
  const { email, status } = req.body;

  try {
    await emailSchema.validateAsync(email);
    await shortAlphaNumSchema.validateAsync(status);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findUserByEmail(email);
  if (result) {
    await updateUserStatus({ status, email });
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Delete user
router.delete('/', async (req, res) => {
  const { email } = req.body;

  try {
    await emailSchema.validateAsync(email);
  } catch (e) {
    return res.status(400).end();
  }

  const result = await findUserByEmail(email);
  if (result) {
    await deleteUser(email);
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Delete user's booking (with id)
router.delete('/bookings', async (req, res) => {
  const { id, email } = req.body;

  try {
    await emailSchema.validateAsync(email);
    await idSchema.validateAsync(id);
  } catch (e) {
    return res.status(400).end();
  }

  const userFromDb = await findUserByEmail(email);
  const result = await findBookingById(id);

  if (result) {
    if (email !== result.user_email && userFromDb.role !== 'admin') return res.status(401).end();

    await deleteBooking(id);
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Delete user's recurrent booking (with id)
router.delete('/recurrent', async (req, res) => {
  const { id, email } = req.body;

  try {
    await emailSchema.validateAsync(email);
    await idSchema.validateAsync(id);
  } catch (e) {
    return res.status(400).end();
  }

  const userFromDb = await findUserByEmail(email);
  const result = await findRecurrentBookingById(id);

  if (result) {
    if (email !== result.user_email && userFromDb.role !== 'admin') return res.status(401).end();

    await deleteRecurrentBooking(id);
    return res.status(200).end();
  }
  return res.status(404).end();
});

// Insert new user (this triggers on front-end after login, because login redirects to / )
router.put('/', insertUserIfNotExists);

export default router;
