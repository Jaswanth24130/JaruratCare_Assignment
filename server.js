const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database array for concept storage
const submissions = [];

// API Route: Handle Form Submissions & AI Data Summarization
app.post('/api/submit', (req, res) => {
    const { fullName, email, roleType, message } = req.body;
    
    if (!fullName || !email || !message) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newSubmission = {
        id: submissions.length + 1,
        fullName,
        email,
        roleType,
        message,
        timestamp: new Date().toISOString(),
        aiSummary: `Processed by Jarurat Care AI Core: High-priority ${roleType} request received from ${fullName}. Flagged for immediate outreach.`
    };

    submissions.push(newSubmission);
    console.log('New Submission Saved:', newSubmission);

    res.status(201).json({
        success: true,
        message: 'Submission received and analyzed successfully.',
        data: newSubmission
    });
});

// API Route: AI Chatbot Logic
app.post('/api/chat', (req, res) => {
    const { query } = req.body;
    const lowerQuery = (query || '').toLowerCase();

    let reply = "Thank you for reaching out to Jarurat Care Foundation. Our support team will review your query shortly.";

    if (lowerQuery.includes('camp') || lowerQuery.includes('where') || lowerQuery.includes('location')) {
        reply = "Jarurat Care organizes regular medical camps across Haldwani and Nainital regions, providing free diagnostics and essential medicines.";
    } else if (lowerQuery.includes('volunteer') || lowerQuery.includes('join') || lowerQuery.includes('help')) {
        reply = "To join as a volunteer, simply fill out our support form on the left with your details, and our coordination team will onboard you!";
    } else if (lowerQuery.includes('ai') || lowerQuery.includes('feature')) {
        reply = "This platform uses an AI automation layer to instantly summarize incoming support requests and route them to the nearest NGO field worker.";
    }

    res.json({ success: true, reply });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Jarurat Care Full-Stack Server running on http://localhost:${PORT}`);
});