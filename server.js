const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/server.log' })
    ]
});

const uri = process.env.MONGODB_URI;  

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        logger.info("Pinged your deployment. You successfully connected to MongoDB!");

        const collection = client.db("test").collection("demo");

        app.post('/demo', async (req, res) => {
            try {
                const result = await collection.insertOne(req.body);
                res.status(201).json(result);
            } catch (err) {
                logger.error('POST /demo - Error inserting document', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.get('/demo', async (req, res) => {
            try {
                const documents = await collection.find({}).toArray();
                res.json(documents);
            } catch (err) {
                logger.error('GET /demo - Error fetching documents', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.put('/demo/:id', async (req, res) => {
            try {
                const result = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
                if (result.matchedCount > 0) {
                    res.json({ message: 'Document updated' });
                } else {
                    res.status(404).json({ message: 'Document not found' });
                }
            } catch (err) {
                logger.error('PUT /demo/:id - Error updating document', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.delete('/demo/:id', async (req, res) => {
            try {
                const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
                if (result.deletedCount > 0) {
                    res.json({ message: 'Document deleted' });
                } else {
                    res.status(404).json({ message: 'Document not found' });
                }
            } catch (err) {
                logger.error('DELETE /demo/:id - Error deleting document', err);
                res.status(500).json({ message: 'Server error' });
            }
        });

    } catch (err) {
        logger.error('MongoDB connection error', err.message);
        process.exit(1);
    }
}

run().catch(console.dir);

app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
    logger.info('GET /api/hello - Sending hello message');
    res.send('Hello KAZEM team!!');
});

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});

