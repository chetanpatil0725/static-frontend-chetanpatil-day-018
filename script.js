/* =================================================
   SMARTPARK
   Smart Parking Solution
   Created by Om Jesur
   ================================================= */


/* ================= PARKING DATA ================= */

const totalParkingSlots = 12;

let parkingSlots = [
    { id: 1, occupied: false },
    { id: 2, occupied: true },
    { id: 3, occupied: false },
    { id: 4, occupied: false },

    { id: 5, occupied: true },
    { id: 6, occupied: false },
    { id: 7, occupied: false },
    { id: 8, occupied: true },

    { id: 9, occupied: false },
    { id: 10, occupied: false },
    { id: 11, occupied: true },
    { id: 12, occupied: false }
];


let selectedSlot = null;

let bookings = [];


/* ================= ELEMENTS ================= */

const parkingGrid =
    document.getElementById("parkingGrid");

const availableSlots =
    document.getElementById("availableSlots");

const occupiedSlots =
    document.getElementById("occupiedSlots");

const totalBookings =
    document.getElementById("totalBookings");

const selectedSlotText =
    document.getElementById("selectedSlot");

const parkingPrice =
    document.getElementById("parkingPrice");

const bookingForm =
    document.getElementById("bookingForm");

const historyBody =
    document.getElementById("historyBody");

const vehicleType =
    document.getElementById("vehicleType");


/* ================= DISPLAY PARKING ================= */

function displayParkingSlots() {

    parkingGrid.innerHTML = "";

    parkingSlots.forEach(slot => {

        const slotElement =
            document.createElement("div");

        slotElement.classList.add("slot");

        if (slot.occupied) {

            slotElement.classList.add("occupied");

            slotElement.innerHTML = `
                <div class="slot-number">
                    P${slot.id}
                </div>

                <div class="slot-status">
                    🔴 Occupied
                </div>
            `;

        } else {

            slotElement.innerHTML = `
                <div class="slot-number">
                    P${slot.id}
                </div>

                <div class="slot-status">
                    🟢 Available
                </div>
            `;

            slotElement.addEventListener(
                "click",
                () => selectParkingSlot(slot.id)
            );
        }

        parkingGrid.appendChild(slotElement);

    });

    updateDashboard();
}


/* ================= SELECT SLOT ================= */

function selectParkingSlot(slotId) {

    selectedSlot = slotId;

    selectedSlotText.textContent =
        "Parking Slot P" + slotId;

    document.querySelectorAll(".slot")
        .forEach(slot => {

            slot.classList.remove("selected");

            const number =
                slot.querySelector(".slot-number");

            if (
                number &&
                number.textContent === "P" + slotId
            ) {
                slot.classList.add("selected");
            }

        });

}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    const available =
        parkingSlots.filter(
            slot => !slot.occupied
        ).length;

    const occupied =
        parkingSlots.filter(
            slot => slot.occupied
        ).length;

    availableSlots.textContent = available;

    occupiedSlots.textContent = occupied;

    totalBookings.textContent =
        bookings.length;
}


/* ================= PARKING PRICE ================= */

vehicleType.addEventListener(
    "change",
    calculatePrice
);


function calculatePrice() {

    const type = vehicleType.value;

    let price = 0;

    if (type === "Bike") {
        price = 20;
    }

    else if (type === "Car") {
        price = 40;
    }

    else if (type === "SUV") {
        price = 60;
    }

    parkingPrice.textContent = price;
}


/* ================= BOOKING ================= */

bookingForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        /* CHECK SLOT */

        if (selectedSlot === null) {

            alert(
                "Please select an available parking slot first."
            );

            return;
        }


        /* GET FORM DATA */

        const vehicleNumber =
            document
            .getElementById("vehicleNumber")
            .value
            .toUpperCase();

        const type =
            vehicleType.value;

        const date =
            document
            .getElementById("bookingDate")
            .value;

        const time =
            document
            .getElementById("bookingTime")
            .value;


        /* CHECK DATA */

        if (
            vehicleNumber === "" ||
            type === "" ||
            date === "" ||
            time === ""
        ) {

            alert(
                "Please fill all the details."
            );

            return;
        }


        /* PRICE */

        let price = 0;

        if (type === "Bike") {
            price = 20;
        }

        else if (type === "Car") {
            price = 40;
        }

        else if (type === "SUV") {
            price = 60;
        }


        /* CREATE BOOKING */

        const booking = {

            vehicle:
                vehicleNumber,

            type:
                type,

            slot:
                "P" + selectedSlot,

            date:
                date,

            time:
                time,

            price:
                price

        };


        bookings.push(booking);


        /* OCCUPY SLOT */

        const slot =
            parkingSlots.find(
                slot => slot.id === selectedSlot
            );

        slot.occupied = true;


        /* SUCCESS */

        alert(
            `Parking booked successfully!\n\n` +
            `Vehicle: ${vehicleNumber}\n` +
            `Slot: P${selectedSlot}\n` +
            `Fee: ₹${price}`
        );


        /* RESET */

        selectedSlot = null;

        selectedSlotText.textContent =
            "No slot selected";

        bookingForm.reset();

        parkingPrice.textContent = "0";


        /* UPDATE UI */

        displayParkingSlots();

        displayHistory();

    }
);


/* ================= HISTORY ================= */

function displayHistory() {

    historyBody.innerHTML = "";


    if (bookings.length === 0) {

        historyBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No bookings yet.
                </td>
            </tr>
        `;

        return;
    }


    bookings.forEach(booking => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${booking.vehicle}
            </td>

            <td>
                ${booking.type}
            </td>

            <td>
                <strong>
                    ${booking.slot}
                </strong>
            </td>

            <td>
                ${booking.date}
            </td>

            <td>
                ${booking.time}
            </td>

            <td>
                ₹${booking.price}
            </td>

        `;

        historyBody.appendChild(row);

    });

}


/* ================= DATE ================= */

const dateInput =
    document.getElementById("bookingDate");

const today =
    new Date()
    .toISOString()
    .split("T")[0];

dateInput.min = today;


/* ================= INITIALIZE ================= */

displayParkingSlots();

displayHistory();

calculatePrice();


/* ================= WELCOME MESSAGE ================= */

console.log(
    "SmartPark - Smart Parking Solution"
);

console.log(
    "Created by Om Jesur"
);
```javascript
/* =================================================
   SMART LOCATION
   ================================================= */

function openLocation(place) {

    const googleMapsURL =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(place);

    window.open(
        googleMapsURL,
        "_blank"
    );
}


/* =================================================
   CURRENT LOCATION
   ================================================= */

function getCurrentLocation() {

    const status =
        document.getElementById("locationStatus");

    if (!navigator.geolocation) {

        status.textContent =
            "Location is not supported by this browser.";

        return;
    }

    status.textContent =
        "📍 Detecting your location...";


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            status.innerHTML =
                "✅ Location detected! " +
                latitude.toFixed(5) +
                ", " +
                longitude.toFixed(5);


            const mapsURL =
                "https://www.google.com/maps/search/?api=1&query=" +
                latitude +
                "," +
                longitude;


            setTimeout(() => {

                window.open(
                    mapsURL,
                    "_blank"
                );

            }, 500);

        },


        function(error) {

            status.textContent =
                "❌ Unable to access location. Please allow location permission.";

        }

    );
}


/* =================================================
   PAYMENT AMOUNT
   ================================================= */

function updatePaymentAmount() {

    const amount =
        document.getElementById("parkingPrice").textContent;

    document.getElementById(
        "paymentAmount"
    ).textContent = amount;
}


/* =================================================
   PHONEPE DEMO PAYMENT
   ================================================= */

function startPhonePePayment() {

    const amount =
        document.getElementById(
            "paymentAmount"
        ).textContent;


    const status =
        document.getElementById(
            "paymentStatus"
        );


    if (
        amount === "0" ||
        amount === ""
    ) {

        alert(
            "Please select vehicle type and parking slot first."
        );

        return;
    }


    status.textContent =
        "⏳ Creating payment request...";


    /*
       DEMO PAYMENT FLOW

       Real PhonePe payment should be
       connected through backend API.
    */


    setTimeout(() => {

        status.textContent =
            "📱 Opening PhonePe payment...";


        /*
          Demo UPI deep-link.

          Replace this with your actual
          payment gateway/backend integration.
        */

        const upiURL =
            "upi://pay?" +
            "pa=yourmerchant@upi" +
            "&pn=SmartPark" +
            "&am=" + amount +
            "&cu=INR";


        window.location.href =
            upiURL;


    }, 1000);
}


/* =================================================
   WATCH PRICE
   ================================================= */

vehicleType.addEventListener(
    "change",
    function() {

        calculatePrice();

        updatePaymentAmount();

    }
);


/* =================================================
   QR SCANNER
   ================================================= */

let qrScanner = null;


function startQRScanner() {

    const result =
        document.getElementById(
            "scanResult"
        );


    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        result.textContent =
            "❌ QR Scanner library not loaded.";

        return;
    }


    if (qrScanner !== null) {

        result.textContent =
            "Scanner is already running.";

        return;
    }


    qrScanner =
        new Html5Qrcode(
            "qr-reader"
        );


    qrScanner.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,
            qrbox: 250
        },


        function(decodedText) {

            result.textContent =
                "✅ QR Scanned: " +
                decodedText;


            /*
              If QR contains a URL,
              open it automatically.
            */

            if (
                decodedText.startsWith(
                    "http"
                )
            ) {

                window.open(
                    decodedText,
                    "_blank"
                );

            }


            qrScanner.stop()
                .then(() => {

                    qrScanner.clear();

                    qrScanner = null;

                });

        },


        function(errorMessage) {

            // Scanner continues silently

        }

    )

    .catch(function(error) {

        result.textContent =
            "❌ Camera permission denied or unavailable.";

        qrScanner = null;

    });

}


/* =================================================
   GENERATE BOOKING QR
   ================================================= */

function generateBookingQR(booking) {

    const qrContainer =
        document.getElementById(
            "bookingQRCode"
        );


    const qrText =
        document.getElementById(
            "qrBookingText"
        );


    qrContainer.innerHTML = "";


    const bookingData =

        "SMARTPARK BOOKING\n" +

        "Vehicle: " +
        booking.vehicle +

        "\nType: " +
        booking.type +

        "\nSlot: " +
        booking.slot +

        "\nDate: " +
        booking.date +

        "\nTime: " +
        booking.time +

        "\nFee: ₹" +
        booking.price;


    new QRCode(
        qrContainer,
        {
            text: bookingData,
            width: 200,
            height: 200
        }
    );


    qrText.textContent =
        "🎫 " +
        booking.slot +
        " • " +
        booking.vehicle;
}


/* =================================================
   DOWNLOAD BOOKING QR
   ================================================= */

function downloadBookingQR() {

    const qrImage =
        document.querySelector(
            "#bookingQRCode img"
        );


    if (!qrImage) {

        alert(
            "Please complete a booking first."
        );

        return;
    }


    const link =
        document.createElement("a");


    link.href =
        qrImage.src;

    link.download =
        "SmartPark-Booking-QR.png";


    link.click();
}
```

