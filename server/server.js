const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;

console.log(uri);
let db;
// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

const eventSchema = new mongoose.Schema({
  eventId: String,
  path: [String],
  startDate: Date,
  endDate: Date,
  teamOne: [String],
  teamTwo: [String],
});

// Create a model for events using the schema
const Event = mongoose.model('Event', eventSchema);

app.use(cors());
app.use(express.json());

// Get all events
app.post('/events', async (req, res) => {
  try {
    console.log(req.body);
    // Extract the event data from the request body
    const { eventName, paths, startDate, endDate } = req.body;

    // Generate a new UUID for the event
    const eventId = uuidv4();
    console.log(`eventId: ${eventId}`);

    // Save the event data to the database
    const result = await Event.create({
      eventId,
      eventName,
      paths,
      startDate,
      endDate,
    });

    // Send the new event data back to the client, including the generated UUID
    res.status(201).json({
      eventId,
      eventName: result.eventName,
      path: result.path,
      startDate: result.startDate,
      endDate: result.endDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Internal server error: ${err}`);
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.send(events);
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json(
      { message: `Error fetching events: ${error}` },
    );
  }
});

// Get a single event by ID
// Get a single event by ID
app.get('/api/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ eventId });
    console.log(`event found: ${event}`);

    if (!event) {
      res.status(404).json({ message: `Event not found for id: ${eventId}` });
    } else {
      res.json(event);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error fetching event with id: ${req.params.eventId}: ${error}` });
  }
});

app.delete('/api/events', async (req, res) => {
  try {
    const result = await Event.deleteMany();
    res.status(200).json({ message: `${result.deletedCount} events deleted` });
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json(
      { message: `Error deleting events: ${error}` },
    );
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
