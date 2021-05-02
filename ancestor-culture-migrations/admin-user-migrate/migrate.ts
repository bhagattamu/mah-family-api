import * as mongoose from 'mongoose';
import * as migrateMongoose from 'migrate-mongoose';
import 'dotenv/config';
import { join } from 'path';

// Connect Mongo
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const migrationsDir = join(__dirname, 'migrations'),
    dbUrl = process.env.MONGO_URI,
    collectionName = 'migrations',
    autosync = true;

const migrator = new migrateMongoose({
    migrationsPath: migrationsDir, // Path to migrations directory
    dbConnectionUri: dbUrl, // mongo url
    collectionName: collectionName, // collection name to use for migrations (defaults to 'migrations')
    autosync: autosync // if making a CLI app, set this to false to prompt the user, otherwise true
});

migrator
    .run('up', 'admin-user')
    .then(() => {
        console.log('Completed admin migration.');
    })
    .finally(() => {
        console.log('Migration Exited');
        process.exit();
    });
