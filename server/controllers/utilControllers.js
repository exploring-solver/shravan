const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

exports.speechToText = async (req, res) => {
    let outputFilePath; // Declare the outputFilePath at the top of the function

    try {
        console.log('Starting speech to text process');
        console.log('Uploaded file:', req.file);

        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        outputFilePath = `uploads/${Date.now()}.wav`;

        console.log('Input file path:', filePath);
        console.log('Output file path:', outputFilePath);

        // Promisify the FFmpeg conversion
        await new Promise((resolve, reject) => {
            console.log('Starting FFmpeg conversion');
            ffmpeg(filePath)
                .toFormat('wav')
                .on('start', (commandLine) => {
                    console.log('FFmpeg conversion started with command:', commandLine);
                })
                .on('progress', (progress) => {
                    console.log('FFmpeg conversion progress:', progress.percent, '% done');
                })
                .on('end', () => {
                    console.log('FFmpeg conversion completed');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error in FFmpeg conversion:', err);
                    reject(err);
                })
                .save(outputFilePath);
        });

        console.log('Preparing form data for Sarvam.ai API');
        const formData = new FormData();
        formData.append('file', fs.createReadStream(outputFilePath));
        formData.append('prompt', 'Convert this speech to text');
        formData.append('model', 'saaras:v1');

        console.log('Sending request to Sarvam.ai API');
        const response = await axios.post('https://api.sarvam.ai/speech-to-text-translate', formData, {
            headers: {
                ...formData.getHeaders(),
                'api-subscription-key': `${process.env.SARVAM_Ai_KEY}`,
            },
        });

        console.log('Received response from Sarvam.ai API:', response.data);

        // Send the transcribed text back as response
        res.json({ transcribedText: response.data.transcript });

        console.log('Response sent to client');

    } catch (err) {
        console.error('Error in speech to text process:', err);
        res.status(500).json({ error: 'Error processing speech to text', details: err.message });
    } finally {
        // Clean up the uploaded files
        try {
            if (req.file && req.file.path) {
                await unlinkAsync(req.file.path);
                console.log('Deleted input file:', req.file.path);
            }
            if (outputFilePath) {
                await unlinkAsync(outputFilePath); // Use the outputFilePath variable defined at the top
                console.log('Deleted output file:', outputFilePath);
            }
        } catch (unlinkError) {
            console.error('Error deleting files:', unlinkError);
        }
    }
};
