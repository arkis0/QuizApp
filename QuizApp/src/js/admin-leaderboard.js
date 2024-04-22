// setInterval(async () => {
//     try {
//         const response = await fetch(`${config.api_url}/api/systemstatus/GetSystemStatus`);
//         const systemStatusData = await response.json();

//         if (systemStatusData === 3) {
//             window.location.href = 'endScreenAdmin.html';
//         } else {
//             console.log('Unknown status');
//         }
//     } catch (error) {
//         clearInterval();
//         console.error(error);
//         window.location.href = 'login.html';
//     }
// }, 5000);

const timeDiv = document.querySelector('#time');
const timeCircle = document.querySelector('#time-circle');

let initTime = config.totalAvailableTime; // Initial time in minutes
let time = initTime; // Current time remaining (in minutes)
const howMuchCountdown = 100; // Number of times to decrement per second (100ms)
timeDiv.innerHTML = time; // Display initial time

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Access-Control-Allow-Origin", "*");
myHeaders.append("Origin", "*");
myHeaders.append("credentials", "include");

const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
};

fetch(`${config.api_url}/api/questions/GetNextQuestion/4848734398e318adb7babb90de5d7828d8fcf897a823d96965935b5e246e41b4b`, requestOptions)
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 403) {
            console.log('System status is not 2');
            return fetch(`${config.api_url}/api/systemstatus/GetSystemStatus`)
                .then(response => response.json())
                .then(systemStatusData => {
                    if (systemStatusData === 0) {
                        // window.location.href = 'login.html';
                    } else if (systemStatusData === 1) {
                        // window.location.href = 'login.html';
                    } else if (systemStatusData === 2) {
                        console.error('System status is 2, but server thinks that it is not!')
                        window.stop();
                    } else if (systemStatusData === 3) {
                        // Alert("Czas na odpowiedź minął! Przekierowywanie na ekran końcowy.", 3, 3000, "endScreen.html")
                    } else {
                        console.log('Unknown status');
                    }
                    throw new Error('Server status 0');
                });
        } else if (response.status === 405) {
            // window.location.href = 'endScreen.html';
        } else if (response.status === 400) {
            //? User with such API key either does not exist or is not logged in
            // window.location.href = 'login.html';
        } else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return response.json();
        }
    })
    .then(data => {
        time = config.totalAvailableTime - (data.time_from_beginning / 60);
    })

const countdownTime = setInterval(() => {
    // Decrement time by 1 minute divided by howMuchCountdown (effectively milliseconds per minute)
    time -= 1 / (howMuchCountdown * 60);

    // Keep time non-negative
    time = Math.max(0, time);

    // Update displayed time (round down to whole minutes if time is more than 1 minute, else show in seconds)
    if (time > 1) {
        timeDiv.innerHTML = Math.floor(time);
    } else {
        timeDiv.innerHTML = Math.floor(time * 60);
    }
    // Check if time has run out (less than 1 minute remaining)
    if (time <= 0) {
        clearInterval(countdownTime);

        const fetchSystemStatus = async () => {
            try {
                const response = await fetch(`${config.api_url}/api/systemstatus/GetSystemStatus`);
                const systemStatusData = await response.json();
                if (systemStatusData === 0) {
                    window.location.href = 'login.html';
                } else if (systemStatusData === 3) {
                    window.location.href = 'endScreenAdmin.html';
                } else {
                    console.log('Unknown status');
                }
            } catch (error) {
                clearInterval();
                console.error(error);
                alert('Server failed to respond. Please try again later.')
                window.location.href = 'login.html';
            }
        };
        fetchSystemStatus();
        setInterval(fetchSystemStatus, 1000);
    }
}, 10);