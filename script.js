let matches;
let dayCounter = 0;
const matchesByDate = {};

// Load the JSON file and populate the table for the first day
fetchJSONFile('matchdata.json')
    .then(data => {
        matches = data; // Assign the data to the matches variable
        matches.forEach(match => {
            const date = match[2];
            if (!matchesByDate[date]) {
                matchesByDate[date] = [];
            }
            matchesByDate[date].push([match[0], match[1]]);
        });

        // Sort the dates
        const sortedDates = Object.keys(matchesByDate).sort((a, b) => new Date(a) - new Date(b));

        // Display the first day
        const firstDayDate = new Date(sortedDates[dayCounter]);
        document.getElementById("day").textContent = "Day 1 - " + formatDate(firstDayDate);
        displayMatchesForDate(matchesByDate[firstDayDate], firstDayDate);
    })
    .catch(error => {
        console.error('Error loading match data:', error);
    });

// Event listener for next day button
document.getElementById("nextDayBtn").addEventListener("click", function() {
    // Ensure dayCounter doesn't exceed the maximum index
    if (dayCounter < Object.keys(matchesByDate).length - 1) {
        // Increment the day counter
        dayCounter++;

        // Get the date for the next day
        const nextDayDate = new Date(Object.keys(matchesByDate)[dayCounter]);

        // Update the day heading
        document.getElementById("day").textContent = "Day " + (dayCounter + 1) + " - " + formatDate(nextDayDate);

        // Clear previous matches
        document.getElementById("matchesTable").innerHTML = "";

        // Call the function to display matches for the next day
        displayMatchesForDate(matchesByDate[nextDayDate], nextDayDate);
    }
});

// Event listener for previous day button
document.getElementById("previousDayBtn").addEventListener("click", function() {
    // Ensure dayCounter doesn't go below 0
    if (dayCounter > 0) {
        // Decrement the day counter
        dayCounter--;

        // Get the date for the previous day
        const previousDayDate = new Date(Object.keys(matchesByDate)[dayCounter]);

        // Update the day heading
        document.getElementById("day").textContent = "Day " + (dayCounter + 1) + " - " + formatDate(previousDayDate);

        // Clear previous matches
        document.getElementById("matchesTable").innerHTML = "";

        // Call the function to display matches for the previous day
        displayMatchesForDate(matchesByDate[previousDayDate], previousDayDate);
    }
});

// Function to format date
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Function to fetch JSON data from a file
async function fetchJSONFile(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error('Failed to fetch JSON file');
    }
    return response.json();
}

// Function to populate the matches table for a specific date
function displayMatchesForDate(matchesByDate, date) {
    // Filter matches for the specified date
    const matchesForDate = matches.filter(match => {
        const matchDate = new Date(match[2]);
        return matchDate.toDateString() === date.toDateString();
    });

    // Populate the table with matches for the date
    populateMatchesTable(matchesForDate);
}

// Function to populate the matches table
function populateMatchesTable(matches) {
    const table = document.getElementById("matchesTable");

    matches.forEach(match => {
        const row = document.createElement("tr");

        // Team 1 cell
        const team1Cell = document.createElement("td");
        const team1Label = document.createElement("label");
        team1Label.textContent = match[0]; // First team
        const team1Input = document.createElement("input");
        team1Input.type = "int";
        team1Input.name = match[0] + "Score"; // First team's score input name
        team1Cell.appendChild(team1Label);
        team1Cell.appendChild(team1Input);
        row.appendChild(team1Cell);

        // Score separator cell
        const scoreSeparatorCell = document.createElement("td");
        scoreSeparatorCell.textContent = ":";
        row.appendChild(scoreSeparatorCell);

        // Team 2 cell
        const team2Cell = document.createElement("td");
        const team2Input = document.createElement("input");
        team2Input.type = "int";
        team2Input.name = match[1] + "Score"; // Second team's score input name
        const team2Label = document.createElement("label");
        team2Label.textContent = match[1]; // Second team
        team2Cell.appendChild(team2Input);
        team2Cell.appendChild(team2Label);
        row.appendChild(team2Cell);

        table.appendChild(row);
    });
}
