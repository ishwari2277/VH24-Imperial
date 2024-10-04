const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
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
    goal: { type: String, required: true },
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);
