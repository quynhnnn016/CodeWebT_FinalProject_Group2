// js/departureSchedule.js
document.addEventListener("DOMContentLoaded", function () {
  const calendarTitle = document.getElementById("calendarTitle");
  const calendarDays = document.getElementById("calendarDays");
  const monthButtons = document.querySelectorAll(".month-btn");
  const confirmBtn = document.querySelector(".btn-book");

  // --- Available departure days with price (USD) ---
  const availableDates = {
    "12/2025": { 7: 549, 12: 549, 16: 549, 20: 549, 26: 549 },
    "1/2026": { 5: 499, 18: 499, 25: 499 },
    "2/2026": { 10: 529, 22: 529 },
  };

  let currentMonth = "12/2025";
  let selectedDate = null;
  let selectedPrice = null;

  // --- Render Calendar Function ---
  function renderCalendar(monthKey) {
    calendarDays.innerHTML = "";
    calendarTitle.textContent = getMonthName(monthKey);

    const [m, y] = monthKey.split("/");
    const year = parseInt(y);
    const month = parseInt(m) - 1;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    let row = document.createElement("div");
    row.classList.add("row");

    // Fill empty cells before first day
    for (let i = 1; i < (startDay === 0 ? 7 : startDay); i++) {
      const col = document.createElement("div");
      col.classList.add("col");
      row.appendChild(col);
    }

    // Render each day
    for (let d = 1; d <= totalDays; d++) {
      if (row.children.length === 7) {
        calendarDays.appendChild(row);
        row = document.createElement("div");
        row.classList.add("row");
      }

      const col = document.createElement("div");
      col.classList.add("col", "calendar-day");

      const isAvailable = availableDates[monthKey]?.[d] !== undefined;
      const price = availableDates[monthKey]?.[d];

      if (isAvailable) {
        col.classList.add("available");
        col.innerHTML = `<div>${d}</div><small class="text-danger">$${price}</small>`;

        col.addEventListener("click", () => {
          document
            .querySelectorAll(".calendar-day")
            .forEach((el) => el.classList.remove("selected"));
          col.classList.add("selected");
          selectedDate = `${monthKey}-${d}`;
          selectedPrice = price;

          // Save to localStorage for handleBooking.js
          localStorage.setItem(
            "TriplySelectedDeparture",
            JSON.stringify({
              month: monthKey,
              day: d,
              price: price,
            })
          );

          confirmBtn.disabled = false;
        });
      } else {
        col.classList.add("unavailable");
        col.textContent = d;
      }

      row.appendChild(col);
    }
    calendarDays.appendChild(row);

    confirmBtn.disabled = true; // disable until date selected
  }

  // --- Format month name ---
  function getMonthName(monthKey) {
    const [m, y] = monthKey.split("/");
    const date = new Date(parseInt(y), parseInt(m) - 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  // --- Month button change ---
  monthButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      monthButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMonth = btn.dataset.month;
      renderCalendar(currentMonth);
    });
  });

  renderCalendar(currentMonth);
});
