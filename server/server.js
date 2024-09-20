const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const app = express();
const PORT = 5000;
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// Connect to MongoDB (update the connection string with your MongoDB URI)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Define your appointment schema
const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  message: String
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// API route to handle form submission
app.post('/api/appointment', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isNumeric().isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message can be max 500 characters')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, date, message } = req.body;

  try {
    // Check for email duplication
    const existingAppointment = await Appointment.findOne({ email });
    if (existingAppointment) {
      return res.status(400).json({ message: 'This email has already been used for an appointment.' });
    }

    // Save new appointment
    const newAppointment = new Appointment({ name, email, phone, date, message });
    await newAppointment.save();

    console.log('Saved appointment:', newAppointment);
    res.status(200).json({ message: 'Appointment saved successfully' });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ message: 'An error occurred while saving the appointment.' });
  }
});

// Middleware to serve static files from React app
 app.use(express.static(path.join(__dirname, 'client/build')));

// All other routes will be handled by React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
