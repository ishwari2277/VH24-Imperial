const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true, // Ensure one detail record per user
        required: true,
    },
    name: { type: String, required: true },
    education: { type: String, required: true },
    salary: { type: Number, required: true },
    age: { type: Number, required: true },
    medicalEmergencies: { type: String, required: true },
    medicalAllotments: { type: String, required: true },
    workSector: { type: String, required: true },
    jobSecurity: { type: String, required: true },
    familyMembers: { type: Number, required: true },
    otherExpenses: { type: String, required: true },
    riskTolerance: { type: String, required: true },
    goal: { type: String, required: true }
});

const UserDetails = mongoose.model('UserDetails', UserDetailsSchema);
module.exports = UserDetails;
