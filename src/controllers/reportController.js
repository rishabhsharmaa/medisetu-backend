const Joi = require('joi');
const Report = require('../models/Report');

// Validation Schemas
const createReportSchema = Joi.object({
    patientId: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().optional(),
    status: Joi.string().valid('Normal', 'Abnormal', 'Pending').optional(),
    fileUrl: Joi.string().optional(),
});

// @desc    Create Report (Simulation)
// @route   POST /api/reports
exports.createReport = async (req, res, next) => {
    try {
        const { error } = createReportSchema.validate(req.body);
        if (error) {
            res.status(400);
            throw new Error(error.details[0].message);
        }

        const { patientId, title, type, status, fileUrl } = req.body;

        const report = await Report.create({
            patientId,
            title,
            type: type || 'Lab',
            status: status || 'Pending',
            fileUrl,
        });

        res.status(201).json({
            success: true,
            data: report,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get All Reports (Search, Filter, Sort, Pagination)
// @route   GET /api/reports
exports.getReports = async (req, res, next) => {
    try {
        const { q, status, sort, page = 1, limit = 10, patientId } = req.query;

        let query = {};

        // Filter by patientId if provided (common use case)
        if (patientId) {
            query.patientId = patientId;
        }

        // Search by title (Regex)
        if (q) {
            query.title = { $regex: q, $options: 'i' };
        }

        // Filter by Status
        if (status) {
            query.status = status;
        }

        // Sort
        let sortOptions = { date: -1 };
        if (sort === 'date_asc') sortOptions = { date: 1 };
        if (sort === 'date_desc') sortOptions = { date: -1 };

        const skip = (page - 1) * limit;

        const reports = await Report.find(query)
            .populate('patientId', 'name phoneNumber')
            .sort(sortOptions)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const total = await Report.countDocuments(query);

        res.status(200).json({
            success: true,
            count: reports.length,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit)
            },
            data: reports,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Single Report
// @route   GET /api/reports/:id
exports.getReportById = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id).populate('patientId', 'name phoneNumber');
        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }
        res.status(200).json({
            success: true,
            data: report
        });
    } catch (err) {
        next(err);
    }
};
