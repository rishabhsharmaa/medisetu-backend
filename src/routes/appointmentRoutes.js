const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, updateStatus, saveVitals } = require('../controllers/appointmentController');

/**
 * @swagger
 * /api/appointments/book:
 *   post:
 *     summary: Book Appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - doctorId
 *               - date
 *               - slot
 *             properties:
 *               patientId: { type: string }
 *               doctorId: { type: string }
 *               date: { type: string }
 *               slot: { type: string }
 *     responses:
 *       201:
 *         description: Booked
 *       409:
 *         description: Conflict
 */
router.post('/book', bookAppointment);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: List Appointments
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *       - in: query
 *         name: date
 *       - in: query
 *         name: status
 *     responses:
 *       200:
 *         description: List
 */
router.get('/', getAppointments);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Update Status
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:id/status', updateStatus);

/**
 * @swagger
 * /api/appointments/{id}/vitals:
 *   post:
 *     summary: Save Vitals (Medical Data)
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bp: { type: string }
 *               pulse: { type: string }
 *               temp: { type: string }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Saved
 */
router.post('/:id/vitals', saveVitals);

module.exports = router;
