const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;
const wiseOldManBaseUrl = process.env.WISE_OLD_MAN_BASE_URL;

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
  participants: [String]
});

const participantSchema = new mongoose.Schema({
  eventId: String,
  username: String,
  ehb: String,
  playerData: Object,
});

const Event = mongoose.model('Event', eventSchema);
const Participant = mongoose.model('Participant', participantSchema);

app.use(cors());
app.use(express.json());

app.post('/events', async (req, res) => {
  try {
    const { eventName, paths, startDate, endDate } = req.body;

    const eventId = uuidv4();

    const result = await Event.create({
      eventId,
      eventName,
      paths,
      startDate,
      endDate,
    });

    res.status(201).json({
      eventId,
      eventName: result.eventName,
      path: result.path,
      startDate: result.startDate,
      endDate: result.endDate,
    });
  } catch (err) {
    res.status(500).send(`Internal server error: ${err}`);
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.send(events);
  } catch (error) {
    res.sendStatus(500).json(
      { message: `Error fetching events: ${error}` },
    );
  }
});

app.get('/api/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ eventId });

    if (!event) {
      res.status(404).json({ message: `Event not found for id: ${eventId}` });
    } else {
      res.json(event);
    }
  } catch (error) {
    res.status(500).json({
      message:
        `Error fetching event with id: ${req.params.eventId}: ${error}`
    });
  }
});

app.delete('/api/events', async (req, res) => {
  try {
    const result = await Event.deleteMany();
    res.status(200).json({ message: `${result.deletedCount} events deleted` });
  } catch (error) {
    res.sendStatus(500).json(
      { message: `Error deleting events: ${error}` },
    );
  }
});

async function getPlayerDetailsFromWiseOldMan(username) {
  let playerSearchRes;
  if (!username) {
    return { error: `Username is required.` };
  }
  try {
    const url = `${wiseOldManBaseUrl}/players/${username}`;
    playerSearchRes = await axios.get(url);

    if (!playerSearchRes?.data) {
      return { error: `${username} not found on Wise Old Man.` };
    }
    return playerSearchRes.data;
  } catch (error) {
    return { error: `Error searching for player: ${username}: ${error}` };
  }
}

app.get('/event/:eventId/participants', async (req, res) => {
  const { eventId } = req.params;
  try { 
    const event = await Event.findOne({ eventId });
    if (!event) {
      res.status(404).json({ message: `Event not found for id: ${eventId}` });
    } else {
      res.json(event.participants);
    }
  } catch (error) {
    res.status(500).json({ message: 
      `Error fetching participants for event with id: ${eventId}: ${error}` });
  }
});

const checkExistingParticipant = async (eventId, username) => {
  const existingParticipant = await Participant.findOne({ eventId, username });
  return existingParticipant;
};

const createParticipant = async (eventId, username, userData) => {
  const { ehb } = userData;
  const participant = new Participant(
    { eventId, username, ehb, playerData: userData }
  );
  await participant.save();
  return participant;
};

const addParticipantToEvent = async (eventId, username) => {
  const event = await Event.findOne({ eventId });
  if (!event) {
    throw new Error(`Event not found for id: ${eventId}`);
  }
  event.participants.push(username);
  await event.save();
};


app.post('/event/:eventId/participants', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { username } = req.body;

    const existingParticipant = await checkExistingParticipant(
      eventId, username
    );
    if (existingParticipant) {
      return res.status(409).json(
        { message: `Participant: ${username} already exists in the event.` }
      );
    }

    const userData = await getPlayerDetailsFromWiseOldMan(username);
    if (userData.error) {
      return res.status(404).json(
        { message: `${username} not found: ${userData.error}` }
      );
    }

    const participant = await createParticipant(eventId, username, userData);
    await addParticipantToEvent(eventId, username);

    return res.status(201).json(participant);
  } catch (error) {
    return res.status(500).json({
      message: 'Error adding participant to event with id: ' 
        + `${req.params.eventId}: ${error}`,
    });
  }
});

app.get('/participants/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try { 
    const participants = await Participant.find({ eventId });
    if (!participants) {
      res.status(404).json({ message: `Event not found for id: ${eventId}` });
    } else {
      res.json(participants);
    }
  } catch (error) {
    res.status(500).json({ message: 
      `Error fetching participants for event with id: ${eventId}: ${error}` });
  }
});

app.delete('/participants/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try { 
    const participants = await Participant.deleteMany({ eventId });
    if (!participants) {
      res.status(404).json({ message: `Event not found for id: ${eventId}` });
    } else {
      res.json({ message: 
        `Successfully removed all participants for event with id: ${eventId}` }
      );
    }
  } catch (error) {
    res.status(500).json({ message: 
      `Error removing participants for event with id: ${eventId}: ${error}` });
  }
});

app.listen(port);
