const express = require('express');
const router = express.Router();
const { login, bookAppointment } = require('../controllers/doctorController');

/**
 * @swagger
 * /api/doctors/login:
 *   post:
 *     summary: Doctor Login
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Login Success
 */
router.post('/login', login);

/**
 * @swagger
 * /api/doctors/{doctorId}/appointments:
 *   post:
 *     summary: Book Appointment (Doctor Side - Plural)
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientName
 *               - phone
 *               - date
 *               - slot
 *             properties:
 *               patientName: { type: string }
 *               phone: { type: string }
 *               date: { type: string }
 *               slot: { type: string }
 *               age: { type: integer }
 *               gender: { type: string }
 *               reason: { type: string }
 *     responses:
 *       201:
 *         description: Booked
 *       409:
 *         description: Conflict
 */
/**
 * @swagger
 * /api/doctor/{doctorId}/appointments:
 *   post:
 *     summary: Book Appointment (Doctor Side - Singular Alias)
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientName
 *               - phone
 *               - date
 *               - slot
 *             properties:
 *               patientName: { type: string }
 *               phone: { type: string }
 *               date: { type: string }
 *               slot: { type: string }
 *               age: { type: integer }
 *               gender: { type: string }
 *               reason: { type: string }
 *     responses:
 *       201:
 *         description: Booked
 *       409:
 *         description: Conflict
 */
router.post('/:doctorId/appointments', bookAppointment);

module.exports = router;
