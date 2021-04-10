import { Schema } from 'mongoose';

export const LanguageSchema = new Schema({
    languageName: {
        type: String,
        unique: true
    },
    languageDescription: {
        type: String
    },
    origin: {
        type: String
    }
});
