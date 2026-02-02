const express = require('express');
const router = express.Router();
const { createReport, getReports, getReportById } = require('../controllers/reportController');

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: List Reports (Search, Filter)
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Search title
 *       - in: query
 *         name: status
 *       - in: query
 *         name: sort
 *     responses:
 *       200:
 *         description: List of reports
 *   post:
 *     summary: Create Report
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - title
 *             properties:
 *               patientId:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', getReports);
router.post('/', createReport);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get Single Report
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details
 */
router.get('/:id', getReportById);

module.exports = router;
