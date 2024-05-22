document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-timers')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#rekap-table tbody');
            tableBody.innerHTML = '';

            data.forEach(timer => {
                const row = document.createElement('tr');
                const date = new Date(timer.timestamp);
                const formattedDate = date.toLocaleString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                const elapsedMinutes = Math.ceil(timer.time / 60);

                row.innerHTML = `
                    <td>${timer.id}</td>
                    <td>${elapsedMinutes} menit</td>
                    <td>${formattedDate}</td>
                    <td>Rp. ${timer.price.toLocaleString()}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching timer data:', error));

    fetch('/get-daily-summary')
        .then(response => response.json())
        .then(data => {
            const dailySummaryDiv = document.getElementById('daily-summary');
            dailySummaryDiv.innerHTML = '';

            // Sort the daily summaries by date in descending order
            const sortedEntries = Object.entries(data).sort((a, b) => new Date(b[0]) - new Date(a[0]));

            sortedEntries.forEach(([date, summary]) => {
                const summaryDiv = document.createElement('div');
                summaryDiv.className = 'summary';
                const formattedDate = new Date(date).toLocaleString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                summaryDiv.innerHTML = `
                    <h3>${formattedDate}</h3>
                    <p>Total Pendapatan: Rp. ${summary.totalIncome.toLocaleString()}</p>
                `;
                dailySummaryDiv.appendChild(summaryDiv);
            });
        })
        .catch(error => console.error('Error fetching daily summary:', error));
});
