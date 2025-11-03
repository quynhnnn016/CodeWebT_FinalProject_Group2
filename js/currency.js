document.addEventListener("DOMContentLoaded", () => {
  const ratesBox = document.getElementById("exchange_rates");

  // 🔑 Fixer API key của bạn
  const FIXER_API_KEY = "53b93cd8ab72105394d0c65ae23b4b29";

  // 🏦 Các mã tiền tệ cần lấy
  const symbols = "USD,EUR,JPY,KRW,SGD";

  // 🌐 Proxy HTTPS để tránh lỗi Mixed Content
  const proxy = "https://api.allorigins.win/raw?url=";

  // 🔁 Hàm tải tỷ giá
  async function loadCurrencyRates() {
    ratesBox.innerHTML = `
      <div class='text-center py-2'>
        <div class='spinner-border text-light spinner-border-sm'></div>
        Updating rates...
      </div>
    `;

    try {
      const fixerURL = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=${symbols}`;
      const res = await fetch(proxy + encodeURIComponent(fixerURL));
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.info || "Invalid API response");
      }

      const rates = data.rates;
      const base = data.base || "EUR";
      const date = data.date;

      ratesBox.innerHTML = `
        <p class="mb-2"><small>Base: ${base} | Updated: ${date}</small></p>
        <table class="table table-sm text-white mb-0">
          <tbody>
            <tr><td>🇺🇸 USD</td><td class="text-end">${rates.USD.toFixed(
              3
            )}</td></tr>
            <tr><td>🇪🇺 EUR</td><td class="text-end">${rates.EUR.toFixed(
              3
            )}</td></tr>
            <tr><td>🇯🇵 JPY</td><td class="text-end">${rates.JPY.toFixed(
              3
            )}</td></tr>
            <tr><td>🇰🇷 KRW</td><td class="text-end">${rates.KRW.toFixed(
              3
            )}</td></tr>
            <tr><td>🇸🇬 SGD</td><td class="text-end">${rates.SGD.toFixed(
              3
            )}</td></tr>
          </tbody>
        </table>
        <p class="mt-2 mb-0"><small>All rates relative to ${base}</small></p>
      `;
    } catch (err) {
      ratesBox.innerHTML = `<p>⚠️ Cannot load currency data.<br><small>${err.message}</small></p>`;
      console.error("Fixer API error:", err);
    }
  }

  // Gọi lần đầu và auto update mỗi 10 phút
  loadCurrencyRates();
  setInterval(loadCurrencyRates, 10 * 60 * 1000);
});
