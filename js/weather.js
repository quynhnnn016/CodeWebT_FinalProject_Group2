document.addEventListener("DOMContentLoaded", () => {
    const provinces = [
      { id: "2347719", name: "An Giang" },
      { id: "20070078", name: "Bình Dương" },
      { id: "20070086", name: "Bình Phước" },
      { id: "2347731", name: "Bình Thuận" },
      { id: "2347730", name: "Bình Định" },
      { id: "20070081", name: "Bạc Liêu" },
      { id: "20070087", name: "Bắc Giang" },
      { id: "20070084", name: "Bắc Kạn" },
      { id: "20070088", name: "Bắc Ninh" },
      { id: "2347703", name: "Bến Tre" },
      { id: "2347704", name: "Cao Bằng" },
      { id: "20070082", name: "Cà Mau" },
      { id: "2347732", name: "Cần Thơ" },
      { id: "28301718", name: "Điện Biên" },
      { id: "20070085", name: "Đà Nẵng" },
      { id: "1252375", name: "Đà Lạt" },
      { id: "2347720", name: "Đắk Lắk" },
      { id: "28301719", name: "Đắk Nông" },
      { id: "2347721", name: "Đồng Nai" },
      { id: "2347722", name: "Đồng Tháp" },
      { id: "2347733", name: "Gia Lai" },
      { id: "2347727", name: "Hà Nội" },
      { id: "2347728", name: "TP. Hồ Chí Minh" },
      { id: "2347738", name: "Khánh Hòa" },
      { id: "2347742", name: "Nghệ An" },
      { id: "2347749", name: "Thừa Thiên Huế" },
      { id: "20070090", name: "Vĩnh Phúc" },
    ];
  
    const select = document.getElementById("province_select");
    const result = document.getElementById("weather_result");
  
    // Tải danh sách tỉnh vào dropdown
    provinces.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.text = p.name;
      select.appendChild(opt);
    });
  
    // Hàm tải thời tiết
    function loadWeather(provinceId) {
      if (!provinceId) {
        result.innerHTML = "<p>Please select a province.</p>";
        return;
      }
  
      result.innerHTML = "<div class='text-center py-2'><div class='spinner-border text-light'></div> Loading...</div>";
  
      fetch(
        "https://api.allorigins.win/raw?url=" +
          encodeURIComponent("https://utils3.cnnd.vn/ajax/weatherinfo/" + provinceId + ".htm")
      )
        .then((response) => response.json())
        .then((data) => {
          const info = data.Data.data.datainfo;
          result.innerHTML = `
            <div>
              <h3 style="color:white">${info.location}</h6>
              <img src="${info.shadow_icon}" width="60">
              <p class="mb-1">${info.status}</p>
              <h3 style="color:white">${info.temperature}°C</h3>
              <p>Feels like: ${info.feels_like}°C</p>
              ${
                info.air
                  ? `<p>Air Quality: <b>${info.air.status}</b> (AQI: ${info.air.aqi})</p>`
                  : ""
              }
            </div>
          `;
        })
        .catch(() => {
          result.innerHTML = "<p>Failed to load weather data. Please try again.</p>";
        });
    }
  
    // 🟢 Khi người dùng chọn tỉnh → tự động tải dữ liệu
    select.addEventListener("change", () => {
      const id = select.value;
      loadWeather(id);
    });
  
    // 🟢 Tùy chọn: tự động hiển thị TP.HCM (hoặc Hà Nội) khi mở trang
    const defaultProvince = "2347727"; // TP.HCM
    select.value = defaultProvince;
    loadWeather(defaultProvince);
  });
  