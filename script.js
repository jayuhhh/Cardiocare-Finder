// Emergency Database with Hospital, Main Doctors, and Contact Numbers
const mockHospitalAPI = [
    {
        id: 1,
        name: "Zydus Hospital",
        mainDoctor: "Dr. Anish Chandarana (Interventional Cardiologist)",
        phone: "+91 79 6619 0000",
        distance: "1.2 km",
        conditionsTreated: ["heart attack", "cardiac arrest", "stroke"],
        availableBeds: 5,
        estDriveTime: "4 mins"
    },
    {
        id: 2,
        name: "KD Hospital",
        mainDoctor: "Dr. Chirag Doshi (Cardiothoracic Surgeon)",
        phone: "+91 79 6677 0000",
        distance: "2.8 km",
        conditionsTreated: ["heart attack", "chest pain", "cardiac arrest"],
        availableBeds: 12,
        estDriveTime: "8 mins"
    },
    {
        id: 3,
        name: "SGVP Hospital",
        mainDoctor: "Dr. Hardik Patel (Chief Medical Officer)",
        phone: "+91 79 2717 2400",
        distance: "4.5 km",
        conditionsTreated: ["stroke", "trauma", "heart attack"],
        availableBeds: 2,
        estDriveTime: "12 mins"
    },
    {
        id: 4,
        name: "Apollo Hospital",
        mainDoctor: "Dr. Sameer Dani (Director of Cardiology)",
        phone: "+91 76000 60108",
        distance: "6.1 km",
        conditionsTreated: ["burns", "fractures", "stroke"],
        availableBeds: 18,
        estDriveTime: "15 mins"
    },
    {
        id: 5,
        name: "KIMS Hospital",
        mainDoctor: "Dr. B. Bhaskar Rao (Cardiovascular Surgeon)",
        phone: "+91 40 4488 5000",
        distance: "7.5 km",
        conditionsTreated: ["heart attack", "cardiac arrest", "chest pain"],
        availableBeds: 7,
        estDriveTime: "18 mins"
    }
];

// DOM Elements
const diseaseInput = document.getElementById('diseaseInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');
const resultsTitle = document.getElementById('resultsTitle');
const hospitalGrid = document.getElementById('hospitalGrid');

const notificationModal = document.getElementById('notificationModal');
const modalMessage = document.getElementById('modalMessage');
const closeModalBtn = document.getElementById('closeModalBtn');

// Initial Load: Show all hospitals by default
window.addEventListener('DOMContentLoaded', () => {
    renderCards(mockHospitalAPI);
});

// Search Execution
function searchHospitals() {
    const query = diseaseInput.value.trim().toLowerCase();
    errorMessage.textContent = "";
    hospitalGrid.innerHTML = "";
    
    if (!query) {
        errorMessage.textContent = "Please enter a disease or medical emergency condition.";
        renderCards(mockHospitalAPI);
        resultsTitle.textContent = "All Available Emergency Hospitals";
        return;
    }

    const matchedHospitals = mockHospitalAPI.filter(hospital => 
        hospital.conditionsTreated.some(condition => query.includes(condition) || condition.includes(query))
    );

    if (matchedHospitals.length === 0) {
        errorMessage.textContent = "No specific match found. Displaying all nearby emergency facilities.";
        renderCards(mockHospitalAPI);
        resultsTitle.textContent = "Closest Emergency Rooms (Fallback)";
    } else {
        renderCards(matchedHospitals);
        resultsTitle.textContent = `Hospitals Specializing in "${diseaseInput.value}"`;
    }

    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Render Hospital Cards with Doctor Info and Clickable Numbers
function renderCards(hospitals) {
    hospitalGrid.innerHTML = ""; // Clear existing grid contents
    hospitals.forEach(hospital => {
        const card = document.createElement('div');
        card.className = 'hospital-card';
        card.id = `hospital-${hospital.name.replace(/\s+/g, '-')}`; // Create unique ID for navigation links
        card.innerHTML = `
            <div>
                <h3 class="hospital-name">${hospital.name}</h3>
                <p class="hospital-meta">📍 ${hospital.distance} away • Est. Drive: ${hospital.estDriveTime}</p>
                
                <div class="hospital-contact">
                    <div class="doctor-name">👨‍⚕️ ${hospital.mainDoctor}</div>
                    <div>📞 Emergency: <a href="tel:${hospital.phone.replace(/\s+/g, '')}" class="phone-link">${hospital.phone}</a></div>
                </div>

                <div class="metrics">
                    <div class="metric-item">
                        <div class="label">Live Available Beds</div>
                        <div class="val green">${hospital.availableBeds} Remaining</div>
                    </div>
                    <div class="metric-item">
                        <div class="label">Emergency Status</div>
                        <div class="val blue">Ready</div>
                    </div>
                </div>
            </div>
            <button class="book-btn" onclick="triggerAppointmentNotification('${hospital.name}')">Book Appointment & Notify</button>
        `;
        hospitalGrid.appendChild(card);
    });
}

// Location Navigation Feature
function navigateToHospital(hospitalName) {
    // If we've currently filtered things out, reset cards first so the target hospital is definitely visible
    renderCards(mockHospitalAPI);
    resultsTitle.textContent = "All Available Emergency Hospitals";
    diseaseInput.value = "";

    const targetId = `hospital-${hospitalName.replace(/\s+/g, '-')}`;
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
        // Smooth scroll to card
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add flashing border highlight effect
        targetElement.classList.add('highlight');
        setTimeout(() => {
            targetElement.classList.remove('highlight');
        }, 3000);
    }
}

// Simulated Live Notification Alert Hook
function triggerAppointmentNotification(hospitalName) {
    modalMessage.textContent = `Your emergency path routing to ${hospitalName} is confirmed. The triage desk has received your emergency alert profile and is monitoring your arrival details.`;
    notificationModal.classList.remove('hidden');
    console.log(`[API Webhook Outbound Link]: Broadcast alert pushed to ${hospitalName}. Channel listening open.`);
}

// Close Window Modal
closeModalBtn.addEventListener('click', () => {
    notificationModal.classList.add('hidden');
});

// Event Triggers
searchBtn.addEventListener('click', searchHospitals);
diseaseInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchHospitals();
});