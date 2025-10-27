document.addEventListener("DOMContentLoaded", () => {
    const ratesBox = document.getElementById("exchange_rates");
  
    // 🔑 Access key của bạn (bảo mật - không chia sẻ công khai)
    const FIXER_API_KEY = "53b93cd8ab72105394d0c65ae23b4b29";
  
    // 🏦 Các mã tiền tệ cần lấy
    const symbols = "USD,EUR,JPY,KRW,SGD";
  
    // 🔁 Hàm tải tỷ giá
    async function loadCurrencyRates() {
      ratesBox.innerHTML = `
        <div class='text-center py-2'>
          <div class='spinner-border text-light spinner-border-sm'></div>
          Updating rates...
        </div>
      `;
  
      try {
        const res = await fetch(
          `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=${symbols}`
        );
        const data = await res.json();
  
        if (!data.success) {
          throw new Error(data.error?.info || "Invalid API response");
        }
  
        const rates = data.rates;
        const base = data.base || "EUR";
        const date = data.date;
  
        // Vì Fixer API dùng base = EUR (miễn phí không đổi base được),
        // ta quy đổi ra VND bằng cách nhân thêm tỷ giá bạn muốn (nếu có)
        // hoặc chỉ hiển thị so với EUR nếu chưa có tỷ giá EUR/VND.
        // Để đơn giản, ta hiển thị trực tiếp EUR-based rates.
  
        ratesBox.innerHTML = `
          <p class="mb-2"><small>Base: ${base} | Updated: ${date}</small></p>
          <table class="table table-sm text-white mb-0">
            <tbody>
              <tr><td>🇺🇸 USD</td><td class="text-end">${rates.USD.toFixed(3)}</td></tr>
              <tr><td>🇪🇺 EUR</td><td class="text-end">${rates.EUR.toFixed(3)}</td></tr>
              <tr><td>🇯🇵 JPY</td><td class="text-end">${rates.JPY.toFixed(3)}</td></tr>
              <tr><td>🇰🇷 KRW</td><td class="text-end">${rates.KRW.toFixed(3)}</td></tr>
              <tr><td>🇸🇬 SGD</td><td class="text-end">${rates.SGD.toFixed(3)}</td></tr>
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
  