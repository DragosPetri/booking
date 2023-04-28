import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import schedule from 'node-schedule';
import bodyParser from 'body-parser';

import path from 'path';
import allRoutes from './routes/allRoutes.js';
import {
  updateRecurrentBookings,
  findAllRecurrentBookingsWithCentreDetails,
  checkBookingDateExist,
  insertBooking,
} from './db/db.js';

const app = express();
// parse application/x-www-form-urlencoded

const staticDir = path.join(process.cwd(), 'uploads');
app.use(express.static(staticDir));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Allow from react
app.use(cors({ origin: 'http://localhost:3000' }));

// Schedule
schedule.scheduleJob('20 * * * * *', async () => {
  await updateRecurrentBookings();
  const result = await findAllRecurrentBookingsWithCentreDetails();
  result.forEach(async (item) => {
    const bookingResult = await checkBookingDateExist({
      centreId: item.centre_id,
      date: item.next_date,
    });
    if (!bookingResult.length) {
      await insertBooking({
        email: item.user_email, centreId: item.centre_id, date: item.next_date, recurrent: 'True',
      });
    }
  });

  console.log('Checked reccurent bookings, and added new bookings if needed!');
});

// Logging requests
app.use(morgan('tiny'));

// Routes
app.use(allRoutes);

app.listen(8080, () => {
  console.log('Server listening on http://localhost:9090/');
});
