document.addEventListener('DOMContentLoaded', () => 
    {
        // Find the form and the final booking button
        const bookingForm = document.querySelector('.col-lg-7 form'); // Form on the left
        const confirmButton = document.querySelector('.col-lg-5 .btn-book'); // Button on the right (summary box)

        function autoFillUserInfo() {
        const loggedInUsername = localStorage.getItem("TriplyLoggedIn");
        if (!loggedInUsername) {
            return; 
        }

        const users = JSON.parse(localStorage.getItem("TriplyUsers")) || [];
        const currentUser = users.find(user => user.username === loggedInUsername);

        if (currentUser && bookingForm) {
            console.log("Current user data:", currentUser); // Log để kiểm tra

            const fullNameInput = bookingForm.querySelector('input[placeholder="Full Name *"]');
            const phoneInput = bookingForm.querySelector('input[placeholder="Phone Number *"]');
            const emailInput = bookingForm.querySelector('input[placeholder="Email *"]');
            const addressInput = bookingForm.querySelector('input[placeholder="Address"]'); 

            if (fullNameInput && currentUser.firstName && currentUser.lastName) {
                fullNameInput.value = `${currentUser.firstName} ${currentUser.lastName}`; 
            } else if (fullNameInput && currentUser.displayName) {
                 fullNameInput.value = currentUser.displayName; 
            }

            if (phoneInput && currentUser.phone) {
                phoneInput.value = currentUser.phone;
            }
            if (emailInput && currentUser.email) {
                emailInput.value = currentUser.email;
            }
            if (addressInput && currentUser.address) { 
                 addressInput.value = currentUser.address;
            }

            console.log("Form auto-filled.");
        } else {
            console.log("Could not find current user data or booking form for auto-fill.");
        }
    }

    autoFillUserInfo(); 

        function getTourDetails() {
            const summaryBox = document.querySelector('.summary-box');
            if (!summaryBox) return null;

            const tourNameElement = summaryBox.querySelector('h5.fw-bold');
            const tourLocationElement = summaryBox.querySelector('p.text-muted i.fa-map-marker-alt');
            const tourPriceElement = summaryBox.querySelector('.total-box .text-danger');
            const tourImageElement = summaryBox.querySelector('img');

            return {
                name: tourNameElement ? tourNameElement.textContent.trim() : 'Unknown Tour',
                location: tourLocationElement ? tourLocationElement.parentElement.textContent.trim().replace('Location:', '') : 'Unknown Location', // Adjust if needed
                price: tourPriceElement ? tourPriceElement.textContent.trim() : '$0',
                image: tourImageElement ? tourImageElement.getAttribute('src') : ''
            };
        }

        // --- Add event listener to the CONFIRM button ---
        if (confirmButton && bookingForm) {
            confirmButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default button behavior

                // 1. Check if user is logged in
                const loggedInUser = localStorage.getItem("TriplyLoggedIn");
                if (!loggedInUser) {
                    alert("Please log in before booking a tour.");
                    window.location.href = 'login.html'; // Redirect to login
                    return; // Stop processing
                }

                // --- Get Form Data ---
                const fullNameInput = bookingForm.querySelector('input[placeholder="Full Name *"]');
                const phoneInput = bookingForm.querySelector('input[placeholder="Phone Number *"]');
                const emailInput = bookingForm.querySelector('input[placeholder="Email *"]');
                const addressInput = bookingForm.querySelector('input[placeholder="Address"]');
                const passengerDivs = bookingForm.querySelectorAll('.row.g-3.align-items-center .col-md-4');

                let adultsInput = null;
                let childrenInput = null;
                let infantsInput = null;

                // Duyệt qua các div để tìm đúng input dựa vào text của label
                passengerDivs.forEach(div => {
                    const label = div.querySelector('label');
                    const input = div.querySelector('input');
                    if (label && input) {
                        const labelText = label.textContent.trim().toLowerCase();
                        if (labelText.includes('adults')) {
                            adultsInput = input;
                        } else if (labelText.includes('children')) {
                            childrenInput = input;
                        } else if (labelText.includes('infants')) {
                            infantsInput = input;
                        }
                    }
                });

                const notesInput = bookingForm.querySelector('textarea');
                const termsCheckbox = bookingForm.querySelector('#terms');

                // --- Basic Validation ---
                if (!fullNameInput?.value || !phoneInput?.value || !emailInput?.value) {
                    alert('Please fill in all required contact information (*).');
                    return;
                }
                    if (!termsCheckbox?.checked) {
                    alert('Please agree to the Terms & Conditions.');
                    return;
                }

                // --- Get Tour Details ---
                const tourDetails = getTourDetails();
                if (!tourDetails) {
                    alert('Error: Could not retrieve tour details.');
                    return;
                }

                // --- Create Booking Object ---
                const newBooking = {
                    bookingId: 'TRIPLY-' + Date.now() + Math.random().toString(16).substring(2, 8), // Simple unique ID
                    username: loggedInUser,
                    tourName: tourDetails.name,
                    tourLocation: tourDetails.location,
                    tourPrice: tourDetails.price,
                    tourImage: tourDetails.image,
                    numAdults: parseInt(adultsInput?.value || '1', 10),
                    numChildren: parseInt(childrenInput?.value || '0', 10),
                    numInfants: parseInt(infantsInput?.value || '0', 10),
                    contactName: fullNameInput.value.trim(),
                    contactPhone: phoneInput.value.trim(),
                    contactEmail: emailInput.value.trim(),
                    contactAddress: addressInput?.value.trim() || '',
                    notes: notesInput?.value.trim() || '',
                    bookingTimestamp: new Date().toISOString(),
                    status: "Confirmed" // Simulating immediate confirmation
                };

                // --- Save to localStorage ---
                try {
                    let allBookings = JSON.parse(localStorage.getItem('triplyBookings')) || [];
                    allBookings.push(newBooking);
                    localStorage.setItem('triplyBookings', JSON.stringify(allBookings));

                    // --- Redirect to Success Page ---
                    window.location.href = 'booking-success.html';

                } catch (error) {
                    console.error("Error saving booking:", error);
                    alert("An error occurred while saving your booking. Please try again.");
                }
            });
        } else {
            console.error("Booking form or confirm button not found on this page.");
        }
    });