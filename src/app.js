const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const errorHandler = require('./utils/errorHandler');

// Route Imports
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const reportRoutes = require('./routes/reportRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Swagger Config
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Medisetu API',
            version: '1.0.0',
            description: 'Patient & Doctor Portal API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.get('/api-docs.json', (req, res) => res.json(swaggerDocs));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

app.use('/api/patients', patientRoutes);     // Handles login, profile, history
app.use('/api/doctors', doctorRoutes);       // Handles login
app.use('/api/doctor', doctorRoutes);        // Alias for singular support
app.use('/api/reports', reportRoutes);       // Handles global report ops
app.use('/api/appointments', appointmentRoutes); // Handles booking, status, vitalsring

// Error Handling
app.use(errorHandler);

module.exports = app;
