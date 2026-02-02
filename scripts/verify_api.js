const axios = require('axios');
const API_URL = 'http://localhost:3000/api';

const runTests = async () => {
    try {
        console.log('--- Final Strict Verification ---');

        // 1. Patient Login
        console.log('[1] Patient Login...');
        const pRes = await axios.post(`${API_URL}/patients/login`, {
            phoneNumber: '1111122222',
            name: 'Final Patient'
        });
        const patientId = pRes.data.data._id;
        console.log('✅ Patient ID:', patientId);

        // 2. Doctor Login
        console.log('[2] Doctor Login...');
        const dRes = await axios.post(`${API_URL}/doctors/login`, {
            email: 'doc.final@example.com'
        });
        const doctorId = dRes.data.data._id;
        console.log('✅ Doctor ID:', doctorId);

        // 3. Book Appointment
        console.log('[3] Book Appointment...');
        const date = new Date().toISOString().split('T')[0];
        const slot = `10:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`; // Random slot
        try {
            // Using Doctor-side booking (Auto-creates patient)
            const aRes = await axios.post(`${API_URL}/doctors/${doctorId}/appointments`, {
                patientName: 'Test Patient Auto',
                phone: '9998887777',
                age: 30,
                gender: 'Female',
                date,
                slot,
                reason: 'Headache'
            });
            const appointmentId = aRes.data.data._id;
            console.log('✅ Appointment Booked:', appointmentId);

            // 3.1 Conflict Check
            console.log('[3.1] Conflict Check...');
            try {
                await axios.post(`${API_URL}/doctors/${doctorId}/appointments`, {
                    patientName: 'Test Patient Auto',
                    phone: '9998887777',
                    date,
                    slot,
                    reason: 'Retry'
                });
            } catch (e) {
                if (e.response.status === 409) console.log('✅ Conflict Detected (409)');
            }

            // 4. Save Vitals
            console.log('[4] Save Vitals...');
            await axios.post(`${API_URL}/appointments/${appointmentId}/vitals`, {
                bp: '120/80',
                notes: 'Patient is healthy but tired.'
            });
            console.log('✅ Vitals Saved');

        } catch (e) {
            console.error('❌ Booking failed:', e.message);
        }

        // 5. Create Report
        console.log('[5] Create Report...');
        await axios.post(`${API_URL}/reports`, {
            patientId,
            title: 'Blood Test Final',
            status: 'Normal'
        });
        console.log('✅ Report Created');

        // 6. List Reports
        console.log('[6] List Reports (?q=Blood)...');
        const rRes = await axios.get(`${API_URL}/reports?q=Blood`);
        console.log(`✅ Reports Found: ${rRes.data.count}`);

        // 7. Patient History
        console.log('[7] Patient History...');
        const hRes = await axios.get(`${API_URL}/patients/${patientId}/history`);
        console.log(`✅ History Items: ${hRes.data.data.length}`);

        // 8. Create Note (New Requirement)
        console.log('[8] Create Patient Note...');
        await axios.post(`${API_URL}/patients/${patientId}/notes`, {
            complaint: 'High Fever',
            noteText: 'Patient advised rest.',
            vitals: {
                bp: '130/85',
                pulse: '98',
                temperature: '101'
            }
        });
        console.log('✅ Note Created');

        // 9. Get Notes History
        console.log('[9] Get Notes History...');
        const nRes = await axios.get(`${API_URL}/patients/${patientId}/notes?page=1&limit=5`);
        console.log(`✅ Notes Found: ${nRes.data.count}`);

        console.log('--- ✅ Verification Complete ---');
    } catch (e) {
        console.error('❌ Failed:', e.response ? e.response.data : e.message);
    }
};

runTests();
