let timers = {};
let intervals = {};

function startTimer(timerId) {
  if (!timers[timerId]) timers[timerId] = 0;
  if (intervals[timerId]) return;

  intervals[timerId] = setInterval(() => {
    timers[timerId]++;
    document.getElementById(`display-${timerId}`).innerText = formatTime(
      timers[timerId]
    );
  }, 1000);
}

function stopTimer(timerId) {
  clearInterval(intervals[timerId]);
    intervals[timerId] = null;

    // Update the price display
    const elapsedTime = timers[timerId];
    const price = calculatePrice(timerId, elapsedTime);
    document.getElementById(`price-${timerId}`).innerText = `Harga: Rp. ${price.toLocaleString()}`;

    // Save data when the timer is stopped
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
}

function resetTimer(timerId) {
  timers[timerId] = 0;
    document.getElementById(`display-${timerId}`).innerText = formatTime(timers[timerId]);
    document.getElementById(`price-${timerId}`).innerText = 'Harga: Rp. 0';
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}



function calculatePrice(timerId, elapsedTime) {
  const pricePerHour = timerId <= 4 ? 20000 : 25000;
  const pricePerMinute = pricePerHour / 60;
  const totalMinutes = Math.ceil(elapsedTime / 60);
  let price = totalMinutes * pricePerMinute;

  // Pembulatan ke kelipatan Rp. 2000
  price = Math.ceil(price / 2000) * 2000;
  return price;
}



function printReceipt(timerId) {
  const elapsedTime = document.getElementById(`display-${timerId}`).textContent;
  const mejaId = `Meja ${timerId}`;
  const harga = calculatePrice(timerId, timers[timerId]);
  const currentDate = new Date().toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
  
  const receiptHtml = `
        <html>
        <head>
            <title>Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; }
                .receipt div { margin-bottom: 10px; display: flex; justify-content: space-between; }
                .label { font-weight: bold; }
                .currentDate{
                  text-align: right;
                  margin-bottom: 18px;
                }
                hr { border: 1px solid #000; margin: 20px 0; }
            </style>
        </head>
        <body>
        
        <center><img src="https://lh3.googleusercontent.com/fife/ALs6j_F0tCDxUt5s7088jfehbtphJk9tHwqtpN84k1Y80KF2wa68EVYPuuRYA7VFRZHavwxNVvqNs3DX_3FWtFku9uNdWyDqCZBwigJVyGrwqHuYFFRf3Tkb-sVHL73By7ueOBPbKMpDY6d0FfmveUDiPx9yGIsQBhVkXAtWthQff6Efw_sYrkZAF_tlguFCkQ4AZ_ZnSUS1sCvOmbfRcEbyPEbw2Tl1gLav65P8qBGz5jDLS7m7PVYDVs5V3xBa944pJ4bJ0iPJRAU2i7rXXBPoibhCwZRQmwg1vCVacNwYkpargBjmJm-gS1D8XjafceIV7F-FOBtGHjBTsB2eZl-TAP8RKIMZ23L-Eud_75Mm-JasigjlLW593620YwUUwUcuhKtaKhXJO_bVKKU7zcnbtRlaXXBb5lb9eGvxbWo5ux_QqsQDIZJrLlGGwJaP9zhiDwEEhOm99M_m1-XZH_j3w8qvsqToDyosLMvHFnShOGgHf8CjbUQVL2Mwr7yaVPxb4AEAQg2HrFWZE2Yiq8kdoa_S6zQaGpwtohivsdpBBWjVZqNvYMuNIy57svzGL-MDKk6uJXzuGNfqDOyon1KkDnS1H6JMfvG3stMzy4zjOGFo9-UGMa8TSa9Hw38Nn5OWv1ptmPYbUpcn9cftpPtCQY4fVzwvp6kSoMZudGYigYqVEil8lt4QwdFWPB2U7AXLAZvSNWzJsMVhQyft6_GLRnL3OzMbRvp1eassckypA8ztojjXKchRgrPLsz4FfEwau8l85OYuCLJJpgHS8CaoIM4nLMnhNz_qclvmBnhiiXM_8bJSHqLPlxlyX7r81G2eEXZYPAkT2AYNRrFL0_DC-55lJS00FRbSJkn1d0qUxkTdP9dbM0vIOWwsY1HFoGkOlarZ-DZteMaRfIiVLbrw7QihQEwUxtFUGWN2sDirXuvENuVpPiGdkRwUzznhLbznSJOrRhwXTR1iV5AEc3nI4G9yndChg-HQUuugC-ESYLaCt5PHEo9kEePOHZzajZ4SuULr6tB8CobwCixqqXZz6CFeQDi3Xi-Kw_QE8aEbpHjVWxXMsEIZiM02QhuWYsZDI9qvlGGeMyuLdc-0skramGoR7udOw6CBzficffEuMUSTdVlSwzQXYVuafDhrW1aAHXMBTdEko4EAKOQ2sfI43oDVjrUd73oTLZdko5T5bt8NheJJtFbQ0znEXK5LeL2nASfUrKIjKmLzs3fRskqfQoN_t2FUYsWq_Zy5fIcwE9PuGATP3WcUmNBOFiuUFIzDN2UE7S3EcNxZOMa1WftaMVal82-taYVe_jGPD6iDY7RAwc-LziyRhbup6VReypWwLGClczQNI3rdbaMg6ptjJjVT3gV53qv6IfVBb22hpJay_8xZMXBsIUH1rhwyvNfDkZGFJO4H8PhBTvAxFxgjUPb6nBskW3HsWTUKRHIy4_7GugEPg4W_FzpavsAb7l2eK1vtmjDnV_17YQCwpGI7vmFnAXJqasud6fD5nxeoI7q7JC9Ka9rts1vvxaHn7EMhDiHpiO3HKbkkMIStpPGR8ZoiOubBQz-F_PxGJCMXXheEcCcosuw3prHIC81KeuOKUsvt7Se9aN9e1Wg138F4HPfIzcDvQC7-ZNttqnpPcgSndB2vaSsI=w1920-h912" alt="" width="96" height="96"><center>
        <div class="currentDate">${currentDate}</div>
        <hr>
        <div class="receipt">
                <div><span class="label">Nomor Meja:</span> <span>${mejaId}</span></div>
                <div><span class="label">Waktu:</span> <span>${elapsedTime}</span></div>
                <div><span class="label">Harga:</span> <span>Rp. ${harga.toLocaleString()}</span></div>
            </div>
            <hr>
            <center>
            <h3>Terimakasihh!!!</h3>
            <h3>Silahkan Datang Kembali</h3>
            </center>
        </body>
        <script>
            window.print()
        </script>
        </html>
    `;

  const receiptBlob = new Blob([receiptHtml], { type: "text/html" });
  const receiptUrl = URL.createObjectURL(receiptBlob);
  const receiptWindow = window.open(receiptUrl, "_blank");

  // Clean up the URL object after the new tab has been loaded
  receiptWindow.onload = function () {
    URL.revokeObjectURL(receiptUrl);
  };
}
