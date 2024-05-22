let timers = {};
let intervals = {};

function startTimer(timerId) {
    if (!timers[timerId]) timers[timerId] = 0;
    if (intervals[timerId]) return;

    intervals[timerId] = setInterval(() => {
        timers[timerId]++;
        document.getElementById(`display-${timerId}`).innerText = formatTime(timers[timerId]);
    }, 1000);
}

function stopTimer(timerId) {
    clearInterval(intervals[timerId]);
    intervals[timerId] = null;

    // Update the price display
    const elapsedTime = timers[timerId];
    const price = calculatePrice(timerId, elapsedTime);
    document.getElementById(`price-${timerId}`).innerText = `Harga: Rp. ${price.toLocaleString()}`;
}

function resetTimer(timerId) {
    stopTimer(timerId);
    const elapsedTime = timers[timerId];
    const price = calculatePrice(timerId, elapsedTime);
    const timestamp = new Date().toISOString();

    fetch('/save-timer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: timerId, time: elapsedTime, timestamp, price })
    }).then(response => {
        if (response.ok) {
            console.log(`Timer ${timerId} data saved successfully.`);
        } else {
            console.error('Failed to save timer data.');
        }
    });

    timers[timerId] = 0;
    document.getElementById(`display-${timerId}`).innerText = formatTime(timers[timerId]);
    document.getElementById(`price-${timerId}`).innerText = 'Harga: Rp. 0';
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function calculatePrice(timerId, elapsedTime) {
    const pricePerHour = (timerId <= 4) ? 20000 : 25000;
    const pricePerMinute = pricePerHour / 60;
    const totalMinutes = Math.ceil(elapsedTime / 60);
    let price = totalMinutes * pricePerMinute;

    // Pembulatan ke kelipatan Rp. 2000
    price = Math.ceil(price / 2000) * 2000;
    return price;
}

function printReceipt(timerId) {
    const elapsedTime = timers[timerId];
    const price = calculatePrice(timerId, elapsedTime);
    const minutes = Math.ceil(elapsedTime / 60);
    const receiptDetails = `
        <p>ID Meja: ${timerId}</p>
        <p>Waktu Bermain: ${minutes} menit</p>
        <p>Harga: Rp. ${price.toLocaleString()}</p>
    `;
    document.getElementById('receipt-details').innerHTML = receiptDetails;
    document.getElementById('receipt-container').style.display = 'block';
}

function closeReceipt() {
    document.getElementById('receipt-container').style.display = 'none';
}

function printReceipt() {
    window.print();
}
