const express = require('express');
const router = express.Router();
const { login, getProfile, getHistory, createNote, getNotes } = require('../controllers/patientController');

/**
 * @swagger
 * /api/patients/login:
 *   post:
 *     summary: Patient Login / Auto-Register
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber: { type: string }
 *               name: { type: string }
 *               age: { type: integer }
 *               gender: { type: string }
 *     responses:
 *       200:
 *         description: Login Successful
 */
router.post('/login', login);

/**
 * @swagger
 * /api/patients/{id}/profile:
 *   get:
 *     summary: Get Profile
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: Profile
 */
router.get('/:id/profile', getProfile);

/**
 * @swagger
 * /api/patients/{id}/history:
 *   get:
 *     summary: Get History (Appointments & Notes)
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: History
 */
router.get('/:id/history', getHistory);

/**
 * @swagger
 * /api/patients/{patientId}/notes:
 *   post:
 *     summary: Create Note (Vitals + Text)
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaint: { type: string }
 *               noteText: { type: string }
 *               vitals:
 *                 type: object
 *                 properties:
 *                   bp: { type: string }
 *                   pulse: { type: string }
 *                   temperature: { type: string }
 *     responses:
 *       201:
 *         description: Note Created
 *   get:
 *     summary: Get Note History
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of Notes
 */
router.post('/:patientId/notes', createNote);
router.get('/:patientId/notes', getNotes);

module.exports = router;
